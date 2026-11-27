import { Bookmark, ChevronLeft, ChevronRight, Link2 } from 'lucide-react';
import { useState } from 'react';
import { getRelatedModels } from '../data/businessModels';
import type { BusinessModel } from '../data/types';

interface ModelDetailViewProps {
  model: BusinessModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onOpenModel: (modelName: string) => void;
  onOpenIndustry: (industryName: string) => void;
}

export function ModelDetailView({
  model,
  isFavorite,
  onToggleFavorite,
  onBack,
  onOpenModel,
  onOpenIndustry,
}: ModelDetailViewProps) {
  const [descLang, setDescLang] = useState<'ru' | 'en'>('ru');
  const relatedModels = getRelatedModels(model.name);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-8 pb-10">
      {/* Desktop Back & Actions Bar */}
      <div className="hidden md:flex items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors cursor-pointer py-1.5 pr-3 -ml-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Назад</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-stone-400 tabular-nums">
            Модель № {model.number} из 60
          </span>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
              isFavorite
                ? 'border-orange-200 bg-orange-50 text-orange-700'
                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
            }`}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              fill={isFavorite ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
            <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-column Desktop / Single-column Mobile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Primary Content Column */}
        <article className="lg:col-span-7 space-y-6">
          {/* Title & Short Description — matching Screenshot 2 hierarchy */}
          <header className="space-y-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 break-words">
                {model.name}
              </h2>
              {model.rusName !== model.name && (
                <p className="text-sm md:text-base text-stone-500 mt-1">
                  {model.rusName}
                </p>
              )}
            </div>

            <p className="text-[16px] md:text-[17px] font-bold text-stone-900 leading-snug pt-1">
              {model.shortDescription}
            </p>
          </header>

          {/* Full Description with RU / EN Switch */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-stone-900">Подробное описание</h3>
              <div
                role="tablist"
                aria-label="Язык описания"
                className="inline-flex items-center p-0.5 bg-stone-100 rounded-lg"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={descLang === 'ru'}
                  onClick={() => setDescLang('ru')}
                  className={`min-h-[34px] md:min-h-0 px-3 py-1.5 md:py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    descLang === 'ru'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Русский
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={descLang === 'en'}
                  onClick={() => setDescLang('en')}
                  className={`min-h-[34px] md:min-h-0 px-3 py-1.5 md:py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    descLang === 'en'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <p className="text-[15px] md:text-[16px] text-stone-700 leading-[1.68]">
              {descLang === 'ru' ? model.fullDescriptionRu : model.fullDescriptionEn}
            </p>
          </section>

          {/* Real-world Company Examples */}
          {model.examples.length > 0 && (
            <section className="pt-5 border-t border-stone-200/80 space-y-3.5">
              <div>
                <h3 className="text-base font-bold text-stone-900">Примеры компаний</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Компании, успешно применяющие модель «{model.name}» на практике
                </p>
              </div>
              <ul className="divide-y divide-stone-100">
                {model.examples.map((example) => (
                  <li key={example.company} className="py-3 first:pt-1 last:pb-0">
                    <div className="text-[15px] font-semibold text-stone-900">
                      {example.company}
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed mt-0.5">
                      {example.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* External Source Link Row — matching Screenshot 2 */}
          {model.link && (
            <div className="pt-4 border-t border-stone-200/80">
              <a
                href={model.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-2 rounded-xl hover:bg-stone-50/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <div className="min-w-0">
                  <div className="text-[14.5px] font-medium text-stone-800 group-hover:text-orange-700 transition-colors">
                    Открыть паттерн на
                  </div>
                  <div className="text-[14.5px] font-semibold text-stone-900 truncate">
                    BusinessModelNavigator.com
                  </div>
                </div>
                <span className="w-10 h-10 rounded-full bg-orange-50 group-hover:bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 transition-colors">
                  <Link2 className="w-4 h-4" aria-hidden="true" />
                </span>
              </a>
            </div>
          )}

          {/* Relevant Industries (bidirectional link to Industries.csv) */}
          {model.industries.length > 0 && (
            <section className="pt-4 border-t border-stone-200/80 space-y-2">
              <h3 className="text-sm font-bold text-stone-900">
                Ключевая модель в отраслях
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                {model.industries.map((industryName, idx) => (
                  <span key={industryName} className="inline-flex items-center gap-2">
                    {idx > 0 && (
                      <span className="text-stone-300" aria-hidden="true">
                        ·
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenIndustry(industryName)}
                      className="text-orange-600 hover:text-orange-700 hover:underline font-medium cursor-pointer py-1.5"
                    >
                      {industryName}
                    </button>
                  </span>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Related Business Models Column — strictly preserving RelatedBM.csv order */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 pt-5 lg:pt-0 border-t lg:border-t-0 border-stone-200/80">
          <div className="lg:rounded-2xl lg:border lg:border-stone-200/90 lg:bg-stone-50/50 lg:p-5">
            <div className="mb-3">
              <h3 className="text-[16px] font-bold text-stone-900">
                Смежные бизнес-модели
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {relatedModels.length > 0
                  ? `Модели, чаще всего сочетающиеся с «${model.name}» (${relatedModels.length})`
                  : `Связи для модели «${model.name}»`}
              </p>
            </div>

            {relatedModels.length > 0 ? (
              <ul className="divide-y divide-stone-200/80">
                {relatedModels.map((related) => (
                  <li key={related.name}>
                    <button
                      type="button"
                      onClick={() => onOpenModel(related.name)}
                      className="w-full py-3.5 lg:px-2 lg:rounded-xl flex items-center justify-between gap-3 text-left hover:bg-white/90 active:bg-stone-100 transition-colors cursor-pointer min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-semibold text-stone-900 truncate">
                          {related.name}
                        </div>
                        <div className="text-xs text-stone-500 truncate mt-0.5">
                          <span className="font-mono tabular-nums text-stone-400 mr-1">
                            № {related.number}
                          </span>
                          · {related.rusName}
                        </div>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 text-stone-400 shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500 py-3">
                Для этой бизнес-модели в справочнике смежных связей пока не указаны
                рекомендуемые комбинации.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
