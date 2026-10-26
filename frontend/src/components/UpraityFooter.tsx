'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export const UpraityFooter: React.FC = () => {
  return (
    <footer className="mt-20 pt-12 pb-6 sm:pb-8 border-t border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#0d0d0d] text-neutral-800 dark:text-white w-full transition-colors duration-200">
      <div className="w-full px-4 sm:px-8 xl:px-12 space-y-10">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Lineage */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase drop-shadow-sm font-harietta">
                  UPRAITY AND SON
                </h3>
                <p className="text-[11px] text-[#8B7355] dark:text-[#e5c07b] font-medium tracking-wide">
                  Memorial Architects & Monumental Stonemasons · Est. 1909
                </p>
              </div>
            </Link>

            <p className="text-xs text-neutral-600 dark:text-white/85 leading-relaxed max-w-md">
              Four generations of bespoke memorial stonemasonry, grave structures, Carrara marble monuments, hand-chiseled 23k gold inscriptions, and lifetime leveling foundation engineering.
            </p>

            <div className="flex items-center gap-4 text-xs text-neutral-700 dark:text-white/90 pt-1">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Workshop Open Mon–Sat
              </span>
              <span className="text-neutral-400 dark:text-white/40">|</span>
              <span className="inline-flex items-center gap-1.5 text-[#8B7355] dark:text-[#e5c07b]">
                <ShieldCheck size={14} />
                Lifetime Guarantee
              </span>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8B7355] dark:text-[#e5c07b] font-semibold">
              Navigation & Policies
            </h4>
            <ul className="grid grid-cols-2 gap-2.5 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-medium"
                >
                  Home Showcase
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-medium"
                >
                  Gallery Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/?tab=thoughts"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-medium"
                >
                  Masonry Thoughts
                </Link>
              </li>
              <li>
                <Link
                  href="/?tab=experiments"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-medium"
                >
                  Workshop Experiments
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-medium"
                >
                  About Our Craft
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-medium"
                >
                  Family History
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-medium"
                >
                  Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-semibold underline decoration-neutral-400 dark:decoration-white/30 hover:decoration-[#8B7355] underline-offset-4"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors py-0.5 inline-block font-semibold underline decoration-neutral-400 dark:decoration-white/30 hover:decoration-[#8B7355] underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop & Contact Information */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8B7355] dark:text-[#e5c07b] font-semibold">
              Atelier & Inquiries
            </h4>
            <div className="space-y-2 text-xs text-neutral-600 dark:text-white/90">
              <a
                href="tel:+442080001909"
                className="flex items-center gap-2 text-neutral-900 dark:text-white hover:text-[#8B7355] dark:hover:text-[#e5c07b] transition-colors font-medium"
              >
                <Phone size={14} className="text-[#8B7355] dark:text-[#e5c07b] shrink-0" />
                <span>+44 (0) 20 8000 1909</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-[#8B7355] dark:text-[#e5c07b] shrink-0 mt-0.5" />
                <span>London & Home Counties, United Kingdom</span>
              </div>
              <div className="flex items-start gap-2 text-neutral-500 dark:text-white/80">
                <Clock size={14} className="text-[#8B7355] dark:text-[#e5c07b] shrink-0 mt-0.5" />
                <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Policy Strip */}
        <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-500 dark:text-white/80 text-center sm:text-left">
            © 2026 <strong className="text-neutral-800 dark:text-white font-semibold">Upraity And Son</strong>. Craftsmanship passed down across four generations. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-neutral-600 dark:text-white font-medium">
            <Link
              href="/terms"
              className="hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors underline decoration-neutral-300 dark:decoration-white/40 underline-offset-2"
            >
              Terms
            </Link>
            <span className="text-neutral-300 dark:text-white/30">•</span>
            <Link
              href="/privacy"
              className="hover:text-neutral-900 dark:hover:text-[#e5c07b] transition-colors underline decoration-neutral-300 dark:decoration-white/40 underline-offset-2"
            >
              Privacy
            </Link>
            <span className="text-neutral-300 dark:text-white/30">•</span>
            <Link
              href="/admin"
              className="text-neutral-400 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              CMS Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UpraityFooter;
