'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register, demoLogin } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, username, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl overflow-hidden border border-neutral-100">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 flex items-center justify-center mx-auto mb-3 shadow-xs p-1">
            <img src="/logo.png" alt="Upraity And Son Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            {authMode === 'login' ? 'Welcome to Upraity And Son' : 'Create your Upraity And Son account'}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Save your favorite monuments and memorial designs.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Demo Fast Login */}
        <button
          type="button"
          onClick={() => {
            demoLogin();
          }}
          className="w-full mb-4 py-2.5 px-4 rounded-full border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Sparkles size={16} className="text-amber-600" />
          Continue as Demo Creator (1-Click)
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-neutral-200"></div>
          <span className="px-3 text-xs text-neutral-400 font-medium uppercase">Or</span>
          <div className="flex-1 border-t border-neutral-200"></div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E60023] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alexrivera"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E60023] text-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E60023] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E60023] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#E60023] hover:bg-[#ad081b] text-white font-bold text-sm transition-colors shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : authMode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="text-center mt-6 text-xs text-neutral-600">
          {authMode === 'login' ? (
            <p>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-neutral-900 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-neutral-900 hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
