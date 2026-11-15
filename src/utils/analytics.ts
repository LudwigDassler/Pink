export type MetrikaGoal =
  | 'click_phone'
  | 'click_max'
  | 'click_whatsapp'
  | 'copy_phone'
  | 'copy_request';

interface YaMetrikaCounterEntry {
  id?: number | string;
}

interface YMFunction {
  (counterId: number, method: string, ...args: unknown[]): void;
  a?: unknown[][];
  l?: number;
}

declare global {
  interface Window {
    ym?: YMFunction;
    Ya?: {
      _metrika?: {
        counters?:
          | Record<string, YaMetrikaCounterEntry>
          | (() => YaMetrikaCounterEntry[]);
        getCounters?: () => YaMetrikaCounterEntry[];
      };
    };
  }
}

let activeMetrikaId: number | null = null;
const initializedCounterIds = new Set<number>();

function parseCounterId(raw?: string | number | null): number | null {
  if (raw === undefined || raw === null) {
    return null;
  }
  const trimmed = String(raw).trim();
  if (!/^\d{4,15}$/.test(trimmed)) {
    return null;
  }
  const numeric = Number(trimmed);
  return Number.isSafeInteger(numeric) && numeric > 0 ? numeric : null;
}

function detectDomCounterId(): number | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const metrika = window.Ya?._metrika;
    if (!metrika) {
      return null;
    }

    if (typeof metrika.getCounters === 'function') {
      const list = metrika.getCounters();
      if (Array.isArray(list) && list.length > 0) {
        const firstId = parseCounterId(list[0]?.id);
        if (firstId !== null) {
          return firstId;
        }
      }
    }

    const rawCounters = metrika.counters;
    if (typeof rawCounters === 'function') {
      const list = rawCounters();
      if (Array.isArray(list) && list.length > 0) {
        const firstId = parseCounterId(list[0]?.id);
        if (firstId !== null) {
          return firstId;
        }
      }
    } else if (rawCounters && typeof rawCounters === 'object') {
      for (const [key, entry] of Object.entries(rawCounters)) {
        const entryId = parseCounterId(entry?.id);
        if (entryId !== null) {
          return entryId;
        }
        const keyPrefix = key.split(':')[0];
        const keyId = parseCounterId(keyPrefix);
        if (keyId !== null) {
          return keyId;
        }
      }
    }
  } catch {
    // Ignore analytics detection errors
  }
  return null;
}

function ensureMetrikaBootstrap(counterId: number): void {
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (typeof window.ym !== 'function') {
      const ymQueue: YMFunction = (...args: unknown[]) => {
        (ymQueue.a = ymQueue.a ?? []).push(args);
      };
      ymQueue.l = Date.now();
      window.ym = ymQueue;

      const existingScript = document.querySelector(
        'script[src*="mc.yandex.ru/metrika/tag.js"]',
      );
      if (!existingScript && document.head) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js';
        document.head.appendChild(script);
      }
    }

    if (!initializedCounterIds.has(counterId)) {
      initializedCounterIds.add(counterId);
      window.ym(counterId, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      });
    }
  } catch {
    // Never throw from analytics bootstrap
  }
}

export function setActiveMetrikaId(id: string): void {
  const parsed = parseCounterId(id);
  activeMetrikaId = parsed;
  if (parsed !== null) {
    ensureMetrikaBootstrap(parsed);
  }
}

export function trackGoal(goal: MetrikaGoal, explicitId?: string): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    const counterId =
      parseCounterId(explicitId) ?? activeMetrikaId ?? detectDomCounterId();
    if (counterId === null || typeof window.ym !== 'function') {
      return;
    }
    window.ym(counterId, 'reachGoal', goal);
  } catch {
    // Never throw from goal tracking
  }
}
