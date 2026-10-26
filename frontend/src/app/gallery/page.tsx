'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { UpraitySidebar } from '../../components/UpraitySidebar';
import { ThemeToggle } from '../../components/ThemeToggle';
import { UpraityFooter } from '../../components/UpraityFooter';
import { UPRAITY_DATA, UpraityItem } from '../../data/upraityData';
import { fetchPortfolioItems } from '../../services/cmsApi';
import {
  Camera,
  Search,
  ArrowUpRight,
  Sparkles,
  Layers,
  Filter,
  X,
  Compass,
} from 'lucide-react';

const UpraityDetailModal = dynamic(
  () => import('../../components/UpraityDetailModal').then((m) => m.UpraityDetailModal),
  { ssr: false }
);

const QuoteModal = dynamic(
  () => import('../../components/QuoteModal').then((m) => m.QuoteModal),
  { ssr: false }
);

const CATEGORIES = [
  { id: 'all', label: 'All Imagery' },
  { id: 'structures', label: 'Grave Structures' },
  { id: 'monuments', label: 'Marble & Granite Monuments' },
  { id: 'engraving', label: 'Engraving & Lettering' },
  { id: 'restoration', label: 'Renovation & Cleaning' },
  { id: 'masonry', label: 'House Nameplates & Masonry' },
];

export default function GalleryPage() {
  const [items, setItems] = useState<UpraityItem[]>(UPRAITY_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<UpraityItem | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePreselectedItem, setQuotePreselectedItem] = useState<UpraityItem | null>(null);

  // Initialize filter state from URL query parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      setSelectedCategory(cat);
    }
    const q = params.get('q') || params.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, []);

  // Synchronize category and search query into URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (selectedCategory && selectedCategory !== 'all') {
      url.searchParams.set('category', selectedCategory);
    } else {
      url.searchParams.delete('category');
    }
    if (searchQuery.trim()) {
      url.searchParams.set('q', searchQuery.trim());
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedCategory, searchQuery]);

  // Sync from CMS if available
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
        console.warn('Using local UPRAITY_DATA gallery archive:', err);
      }
    }
    loadPortfolio();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.cemeteryType && item.cemeteryType.toLowerCase().includes(q)) ||
        (item.year && item.year.toLowerCase().includes(q))
      );
    });
  }, [items, selectedCategory, searchQuery]);

  // Lightbox index & cycling
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
      {/* Fixed Sidebar */}
      <UpraitySidebar
        onOpenQuoteModal={() => {
          setQuotePreselectedItem(null);
          setIsQuoteModalOpen(true);
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 pb-0">
        <div className="w-full px-4 sm:px-8 xl:px-12 pt-4 sm:pt-8">
          {/* Header Banner */}
          <div className="mb-8 pb-6 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] dark:text-[#e5c07b] mb-2 font-semibold flex items-center gap-2">
                <Camera size={14} />
                <span>UPRAITY AND SON · VISUAL MONUMENT ARCHIVE</span>
              </p>
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-white drop-shadow-sm font-harietta">
                Architectural Gallery
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-white/70 max-w-2xl mt-2 leading-relaxed">
                A photographic catalog of hand-hewn memorial crosses, monolithic Shanxi black granite full kerb enclosures, Bianco Carrara marble arches, photorealistic diamond etchings, and 23k gold-leaf lettering commissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono text-neutral-700 dark:text-white/80 border border-black/10 dark:border-white/15">
                {filteredItems.length} of {items.length} Photographs
              </span>
              <ThemeToggle variant="compact" />
            </div>
          </div>

          {/* Controls: Search and Categories */}
          <div className="mb-8 space-y-4">
            {/* Search Input Bar */}
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stone, marble, Celtic cross, gold leaf..."
                className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#1a1a1d] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/40 border border-black/10 dark:border-white/10 focus:outline-hidden focus:ring-2 focus:ring-[#e5c07b]/50 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count =
                  cat.id === 'all'
                    ? items.length
                    : items.filter((it) => it.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#8B7355] text-white font-bold border border-[#e5c07b]/40 shadow-sm ring-1 ring-[#e5c07b]/30'
                        : 'text-neutral-600 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 font-medium'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-black/25 text-white'
                          : 'bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-white/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Masonry Photographic Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-24 text-center">
              <Layers size={36} className="mx-auto text-neutral-400 dark:text-white/30 mb-3" />
              <p className="text-base font-semibold text-neutral-700 dark:text-white/80">
                No photographs found matching your criteria.
              </p>
              <p className="text-xs text-neutral-500 dark:text-white/50 mt-1">
                Try clearing search terms or select another stone category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#8B7355] text-white text-xs font-semibold hover:bg-[#9a805e] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6 pb-16">
              {filteredItems.map((item, index) => (
                <div
                  key={`gallery-grid-${item.id}`}
                  onClick={() => setActiveModalItem(item)}
                  className="group relative break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 dark:bg-[#141416] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#8B7355]/50 dark:hover:border-[#e5c07b]/50 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className={`relative w-full ${
                      item.aspectRatio === 'tall'
                        ? 'aspect-[3/4]'
                        : item.aspectRatio === 'wide'
                        ? 'aspect-[16/10]'
                        : item.aspectRatio === 'square'
                        ? 'aspect-square'
                        : 'aspect-[4/3]'
                    } overflow-hidden bg-neutral-900`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      loading={index < 8 ? 'eager' : 'lazy'}
                      priority={index < 4}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#e5c07b] font-semibold">
                        {item.categoryLabel}
                      </p>
                      <h3 className="text-sm font-semibold text-white tracking-wide mt-1 drop-shadow-sm line-clamp-2 font-track-hover font-glow-hover">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/90 line-clamp-1 mt-0.5">
                        {item.material}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#e5c07b] mt-3 font-semibold font-track-hover">
                        <span>Inspect Commission</span>
                        <ArrowUpRight size={13} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <UpraityFooter />
      </main>

      {/* Detail Modal */}
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

      {/* Quote Inquiry Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setQuotePreselectedItem(null);
        }}
        preselectedItem={quotePreselectedItem || undefined}
      />
    </div>
  );
}
