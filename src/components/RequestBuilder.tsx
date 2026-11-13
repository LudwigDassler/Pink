import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Copy,
  FileSpreadsheet,
  ListChecks,
  MessageCircle,
  Pencil,
  RotateCcw,
  Send,
  Trash2,
} from 'lucide-react';
import type {
  CategoryItem,
  SelectedPosition,
  SiteConfig,
} from '../config/siteConfig';
import {
  REQUEST_DRAFT_STORAGE_KEY,
  appendLinesToRequestText,
  buildRequestTemplate,
  copyTextToClipboard,
  dispatchToMessenger,
  extractActiveQuickChips,
  isQuickChipPresentInText,
  parseClipboardTableToLines,
  syncCustomDraftWithPositions,
  toggleQuickChipInText,
} from '../utils/requestHelpers';

export interface RequestBuilderProps {
  config: SiteConfig;
  selectedPositions: SelectedPosition[];
  onUpdatePositionNote: (categoryId: string, note: string) => void;
  onRemovePosition: (categoryId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onOpenModal: (categoryId: string) => void;
  showToast: (message: string) => void;
}

interface InitialTextState {
  text: string;
  isManual: boolean;
}

function loadInitialText(
  config: SiteConfig,
  selectedPositions: SelectedPosition[]
): InitialTextState {
  const defaultTemplate = buildRequestTemplate(config, selectedPositions);
  if (typeof window === 'undefined') {
    return { text: defaultTemplate, isManual: false };
  }

  try {
    const saved = window.localStorage.getItem(REQUEST_DRAFT_STORAGE_KEY);
    if (!saved || !saved.trim()) {
      return { text: defaultTemplate, isManual: false };
    }

    if (saved.trim() === defaultTemplate.trim()) {
      return { text: defaultTemplate, isManual: false };
    }

    const emptyTemplate = buildRequestTemplate(config, []);
    if (saved.trim() === emptyTemplate.trim() && selectedPositions.length > 0) {
      return { text: defaultTemplate, isManual: false };
    }

    return { text: saved, isManual: true };
  } catch {
    return { text: defaultTemplate, isManual: false };
  }
}

export function RequestBuilder({
  config,
  selectedPositions,
  onUpdatePositionNote,
  onRemovePosition,
  onSelectAll,
  onClearAll,
  onOpenModal,
  showToast,
}: RequestBuilderProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const [initialState] = useState<InitialTextState>(() =>
    loadInitialText(config, selectedPositions)
  );
  const [requestText, setRequestText] = useState<string>(initialState.text);
  const [isManualText, setIsManualText] = useState<boolean>(
    initialState.isManual
  );
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isBuilderInView, setIsBuilderInView] = useState<boolean>(true);

