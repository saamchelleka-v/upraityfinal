'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export interface UpraitySidebarProps {
  onOpenQuoteModal?: () => void;
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

export const UpraitySidebar: React.FC<UpraitySidebarProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'History', href: '/history' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-3.5 py-2.5 bg-white/95 dark:bg-[#0b0b0c]/95 text-neutral-900 dark:text-white z-40 md:hidden border-b border-black/10 dark:border-white/15 backdrop-blur-md shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-[#222226] dark:to-[#121214] border border-black/10 dark:border-white/25 p-1 flex items-center justify-center shadow-xs shrink-0 ring-1 ring-black/5 dark:ring-white/10">
            <img
              src="/logo.png"
              alt="Upraity And Son Logo"
              loading="lazy"
              className="w-full h-full object-contain filter drop-shadow-[0_1px_5px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_1px_5px_rgba(255,255,255,0.4)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-[0.16em] text-neutral-900 dark:text-white font-harietta leading-tight font-elegant-shimmer">
              UPRAITY AND SON
            </span>
            <span className="text-[9px] text-[#8B7355] dark:text-[#e5c07b] font-mono tracking-widest uppercase font-semibold">
              Est. 1909
            </span>
          </div>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-white transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 flex flex-col justify-between bg-[#fcfcfc] dark:bg-[#0b0b0c] text-neutral-900 dark:text-white z-50 border-r border-black/10 dark:border-white/10 shadow-xs transition-transform duration-200 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Top Brand & Navigation Section */}
          <div className="p-5 pb-3">
            <div className="relative flex flex-col items-center justify-center mb-6">
              {/* Close button on mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden absolute -top-1 -right-1 p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white cursor-pointer z-10 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>

              <Link
                href="/"
                className="group flex flex-col items-center justify-center w-full"
                aria-label="UPRAITY AND SON Home"
              >
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-neutral-50 to-neutral-200/80 dark:from-[#1c1c20] dark:to-[#121214] border border-black/10 dark:border-white/20 flex items-center justify-center p-3 shadow-md group-hover:scale-[1.02] group-hover:border-black/20 dark:group-hover:border-white/35 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10">
                  <img
                    src="/logo.png"
                    alt="UPRAITY AND SON Logo"
                    loading="lazy"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                  />
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-track-hover uppercase transition-all duration-200 ${
                      isActive
                        ? 'bg-[#8B7355] text-white dark:bg-white/20 dark:text-white font-bold border border-[#8B7355] dark:border-white/35 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.18)] drop-shadow-sm font-glow-gold'
                        : 'text-neutral-600 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-1"></div>
        </div>
      </aside>

      {/* Spacer to offset fixed sidebar on desktop */}
      <div className="hidden md:block w-72 shrink-0"></div>
    </>
  );
};

// Aliased export for backwards compatibility
export const MemorialSidebar = UpraitySidebar;
export default UpraitySidebar;
