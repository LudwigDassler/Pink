import React, { useState } from 'react';
import { Check, ChevronDown, Plus, SlidersHorizontal } from 'lucide-react';
import type { SelectedPosition, SiteConfig } from '../config/siteConfig';
import { CategoryIcon } from './CategoryIcon';

export interface CatalogGridProps {
  config: SiteConfig;
  selectedPositions: SelectedPosition[];
  onTogglePosition: (categoryId: string) => void;
  onOpenModal: (categoryId: string) => void;
  onScrollToBuilder: () => void;
}

export function CatalogGrid({
  config,
  selectedPositions,
  onTogglePosition,
  onOpenModal,
  onScrollToBuilder,
}: CatalogGridProps): React.JSX.Element {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const selectedMap = new Map(
    selectedPositions.map((pos) => [pos.categoryId, pos]),
  );

  return (
    <section
      id="catalog"
      className="scroll-mt-24 bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#2563EB] tabular-nums">
            Номенклатура закупки · 01–{String(config.categories.length).padStart(2, '0')}
          </div>
          <h2 className="mt-2.5 text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight break-words">
            Категории закупаемого оборудования и материалов
          </h2>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsHelpOpen((prev) => !prev)}
              aria-expanded={isHelpOpen}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2563EB] transition-colors"
            >
              <span>Как быстро отметить позиции</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isHelpOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isHelpOpen && (
              <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                Отметьте подходящие позиции кнопкой «В список» в один клик или нажмите на карточку категории, чтобы указать ориентировочное количество и состояние.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#0F172A] tabular-nums">
            <span>Выбрано:</span>
            <span className="font-extrabold text-[#2563EB] tabular-nums">
              {selectedPositions.length}
            </span>
            <span className="text-slate-500 tabular-nums">
              / {config.categories.length}
            </span>
          </span>

          {selectedPositions.length > 0 && (
            <button
              type="button"
              onClick={onScrollToBuilder}
              className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
            >
              К примеру запроса ↓
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {config.categories.map((cat) => {
          const selected = selectedMap.get(cat.id);
          const isSelected = Boolean(selected);
          const imageKey = `${cat.id}:${cat.image}`;
          const showFallback = !cat.image.trim() || Boolean(brokenImages[imageKey]);

          return (
            <article
              key={cat.id}
              onClick={() => onOpenModal(cat.id)}
              className={`group relative h-full min-h-[280px] rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer bg-white ${
                isSelected
                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-xs'
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Top category photo with SVG fallback + КАТ. rectangular badge */}
                <div className="relative">
                  {showFallback ? (
                    <div className="w-full h-36 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#2563EB]">
                      <CategoryIcon icon={cat.icon} className="w-12 h-12" />
                    </div>
                  ) : (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      onError={() =>
                        setBrokenImages((prev) => ({
                          ...prev,
                          [imageKey]: true,
                        }))
                      }
                      className="w-full h-36 object-cover rounded-lg bg-slate-100"
                    />
                  )}

                  <span
                    className={`absolute top-2 right-2 inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold tracking-wider tabular-nums shadow-2xs ${
                      isSelected
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-white/95 border-slate-200 text-slate-700 backdrop-blur-xs'
                    }`}
                  >
                    {cat.code}
                  </span>
                </div>

                <h3 className="mt-3.5 text-base font-bold text-[#0F172A] leading-snug break-words">
                  {cat.title}
                </h3>

                {isSelected && selected?.note.trim() ? (
                  <div className="mt-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]/70 px-2.5 py-1.5 text-xs font-medium text-[#1E40AF] break-words">
                    {selected.note}
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500 break-words">
                    {cat.placeholder}
                  </p>
                )}
              </div>

              <div
                className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onTogglePosition(cat.id)}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors tabular-nums ${
                    isSelected
                      ? 'bg-[#16A34A]/10 text-[#15803D] border border-[#16A34A]/30 hover:bg-[#16A34A]/20'
                      : 'bg-slate-50 text-[#0F172A] border border-slate-200 hover:bg-[#EFF6FF] hover:border-[#2563EB]/40 hover:text-[#2563EB]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Выбрано</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span>В список</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenModal(cat.id)}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#2563EB] hover:bg-slate-50 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>{isSelected ? 'Детали' : 'Уточнить'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
