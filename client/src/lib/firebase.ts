import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`, 
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
import { getApp } from "firebase/app";

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  // If app is already initialized, get the existing instance
  if (error.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    throw error;
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  // Try popup first, fallback to redirect if popup fails
  return signInWithPopup(auth, provider).catch((error) => {
    console.log('Popup failed, trying redirect:', error);
    return signInWithRedirect(auth, provider);
  });
};

export const handleAuthRedirect = () => {
  return getRedirectResult(auth);
};

export const signOutUser = () => {
  return signOut(auth);
};
