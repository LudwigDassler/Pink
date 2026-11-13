import React, { useMemo } from 'react';

export interface QrCodeSvgProps {
  url?: string;
  size?: number;
  className?: string;
}

interface QrVersionSpec {
  version: number;
  dataCodewords: number;
  ecCodewordsPerBlock: number;
  blocks: number;
  alignmentCenters: number[];
}

// ISO/IEC 18004 ECC Level L specifications (Versions 1-6, up to 134 UTF-8 bytes)
const QR_VERSIONS_L: readonly QrVersionSpec[] = [
  { version: 1, dataCodewords: 19, ecCodewordsPerBlock: 7, blocks: 1, alignmentCenters: [] },
  { version: 2, dataCodewords: 34, ecCodewordsPerBlock: 10, blocks: 1, alignmentCenters: [6, 18] },
  { version: 3, dataCodewords: 55, ecCodewordsPerBlock: 15, blocks: 1, alignmentCenters: [6, 22] },
  { version: 4, dataCodewords: 80, ecCodewordsPerBlock: 20, blocks: 1, alignmentCenters: [6, 26] },
  { version: 5, dataCodewords: 108, ecCodewordsPerBlock: 26, blocks: 1, alignmentCenters: [6, 30] },
  { version: 6, dataCodewords: 136, ecCodewordsPerBlock: 18, blocks: 2, alignmentCenters: [6, 34] },
];

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if ((x & 0x100) !== 0) {
      x ^= 0x11d;
    }
  }
  for (let i = 255; i < 512; i += 1) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function computeReedSolomon(data: Uint8Array, ecCount: number): Uint8Array {
  let gen = [1];
  for (let i = 0; i < ecCount; i += 1) {
    const next = new Array<number>(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j += 1) {
      next[j] ^= gen[j];
      next[j + 1] ^= gfMul(gen[j], GF_EXP[i]);
    }
    gen = next;
  }

  const rem = new Uint8Array(ecCount);
  for (let i = 0; i < data.length; i += 1) {
    const factor = data[i] ^ rem[0];
    rem.copyWithin(0, 1);
    rem[ecCount - 1] = 0;
    if (factor !== 0) {
      for (let j = 0; j < ecCount; j += 1) {
        rem[j] ^= gfMul(gen[j + 1], factor);
      }
    }
  }
  return rem;
}

function writeFormatBits(matrix: boolean[][], size: number, mask: number): void {
  // ECC Level L = 0b01
  const formatData = (0b01 << 3) | mask;
  let rem = formatData << 10;
  for (let i = 14; i >= 10; i -= 1) {
    if (((rem >> i) & 1) !== 0) {
      rem ^= 0x537 << (i - 10);
    }
  }
  const bits = ((formatData << 10) | rem) ^ 0x5412;
  const bit = (idx: number): boolean => ((bits >> idx) & 1) === 1;

  // Top-left copy
  const tlRows = [8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 4, 3, 2, 1, 0];
  const tlCols = [0, 1, 2, 3, 4, 5, 7, 8, 8, 8, 8, 8, 8, 8, 8];
  for (let i = 0; i < 15; i += 1) {
    matrix[tlRows[i]][tlCols[i]] = bit(14 - i);
  }

  // Bottom-left + Top-right split copy
  for (let i = 0; i < 7; i += 1) {
    matrix[size - 1 - i][8] = bit(14 - i);
  }
  for (let i = 0; i < 8; i += 1) {
    matrix[8][size - 8 + i] = bit(7 - i);
  }
}

function maskCondition(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    default:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
  }
}

function scorePenalty(matrix: boolean[][]): number {
  const n = matrix.length;
  let penalty = 0;

  for (let r = 0; r < n; r += 1) {
    let runLen = 1;
    for (let c = 1; c < n; c += 1) {
      if (matrix[r][c] === matrix[r][c - 1]) {
        runLen += 1;
        if (runLen === 5) penalty += 3;
        else if (runLen > 5) penalty += 1;
      } else {
        runLen = 1;
      }
    }
  }

  for (let c = 0; c < n; c += 1) {
    let runLen = 1;
    for (let r = 1; r < n; r += 1) {
      if (matrix[r][c] === matrix[r - 1][c]) {
        runLen += 1;
        if (runLen === 5) penalty += 3;
        else if (runLen > 5) penalty += 1;
      } else {
        runLen = 1;
      }
    }
  }

  for (let r = 0; r < n - 1; r += 1) {
    for (let c = 0; c < n - 1; c += 1) {
      const v = matrix[r][c];
      if (v === matrix[r][c + 1] && v === matrix[r + 1][c] && v === matrix[r + 1][c + 1]) {
        penalty += 3;
      }
    }
  }

  return penalty;
}

