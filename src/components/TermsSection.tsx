import React from 'react';
import { ArrowLeft, CheckCircle2, Printer, ShieldCheck, Truck } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';
import { QrCodeSvg } from './QrCodeSvg';

export interface TermsSectionProps {
  config: SiteConfig;
  onGoToCatalog: () => void;
}

export function TermsSection({
  config,
  onGoToCatalog,
}: TermsSectionProps): React.JSX.Element {
  const handlePrint = (): void => {
    window.print();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl">
        <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Условия взаимодействия и памятка
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight break-words">
          {config.guaranteeText}
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-[#475569] leading-relaxed break-words">
          Рассматриваем предложения по складским остаткам, неликвидам и бывшему в употреблении промышленному оборудованию и материалам.
        </p>
      </div>

      {/* Base guarantees */}
      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.guarantees.map((item, idx) => {
          const Icon = idx === 0 ? ShieldCheck : Truck;
          return (
            <div
              key={item.id}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]/70 text-[#2563EB] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] tabular-nums break-words">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-[#475569] leading-relaxed break-words">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 Universal Seller Memo cards */}
      <div className="mt-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#475569]">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>Памятка для быстрой оценки предложения</span>
        </div>
        <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight break-words">
          Что достаточно указать при обращении
        </h2>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.sellerMemo.map((memo) => (
            <div
              key={memo.id}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center rounded-md bg-[#F1F5F9] px-2.5 py-1 text-xs font-extrabold text-[#2563EB] tabular-nums">
                  ШАГ {memo.step}
                </span>
                <h3 className="mt-3.5 text-base font-bold text-[#0F172A] leading-snug break-words">
                  {memo.title}
                </h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed break-words">
                  {memo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official print sheet action block */}
      <div className="mt-10 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] break-words">
            Официальный бланк запроса для печати (формат A4)
          </h3>
          <p className="mt-1 text-sm text-[#475569] break-words">
            Подготовленный одностраничный лист с полным перечнем категорий и прямыми контактами для передачи в профильный отдел или на склад.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm px-5 py-3 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Распечатать официальный бланк запроса</span>
          </button>

          <button
            type="button"
            onClick={onGoToCatalog}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-semibold text-sm px-4 py-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>К каталогу</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export function OfficialPrintSheet({
  config,
}: {
  config: SiteConfig;
}): React.JSX.Element {
  return (
    <div className="hidden print:block print-sheet w-full bg-[#FFFFFF] text-[#0F172A]">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-[#0F172A] pb-3 mb-4">
        <div>
          <div className="text-[10pt] font-bold uppercase tracking-wider text-[#475569]">
            Официальный запрос отдела закупки
          </div>
          <div className="text-[9.5pt] text-[#475569] mt-0.5 tabular-nums">
            Приём предложений: {config.schedule}
          </div>
        </div>
        <div className="text-right tabular-nums">
          <div className="text-[13pt] font-extrabold text-[#0F172A] tabular-nums whitespace-nowrap">
            {config.phoneDisplay}
          </div>
          <div className="text-[9pt] text-[#475569] tabular-nums">
            Telegram / WhatsApp · {config.schedule}
          </div>
        </div>
      </div>

      {/* H1 */}
      <h1 className="text-[13.5pt] font-extrabold leading-snug text-[#0F172A] mb-3">
        {config.heroTitle}
      </h1>

      {/* Guarantees bar */}
      <div className="border border-[#CBD5E1] rounded-lg px-3.5 py-2 mb-4 bg-[#F8FAFC]">
        <div className="text-[10.5pt] font-extrabold text-[#0F172A] tabular-nums">
          {config.guaranteeText}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-[9.5pt] text-[#334155]">
          {config.guarantees.map((g) => (
            <span key={g.id} className="tabular-nums">
              • <strong>{g.title}:</strong> {g.subtitle}
            </span>
          ))}
        </div>
      </div>

      {/* 8 Categories Table */}
      <table className="w-full border-collapse border border-[#CBD5E1] text-[9.5pt] mb-4">
        <thead>
          <tr className="bg-[#F1F5F9]">
            <th className="border border-[#CBD5E1] px-2.5 py-1.5 text-left font-bold w-24 tabular-nums">
              Код
            </th>
            <th className="border border-[#CBD5E1] px-2.5 py-1.5 text-left font-bold">
              Наименование категории оборудования и материалов
            </th>
            <th className="border border-[#CBD5E1] px-2.5 py-1.5 text-left font-bold w-52">
              Отметка о наличии / объём
            </th>
          </tr>
        </thead>
        <tbody>
          {config.categories.map((cat) => (
            <tr key={cat.id}>
              <td className="border border-[#CBD5E1] px-2.5 py-1.5 font-bold tabular-nums whitespace-nowrap">
                {cat.code}
              </td>
              <td className="border border-[#CBD5E1] px-2.5 py-1.5 font-medium">
                {cat.title}
              </td>
              <td className="border border-[#CBD5E1] px-2.5 py-1.5 text-[#94A3B8]">
                &nbsp;
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Seller memo summary */}
      <div className="border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 mb-4 text-[9pt] text-[#334155]">
        <div className="font-bold text-[#0F172A] mb-1">
          Для предварительного рассмотрения достаточно:
        </div>
        <div className="grid grid-cols-3 gap-3">
          {config.sellerMemo.map((m) => (
            <div key={m.id} className="tabular-nums">
              <strong>
                {m.step}. {m.title}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Contacts + QR */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#CBD5E1]">
        <div className="space-y-1">
          <div className="text-[10.5pt] font-bold text-[#0F172A]">
            {config.politeClosing}
          </div>
          <div className="text-[10pt] text-[#0F172A] tabular-nums">
            Телефон ({config.schedule}):{' '}
            <strong className="tabular-nums whitespace-nowrap">
              {config.phoneDisplay}
            </strong>
          </div>
          <div className="text-[9pt] text-[#334155] tabular-nums">
            Telegram: {config.telegramUrl} &nbsp;|&nbsp; WhatsApp: {config.whatsappUrl}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center">
          <QrCodeSvg url={config.telegramUrl} size={74} />
          <span className="text-[7.5pt] text-[#475569] mt-0.5">Telegram</span>
        </div>
      </div>
    </div>
  );
}
