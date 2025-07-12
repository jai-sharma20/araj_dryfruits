import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle sign-up with detailed error messages
  const signUp = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful:', result.user.email);
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  };

  // Handle sign-in with detailed error messages
  const signIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', result.user.email);
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/invalid-credentials') {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      throw new Error(error.message || 'Failed to sign in. Please try again.');
    }
  };

  // Handle Google sign-in with mobile detection
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account',
        display: 'popup'
      });

      // Check if we're on a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

      if (isMobile) {
        // Use redirect method for mobile
        console.log('Using redirect for mobile device');
        await setPersistence(auth, browserLocalPersistence);
        await signInWithRedirect(auth, provider);
      } else {
        // Use popup for desktop
        console.log('Using popup for desktop device');
        await setPersistence(auth, browserLocalPersistence);
        const result = await signInWithPopup(auth, provider);
        console.log('Google sign in successful:', result.user.email);
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign in popup was blocked. Please allow popups or try again on mobile.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign in was cancelled. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign in attempt is in progress. Please wait.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw new Error('Failed to sign in with Google. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      }
      throw new Error('Failed to send password reset email. Please try again.');
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect sign-in successful:', result.user.email);
          // You might want to trigger a success callback here
        }
      } catch (error: any) {
        console.error('Redirect sign-in error:', error);
        if (error.code === 'auth/credential-already-in-use') {
          console.error('Account already exists with a different credential');
        } else if (error.code === 'auth/operation-not-allowed') {
          console.error('Google sign-in is not enabled');
        } else if (error.code === 'auth/invalid-credential') {
          console.error('Invalid Google sign-in credential');
        }
        // You might want to trigger an error callback here
      }
    };

    // Handle redirect result when component mounts
    handleRedirectResult();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 