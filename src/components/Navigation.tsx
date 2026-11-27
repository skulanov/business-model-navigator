import { Bookmark, Building2, ChevronLeft, Home, LayoutGrid, Shuffle } from 'lucide-react';
import type { TabId } from '../data/types';

interface DesktopTopBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onRandomModel: () => void;
}

export function DesktopTopBar({
  activeTab,
  onSelectTab,
  onRandomModel,
}: DesktopTopBarProps) {
  const navItems: { id: TabId; label: string }[] = [
    { id: 'home', label: 'Главная' },
    { id: 'models', label: 'Бизнес-модели' },
    { id: 'industries', label: 'Отрасли' },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 md:px-5 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className="text-base lg:text-lg font-bold tracking-tight text-stone-900 hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
        >
          Навигатор бизнес-моделей
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav aria-label="Основная навигация" className="flex items-center gap-4 lg:gap-7">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm ${
                  isActive
                    ? 'text-orange-600'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-orange-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary contextual action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onRandomModel}
            className="inline-flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Случайная модель</span>
          </button>
        </div>
      </div>
    </header>
  );
}

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function MobileHeader({
  title,
  showBack = false,
  onBack,
  isBookmarked,
  onToggleBookmark,
}: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      <div
        className={`h-[52px] px-2 items-center ${
          showBack || onToggleBookmark
            ? 'grid grid-cols-[76px_minmax(0,1fr)_76px]'
            : 'flex justify-center px-4'
        }`}
      >
        {(showBack || onToggleBookmark) && (
          <div className="flex items-center justify-start">
            {showBack && onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="min-h-[44px] px-1.5 inline-flex items-center gap-0.5 text-orange-600 font-medium text-[15px] active:opacity-70 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg whitespace-nowrap"
              >
                <ChevronLeft className="w-5 h-5 -ml-1 shrink-0" aria-hidden="true" />
                <span>Назад</span>
              </button>
            ) : (
              <span className="w-10" aria-hidden="true" />
            )}
          </div>
        )}

        <h1 className="text-[16px] font-bold text-stone-900 text-center truncate px-1 min-w-0">
          {title}
        </h1>

        {(showBack || onToggleBookmark) && (
          <div className="flex items-center justify-end">
            {onToggleBookmark ? (
              <button
                type="button"
                onClick={onToggleBookmark}
                aria-label={isBookmarked ? 'Убрать из избранного' : 'Добавить в избранное'}
                aria-pressed={Boolean(isBookmarked)}
                className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  isBookmarked ? 'text-orange-600' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Bookmark
                  className="w-5 h-5"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <span className="w-10" aria-hidden="true" />
            )}
          </div>
        )}
      </div>
    </header>
  );
}

interface MobileBottomTabsProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export function MobileBottomTabs({
  activeTab,
  onSelectTab,
}: MobileBottomTabsProps) {
  const tabs: { id: TabId; label: string; Icon: typeof Home }[] = [
    { id: 'home', label: 'Главная', Icon: Home },
    { id: 'models', label: 'Бизнес-модели', Icon: LayoutGrid },
    { id: 'industries', label: 'Отрасли', Icon: Building2 },
  ];

  return (
    <nav
      aria-label="Нижняя навигация"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 pb-safe"
    >
      <div className="grid grid-cols-3 h-16 items-center">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500 ${
                isActive ? 'text-orange-600' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Icon
                className="w-[22px] h-[22px]"
                strokeWidth={isActive ? 2.2 : 1.75}
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium leading-none tracking-tight whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
