import React from 'react';
import { ArrowDown, MessageSquare } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';

export interface HeroSectionProps {
  config: SiteConfig;
  onScrollToCatalog: () => void;
  onOpenContacts: () => void;
}

export function HeroSection({
  config,
  onScrollToCatalog,
  onOpenContacts,
}: HeroSectionProps): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
      <div
        className="hero-blueprint-grid pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />

      <div className="relative">
        <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold tracking-tight text-[#0F172A] leading-[1.22] break-words max-w-4xl">
          {config.heroTitle}
        </h1>

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={onScrollToCatalog}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm px-5 shadow-xs transition-colors whitespace-nowrap"
          >
            <span>Перейти к перечню категорий</span>
            <ArrowDown className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={onOpenContacts}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 font-semibold text-sm px-5 transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>Контакты и прямая связь</span>
          </button>
        </div>
      </div>
    </section>
  );
}
