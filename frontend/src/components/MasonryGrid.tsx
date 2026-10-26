'use client';

import React from 'react';
import { Pin } from '../types';
import { PinCard } from './PinCard';

interface MasonryGridProps {
  pins: Pin[];
  isLoading?: boolean;
  onOpenSaveModal?: (pin: Pin) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ pins, isLoading = false, onOpenSaveModal }) => {
  if (isLoading) {
    return (
      <div className="masonry-columns">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="masonry-item">
            <div
              className="w-full rounded-2xl bg-neutral-200 animate-pulse"
              style={{
                height: `${[260, 340, 220, 400, 300, 360][idx % 6]}px`,
              }}
            />
            <div className="mt-2 h-4 w-3/4 rounded bg-neutral-200 animate-pulse" />
            <div className="mt-1.5 h-3 w-1/2 rounded bg-neutral-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">No pins found</h3>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          We couldn't find any pins matching your search or filters. Try exploring different keywords or create a new pin!
        </p>
      </div>
    );
  }

  return (
    <div className="masonry-columns">
      {pins.map((pin) => (
        <PinCard key={pin._id} pin={pin} onOpenSaveModal={onOpenSaveModal} />
      ))}
    </div>
  );
};
