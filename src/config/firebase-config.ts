/**
 * Firebase client SDK configuration
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCOJo0IxZL8ldRWZfDcc6-Pdi9S3NA_fUI",
  authDomain: "cube-trainer-ce95a.firebaseapp.com",
  projectId: "cube-trainer-ce95a",
  storageBucket: "cube-trainer-ce95a.firebasestorage.app",
  messagingSenderId: "977756255417",
  appId: "1:977756255417:web:cb4cdf0f47dad78ac05768"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

