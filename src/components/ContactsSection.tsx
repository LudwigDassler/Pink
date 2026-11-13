import React, { useEffect, useRef } from 'react';
import { Copy, MessageCircle, Phone, Send, UserPlus } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';
import { copyTextSafe } from './Header';
import { QrCodeSvg } from './QrCodeSvg';

export interface ContactsSectionProps {
  config: SiteConfig;
  showToast: (message: string) => void;
}

export function ContactsSection({
  config,
  showToast,
}: ContactsSectionProps): React.JSX.Element {
  const revokeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (revokeTimerRef.current !== null) {
        window.clearTimeout(revokeTimerRef.current);
      }
    };
  }, []);

  const handleCopyPhone = async (): Promise<void> => {
    await copyTextSafe(config.phoneDisplay);
    showToast('Номер скопирован');
  };

  const handleDownloadVcard = (): void => {
    const rawTel = config.phoneTel.replace(/^tel:/i, '').trim() || '+79810388903';
    const vcardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Отдел закупки неликвидов и оборудования',
      'N:;Отдел закупки неликвидов и оборудования;;;',
      'TITLE:Отдел закупки неликвидов и оборудования',
      `TEL;TYPE=CELL:${rawTel}`,
      `URL:${config.telegramUrl}`,
      `NOTE:${config.guaranteeText}. ${config.politeClosing}`,
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vcardContent], {
      type: 'text/vcard;charset=utf-8',
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'otdel-zakupki.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (revokeTimerRef.current !== null) {
      window.clearTimeout(revokeTimerRef.current);
    }
    revokeTimerRef.current = window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      revokeTimerRef.current = null;
    }, 1000);

    showToast('Контакт .vcf сохранён');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Main polite appeal & priority contact card */}
      <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[#16A34A]/30 bg-[#16A34A]/10 text-xs font-bold text-[#15803D] tabular-nums whitespace-nowrap">
            <span className="h-2 w-2 rounded-[2px] bg-[#16A34A] shrink-0" />
            <span>Прием и оценка заявок {config.schedule}</span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug break-words">
            {config.politeClosing}
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed break-words">
            {config.guaranteeText}. Вы можете направить перечень остатков, фотографии бирок или ведомость в мессенджер либо позвонить напрямую в удобное время.
          </p>

          {/* Large phone number + Call & Copy buttons */}
          <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 tabular-nums">
                Прямой телефон ({config.schedule})
              </div>
              <a
                href={config.phoneTel}
                className="mt-1 inline-block text-2xl sm:text-3xl font-extrabold text-[#0F172A] hover:text-[#2563EB] transition-colors tabular-nums whitespace-nowrap"
              >
                {config.phoneDisplay}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={config.phoneTel}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-200 px-5 text-sm font-bold tabular-nums whitespace-nowrap transition-colors"
              >
                <Phone className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
                <span className="tabular-nums whitespace-nowrap">
                  Позвонить {config.schedule}
                </span>
              </a>

              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] border border-slate-200 hover:border-[#2563EB]/30 px-5 text-sm font-semibold whitespace-nowrap transition-colors"
              >
                <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Скопировать номер</span>
              </button>
            </div>
          </div>

          {/* Symmetrical Messenger Buttons: Telegram & WhatsApp */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={config.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-sm font-bold text-white whitespace-nowrap transition-colors"
            >
              <Send className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
              <span>Написать в Telegram</span>
            </a>

            <a
              href={config.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] px-5 text-sm font-bold text-white whitespace-nowrap transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
              <span>Написать в WhatsApp</span>
            </a>
          </div>
        </div>

        {/* vCard download */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-slate-500 break-words">
            Сохраните карточку отдела закупки в адресную книгу смартфона одним нажатием:
          </span>
          <button
            type="button"
            onClick={handleDownloadVcard}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] border border-slate-200 hover:border-[#2563EB]/30 px-5 text-sm font-semibold whitespace-nowrap transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Скачать контакт в телефон (.vcf)</span>
          </button>
        </div>
      </section>

      {/* Desktop Telegram QR block */}
      <aside className="hidden md:flex lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex-col items-center justify-between text-center">
        <div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Быстрый переход
          </div>
          <h2 className="mt-2.5 text-lg font-extrabold text-[#0F172A]">
            Telegram на телефоне
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Наведите камеру смартфона на QR-код, чтобы сразу открыть чат и отправить фото со склада.
          </p>
        </div>

        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <QrCodeSvg url={config.telegramUrl} size={172} />
        </div>

        <div className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-600 tabular-nums break-all">
          {config.telegramUrl}
        </div>
      </aside>
    </div>
  );
}
