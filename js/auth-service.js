import { 
    auth,
    db 
} from './firebase-config.js';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

import databaseService from './database-service.js';

class AuthService {
    constructor() {
        this.auth = auth;
        this.db = db;
        this.currentUser = null;
        
        // Listen for auth state changes
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            this.handleAuthStateChange(user);
        });
    }

    // Handle auth state changes
    handleAuthStateChange(user) {
        const authButtons = document.querySelector('.auth-buttons');
        if (user) {
            // User is signed in
            if (authButtons) {
                authButtons.innerHTML = `
                    <button class="nav-button login-btn" onclick="authService.signOut()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" 
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Logout</span>
                    </button>
                `;
            }
        } else {
            // User is signed out
            if (authButtons) {
                authButtons.innerHTML = `
                    <a href="login.html" class="nav-button login-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" 
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Login</span>
                    </a>
                    
                    <a href="signup.html" class="nav-button signup-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M17 11h6" 
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Sign Up</span>
                    </a>
                `;
            }
        }
    }

    // Sign up with email and password
    async signUp(email, password, userData) {
        try {
            console.log('Starting signup in AuthService...');
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            console.log('Firebase Auth account created:', user.uid);
            
            // Create user profile in Firestore
            await databaseService.createUserProfile(user.uid, {
                email: user.email,
                ...userData,
                createdAt: new Date().toISOString()
            });
            
            console.log('User profile created in Firestore');
            return user;
        } catch (error) {
            console.error('Error in AuthService signUp:', error);
            throw error;
        }
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Error in sign in:', error);
            throw error;
        }
    }

    // Sign out
    async signOut() {
        try {
            await signOut(this.auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    // Get current user data from Firestore
    async getCurrentUserData() {
        if (!this.currentUser) return null;
        
        try {
            return await databaseService.getUserProfile(this.currentUser.uid);
        } catch (error) {
            console.error('Error getting user data:', error);
            throw error;
        }
    }
}

// Create and export a single instance
const authService = new AuthService();
export default authService; 