export function generateQrMatrix(text: string): boolean[][] {
  const payload = new TextEncoder().encode(text);
  // Byte mode overhead: 4-bit mode + 8-bit length = 12 bits -> max dataCodewords - 2 bytes
  const spec =
    QR_VERSIONS_L.find((s) => payload.length <= s.dataCodewords - 2) ??
    QR_VERSIONS_L[QR_VERSIONS_L.length - 1];

  const safePayload =
    payload.length <= spec.dataCodewords - 2
      ? payload
      : payload.slice(0, spec.dataCodewords - 2);

  const bits: number[] = [];
  const pushBits = (val: number, len: number): void => {
    for (let i = len - 1; i >= 0; i -= 1) {
      bits.push((val >> i) & 1);
    }
  };

  // Byte mode = 0100
  pushBits(0b0100, 4);
  pushBits(safePayload.length, 8);
  for (const byte of safePayload) {
    pushBits(byte, 8);
  }

  const maxDataBits = spec.dataCodewords * 8;
  const terminatorLen = Math.min(4, maxDataBits - bits.length);
  pushBits(0, terminatorLen);
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const dataBytes = new Uint8Array(spec.dataCodewords);
  for (let i = 0; i < bits.length / 8; i += 1) {
    let b = 0;
    for (let j = 0; j < 8; j += 1) {
      b = (b << 1) | bits[i * 8 + j];
    }
    dataBytes[i] = b;
  }

  const padBytes = [0xec, 0x11];
  for (let i = bits.length / 8, p = 0; i < spec.dataCodewords; i += 1, p += 1) {
    dataBytes[i] = padBytes[p % 2];
  }

  // Split into blocks & interleave (1 block for V1-V5, 2 equal blocks for V6)
  const blockLen = spec.dataCodewords / spec.blocks;
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  for (let b = 0; b < spec.blocks; b += 1) {
    const slice = dataBytes.slice(b * blockLen, (b + 1) * blockLen);
    dataBlocks.push(slice);
    ecBlocks.push(computeReedSolomon(slice, spec.ecCodewordsPerBlock));
  }

  const allCodewords: number[] = [];
  for (let i = 0; i < blockLen; i += 1) {
    for (let b = 0; b < spec.blocks; b += 1) {
      allCodewords.push(dataBlocks[b][i]);
    }
  }
  for (let i = 0; i < spec.ecCodewordsPerBlock; i += 1) {
    for (let b = 0; b < spec.blocks; b += 1) {
      allCodewords.push(ecBlocks[b][i]);
    }
  }

  const codewordBits: boolean[] = [];
  for (const cw of allCodewords) {
    for (let i = 7; i >= 0; i -= 1) {
      codewordBits.push(((cw >> i) & 1) === 1);
    }
  }

  const size = 17 + spec.version * 4;
  const baseMatrix: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );
  const isFunc: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );

  const setFunctionModule = (r: number, c: number, dark: boolean): void => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      baseMatrix[r][c] = dark;
      isFunc[r][c] = true;
    }
  };

  // Finder patterns + 1-module white separators
  const placeFinder = (top: number, left: number): void => {
    for (let dr = -1; dr <= 7; dr += 1) {
      for (let dc = -1; dc <= 7; dc += 1) {
        const dist = Math.max(Math.abs(dr - 3), Math.abs(dc - 3));
        const dark = dist <= 1 || dist === 3;
        setFunctionModule(top + dr, left + dc, dark);
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment patterns
  for (const cr of spec.alignmentCenters) {
    for (const cc of spec.alignmentCenters) {
      if (isFunc[cr][cc]) continue;
      for (let dr = -2; dr <= 2; dr += 1) {
        for (let dc = -2; dc <= 2; dc += 1) {
          const dist = Math.max(Math.abs(dr), Math.abs(dc));
          setFunctionModule(cr + dr, cc + dc, dist === 0 || dist === 2);
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i += 1) {
    if (!isFunc[6][i]) setFunctionModule(6, i, i % 2 === 0);
    if (!isFunc[i][6]) setFunctionModule(i, 6, i % 2 === 0);
  }

  // Dark module + reserved format info slots
  setFunctionModule(size - 8, 8, true);
  for (let i = 0; i < 9; i += 1) {
    if (!isFunc[8][i]) setFunctionModule(8, i, false);
    if (!isFunc[i][8]) setFunctionModule(i, 8, false);
  }
  for (let i = 0; i < 8; i += 1) {
    if (!isFunc[8][size - 8 + i]) setFunctionModule(8, size - 8 + i, false);
    if (i < 7 && !isFunc[size - 1 - i][8]) setFunctionModule(size - 1 - i, 8, false);
  }

  // Zigzag placement
  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    for (let step = 0; step < size; step += 1) {
      const r = upward ? size - 1 - step : step;
      for (let dc = 0; dc <= 1; dc += 1) {
        const c = col - dc;
        if (!isFunc[r][c]) {
          baseMatrix[r][c] = bitIdx < codewordBits.length ? codewordBits[bitIdx] : false;
          bitIdx += 1;
        }
      }
    }
    upward = !upward;
  }

  // Select optimal mask pattern (0..7)
  let bestMatrix = baseMatrix;
  let bestPenalty = Number.POSITIVE_INFINITY;

  for (let mask = 0; mask < 8; mask += 1) {
    const candidate = baseMatrix.map((row, r) =>
      row.map((val, c) => (!isFunc[r][c] && maskCondition(mask, r, c) ? !val : val)),
    );
    writeFormatBits(candidate, size, mask);
    const penalty = scorePenalty(candidate);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMatrix = candidate;
    }
  }

  return bestMatrix;
}

export function QrCodeSvg({
  url = 'https://t.me/+79810388903',
  size = 164,
  className = '',
}: QrCodeSvgProps): React.JSX.Element {
  const safeUrl = url.trim() || 'https://t.me/+79810388903';
  const matrix = useMemo(() => generateQrMatrix(safeUrl), [safeUrl]);
  const quietZone = 3;
  const totalModules = matrix.length + quietZone * 2;

  const pathData = useMemo(() => {
    const commands: string[] = [];
    for (let r = 0; r < matrix.length; r += 1) {
      for (let c = 0; c < matrix[r].length; c += 1) {
        if (matrix[r][c]) {
          commands.push(`M${c + quietZone} ${r + quietZone}h1v1h-1z`);
        }
      }
    }
    return commands.join('');
  }, [matrix]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${totalModules} ${totalModules}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR-код для перехода: ${safeUrl}`}
      className={className}
    >
      <rect width={totalModules} height={totalModules} fill="#FFFFFF" rx="1.5" />
      <path d={pathData} fill="#0F172A" />
    </svg>
  );
}
