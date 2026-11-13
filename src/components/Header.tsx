import React from 'react';
import { Copy, Phone } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';

export type TabId = 'main' | 'terms' | 'contacts' | 'legal';

export interface HeaderProps {
  config: SiteConfig;
  activeTab: TabId;
  selectedCount: number;
  onNavigateTab: (tab: TabId) => void;
  showToast: (message: string) => void;
}

const NAV_TABS: readonly { id: TabId; label: string }[] = [
  { id: 'main', label: 'Главная и каталог' },
  { id: 'terms', label: 'Условия и памятка' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'legal', label: 'Правовая информация' },
];

export async function copyTextSafe(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function Header({
  config,
  activeTab,
  selectedCount,
  onNavigateTab,
  showToast,
}: HeaderProps): React.JSX.Element {
  const handleCopyPhone = async (): Promise<void> => {
    await copyTextSafe(config.phoneDisplay);
    showToast('Номер скопирован');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top row */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Technical mark + static 24/7 plate */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a
              href="#main"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTab('main');
              }}
              className="flex items-center gap-2 text-[#0F172A] hover:text-[#2563EB] transition-colors min-w-0"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                  aria-hidden="true"
                >
                  <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
                  <polyline points="4,7.5 12,12 20,7.5" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                </svg>
              </span>
              <span className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight truncate">
                <span className="hidden min-[360px]:inline">Отдел закупки</span>
                <span className="min-[360px]:hidden">Закупка</span>
              </span>
            </a>

            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#16A34A]/30 bg-[#16A34A]/10 text-[11px] sm:text-xs font-bold text-[#15803D] tabular-nums whitespace-nowrap shrink-0"
              title="Прием и оценка заявок круглосуточно"
            >
              <span className="h-2 w-2 rounded-[2px] bg-[#16A34A] shrink-0" />
              <span>{config.schedule}</span>
            </span>
          </div>

          {/* Center: Desktop inline tabs */}
          <nav
            aria-label="Основная навигация"
            className="hidden md:flex items-center gap-1 lg:gap-1.5"
          >
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTab(tab.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'main' && selectedCount > 0 && (
                    <span className="inline-flex items-center justify-center rounded-md bg-[#2563EB] text-white text-[11px] font-bold px-1.5 min-w-[1.25rem] h-5 tabular-nums">
                      {selectedCount}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Phone + Copy icon button */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <a
              href={config.phoneTel}
              className="inline-flex items-center gap-1.5 text-[13px] sm:text-sm lg:text-base font-extrabold text-[#0F172A] hover:text-[#2563EB] transition-colors tabular-nums whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#2563EB] hidden sm:inline shrink-0" />
              <span className="tabular-nums whitespace-nowrap">{config.phoneDisplay}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyPhone}
              aria-label="Скопировать номер телефона"
              title="Скопировать номер"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-[#EFF6FF] hover:border-[#2563EB]/30 text-slate-600 hover:text-[#2563EB] flex items-center justify-center transition-colors shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Second row: Mobile horizontal scrollable 4-tab ribbon */}
      <div className="md:hidden border-t border-slate-200/80 bg-white">
        <nav
          aria-label="Мобильная навигация"
          className="max-w-6xl mx-auto flex items-center gap-1.5 px-4 sm:px-6 py-1.5 overflow-x-auto no-scrollbar"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTab(tab.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'main' && selectedCount > 0 && (
                  <span
                    className={`inline-flex items-center justify-center rounded-md text-[11px] font-bold px-1.5 min-w-[1.15rem] h-4 tabular-nums ${
                      isActive
                        ? 'bg-white text-[#2563EB]'
                        : 'bg-[#2563EB] text-white'
                    }`}
                  >
                    {selectedCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
