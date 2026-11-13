import type * as React from 'react';
import { Scale, ShieldCheck, HardDrive, Phone, Send, MessageCircle } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';

export function LegalSection({ config }: { config: SiteConfig }): React.JSX.Element {
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-2">
              Информационно-справочный статус
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed break-words">
              Вся представленная на данном сайте информация, включая перечень закупаемых товарных
              групп (категории <span className="tabular-nums">01–08</span>), базовые условия работы
              и интерактивный конструктор обращения, носит исключительно информационно-справочный
              характер делового приглашения направлять предложения и ни при каких условиях не
              является публичной офертой, определяемой положениями статьи{' '}
              <span className="tabular-nums">437</span> Гражданского кодекса Российской Федерации.
            </p>
          </div>

          <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-2">
              Порядок согласования заявок
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed break-words">
              Публикация перечня востребованных позиций не накладывает безусловных обязательств по
              выкупу любого направленного списка без предварительной оценки состава, состояния и
              объёма партии. Условия взаимодействия ({config.guaranteeText}) применяются по итогам
              индивидуального рассмотрения предложения продавца и взаимного подтверждения параметров
              вывоза.
            </p>
          </div>
        </div>
      </article>

      {/* 2. Политика конфиденциальности (152-ФЗ) и localStorage */}
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] break-words">
              Политика конфиденциальности и обработки персональных данных
            </h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 tabular-nums shrink-0">
            152-ФЗ · localStorage
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5 break-words">
          Настоящий раздел разъясняет порядок обеспечения конфиденциальности посетителей в
          соответствии с требованиями Федерального закона от{' '}
          <span className="tabular-nums">27.07.2006</span> №{' '}
          <span className="tabular-nums">152-ФЗ</span> «О персональных данных».
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-2">
                Отсутствие серверного сбора и добровольная связь
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed break-words">
                На сайте отсутствуют учётные записи, регистрационные анкеты, серверные веб-формы
                обратной связи, базы посетителей и рекламные трекеры. Любое обращение по вопросам
                продажи складских остатков и оборудования осуществляется пользователем
                самостоятельно и добровольно — прямым звонком на номер{' '}
                <a
                  href={config.phoneTel}
                  className="font-semibold text-[#2563EB] hover:underline tabular-nums whitespace-nowrap"
                >
                  {config.phoneDisplay}
                </a>{' '}
                либо при переходе во внешние мессенджеры Telegram и WhatsApp.
              </p>
            </div>
          </div>

          <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                  Локальное хранилище браузера (localStorage)
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed break-words">
                Для сохранения выбранных категорий каталога, черновика текста обращения и настройки
                информационного уведомления используется только техническое хранилище браузера (
                <span className="font-semibold text-[#0F172A]">localStorage</span> на устройстве
                посетителя). Эти записи не передаются на сервер в фоновом режиме и могут быть
                удалены кнопкой «Очистить выбор» либо через настройки браузера.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Прямые контакты для обращений */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="mb-5">
          <p className="text-base sm:text-lg font-extrabold text-[#0F172A] break-words">
            {config.politeClosing}
          </p>
          <p className="mt-1 text-sm text-slate-600 tabular-nums break-words">
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
            <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-white text-xs font-bold text-[#16A34A] tabular-nums">
              {config.schedule}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
