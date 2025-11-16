# Installation Guide

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout with providers
│   ├── page.js            # Home page
├── components/
│   ├── Header/            # Header & Navigation
│   ├── Hero/              # Hero section with particles
│   ├── Services/          # Services overview
│   ├── Pricing/           # Pricing cards
│   ├── FAQ/               # FAQ accordion
│   ├── Portfolio/         # Case studies
│   ├── Contact/           # Contact form
│   ├── Footer/            # Footer
│   └── FAB/               # Floating Action Button
├── contexts/
│   ├── ThemeContext.js    # Dark/light theme
│   └── LanguageContext.js # Language switching
├── lib/
│   └── translations.js    # Translation strings
└── styles/
    └── globals.css        # Global styles & CSS variables
```

## Key Features

- ✅ Next.js 14 with App Router
- ✅ CSS Modules for scoped styling
- ✅ Framer Motion for animations
- ✅ Dark mode by default
- ✅ Responsive design
- ✅ Firebase ready (configure in `lib/firebase.js`)

## Configuration

### Firebase Setup

Create `lib/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Environment Variables

Create `.env.local` for sensitive data:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
```

## Build & Deploy

```bash
npm run build
npm start
```

Deploy to Vercel or Netlify for best results!

