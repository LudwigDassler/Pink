import React from 'react';
import { ArrowDown, MessageSquare, ShieldCheck, Truck } from 'lucide-react';
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
    <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-[#F8FAFC]">
      {/* Delicate Swiss blueprint dot grid with smooth radial fade mask */}
      <div
        className="hero-blueprint-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-5 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            <span>Прямой запрос на закупку · {config.guaranteeText}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-extrabold tracking-tight text-[#0F172A] leading-[1.22] break-words">
            {config.heroTitle}
          </h1>

          {/* 2 Guarantee cards */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 max-w-2xl">
            {config.guarantees.map((item, idx) => {
              const Icon = idx === 0 ? ShieldCheck : Truck;
              return (
                <div
                  key={item.id}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3.5 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]/60 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-bold text-[#0F172A] tabular-nums break-words">
                      {item.title}
                    </div>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#475569] leading-relaxed break-words">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2 Navigation buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm sm:text-base px-6 py-3.5 shadow-xs transition-colors"
            >
              <span>Перейти к перечню категорий</span>
              <ArrowDown className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onOpenContacts}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-semibold text-sm sm:text-base px-6 py-3.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Контакты и прямая связь</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
