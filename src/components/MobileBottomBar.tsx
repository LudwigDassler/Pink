import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';

export interface MobileBottomBarProps {
  config: SiteConfig;
}

export function MobileBottomBar({
  config,
}: MobileBottomBarProps): React.JSX.Element {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] print:hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-2.5">
        <a
          href={config.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] active:bg-[#1D4ED8] px-4 text-sm font-bold text-white whitespace-nowrap shadow-xs transition-colors"
        >
          <Send className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
          <span>Telegram</span>
        </a>

        <a
          href={config.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#16A34A] active:bg-[#15803D] px-4 text-sm font-bold text-white whitespace-nowrap shadow-xs transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
