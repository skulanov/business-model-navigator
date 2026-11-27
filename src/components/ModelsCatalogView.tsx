import { Bookmark, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BUSINESS_MODELS, INDUSTRIES } from '../data/businessModels';
import type { BusinessModel } from '../data/types';

interface ModelsCatalogViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favorites: string[];
  onToggleFavorite: (modelName: string) => void;
  onOpenModel: (modelName: string) => void;
}

export function ModelsCatalogView({
  searchQuery,
  onSearchChange,
  favorites,
  onToggleFavorite,
  onOpenModel,
}: ModelsCatalogViewProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = BUSINESS_MODELS.filter((model) => {
      if (onlyFavorites && !favoriteSet.has(model.name)) {
        return false;
      }
      if (selectedIndustry !== 'all' && !model.industries.includes(selectedIndustry)) {
        return false;
      }
      if (!q) return true;

      return (
        model.name.toLowerCase().includes(q) ||
        model.rusName.toLowerCase().includes(q) ||
        model.shortDescription.toLowerCase().includes(q) ||
        model.fullDescriptionRu.toLowerCase().includes(q) ||
        String(model.number) === q ||
        model.examples.some((ex) => ex.company.toLowerCase().includes(q))
      );
    });

    return [...matched].sort((a, b) => a.number - b.number);
  }, [searchQuery, onlyFavorites, favoriteSet, selectedIndustry]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedIndustry !== 'all' || onlyFavorites;

  const resetFilters = () => {
    onSearchChange('');
    setSelectedIndustry('all');
    setOnlyFavorites(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-3 md:pt-8 pb-8">
      {/* Desktop Header */}
      <div className="hidden md:flex items-end justify-between gap-6 mb-6">
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Бизнес-модели
        </h2>
        <div className="text-sm text-stone-500 font-mono tabular-nums whitespace-nowrap">
          {filteredModels.length} / {BUSINESS_MODELS.length}
        </div>
      </div>

      {/* Search & Controls */}
      <div className="space-y-3 mb-3 md:mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search
              className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск"
              aria-label="Поиск бизнес-моделей"
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-stone-100/90 border border-transparent focus:bg-white focus:border-orange-500 focus:outline-none text-base md:text-[15px] text-stone-900 placeholder:text-stone-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Очистить поиск"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFiltersMobile((v) => !v)}
            aria-expanded={showFiltersMobile}
            aria-label="Фильтры"
            className={`md:hidden min-h-[44px] min-w-[44px] px-3 rounded-xl border inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              showFiltersMobile || selectedIndustry !== 'all' || onlyFavorites
                ? 'border-orange-300 bg-orange-50 text-orange-600'
                : 'border-stone-200 bg-white text-stone-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Filter Toolbar (always visible on md+, toggleable on mobile to keep screenshot 1 ultra-clean) */}
        <div
          className={`${
            showFiltersMobile ? 'flex' : 'hidden md:flex'
          } flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-2.5 sm:gap-3 pt-1`}
        >
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 w-full sm:w-auto">
            {/* Segmented All / Favorites */}
            <div className="grid grid-cols-2 sm:inline-flex items-center p-1 bg-stone-100 rounded-xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setOnlyFavorites(false)}
                className={`min-h-[38px] md:min-h-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  !onlyFavorites
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Все ({BUSINESS_MODELS.length})
              </button>
              <button
                type="button"
                onClick={() => setOnlyFavorites(true)}
                className={`min-h-[38px] md:min-h-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  onlyFavorites
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Избранное ({favorites.length})
              </button>
            </div>

            {/* Industry Filter */}
            <label className="block sm:inline-flex items-center w-full sm:w-auto">
              <span className="sr-only">Фильтр по отрасли</span>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full sm:w-auto max-w-full min-h-[44px] md:min-h-0 md:h-9 px-3 rounded-xl bg-white border border-stone-200 text-base md:text-xs font-medium text-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="all">Все отрасли</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry.id} value={industry.name}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="md:hidden text-xs text-stone-500 font-mono tabular-nums">
                Найдено: {filteredModels.length} из {BUSINESS_MODELS.length}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer whitespace-nowrap py-1.5"
              >
                Сбросить
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 ? (
        <div className="py-16 text-center space-y-3 border-t border-stone-200/70">
          <p className="text-base font-semibold text-stone-900">Ничего не найдено</p>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            {onlyFavorites
              ? 'В избранном пока нет моделей. Откройте любую бизнес-модель и нажмите значок закладки.'
              : 'Попробуйте изменить поисковый запрос или сбросить активные фильтры.'}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 inline-flex items-center px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          {/* Mobile List View — faithful to Screenshot 1 */}
          <div className="md:hidden divide-y divide-stone-200/80 border-t border-stone-200/80">
            {filteredModels.map((model) => (
              <MobileModelRow
                key={model.name}
                model={model}
                isFavorite={favoriteSet.has(model.name)}
                onOpen={() => onOpenModel(model.name)}
              />
            ))}
          </div>

          {/* Desktop Card Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <DesktopModelCard
                key={model.name}
                model={model}
                isFavorite={favoriteSet.has(model.name)}
                onToggleFavorite={() => onToggleFavorite(model.name)}
                onOpen={() => onOpenModel(model.name)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobileModelRow({
  model,
  isFavorite,
  onOpen,
}: {
  model: BusinessModel;
  isFavorite: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full py-3.5 flex items-center justify-between gap-3 text-left active:bg-stone-50 transition-colors cursor-pointer min-h-[66px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[15px] font-bold text-stone-900 truncate">
            <span className="tabular-nums mr-1.5">{model.number}</span>
            {model.name}
          </span>
          {isFavorite && (
            <Bookmark
              className="w-3.5 h-3.5 text-orange-600 shrink-0"
              fill="currentColor"
              aria-label="В избранном"
            />
          )}
        </div>
        <p className="text-[13.5px] text-stone-500 truncate mt-0.5 leading-snug">
          {model.shortDescription}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
    </button>
  );
}

function DesktopModelCard({
  model,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: {
  model: BusinessModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white hover:border-orange-300 hover:shadow-md hover:shadow-stone-900/[0.03] transition-all">
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 text-left p-5 pb-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-t-2xl"
      >
        <div className="pr-8">
          <h3 className="text-[16px] font-bold text-stone-900 group-hover:text-orange-600 transition-colors leading-snug">
            <span className="font-mono text-sm font-medium text-stone-400 tabular-nums mr-2">
              {model.number}
            </span>
            {model.name}
          </h3>
          {model.rusName !== model.name && (
            <p className="text-xs text-stone-500 mt-0.5">{model.rusName}</p>
          )}
        </div>
        <p className="text-sm text-stone-600 mt-3 leading-relaxed line-clamp-3">
          {model.shortDescription}
        </p>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        aria-pressed={isFavorite}
        className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
          isFavorite
            ? 'text-orange-600 bg-orange-50/70'
            : 'text-stone-300 hover:text-stone-600 hover:bg-stone-100'
        }`}
      >
        <Bookmark
          className="w-4 h-4"
          fill={isFavorite ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        onClick={onOpen}
        className="px-5 py-3 border-t border-stone-100 flex items-center justify-end text-xs text-stone-500 cursor-pointer rounded-b-2xl hover:bg-stone-50/70 transition-colors"
      >
        <span className="inline-flex items-center gap-1 font-medium text-stone-700 group-hover:text-orange-600 transition-colors">
          <span>Подробнее</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </button>
    </article>
  );
}
