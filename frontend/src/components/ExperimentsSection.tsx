'use client';

import React from 'react';
import Image from 'next/image';
import { ExperimentItem } from '../data/experimentsData';
import { Sparkles, Eye, ArrowRight } from 'lucide-react';

export interface ExperimentsSectionProps {
  experiments: ExperimentItem[];
  onSelectExperiment: (experiment: ExperimentItem) => void;
  showHeader?: boolean;
}

export const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  experiments,
  onSelectExperiment,
  showHeader = true,
}) => {
  if (!experiments || experiments.length === 0) return null;

  return (
    <section id="experiments" className="scroll-mt-24 pt-2 pb-12">
      {showHeader && (
        <div className="pb-6 mb-8 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#e5c07b]" />
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#e5c07b] font-semibold">
                Upraity And Son Workshop Labs
              </p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-white drop-shadow-sm">
              Masonry Experiments
            </h2>
          </div>

          <span className="text-xs font-mono text-neutral-500 dark:text-white/70">
            Prototypes & Bespoke Studies
          </span>
        </div>
      )}

      <p className="max-w-2xl text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
        Where fourth-generation traditional stonemasonry explores contemporary architectural forms, progressive geology, and novel relief techniques.
      </p>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            onClick={() => onSelectExperiment(exp)}
            className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#141416] shadow-sm hover:shadow-2xl hover:border-[#e5c07b]/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono text-white/90 font-medium border border-white/10">
                  {exp.studyNumber}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                  <span className="truncate max-w-[200px]">{exp.material}</span>
                  <span className="text-[#e5c07b] font-semibold">{exp.status}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-light text-neutral-900 dark:text-white leading-snug mb-3 group-hover:text-[#e5c07b] font-track-hover transition-colors">
                  {exp.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                <Eye size={13} /> View Experiment Study
              </span>
              <span className="text-[#e5c07b] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperimentsSection;
