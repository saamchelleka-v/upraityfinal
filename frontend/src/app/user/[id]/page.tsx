'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '../../../components/Navbar';
import { MasonryGrid } from '../../../components/MasonryGrid';
import { SaveToBoardModal } from '../../../components/SaveToBoardModal';
import { useAuth } from '../../../context/AuthContext';
import { fetchUserProfile, fetchUserCreatedPins, toggleFollowUser } from '../../../services/api';
import { User, Pin } from '../../../types';
import { Share2, Check } from 'lucide-react';

function PublicUserProfileContent() {
  const params = useParams();
  const identifier = params ? (params.id as string) : '';

  const { user: currentUser, token, setIsAuthModalOpen } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activePinForModal, setActivePinForModal] = useState<Pin | null>(null);

  useEffect(() => {
    if (!identifier) return;

    const loadUser = async () => {
      setLoading(true);
      try {
        const [profile, createdPins] = await Promise.all([
          fetchUserProfile(identifier, token || undefined),
          fetchUserCreatedPins(identifier),
        ]);
        setUserProfile(profile);
        setIsFollowing(profile.isFollowing || false);
        setFollowersCount(profile.followersCount || 240);
        setPins(createdPins || []);
      } catch (err) {
        console.warn('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [identifier, token]);

  const handleFollow = async () => {
    if (!currentUser || !token) {
      setIsAuthModalOpen(true);
      return;
    }

    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await toggleFollowUser(userProfile!._id);
    } catch (err) {
      console.warn('Follow failed:', err);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto py-24 text-center animate-pulse">
          <div className="w-28 h-28 rounded-full bg-neutral-200 mx-auto mb-4" />
          <div className="h-6 w-48 bg-neutral-200 mx-auto rounded mb-2" />
          <div className="h-4 w-32 bg-neutral-200 mx-auto rounded" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-24 px-4">
          <h2 className="text-xl font-bold mb-2">User not found</h2>
          <p className="text-neutral-500 text-sm">The creator profile you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-10">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-neutral-100 shadow-xl mb-4">
            <Image
              src={userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={userProfile.name}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{userProfile.name}</h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">@{userProfile.username}</p>

          {userProfile.bio && (
            <p className="text-sm text-neutral-700 mt-3 max-w-md leading-relaxed">{userProfile.bio}</p>
          )}

          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-600 mt-3">
            <span>{followersCount} followers</span>
            <span>•</span>
            <span>{userProfile.followingCount || 85} following</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handleFollow}
              className={`px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition-colors ${
                isFollowing
                  ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                  : 'bg-[#E60023] hover:bg-[#ad081b] text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Section title */}
        <div className="border-b border-neutral-100 pb-4 mb-6">
          <h2 className="text-center font-bold text-base text-neutral-900">
            Created by {userProfile.name} ({pins.length})
          </h2>
        </div>

        {/* Pins Feed */}
        <MasonryGrid
          pins={pins}
          isLoading={false}
          onOpenSaveModal={(p) => setActivePinForModal(p)}
        />
      </main>

      <SaveToBoardModal
        pin={activePinForModal}
        onClose={() => setActivePinForModal(null)}
      />
    </div>
  );
}

export default function PublicUserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#121214]">
          <div className="h-16 border-b border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/50" />
          <div className="max-w-xl mx-auto py-24 text-center animate-pulse">
            <div className="w-28 h-28 rounded-full bg-neutral-200 dark:bg-neutral-800 mx-auto mb-4" />
            <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 mx-auto rounded mb-2" />
          </div>
        </div>
      }
    >
      <PublicUserProfileContent />
    </Suspense>
  );
}

