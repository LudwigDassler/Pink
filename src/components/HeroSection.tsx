import React from 'react';
import { ArrowDown, Clock, MessageSquare, Truck } from 'lucide-react';
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
      {/* Delicate Swiss blueprint dot grid with smooth radial fade mask */}
      <div
        className="hero-blueprint-grid pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-5">
          <span className="h-2 w-2 rounded-[2px] bg-[#2563EB] shrink-0" />
          <span className="tabular-nums">{config.guaranteeText}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold tracking-tight text-[#0F172A] leading-[1.22] break-words max-w-4xl">
          {config.heroTitle}
        </h1>

        {/* Symmetrical 2-card Conditions Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.guarantees.map((item, idx) => {
            const Icon = idx === 0 ? Truck : Clock;
            return (
              <div
                key={item.id}
                className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]/70 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold text-[#0F172A] tabular-nums break-words">
                    {item.title}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2 Navigation buttons */}
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