  const [isChipsSpoilerOpen, setIsChipsSpoilerOpen] = useState<boolean>(false);
  const [isHintSpoilerOpen, setIsHintSpoilerOpen] = useState<boolean>(false);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingValue, setEditingValue] = useState<string>('');
  const cancelInlineEditRef = useRef<boolean>(false);

  const requestTextRef = useRef<string>(requestText);
  requestTextRef.current = requestText;

  const isManualRef = useRef<boolean>(isManualText);
  isManualRef.current = isManualText;

  const prevPositionsRef = useRef<SelectedPosition[]>(selectedPositions);
  const prevConfigRef = useRef<SiteConfig>(config);

  const triggerHighlight = useCallback(() => {
    setIsHighlighted(true);
    if (highlightTimerRef.current !== null) {
      window.clearTimeout(highlightTimerRef.current);
    }
    highlightTimerRef.current = window.setTimeout(() => {
      setIsHighlighted(false);
      highlightTimerRef.current = null;
    }, 700);
  }, []);

  // Clean up highlight timeout on unmount
  useEffect(() => {
    return () => {
      if (highlightTimerRef.current !== null) {
        window.clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
    };
  }, []);

  // Silent background autosave
  useEffect(() => {
    try {
      window.localStorage.setItem(REQUEST_DRAFT_STORAGE_KEY, requestText);
    } catch {
      // Ignore storage restrictions silently
    }
  }, [requestText]);

  // Smart sync when selectedPositions or config changes
  useEffect(() => {
    if (
      prevPositionsRef.current === selectedPositions &&
      prevConfigRef.current === config
    ) {
      return;
    }

    const prevPositions = prevPositionsRef.current;
    prevPositionsRef.current = selectedPositions;
    prevConfigRef.current = config;

    if (!isManualRef.current) {
      const activeChips = extractActiveQuickChips(
        requestTextRef.current,
        config.quickChips
      );
      const nextTemplate = buildRequestTemplate(
        config,
        selectedPositions,
        activeChips
      );
      if (nextTemplate !== requestTextRef.current) {
        setRequestText(nextTemplate);
        triggerHighlight();
      }
      return;
    }

    const syncedText = syncCustomDraftWithPositions({
      currentDraft: requestTextRef.current,
      config,
      prevPositions,
      nextPositions: selectedPositions,
    });

    if (syncedText !== requestTextRef.current) {
      setRequestText(syncedText);
      triggerHighlight();
    }
  }, [selectedPositions, config, triggerHighlight]);

  // IntersectionObserver for floating scroll indicator
  useEffect(() => {
    const target = sectionRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsBuilderInView(entry.isIntersecting);
        }
      },
      {
        threshold: 0.08,
      }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, []);

  const categoryMap = new Map<string, CategoryItem>(
    config.categories.map((item) => [item.id, item])
  );

  const startInlineEdit = (categoryId: string, currentNote: string) => {
    cancelInlineEditRef.current = false;
    setEditingCategoryId(categoryId);
    setEditingValue(currentNote);
  };

  const handleInlineBlur = (categoryId: string) => {
    if (cancelInlineEditRef.current) {
      cancelInlineEditRef.current = false;
      setEditingCategoryId(null);
      return;
    }
    onUpdatePositionNote(categoryId, editingValue.trim());
    setEditingCategoryId(null);
  };

  const handleResetTemplate = () => {
    const freshTemplate = buildRequestTemplate(config, selectedPositions);
    setIsManualText(false);
    setRequestText(freshTemplate);
    triggerHighlight();
    showToast('Текст запроса сброшен к шаблону');
  };

  const handleClearAllClick = () => {
    setEditingCategoryId(null);
    onClearAll();
    if (isManualText) {
      const emptyTemplate = buildRequestTemplate(config, []);
      setIsManualText(false);
      setRequestText(emptyTemplate);
      triggerHighlight();
    }
  };

  const handlePasteFromClipboard = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) {
      showToast(
        'Чтение буфера недоступно в браузере — нажмите Ctrl+V в поле текста'
      );
      return;
    }

    try {
      const rawText = await navigator.clipboard.readText();
      if (!rawText.trim()) {
        showToast('Буфер обмена пуст');
        return;
      }

      const formattedLines = parseClipboardTableToLines(rawText);
      if (formattedLines.length === 0) {
        showToast('Не удалось распознать строки в буфере обмена');
        return;
      }

      const updated = appendLinesToRequestText(
        requestTextRef.current,
        formattedLines
      );
      setIsManualText(true);
      setRequestText(updated);
      triggerHighlight();
      showToast(`Добавлено позиций из буфера: ${formattedLines.length}`);
    } catch {
      showToast(
        'Доступ к буферу отклонён браузером — вставьте список через Ctrl+V'
      );
    }
  };

  const handleTextareaPaste = (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const pasted = event.clipboardData.getData('text/plain');
    if (!pasted || !pasted.includes('\t')) {
      return;
    }

    const formattedLines = parseClipboardTableToLines(pasted);
    if (formattedLines.length === 0) {
      return;
    }

    event.preventDefault();
    const updated = appendLinesToRequestText(
      requestTextRef.current,
      formattedLines
    );
    setIsManualText(true);
    setRequestText(updated);
    triggerHighlight();
    showToast(`Таблица Excel отформатирована (${formattedLines.length} стр.)`);
  };

  const handleToggleQuickChip = (chip: string) => {
    const updated = toggleQuickChipInText(requestText, chip);
    setRequestText(updated);
    triggerHighlight();
  };

  const handleSendTelegram = () => {
    dispatchToMessenger({
      baseUrl: config.telegramUrl,
      text: requestText,
      toastMessage: 'Текст скопирован — открываем Telegram',
      showToast,
    });
  };

  const handleSendWhatsApp = () => {
    dispatchToMessenger({
      baseUrl: config.whatsappUrl,
      text: requestText,
      toastMessage: 'Текст скопирован — открываем WhatsApp',
      showToast,
    });
  };

  const handleCopyTextOnly = async () => {
    const ok = await copyTextToClipboard(requestText.trim());
    showToast(
      ok
        ? 'Текст скопирован в буфер обмена'
        : 'Не удалось скопировать текст автоматически'
    );
  };

  const scrollToBuilder = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeChipsCount = extractActiveQuickChips(
    requestText,
    config.quickChips
  ).length;

  return (
    <>
      <section
        id="request-builder"
        ref={sectionRef}
        aria-labelledby="request-builder-heading"
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 scroll-mt-24 print:hidden"
      >
        <div className="mb-6 border-b border-slate-200 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-xs font-semibold tracking-wide text-[#2563EB] uppercase">
                <span>Формирование предложения</span>
              </div>
              <h2
                id="request-builder-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]"
              >
                Быстрая отправка перечня в мессенджер
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsHintSpoilerOpen((prev) => !prev)}
              aria-expanded={isHintSpoilerOpen}
              className="inline-flex self-start sm:self-center items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-[#0F172A] cursor-pointer"
            >
              <span>Подсказка по отправке и вставке из Excel</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                  isHintSpoilerOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          {isHintSpoilerOpen && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm leading-relaxed text-slate-600 space-y-1.5">
              <p>
                1. Отметьте подходящие категории в каталоге выше или сразу
                введите перечень позиций в текстовое поле.
              </p>
              <p>
                2. Кнопка «Вставить из буфера / Excel» (а также обычная вставка
                Ctrl+V из таблицы) автоматически преобразует столбцы в аккуратный
                список строк.
              </p>
              <p>
                3. При нажатии на кнопку мессенджера текст копируется в буфер
                обмена — фотографии бирок и файлы ведомостей удобно прикрепить
                уже в открывшемся диалоге.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Selected Positions */}
          <div className="lg:col-span-5 flex flex-col">
            {selectedPositions.length === 0 ? (
              <div className="flex flex-1 flex-col justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 sm:p-6">
                <div>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#2563EB]">
                    <ListChecks className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Категории пока не отмечены
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    Выберите карточки в каталоге выше или заполните пример
                    запроса справа в свободной форме.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onSelectAll}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0F172A] tabular-nums transition-colors hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer"
                  >
                    <ListChecks className="h-4 w-4 shrink-0 text-[#2563EB]" />
                    <span>Выбрать все категории (01–08)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-3.5 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#2563EB] px-2 text-xs font-bold text-white tabular-nums">
                      {selectedPositions.length}
                    </span>
                    <span className="text-sm font-bold text-[#0F172A] tabular-nums">
                      Выбранные позиции
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearAllClick}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-[#0F172A] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Очистить выбор</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-0.5">
                  {selectedPositions.map((pos) => {
                    const category = categoryMap.get(pos.categoryId);
                    const codeLabel = category?.code ?? `КАТ. ${pos.categoryId}`;
                    const titleLabel =
                      category?.title ?? `Категория ${pos.categoryId}`;
                    const placeholderText =
                      category?.placeholder ??
                      'Укажите количество и состояние';
                    const isInlineEditing =
                      editingCategoryId === pos.categoryId;

                    return (
                      <div
                        key={pos.categoryId}
                        className="rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 tabular-nums">
                                {codeLabel}
                              </span>
                              <span className="truncate text-sm font-semibold text-[#0F172A]">
                                {titleLabel}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onOpenModal(pos.categoryId)}
                              title="Открыть карточку позиции"
                              aria-label={`Подробности по категории ${titleLabel}`}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#2563EB] cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemovePosition(pos.categoryId)}
                              title="Убрать позицию"
                              aria-label={`Убрать ${titleLabel}`}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-base font-semibold leading-none text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <div className="mt-2">
                          {isInlineEditing ? (
                            <input
                              type="text"
                              autoFocus
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={() => handleInlineBlur(pos.categoryId)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  e.currentTarget.blur();
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  cancelInlineEditRef.current = true;
                                  e.currentTarget.blur();
                                }
                              }}
                              placeholder={placeholderText}
                              aria-label={`Количество и примечание для ${titleLabel}`}
                              className="w-full rounded-lg border border-[#2563EB] bg-white px-2.5 py-1.5 text-base text-[#0F172A] outline-none ring-2 ring-[#2563EB]/15"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                startInlineEdit(pos.categoryId, pos.note)
                              }
                              className="w-full rounded-lg border border-transparent bg-slate-50 px-2.5 py-1.5 text-left text-xs sm:text-sm transition-colors hover:border-slate-200 hover:bg-slate-100/80 cursor-text"
                            >
                              {pos.note.trim() ? (
                                <span className="font-medium text-[#0F172A] break-words">
                                  {pos.note}
                                </span>
                              ) : (
                                <span className="text-slate-500">
                                  + Указать количество / детали в одну строку…
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedPositions.length < config.categories.length && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={onSelectAll}
                      className="text-xs font-semibold text-[#2563EB] hover:underline tabular-nums cursor-pointer"
                    >
                      Выбрать все категории (01–08)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Editable Request Example & Symmetrical Messenger Dispatch */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="request-example-textarea"
                className="text-sm font-bold text-[#0F172A]"
              >
                Пример запроса
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors hover:border-[#2563EB] hover:bg-blue-50/40 hover:text-[#2563EB] cursor-pointer"
                >
                  <FileSpreadsheet
                    className="h-3.5 w-3.5 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>Вставить из буфера / Excel</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyTextOnly}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-[#0F172A] cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Скопировать</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetTemplate}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-[#0F172A] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Сбросить к шаблону</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                id="request-example-textarea"
                rows={7}
                value={requestText}
                onChange={(e) => {
                  setIsManualText(true);
                  setRequestText(e.target.value);
                }}
                onPaste={handleTextareaPaste}
                placeholder="Опишите предлагаемые позиции и ориентировочное количество…"
                className={`w-full rounded-xl border bg-white p-3.5 text-base leading-relaxed text-[#0F172A] outline-none transition-all duration-300 ${
                  isHighlighted
                    ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20 bg-emerald-50/20'
                    : 'border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
                }`}
              />
            </div>

            {/* Collapsible Quick Append Chips Spoiler */}
            {config.quickChips.length > 0 && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setIsChipsSpoilerOpen((prev) => !prev)}
                  aria-expanded={isChipsSpoilerOpen}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-[#0F172A] cursor-pointer"
                >
                  <span className="tabular-nums">
                    Быстрые пометки к тексту
                    {activeChipsCount > 0 ? ` (${activeChipsCount})` : ''}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                      isChipsSpoilerOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isChipsSpoilerOpen && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {config.quickChips.map((chip) => {
                      const active = isQuickChipPresentInText(requestText, chip);
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleToggleQuickChip(chip)}
                          aria-pressed={active}
                          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            active
                              ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {active && (
                            <Check
                              className="h-3 w-3 shrink-0"
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

            {/* Unified Symmetrical 2-Column Messenger Dispatch */}
            <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSendTelegram}
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-sm font-bold text-white whitespace-nowrap shadow-xs transition-colors cursor-pointer"
              >
                <Send
                  className="w-5 h-5 text-white shrink-0"
                  aria-hidden="true"
                />
                <span>Отправить в Telegram</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] px-5 text-sm font-bold text-white whitespace-nowrap shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle
                  className="w-5 h-5 text-white shrink-0"
                  aria-hidden="true"
                />
                <span>Отправить в WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Scroll Indicator when positions selected and RequestBuilder is off-screen */}
      {selectedPositions.length >= 1 && !isBuilderInView && (
        <div className="fixed inset-x-0 bottom-20 md:bottom-6 z-40 flex justify-center px-4 pointer-events-none print:hidden">
          <button
            type="button"
            onClick={scrollToBuilder}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-slate-700 bg-[#0F172A] text-xs sm:text-sm font-semibold text-white shadow-lg tabular-nums transition-colors hover:bg-slate-800 cursor-pointer"
          >
            <span
              className="h-2 w-2 rounded-[2px] bg-[#16A34A]"
              aria-hidden="true"
            />
            <span>
              Выбрано: {selectedPositions.length} поз. — Перейти к отправке ↓
            </span>
          </button>
        </div>
      )}
    </>
  );
}
