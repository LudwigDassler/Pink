import type {
  CategoryItem,
  SelectedPosition,
  SiteConfig,
} from '../config/siteConfig';

export const REQUEST_DRAFT_STORAGE_KEY = 'b2b_request_draft_v1';

const EMPTY_LIST_PLACEHOLDER = '- [укажите позиции и примерное количество]';
const TEMPLATE_GREETING_MULTI =
  'Здравствуйте! Предлагаем рассмотреть выкуп следующих позиций:';
const TEMPLATE_GREETING_EMPTY =
  'Здравствуйте! Предлагаем рассмотреть выкуп неликвидов / оборудования:';
const TEMPLATE_CLOSING = 'Просим связаться для согласования деталей.';
const EXTRA_PREFIX = 'Дополнительно:';

export function copyTextFallbackSync(text: string): boolean {
  if (typeof document === 'undefined' || !document.body) {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return copyTextFallbackSync(text);
    }
  }
  return copyTextFallbackSync(text);
}

export function buildMessengerShareUrl(baseUrl: string, text: string): string {
  const cleanBase = baseUrl.trim();
  const separator = cleanBase.includes('?') ? '&' : '?';
  return `${cleanBase}${separator}text=${encodeURIComponent(text)}`;
}

export function dispatchToMessenger(params: {
  baseUrl: string;
  text: string;
  toastMessage: string;
  showToast: (message: string) => void;
}): void {
  const { baseUrl, text, toastMessage, showToast } = params;
  const finalText = text.trim();
  const targetUrl = buildMessengerShareUrl(baseUrl, finalText);

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(finalText).catch(() => {
      copyTextFallbackSync(finalText);
    });
  } else {
    copyTextFallbackSync(finalText);
  }

  showToast(toastMessage);

  if (typeof window !== 'undefined') {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
}

export function normalizeQuickChipPhrase(chip: string): string {
  return chip.replace(/^\+\s*/, '').trim();
}

export function extractActiveQuickChips(
  text: string,
  quickChips: readonly string[]
): string[] {
  return quickChips
    .map(normalizeQuickChipPhrase)
    .filter((phrase) => isQuickChipPresentInText(text, phrase));
}

export function isQuickChipPresentInText(text: string, chip: string): boolean {
  const phrase = normalizeQuickChipPhrase(chip).toLowerCase();
  if (!phrase) {
    return false;
  }

  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.toLowerCase().startsWith(EXTRA_PREFIX.toLowerCase())) {
      const rest = trimmed
        .slice(EXTRA_PREFIX.length)
        .replace(/\.$/, '')
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
      if (rest.includes(phrase)) {
        return true;
      }
    }
    const strippedBullet = trimmed.replace(/^[-•*+]\s*/, '').replace(/\.$/, '');
    if (strippedBullet.toLowerCase() === phrase) {
      return true;
    }
  }
  return false;
}

export function toggleQuickChipInText(text: string, chip: string): string {
  const phrase = normalizeQuickChipPhrase(chip);
  if (!phrase) {
    return text;
  }

  const lines = text.split(/\r?\n/);
  const extraLineIndex = lines.findIndex((line) =>
    line.trim().toLowerCase().startsWith(EXTRA_PREFIX.toLowerCase())
  );

  if (extraLineIndex !== -1) {
    const currentItems = lines[extraLineIndex]
      .trim()
      .slice(EXTRA_PREFIX.length)
      .replace(/\.$/, '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const exists = currentItems.some(
      (item) => item.toLowerCase() === phrase.toLowerCase()
    );

    const nextItems = exists
      ? currentItems.filter(
          (item) => item.toLowerCase() !== phrase.toLowerCase()
        )
      : [...currentItems, phrase];

    if (nextItems.length === 0) {
      const updated = [...lines];
      updated.splice(extraLineIndex, 1);
      return collapseBlankLines(updated.join('\n'));
    }

    const updated = [...lines];
    updated[extraLineIndex] = `${EXTRA_PREFIX} ${nextItems.join(', ')}.`;
    return collapseBlankLines(updated.join('\n'));
  }

  // Also check if user had it as a standalone bullet line
  const standaloneIndex = lines.findIndex((line) => {
    const stripped = line
      .trim()
      .replace(/^[-•*+]\s*/, '')
      .replace(/\.$/, '');
    return stripped.toLowerCase() === phrase.toLowerCase();
  });

  if (standaloneIndex !== -1) {
    const updated = [...lines];
    updated.splice(standaloneIndex, 1);
    return collapseBlankLines(updated.join('\n'));
  }

  const newExtraLine = `${EXTRA_PREFIX} ${phrase}.`;
  const closingIndex = lines.findIndex(
    (line) => line.trim() === TEMPLATE_CLOSING
  );

  if (closingIndex !== -1) {
    const updated = [...lines];
    const needsLeadingBlank =
      closingIndex > 0 && updated[closingIndex - 1].trim() !== '';
    if (needsLeadingBlank) {
      updated.splice(closingIndex, 0, '', newExtraLine);
    } else {
      updated.splice(closingIndex, 0, newExtraLine);
    }
    return collapseBlankLines(updated.join('\n'));
  }

  const base = text.trimEnd();
  return base ? `${base}\n\n${newExtraLine}` : newExtraLine;
}

