'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UpraitySidebar } from '../../components/UpraitySidebar';
import { QuoteModal } from '../../components/QuoteModal';
import { ThemeToggle } from '../../components/ThemeToggle';
import { UpraityFooter } from '../../components/UpraityFooter';
import { ArrowRight, Hammer } from 'lucide-react';

// ─── Parallax Hook ─────────────────────────────────────────────────────────────
function useParallax(strength = 0.4) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * strength;
      const inner = el.querySelector('[data-parallax-inner]') as HTMLElement | null;
      if (inner) inner.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [strength]);
  return ref;
}

function ParallaxHero({ src, alt, children }: { src: string; alt: string; children: React.ReactNode }) {
  const ref = useParallax(0.35);
  return (
    <div ref={ref} className="relative w-full h-[85vh] overflow-hidden">
      <div data-parallax-inner className="absolute inset-0 scale-[1.15]" style={{ willChange: 'transform' }}>
        <Image src={src} alt={alt} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-end px-8 sm:px-14 pb-14">
        {children}
      </div>
    </div>
  );
}

function ParallaxBlock({ src, alt, height = 'h-[60vh]', overlay = false }: { src: string; alt: string; height?: string; overlay?: boolean }) {
  const ref = useParallax(0.25);
  return (
    <div ref={ref} className={`relative w-full ${height} overflow-hidden`}>
      <div data-parallax-inner className="absolute inset-0 scale-[1.12]" style={{ willChange: 'transform' }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
        {overlay && <div className="absolute inset-0 bg-black/40" />}
      </div>
    </div>
  );
}

// ─── Timeline Events ─────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: '1909',
    generation: 'Generation I — The Founder',
    title: 'Workshop Established',
    description: 'With simple hammer, chisel, and hand files, our great-grandfather began dressing local granite and slate memorials. He established the bedrock principle: every memorial must stand plumb and true for a century.',
    image: '/gallery/2400.jpg',
    tags: ['Hand Chisel', 'Welsh Slate', 'Hand Engraving'],
  },
  {
    year: '1948',
    generation: 'Generation II — Post-War Masonry',
    title: 'Carrara Marble & Full Kerb Sets',
    description: 'Following the mid-century restoration movement, our grandfather introduced fine Italian Carrara marble and full kerb enclosed grave structures — codifying our custom leveling foundations.',
    image: '/gallery/2626.jpg',
    tags: ['Carrara Marble', 'Full Kerb Sets', 'Foundation Leveling'],
  },
  {
    year: '1982',
    generation: 'Generation III — Engineering',
    title: 'BRAMM Standards & 23k Gold Gilding',
    description: 'Our father spearheaded stainless-steel ground anchors, deep sandblast relief, and triple-coated 23.5-carat English gold leafing — ensuring inscriptions endure decades of frost and rain.',
    image: '/gallery/data-9-7-2021-4928.jpg',
    tags: ['Gold Leaf Gilding', 'Ground Anchors', 'Restoration Work'],
  },
  {
    year: 'Today',
    generation: 'Generation IV — Contemporary Mastery',
    title: '115+ Years of Dedicated Craft',
    description: 'The 4th generation honors our family roots — uniting timeless stonemasonry techniques with transparent quotation, computerized drafting, and bespoke architectural monuments.',
    image: '/gallery/20170711_122547.jpg',
    tags: ['Laser Leveling', 'Transparent Pricing', 'Bespoke Design'],
  },
];

// ─── Gallery Images ──────────────────────────────────────────────────────────
const GALLERY = [
  { src: '/gallery/data-9-7-2021-3318.jpg', label: 'Grave Renovation' },
  { src: '/gallery/data-9-7-2021-3322.jpg', label: 'Cemetery Grounds' },
  { src: '/gallery/20180527_153653.jpg', label: 'Stone Detail' },
  { src: '/gallery/data-9-7-2021-1524.jpg', label: 'Book Memorial' },
  { src: '/gallery/data-9-7-2021-6701.jpg', label: 'Portrait Engraving' },
  { src: '/gallery/data-9-7-2021-209.jpg', label: 'House Nameplate' },
];

