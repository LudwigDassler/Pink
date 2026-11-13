import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  SITE_CONFIG,
  type SelectedPosition,
  type SiteConfig,
} from './config/siteConfig';
import { Header, type TabId } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CatalogGrid } from './components/CatalogGrid';
import { OfficialPrintSheet, TermsSection } from './components/TermsSection';
import { ContactsSection } from './components/ContactsSection';
import { MobileBottomBar } from './components/MobileBottomBar';
import { Footer } from './components/Footer';
import { LegalSection } from './components/LegalSection';
import { CookieBanner } from './components/CookieBanner';
import { RequestBuilder } from './components/RequestBuilder';
import { CategoryModal } from './components/CategoryModal';
import { AdminConfigDrawer } from './components/AdminConfigDrawer';

const POSITIONS_STORAGE_KEY = 'b2b_selected_positions_v1';

function parseHashToTab(hash: string): TabId {
  const normalized = hash.replace(/^#/, '').trim().toLowerCase();
  if (normalized === 'terms') return 'terms';
  if (normalized === 'contacts') return 'contacts';
  if (normalized === 'legal') return 'legal';
  return 'main';
}

function loadInitialPositions(): SelectedPosition[] {
  try {
    const raw = window.localStorage.getItem(POSITIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SelectedPosition =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as SelectedPosition).categoryId === 'string' &&
        typeof (item as SelectedPosition).note === 'string',
    );
  } catch {
    return [];
  }
}

