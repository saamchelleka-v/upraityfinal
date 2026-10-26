'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  PhoneCall,
  Home,
  Info,
  History,
  FileText,
  Shield,
  Search,
  Plus,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, searchQuery = '' }) => {
  const pathname = usePathname();
  const { user, logout, setIsAuthModalOpen, setAuthMode, demoLogin } = useAuth();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'History', href: '/history' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    if (onSearch) onSearch('');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0c]/95 backdrop-blur-md border-b border-white/10 shadow-md">
      <div className="w-full px-4 sm:px-8 xl:px-12 h-16 flex items-center justify-between gap-3 md:gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#222226] to-[#121214] border border-white/20 p-1 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-white/35 transition-all ring-1 ring-white/10 shrink-0">
            <img
              src="/logo.png"
              alt="Upraity And Son Logo"
              loading="lazy"
              className="w-full h-full object-contain filter drop-shadow-[0_1px_5px_rgba(255,255,255,0.4)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-[0.16em] text-white leading-tight font-harietta uppercase font-elegant-shimmer">
              Upraity And Son
            </span>
            <span className="text-[10px] text-[#e5c07b] font-mono hidden sm:inline tracking-wider font-semibold">
              Master Monumental Stonecraft · Est. 1909
            </span>
          </div>
        </Link>

        {/* Desktop Primary Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-[#1a1a1a] font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Optional Search / Quick Action */}
        <div className="hidden md:flex items-center flex-1 max-w-xs relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <Search className="absolute left-3 text-neutral-400 pointer-events-none" size={14} />
            <input
              type="text"
              placeholder="Search memorial types..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full pl-8 pr-7 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8B7355]/40"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X size={12} />
              </button>
            )}
          </form>
        </div>

        {/* Right CTA / Contact button & User Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md bg-[#8B7355] text-white text-xs font-semibold hover:bg-[#735e45] transition-colors shadow-xs"
          >
            <PhoneCall size={12} />
            <span>Consultation</span>
          </Link>

          {/* User Account / Auth Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={13} className="text-neutral-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-black/5 dark:border-white/10 py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-black/5 dark:border-white/10">
                    <p className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <UserIcon size={13} />
                    <span>Saved Memorials</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2 py-1 cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-black/5 dark:border-white/10 bg-[#FBFBFB] dark:bg-[#121212] px-4 py-3 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-[#1a1a1a] font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span>{item.name}</span>
                {isActive && <span className="text-[10px] font-mono opacity-70">Current</span>}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-black/5 dark:border-white/10">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#8B7355] text-white text-xs font-semibold"
            >
              <PhoneCall size={13} />
              <span>Request Consultation</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
