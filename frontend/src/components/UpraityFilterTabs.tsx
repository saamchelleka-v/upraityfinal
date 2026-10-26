'use client';

import React from 'react';

export type HomeTab = 'works' | 'gallery' | 'thoughts' | 'experiments';

export const MAIN_TABS: { id: HomeTab; label: string }[] = [
  { id: 'works', label: 'Our Works' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'thoughts', label: 'Thoughts' },
  { id: 'experiments', label: 'Experiments' },
];

export const WORK_SUB_OPTIONS = [
  { id: 'all', label: 'All Works' },
  { id: 'structures', label: 'Grave Structures' },
  { id: 'monuments', label: 'Marble & Granite Monuments' },
  { id: 'engraving', label: 'Engraving & Lettering' },
  { id: 'restoration', label: 'Renovation & Cleaning' },
  { id: 'masonry', label: 'House Nameplates & Masonry' },
];

export interface UpraityFilterTabsProps {
  activeTab?: HomeTab;
  onSelectTab?: (tab: HomeTab) => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const UpraityFilterTabs: React.FC<UpraityFilterTabsProps> = ({
  activeTab = 'works',
  onSelectTab,
  selectedCategory,
  onSelectCategory,
}) => {
  const handleTabClick = (tab: HomeTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  return (
    <div className="mb-8 space-y-3">
      {/* Primary Navigation on Home: Our Works, Gallery, Thoughts, Experiments */}
      <div className="flex flex-wrap items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3">
        {MAIN_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider font-track-hover uppercase transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#8B7355] text-white dark:bg-white/15 dark:text-white font-bold border border-[#8B7355] dark:border-white/35 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.18)] drop-shadow-sm font-glow-gold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub Options under Our Works */}
      {activeTab === 'works' && (
        <div className="flex flex-row gap-1.5 flex-wrap items-center pt-1">
          {WORK_SUB_OPTIONS.map((sub) => {
            const isActive = selectedCategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectCategory(sub.id)}
                className={`inline-flex items-center justify-center whitespace-nowrap text-xs transition-all duration-200 h-8 rounded-lg px-3 cursor-pointer font-medium tracking-wide ${
                  isActive
                    ? 'bg-[#8B7355] text-white shadow-sm font-bold border border-[#735d43] dark:border-[#e5c07b]/40 ring-1 ring-[#8B7355]/30 dark:ring-[#e5c07b]/30'
                    : 'text-neutral-600 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MemorialFilterTabs = UpraityFilterTabs;
export default UpraityFilterTabs;
