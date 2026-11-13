import React, { useEffect, useRef } from 'react';
import type { SiteConfig } from '../config/siteConfig';
import type { TabId } from './Header';

export interface FooterProps {
  config: SiteConfig;
  activeTab: TabId;
  onNavigateTab: (tab: TabId) => void;
  onActivateEditMode: () => void;
}

const FOOTER_LINKS: readonly { id: TabId; label: string }[] = [
  { id: 'main', label: 'Главная и каталог' },
  { id: 'terms', label: 'Условия и памятка' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'legal', label: 'Правовая информация' },
];

export function Footer({
  config,
  activeTab,
  onNavigateTab,
  onActivateEditMode,
}: FooterProps): React.JSX.Element {
  const clickTimestampsRef = useRef<number[]>([]);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopyrightClick = (): void => {
    const now = Date.now();
    const recent = clickTimestampsRef.current.filter((t) => now - t <= 2000);
    recent.push(now);
    clickTimestampsRef.current = recent;

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    if (recent.length >= 5) {
      clickTimestampsRef.current = [];
      resetTimerRef.current = null;
      onActivateEditMode();
      return;
    }

    resetTimerRef.current = window.setTimeout(() => {
      clickTimestampsRef.current = [];
      resetTimerRef.current = null;
    }, 2000);
  };

  return (
    <footer className="border-t border-slate-200 bg-white pb-28 md:pb-8 pt-8 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-100">
          <div className="max-w-xl">
            <p className="text-sm font-bold text-[#0F172A] break-words">
              {config.politeClosing}
            </p>
            <p className="mt-1 text-xs text-slate-500 tabular-nums break-words">
              {config.guaranteeText} ·{' '}
              <a
                href={config.phoneTel}
                className="font-semibold text-[#0F172A] hover:text-[#2563EB] tabular-nums whitespace-nowrap"
              >
                {config.phoneDisplay}
              </a>
            </p>
          </div>

          <nav
            aria-label="Навигация в подвале"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {FOOTER_LINKS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTab(item.id);
                  }}
                  className={`text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#2563EB]'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Информационный запрос отдела закупки промышленного оборудования и материалов. Не является публичной офертой.
          </span>
          <span
            onClick={handleCopyrightClick}
            className="tabular-nums select-none whitespace-nowrap text-slate-500"
          >
            © 2026 Отдел закупки
          </span>
        </div>
      </div>
    </footer>
  );
}
