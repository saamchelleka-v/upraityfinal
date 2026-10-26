'use client';

import React from 'react';
import Image from 'next/image';
import { UpraityItem } from '../data/upraityData';

export interface UpraityGridProps {
  items: UpraityItem[];
  onSelectItem: (item: UpraityItem) => void;
  onOpenQuote?: (item: UpraityItem) => void;
}

// Aspect ratios per item — drives image height variety like the reference
const ASPECT_CYCLE: string[] = [
  'aspect-[4/5]',   // tall portrait
  'aspect-[4/3]',   // standard landscape
  'aspect-[4/3]',
  'aspect-[3/4]',   // portrait
  'aspect-[4/3]',
  'aspect-[16/10]', // wide
  'aspect-[4/5]',
  'aspect-[4/3]',
  'aspect-[3/4]',
];

export const UpraityGrid: React.FC<UpraityGridProps> = ({
  items,
  onSelectItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="py-24 text-center text-sm text-neutral-500 dark:text-neutral-400">
        No works in this category.
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6">
      {items.map((item, i) => {
        const aspectClass = item.aspectRatio === 'tall'
          ? 'aspect-[3/4]'
          : item.aspectRatio === 'wide'
          ? 'aspect-[16/10]'
          : item.aspectRatio === 'square'
          ? 'aspect-square'
          : ASPECT_CYCLE[i % ASPECT_CYCLE.length];

        return (
          <div
            key={item.id}
            className="break-inside-avoid mb-6 group cursor-pointer"
            onClick={() => onSelectItem(item)}
          >
            {/* Image */}
            <div className={`relative w-full ${aspectClass} overflow-hidden rounded-lg bg-neutral-100 dark:bg-[#141416] border border-black/10 dark:border-white/10 shadow-sm`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                loading={i < 3 ? 'eager' : 'lazy'}
                priority={i < 2}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>

            {/* Text below image */}
            <div className="pt-2.5 pb-0.5">
              {/* Category label */}
              <p className="text-[11px] text-[#8B7355] dark:text-[#e5c07b] font-mono uppercase tracking-widest mb-1 leading-none font-semibold">
                {item.categoryLabel}
              </p>

              {/* Title */}
              <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white leading-snug group-hover:text-[#8B7355] dark:group-hover:text-[#e5c07b] font-track-hover font-glow-hover transition-all drop-shadow-sm">
                {item.title}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const MemorialGrid = UpraityGrid;
export default UpraityGrid;
