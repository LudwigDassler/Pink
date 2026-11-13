import React from 'react';
import { Copy, LogOut, RotateCcw, Settings2, Trash2 } from 'lucide-react';
import {
  deriveContactLinks,
  serializeSiteConfigToTs,
  type CategoryItem,
  type SiteConfig,
} from '../config/siteConfig';
import { copyTextToClipboard } from '../utils/requestHelpers';

export interface AdminConfigDrawerProps {
  isOpen: boolean;
  config: SiteConfig;
  onChangeConfig: (nextConfig: SiteConfig) => void;
  onResetDefault: () => void;
  onExitEditMode: () => void;
  showToast: (message: string) => void;
}

export function AdminConfigDrawer({
  isOpen,
  config,
  onChangeConfig,
  onResetDefault,
  onExitEditMode,
  showToast,
}: AdminConfigDrawerProps): React.JSX.Element | null {
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
      title: 'Новая категория оборудования',
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

  return (
    <aside
      aria-label="Панель настройки сайта"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl print:hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-[#0F172A] px-4 py-3.5 sm:px-6 text-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2563EB] text-white">
            <Settings2 className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="truncate text-sm sm:text-base font-bold">
            Быстрая настройка сайта
          </h2>
        </div>

        <button
          type="button"
          onClick={onExitEditMode}
          title="Закрыть панель"
          aria-label="Закрыть панель"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-lg font-semibold leading-none text-slate-200 transition-colors hover:bg-slate-700 cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* Simplified Editor Body: Only Phone, Title, and Categories */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50">
        {/* 1. Phone */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-2">
          <label
            htmlFor="cms-phone-display"
            className="block text-sm font-bold text-[#0F172A]"
          >
            Телефон
          </label>
          <input
            id="cms-phone-display"
            type="text"
            value={config.phoneDisplay}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base font-semibold text-[#0F172A] tabular-nums whitespace-nowrap outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
          />
          <p className="text-xs text-slate-500">
            Ссылки для звонка, Telegram и WhatsApp обновляются автоматически.
          </p>
        </section>

        {/* 2. Title */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-2">
          <label
            htmlFor="cms-hero-title"
            className="block text-sm font-bold text-[#0F172A]"
          >
            Заголовок
          </label>
          <textarea
            id="cms-hero-title"
            rows={3}
            value={config.heroTitle}
            onChange={(e) =>
              onChangeConfig({ ...config, heroTitle: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
          />
        </section>

        {/* 3. Categories List */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-[#0F172A] tabular-nums">
              Список категорий ({config.categories.length})
            </h3>
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-[#2563EB] transition-colors hover:bg-blue-100 cursor-pointer"
            >
              <span>+ Добавить категорию</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.categories.map((cat, idx) => (
              <div
                key={`${cat.id}-${idx}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-block px-2 py-0.5 rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-700 tabular-nums">
                    {cat.code}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(idx)}
                    title="Удалить категорию"
                    aria-label={`Удалить категорию ${cat.code}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                    Название категории
                  </label>
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) =>
                      handleCategoryChange(idx, { title: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                    Пример заполнения (подсказка в поле)
                  </label>
                  <input
                    type="text"
                    value={cat.placeholder}
                    onChange={(e) =>
                      handleCategoryChange(idx, {
                        placeholder: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#2563EB] transition-colors hover:border-[#2563EB] hover:bg-blue-50/40 cursor-pointer"
          >
            <span>+ Добавить категорию</span>
          </button>
        </section>
      </div>

      {/* Sticky Footer Actions */}
      <div className="border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6 pb-[max(0.875rem,env(safe-area-inset-bottom))] space-y-2.5">
        <button
          type="button"
          onClick={handleCopyFullConfig}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white whitespace-nowrap transition-colors hover:bg-[#1D4ED8] cursor-pointer"
        >
          <Copy className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
          <span>Скопировать готовый конфиг для GitHub</span>
        </button>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleResetClick}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0F172A] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Сбросить по умолчанию</span>
          </button>

          <button
            type="button"
            onClick={onExitEditMode}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-slate-100 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
            <span>Закрыть редактор</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
