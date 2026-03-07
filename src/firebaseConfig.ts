import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your actual Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your apps > Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyBqVHWLxQxH8KZxQxH8KZxQxH8KZxQxH8",
  authDomain: "synthpoke-default-rtdb.firebaseapp.com",
  projectId: "synthpoke-default-rtdb",
  storageBucket: "synthpoke-default-rtdb.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
