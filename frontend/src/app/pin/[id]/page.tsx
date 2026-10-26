'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { MasonryGrid } from '../../../components/MasonryGrid';
import { SaveToBoardModal } from '../../../components/SaveToBoardModal';
import { Pin } from '../../../types';
import { fetchPinById, fetchPins, toggleLikePin, toggleSavePin, addCommentToPin } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Heart, Bookmark, ExternalLink, Share2, Check, Send, UserPlus, UserCheck } from 'lucide-react';

function PinDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const pinId = params ? (params.id as string) : '';

  const { user, token, setIsAuthModalOpen } = useAuth();
  const [pin, setPin] = useState<Pin | null>(null);
  const [relatedPins, setRelatedPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  useEffect(() => {
    if (!pinId) return;

    const loadPin = async () => {
      setLoading(true);
      try {
        const data = await fetchPinById(pinId);
        setPin(data);
        setIsLiked(data.isLiked || false);
        setLikesCount(data.likesCount || 0);
        setIsSaved(data.isSaved || false);

        // Fetch related pins based on tags
        const relatedTag = data.tags && data.tags.length > 0 ? data.tags[0] : undefined;
        const relatedData = await fetchPins({ tag: relatedTag, limit: 12 });
        setRelatedPins((relatedData.pins || []).filter((p: Pin) => p._id !== data._id));
      } catch (err) {
        console.warn('Failed to load pin detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPin();
  }, [pinId]);

  const handleLike = async () => {
    if (!user || !token) {
      setIsAuthModalOpen(true);
      return;
    }

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await toggleLikePin(pin!._id, token);
    } catch (err) {
      console.warn('Like failed:', err);
    }
  };

  const handleSave = () => {
    if (!user || !token) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSaveModalOpen(true);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user || !token || !pin) {
      if (!user) setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingComment(true);
    try {
      const newComment = await addCommentToPin(pin._id, commentText.trim(), token);
      setPin({
        ...pin,
        comments: [...(pin.comments || []), newComment],
      });
      setCommentText('');
    } catch (err) {
      console.warn('Comment post failed:', err);
      // Fallback local append for demo
      const localComment = {
        _id: 'temp-' + Date.now(),
        user: user,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      };
      setPin({
        ...pin,
        comments: [...(pin.comments || []), localComment],
      });
      setCommentText('');
    } finally {
      setIsSubmittingComment(false);
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
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="rounded-3xl bg-neutral-100 h-[600px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Pin not found</h2>
          <Link href="/" className="inline-block mt-4 px-6 py-2.5 rounded-full bg-neutral-900 text-white font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = pin.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${pin.imageUrl}` : pin.imageUrl;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="w-full px-4 sm:px-8 xl:px-12 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full hover:bg-neutral-100 text-neutral-700 font-semibold text-sm transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Pin Master Card */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-16">
          {/* Left Column: Full Image */}
          <div className="relative bg-neutral-900 flex items-center justify-center overflow-hidden min-h-[450px] md:min-h-[620px]">
            <Image
              src={imageUrl}
              alt={pin.title}
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Right Column: Pin Details & Interactions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between h-full bg-white">
            <div>
              {/* Action Toolbar */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    title="Share link"
                    className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors"
                  >
                    {copied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
                  </button>

                  {/* Like button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-3.5 h-10 rounded-full font-bold text-xs transition-colors ${
                      isLiked ? 'bg-red-50 text-red-600' : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{likesCount}</span>
                  </button>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full font-bold text-sm bg-[#E60023] hover:bg-[#ad081b] text-white shadow-md transition-transform active:scale-95"
                >
                  <Bookmark size={16} />
                  Save
                </button>
              </div>

              {/* Destination Link */}
              {pin.destinationLink && (
                <div className="mt-4">
                  <a
                    href={pin.destinationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:underline"
                  >
                    <ExternalLink size={12} />
                    <span>{new URL(pin.destinationLink).hostname}</span>
                  </a>
                </div>
              )}

              {/* Title & Description */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-3 mb-2">
                {pin.title}
              </h1>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                {pin.description || 'No description provided.'}
              </p>

              {/* Tags */}
              {pin.tags && pin.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {pin.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 capitalize"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Info */}
              {pin.user && (
                <div className="flex items-center justify-between py-4 border-t border-b border-neutral-100 my-4">
                  <Link
                    href={`/user/${pin.user.username || pin.user._id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200">
                      <Image
                        src={pin.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={pin.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-neutral-900 group-hover:underline">
                        {pin.user.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        @{pin.user.username || 'creator'}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-full font-bold text-xs transition-colors ${
                      isFollowing
                        ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-4">
                <h4 className="font-bold text-sm text-neutral-900 mb-3">
                  Comments ({pin.comments ? pin.comments.length : 0})
                </h4>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {pin.comments && pin.comments.length > 0 ? (
                    pin.comments.map((comment, index) => (
                      <div key={comment._id || index} className="flex gap-2.5 text-xs">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                          <Image
                            src={comment.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                            alt="User"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 mr-2">
                            {comment.user?.name || 'Explorer'}
                          </span>
                          <span className="text-neutral-700">{comment.text}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-400 italic">No comments yet. Be the first to share feedback!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Comment Input Footer */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-neutral-100 mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 focus:outline-none text-xs text-neutral-900"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="w-9 h-9 rounded-full bg-[#E60023] hover:bg-[#ad081b] disabled:opacity-40 text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* "More Like This" Section */}
        {relatedPins.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-neutral-900 text-center mb-8">
              More to explore
            </h2>
            <MasonryGrid pins={relatedPins} />
          </div>
        )}
      </main>

      {/* Save Modal */}
      <SaveToBoardModal
        pin={isSaveModalOpen ? pin : null}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  );
}

export default function PinDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#121214]">
          <div className="h-16 border-b border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/50" />
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 h-[600px] animate-pulse" />
          </div>
        </div>
      }
    >
      <PinDetailPageContent />
    </Suspense>
  );
}

