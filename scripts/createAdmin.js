/**
 * Create Admin User Script
 * 
 * This script creates an admin user in Firebase Authentication.
 * 
 * Usage:
 *   1. Update the email and password below
 *   2. Run: node scripts/createAdmin.js
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// Firebase configuration (same as in src/services/firebase.js)
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCVdY6bngMBS5QD_GcQhUOZ3Gwl3OvuvZE",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "vpprealtech-66ab3.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "vpprealtech-66ab3",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "vpprealtech-66ab3.firebasestorage.app",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "239495134652",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:239495134652:web:b2e58af590a3de5093ffb9",
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-181QM46MGY"
};

// ========================================
// UPDATE THESE VALUES
// ========================================
const ADMIN_EMAIL = 'shreyashvpp@gmail.com';
const ADMIN_PASSWORD = 'Admin@123'; // Change this to a strong password
const ADMIN_NAME = 'VPP Admin';
// ========================================

async function createAdminUser() {
    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        console.log('Creating admin user...');
        console.log(`Email: ${ADMIN_EMAIL}`);

        // Create user
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
        );

        // Update profile with display name
        await updateProfile(userCredential.user, {
            displayName: ADMIN_NAME
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('================================');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log(`User ID: ${userCredential.user.uid}`);
        console.log('================================');
        console.log('\nYou can now login at /admin');

        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('\n⚠️  User already exists with this email.');
            console.log('You can login with the existing credentials at /admin');
        } else {
            console.error('\n❌ Error creating admin user:', error.message);
        }
        process.exit(1);
    }
}

createAdminUser();
