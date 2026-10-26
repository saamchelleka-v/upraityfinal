'use client';

import React from 'react';
import { Ruler, Compass, Layers, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  const pillars = [
    {
      title: 'Measurement & Alignment',
      description: 'Laser and optical plumb alignment ensuring perpendicular squareness across kerbs, plinths, and headpieces.',
      icon: <Ruler size={18} className="text-[#8B7355]" />,
    },
    {
      title: 'Precision Leveling',
      description: 'Reinforced concrete foundation pads and ground anchor dowels preventing tilt, sinking, or frost heave over generations.',
      icon: <Compass size={18} className="text-[#8B7355]" />,
    },
    {
      title: 'Material Finishing',
      description: 'Carefully chosen Italian Bianco Carrara marble and premium granite polished to mirror or eggshell finishes.',
      icon: <Layers size={18} className="text-[#8B7355]" />,
    },
    {
      title: 'Lasting Durability',
      description: 'Weather-sealed joints, anti-acid rainwater runoff contours, and 23k gold leaf that stays radiant in all seasons.',
      icon: <Sparkles size={18} className="text-[#8B7355]" />,
    },
  ];

  const fullServicesList = [
    'Grave structure construction and installation',
    'Marble and granite grave monuments',
    'Memorial plaques and headstones',
    'Custom-designed grave structures',
    'Name and date engraving',
    'House nameplates',
    'Small masonry projects',
    'Decorative stone structures',
    'Cleaning and washing',
    'Periodically maintenance of installed structure',
    'Grave renovation',
    'Repair cracked or damaged structure',
    'Re-level old graves',
    'Replacement of broken slabs',
    'Respectful and dependable service',
  ];

  const engravingServices = [
    { title: 'Names and dates', desc: 'Hand-cut incised V-groove Roman lettering & modern sandblast typography.' },
    { title: 'Religious / symbolic designs', desc: 'Crosses, Celtic knotwork, Islamic crescents, Star of David, and floral emblems.' },
    { title: 'Portrait engraving', desc: 'Permanent photorealistic diamond-point etching rendered directly from family photos.' },
    { title: 'Marble & granite plaques', desc: 'Custom commemorative tablets for cremation plots, benches, and church walls.' },
  ];

  return (
    <div className="space-y-12 my-8 pt-4 border-t border-white/10 text-white">
      {/* Heritage Narrative Block */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#e5c07b] font-semibold uppercase tracking-wider">
          <span>Upraity And Son • Over a Century of Stonemasonry</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
          A Century of Dignified Remembrance
        </h2>

        <p className="text-sm leading-relaxed text-white/90">
          "Upraity And Son was established on the principles of precision stonemasonry and enduring reverence. Our family business has been passed down through generations. My grandfather continued the work followed by my father, and today, we proudly carry forward the legacy, values, and craftsmanship that began more than a century ago."
        </p>

        <p className="text-sm leading-relaxed text-white/80">
          We understand that a grave monument is more than a structure. It is a lasting place of remembrance for family and loved ones. Our aim is to provide strong, well finished and dignified memorial structures that family can be proud of for years to come.
        </p>
      </div>

      {/* Quality & Craftsmanship Pillars */}
      <div>
        <div className="mb-6">
          <span className="text-xs font-mono text-white/70 uppercase tracking-wider">Methodology</span>
          <h3 className="text-lg font-bold text-white mt-0.5 drop-shadow-sm">
            Quality and Craftsmanship
          </h3>
          <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
            We pay close attention to measurement, alignment, leveling, finishing and durability during structure installation. We work with suitable material and follow a careful installation process to ensure that each monument is properly constructed and finished.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/10 bg-[#141416] space-y-2 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                {p.icon}
              </div>
              <h4 className="font-bold text-sm text-white">{p.title}</h4>
              <p className="text-xs text-white/80 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cemetery Guidelines & Transparent Pricing Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-[#141416] flex gap-3 shadow-sm">
          <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Individual Cemetery Compliance</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Every project is handled individually, according to the family’s requirements, the available grave space, and the applicable cemetery guidelines. We handle permits, foundation depth checks, and municipal submissions.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#141416] flex gap-3 shadow-sm">
          <HeartHandshake size={20} className="text-[#e5c07b] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">100% Transparent Pricing</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              No hidden costs or unexpected cemetery surcharge surprises. All estimates detail stone procurement, precision letter carving, foundation piers, and on-site crane/manual erection.
            </p>
          </div>
        </div>
      </div>

      {/* Engraving & Lettering Section */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-mono text-white/70 uppercase tracking-wider">Lettercraft</span>
          <h3 className="text-lg font-bold text-white mt-0.5 drop-shadow-sm">
            Engraving & Lettering Artistry
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {engravingServices.map((e, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/10 bg-[#141416] shadow-sm"
            >
              <h5 className="font-bold text-xs text-white mb-1">{e.title}</h5>
              <p className="text-xs text-white/80 leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Services Checklist */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-mono text-white/70 uppercase tracking-wider">Scope</span>
          <h3 className="text-lg font-bold text-white mt-0.5 drop-shadow-sm">
            Our Complete Range of Services
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {fullServicesList.map((service, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-[#141416] text-xs text-white font-medium shadow-xs"
            >
              <CheckCircle2 size={13} className="text-[#e5c07b] flex-shrink-0" />
              <span className="truncate">{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
