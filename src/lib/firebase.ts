// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ideabubbles",
  appId: "1:893587530177:web:3abf7876766c85e6224f40",
  storageBucket: "ideabubbles.firebasestorage.app",
  apiKey: "AIzaSyB1jHzPp690kLFSu_Z4Jjn0zJbvVS9Ufm0",
  authDomain: "ideabubbles.firebaseapp.com",
  messagingSenderId: "893587530177",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
