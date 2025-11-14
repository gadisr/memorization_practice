/**
 * Authentication service for Firebase
 */

import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase-config.js';
import { trackEvent, setUserId } from './analytics.js';

export interface AuthState {
  user: FirebaseUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

let authState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true
};

// Initialize auth state immediately
let authInitialized = false;

const authListeners: ((state: AuthState) => void)[] = [];

export function subscribeToAuthState(callback: (state: AuthState) => void): () => void {
  authListeners.push(callback);
  callback(authState);
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) authListeners.splice(index, 1);
  };
}

function notifyAuthListeners(): void {
  authListeners.forEach(listener => listener(authState));
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Track user sign in
    trackEvent('user_sign_in', {
      method: 'google'
    });
    setUserId(result.user.uid);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

export async function signUpWithEmailAndPassword(email: string, password: string): Promise<FirebaseUser> {
  try {
    const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Track user sign up
    trackEvent('user_sign_in', {
      method: 'email'
    });
    setUserId(result.user.uid);
    return result.user;
  } catch (error: any) {
    console.error('Email sign-up error:', error);
    // Convert Firebase errors to user-friendly messages
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

export async function signInWithEmailAndPassword(email: string, password: string): Promise<FirebaseUser> {
  try {
    const result: UserCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    // Track user sign in
    trackEvent('user_sign_in', {
      method: 'email'
    });
    setUserId(result.user.uid);
    return result.user;
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    // Convert Firebase errors to user-friendly messages
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

export async function sendPasswordResetEmailToUser(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
    trackEvent('password_reset_requested', {});
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password authentication is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
    // Track user sign out
    trackEvent('user_sign_out', {});
    setUserId(null);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export function getAuthState(): AuthState {
  return authState;
}

export async function waitForAuthInit(): Promise<AuthState> {
  return new Promise((resolve) => {
    if (authInitialized) {
      resolve(authState);
      return;
    }
    
    const unsubscribe = subscribeToAuthState((state) => {
      if (!state.isLoading) {
        unsubscribe();
        resolve(state);
      }
    });
  });
}

// Initialize auth state listener
onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
  
  if (user) {
    const token = await user.getIdToken();
    authState = {
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    };
    console.log('User authenticated:', user.email);
    // Set user ID for analytics (only if not already set from signInWithGoogle)
    setUserId(user.uid);
  } else {
    authState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    };
    console.log('User not authenticated');
    setUserId(null);
  }
  
  authInitialized = true;
  notifyAuthListeners();
});

