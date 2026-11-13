import React, { useState } from 'react';
import {
  Copy,
  LogOut,
  Minimize2,
  Maximize2,
  RotateCcw,
  Settings2,
  Trash2,
} from 'lucide-react';
import {
  deriveContactLinks,
  serializeSiteConfigToTs,
  type CategoryIconKey,
  type CategoryItem,
  type SiteConfig,
} from '../config/siteConfig';
import { copyTextToClipboard } from '../utils/requestHelpers';
import { CategoryIcon } from './CategoryIcon';

export interface AdminConfigDrawerProps {
  isOpen: boolean;
  config: SiteConfig;
  onChangeConfig: (nextConfig: SiteConfig) => void;
  onResetDefault: () => void;
  onExitEditMode: () => void;
  showToast: (message: string) => void;
}

const ICON_OPTIONS: ReadonlyArray<{ value: CategoryIconKey; label: string }> = [
  { value: 'motors', label: 'Электродвигатель' },
  { value: 'bearings', label: 'Подшипник / редуктор' },
  { value: 'transformers', label: 'Трансформатор' },
  { value: 'valves', label: 'Запорная арматура' },
  { value: 'pipes', label: 'Трубы' },
  { value: 'cables', label: 'Кабель' },
  { value: 'fasteners', label: 'Метизы / крепёж' },
  { value: 'cylinders', label: 'Газовый баллон' },
  { value: 'generic', label: 'Универсальный узел' },
];

