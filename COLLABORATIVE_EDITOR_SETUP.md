# Collaborative Editor Setup Guide

## Overview

The real-time collaborative code editor uses **Yjs + Monaco + Firebase Firestore**. This solution works on Netlify without requiring a separate server.

---

## Step 1: Firebase Project Setup

### 1.1 Create or Access Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Either:
   - **Create new project**: Click "Add project" → Enter project name → Disable Google Analytics (optional) → Click "Create project"
   - **Use existing project**: Click on your existing project from the dashboard

### 1.2 Find Your Project Name

If you forgot your project name:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Your projects are listed on the main dashboard
3. Click on a project to see its **Project ID** in Project Settings (gear icon → Project settings)

---

## Step 2: Enable Cloud Firestore

### 2.1 Create Firestore Database

1. In your Firebase project, click **"Build"** in the left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"**
4. Choose a location (select one close to your users):
   - `us-east1` (South Carolina) - recommended for US
   - `europe-west1` (Belgium) - recommended for Europe
   - `asia-east1` (Taiwan) - recommended for Asia
5. Select **"Start in test mode"** (we'll secure it later)
6. Click **"Enable"**

### 2.2 Configure Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Collaborative rooms - allow public read/write for real-time collaboration
    match /collaborative-rooms/{roomId} {
      allow read, write: if true;

      // User presence subcollection
      match /users/{userId} {
        allow read, write: if true;
      }
    }

    // Keep your existing rules for other collections below
    // Example: contacts, submissions, etc.

  }
}
```

3. Click **"Publish"**

> **Note**: For production with authentication, change `if true` to `if request.auth != null`

---

## Step 3: Get Firebase Configuration

### 3.1 Register Web App (if not already done)

1. In Firebase Console, click the **gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. If no web app exists, click the **web icon** (`</>`) to add one:
   - Enter a nickname (e.g., "AgencyPartner Web")
   - **Don't** check "Firebase Hosting" (we use Netlify)
   - Click **"Register app"**

### 3.2 Copy Configuration Values

1. In Project Settings → Your apps → Your web app
2. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB.....................",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

3. Copy each value - you'll need them for environment variables

---

## Step 4: Configure Environment Variables

### 4.1 Local Development (.env.local)

Create or update `.env.local` in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...your-api-key...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

> **Important**: Replace the placeholder values with your actual Firebase config values

### 4.2 Netlify Production

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **"Site settings"** → **"Environment variables"**
4. Add each variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |

5. Click **"Save"**
6. **Trigger a new deploy** for changes to take effect

---

## Step 5: Verify Installation

### 5.1 Check Dependencies

Run this command to verify all packages are installed:

```bash
npm ls yjs y-monaco firebase @monaco-editor/react
```

Expected output should show all packages installed without errors.

### 5.2 Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the collaborative editor:
   ```
   http://localhost:3000/en/developer-section/collaborative
   ```

3. Check browser console (F12) for any errors

### 5.3 Test Collaboration

1. Copy the room URL from the collaborative page
2. Open in a different browser or incognito window
3. Type in one editor - changes should appear in the other instantly

---

## Step 6: Verify Firebase Connection

### 6.1 Check Firestore Data

1. Go to Firebase Console → Firestore Database
2. After using the collaborative editor, you should see:
   ```
   collaborative-rooms/
     └── room-xxxxx-xxxxx/
           ├── content: [array of numbers]
           ├── lastModified: [timestamp]
           └── users/
                 └── user-xxxxx/
                       ├── name: "User-xxxxx"
                       ├── color: "hsl(xxx, 70%, 50%)"
                       └── lastSeen: [timestamp]
   ```

### 6.2 Monitor Usage

1. Go to Firebase Console → Firestore Database → **"Usage"** tab
2. Monitor reads/writes to ensure you're within free tier limits:
   - **Free tier**: 50K reads, 20K writes, 20K deletes per day

---

## Project Files Reference

| File | Purpose |
|------|---------|
| `lib/firebaseClient.ts` | Firebase initialization |
| `lib/firebaseYjsProvider.ts` | Yjs sync provider for Firestore |
| `components/CollaborativeEditor/CollaborativeEditor.tsx` | Editor component |
| `app/[locale]/developer-section/collaborative/page.tsx` | Collaborative page |

---

## Features

- Real-time collaboration (changes sync instantly)
- User presence tracking (see who's in the room)
- Multiple language support (TypeScript, JavaScript, Python, Java, Kotlin)
- Room-based sessions (shareable links)
- Works on Netlify (serverless)
- Automatic conflict resolution via Yjs CRDT

---

## Troubleshooting

### "Failed to connect to collaboration server"

1. Check browser console for specific error
2. Verify Firebase env variables are set correctly
3. Check Firestore security rules allow read/write

### "Permission denied" errors

1. Go to Firebase Console → Firestore → Rules
2. Ensure the rules from Step 2.2 are published
3. Wait 1-2 minutes for rules to propagate

### Changes not syncing between users

1. Both users must have the same room ID in URL
2. Check if Firestore is enabled (not paused)
3. Verify no ad-blockers are blocking Firebase requests

### Firebase SDK version issues

Current project uses Firebase v10.x. If you see deprecation warnings:

```bash
# Check current version
npm ls firebase

# Update if needed (optional)
npm update firebase
```

### Quota exceeded errors

1. Check Firebase Console → Firestore → Usage
2. If hitting limits, consider:
   - Enabling Firebase Blaze (pay-as-you-go) plan
   - Increasing debounce time in `firebaseYjsProvider.ts`

---

## Security Considerations

### For Development/Testing
The current rules allow public access - fine for testing.

### For Production
Update Firestore rules to require authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /collaborative-rooms/{roomId} {
      allow read, write: if request.auth != null;
      match /users/{userId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

Then implement Firebase Authentication in your app.

---

## Quick Reference

| What | Where |
|------|-------|
| Firebase Console | https://console.firebase.google.com/ |
| Firestore Rules | Firebase Console → Firestore → Rules |
| Environment Variables | `.env.local` (local) or Netlify Dashboard (production) |
| Collaborative Page | `/developer-section/collaborative` |
| Test Collaboration | Open same room URL in two browsers |
