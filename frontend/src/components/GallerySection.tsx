'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UpraityItem } from '../data/upraityData';
import { ArrowUpRight, Camera } from 'lucide-react';

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Imagery' },
  { id: 'structures', label: 'Grave Structures' },
  { id: 'monuments', label: 'Marble & Granite Monuments' },
  { id: 'engraving', label: 'Engraving & Lettering' },
  { id: 'restoration', label: 'Renovation & Cleaning' },
  { id: 'masonry', label: 'House Nameplates & Masonry' },
];

export interface GallerySectionProps {
  items: UpraityItem[];
  onSelectItem: (item: UpraityItem) => void;
  onOpenQuote?: (item: UpraityItem) => void;
  showHeader?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  onSelectItem,
  onOpenQuote,
  showHeader = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const displayedItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="scroll-mt-24 pt-2 pb-12">
      {showHeader && (
        <div className="pb-6 mb-8 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#e5c07b] mb-2 font-semibold flex items-center gap-2">
              <Camera size={13} />
              <span>Upraity And Son · Visual Archive</span>
            </p>
            <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-white drop-shadow-sm">
              Gallery
            </h2>
          </div>

          <span className="text-xs font-mono text-neutral-500 dark:text-white/70">
            {displayedItems.length} Photographs Documented
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {GALLERY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#8B7355] text-white font-bold border border-[#e5c07b]/40 shadow-sm'
                  : 'text-neutral-600 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 font-medium'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Photographic Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
        {displayedItems.map((item) => (
          <div
            key={`gallery-${item.id}`}
            onClick={() => onSelectItem(item)}
            className="group relative break-inside-avoid overflow-hidden rounded-xl bg-[#141416] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#e5c07b]/50 transition-all duration-300 cursor-pointer"
          >
            <div className={`relative w-full ${
              item.aspectRatio === 'tall'
                ? 'aspect-[3/4]'
                : item.aspectRatio === 'wide'
                ? 'aspect-[16/10]'
                : item.aspectRatio === 'square'
                ? 'aspect-square'
                : 'aspect-[4/3]'
            } overflow-hidden bg-neutral-900`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
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
                  <span>Inspect Piece</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
