import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, Printer, Truck } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Conditions card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Условия взаимодействия
          </div>
          <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight break-words">
            {config.guaranteeText}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed break-words">
            Рассматриваем предложения по складским остаткам, неликвидам и бывшему в употреблении промышленному оборудованию и материалам.
          </p>
        </div>

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
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] tabular-nums break-words">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed break-words">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Universal Seller Memo cards */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>Памятка для быстрой оценки предложения</span>
        </div>
        <h2 className="mt-2.5 text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight break-words">
          Что достаточно указать при обращении
        </h2>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.sellerMemo.map((memo) => (
            <div
              key={memo.id}
              className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-extrabold text-[#2563EB] tabular-nums">
                  ШАГ {memo.step}
                </span>
                <h3 className="mt-3.5 text-base font-bold text-[#0F172A] leading-snug break-words">
                  {memo.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed break-words">
                  {memo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official print sheet action block */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] break-words">
            Официальный бланк запроса для печати (формат A4)
          </h3>
          <p className="mt-1 text-sm text-slate-600 break-words">
            Подготовленный одностраничный лист с полным перечнем категорий и прямыми контактами для передачи в профильный отдел или на склад.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm px-5 transition-colors shadow-xs whitespace-nowrap"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Распечатать официальный бланк запроса</span>
          </button>

          <button
            type="button"
            onClick={onGoToCatalog}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] border border-slate-200 font-semibold text-sm px-5 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>К каталогу</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export function OfficialPrintSheet({
  config,
}: {
  config: SiteConfig;
}): React.JSX.Element {
  return (
    <div className="hidden print:block print-sheet w-full bg-white text-[#0F172A]">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-[#0F172A] pb-3 mb-4">
        <div>
          <div className="text-[10pt] font-bold uppercase tracking-wider text-slate-600">
            Официальный запрос отдела закупки
          </div>
          <div className="text-[9.5pt] text-slate-600 mt-0.5 tabular-nums">
            Прием и оценка заявок: {config.schedule}
          </div>
        </div>
        <div className="text-right tabular-nums">
          <div className="text-[13pt] font-extrabold text-[#0F172A] tabular-nums whitespace-nowrap">
            {config.phoneDisplay}
          </div>
          <div className="text-[9pt] text-slate-600 tabular-nums">
            Telegram / WhatsApp · {config.schedule}
          </div>
        </div>
      </div>

      {/* H1 */}
      <h1 className="text-[13.5pt] font-extrabold leading-snug text-[#0F172A] mb-3">
        {config.heroTitle}
      </h1>

      {/* Conditions bar */}
      <div className="border border-slate-300 rounded-lg px-3.5 py-2 mb-4 bg-slate-50">
        <div className="text-[10.5pt] font-extrabold text-[#0F172A] tabular-nums">
          {config.guaranteeText}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-[9.5pt] text-slate-700">
          {config.guarantees.map((g) => (
            <span key={g.id} className="tabular-nums">
              • <strong>{g.title}:</strong> {g.subtitle}
            </span>
          ))}
        </div>
      </div>

      {/* 8 Categories Table */}
      <table className="w-full border-collapse border border-slate-300 text-[9.5pt] mb-4">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-3 py-2 h-9 text-left font-bold w-24 tabular-nums">
              Код
            </th>
            <th className="border border-slate-300 px-3 py-2 h-9 text-left font-bold">
              Наименование категории оборудования и материалов
            </th>
            <th className="border border-slate-300 px-3 py-2 h-9 text-left font-bold w-52">
              Отметка о наличии / объем
            </th>
          </tr>
        </thead>
        <tbody>
          {config.categories.map((cat) => (
            <tr key={cat.id}>
              <td className="border border-slate-300 px-3 py-2 h-9 font-bold tabular-nums whitespace-nowrap">
                {cat.code}
              </td>
              <td className="border border-slate-300 px-3 py-2 h-9 font-medium">
                {cat.title}
              </td>
              <td className="border border-slate-300 px-3 py-2 h-9 text-slate-400">
                &nbsp;
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Seller memo summary */}
      <div className="border border-slate-200 rounded-lg px-3.5 py-2.5 mb-4 text-[9pt] text-slate-700">
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
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-300">
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
          <div className="text-[9pt] text-slate-700 tabular-nums">
            Telegram: {config.telegramUrl} &nbsp;|&nbsp; WhatsApp: {config.whatsappUrl}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center">
          <QrCodeSvg url={config.telegramUrl} size={74} />
          <span className="text-[7.5pt] text-slate-600 mt-0.5">Telegram</span>
        </div>
      </div>
    </div>
  );
}
