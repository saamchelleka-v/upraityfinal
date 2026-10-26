'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { API_BASE_URL } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  demoLogin: () => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Check local storage for persistent token and user
    try {
      const storedToken = localStorage.getItem('pinterest_token');
      const storedUser = localStorage.getItem('pinterest_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Automatically provide demo user for seamless out-of-the-box exploration
        demoLogin();
      }
    } catch (e) {
      console.warn('Could not read user session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data: AuthResponse = await res.json();
      setToken(data.token);
      const userObj: User = {
        _id: data._id,
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
      };
      setUser(userObj);
      localStorage.setItem('pinterest_token', data.token);
      localStorage.setItem('pinterest_user', JSON.stringify(userObj));
      setIsAuthModalOpen(false);
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data: AuthResponse = await res.json();
      setToken(data.token);
      const userObj: User = {
        _id: data._id,
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
      };
      setUser(userObj);
      localStorage.setItem('pinterest_token', data.token);
      localStorage.setItem('pinterest_user', JSON.stringify(userObj));
      setIsAuthModalOpen(false);
    } catch (err: any) {
      throw err;
    }
  };

  const demoLogin = () => {
    const demoUser: User = {
      _id: 'user-demo',
      name: 'Demo Creator',
      username: 'democreator',
      email: 'demo@pinterest.local',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Visual curator, UI/UX enthusiast & coffee connoisseur. Collecting inspirations from around the globe.',
    };
    const mockToken = 'mock_jwt_token_demo_mode_2026';
    setUser(demoUser);
    setToken(mockToken);
    localStorage.setItem('pinterest_token', mockToken);
    localStorage.setItem('pinterest_user', JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pinterest_token');
    localStorage.removeItem('pinterest_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
