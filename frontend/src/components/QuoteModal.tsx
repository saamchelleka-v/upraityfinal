'use client';

import React, { useState } from 'react';
import { X, Check, ShieldCheck, HeartHandshake, Send, Loader2 } from 'lucide-react';
import { UpraityItem } from '../data/upraityData';
import { createInquiry } from '../services/cmsApi';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedItem?: UpraityItem | null;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedItem,
}) => {
  const [selectedService, setSelectedService] = useState(
    preselectedItem?.categoryLabel || 'Grave structure construction and installation'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cemeteryLocation, setCemeteryLocation] = useState('');
  const [letteringDetails, setLetteringDetails] = useState('');
  const [engravingType, setEngravingType] = useState('Names and dates');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createInquiry({
        name,
        phone,
        email,
        cemetery: cemeteryLocation,
        serviceType: selectedService,
        message: `Lettering request: ${engravingType}. Inscription notes: ${letteringDetails || 'Standard request'}${preselectedItem ? ` (Referenced Monument: ${preselectedItem.title})` : ''}`,
        source: 'quote_calculator',
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2800);
    } catch (err) {
      console.warn('Quote lead creation error:', err);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#121214] text-white rounded-2xl overflow-hidden shadow-2xl border border-white/15 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#e5c07b] font-semibold uppercase tracking-wider mb-0.5">
              <ShieldCheck size={13} />
              <span>Transparent Pricing & Respectful Service</span>
            </div>
            <h3 className="text-lg font-bold text-white drop-shadow-sm">
              Request a Memorial Consultation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
              Thank You for Reaching Out
            </h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
              Our 4th-generation master stonemason will personally review your family requirements and cemetery regulations. We will provide an honest, dignified, and fully transparent written estimate.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            {/* Service Selection */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Select Memorial Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-[#18181b] text-white focus:outline-none focus:ring-1 focus:ring-[#e5c07b]"
              >
                <option value="Grave structure construction and installation">Grave structure construction & installation</option>
                <option value="Marble and granite grave monuments">Marble and granite grave monuments</option>
                <option value="Memorial plaques and headstones">Memorial plaques and headstones</option>
                <option value="Custom-designed grave structures">Custom-designed grave structures</option>
                <option value="Name and date engraving">Name and date engraving</option>
                <option value="House nameplates">House nameplates</option>
                <option value="Small masonry projects">Small masonry projects</option>
                <option value="Decorative stone structures">Decorative stone structures</option>
                <option value="Cleaning and washing">Cleaning and washing</option>
                <option value="Periodically maintenance of installed structure">Periodically maintenance of installed structure</option>
                <option value="Grave renovation & re-leveling">Grave renovation & re-leveling</option>
                <option value="Repair cracked or damaged structure">Repair cracked or damaged structure</option>
                <option value="Replacement of broken slabs">Replacement of broken slabs</option>
              </select>
            </div>

            {/* Engraving & Lettering Type */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Engraving & Lettering Requirements
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Names and dates',
                  'Religious/symbolic designs',
                  'Portrait engraving',
                  'Marble & granite plaques',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEngravingType(type)}
                    className={`py-2 px-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      engravingType === type
                        ? 'border-[#e5c07b] bg-[#8B7355] text-white font-bold shadow-xs'
                        : 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Cemetery Location */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Cemetery / Churchyard Name or Location
              </label>
              <input
                type="text"
                placeholder="e.g. City Cemetery, St. Mary's Churchyard, or Private Allotment"
                value={cemeteryLocation}
                onChange={(e) => setCemeteryLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-[#18181b] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#e5c07b]"
              />
              <span className="text-[10px] text-white/70 mt-1 block">
                We handle cemetery permit applications and verify height/depth allotment rules for you.
              </span>
            </div>

            {/* Inscription Notes */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Memorial Notes or Specific Inscription Details
              </label>
              <textarea
                rows={2}
                placeholder="Share any special family requests, dimensions, or text you wish to include..."
                value={letteringDetails}
                onChange={(e) => setLetteringDetails(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-[#18181b] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#e5c07b]"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-white mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-white/15 bg-[#18181b] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#e5c07b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-white/15 bg-[#18181b] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#e5c07b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-white/15 bg-[#18181b] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#e5c07b]"
                />
              </div>
            </div>

            {/* Trust Banner */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-white/80">
              <HeartHandshake size={15} className="text-[#e5c07b] flex-shrink-0" />
              <span>
                "Every project is handled individually, according to the family’s requirements, the available grave space, and applicable cemetery guidelines."
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#8B7355] hover:bg-[#a68a68] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg border border-[#e5c07b]/40 cursor-pointer drop-shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Transmitting Consultation...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit for Transparent Pricing Quote</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
