import React from 'react';
import type { SiteConfig } from '../config/siteConfig';
import { trackGoal } from '../utils/analytics';
import { MaxIcon, WhatsAppIcon } from './MessengerIcons';

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
          href={config.maxUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGoal('click_max')}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] active:bg-[#1D4ED8] px-4 text-sm font-bold text-white whitespace-nowrap shadow-xs transition-colors"
        >
          <MaxIcon className="w-5 h-5 text-white shrink-0" />
          <span>MAX</span>
        </a>

        <a
          href={config.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGoal('click_whatsapp')}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#16A34A] active:bg-[#15803D] px-4 text-sm font-bold text-white whitespace-nowrap shadow-xs transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