export function buildRequestTemplate(
  config: SiteConfig,
  selectedPositions: readonly SelectedPosition[],
  activeQuickChips: readonly string[] = []
): string {
  const categoryMap = new Map<string, CategoryItem>(
    config.categories.map((cat) => [cat.id, cat])
  );

  const lines: string[] = [];

  if (selectedPositions.length === 0) {
    lines.push(TEMPLATE_GREETING_EMPTY);
    lines.push(EMPTY_LIST_PLACEHOLDER);
  } else {
    lines.push(TEMPLATE_GREETING_MULTI);
    selectedPositions.forEach((pos, idx) => {
      const cat = categoryMap.get(pos.categoryId);
      const header = cat
        ? `[${cat.code}] ${cat.title}`
        : `Категория ${pos.categoryId}`;
      const cleanNote = pos.note.trim();
      lines.push(
        cleanNote
          ? `${idx + 1}. ${header} — ${cleanNote}`
          : `${idx + 1}. ${header}`
      );
    });
  }

  lines.push('');

  const cleanChips = activeQuickChips
    .map(normalizeQuickChipPhrase)
    .filter(Boolean);
  if (cleanChips.length > 0) {
    lines.push(`${EXTRA_PREFIX} ${cleanChips.join(', ')}.`);
  }

  lines.push(TEMPLATE_CLOSING);
  return lines.join('\n');
}

export function buildSinglePositionText(
  category: CategoryItem,
  note: string
): string {
  const cleanNote = note.trim();
  const suffix = cleanNote ? ` — ${cleanNote}` : '';
  return [
    'Здравствуйте! Предлагаем рассмотреть позицию:',
    `- [${category.code}] ${category.title}${suffix}`,
    '',
    TEMPLATE_CLOSING,
  ].join('\n');
}

export function parseClipboardTableToLines(rawText: string): string[] {
  if (!rawText.trim()) {
    return [];
  }

  const rawLines = rawText.split(/\r?\n/);
  const result: string[] = [];

  for (const rawLine of rawLines) {
    if (!rawLine.trim()) {
      continue;
    }

    if (rawLine.includes('\t')) {
      const cells = rawLine
        .split('\t')
        .map((cell) => cell.trim())
        .filter(Boolean);
      if (cells.length === 1) {
        result.push(`- ${cells[0].replace(/^[-•*]\s*/, '')}`);
      } else if (cells.length >= 2) {
        result.push(`- ${cells.join(' — ')}`);
      }
    } else {
      const cleaned = rawLine.trim().replace(/^[-•*]\s*/, '');
      if (cleaned) {
        result.push(`- ${cleaned}`);
      }
    }
  }

  return result;
}

