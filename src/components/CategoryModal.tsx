import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, Plus, Send, Trash2 } from 'lucide-react';
import type { SelectedPosition, SiteConfig } from '../config/siteConfig';
import {
  buildSinglePositionText,
  dispatchToMessenger,
  hasConditionInNote,
  toggleConditionInNote,
} from '../utils/requestHelpers';
import { CategoryIcon } from './CategoryIcon';

export interface CategoryModalProps {
  config: SiteConfig;
  activeCategoryId: string | null;
  selectedPositions: SelectedPosition[];
  onClose: () => void;
  onSwitchCategory: (categoryId: string) => void;
  onSavePosition: (categoryId: string, note: string) => void;
  onRemovePosition: (categoryId: string) => void;
  showToast: (message: string) => void;
}

export function CategoryModal({
  config,
  activeCategoryId,
  selectedPositions,
  onClose,
  onSwitchCategory,
  onSavePosition,
  onRemovePosition,
  showToast,
}: CategoryModalProps): React.JSX.Element | null {
  const categoryIndex = activeCategoryId
    ? config.categories.findIndex((item) => item.id === activeCategoryId)
    : -1;
  const category =
    categoryIndex >= 0 ? config.categories[categoryIndex] : undefined;
  const isOpen = Boolean(activeCategoryId && category);

  const existingPosition = activeCategoryId
    ? selectedPositions.find((pos) => pos.categoryId === activeCategoryId)
    : undefined;
  const isAlreadySelected = Boolean(existingPosition);

  const [noteState, setNoteState] = useState<{
    categoryId: string | null;
    value: string;
  }>({
    categoryId: activeCategoryId,
    value: existingPosition?.note ?? '',
  });
  const [isConditionSpoilerOpen, setIsConditionSpoilerOpen] =
    useState<boolean>(false);

  const note =
    noteState.categoryId === activeCategoryId
      ? noteState.value
      : existingPosition?.note ?? '';

  const setNote = (nextValue: string) => {
    setNoteState({
      categoryId: activeCategoryId,
      value: nextValue,
    });
  };

  // Lock body scroll while modal is open and restore cleanly on close/unmount
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Close on Escape (and allow ArrowLeft/ArrowRight switching outside inputs)
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      const activeTag = (event.target as HTMLElement | null)?.tagName;
      const isTypingTarget =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT';

      if (!isTypingTarget && config.categories.length > 1 && categoryIndex >= 0) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const prevIdx =
            (categoryIndex - 1 + config.categories.length) %
            config.categories.length;
          onSwitchCategory(config.categories[prevIdx].id);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          const nextIdx = (categoryIndex + 1) % config.categories.length;
          onSwitchCategory(config.categories[nextIdx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onSwitchCategory, config.categories, categoryIndex]);

  if (!isOpen || !category) {
    return null;
  }

  const totalCategories = config.categories.length;
  const handleSwitchPrev = () => {
    if (totalCategories <= 1) {
      return;
    }
    const prevIdx = (categoryIndex - 1 + totalCategories) % totalCategories;
    onSwitchCategory(config.categories[prevIdx].id);
  };

  const handleSwitchNext = () => {
    if (totalCategories <= 1) {
      return;
    }
    const nextIdx = (categoryIndex + 1) % totalCategories;
    onSwitchCategory(config.categories[nextIdx].id);
  };

  const handleSave = () => {
    onSavePosition(category.id, note.trim());
    showToast(
      isAlreadySelected
        ? 'Позиция обновлена в заявке'
        : 'Позиция добавлена в заявку'
    );
    onClose();
  };

  const handleRemove = () => {
    onRemovePosition(category.id);
    showToast('Позиция убрана из заявки');
    onClose();
  };

  const handleDirectTelegram = () => {
    const cleanNote = note.trim();
    onSavePosition(category.id, cleanNote);
    const singleText = buildSinglePositionText(category, cleanNote);
    dispatchToMessenger({
      baseUrl: config.telegramUrl,
      text: singleText,
      toastMessage: 'Текст скопирован — открываем Telegram',
      showToast,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F172A]/50 backdrop-blur-[2px] p-0 sm:p-4 print:hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90dvh] overflow-y-auto border border-slate-200 bg-white shadow-2xl"
      >
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden="true">
          <div className="h-1 w-10 rounded-md bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-xs font-bold text-[#2563EB] tabular-nums">
              {category.code}
            </span>

            {totalCategories > 1 && (
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSwitchPrev}
                  title="Предыдущая категория"
                  aria-label="Предыдущая категория"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-bold text-[#0F172A] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={handleSwitchNext}
                  title="Следующая категория"
                  aria-label="Следующая категория"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-bold text-[#0F172A] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer"
                >
                  →
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Закрыть"
            aria-label="Закрыть окно"
            className="inline-flex w-9 h-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-xl font-semibold leading-none text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-[#0F172A] cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#2563EB]">
              <CategoryIcon icon={category.icon} className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3
                id="category-modal-title"
                className="text-base sm:text-lg font-bold leading-snug text-[#0F172A]"
              >
                {category.title}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
                Позиция {String(categoryIndex + 1).padStart(2, '0')} из{' '}
                {String(totalCategories).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="category-modal-note"
              className="mb-1.5 block text-xs font-bold text-[#0F172A]"
            >
              Количество, маркировка или краткое описание (необязательно)
            </label>
            <textarea
              id="category-modal-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={category.placeholder}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-base text-[#0F172A] outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
          </div>

          {/* Collapsible Condition Chips Spoiler */}
          {config.modalConditionChips.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setIsConditionSpoilerOpen((prev) => !prev)}
                aria-expanded={isConditionSpoilerOpen}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-[#0F172A] cursor-pointer"
              >
                <span>Дополнительные отметки о состоянии</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                    isConditionSpoilerOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isConditionSpoilerOpen && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {config.modalConditionChips.map((chip) => {
                    const active = hasConditionInNote(note, chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setNote(toggleConditionInNote(note, chip))}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {active ? (
                          <Check
                            className="h-3 w-3 shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <Plus
                            className="h-3 w-3 shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                        )}
                        <span>{chip}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 px-5 text-sm font-bold text-white whitespace-nowrap transition-colors cursor-pointer"
            >
              <Check
                className="h-4 w-4 shrink-0 text-white"
                aria-hidden="true"
              />
              <span>
                {isAlreadySelected ? 'Сохранить изменения' : 'Добавить в заявку'}
              </span>
            </button>

            {isAlreadySelected && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-red-600 whitespace-nowrap transition-colors hover:border-red-200 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Убрать из заявки</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleDirectTelegram}
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-sm font-bold text-white whitespace-nowrap transition-colors cursor-pointer"
          >
            <Send className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
            <span>Отправить по этой позиции в Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
}
