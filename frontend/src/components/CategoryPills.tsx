'use client';

import React from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'interior', label: 'Interior Design' },
  { id: 'photography', label: 'Photography' },
  { id: 'travel', label: 'Travel & Mood' },
  { id: 'culinary', label: 'Culinary Art' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'fashion', label: 'Editorial Fashion' },
  { id: 'aesthetic', label: 'Aesthetics' },
];

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
