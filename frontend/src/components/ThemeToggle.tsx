'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, toggleTheme, setTheme, isMounted } = useTheme();

  // Guard against hydration mismatch
  if (!isMounted) {
    return (
      <div className={`h-8 w-8 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse ${className}`} />
    );
  }

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 text-xs font-medium ${className}`}
        role="group"
        aria-label="Theme selector"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
            theme === 'light'
              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
          aria-pressed={theme === 'light'}
        >
          <Sun size={13} className={theme === 'light' ? 'text-[#8B7355]' : 'text-neutral-400'} />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
            theme === 'dark'
              ? 'bg-[#1e1e1e] text-white shadow-xs font-semibold'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
          aria-pressed={theme === 'dark'}
        >
          <Moon size={13} className={theme === 'dark' ? 'text-[#8B7355]' : 'text-neutral-400'} />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // Default compact toggle button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-all duration-150 cursor-pointer shadow-2xs backdrop-blur-xs ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={14} className="text-[#8B7355]" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-[#8B7355]" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
