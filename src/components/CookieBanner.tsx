import { useState } from 'react';
import type * as React from 'react';
import { ShieldCheck } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'b2b_cookie_consent_v1';

function readInitialConsent(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === '1';
  } catch {
    return false;
  }
}

export function CookieBanner({
  onOpenLegal,
}: {
  onOpenLegal: () => void;
}): React.JSX.Element | null {
  const [isDismissed, setIsDismissed] = useState<boolean>(readInitialConsent);

  if (isDismissed) {
    return null;
  }

  const handleAccept = (): void => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, '1');
    } catch {
      // Ignore storage write errors in restricted browsing modes
    }
    setIsDismissed(true);
  };

  return (
    <aside
      aria-label="Уведомление об использовании локального хранилища браузера"
      className="fixed left-3 right-3 bottom-20 md:left-6 md:right-auto md:bottom-4 md:max-w-md z-40 print:hidden bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 shadow-lg shadow-slate-900/5"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Сайт использует локальное хранилище браузера (<span className="font-semibold text-[#0F172A]">localStorage</span>) только для сохранения черновика вашего запроса без передачи анкетных данных на сервер.{' '}
            <button
              type="button"
              onClick={onOpenLegal}
              className="font-semibold text-[#2563EB] hover:underline focus:outline-none"
            >
              Правовая информация
            </button>
          </p>
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] hover:bg-blue-700 px-4 py-1.5 min-h-9 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
