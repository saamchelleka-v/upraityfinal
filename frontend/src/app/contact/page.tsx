'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UpraitySidebar } from '../../components/UpraitySidebar';
import { ThemeToggle } from '../../components/ThemeToggle';
import { UpraityFooter } from '../../components/UpraityFooter';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { createInquiry } from '../../services/cmsApi';

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
    <div ref={ref} className="relative w-full h-[75vh] overflow-hidden">
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

function ParallaxBlock({ src, alt, height = 'h-[50vh]' }: { src: string; alt: string; height?: string }) {
  const ref = useParallax(0.22);
  return (
    <div ref={ref} className={`relative w-full ${height} overflow-hidden`}>
      <div data-parallax-inner className="absolute inset-0 scale-[1.12]" style={{ willChange: 'transform' }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </div>
    </div>
  );
}

// ─── Work Showcase Images ────────────────────────────────────────────────────
const SHOWCASE = [
  { src: '/gallery/20170711_122547.jpg', label: 'Grave Structure', cat: 'Construction & Installation' },
  { src: '/gallery/2626.jpg', label: 'Marble Monument', cat: 'Marble & Granite' },
  { src: '/gallery/data-9-7-2021-4928.jpg', label: '23k Gold Lettering', cat: 'Engraving & Gilding' },
  { src: '/gallery/data-9-7-2021-5838.jpg', label: 'Celtic Cross', cat: 'Custom Sculpture' },
];

const INPUT_CLASS = 'w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] transition-all';
const LABEL_CLASS = 'block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cemetery: '',
    serviceType: 'Grave Structure',
    message: '',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createInquiry({ ...formData, source: 'contact_form' });
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] dark:bg-[#121212] text-[#1a1a1a] dark:text-[#ededed]">
      <UpraitySidebar />

      <main className="flex-1 min-w-0 pt-14 md:pt-0">

        {/* ── Hero ── */}
        <ParallaxHero
          src="/gallery/data-9-7-2021-1172.jpg"
          alt="Upraity And Son workshop"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/60 mb-3">Compassionate · Transparent · Expert</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-4">
            Contact<br />Our Workshop
          </h1>
          <p className="text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
            Speak directly with our monumental masons. Free consultation, site visits, and transparent written estimates.
          </p>
        </ParallaxHero>

        {/* ── Nav Strip ── */}
        <div className="sticky top-0 z-30 bg-[#FBFBFB]/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 sm:px-10 h-12">
          <nav className="flex items-center gap-1">
            <Link href="/" className="text-[11px] font-mono text-neutral-400 hover:text-neutral-700 dark:hover:text-white uppercase tracking-wider transition-colors">Home</Link>
            <span className="text-neutral-300 dark:text-neutral-600 mx-2">·</span>
            <span className="text-[11px] font-mono text-[#8B7355] uppercase tracking-wider font-semibold">Contact</span>
          </nav>
          <ThemeToggle variant="compact" />
        </div>

        {/* ── Direct Contact Strip ── */}
        <div
          ref={(el) => { sectionRefs.current[0] = el; }}
          data-index="0"
          className={`px-8 sm:px-14 xl:px-20 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 border-b border-black/5 dark:border-white/5 ${fadeIn(0)}`}
        >
          {[
            { icon: <Phone size={20} className="text-[#8B7355]" />, label: 'Phone', value: '+44 (0) 20 8000 1909', sub: 'Mon – Sat, 8am – 6pm', href: 'tel:+442080001909' },
            { icon: <Mail size={20} className="text-[#8B7355]" />, label: 'Email', value: 'contact@upraityandson.com', sub: 'Reply within 24 hours', href: 'mailto:contact@upraityandson.com' },
            { icon: <MapPin size={20} className="text-[#8B7355]" />, label: 'Workshop', value: 'South East England', sub: 'Cemetery site visits available', href: undefined },
            { icon: <Clock size={20} className="text-[#8B7355]" />, label: 'Hours', value: '8:00 AM – 6:00 PM', sub: 'Monday through Saturday', href: undefined },
          ].map((c, i) => (
            <div key={i} className="flex flex-col gap-2">
              {c.icon}
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">{c.label}</span>
              {c.href ? (
                <a href={c.href} className="text-sm font-semibold text-neutral-900 dark:text-white hover:text-[#8B7355] transition-colors">{c.value}</a>
              ) : (
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{c.value}</span>
              )}
              <span className="text-xs text-neutral-400">{c.sub}</span>
            </div>
          ))}
        </div>

        {/* ── Showcase Grid ── */}
        <div
          ref={(el) => { sectionRefs.current[1] = el; }}
          data-index="1"
          className={`px-8 sm:px-14 xl:px-20 py-16 ${fadeIn(1)}`}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-8">Our Work</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SHOWCASE.map((w, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl aspect-[3/4]">
                <Image
                  src={w.src}
                  alt={w.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white text-xs font-semibold leading-tight">{w.label}</span>
                  <span className="text-white/60 text-[10px] font-mono mt-0.5">{w.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Parallax break ── */}
        <ParallaxBlock
          src="/gallery/20170911_160857.jpg"
          alt="Marble monument workshop"
          height="h-[40vh] sm:h-[55vh]"
        />

        {/* ── Contact Form + Info ── */}
        <div
          ref={(el) => { sectionRefs.current[2] = el; }}
          data-index="2"
          className={`px-8 sm:px-14 xl:px-20 py-20 sm:py-28 ${fadeIn(2)}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

            {/* Left: form */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355] mb-3">Get in Touch</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-8 leading-snug">
                Request a Free<br />Consultation
              </h2>

              {isSubmitted ? (
                <div className="flex flex-col items-start gap-4 py-10">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Thank You</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
                    Our 4th-generation master stonemason will personally review your enquiry and respond within 24 hours with a transparent written estimate.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={LABEL_CLASS}>Full Name</label>
                      <input name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={INPUT_CLASS} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Phone</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 …" className={INPUT_CLASS} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Email Address</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com" className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Cemetery / Location</label>
                    <input name="cemetery" value={formData.cemetery} onChange={handleChange} placeholder="Cemetery name or area" className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Service Required</label>
                    <select name="serviceType" value={formData.serviceType} onChange={handleChange} className={INPUT_CLASS}>
                      <option>Grave Structure</option>
                      <option>Marble or Granite Monument</option>
                      <option>Name & Date Engraving</option>
                      <option>House Nameplate</option>
                      <option>Grave Renovation & Re-Leveling</option>
                      <option>Cleaning & Maintenance</option>
                      <option>Custom Design</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Message (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Any specific requirements, family inscription details, or questions…" className={INPUT_CLASS + ' resize-none'} />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>{isSubmitting ? 'Sending…' : 'Send Enquiry'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: info */}
            <div className="space-y-8">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B7355]">What to Expect</p>

              <div className="space-y-6">
                {[
                  { n: '01', title: 'Personal Response Within 24h', desc: 'A master stonemason — not an automated system — will personally read and reply to your enquiry.' },
                  { n: '02', title: 'Free Cemetery Site Visit', desc: 'We visit the plot to take exact measurements, inspect ground conditions, and photograph the site at no charge.' },
                  { n: '03', title: 'Transparent Written Estimate', desc: 'A fully itemized written quote is provided before any commitment. No hidden charges, no surprises.' },
                  { n: '04', title: 'Compassionate Guidance', desc: 'We understand the sensitivity of your situation and guide you with patience, respect, and expertise.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-5">
                    <span className="text-2xl font-bold font-mono text-[#8B7355]/25 dark:text-[#8B7355]/20 shrink-0 leading-none mt-0.5">{s.n}</span>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">{s.title}</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-xl border border-black/8 dark:border-white/8 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Our Commitment</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Every structure we build is fully Cemetery Authority Compliant, surveyed to BRAMM standards, and comes with a lifetime leveling guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Full-bleed image ── */}
        <div className="relative overflow-hidden">
          <ParallaxBlock
            src="/gallery/data-9-7-2021-3322.jpg"
            alt="Cemetery landscape"
            height="h-[50vh] sm:h-[60vh]"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-8">
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/60 mb-4">Direct Line</p>
            <a
              href="tel:+442080001909"
              className="text-3xl sm:text-5xl font-bold text-white hover:text-[#8B7355] transition-colors"
            >
              +44 (0) 20 8000 1909
            </a>
            <p className="text-sm text-white/60 mt-3">Monday – Saturday · 8am – 6pm</p>
          </div>
        </div>

        {/* ── Footer ── */}
        <UpraityFooter />
      </main>
    </div>
  );
}
