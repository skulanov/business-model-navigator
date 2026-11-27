import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { INDUSTRIES, getIndustryModels } from '../data/businessModels';
import type { Industry } from '../data/types';

function pluralizeKeyModels(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'ключевая модель';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'ключевые модели';
  return 'ключевых моделей';
}

interface IndustriesListViewProps {
  onSelectIndustry: (industryName: string) => void;
}

export function IndustriesListView({ onSelectIndustry }: IndustriesListViewProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-3 md:pt-8 pb-10">
      {/* Desktop Heading */}
      <div className="hidden md:block mb-6">
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Отрасли
        </h2>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden divide-y divide-stone-200/80 border-t border-stone-200/80">
        {INDUSTRIES.map((industry) => (
          <button
            key={industry.id}
            type="button"
            onClick={() => onSelectIndustry(industry.name)}
            className="w-full py-3.5 flex items-center justify-between gap-3 text-left active:bg-stone-50 transition-colors cursor-pointer min-h-[68px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold text-stone-900 truncate">
                {industry.name}
              </div>
              <p className="text-xs text-stone-500 truncate mt-1">
                {industry.modelNames.join(' · ')}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Desktop Card Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRIES.map((industry) => (
          <button
            key={industry.id}
            type="button"
            onClick={() => onSelectIndustry(industry.name)}
            className="group text-left p-5 rounded-2xl border border-stone-200/90 bg-white hover:border-orange-300 hover:shadow-md hover:shadow-stone-900/[0.03] transition-all cursor-pointer flex flex-col justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <div className="space-y-2.5 w-full">
              <div className="flex items-center justify-between gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-50 group-hover:bg-orange-50 text-stone-500 group-hover:text-orange-600 flex items-center justify-center transition-colors">
                  <Building2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <ChevronRight
                  className="w-4 h-4 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0"
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                {industry.name}
              </h3>

              <p className="text-xs text-stone-500 leading-relaxed">
                {industry.modelNames.join(' · ')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface IndustryDetailViewProps {
  industry: Industry;
  onBack: () => void;
  onOpenModel: (modelName: string) => void;
}

export function IndustryDetailView({
  industry,
  onBack,
  onOpenModel,
}: IndustryDetailViewProps) {
  const models = getIndustryModels(industry.name);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-8 pb-10">
      {/* Desktop Back Bar */}
      <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-stone-200/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors cursor-pointer py-1.5 pr-3 -ml-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Все отрасли</span>
        </button>
        <span className="text-xs font-mono text-stone-400 tabular-nums">
          {models.length} {pluralizeKeyModels(models.length)}
        </span>
      </div>

      {/* Heading */}
      <header className="mb-5 md:mb-7 space-y-1.5">
        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-stone-900 break-words">
          {industry.name}
        </h2>
        <p className="text-sm md:text-[15px] text-stone-600">
          Ключевые бизнес-модели, наиболее характерные для отрасли ({models.length}).
          Нажмите на любую модель, чтобы изучить описание, примеры компаний и смежные связи.
        </p>
      </header>

      {/* Ordered List of Relevant Business Models (preserving BM1..BM5 order) */}
      <div className="divide-y divide-stone-200/80 border-t border-b border-stone-200/80 md:border-none md:divide-y-0 md:space-y-3">
        {models.map((model, index) => (
          <button
            key={model.name}
            type="button"
            onClick={() => onOpenModel(model.name)}
            className="group w-full py-4 md:p-5 md:rounded-2xl md:border md:border-stone-200/90 md:bg-white md:hover:border-orange-300 md:hover:shadow-sm flex items-center justify-between gap-3 md:gap-4 text-left active:bg-stone-50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <div className="flex items-start gap-3 md:gap-3.5 min-w-0 flex-1">
              <span className="font-mono text-xs font-semibold text-orange-600 bg-orange-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] md:text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors break-words">
                  <span className="font-mono text-stone-400 font-medium tabular-nums mr-1.5">
                    {model.number}
                  </span>
                  {model.name}
                  {model.rusName !== model.name && (
                    <span className="font-normal text-stone-500 text-sm">
                      {' '}
                      · {model.rusName}
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                  {model.shortDescription}
                </p>
                {model.examples.length > 0 && (
                  <p className="text-xs text-stone-400 mt-1.5 truncate">
                    Примеры: {model.examples.map((ex) => ex.company).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight
              className="w-5 h-5 text-stone-400 group-hover:text-orange-600 shrink-0 transition-colors"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
