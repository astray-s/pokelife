# Firebase Cloud Sync Setup

## Current Configuration
- Project ID: `pokelife-edf36`
- Database: Firestore (not Realtime Database)

## Important: Firestore Security Rules

Your Firestore database needs proper security rules to allow read/write access. 

### Option 1: Test Mode (Temporary - 30 days)
Go to Firebase Console > Firestore Database > Rules and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ This allows anyone to read/write. Only use for testing!

### Option 2: User-based Security (Recommended)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

This allows anyone to read/write to their own user document.

## Troubleshooting

### Check Browser Console
Open DevTools (F12) and look for:
- "Firebase initialized successfully" - Firebase loaded correctly
- "Starting cloud sync for user: [email]" - Sync started
- Any error messages with details

### Common Errors

1. **"Missing or insufficient permissions"**
   - Fix: Update Firestore security rules (see above)

2. **"Network request failed"**
   - Fix: Check internet connection
   - Fix: Verify Firebase project is active in Firebase Console

3. **"Unsupported field value: undefined"**
   - Fix: Already handled by cleanUndefined function

4. **"Firebase: Error (auth/...)"**
   - This app doesn't use Firebase Auth, only Firestore
   - User ID is just an email/identifier, not authentication

## Testing

1. Enter your email in the "User ID" field
2. Click "☁️ Sync to Cloud"
3. Check browser console for logs
4. If successful, you'll see "✓ Synced to cloud!"
5. Try "📥 Restore from Cloud" to verify data was saved

## Data Structure

Data is saved to: `users/{userId}` document with:
- playerState (level, XP, Pokemon, eggs)
- dailyMetrics (all daily logs)
- quests (active quests)
- weeklyBoss (current boss)
- bosses (mini bosses)
- tasks (task list)
- lastSync (timestamp)
