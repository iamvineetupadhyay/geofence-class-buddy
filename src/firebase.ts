// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBbLcO_JekHyejmSluMhMN_ovEuKAHVDSI",
  authDomain: "pragyasetu-attendmate.firebaseapp.com",
  projectId: "pragyasetu-attendmate",
  storageBucket: "pragyasetu-attendmate.firebasestorage.app",
  messagingSenderId: "752922764527",
  appId: "1:752922764527:web:5d47e7c04c636b465ba71a",
  measurementId: "G-DL1G2C2H7E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth, Firestore, and Google Provider
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
