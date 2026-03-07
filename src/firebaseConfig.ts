import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your actual Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your apps > Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyCOXwkhABK5LtzKQS3ZyVBopXoq-GS5Ttg",
  authDomain: "pokelife-tracker.firebaseapp.com",
  projectId: "pokelife-tracker",
  storageBucket: "pokelife-tracker.firebasestorage.app",
  messagingSenderId: "748400307285",
  appId: "1:748400307285:web:115387aefd7aec7b7c38dc",
  measurementId: "G-RT6DC1R1LP"
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
