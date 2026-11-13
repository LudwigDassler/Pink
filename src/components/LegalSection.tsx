import type * as React from 'react';
import { Scale, ShieldCheck, HardDrive, Phone, Send, MessageCircle } from 'lucide-react';
import type { SiteConfig } from '../config/siteConfig';

export function LegalSection({ config }: { config: SiteConfig }): React.JSX.Element {
  return (
    <section
      id="legal"
      aria-labelledby="legal-heading"
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
    >
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold tracking-wide text-[#2563EB] uppercase mb-3">
          <Scale className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Правовой регламент ресурса</span>
        </div>
        <h1
          id="legal-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]"
        >
          Правовая информация
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Правила использования информационного ресурса по закупке неликвидов, складских остатков и
          бывшего в употреблении промышленного оборудования и материалов.
        </p>
      </div>

      <div className="space-y-5">
        {/* 1. Уведомление об отсутствии публичной оферты (ст. 437 ГК РФ) */}
        <article className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-7">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  Уведомление об отсутствии публичной оферты
                </h2>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 tabular-nums">
                  ст. 437 ГК РФ
                </span>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  Вся представленная на данном сайте информация, включая перечень закупаемых
                  товарных групп (категории <span className="tabular-nums">01–08</span>), описание
                  базовых условий взаимодействия и интерактивный конструктор текста обращения, носит
                  исключительно информационно-справочный характер делового запроса на рассмотрение
                  возможности продажи неликвидов и бывшего в употреблении оборудования и материалов
                  и ни при каких условиях не является публичной офертой, определяемой положениями
                  статьи <span className="tabular-nums">437</span> Гражданского кодекса Российской
                  Федерации.
                </p>
                <p>
                  Размещение перечня интересующих категорий не накладывает обязательств по выкупу
                  любого направленного перечня без предварительного согласования состава, состояния и
                  объёма партии. Базовый принцип работы — «{config.guaranteeText}» — применяется ко
                  всем сделкам после индивидуального рассмотрения предложения продавца и взаимного
                  подтверждения параметров отгрузки.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* 2. Политика обработки персональных данных и конфиденциальности (152-ФЗ) */}
        <article className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-7">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  Политика конфиденциальности и обработки персональных данных
                </h2>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 tabular-nums">
                  152-ФЗ
                </span>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  Настоящий раздел разъясняет порядок обеспечения конфиденциальности посетителей в
                  соответствии с требованиями Федерального закона от{' '}
                  <span className="tabular-nums">27.07.2006</span> №{' '}
                  <span className="tabular-nums">152-ФЗ</span> «О персональных данных»:
                </p>
                <ul className="space-y-2.5 list-disc pl-5 text-slate-700">
                  <li>
                    <strong className="font-semibold text-[#0F172A]">
                      Отсутствие серверных анкет и регистрации:
                    </strong>{' '}
                    на сайте отсутствуют личные кабинеты, регистрационные формы, серверные формы
                    сбора анкетных сведений, серверные базы данных посетителей и сторонние рекламные
                    счётчики. Сайт не запрашивает и не сохраняет на сервере фамилии, имена, адреса
                    электронной почты или телефоны пользователей.
                  </li>
                  <li>
                    <strong className="font-semibold text-[#0F172A]">
                      Добровольная прямая связь:
                    </strong>{' '}
                    любое обращение по вопросам реализации складских остатков и оборудования
                    инициируется пользователем самостоятельно и добровольно — посредством прямого
                    телефонного звонка на номер{' '}
                    <a
                      href={config.phoneTel}
                      className="font-semibold text-[#2563EB] hover:underline tabular-nums whitespace-nowrap"
                    >
                      {config.phoneDisplay}
                    </a>{' '}
                    либо при переходе во внешние мессенджеры Telegram и WhatsApp. Обработка сведений
                    в мессенджерах осуществляется по правилам соответствующих платформ исключительно
                    для рассмотрения направленного коммерческого предложения.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* 3. Использование локального хранилища браузера (localStorage) */}
        <article className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-7">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
              <HardDrive className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">
                Техническое хранение данных в браузере (localStorage)
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  Для удобства подготовки списка позиций сайт использует исключительно локальное
                  техническое хранилище браузера (<span className="font-semibold">localStorage</span>{' '}
                  на устройстве посетителя):
                </p>
                <ul className="space-y-2 list-disc pl-5 text-slate-700">
                  <li>
                    сохранение выбранных категорий каталога и черновика текста запроса, чтобы список
                    не терялся при перезагрузке страницы;
                  </li>
                  <li>
                    сохранение отметки о скрытии информационного уведомления о работе с локальным
                    хранилищем.
                  </li>
                </ul>
                <p>
                  Указанные записи хранятся только в вашем браузере, не передаются на сервер в
                  фоновом режиме и могут быть удалены в любой момент кнопкой «Очистить выбор» в
                  конструкторе запроса либо стандартной очисткой данных сайта в настройках браузера.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Прямые контакты для вопросов и предложений */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6">
          <p className="text-sm sm:text-base font-medium text-[#0F172A] mb-4">
            {config.politeClosing}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={config.phoneTel}
              className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-sm font-bold text-[#0F172A] transition-colors tabular-nums whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
              <span className="tabular-nums whitespace-nowrap">{config.phoneDisplay}</span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-[#16A34A] tabular-nums">
                {config.schedule}
              </span>
            </a>
            <a
              href={config.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors"
            >
              <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Telegram</span>
            </a>
            <a
              href={config.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-slate-50 px-3.5 py-2 text-sm font-semibold text-[#0F172A] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
