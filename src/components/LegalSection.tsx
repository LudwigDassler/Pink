import { useState } from 'react';
import type * as React from 'react';
import { Scale, ShieldCheck, ChevronDown, Phone, Send, MessageCircle } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';

export function LegalSection({ config }: { config: SiteConfig }): React.JSX.Element {
  const [isOfferDetailsOpen, setIsOfferDetailsOpen] = useState<boolean>(false);
  const [isPrivacyDetailsOpen, setIsPrivacyDetailsOpen] = useState<boolean>(false);

  return (
    <section id="legal" aria-labelledby="legal-heading" className="space-y-6">
      {/* Page Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold tracking-wider text-[#2563EB] uppercase mb-3">
          <Scale className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Правовой регламент ресурса</span>
        </div>
        <h1
          id="legal-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] break-words"
        >
          Правовая информация
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl break-words">
          Правила использования информационного ресурса по закупке неликвидов, складских остатков и
          б/у промышленного оборудования и материалов.
        </p>
      </div>

      {/* 1. Уведомление об отсутствии публичной оферты (ст. 437 ГК РФ) */}
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] break-words">
              Уведомление об отсутствии публичной оферты
            </h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 tabular-nums shrink-0">
            ст. 437 ГК РФ
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-words">
          Материалы данного сайта, включая перечень закупаемых товарных групп (категории{' '}
          <span className="tabular-nums">01–08</span>) и описание условий взаимодействия, носят
          информационно-справочный характер приглашения направлять предложения и не являются
          публичной офертой в понимании статьи <span className="tabular-nums">437</span>{' '}
          Гражданского кодекса Российской Федерации.
        </p>

        <div className="mt-4">
          <button
            type="button"
            aria-expanded={isOfferDetailsOpen}
            onClick={() => setIsOfferDetailsOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] transition-colors cursor-pointer"
          >
            <span>Порядок рассмотрения и согласования предложений</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                isOfferDetailsOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {isOfferDetailsOpen && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">
                  Предварительная оценка партии
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed break-words">
                  Публикация перечня востребованных позиций не создаёт безусловных обязательств по
                  приобретению любого направленного списка без предварительного уточнения состава,
                  состояния и объёма предлагаемой партии.
                </p>
              </div>

              <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">
                  Индивидуальное подтверждение отгрузки
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed break-words">
                  Параметры взаимодействия ({config.guaranteeText}) согласуются индивидуально после
                  рассмотрения направленного перечня и фотографий оборудования со специалистом
                  отдела закупки.
                </p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* 2. Политика конфиденциальности и обработки персональных данных (152-ФЗ) */}
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] break-words">
              Политика конфиденциальности и обработки персональных данных
            </h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 tabular-nums shrink-0">
            152-ФЗ
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-words">
          Сайт работает без регистрации посетителей, личных кабинетов, серверных анкет обратной
          связи и сторонних рекламных счётчиков в соответствии с Федеральным законом от{' '}
          <span className="tabular-nums">27.07.2006</span> №{' '}
          <span className="tabular-nums">152-ФЗ</span> «О персональных данных».
        </p>

        <div className="mt-4">
          <button
            type="button"
            aria-expanded={isPrivacyDetailsOpen}
            onClick={() => setIsPrivacyDetailsOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] transition-colors cursor-pointer"
          >
            <span>Подробнее о каналах прямой связи</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                isPrivacyDetailsOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {isPrivacyDetailsOpen && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">
                  Отсутствие сбора анкет на сайте
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed break-words">
                  Ресурс не запрашивает и не сохраняет на сервере фамилии, имена, адреса электронной
                  почты или контактные телефоны посетителей при просмотре каталога и формировании
                  перечня позиций.
                </p>
              </div>

              <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">
                  Добровольное обращение по прямым контактам
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed break-words">
                  Связь с отделом закупки инициируется пользователем самостоятельно и добровольно —
                  звонком по номеру{' '}
                  <a
                    href={config.phoneTel}
                    className="font-semibold text-[#2563EB] hover:underline tabular-nums whitespace-nowrap"
                  >
                    {config.phoneDisplay}
                  </a>{' '}
                  либо направлением перечня в мессенджеры Telegram и WhatsApp исключительно для
                  оценки предложения о продаже оборудования.
                </p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Прямые контакты для обращений */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="mb-5">
          <p className="text-base sm:text-lg font-extrabold text-[#0F172A] break-words">
            {config.politeClosing}
          </p>
          <p className="mt-1 text-sm text-slate-600 break-words">
            {config.guaranteeText}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          <a
            href={config.phoneTel}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-5 text-sm font-bold text-[#0F172A] tabular-nums whitespace-nowrap transition-colors"
          >
            <Phone className="w-5 h-5 text-[#2563EB] shrink-0" aria-hidden="true" />
            <span className="tabular-nums whitespace-nowrap">{config.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
