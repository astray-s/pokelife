import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGW7jL9vYxQxH8KZxQxH8KZxQxH8KZxQx",
  authDomain: "pokelife-app.firebaseapp.com",
  projectId: "pokelife-app",
  storageBucket: "pokelife-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
