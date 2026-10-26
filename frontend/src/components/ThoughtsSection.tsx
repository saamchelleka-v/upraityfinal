'use client';

import React from 'react';
import Image from 'next/image';
import { ThoughtArticle } from '../data/thoughtsData';
import { BookOpen, Clock, ArrowUpRight } from 'lucide-react';

export interface ThoughtsSectionProps {
  articles: ThoughtArticle[];
  onSelectArticle: (article: ThoughtArticle) => void;
  showHeader?: boolean;
}

export const ThoughtsSection: React.FC<ThoughtsSectionProps> = ({
  articles,
  onSelectArticle,
  showHeader = true,
}) => {
  if (!articles || articles.length === 0) return null;

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <section id="thoughts" className="scroll-mt-24 pt-2 pb-12">
      {showHeader && (
        <div className="pb-6 mb-8 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#e5c07b] mb-2 font-semibold flex items-center gap-1.5">
              <BookOpen size={13} />
              <span>Upraity And Son · Masonry Journal</span>
            </p>
            <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-white drop-shadow-sm">
              Thoughts & Observations
            </h2>
          </div>

          <span className="text-xs font-mono text-neutral-500 dark:text-white/70">
            Craft, Material & Heritage
          </span>
        </div>
      )}

      {/* Featured Essay */}
      {featured && (
        <div
          onClick={() => onSelectArticle(featured)}
          className="group cursor-pointer mb-12 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#141416] shadow-sm hover:shadow-2xl hover:border-[#e5c07b]/50 grid grid-cols-1 lg:grid-cols-12 transition-all duration-300"
        >
          <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden min-h-[300px] sm:min-h-[360px] bg-neutral-900">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#e5c07b] mb-4 font-semibold">
                <span>{featured.category}</span>
                <span>·</span>
                <span>{featured.date}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-neutral-900 dark:text-white leading-snug mb-4 group-hover:text-[#e5c07b] transition-colors">
                {featured.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {featured.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-black/5 dark:border-white/5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>{featured.readTime}</span>
              </span>
              <span className="flex items-center gap-1 text-[#e5c07b] font-semibold group-hover:translate-x-1 transition-transform">
                Read Essay <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {rest.map((article) => (
          <article
            key={article.slug}
            onClick={() => onSelectArticle(article)}
            className="group cursor-pointer flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-[#141416] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#e5c07b]/50 transition-all duration-300"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-neutral-900">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#e5c07b] mb-2 font-semibold">
                <span>{article.category}</span>
                <span>·</span>
                <span>{article.date}</span>
              </div>
              <h4 className="text-lg font-light text-neutral-900 dark:text-white leading-snug mb-2 group-hover:text-[#e5c07b] font-track-hover transition-colors">
                {article.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-6 border-t border-black/5 dark:border-white/5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>{article.readTime}</span>
              </span>
              <span className="flex items-center gap-1 text-[#e5c07b] font-semibold group-hover:translate-x-1 transition-transform">
                Read <ArrowUpRight size={13} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ThoughtsSection;