export function appendLinesToRequestText(
  currentText: string,
  formattedLines: readonly string[]
): string {
  if (formattedLines.length === 0) {
    return currentText;
  }

  const block = formattedLines.join('\n');

  if (currentText.includes(EMPTY_LIST_PLACEHOLDER)) {
    return currentText.replace(EMPTY_LIST_PLACEHOLDER, block);
  }

  const lines = currentText.split(/\r?\n/);
  const footerStartIndex = lines.findIndex((line) => {
    const trimmed = line.trim();
    return (
      trimmed.toLowerCase().startsWith(EXTRA_PREFIX.toLowerCase()) ||
      trimmed === TEMPLATE_CLOSING
    );
  });

  if (footerStartIndex !== -1) {
    const updated = [...lines];
    let insertAt = footerStartIndex;
    if (insertAt > 0 && updated[insertAt - 1].trim() === '') {
      insertAt -= 1;
    }
    updated.splice(insertAt, 0, block);
    return collapseBlankLines(updated.join('\n'));
  }

  const trimmedCurrent = currentText.trimEnd();
  return trimmedCurrent ? `${trimmedCurrent}\n${block}` : block;
}

export function syncCustomDraftWithPositions(params: {
  currentDraft: string;
  config: SiteConfig;
  prevPositions: readonly SelectedPosition[];
  nextPositions: readonly SelectedPosition[];
}): string {
  const { currentDraft, config, prevPositions, nextPositions } = params;
  const categoryMap = new Map<string, CategoryItem>(
    config.categories.map((cat) => [cat.id, cat])
  );
  const prevMap = new Map<string, string>(
    prevPositions.map((pos) => [pos.categoryId, pos.note])
  );
  const nextMap = new Map<string, string>(
    nextPositions.map((pos) => [pos.categoryId, pos.note])
  );

  let working = currentDraft;

  // 1. Remove lines for deselected categories
  for (const prev of prevPositions) {
    if (!nextMap.has(prev.categoryId)) {
      const cat = categoryMap.get(prev.categoryId);
      if (cat) {
        const marker = `[${cat.code}]`;
        const filtered = working
          .split(/\r?\n/)
          .filter((line) => !line.includes(marker));
        working = collapseBlankLines(filtered.join('\n'));
      }
    }
  }

  // 2. Update modified notes or append newly added categories
  const toAppend: string[] = [];
  for (const next of nextPositions) {
    const cat = categoryMap.get(next.categoryId);
    if (!cat) {
      continue;
    }
    const marker = `[${cat.code}]`;
    const cleanNote = next.note.trim();
    const formattedBullet = cleanNote
      ? `- [${cat.code}] ${cat.title} — ${cleanNote}`
      : `- [${cat.code}] ${cat.title}`;

    if (!prevMap.has(next.categoryId)) {
      if (!working.includes(marker)) {
        toAppend.push(formattedBullet);
      }
    } else if (prevMap.get(next.categoryId) !== next.note) {
      const lines = working.split(/\r?\n/);
      const lineIdx = lines.findIndex((line) => line.includes(marker));
      if (lineIdx !== -1) {
        const prefixMatch = lines[lineIdx].match(/^(\d+\.\s+|-\s+|•\s+)/);
        const prefix = prefixMatch ? prefixMatch[1] : '- ';
        lines[lineIdx] = cleanNote
          ? `${prefix}[${cat.code}] ${cat.title} — ${cleanNote}`
          : `${prefix}[${cat.code}] ${cat.title}`;
        working = lines.join('\n');
      } else {
        toAppend.push(formattedBullet);
      }
    }
  }

  if (toAppend.length > 0) {
    working = appendLinesToRequestText(working, toAppend);
  }

  return working;
}

export function hasConditionInNote(note: string, chip: string): boolean {
  const target = chip.trim().toLowerCase();
  if (!target) {
    return false;
  }
  return note
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .some((part) => part === target);
}

export function toggleConditionInNote(note: string, chip: string): string {
  const cleanChip = chip.trim();
  if (!cleanChip) {
    return note;
  }

  const parts = note
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const exists = parts.some(
    (part) => part.toLowerCase() === cleanChip.toLowerCase()
  );

  if (exists) {
    return parts
      .filter((part) => part.toLowerCase() !== cleanChip.toLowerCase())
      .join(', ');
  }

  const trimmed = note.trim().replace(/[,;\s]+$/, '');
  return trimmed ? `${trimmed}, ${cleanChip}` : cleanChip;
}

function collapseBlankLines(input: string): string {
  return input.replace(/\n{3,}/g, '\n\n').trim();
}