export function AdminConfigDrawer({
  isOpen,
  config,
  onChangeConfig,
  onResetDefault,
  onExitEditMode,
  showToast,
}: AdminConfigDrawerProps): React.JSX.Element | null {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (!isOpen) {
    return null;
  }

  const handlePhoneChange = (nextPhoneDisplay: string) => {
    const derived = deriveContactLinks(nextPhoneDisplay);
    onChangeConfig({
      ...config,
      phoneDisplay: nextPhoneDisplay,
      phoneTel: derived.phoneTel,
      telegramUrl: derived.telegramUrl,
      whatsappUrl: derived.whatsappUrl,
    });
  };

  const handleCategoryChange = (
    index: number,
    patch: Partial<CategoryItem>
  ) => {
    const nextCategories = config.categories.map((cat, idx) =>
      idx === index ? { ...cat, ...patch } : cat
    );
    onChangeConfig({
      ...config,
      categories: nextCategories,
    });
  };

  const handleDeleteCategory = (index: number) => {
    if (config.categories.length <= 1) {
      showToast('Должна остаться хотя бы одна категория');
      return;
    }
    const removed = config.categories[index];
    const nextCategories = config.categories.filter((_, idx) => idx !== index);
    onChangeConfig({
      ...config,
      categories: nextCategories,
    });
    if (removed) {
      showToast(`Удалена категория ${removed.code}`);
    }
  };

  const handleAddCategory = () => {
    const maxNumeric = config.categories.reduce((acc, item) => {
      const idDigits = Number.parseInt(item.id.replace(/\D/g, ''), 10);
      const codeDigits = Number.parseInt(item.code.replace(/\D/g, ''), 10);
      const localMax = Math.max(
        Number.isNaN(idDigits) ? 0 : idDigits,
        Number.isNaN(codeDigits) ? 0 : codeDigits
      );
      return Math.max(acc, localMax);
    }, 0);

    const nextNumber = maxNumeric + 1;
    const padded = String(nextNumber).padStart(2, '0');
    const newCategory: CategoryItem = {
      id: padded,
      code: `КАТ. ${padded}`,
      title: 'Дополнительная позиция оборудования',
      icon: 'generic',
      placeholder: 'Например: 10 шт. или 1 партия',
    };

    onChangeConfig({
      ...config,
      categories: [...config.categories, newCategory],
    });
    showToast(`Добавлена категория ${newCategory.code}`);
  };

  const handleCopyFullConfig = async () => {
    const tsFileSource = serializeSiteConfigToTs(config);
    const copied = await copyTextToClipboard(tsFileSource);
    if (copied) {
      showToast('Готовый TS-конфиг скопирован в буфер обмена');
    } else {
      showToast('Не удалось скопировать конфиг в буфер обмена');
    }
  };

  const handleResetClick = () => {
    onResetDefault();
    showToast('Настройки сброшены к значениям по умолчанию');
  };

  if (isMinimized) {
    return (
      <div className="fixed right-4 bottom-24 md:bottom-6 z-50 print:hidden">
        <div className="flex items-center gap-2 rounded-xl border border-[#2563EB] bg-[#0F172A] px-3.5 py-2.5 text-white shadow-xl">
          <Settings2 className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-xs font-bold">Режим правки</span>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Развернуть</span>
          </button>
          <button
            type="button"
            onClick={onExitEditMode}
            title="Выйти из режима правки"
            aria-label="Выйти из режима правки"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Панель настройки сайта"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-[#E2E8F0] bg-[#FFFFFF] shadow-2xl print:hidden"
    >
      {/* Sticky Top Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#0F172A] px-4 py-3.5 sm:px-6 text-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white">
            <Settings2 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm sm:text-base font-bold">
              Редактор конфигурации сайта
            </h2>
            <p className="truncate text-[11px] text-slate-300">
              Изменения сразу отображаются на странице — скопируйте конфиг для
              сохранения в Git
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            title="Свернуть панель для просмотра страницы"
            aria-label="Свернуть панель"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 transition-colors hover:bg-slate-700 cursor-pointer"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onExitEditMode}
            title="Выйти из режима правки"
            aria-label="Закрыть редактор"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-lg font-semibold leading-none text-slate-200 transition-colors hover:bg-slate-700 cursor-pointer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Scrollable Editor Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8FAFC]">
        {/* Section 1: Contacts & Schedule */}
        <section className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
            1. Контакты и режим приёма обращений
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label
                htmlFor="cms-phone-display"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Номер телефона (автообновление ссылок)
              </label>
              <input
                id="cms-phone-display"
                type="text"
                value={config.phoneDisplay}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-base font-semibold text-[#0F172A] tabular-nums whitespace-nowrap outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
              />
            </div>

            <div>
              <label
                htmlFor="cms-schedule"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                График работы
              </label>
              <input
                id="cms-schedule"
                type="text"
                value={config.schedule}
                onChange={(e) =>
                  onChangeConfig({ ...config, schedule: e.target.value })
                }
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-base font-semibold text-[#0F172A] tabular-nums outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="cms-telegram-url"
                className="mb-1 block text-xs font-semibold text-slate-600"
              >
                Ссылка Telegram
              </label>
              <input
                id="cms-telegram-url"
                type="url"
                value={config.telegramUrl}
                onChange={(e) =>
                  onChangeConfig({ ...config, telegramUrl: e.target.value })
                }
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-base text-[#0F172A] tabular-nums outline-none focus:border-[#2563EB] focus:bg-[#FFFFFF]"
              />
            </div>

            <div>
              <label
                htmlFor="cms-whatsapp-url"
                className="mb-1 block text-xs font-semibold text-slate-600"
              >
                Ссылка WhatsApp
              </label>
              <input
                id="cms-whatsapp-url"
                type="url"
                value={config.whatsappUrl}
                onChange={(e) =>
                  onChangeConfig({ ...config, whatsappUrl: e.target.value })
                }
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-base text-[#0F172A] tabular-nums outline-none focus:border-[#2563EB] focus:bg-[#FFFFFF]"
              />
            </div>
          </div>

          <div className="text-xs text-slate-500 tabular-nums">
            Текущая ссылка звонка:{' '}
            <span className="font-semibold text-slate-700 whitespace-nowrap">
              {config.phoneTel}
            </span>
          </div>
        </section>

        {/* Section 2: Main Appeal & Guarantees */}
        <section className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
            2. Основные формулировки обращения
          </h3>

          <div>
            <label
              htmlFor="cms-hero-title"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Главный заголовок (H1)
            </label>
            <textarea
              id="cms-hero-title"
              rows={3}
              value={config.heroTitle}
              onChange={(e) =>
                onChangeConfig({ ...config, heroTitle: e.target.value })
              }
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-base text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
          </div>

          <div>
            <label
              htmlFor="cms-guarantee-text"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Формулировка гарантий
            </label>
            <input
              id="cms-guarantee-text"
              type="text"
              value={config.guaranteeText}
              onChange={(e) =>
                onChangeConfig({ ...config, guaranteeText: e.target.value })
              }
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-base text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
          </div>

          <div>
            <label
              htmlFor="cms-polite-closing"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Завершающая вежливая фраза
            </label>
            <input
              id="cms-polite-closing"
              type="text"
              value={config.politeClosing}
              onChange={(e) =>
                onChangeConfig({ ...config, politeClosing: e.target.value })
              }
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-base text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
          </div>
        </section>

        {/* Section 3: Categories List */}
        <section className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
            <h3 className="text-sm font-bold text-[#0F172A] tabular-nums">
              3. Категории закупки ({config.categories.length})
            </h3>
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-[#2563EB] transition-colors hover:bg-blue-100 cursor-pointer"
            >
              <span>+ Добавить категорию</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {config.categories.map((cat, idx) => (
              <div
                key={`${cat.id}-${idx}`}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-[#2563EB]">
                      <CategoryIcon icon={cat.icon} className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={cat.code}
                      onChange={(e) =>
                        handleCategoryChange(idx, { code: e.target.value })
                      }
                      aria-label={`Код категории ${idx + 1}`}
                      className="w-28 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1 text-base font-bold text-[#0F172A] tabular-nums outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(idx)}
                    title="Удалить категорию"
                    aria-label={`Удалить категорию ${cat.code}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                    Наименование категории
                  </label>
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) =>
                      handleCategoryChange(idx, { title: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1.5 text-base text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                      Подсказка поля ввода
                    </label>
                    <input
                      type="text"
                      value={cat.placeholder}
                      onChange={(e) =>
                        handleCategoryChange(idx, {
                          placeholder: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1.5 text-base text-[#0F172A] outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                      Техническая пиктограмма
                    </label>
                    <select
                      value={cat.icon}
                      onChange={(e) =>
                        handleCategoryChange(idx, {
                          icon: e.target.value as CategoryIconKey,
                        })
                      }
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1.5 text-base text-[#0F172A] outline-none focus:border-[#2563EB]"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-2.5 text-sm font-semibold text-[#2563EB] transition-colors hover:border-[#2563EB] hover:bg-blue-50/40 cursor-pointer"
          >
            <span>+ Добавить категорию</span>
          </button>
        </section>
      </div>

      {/* Sticky Footer Actions */}
      <div className="border-t border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3.5 sm:px-6 pb-[max(0.875rem,env(safe-area-inset-bottom))] space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleCopyFullConfig}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#1D4ED8] cursor-pointer"
          >
            <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Скопировать готовый конфиг</span>
          </button>

          <button
            type="button"
            onClick={onExitEditMode}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 text-sm sm:text-base font-semibold text-[#0F172A] transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
            <span>Выйти из режима правки</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Вставьте скопированный код в файл src/config/siteConfig.ts</span>
          <button
            type="button"
            onClick={handleResetClick}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-[#0F172A] cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>Сбросить по умолчанию</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
