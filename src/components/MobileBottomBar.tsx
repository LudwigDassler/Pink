import React from 'react';
import { Phone, Send } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';

export interface MobileBottomBarProps {
  config: SiteConfig;
}

export function MobileBottomBar({
  config,
}: MobileBottomBarProps): React.JSX.Element {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E8F0] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] print:hidden">
      <div className="grid grid-cols-2 gap-2.5 max-w-lg mx-auto">
        <a
          href={config.phoneTel}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] active:bg-[#F1F5F9] text-[#0F172A] font-bold text-xs sm:text-sm py-2.5 px-3 tabular-nums whitespace-nowrap"
        >
          <Phone className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span className="tabular-nums whitespace-nowrap">
            Позвонить {config.schedule}
          </span>
        </a>

        <a
          href={config.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] active:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm py-2.5 px-3 whitespace-nowrap shadow-xs"
        >
          <Send className="w-4 h-4 shrink-0" />
          <span>Telegram</span>
        </a>
      </div>
    </div>
  );
}
