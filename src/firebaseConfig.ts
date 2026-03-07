import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your actual Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your apps > Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyBjCmlq5VdoNUPVdIs2WL_zf2RG4ybZLss",
  authDomain: "pokelife-edf36.firebaseapp.com",
  databaseURL: "https://pokelife-edf36-default-rtdb.firebaseio.com",
  projectId: "pokelife-edf36",
  storageBucket: "pokelife-edf36.firebasestorage.app",
  messagingSenderId: "290602920362",
  appId: "1:290602920362:web:d27e5f37324197431323d3"
};

console.log('Initializing Firebase with project:', firebaseConfig.projectId);

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { db };
