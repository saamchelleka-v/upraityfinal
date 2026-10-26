'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UpraitySidebar } from '../../components/UpraitySidebar';
import { QuoteModal } from '../../components/QuoteModal';
import { ThemeToggle } from '../../components/ThemeToggle';
import { UpraityFooter } from '../../components/UpraityFooter';
import { ArrowRight, Award, Phone, Mail, Hammer, ShieldCheck, Clock } from 'lucide-react';

// ─── Parallax Hook ─────────────────────────────────────────────────────────────
function useParallax(strength = 0.4) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * strength;
      const img = el.querySelector('[data-parallax-inner]') as HTMLElement | null;
      if (img) img.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [strength]);
  return ref;
}

// ─── Full-bleed Parallax Hero ──────────────────────────────────────────────────
function ParallaxHero({ src, alt, children }: { src: string; alt: string; children: React.ReactNode }) {
  const ref = useParallax(0.35);
  return (
    <div ref={ref} className="relative w-full h-[85vh] overflow-hidden">
      <div data-parallax-inner className="absolute inset-0 scale-[1.15]" style={{ willChange: 'transform' }}>
        <Image src={src} alt={alt} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-end px-8 sm:px-14 pb-14">
        {children}
      </div>
    </div>
  );
}

// ─── Parallax Image Block ──────────────────────────────────────────────────────
function ParallaxBlock({ src, alt, height = 'h-[60vh]' }: { src: string; alt: string; height?: string }) {
  const ref = useParallax(0.25);
  return (
    <div ref={ref} className={`relative w-full ${height} overflow-hidden`}>
      <div data-parallax-inner className="absolute inset-0 scale-[1.12]" style={{ willChange: 'transform' }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </div>
    </div>
  );
}

// ─── Work Image Grid ──────────────────────────────────────────────────────────
const WORKS = [
  { src: '/gallery/20170711_122547.jpg', label: 'Grave Structure' },
  { src: '/gallery/2626.jpg', label: 'Marble Monument' },
  { src: '/gallery/data-9-7-2021-4928.jpg', label: '23k Gold Lettering' },
  { src: '/gallery/data-9-7-2021-6701.jpg', label: 'Portrait Engraving' },
  { src: '/gallery/data-9-7-2021-1524.jpg', label: 'Book Memorial' },
  { src: '/gallery/20170911_160857.jpg', label: 'Celtic Cross' },
];

export default function AboutPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.index);
          if (e.isIntersecting) setVisible((prev) => new Set([...prev, i]));
        });
      },
      { threshold: 0.15 }
    );
    sectionRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const fadeIn = (i: number) =>
    `transition-all duration-700 ease-out ${visible.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] dark:bg-[#121212] text-[#1a1a1a] dark:text-[#ededed]">
      <UpraitySidebar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      <main className="flex-1 min-w-0 pt-14 md:pt-0">

        {/* ── Hero ── */}
        <ParallaxHero
          src="/gallery/data-9-7-2021-1172.jpg"
          alt="Upraity And Son stonemasonry workshop"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/60 mb-3">Est. 1909 · Monumental Stonemasons</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-4">
            About<br />Upraity And Son
          </h1>
          <p className="text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
            Four generations of dignified, handcrafted stone memorials — built to stand for a century.
          </p>
        </ParallaxHero>

        {/* ── Nav Strip ── */}
        <div className="sticky top-0 z-30 bg-[#FBFBFB]/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 sm:px-10 h-12">
          <nav className="flex items-center gap-1">
            <Link href="/" className="text-[11px] font-mono text-neutral-400 hover:text-neutral-700 dark:hover:text-white uppercase tracking-wider transition-colors">Home</Link>
            <span className="text-neutral-300 dark:text-neutral-600 mx-2">·</span>
            <span className="text-[11px] font-mono text-[#8B7355] uppercase tracking-wider font-semibold">About</span>
          </nav>
          <ThemeToggle variant="compact" />
        </div>

        {/* ── Mission ── */}
        <div
          ref={(el) => { sectionRefs.current[0] = el; }}
          data-index="0"
          className={`px-8 sm:px-14 xl:px-20 py-20 sm:py-28 max-w-4xl ${fadeIn(0)}`}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-6">Our Mission</p>
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-800 dark:text-neutral-100 leading-relaxed">
            &ldquo;Our aim is to provide strong, well finished and dignified memorial structures that families can be proud of <em>for generations.</em>&rdquo;
          </blockquote>
        </div>

        {/* ── Full bleed image 1 ── */}
        <ParallaxBlock
          src="/gallery/data-9-7-2021-3318.jpg"
          alt="Black granite grave structure"
          height="h-[50vh] sm:h-[65vh]"
        />

        {/* ── Heritage Stats ── */}
        <div
          ref={(el) => { sectionRefs.current[1] = el; }}
          data-index="1"
          className={`px-8 sm:px-14 xl:px-20 py-20 sm:py-28 ${fadeIn(1)}`}
        >
          <div className="flex items-center gap-3 mb-10">
            <Award size={20} className="text-[#8B7355]" />
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355]">Four-Generation Legacy</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl overflow-hidden">
            {[
              { val: '1909', label: 'Founded' },
              { val: '115+', label: 'Years of Heritage' },
              { val: '4th', label: 'Generation Active' },
              { val: '100%', label: 'Cemetery Compliant' },
            ].map((s) => (
              <div key={s.label} className="bg-[#FBFBFB] dark:bg-[#121212] p-8 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#8B7355]">{s.val}</div>
                <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Split: text / image ── */}
        <div
          ref={(el) => { sectionRefs.current[2] = el; }}
          data-index="2"
          className={`grid grid-cols-1 md:grid-cols-2 ${fadeIn(2)}`}
        >
          <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
            <ParallaxBlock
              src="/gallery/20170911_160857.jpg"
              alt="Carrara marble headstone"
              height="h-full"
            />
          </div>
          <div className="flex flex-col justify-center px-10 xl:px-16 py-16">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-4">Our Lineage</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6 leading-snug">
              From hammer & chisel<br />to laser precision
            </h2>
            <div className="space-y-5">
              {[
                { year: '1909', desc: 'Great-grandfather establishes the workshop — hand-dressing Welsh granite and slate memorials.' },
                { year: '1948', desc: 'Grandfather introduces fine Carrara marble and codifies our concrete foundation leveling system.' },
                { year: '1982', desc: 'Father pioneers BRAMM stainless-steel anchoring and 23.5k gold leaf gilding of inscriptions.' },
                { year: 'Today', desc: '4th generation unites timeless craft with transparent pricing and bespoke architectural stone.' },
              ].map((e) => (
                <div key={e.year} className="flex gap-4">
                  <span className="text-[#8B7355] font-bold font-mono text-sm shrink-0 w-12">{e.year}</span>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Work Grid ── */}
        <div
          ref={(el) => { sectionRefs.current[3] = el; }}
          data-index="3"
          className={`px-8 sm:px-14 xl:px-20 py-20 sm:py-28 ${fadeIn(3)}`}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-10">Selected Works</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {WORKS.map((w, i) => (
              <Link key={i} href="/" className="group relative overflow-hidden aspect-[4/5] rounded-xl">
                <Image
                  src={w.src}
                  alt={w.label}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-medium font-mono">{w.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Full bleed image 2 ── */}
        <ParallaxBlock
          src="/gallery/data-9-7-2021-3322.jpg"
          alt="23k gold leaf inscription"
          height="h-[55vh]"
        />

        {/* ── Guarantees ── */}
        <div
          ref={(el) => { sectionRefs.current[4] = el; }}
          data-index="4"
          className={`px-8 sm:px-14 xl:px-20 py-20 sm:py-28 ${fadeIn(4)}`}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-10">Our Guarantees</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 border border-black/8 dark:border-white/8 rounded-xl">
              <ShieldCheck size={24} className="text-emerald-600 mb-4" />
              <h3 className="font-bold text-base mb-2">Cemetery Guidelines Compliant</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">Every memorial strictly adheres to council, churchyard, and cemetery foundation and inscription regulations.</p>
            </div>
            <div className="p-8 border border-black/8 dark:border-white/8 rounded-xl">
              <Clock size={24} className="text-[#8B7355] mb-4" />
              <h3 className="font-bold text-base mb-2">Measurement & Leveling Guarantee</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">Reinforced concrete piers and precision laser leveling ensure no sinking or tilting over decades.</p>
            </div>
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="relative overflow-hidden">
          <ParallaxBlock
            src="/gallery/data-9-7-2021-5838.jpg"
            alt="Cemetery grounds"
            height="h-[50vh] sm:h-[60vh]"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-8">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/60 mb-4">Begin a Conversation</p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">Discuss Your<br />Family Memorial</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <Hammer size={16} />
                Request Transparent Quote
                <ArrowRight size={15} />
              </button>
              <div className="flex items-center gap-5 text-white/75 text-sm">
                <a href="tel:+442080001909" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Phone size={14} /><span>+44 20 8000 1909</span>
                </a>
                <a href="mailto:contact@upraityandson.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Mail size={14} /><span>Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <UpraityFooter />
      </main>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}
