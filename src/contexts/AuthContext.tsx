import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { setPersistence, browserLocalPersistence } = await import('firebase/auth');
      await setPersistence(auth, browserLocalPersistence);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user to Firestore
      const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const userRef = doc(db, 'users', user.uid);
      let userSnap;
      try {
        userSnap = await getDoc(userRef);
      } catch (error: any) {
        // If it's a network error here, we might want to retry once
        if (error.code === 'unavailable') {
          console.warn("Firestore unavailable, retrying...");
          userSnap = await getDoc(userRef);
        } else {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          return;
        }
      }
      
      try {
        if (!userSnap?.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            rank: 'E',
            subscription: 'free'
          });
        } else {
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
      
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      if (error.code === 'auth/network-request-failed') {
        throw new Error("Network connection failed. Please check your internet or disable AdBlockers and try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayName = async (name: string) => {
    if (!auth.currentUser) return;
    try {
      const { updateProfile } = await import('firebase/auth');
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');

      // Update Auth profile
      await updateProfile(auth.currentUser, { displayName: name });
      
      // Update Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userRef, { displayName: name });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }

      // Manually update state to reflect change immediately
      setUser({ ...auth.currentUser });
    } catch (error) {
      console.error("Error updating display name", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, updateDisplayName }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
