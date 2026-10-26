'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { UpraitySidebar } from '../components/UpraitySidebar';
import { UpraityFilterTabs, HomeTab } from '../components/UpraityFilterTabs';
import { UpraityGrid } from '../components/UpraityGrid';
import { ThemeToggle } from '../components/ThemeToggle';
import { UpraityFooter } from '../components/UpraityFooter';
import { UPRAITY_DATA, UpraityItem } from '../data/upraityData';
import { THOUGHTS_DATA, ThoughtArticle } from '../data/thoughtsData';
import { EXPERIMENTS_DATA, ExperimentItem } from '../data/experimentsData';
import { fetchPortfolioItems } from '../services/cmsApi';
import { X, Hammer } from 'lucide-react';

// Lazy load secondary sections and heavy interactive modals with next/dynamic
const GallerySection = dynamic(
  () => import('../components/GallerySection').then((m) => m.GallerySection),
  {
    loading: () => (
      <div className="py-24 text-center text-xs font-mono text-white/50 animate-pulse tracking-widest uppercase">
        Loading Architectural Gallery...
      </div>
    ),
  }
);

const ThoughtsSection = dynamic(
  () => import('../components/ThoughtsSection').then((m) => m.ThoughtsSection),
  {
    loading: () => (
      <div className="py-24 text-center text-xs font-mono text-white/50 animate-pulse tracking-widest uppercase">
        Loading Thoughts & Essays...
      </div>
    ),
  }
);

const ExperimentsSection = dynamic(
  () => import('../components/ExperimentsSection').then((m) => m.ExperimentsSection),
  {
    loading: () => (
      <div className="py-24 text-center text-xs font-mono text-white/50 animate-pulse tracking-widest uppercase">
        Loading Material Studies...
      </div>
    ),
  }
);

const UpraityDetailModal = dynamic(
  () => import('../components/UpraityDetailModal').then((m) => m.UpraityDetailModal),
  { ssr: false }
);

const QuoteModal = dynamic(
  () => import('../components/QuoteModal').then((m) => m.QuoteModal),
  { ssr: false }
);

