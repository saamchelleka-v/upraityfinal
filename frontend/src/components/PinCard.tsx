'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pin } from '../types';
import { Heart, ExternalLink, Bookmark, Check, Share2 } from 'lucide-react';
import { toggleLikePin, toggleSavePin } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface PinCardProps {
  pin: Pin;
  onOpenSaveModal?: (pin: Pin) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onOpenSaveModal }) => {
  const { user, token, setIsAuthModalOpen } = useAuth();
  const [isLiked, setIsLiked] = useState(pin.isLiked || false);
  const [likesCount, setLikesCount] = useState(pin.likesCount || 0);
  const [isSaved, setIsSaved] = useState(pin.isSaved || false);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  // Normalize image URL (handle local backend path vs remote URL)
  const getFullImageUrl = (url: string) => {
    if (url.startsWith('/uploads/')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optimistic UI update
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await toggleLikePin(pin._id, token);
    } catch (err) {
      // Revert if failed
      console.warn('Like toggle failed:', err);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      setIsAuthModalOpen(true);
      return;
    }

    if (onOpenSaveModal) {
      onOpenSaveModal(pin);
      return;
    }

    // Direct save fallback
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      await toggleSavePin(pin._id, token);
    } catch (err) {
      console.warn('Save failed:', err);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const pinUrl = `${window.location.origin}/pin/${pin._id}`;
      navigator.clipboard.writeText(pinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="masonry-item group cursor-zoom-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-2xl overflow-hidden bg-neutral-100 shadow-xs hover:shadow-xl transition-all duration-300">
        <Link href={`/pin/${pin._id}`} className="block relative w-full">
          {/* Main Pin Image with dynamic aspect ratio */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              paddingBottom: `${Math.min(180, Math.max(80, (pin.aspectRatio || 1.4) * 100))}%`,
            }}
          >
            <Image
              src={getFullImageUrl(pin.imageUrl)}
              alt={pin.title || 'Upraity And Son Work'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>

          {/* Hover Dark Vignette & Overlay */}
          <div
            className={`absolute inset-0 bg-black/35 transition-opacity duration-200 flex flex-col justify-between p-3.5 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Bar: Save Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full capitalize">
                {pin.tags && pin.tags.length > 0 ? pin.tags[0] : 'Inspo'}
              </span>

              <button
                type="button"
                onClick={handleSave}
                className={`px-4 py-2 rounded-full font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-neutral-900 text-white'
                    : 'bg-[#E60023] hover:bg-[#ad081b] text-white'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check size={14} />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={14} />
                    Save
                  </>
                )}
              </button>
            </div>

            {/* Bottom Bar: External Link, Share, and Like */}
            <div className="flex items-center justify-between gap-2">
              {pin.destinationLink ? (
                <a
                  href={pin.destinationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 text-xs font-medium backdrop-blur-md transition-colors truncate max-w-[140px]"
                >
                  <ExternalLink size={12} className="flex-shrink-0" />
                  <span className="truncate">{new URL(pin.destinationLink).hostname.replace('www.', '')}</span>
                </a>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-1.5">
                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  title="Copy link"
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center backdrop-blur-md transition-colors shadow-xs"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
                </button>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleLike}
                  title="Like pin"
                  className={`flex items-center gap-1 px-2.5 h-8 rounded-full backdrop-blur-md text-xs font-bold transition-all shadow-xs ${
                    isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 hover:bg-white text-neutral-800'
                  }`}
                >
                  <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                  {likesCount > 0 && <span>{likesCount}</span>}
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Pin Card Metadata (Title & Author) */}
      <div className="pt-2 px-1">
        <h3 className="font-semibold text-sm text-neutral-900 line-clamp-1 leading-tight hover:underline cursor-pointer">
          <Link href={`/pin/${pin._id}`}>{pin.title}</Link>
        </h3>
        {pin.user && (
          <Link
            href={`/user/${pin.user.username || pin.user._id}`}
            className="flex items-center gap-2 mt-1.5 group/user w-fit"
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden bg-neutral-200">
              <Image
                src={pin.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={pin.user.name || 'Author'}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-neutral-600 group-hover/user:text-neutral-900 truncate">
              {pin.user.name}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};
