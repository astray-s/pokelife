import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// IMPORTANT: Replace these with your own Firebase project credentials
// Get them from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyBjCmlq5VdoNUPVdIs2WL_zf2RG4ybZLss",
  authDomain: "pokelife-edf36.firebaseapp.com",
  databaseURL: "https://pokelife-edf36-default-rtdb.firebaseio.com",
  projectId: "pokelife-edf36",
  storageBucket: "pokelife-edf36.firebasestorage.app",
  messagingSenderId: "290602920362",
  appId: "1:290602920362:web:d27e5f37324197431323d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
