'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { UpraityItem } from '../data/upraityData';
import {
  X,
  ShieldCheck,
  Ruler,
  Compass,
  Sparkles,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface UpraityDetailModalProps {
  item: UpraityItem | null;
  onClose: () => void;
  onOpenQuote: (item: UpraityItem) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export const UpraityDetailModal: React.FC<UpraityDetailModalProps> = ({
  item,
  onClose,
  onOpenQuote,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalCount,
}) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext && hasNext) {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [item, onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-memorial-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#121214] text-white rounded-2xl overflow-hidden shadow-2xl border border-white/15 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        {/* Counter Badge if multiple images */}
        {currentIndex !== undefined && totalCount !== undefined && totalCount > 1 && (
          <div className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-white/90 border border-white/20">
            {currentIndex + 1} / {totalCount}
          </div>
        )}

        <div className="overflow-y-auto">
          {/* Main Visual Image & Lightbox Navigation */}
          <div className="relative w-full aspect-16/10 bg-neutral-900 group">
            <Image
              src={item.image}
              alt={item.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />

            {/* Left / Previous Chevron Button */}
            {onPrev && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                disabled={!hasPrev}
                aria-label="Previous photograph"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 disabled:opacity-20 disabled:hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer disabled:cursor-not-allowed shadow-lg"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Right / Next Chevron Button */}
            {onNext && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                disabled={!hasNext}
                aria-label="Next photograph"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 disabled:opacity-20 disabled:hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer disabled:cursor-not-allowed shadow-lg"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3.5 py-1 rounded-full text-xs text-white font-semibold border border-white/20">
              {item.categoryLabel}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-white/70 font-mono mb-1">
                <span>{item.year || 'Crafted by Upraity And Son'}</span>
                <span>•</span>
                <span className="text-[#e5c07b] font-semibold">{item.categoryLabel}</span>
              </div>
              <h2
                id="modal-memorial-title"
                className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm"
              >
                {item.title}
              </h2>
              <p className="text-sm text-white/85 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
              <div className="space-y-1">
                <span className="text-white/70 flex items-center gap-1 font-medium">
                  <Sparkles size={12} className="text-[#e5c07b]" /> Material Spec
                </span>
                <p className="font-semibold text-white">
                  {item.material}
                </p>
              </div>

              {item.dimensions && (
                <div className="space-y-1">
                  <span className="text-white/70 flex items-center gap-1 font-medium">
                    <Ruler size={12} className="text-[#e5c07b]" /> Dimensions
                  </span>
                  <p className="font-semibold text-white">
                    {item.dimensions}
                  </p>
                </div>
              )}

              {item.cemeteryType && (
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-white/70 flex items-center gap-1 font-medium">
                    <ShieldCheck size={12} className="text-emerald-400" /> Cemetery Guidelines
                  </span>
                  <p className="font-semibold text-white">
                    {item.cemeteryType} (We handle municipal and churchyard permit approvals)
                  </p>
                </div>
              )}
            </div>

            {/* Craftsmanship & Leveling Method */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Compass size={13} className="text-[#e5c07b]" />
                Quality & Installation Process
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                {item.craftsmanshipNotes}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="text-xs text-white/70">
                Transparent pricing with no hidden charges.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuote(item);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#a68a68] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg border border-[#e5c07b]/40 cursor-pointer drop-shadow-sm"
                >
                  <Send size={13} />
                  <span>Enquire for Family</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MemorialDetailModal = UpraityDetailModal;
export default UpraityDetailModal;
