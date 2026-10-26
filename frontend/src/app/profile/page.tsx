'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { MasonryGrid } from '../../components/MasonryGrid';
import { SaveToBoardModal } from '../../components/SaveToBoardModal';
import { useAuth } from '../../context/AuthContext';
import { fetchUserCreatedPins, fetchUserSavedPins, fetchUserBoards } from '../../services/api';
import { Pin, Board } from '../../types';
import { Share2, Edit3, Plus, Lock, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, token, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<'created' | 'saved' | 'boards'>('created');

  const [createdPins, setCreatedPins] = useState<Pin[]>([]);
  const [savedPins, setSavedPins] = useState<Pin[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activePinForModal, setActivePinForModal] = useState<Pin | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadProfileData = async () => {
      setLoading(true);
      try {
        const [cData, sData, bData] = await Promise.all([
          fetchUserCreatedPins(user.username || user._id),
          fetchUserSavedPins(user.username || user._id),
          fetchUserBoards(user._id, token || undefined),
        ]);
        setCreatedPins(cData || []);
        setSavedPins(sData || []);
        setBoards(bData || []);
      } catch (err) {
        console.warn('Error loading profile content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user, token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-24 px-4">
          <h2 className="text-xl font-bold mb-3">Please sign in to view your profile</h2>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-[#E60023] text-white font-bold text-sm shadow-md"
          >
            Log in or Sign up
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-10">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-neutral-100 shadow-xl mb-4">
            <Image
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{user.name}</h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">@{user.username}</p>

          {user.bio && (
            <p className="text-sm text-neutral-700 mt-3 max-w-md leading-relaxed">{user.bio}</p>
          )}

          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-600 mt-3">
            <span>{user.followersCount || 1420} followers</span>
            <span>•</span>
            <span>{user.followingCount || 382} following</span>
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
            <Link
              href="/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#ad081b] text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Plus size={14} />
              <span>Create Pin</span>
            </Link>
          </div>
        </div>

        {/* Profile Tabs Switcher */}
        <div className="flex justify-center border-b border-neutral-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('created')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'created'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Created ({createdPins.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'saved'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Saved ({savedPins.length})
            </button>
            <button
              onClick={() => setActiveTab('boards')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'boards'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Boards ({boards.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'created' && (
          <MasonryGrid
            pins={createdPins}
            isLoading={loading}
            onOpenSaveModal={(p) => setActivePinForModal(p)}
          />
        )}

        {activeTab === 'saved' && (
          <MasonryGrid
            pins={savedPins}
            isLoading={loading}
            onOpenSaveModal={(p) => setActivePinForModal(p)}
          />
        )}

        {activeTab === 'boards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {boards.map((b) => (
              <div
                key={b._id}
                className="group rounded-3xl bg-neutral-100 hover:bg-neutral-200/70 p-4 transition-all duration-300 cursor-pointer border border-neutral-200/50"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-300 mb-3 shadow-inner">
                  {b.coverImage ? (
                    <Image src={b.coverImage} alt={b.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-neutral-400">
                      {b.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-neutral-900 group-hover:text-[#E60023] transition-colors truncate">
                    {b.name}
                  </h3>
                  {b.isPrivate && <Lock size={14} className="text-neutral-400" />}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {Array.isArray(b.pins) ? b.pins.length : 0} pins
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Save Modal */}
      <SaveToBoardModal
        pin={activePinForModal}
        onClose={() => setActivePinForModal(null)}
      />
    </div>
  );
}
