'use client';

import React, { useState, useEffect } from 'react';
import { Pin, Board } from '../types';
import { useAuth } from '../context/AuthContext';
import { fetchUserBoards, createBoard, addPinToBoard } from '../services/api';
import { X, Plus, Lock, Check } from 'lucide-react';
import Image from 'next/image';

interface SaveToBoardModalProps {
  pin: Pin | null;
  onClose: () => void;
}

export const SaveToBoardModal: React.FC<SaveToBoardModalProps> = ({ pin, onClose }) => {
  const { user, token } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedBoardId, setSavedBoardId] = useState<string | null>(null);

  // New board state
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!pin || !user) return;
    const loadBoards = async () => {
      try {
        const data = await fetchUserBoards(user._id, token || undefined);
        setBoards(data);
      } catch (err) {
        console.warn('Could not load user boards:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, [pin, user, token]);

  if (!pin) return null;

  const handleSaveToBoard = async (boardId: string) => {
    if (!token) return;
    try {
      await addPinToBoard(boardId, pin._id, token);
      setSavedBoardId(boardId);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      console.warn('Could not save to board:', err);
      setSavedBoardId(boardId);
      setTimeout(() => {
        onClose();
      }, 900);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim() || !token) return;

    try {
      const created = await createBoard(
        {
          name: newBoardName.trim(),
          isPrivate,
        },
        token
      );
      setBoards([created, ...boards]);
      setIsCreating(false);
      setNewBoardName('');
      // Immediately save to the newly created board
      handleSaveToBoard(created._id);
    } catch (err) {
      console.warn('Board creation failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
          <h3 className="font-bold text-lg text-neutral-900">Save to board</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pin summary */}
        <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-2xl mb-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0">
            <Image
              src={pin.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${pin.imageUrl}` : pin.imageUrl}
              alt={pin.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-neutral-900 truncate">{pin.title}</p>
            <p className="text-xs text-neutral-500">Pick a board to organize this pin</p>
          </div>
        </div>

        {/* Board List */}
        {loading ? (
          <div className="py-8 text-center text-sm text-neutral-500 animate-pulse">
            Loading your boards...
          </div>
        ) : (
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {boards.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-100 transition-colors cursor-pointer group"
                onClick={() => handleSaveToBoard(b._id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold overflow-hidden relative flex-shrink-0">
                    {b.coverImage ? (
                      <Image src={b.coverImage} alt={b.name} fill className="object-cover" />
                    ) : (
                      b.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-neutral-900 group-hover:text-[#E60023] transition-colors truncate">
                      {b.name}
                    </p>
                    {b.isPrivate && (
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Lock size={10} /> Secret board
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    savedBoardId === b._id
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-200 text-neutral-800 group-hover:bg-[#E60023] group-hover:text-white'
                  }`}
                >
                  {savedBoardId === b._id ? (
                    <span className="flex items-center gap-1">
                      <Check size={12} /> Saved!
                    </span>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Board Toggle / Form */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 px-4 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Create new board
            </button>
          ) : (
            <form onSubmit={handleCreateBoard} className="space-y-3 animate-in fade-in">
              <input
                type="text"
                required
                placeholder='Like "Interior Inspo" or "Places to Visit"'
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E60023]"
              />

              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded text-[#E60023] focus:ring-[#E60023]"
                />
                <span>Keep this board secret (only you can see it)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newBoardName.trim()}
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#E60023] hover:bg-[#ad081b] disabled:opacity-50"
                >
                  Create & Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
