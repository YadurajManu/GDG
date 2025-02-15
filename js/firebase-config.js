// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB8h-Bg8M-x-H056ci0xZ7Uk9RV6f0aAfQ",
    authDomain: "gdg1-6c9af.firebaseapp.com",
    projectId: "gdg1-6c9af",
    storageBucket: "gdg1-6c9af.firebasestorage.app",
    messagingSenderId: "387159452511",
    appId: "1:387159452511:web:2d8c93f4ed4164eddda4ea",
    measurementId: "G-EDWY16PXJ1"
};

let auth;
let db;
let analytics;

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Initialize Analytics
    analytics = getAnalytics(app);

    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw new Error('Failed to initialize Firebase: ' + error.message);
}

export { auth, db, analytics }; 