'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UpraitySidebar } from '../../components/UpraitySidebar';
import { UpraityFooter } from '../../components/UpraityFooter';
import { QuoteModal } from '../../components/QuoteModal';
import { Shield, Lock, FileCheck } from 'lucide-react';

export default function PrivacyPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] dark:bg-[#121212] text-[#1a1a1a] dark:text-[#ededed] antialiased selection:bg-[#8B7355]/20">
      {/* Fixed Left Sidebar */}
      <UpraitySidebar
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 pb-0 bg-[#09090b] text-white">
        <div className="w-full px-4 sm:px-8 xl:px-12 pt-6 sm:pt-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/70 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-white transition-colors">Upraity And Son</Link>
            <span>•</span>
            <span className="text-[#e5c07b] font-semibold">Privacy Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 drop-shadow-sm">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8">
            How Upraity And Son responsibly handles, safeguards, and respects family memorial records, cemetery plot data, and personal information.
          </p>

          <div className="border-t border-white/10 pt-8 space-y-6 text-white text-sm leading-relaxed">
            {/* Section 1 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">1. Respectful Treatment of Family Data</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                We understand the deeply personal and emotional significance of memorial stonemasonry. Information you provide—such as names of deceased loved ones, dates, epitaph verses, and plot locations—is handled with the utmost dignity, confidentiality, and discretion.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">2. Information Required for Cemetery Applications</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-3">
                To process statutory burial authority and church faculty applications, we collect:
              </p>
              <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
                <li>Plot deed owner name, address, and verification details as demanded by cemetery councils.</li>
                <li>Grave plot reference number, section, and consecrated ground designation.</li>
                <li>Inscription wording, scripture citations, and dimensional scale drawings.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">3. Zero Third-Party Advertising or Selling</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                We never sell, rent, monetize, or trade your contact or family memorial information with third-party advertisers or telemarketers. Information is solely shared with relevant municipal cemetery registrars or diocesan chancellors strictly necessary to fulfill your memorial commission.
              </p>
            </div>

            {/* Section 4 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">4. Archival Records for Future Family Generations</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Like our founding master stonemasons, we maintain precise stonecraft archives so that when future generations request additional inscriptions, matching fonts, or restorative cleaning decades later, the exact stone quarry and lettering specifications are readily retrievable.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <UpraityFooter />
      </main>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