export default function HistoryPage() {
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
      { threshold: 0.1 }
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
          alt="Celtic cross grave monument"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/60 mb-3">Est. 1909 · 4 Generations</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-4">
            Our 115-Year<br />History
          </h1>
          <p className="text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
            Tracing a continuous family stonemasonry lineage across four generations of master craft.
          </p>
        </ParallaxHero>

        {/* ── Nav Strip ── */}
        <div className="sticky top-0 z-30 bg-[#FBFBFB]/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 sm:px-10 h-12">
          <nav className="flex items-center gap-1">
            <Link href="/" className="text-[11px] font-mono text-neutral-400 hover:text-neutral-700 dark:hover:text-white uppercase tracking-wider transition-colors">Home</Link>
            <span className="text-neutral-300 dark:text-neutral-600 mx-2">·</span>
            <span className="text-[11px] font-mono text-[#8B7355] uppercase tracking-wider font-semibold">History</span>
          </nav>
          <ThemeToggle variant="compact" />
        </div>

        {/* ── Intro ── */}
        <div
          ref={(el) => { sectionRefs.current[0] = el; }}
          data-index="0"
          className={`px-8 sm:px-14 xl:px-20 py-20 sm:py-28 max-w-4xl ${fadeIn(0)}`}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-6">A Living Tradition</p>
          <p className="text-2xl sm:text-3xl font-light text-neutral-700 dark:text-neutral-200 leading-relaxed">
            From a single chisel to laser-precise foundations — our family has dedicated over a century to the art of dignified memorial stonemasonry.
          </p>
        </div>

        {/* ── Timeline — alternating image + text ── */}
        {TIMELINE.map((event, i) => (
          <div key={event.year}>
            {/* Full bleed image for each era */}
            <div
              ref={(el) => { sectionRefs.current[1 + i * 2] = el; }}
              data-index={1 + i * 2}
              className={fadeIn(1 + i * 2)}
            >
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'md:grid-cols-[3fr_2fr]' : 'md:grid-cols-[2fr_3fr]'}`}>
                {i % 2 === 0 ? (
                  <>
                    <div className="relative h-[55vh] overflow-hidden">
                      <ParallaxBlock src={event.image} alt={event.title} height="h-full" />
                    </div>
                    <div className="flex flex-col justify-center px-10 xl:px-14 py-16 bg-white dark:bg-neutral-950">
                      <span className="text-5xl sm:text-6xl font-bold text-[#8B7355]/20 dark:text-[#8B7355]/15 font-mono leading-none mb-2 select-none">{event.year}</span>
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">{event.generation}</p>
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-5 leading-snug">{event.title}</h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{event.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((t) => (
                          <span key={t} className="px-3 py-1 text-[11px] font-mono bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 rounded-full border border-black/5 dark:border-white/5">{t}</span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-center px-10 xl:px-14 py-16 bg-[#FBFBFB] dark:bg-[#121212] order-2 md:order-1">
                      <span className="text-5xl sm:text-6xl font-bold text-[#8B7355]/20 dark:text-[#8B7355]/15 font-mono leading-none mb-2 select-none">{event.year}</span>
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">{event.generation}</p>
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-5 leading-snug">{event.title}</h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{event.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((t) => (
                          <span key={t} className="px-3 py-1 text-[11px] font-mono bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 rounded-full border border-black/5 dark:border-white/5">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="relative h-[55vh] overflow-hidden order-1 md:order-2">
                      <ParallaxBlock src={event.image} alt={event.title} height="h-full" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Gallery Strip ── */}
        <div
          ref={(el) => { sectionRefs.current[9] = el; }}
          data-index="9"
          className={`px-8 sm:px-14 xl:px-20 py-20 sm:py-28 ${fadeIn(9)}`}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-10">Gallery of Works</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {GALLERY.map((g, i) => (
              <Link key={i} href="/" className="group relative overflow-hidden rounded-xl aspect-square">
                <Image
                  src={g.src}
                  alt={g.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-mono">{g.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="relative overflow-hidden">
          <ParallaxBlock
            src="/gallery/20180914_141137.jpg"
            alt="Grave renovation"
            height="h-[50vh] sm:h-[60vh]"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-8">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/60 mb-4">Honoring Your Family Legacy</p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">Have an Existing<br />Grave to Restore?</h2>
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Hammer size={16} />
              Request Assessment
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <UpraityFooter />
      </main>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}
