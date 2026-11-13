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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main polite appeal & priority contact card */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 px-3 py-1 text-xs font-bold text-[#16A34A] tabular-nums whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
              </span>
              <span>Приём предложений {config.schedule}</span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug break-words">
              {config.politeClosing}
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-[#475569] leading-relaxed break-words">
              {config.guaranteeText}. Вы можете направить перечень остатков, фотографии бирок или ведомость в мессенджер либо позвонить напрямую в любое время.
            </p>

            {/* Large phone number + copy button */}
            <div className="mt-7 p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B] tabular-nums">
                  Прямой телефон ({config.schedule})
                </div>
                <a
                  href={config.phoneTel}
                  className="mt-1 inline-block text-2xl sm:text-3xl font-extrabold text-[#0F172A] hover:text-[#2563EB] transition-colors tabular-nums whitespace-nowrap"
                >
                  {config.phoneDisplay}
                </a>
              </div>

              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFFFFF] hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] border border-[#E2E8F0] hover:border-[#2563EB]/30 font-semibold text-xs sm:text-sm px-4 py-2.5 transition-colors"
              >
                <Copy className="w-4 h-4 shrink-0" />
                <span>Скопировать номер</span>
              </button>
            </div>

            {/* Priority Contact Buttons (#1 Telegram, #2 Call, #3 WhatsApp) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm sm:text-base px-4 py-3.5 shadow-xs transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Написать в Telegram</span>
              </a>

              <a
                href={config.phoneTel}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] font-bold text-sm sm:text-base px-4 py-3.5 transition-colors tabular-nums whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span className="tabular-nums whitespace-nowrap">
                  Позвонить {config.schedule}
                </span>
              </a>

              <a
                href={config.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] font-semibold text-sm sm:text-base px-4 py-3.5 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* vCard download */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-[#64748B] break-words">
              Сохраните карточку отдела закупки в адресную книгу смартфона одним нажатием:
            </span>
            <button
              type="button"
              onClick={handleDownloadVcard}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] border border-[#E2E8F0] hover:border-[#2563EB]/30 font-semibold text-xs sm:text-sm px-4 py-2.5 transition-colors shrink-0"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Скачать контакт в телефон (.vcf)</span>
            </button>
          </div>
        </div>

        {/* Desktop Telegram QR block */}
        <div className="hidden md:flex lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 flex-col items-center justify-between text-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Быстрый переход с компьютера
            </div>
            <h2 className="mt-1.5 text-lg font-extrabold text-[#0F172A]">
              Telegram на телефоне
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#475569] leading-relaxed">
              Наведите камеру смартфона на QR-код, чтобы сразу открыть чат и отправить фото со склада.
            </p>
          </div>

          <div className="my-6 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
            <QrCodeSvg url={config.telegramUrl} size={172} />
          </div>

          <div className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 text-xs text-[#475569] tabular-nums break-all">
            {config.telegramUrl}
          </div>
        </div>
      </div>
    </section>
  );
}
