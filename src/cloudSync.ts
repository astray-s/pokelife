import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';
import { ref, set, get, onValue, off } from 'firebase/database';
import { auth, database } from './firebaseConfig';
import { DailyMetrics, PlayerState, Quest, WeeklyBoss, Task, Boss } from './types';

export interface CloudData {
  playerState: PlayerState;
  dailyMetrics: Record<string, DailyMetrics>;
  quests: Quest[];
  weeklyBoss: WeeklyBoss | null;
  tasks: Task[];
  bosses: Boss[];
  lastUpdated: string;
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      message: 'Account created successfully!',
      user: result.user
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    let message = 'Failed to create account';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email already in use';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password should be at least 6 characters';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address';
    }
    return {
      success: false,
      message
    };
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      message: 'Signed in successfully!',
      user: result.user
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    let message = 'Failed to sign in';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Invalid email or password';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address';
    }
    return {
      success: false,
      message
    };
  }
}

// Sign out
export async function signOut(): Promise<{ success: boolean; message: string }> {
  try {
    await firebaseSignOut(auth);
    return {
      success: true,
      message: 'Signed out successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to sign out'
    };
  }
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Save data to cloud
export async function saveToCloud(data: CloudData): Promise<{ success: boolean; message: string }> {
  const user = getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: 'Not signed in'
    };
  }

  try {
    const userRef = ref(database, `users/${user.uid}/gameData`);
    await set(userRef, {
      ...data,
      lastUpdated: new Date().toISOString()
    });
    return {
      success: true,
      message: 'Synced to cloud'
    };
  } catch (error: any) {
    console.error('Cloud save error:', error);
    return {
      success: false,
      message: error.message || 'Failed to sync'
    };
  }
}

// Load data from cloud
export async function loadFromCloud(): Promise<{ 
  success: boolean; 
  message: string; 
  data?: CloudData 
}> {
  const user = getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: 'Not signed in'
    };
  }

  try {
    const userRef = ref(database, `users/${user.uid}/gameData`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        message: 'Data loaded from cloud',
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        message: 'No cloud data found'
      };
    }
  } catch (error: any) {
    console.error('Cloud load error:', error);
    return {
      success: false,
      message: error.message || 'Failed to load data'
    };
  }
}

// Listen to real-time updates
export function listenToCloudUpdates(
  callback: (data: CloudData | null) => void
): () => void {
  const user = getCurrentUser();
  if (!user) {
    return () => {};
  }

  const userRef = ref(database, `users/${user.uid}/gameData`);
  
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });

  // Return unsubscribe function
  return () => off(userRef);
}

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  try {
    return auth.app.options.apiKey !== 'YOUR_API_KEY';
  } catch {
    return false;
  }
}
