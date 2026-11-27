/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { HomeView } from './components/HomeView';
import { IndustriesListView, IndustryDetailView } from './components/IndustriesView';
import { ModelDetailView } from './components/ModelDetailView';
import { ModelsCatalogView } from './components/ModelsCatalogView';
import {
  DesktopTopBar,
  MobileBottomTabs,
  MobileHeader,
} from './components/Navigation';
import {
  BUSINESS_MODELS,
  BUSINESS_MODEL_BY_NAME,
  INDUSTRY_BY_NAME,
} from './data/businessModels';
import type { RouteView, TabId } from './data/types';

const FAVORITES_KEY = 'bm_navigator_favorites_v1';
const RECENT_KEY = 'bm_navigator_recent_v1';

function readStoredArray(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeStoredArray(key: string, values: string[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

function parseHashToRoute(hash: string): RouteView {
  const cleaned = hash.replace(/^#\/?/, '').trim();
  if (!cleaned || cleaned === 'home') {
    return { tab: 'home' };
  }

  const parts = cleaned.split('/').map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });

  if (parts[0] === 'models') {
    const modelName = parts[1];
    if (modelName && BUSINESS_MODEL_BY_NAME.has(modelName)) {
      return { tab: 'models', modelName };
    }
    return { tab: 'models' };
  }

  if (parts[0] === 'industries') {
    const industryName = parts[1];
    const modelName = parts[2];
    if (industryName && INDUSTRY_BY_NAME.has(industryName)) {
      if (modelName && BUSINESS_MODEL_BY_NAME.has(modelName)) {
        return { tab: 'industries', industryName, modelName };
      }
      return { tab: 'industries', industryName };
    }
    return { tab: 'industries' };
  }

  return { tab: 'home' };
}

function routeToHash(route: RouteView): string {
  if (route.tab === 'home') {
    return '#/home';
  }
  if (route.tab === 'models') {
    return route.modelName
      ? `#/models/${encodeURIComponent(route.modelName)}`
      : '#/models';
  }
  if (route.industryName && route.modelName) {
    return `#/industries/${encodeURIComponent(route.industryName)}/${encodeURIComponent(route.modelName)}`;
  }
  if (route.industryName) {
    return `#/industries/${encodeURIComponent(route.industryName)}`;
  }
  return '#/industries';
}

function sameRoute(a: RouteView, b: RouteView): boolean {
  if (a.tab !== b.tab) return false;
  if (a.tab === 'models' && b.tab === 'models') {
    return a.modelName === b.modelName;
  }
  if (a.tab === 'industries' && b.tab === 'industries') {
    return a.industryName === b.industryName && a.modelName === b.modelName;
  }
  return true;
}

export default function App() {
  const [historyStack, setHistoryStack] = useState<RouteView[]>(() => [
    parseHashToRoute(window.location.hash),
  ]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStoredArray(FAVORITES_KEY)
  );
  const [recentNames, setRecentNames] = useState<string[]>(() =>
    readStoredArray(RECENT_KEY)
  );

  const currentRoute = historyStack[historyStack.length - 1] ?? { tab: 'home' };

  const syncHash = useCallback((route: RouteView) => {
    const nextHash = routeToHash(route);
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  }, []);

  const recordRecentModel = useCallback((modelName: string) => {
    setRecentNames((prev) => {
      const next = [modelName, ...prev.filter((n) => n !== modelName)].slice(0, 8);
      writeStoredArray(RECENT_KEY, next);
      return next;
    });
  }, []);

  const navigateTo = useCallback(
    (nextRoute: RouteView, options?: { replaceStack?: boolean }) => {
      setHistoryStack((prev) => {
        const top = prev[prev.length - 1];
        if (top && sameRoute(top, nextRoute)) {
          return prev;
        }
        return options?.replaceStack ? [nextRoute] : [...prev, nextRoute];
      });
      syncHash(nextRoute);
      if ('modelName' in nextRoute && nextRoute.modelName) {
        recordRecentModel(nextRoute.modelName);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [recordRecentModel, syncHash]
  );

  // Support browser back/forward buttons via hashchange
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashToRoute(window.location.hash);
      setHistoryStack((prev) => {
        const top = prev[prev.length - 1];
        if (top && sameRoute(top, parsed)) return prev;
        const existingIndex = prev.findIndex((item) => sameRoute(item, parsed));
        if (existingIndex >= 0) {
          return prev.slice(0, existingIndex + 1);
        }
        return [...prev, parsed];
      });
      if ('modelName' in parsed && parsed.modelName) {
        recordRecentModel(parsed.modelName);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [recordRecentModel]);

  const handleSelectTab = useCallback(
    (tab: TabId) => {
      navigateTo({ tab }, { replaceStack: true });
    },
    [navigateTo]
  );

  const handleOpenCatalog = useCallback(
    (initialQuery?: string) => {
      if (typeof initialQuery === 'string') {
        setCatalogSearch(initialQuery);
      }
      navigateTo({ tab: 'models' }, { replaceStack: true });
    },
    [navigateTo]
  );

  const handleOpenModel = useCallback(
    (modelName: string) => {
      if (!BUSINESS_MODEL_BY_NAME.has(modelName)) return;
      if (currentRoute.tab === 'industries' && currentRoute.industryName) {
        navigateTo({
          tab: 'industries',
          industryName: currentRoute.industryName,
          modelName,
        });
      } else {
        navigateTo({ tab: 'models', modelName });
      }
    },
    [currentRoute, navigateTo]
  );

  const handleOpenIndustry = useCallback(
    (industryName: string) => {
      if (!INDUSTRY_BY_NAME.has(industryName)) return;
      navigateTo({ tab: 'industries', industryName });
    },
    [navigateTo]
  );

  const handleRandomModel = useCallback(() => {
    const currentModelName =
      'modelName' in currentRoute ? currentRoute.modelName : undefined;
    const pool = BUSINESS_MODELS.filter((m) => m.name !== currentModelName);
    const picked = pool[Math.floor(Math.random() * pool.length)] ?? BUSINESS_MODELS[0];
    navigateTo({ tab: 'models', modelName: picked.name });
  }, [currentRoute, navigateTo]);

  const handleBack = useCallback(() => {
    if (historyStack.length > 1) {
      const nextStack = historyStack.slice(0, -1);
      const target = nextStack[nextStack.length - 1];
      setHistoryStack(nextStack);
      syncHash(target);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    // Fallback when user landed directly on a deep link
    if (currentRoute.tab === 'industries' && currentRoute.modelName && currentRoute.industryName) {
      navigateTo(
        { tab: 'industries', industryName: currentRoute.industryName },
        { replaceStack: true }
      );
    } else if (currentRoute.tab === 'industries' && currentRoute.industryName) {
      navigateTo({ tab: 'industries' }, { replaceStack: true });
    } else if (currentRoute.tab === 'models' && currentRoute.modelName) {
      navigateTo({ tab: 'models' }, { replaceStack: true });
    } else {
      navigateTo({ tab: 'home' }, { replaceStack: true });
    }
  }, [currentRoute, historyStack, navigateTo, syncHash]);

  const handleToggleFavorite = useCallback((modelName: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(modelName);
      const next = exists ? prev.filter((n) => n !== modelName) : [modelName, ...prev];
      writeStoredArray(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  // Resolve active detail objects
  const activeModel =
    'modelName' in currentRoute && currentRoute.modelName
      ? BUSINESS_MODEL_BY_NAME.get(currentRoute.modelName)
      : undefined;

  const activeIndustry =
    currentRoute.tab === 'industries' && currentRoute.industryName
      ? INDUSTRY_BY_NAME.get(currentRoute.industryName)
      : undefined;

  // Determine mobile top bar state
  const isDetailScreen = Boolean(activeModel || activeIndustry);
  let mobileTitle = 'Навигатор';
  if (activeModel) {
    mobileTitle = activeModel.title;
  } else if (activeIndustry) {
    mobileTitle = activeIndustry.name;
  } else if (currentRoute.tab === 'models') {
    mobileTitle = 'Бизнес-модели';
  } else if (currentRoute.tab === 'industries') {
    mobileTitle = 'Отрасли';
  } else {
    mobileTitle = 'Главная';
  }

  return (
    <div className="min-h-dvh flex flex-col bg-white text-stone-900">
      {/* Desktop Top Navigation */}
      <DesktopTopBar
        activeTab={currentRoute.tab}
        onSelectTab={handleSelectTab}
        onRandomModel={handleRandomModel}
      />

      {/* Mobile Sticky Header */}
      <MobileHeader
        title={mobileTitle}
        showBack={isDetailScreen}
        onBack={handleBack}
        isBookmarked={activeModel ? favorites.includes(activeModel.name) : undefined}
        onToggleBookmark={
          activeModel ? () => handleToggleFavorite(activeModel.name) : undefined
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeModel ? (
          <ModelDetailView
            key={activeModel.name}
            model={activeModel}
            isFavorite={favorites.includes(activeModel.name)}
            onToggleFavorite={() => handleToggleFavorite(activeModel.name)}
            onBack={handleBack}
            onOpenModel={handleOpenModel}
            onOpenIndustry={handleOpenIndustry}
          />
        ) : currentRoute.tab === 'home' ? (
          <HomeView
            favorites={favorites}
            recentNames={recentNames}
            onOpenModel={handleOpenModel}
            onOpenCatalog={handleOpenCatalog}
            onOpenIndustries={() => handleSelectTab('industries')}
          />
        ) : currentRoute.tab === 'models' ? (
          <ModelsCatalogView
            searchQuery={catalogSearch}
            onSearchChange={setCatalogSearch}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenModel={handleOpenModel}
          />
        ) : activeIndustry ? (
          <IndustryDetailView
            industry={activeIndustry}
            onBack={handleBack}
            onOpenModel={handleOpenModel}
          />
        ) : (
          <IndustriesListView onSelectIndustry={handleOpenIndustry} />
        )}
      </main>

      {/* Responsive Footer (clears fixed bottom tab bar + safe area on mobile) */}
      <footer className="border-t border-stone-200/80 bg-stone-50/50 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-stone-500">
          <span>by Dmitry Skulanov, 2026</span>
          <span>На основе методологии Business Model Navigator</span>
        </div>
      </footer>

      {/* Mobile Fixed 3-Tab Bottom Bar */}
      <MobileBottomTabs
        activeTab={currentRoute.tab}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}
