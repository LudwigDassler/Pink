import React from 'react';
import { Check, Plus, SlidersHorizontal } from 'lucide-react';
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
  const selectedMap = new Map(
    selectedPositions.map((pos) => [pos.categoryId, pos]),
  );

  return (
    <section
      id="catalog"
      className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] tabular-nums">
            Номенклатура закупки · 01–{String(config.categories.length).padStart(2, '0')}
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight break-words">
            Категории закупаемого оборудования и материалов
          </h2>
          <p className="mt-1 text-sm text-[#475569] break-words">
            Отметьте подходящие позиции в один клик или нажмите на карточку, чтобы указать ориентировочный объём.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] tabular-nums">
            <span>Выбрано:</span>
            <span className="font-extrabold text-[#2563EB] tabular-nums">
              {selectedPositions.length}
            </span>
            <span className="text-[#64748B] tabular-nums">
              / {config.categories.length}
            </span>
          </span>

          {selectedPositions.length > 0 && (
            <button
              type="button"
              onClick={onScrollToBuilder}
              className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
            >
              К тексту запроса ↓
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {config.categories.map((cat) => {
          const selected = selectedMap.get(cat.id);
          const isSelected = Boolean(selected);

          return (
            <article
              key={cat.id}
              onClick={() => onOpenModal(cat.id)}
              className={`group relative bg-[#FFFFFF] rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer border ${
                isSelected
                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-xs'
                  : 'border-[#E2E8F0] hover:border-[#94A3B8] hover:shadow-xs'
              }`}
            >
              <div>
                {/* Top row: Technical SVG icon + КАТ. badge */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] group-hover:border-[#CBD5E1] group-hover:text-[#2563EB]'
                    }`}
                  >
                    <CategoryIcon icon={cat.icon} className="w-7 h-7" />
                  </div>

                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold tracking-wider tabular-nums shrink-0 ${
                      isSelected
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#F1F5F9] text-[#475569]'
                    }`}
                  >
                    {cat.code}
                  </span>
                </div>

                {/* Category title */}
                <h3 className="mt-4 text-base font-bold text-[#0F172A] leading-snug break-words">
                  {cat.title}
                </h3>

                {/* Note preview or placeholder */}
                {isSelected && selected?.note.trim() ? (
                  <div className="mt-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]/70 px-2.5 py-1.5 text-xs font-medium text-[#1E40AF] break-words">
                    {selected.note}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-[#64748B] break-words">
                    {cat.placeholder}
                  </p>
                )}
              </div>

              {/* Card bottom actions */}
              <div
                className="mt-5 pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onTogglePosition(cat.id)}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors tabular-nums ${
                    isSelected
                      ? 'bg-[#16A34A]/10 text-[#15803D] border border-[#16A34A]/30 hover:bg-[#16A34A]/20'
                      : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:bg-[#EFF6FF] hover:border-[#2563EB]/40 hover:text-[#2563EB]'
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
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#475569] hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors"
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