export function App(): React.JSX.Element {
  const [config, setConfig] = useState<SiteConfig>(SITE_CONFIG);
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    parseHashToTab(window.location.hash),
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(
    () => new URLSearchParams(window.location.search).get('edit') === '1',
  );
  const [selectedPositions, setSelectedPositions] =
    useState<SelectedPosition[]>(loadInitialPositions);
  const [activeModalCategoryId, setActiveModalCategoryId] = useState<
    string | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string): void => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        POSITIONS_STORAGE_KEY,
        JSON.stringify(selectedPositions),
      );
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [selectedPositions]);

  useEffect(() => {
    const validIds = new Set(config.categories.map((c) => c.id));
    setSelectedPositions((prev) => {
      const filtered = prev.filter((pos) => validIds.has(pos.categoryId));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [config.categories]);

  useEffect(() => {
    const handleLocationSync = (): void => {
      const nextTab = parseHashToTab(window.location.hash);
      setActiveTab((prev) => {
        if (prev !== nextTab) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return nextTab;
      });
    };

    window.addEventListener('hashchange', handleLocationSync);
    window.addEventListener('popstate', handleLocationSync);
    return () => {
      window.removeEventListener('hashchange', handleLocationSync);
      window.removeEventListener('popstate', handleLocationSync);
    };
  }, []);

  const navigateTab = useCallback((nextTab: TabId): void => {
    const nextUrl = `${window.location.pathname}${window.location.search}#${nextTab}`;
    if (window.location.hash !== `#${nextTab}`) {
      window.history.pushState(null, '', nextUrl);
    }
    setActiveTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToElement = useCallback((elementId: string): void => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleTogglePosition = useCallback((categoryId: string): void => {
    setSelectedPositions((prev) => {
      const exists = prev.some((item) => item.categoryId === categoryId);
      if (exists) {
        return prev.filter((item) => item.categoryId !== categoryId);
      }
      return [...prev, { categoryId, note: '' }];
    });
  }, []);

  const handleSavePosition = useCallback(
    (categoryId: string, note: string): void => {
      setSelectedPositions((prev) => {
        const exists = prev.some((item) => item.categoryId === categoryId);
        if (exists) {
          return prev.map((item) =>
            item.categoryId === categoryId ? { ...item, note } : item,
          );
        }
        return [...prev, { categoryId, note }];
      });
    },
    [],
  );

  const handleUpdatePositionNote = useCallback(
    (categoryId: string, note: string): void => {
      setSelectedPositions((prev) => {
        const exists = prev.some((item) => item.categoryId === categoryId);
        if (exists) {
          return prev.map((item) =>
            item.categoryId === categoryId ? { ...item, note } : item,
          );
        }
        return [...prev, { categoryId, note }];
      });
    },
    [],
  );

  const handleRemovePosition = useCallback((categoryId: string): void => {
    setSelectedPositions((prev) =>
      prev.filter((item) => item.categoryId !== categoryId),
    );
  }, []);

  const handleSelectAll = useCallback((): void => {
    setSelectedPositions((prev) => {
      const existingNotes = new Map(
        prev.map((item) => [item.categoryId, item.note]),
      );
      return config.categories.map((cat) => ({
        categoryId: cat.id,
        note: existingNotes.get(cat.id) ?? '',
      }));
    });
  }, [config.categories]);

  const handleClearAll = useCallback((): void => {
    setSelectedPositions([]);
  }, []);

  const handleActivateEditMode = useCallback((): void => {
    setIsEditMode(true);
    showToast('Режим правки активирован');
  }, [showToast]);

  const handleExitEditMode = useCallback((): void => {
    setIsEditMode(false);
    const params = new URLSearchParams(window.location.search);
    if (params.has('edit')) {
      params.delete('edit');
      const query = params.toString();
      const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', nextUrl);
    }
  }, []);

  return (
    <>
      <div className="min-h-dvh flex flex-col bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden print:hidden">
        <Header
          config={config}
          activeTab={activeTab}
          selectedCount={selectedPositions.length}
          onNavigateTab={navigateTab}
          showToast={showToast}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-28 md:pb-12">
          {activeTab === 'main' && (
            <div className="space-y-6">
              <HeroSection
                config={config}
                onScrollToCatalog={() => scrollToElement('catalog')}
                onOpenContacts={() => navigateTab('contacts')}
              />
              <CatalogGrid
                config={config}
                selectedPositions={selectedPositions}
                onTogglePosition={handleTogglePosition}
                onOpenModal={setActiveModalCategoryId}
                onScrollToBuilder={() => scrollToElement('request-builder')}
              />
              <RequestBuilder
                config={config}
                selectedPositions={selectedPositions}
                onUpdatePositionNote={handleUpdatePositionNote}
                onRemovePosition={handleRemovePosition}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
                onOpenModal={setActiveModalCategoryId}
                showToast={showToast}
              />
            </div>
          )}

          {activeTab === 'terms' && (
            <TermsSection
              config={config}
              onGoToCatalog={() => navigateTab('main')}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsSection config={config} showToast={showToast} />
          )}

          {activeTab === 'legal' && <LegalSection config={config} />}
        </main>

        <Footer
          config={config}
          activeTab={activeTab}
          onNavigateTab={navigateTab}
          onActivateEditMode={handleActivateEditMode}
        />

        <MobileBottomBar config={config} />

        <CookieBanner onOpenLegal={() => navigateTab('legal')} />

        <CategoryModal
          config={config}
          activeCategoryId={activeModalCategoryId}
          selectedPositions={selectedPositions}
          onClose={() => setActiveModalCategoryId(null)}
          onSwitchCategory={setActiveModalCategoryId}
          onSavePosition={handleSavePosition}
          onRemovePosition={handleRemovePosition}
          showToast={showToast}
        />

        <AdminConfigDrawer
          isOpen={isEditMode}
          config={config}
          onChangeConfig={setConfig}
          onResetDefault={() => setConfig(SITE_CONFIG)}
          onExitEditMode={handleExitEditMode}
          showToast={showToast}
        />

        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-20 right-4 left-4 sm:left-auto z-[60] sm:max-w-sm bg-[#0F172A] text-white rounded-xl px-4 py-3 shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm font-semibold print:hidden"
          >
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span className="break-words">{toastMessage}</span>
          </div>
        )}
      </div>

      <OfficialPrintSheet config={config} />
    </>
  );
}

export default App;
