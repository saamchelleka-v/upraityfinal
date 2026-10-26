'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UpraitySidebar } from '../../components/UpraitySidebar';
import { UpraityFooter } from '../../components/UpraityFooter';
import { QuoteModal } from '../../components/QuoteModal';
import { FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
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
            <span className="text-[#e5c07b] font-semibold">Terms of Craftsmanship</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 drop-shadow-sm">
            Terms & Craftsmanship Conditions
          </h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8">
            Clear, transparent standards regarding monumental masonry commissions, cemetery permits, natural stone characteristics, and structural leveling guarantees.
          </p>

          <div className="border-t border-white/10 pt-8 space-y-6 text-white text-sm leading-relaxed">
            {/* Section 1 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">1. Commission & Transparent Pricing</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                All memorial estimates provided by Upraity And Son explicitly itemize the stone, hand-lettering count, foundation work, and council cemetery permit fees. Once an inscription proof and design draft are signed off, our quoted masonry fee is fixed with no hidden fees.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">2. Leveling & Foundation Structural Guarantee</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-3">
                Every grave structure, kerb set, and headstone is installed strictly following NAMM / BRAMM accredited foundation procedures using stainless steel dowels and engineered sub-base footings.
              </p>
              <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
                <li>30-Year structural integrity guarantee against masonry fracture caused by fabrication defects.</li>
                <li>Free inspection and re-leveling service if initial natural soil subsidence occurs within the first 12 months.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">3. Cemetery & Parish Authority Approvals</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Cemeteries, churchyards, and municipal burial authorities enforce specific regulations regarding dimensions, material finishes, and inscription wording. Upraity And Son prepares and submits all required regulatory drawings on behalf of the plot owner. Erection takes place once the cemetery permit is granted.
              </p>
            </div>

            {/* Section 4 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#141416] border border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={17} className="text-[#e5c07b]" />
                <h2 className="text-base font-bold text-white">4. Natural Stone Inherent Qualities</h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Granite, marble, and limestone are ancient natural products formed over millions of years. Natural variations in vein patterns, slight shade variations, and crystalline mineral deposits are authentic marks of genuine natural quarry stone and are celebrated as unique family heirlooms.
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
