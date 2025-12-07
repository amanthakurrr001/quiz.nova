'use client';

import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string) => void;
  completeOnboarding: (details: { name: string; profession?: string; age?: number }) => void;
  logout: () => void;
  setApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('quizgenius-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('quizgenius-user');
    }
    setIsLoading(false);
  }, []);

  const updateUserInStateAndStorage = useCallback((newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('quizgenius-user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('quizgenius-user');
      localStorage.removeItem('quizgenius-quizzes');
      localStorage.removeItem('quizgenius-results');
    }
  }, []);

  const login = useCallback((email: string) => {
    const newUser: User = { email, name: '' };
    updateUserInStateAndStorage(newUser);
  }, [updateUserInStateAndStorage]);

  const completeOnboarding = useCallback((details: { name: string; profession?: string; age?: number }) => {
    if (user) {
      const updatedUser = { ...user, ...details, name: details.name };
      updateUserInStateAndStorage(updatedUser);
    }
  }, [user, updateUserInStateAndStorage]);

  const logout = useCallback(() => {
    updateUserInStateAndStorage(null);
    router.push('/');
  }, [updateUserInStateAndStorage, router]);

  const setApiKey = useCallback((key: string) => {
    if (user) {
      const updatedUser = { ...user, apiKey: key };
      updateUserInStateAndStorage(updatedUser);
    }
  }, [user, updateUserInStateAndStorage]);

  const isOnboarded = !!user?.name;

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isOnboarded,
    login,
    completeOnboarding,
    logout,
    setApiKey,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div className="flex h-screen w-full items-center justify-center"><p>Loading...</p></div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
