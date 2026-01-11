/**
 * Firebase Configuration for VPP Realtech
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - uses environment variables with fallback
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCVdY6bngMBS5QD_GcQhUOZ3Gwl3OvuvZE",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vpprealtech-66ab3.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vpprealtech-66ab3",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vpprealtech-66ab3.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "239495134652",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:239495134652:web:b2e58af590a3de5093ffb9",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-181QM46MGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}
export { analytics };

export default app;
