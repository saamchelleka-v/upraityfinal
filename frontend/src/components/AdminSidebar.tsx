'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  Camera,
  Inbox,
  Users,
  Menu,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type AdminSection = 'overview' | 'portfolio' | 'gallery' | 'crm' | 'contacts';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  newInquiriesCount?: number;
  totalPortfolioCount?: number;
  totalContactsCount?: number;
  totalGalleryCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  newInquiriesCount = 0,
  totalPortfolioCount = 0,
  totalContactsCount = 0,
  totalGalleryCount = 101,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const navGroups = [
    {
      group: 'WORKSPACE',
      items: [
        {
          id: 'overview' as AdminSection,
          name: 'Overview',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      group: 'CONTENT',
      items: [
        {
          id: 'portfolio' as AdminSection,
          name: 'Portfolio',
          icon: Layers,
          badge: totalPortfolioCount > 0 ? `${totalPortfolioCount}` : null,
        },
        {
          id: 'gallery' as AdminSection,
          name: 'Gallery Archive',
          icon: Camera,
          badge: totalGalleryCount > 0 ? `${totalGalleryCount}` : null,
        },
      ],
    },
    {
      group: 'CUSTOMERS',
      items: [
        {
          id: 'crm' as AdminSection,
          name: 'Inquiries',
          icon: Inbox,
          badge: newInquiriesCount > 0 ? `${newInquiriesCount} new` : null,
          badgeColor: 'bg-[#8B7355] text-white',
        },
        {
          id: 'contacts' as AdminSection,
          name: 'Directory',
          icon: Users,
          badge: totalContactsCount > 0 ? `${totalContactsCount}` : null,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-[#121214] border-b border-neutral-200 dark:border-neutral-800 z-40 md:hidden flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center p-1 shrink-0">
            <img src="/logo.png" alt="Upraity Logo" className="w-full h-full object-contain invert dark:invert-0" />
          </div>
          <div>
            <span className="font-bold text-xs tracking-tight text-neutral-900 dark:text-white block font-serif">
              Upraity And Son
            </span>
            <span className="text-[10px] text-neutral-500 font-mono block -mt-0.5">
              CMS Studio
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Persistent Desktop Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 ${
          isCollapsed ? 'md:w-18' : 'md:w-64'
        } w-72 bg-[#F9F9FB] dark:bg-[#121214] text-neutral-800 dark:text-neutral-200 border-r border-neutral-200/80 dark:border-neutral-800 z-50 flex flex-col justify-between transition-all duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center p-1 shadow-xs shrink-0">
                <img
                  src="/logo.png"
                  alt="Upraity Logo"
                  className="w-full h-full object-contain invert dark:invert-0"
                />
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-harietta truncate">
                    Upraity And Son
                  </h1>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
                    CMS Workspace
                  </p>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden md:flex p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              </button>
            )}
          </div>

          {/* Navigation Groups */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-14rem)] no-scrollbar" aria-label="Admin Navigation">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold mb-1.5 select-none">
                    {group.group}
                  </div>
                )}

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectSection(item.id);
                          setIsMobileOpen(false);
                        }}
                        title={isCollapsed ? item.name : undefined}
                        className={`w-full flex items-center ${
                          isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
                        } rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs border border-neutral-200/90 dark:border-neutral-700'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            size={16}
                            className={
                              isActive
                                ? 'text-[#8B7355] dark:text-[#C5A880] shrink-0'
                                : 'text-neutral-400 dark:text-neutral-500 shrink-0'
                            }
                          />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                              item.badgeColor
                                ? item.badgeColor
                                : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer & User Session */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800 space-y-2">
          {/* Public Website Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open public website in a new tab"
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-1.5'
            } rounded-lg text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors`}
          >
            <div className="flex items-center gap-2 truncate">
              <ExternalLink size={13} className="shrink-0 text-[#8B7355]" />
              {!isCollapsed && <span className="truncate">Public Website</span>}
            </div>
            {!isCollapsed && <span className="text-[10px] font-mono text-neutral-400">↗</span>}
          </Link>

          {/* User Account / Logout */}
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80 px-1`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[11px] font-bold text-neutral-700 dark:text-neutral-200 shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {user?.name || 'Administrator'}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono truncate">
                    Head Mason
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={logout}
                title="Sign out of CMS"
                className="p-1.5 rounded text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs animate-in fade-in"
        />
      )}
    </>
  );
};

export default AdminSidebar;
