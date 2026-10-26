'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { createPin, fetchUserBoards } from '../../services/api';
import { Board } from '../../types';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, Tag, Check, X, ArrowUpRight } from 'lucide-react';

export default function CreatePinPage() {
  const router = useRouter();
  const { user, token, setIsAuthModalOpen } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destinationLink, setDestinationLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [boardId, setBoardId] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1.4);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchUserBoards(user._id, token)
        .then((data) => {
          setBoards(data);
          if (data.length > 0) setBoardId(data[0]._id);
        })
        .catch(() => {});
    }
  }, [user, token]);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setErrorMessage('');

    // Calculate aspect ratio
    const img = new window.Image();
    img.src = objectUrl;
    img.onload = () => {
      const ratio = img.naturalHeight / img.naturalWidth;
      setAspectRatio(Number(ratio.toFixed(2)));
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!selectedFile && !customImageUrl) {
      setErrorMessage('Please select an image file or provide an image URL');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Pin title is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('destinationLink', destinationLink.trim());
      formData.append('tags', tagsInput);
      formData.append('aspectRatio', aspectRatio.toString());
      if (boardId) formData.append('boardId', boardId);

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (customImageUrl) {
        formData.append('customImageUrl', customImageUrl.trim());
      }

      const createdPin = await createPin(formData, token);
      router.push(`/pin/${createdPin._id}`);
    } catch (err: any) {
      console.warn('Backend create error:', err);
      // If backend was offline, direct back to home
      setErrorMessage(err.message || 'Error creating pin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70">
      <Navbar />

      <main className="w-full px-4 sm:px-8 xl:px-12 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-neutral-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Create Pin</h1>
              <p className="text-xs text-neutral-500 mt-0.5">Upload photos, inspire others, and grow your audience</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-full font-bold text-sm bg-[#E60023] hover:bg-[#ad081b] disabled:opacity-50 text-white shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Pin'}
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage('')}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Image Upload & Preview (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              {/* Tabs for Upload vs URL */}
              <div className="flex rounded-full bg-neutral-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-1.5 rounded-full transition-colors ${
                    activeTab === 'upload' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-1.5 rounded-full transition-colors ${
                    activeTab === 'url' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  Image URL
                </button>
              </div>

              {activeTab === 'upload' ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[380px] ${
                    imagePreview
                      ? 'border-neutral-200 bg-neutral-900'
                      : 'border-neutral-300 hover:border-[#E60023] bg-neutral-50 hover:bg-neutral-100/60'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                      <div className="w-12 h-12 rounded-full bg-neutral-200/80 flex items-center justify-center text-neutral-600 mb-4">
                        <UploadCloud size={24} />
                      </div>
                      <p className="font-bold text-sm text-neutral-800 mb-1">
                        Choose a file or drag and drop it here
                      </p>
                      <p className="text-xs text-neutral-400 max-w-[220px]">
                        We recommend using high quality .jpg or .png files less than 20MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customImageUrl}
                    onChange={(e) => {
                      setCustomImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  />
                  {customImageUrl && (
                    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-neutral-100">
                      <img src={customImageUrl} alt="URL Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Metadata Form (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Add a compelling title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-bold text-neutral-900 border-b border-neutral-200 focus:border-neutral-900 py-2 focus:outline-none placeholder:text-neutral-300"
                />
              </div>

              {/* Creator Pill */}
              {user && (
                <div className="flex items-center gap-2 py-2">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-200">
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">{user.name}</span>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What is this pin about? Share backstory, materials, or style details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm text-neutral-800 border border-neutral-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
              </div>

              {/* Destination Link */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Destination Link
                </label>
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-3.5 text-neutral-400" size={16} />
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com/article"
                    value={destinationLink}
                    onChange={(e) => setDestinationLink(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Tags (Comma separated)
                </label>
                <div className="relative flex items-center">
                  <Tag className="absolute left-3.5 text-neutral-400" size={16} />
                  <input
                    type="text"
                    placeholder="architecture, interior, minimalist, photography"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  />
                </div>
              </div>

              {/* Board Selector */}
              {boards.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Save to Board
                  </label>
                  <select
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium text-neutral-800 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  >
                    {boards.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