export default function UpraityAndSonPage() {
  const [items, setItems] = useState<UpraityItem[]>(UPRAITY_DATA);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<HomeTab>('works');

  // Modals state
  const [activeModalItem, setActiveModalItem] = useState<UpraityItem | null>(null);
  const [activeArticle, setActiveArticle] = useState<ThoughtArticle | null>(null);
  const [selectedExp, setSelectedExp] = useState<ExperimentItem | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePreselectedItem, setQuotePreselectedItem] = useState<UpraityItem | null>(null);

  // Load CMS items if available
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const liveItems = await fetchPortfolioItems({ status: 'published' });
        if (liveItems && liveItems.length > 0) {
          const mapped: UpraityItem[] = liveItems.map((p) => ({
            id: p._id,
            title: p.title,
            category: p.category,
            categoryLabel: p.categoryLabel || 'Memorial',
            material: p.material,
            dimensions: p.dimensions,
            cemeteryType: p.cemeteryType,
            image: p.image,
            caption: p.caption || p.title,
            description: p.description || '',
            craftsmanshipNotes: p.craftsmanshipNotes || '',
            year: p.year,
            aspectRatio: p.aspectRatio || 'standard',
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn('Using local fallback portfolio items:', err);
      }
    }
    loadPortfolio();
  }, []);

  // Sync category and tab from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) setSelectedCategory(cat);

      const tabParam = params.get('tab');
      if (tabParam && ['works', 'gallery', 'thoughts', 'experiments'].includes(tabParam)) {
        setActiveTab(tabParam as HomeTab);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['works', 'gallery', 'thoughts', 'experiments'].includes(hash)) {
          setActiveTab(hash as HomeTab);
        }
      }
    }
  }, []);

  // Handle tab switching with clean URL replacement
  const handleSelectTab = (tab: HomeTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'works') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveArticle(null);
        setSelectedExp(null);
        setActiveModalItem(null);
      }
    };
    if (activeArticle || selectedExp || activeModalItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeArticle, selectedExp, activeModalItem]);

  // Filter items by category for Our Works
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const currentModalIndex = activeModalItem
    ? filteredItems.findIndex((it) => it.id === activeModalItem.id)
    : -1;
  const hasPrevModalItem = currentModalIndex > 0;
  const hasNextModalItem = currentModalIndex >= 0 && currentModalIndex < filteredItems.length - 1;

  const handlePrevModalItem = () => {
    if (hasPrevModalItem) {
      setActiveModalItem(filteredItems[currentModalIndex - 1]);
    }
  };

  const handleNextModalItem = () => {
    if (hasNextModalItem) {
      setActiveModalItem(filteredItems[currentModalIndex + 1]);
    }
  };

  const handleOpenQuoteWithItem = (item: UpraityItem) => {
    setQuotePreselectedItem(item);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] dark:bg-[#121212] text-[#1a1a1a] dark:text-[#ededed] antialiased selection:bg-[#8B7355]/20">
      {/* Fixed Left Sidebar */}
      <UpraitySidebar
        onOpenQuoteModal={() => {
          setQuotePreselectedItem(null);
          setIsQuoteModalOpen(true);
        }}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        selectedCategory={selectedCategory}
      />

      {/* Main Content Stream */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 pb-0">
        <div className="w-full px-4 sm:px-8 xl:px-12 pt-4 sm:pt-8">
          {/* Top Editorial Banner with visible mobile logo and elegant font animation */}
          <div className="mb-6 pb-4 border-b border-black/10 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Prominent Mobile Logo Badge */}
              <div className="md:hidden w-12 h-12 rounded-2xl bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-[#222226] dark:to-[#121214] border border-black/10 dark:border-white/25 p-1.5 shadow-xs dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] shrink-0 flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10">
                <Image
                  src="/logo.png"
                  alt="UPRAITY AND SON Logo"
                  width={44}
                  height={44}
                  priority
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold uppercase font-harietta tracking-[0.16em] font-elegant-shimmer">
                  UPRAITY AND SON
                </h1>
                <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-white/60 font-mono tracking-wider mt-0.5 uppercase">
                  Monumental Stonemasonry & Architectural Heritage · Est. 1909
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <ThemeToggle variant="compact" />
            </div>
          </div>

          {/* Integrated Filter Tabs: Our Works, Gallery, Thoughts, Experiments */}
          <UpraityFilterTabs
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />

          {/* Tab View: Our Works */}
          {activeTab === 'works' && (
            <section id="works" className="scroll-mt-24 pb-12 animate-font-entrance">
              <UpraityGrid
                items={filteredItems}
                onSelectItem={(item) => setActiveModalItem(item)}
                onOpenQuote={handleOpenQuoteWithItem}
              />
            </section>
          )}

          {/* Tab View: Gallery */}
          {activeTab === 'gallery' && (
            <section id="gallery" className="scroll-mt-24 pb-12 animate-font-entrance">
              <GallerySection
                items={items}
                onSelectItem={(item) => setActiveModalItem(item)}
                onOpenQuote={handleOpenQuoteWithItem}
                showHeader={false}
              />
            </section>
          )}

          {/* Tab View: Thoughts */}
          {activeTab === 'thoughts' && (
            <section id="thoughts" className="scroll-mt-24 pb-12 animate-font-entrance">
              <ThoughtsSection
                articles={THOUGHTS_DATA}
                onSelectArticle={(article) => setActiveArticle(article)}
                showHeader={false}
              />
            </section>
          )}

          {/* Tab View: Experiments */}
          {activeTab === 'experiments' && (
            <section id="experiments" className="scroll-mt-24 pb-12 animate-font-entrance">
              <ExperimentsSection
                experiments={EXPERIMENTS_DATA}
                onSelectExperiment={(exp) => setSelectedExp(exp)}
                showHeader={false}
              />
            </section>
          )}
        </div>

        {/* Footer with Terms, Privacy & Directory Links */}
        <UpraityFooter />
      </main>

      {/* Monument Detail Modal (Lazy loaded on demand) */}
      {activeModalItem && (
        <UpraityDetailModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onOpenQuote={handleOpenQuoteWithItem}
          onPrev={handlePrevModalItem}
          onNext={handleNextModalItem}
          hasPrev={hasPrevModalItem}
          hasNext={hasNextModalItem}
          currentIndex={currentModalIndex >= 0 ? currentModalIndex : undefined}
          totalCount={filteredItems.length}
        />
      )}

      {/* Article Reading Modal */}
      {activeArticle && (
        <div
          onClick={() => setActiveArticle(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto no-scrollbar bg-white dark:bg-[#18181b] rounded-3xl p-6 sm:p-10 border border-black/10 dark:border-white/10 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#e5c07b] font-semibold">
                {activeArticle.category} · {activeArticle.date}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close article"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-white leading-snug mb-6">
              {activeArticle.title}
            </h2>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-neutral-900">
              <Image
                src={activeArticle.image}
                alt={activeArticle.title}
                fill
                loading="lazy"
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover"
              />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <p className="font-medium text-neutral-900 dark:text-white">
                {activeArticle.excerpt}
              </p>
              {activeArticle.content ? (
                activeArticle.content.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <>
                  <p>
                    At Upraity And Son, stone is treated not merely as a decorative building surface, but as an enduring chronicle. Every geological fissure, veining line, and quarry extraction angle dictates how the chisel must enter the surface to prevent subsurface shear.
                  </p>
                  <p>
                    Our 115-year history has proven that taking the extra hours to hand-finish foundations and laser-calibrate anchor pegs makes the difference between a monument that settles after two decades and one that stands upright through a hundred winters.
                  </p>
                </>
              )}
            </div>

            <div className="pt-8 mt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                Written by Upraity And Son Master Masons
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-track-hover"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    setIsQuoteModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm font-track-hover"
                >
                  <Hammer size={13} />
                  <span>Request Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experiment Prototype Modal */}
      {selectedExp && (
        <div
          onClick={() => setSelectedExp(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto no-scrollbar bg-white dark:bg-[#18181b] rounded-3xl p-6 sm:p-10 border border-black/10 dark:border-white/10 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#e5c07b] font-semibold">
                {selectedExp.studyNumber} · {selectedExp.status}
              </span>
              <button
                onClick={() => setSelectedExp(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close experiment modal"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-2xl font-light text-neutral-900 dark:text-white leading-snug mb-2 font-track-hover">
              {selectedExp.title}
            </h2>
            <p className="text-xs font-mono text-[#e5c07b] mb-6">
              Materials: {selectedExp.material}
            </p>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-neutral-900">
              <Image
                src={selectedExp.image}
                alt={selectedExp.title}
                fill
                loading="lazy"
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover"
              />
            </div>

            <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8">
              <p className="font-medium text-neutral-900 dark:text-white">
                {selectedExp.description}
              </p>
              {selectedExp.extendedNotes && <p>{selectedExp.extendedNotes}</p>}
              <p>
                Each study produced in our workshop begins with raw hand-sketches and mineral density tests. If you are seeking a bespoke memorial architectural project utilizing unconventional forms or finishes, our master masons work directly with families to draft custom proposals.
              </p>
            </div>

            <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                Bespoke Architectural Stonemasonry
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedExp(null)}
                  className="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-track-hover"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedExp(null);
                    setIsQuoteModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm font-track-hover"
                >
                  <Hammer size={13} />
                  <span>Commission Study</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transparent Quote / Consultation Modal (Lazy loaded on demand) */}
      {isQuoteModalOpen && (
        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          preselectedItem={quotePreselectedItem}
        />
      )}
    </div>
  );
}
