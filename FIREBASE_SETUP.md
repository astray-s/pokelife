# Firebase Cloud Sync Setup Guide

This guide will help you set up Firebase for cross-device cloud sync in PokeLife.

## Why Firebase?
- **Free**: Up to 1GB storage and 10GB/month bandwidth on free tier
- **No Backend Needed**: Firebase handles everything
- **Real-time Sync**: Changes sync instantly across devices
- **Email/Password Auth**: Simple account creation

## Setup Steps (5 minutes)

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `pokelife` (or any name you like)
4. Disable Google Analytics (optional, not needed)
5. Click "Create project"

### 2. Enable Email/Password Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" provider
4. Toggle "Enable"
5. Click "Save"

### 3. Create Realtime Database

1. Click "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose location closest to you
4. Start in **"Test mode"** (we'll secure it next)
5. Click "Enable"

### 4. Secure Your Database

1. In Realtime Database, click "Rules" tab
2. Replace the rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

3. Click "Publish"

This ensures users can only read/write their own data.

### 5. Get Your Firebase Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app with nickname: `pokelife-web`
6. Copy the `firebaseConfig` object

### 6. Add Config to Your App

1. Open `src/firebaseConfig.ts`
2. Replace the placeholder values with your config:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",  // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 7. Deploy and Test

1. Build your app: `npm run build`
2. Deploy to your hosting (Vercel, Netlify, etc.)
3. Open the app and create an account with email/password
4. Your data will now sync across all devices!

## Security Notes

- Your API key is safe to expose in client-side code
- Database rules ensure users can only access their own data
- Passwords are securely hashed by Firebase
- Never share your Firebase project credentials with untrusted parties

## Troubleshooting

**"Firebase not configured" error:**
- Make sure you replaced ALL placeholder values in `firebaseConfig.ts`
- Check that your API key doesn't have quotes or extra spaces

**"Permission denied" error:**
- Verify your database rules are set correctly
- Make sure you're signed in

**"Email already in use" error:**
- Use the "Sign in" option instead of "Sign up"

**"Weak password" error:**
- Password must be at least 6 characters

## Free Tier Limits

- **Storage**: 1 GB
- **Bandwidth**: 10 GB/month
- **Connections**: 100 simultaneous

These limits are more than enough for personal use!

## Need Help?

Check the [Firebase Documentation](https://firebase.google.com/docs) or open an issue on GitHub.
