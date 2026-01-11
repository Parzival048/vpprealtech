/**
 * Supabase Authentication Service
 */
import { supabase } from './supabase';

// Sign in with email and password
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }

        // Store user info in localStorage
        localStorage.setItem('vpp_admin_token', data.session.access_token);
        localStorage.setItem('vpp_admin_user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || 'Admin User',
        }));

        return {
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || 'Admin User',
            }
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: 'Login failed. Please try again.' };
    }
}

// Sign out
export async function signOut() {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem('vpp_admin_token');
        localStorage.removeItem('vpp_admin_user');
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

// Get current user
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Check if user is authenticated
export async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

// Subscribe to auth state changes
export function onAuthChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            callback({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || 'Admin User',
            });
        } else {
            callback(null);
        }
    });
}

// Get stored user from localStorage
export function getStoredUser() {
    const userData = localStorage.getItem('vpp_admin_user');
    return userData ? JSON.parse(userData) : null;
}
