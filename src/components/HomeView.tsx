import {
  ArrowRight,
  Bookmark,
  Building2,
  ChevronRight,
  LayoutGrid,
  Search,
  Shuffle,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { BUSINESS_MODELS } from '../data/businessModels';
import type { BusinessModel } from '../data/types';

interface HomeViewProps {
  favorites: string[];
  recentNames: string[];
  onOpenModel: (modelName: string) => void;
  onOpenCatalog: (initialQuery?: string) => void;
  onOpenIndustries: () => void;
}

const FEATURED_MODEL_NAMES = [
  'Freemium',
  'Subscription',
  'Two-sided Market',
  'Razor And Blade',
  'Leverage Customer Data',
  'Direct Selling',
];

export function HomeView({
  favorites,
  recentNames,
  onOpenModel,
  onOpenCatalog,
  onOpenIndustries,
}: HomeViewProps) {
  const [quickQuery, setQuickQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(() => {
    const daySeed = new Date().getDate();
    return daySeed % BUSINESS_MODELS.length;
  });

  const spotlightModel = BUSINESS_MODELS[spotlightIndex] ?? BUSINESS_MODELS[0];

  const quickMatches = useMemo(() => {
    const q = quickQuery.trim().toLowerCase();
    if (!q) return [];
    return BUSINESS_MODELS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.rusName.toLowerCase().includes(q) ||
        m.shortDescription.toLowerCase().includes(q) ||
        String(m.number) === q ||
        m.examples.some((ex) => ex.company.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [quickQuery]);

  const favoriteModels = useMemo(() => {
    return favorites
      .map((name) => BUSINESS_MODELS.find((m) => m.name === name))
      .filter((m): m is BusinessModel => Boolean(m));
  }, [favorites]);

  const recentModels = useMemo(() => {
    return recentNames
      .map((name) => BUSINESS_MODELS.find((m) => m.name === name))
      .filter((m): m is BusinessModel => Boolean(m))
      .slice(0, 5);
  }, [recentNames]);

  const featuredModels = useMemo(() => {
    return FEATURED_MODEL_NAMES.map((name) =>
      BUSINESS_MODELS.find((m) => m.name === name)
    ).filter((m): m is BusinessModel => Boolean(m));
  }, []);

  const handleDrawAnother = () => {
    setSpotlightIndex((prev) => {
      let next = Math.floor(Math.random() * BUSINESS_MODELS.length);
      if (next === prev) {
        next = (prev + 1) % BUSINESS_MODELS.length;
      }
      return next;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCatalog(quickQuery.trim());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-10 pb-8 md:pb-10 space-y-6 md:space-y-10">
      {/* Hero + Quick Search */}
      <section className="space-y-4 md:space-y-5 max-w-3xl">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
            Навигатор бизнес-моделей
          </h2>
          <p className="text-[15px] md:text-base text-stone-600 leading-relaxed max-w-2xl">
            Практический справочник проверенных бизнес-моделей: изучайте механику создания
            ценности, примеры компаний, смежные комбинации и ключевые паттерны вашей отрасли.
          </p>
        </div>

        {/* Instant Search */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <div className="relative">
            <Search
              className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Поиск модели или компании..."
              aria-label="Быстрый поиск бизнес-моделей"
              className={`w-full h-12 pl-10 rounded-xl bg-stone-100/90 border border-transparent focus:bg-white focus:border-orange-500 focus:outline-none text-base md:text-[15px] text-stone-900 placeholder:text-stone-400 transition-colors ${
                quickQuery ? 'pr-[108px]' : 'pr-[76px]'
              }`}
            />
            {quickQuery && (
              <button
                type="button"
                onClick={() => setQuickQuery('')}
                aria-label="Очистить поиск"
                className="absolute right-[68px] top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-3.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Найти
            </button>
          </div>

          {quickQuery.trim().length > 0 && (
            <div className="mt-2 bg-white border border-stone-200 rounded-2xl shadow-lg shadow-stone-900/5 overflow-hidden">
              {quickMatches.length > 0 ? (
                <>
                  <ul className="divide-y divide-stone-100">
                    {quickMatches.map((model) => (
                      <li key={model.name}>
                        <button
                          type="button"
                          onClick={() => onOpenModel(model.name)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer min-h-[52px]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-stone-900 truncate">
                              <span className="font-mono text-stone-400 tabular-nums mr-1.5">
                                {model.number}
                              </span>
                              {model.name}
                              {model.rusName !== model.name && (
                                <span className="font-normal text-stone-500">
                                  {' '}
                                  · {model.rusName}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 truncate mt-0.5">
                              {model.shortDescription}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => onOpenCatalog(quickQuery.trim())}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-orange-600 bg-stone-50/80 hover:bg-orange-50/60 transition-colors text-left flex items-center justify-between cursor-pointer border-t border-stone-100"
                  >
                    <span>Показать все результаты в каталоге</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="px-4 py-4 text-sm text-stone-500">
                  По запросу «{quickQuery}» ничего не найдено. Попробуйте другое ключевое слово.
                </div>
              )}
            </div>
          )}
        </form>
      </section>

      {/* Primary Section Entry Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => onOpenCatalog()}
          className="group text-left p-4 sm:p-5 md:p-6 rounded-2xl bg-stone-50/80 hover:bg-orange-50/50 active:bg-orange-50/70 border border-stone-200/80 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 min-h-[68px]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-orange-600 shrink-0">
              <LayoutGrid className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-[16px] sm:text-lg font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
              Каталог бизнес-моделей
            </h3>
          </div>
          <ChevronRight
            className="w-5 h-5 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={onOpenIndustries}
          className="group text-left p-4 sm:p-5 md:p-6 rounded-2xl bg-stone-50/80 hover:bg-orange-50/50 active:bg-orange-50/70 border border-stone-200/80 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 min-h-[68px]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-orange-600 shrink-0">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-[16px] sm:text-lg font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
              Отраслевые подборки
            </h3>
          </div>
          <ChevronRight
            className="w-5 h-5 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0"
            aria-hidden="true"
          />
        </button>
      </section>

      {/* Spotlight Randomizer + Quick Industry Access */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Pattern of the Moment */}
        <div className="lg:col-span-7 rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-stone-500">
              Идея для размышления
            </span>
            <button
              type="button"
              onClick={handleDrawAnother}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 py-2 px-2.5 -mr-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer whitespace-nowrap min-h-[36px]"
            >
              <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Другая модель</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <span className="font-mono text-sm font-medium text-orange-600 tabular-nums shrink-0">
                № {spotlightModel.number}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-stone-900 break-words">
                {spotlightModel.name}
              </h3>
            </div>
            {spotlightModel.rusName !== spotlightModel.name && (
              <p className="text-sm text-stone-500">{spotlightModel.rusName}</p>
            )}
            <p className="text-[15px] font-medium text-stone-800 leading-relaxed pt-1">
              {spotlightModel.shortDescription}
            </p>
          </div>

          {spotlightModel.examples[0] && (
            <div className="pt-3 border-t border-stone-100 text-sm text-stone-600 leading-relaxed">
              <span className="font-semibold text-stone-800">
                Пример — {spotlightModel.examples[0].company}:{' '}
              </span>
              {spotlightModel.examples[0].description}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onOpenModel(spotlightModel.name)}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Открыть карточку</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Favorites / Recently Viewed / Popular */}
        <div className="lg:col-span-5 space-y-6">
          {favoriteModels.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-orange-600" fill="currentColor" aria-hidden="true" />
                  <span>Избранные модели</span>
                </h3>
                <span className="text-xs font-mono text-stone-400 tabular-nums">
                  {favoriteModels.length}
                </span>
              </div>
              <div className="divide-y divide-stone-200/70 border-t border-b border-stone-200/70">
                {favoriteModels.slice(0, 5).map((model) => (
                  <button
                    key={model.name}
                    type="button"
                    onClick={() => onOpenModel(model.name)}
                    className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer min-h-[52px]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-stone-900 truncate">
                        <span className="font-mono text-stone-400 tabular-nums mr-1.5">
                          {model.number}
                        </span>
                        {model.name}
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        {model.shortDescription}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-stone-900">
                {recentModels.length > 0 ? 'Недавно просмотренные' : 'Популярные модели'}
              </h3>
              <button
                type="button"
                onClick={() => onOpenCatalog()}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer whitespace-nowrap py-1"
              >
                Все 60 моделей
              </button>
            </div>
            <div className="divide-y divide-stone-200/70 border-t border-b border-stone-200/70">
              {(recentModels.length > 0 ? recentModels : featuredModels).map((model) => (
                <button
                  key={model.name}
                  type="button"
                  onClick={() => onOpenModel(model.name)}
                  className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer min-h-[52px]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-stone-900 truncate">
                      <span className="font-mono text-stone-400 tabular-nums mr-1.5">
                        {model.number}
                      </span>
                      {model.name}
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {model.shortDescription}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
