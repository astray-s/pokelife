# PokeLife Deployment Guide

Your app is built and ready to deploy! Choose one of these free hosting options:

## Option 1: Vercel (Recommended - Easiest)

### Deploy via GitHub (Automatic)
1. Push your code to GitHub (if not already done)
2. Go to https://vercel.com/
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite settings
6. Click "Deploy"
7. Done! Your app is live at `your-app.vercel.app`

### Deploy via CLI
```bash
npm install -g vercel
vercel login
vercel
```

## Option 2: Netlify

### Deploy via GitHub (Automatic)
1. Push your code to GitHub
2. Go to https://netlify.com/
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings are auto-detected from `netlify.toml`
6. Click "Deploy"
7. Done! Your app is live at `your-app.netlify.app`

### Deploy via Drag & Drop
1. Go to https://app.netlify.com/drop
2. Drag the `dist` folder onto the page
3. Done! Instant deployment

### Deploy via CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/pokelife"
}
```

3. Deploy:
```bash
npm run deploy
```

## Option 4: Firebase Hosting

Since you already have Firebase set up:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

2. Initialize hosting:
```bash
firebase init hosting
```
- Select your Firebase project
- Public directory: `dist`
- Single-page app: `Yes`
- Overwrite index.html: `No`

3. Deploy:
```bash
npm run build
firebase deploy --only hosting
```

## Custom Domain (Optional)

All platforms above support custom domains:
- Vercel: Project Settings → Domains
- Netlify: Site Settings → Domain Management
- GitHub Pages: Repository Settings → Pages → Custom domain
- Firebase: Hosting → Add custom domain

## Environment Variables

If you need to hide your Firebase config (optional):

1. Create `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... etc
```

2. Update `src/firebaseConfig.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

3. Add environment variables in your hosting platform's dashboard

**Note:** Firebase API keys are safe to expose in client-side code, so this step is optional.

## Troubleshooting

**404 on refresh:**
- Make sure SPA redirect is configured (already done in `vercel.json` and `netlify.toml`)

**Build fails:**
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 18 or higher

**Firebase not working:**
- Verify `src/firebaseConfig.ts` has your actual Firebase credentials
- Check Firebase console for any security rule issues

## Your App is Ready! 🎉

The `dist` folder contains your production-ready app. Deploy it anywhere and start tracking your productivity with Pokemon!
