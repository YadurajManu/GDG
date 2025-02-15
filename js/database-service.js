import { db } from './firebase-config.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

class DatabaseService {
    constructor() {
        this.db = db;
        this.isConnected = false;
        // Test connection on initialization
        this.testConnection();
    }

    // Test database connection
    async testConnection() {
        try {
            // Try to access the users collection
            const testDoc = doc(this.db, 'test_connection', 'test');
            await setDoc(testDoc, {
                timestamp: new Date().toISOString(),
                status: 'connected'
            });
            console.log('✅ Database connection successful!');
            this.isConnected = true;
            // Clean up test document
            await deleteDoc(testDoc);
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            this.isConnected = false;
            // Don't show alert, just log the error
            console.error('Database configuration error:', error);
        }
    }

    // Create or update a user profile
    async createUserProfile(userId, userData) {
        try {
            const userRef = doc(this.db, 'users', userId);
            await setDoc(userRef, {
                ...userData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    // Get user profile with initialization if not exists
    async getUserProfile(userId) {
        try {
            if (!userId) {
                console.warn('getUserProfile called without userId');
                return null;
            }

            const userRef = doc(this.db, 'users', userId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                return userSnap.data();
            } else {
                // Initialize empty profile if doesn't exist
                const initialProfile = {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    investments: [],
                    settings: {
                        language: 'en',
                        notifications: true
                    }
                };
                await this.createUserProfile(userId, initialProfile);
                return initialProfile;
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }

    // Update user profile
    async updateUserProfile(userId, updateData) {
        try {
            const userRef = doc(this.db, 'users', userId);
            await updateDoc(userRef, {
                ...updateData,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // Create an investment record
    async createInvestment(userId, investmentData) {
        try {
            const investmentRef = doc(collection(this.db, 'users', userId, 'investments'));
            await setDoc(investmentRef, {
                ...investmentData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error creating investment:', error);
            throw error;
        }
    }

    // Get user's investments
    async getUserInvestments(userId) {
        try {
            const investmentsRef = collection(this.db, 'users', userId, 'investments');
            const querySnapshot = await getDocs(investmentsRef);
            
            const investments = [];
            querySnapshot.forEach((doc) => {
                investments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return investments;
        } catch (error) {
            console.error('Error getting user investments:', error);
            throw error;
        }
    }
}

// Create and export a single instance
const databaseService = new DatabaseService();
export default databaseService; 