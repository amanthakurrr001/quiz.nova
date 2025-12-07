'use client';

import type { User as AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInAnonymously, User as FirebaseUser } from "firebase/auth";
import { initializeFirebase } from '@/firebase';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  completeOnboarding: (details: { name: string; profession?: string; age?: number }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { auth } = initializeFirebase();

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('quizgenius-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // If there's a stored user, we assume they are logged in.
        // The onAuthStateChanged listener will verify and update this.
        const authInstance = getAuth();
        if (authInstance.currentUser) {
            setFirebaseUser(authInstance.currentUser);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('quizgenius-user');
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        if (fbUser.isAnonymous) {
            const guestUser: AppUser = { email: `guest_${fbUser.uid}@example.com`, name: 'Guest', isGuest: true };
            updateUserInStateAndStorage(guestUser);
        } else {
            // For non-anonymous users, we might still have old data in local storage
            const storedUser = localStorage.getItem('quizgenius-user');
            if (storedUser) {
                const appUser = JSON.parse(storedUser);
                // Make sure the logged-in user matches the one in storage
                if (appUser.email === fbUser.email) {
                    setUser(appUser);
                } else {
                    // Mismatch, create a new user profile object
                    const newUser: AppUser = { email: fbUser.email!, name: fbUser.displayName || '' };
                    updateUserInStateAndStorage(newUser);
                }
            } else {
                 const newUser: AppUser = { email: fbUser.email!, name: fbUser.displayName || 'User' };
                 updateUserInStateAndStorage(newUser);
            }
        }
      } else {
        // No Firebase user
        updateUserInStateAndStorage(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth, loadUserFromStorage]);

  const updateUserInStateAndStorage = useCallback((newUser: AppUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('quizgenius-user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('quizgenius-user');
      localStorage.removeItem('quizgenius-quizzes');
      localStorage.removeItem('quizgenius-results');
    }
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    const appUser: AppUser = { email: fbUser.email!, name: fbUser.displayName || '' };
    updateUserInStateAndStorage(appUser);
  };
  
  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    // You might want to update the Firebase user's display name here
    // await updateProfile(fbUser, { displayName: name });
    const appUser: AppUser = { email: fbUser.email!, name: name };
    updateUserInStateAndStorage(appUser);
  };

  const loginAsGuest = async () => {
    const userCredential = await signInAnonymously(auth);
    const fbUser = userCredential.user;
    const guestUser: AppUser = { email: `guest_${fbUser.uid}@example.com`, name: 'Guest', isGuest: true };
    updateUserInStateAndStorage(guestUser);
  };

  const completeOnboarding = useCallback((details: { name: string; profession?: string; age?: number }) => {
    if (user) {
      const updatedUser = { ...user, ...details, name: details.name };
      updateUserInStateAndStorage(updatedUser);
      // Also update Firebase profile if it's a real user
      if (firebaseUser && !firebaseUser.isAnonymous) {
        // updateProfile(firebaseUser, { displayName: details.name });
      }
    }
  }, [user, firebaseUser, updateUserInStateAndStorage]);

  const logout = useCallback(async () => {
    await signOut(auth);
    updateUserInStateAndStorage(null);
    router.push('/');
  }, [auth, updateUserInStateAndStorage, router]);

  const isOnboarded = !!user?.name;

  const value = {
    user,
    firebaseUser,
    isAuthenticated: !!firebaseUser,
    isLoading,
    isOnboarded,
    login,
    signup,
    loginAsGuest,
    completeOnboarding,
    logout,
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
