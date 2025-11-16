# Optimus Agency - Next.js Migration

This is a Next.js migration of the Optimus Agency website, converting the original HTML/CSS implementation to a modern, modular Next.js application with CSS Modules and Framer Motion animations.

## 🚀 Features

- **Next.js 14** with App Router
- **CSS Modules** for scoped, modular styling
- **Framer Motion** for smooth, performant animations
- **Dark Mode** by default (as per user preference)
- **Responsive Design** - Mobile-first approach
- **TypeScript Support** (optional, currently using JavaScript)
- **Firebase Integration** for contact forms
- **Internationalization** support (ES/EN)

## 📁 Project Structure

```
├── app/
│   ├── layout.js          # Root layout with providers
│   ├── page.js            # Home page
│   └── globals.css        # Global styles and CSS variables
├── components/
│   ├── Header/            # Header and navigation
│   ├── Hero/              # Hero section
│   ├── Services/          # Services overview
│   ├── Pricing/           # Pricing section
│   ├── FAQ/               # FAQ accordion
│   ├── Portfolio/         # Case studies
│   ├── Contact/           # Contact form
│   ├── Footer/            # Footer component
│   └── FAB/               # Floating Action Button
├── contexts/
│   ├── ThemeContext.js    # Dark/light theme context
│   └── LanguageContext.js # Language switching context
├── lib/
│   ├── translations.js    # Translation strings
│   └── firebase.js        # Firebase configuration
└── styles/
    └── globals.css        # Global CSS variables and base styles
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Philosophy

The migration preserves the original design and animations while improving:
- **Performance**: Optimized with Next.js server-side rendering
- **Maintainability**: Modular components with CSS Modules
- **Animations**: Smooth transitions using Framer Motion
- **Code Quality**: Clean, reusable React components

## 🎭 Key Components

### Header
- Sticky navigation with smooth scroll
- Mobile menu with clip-path animation
- Wave animation SVG

### Hero Section
- Animated hero title
- Floating gradient banner
- Particle.js background
- Statistics counter animation

### Services
- Service cards with hover effects
- Gradient backgrounds
- Responsive grid layout

### Pricing
- Three-tier pricing cards
- Featured card highlighting
- Smooth hover animations

### FAQ
- Accordion with Framer Motion
- Smooth expand/collapse
- Gradient indicators

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 992px
- Desktop: > 992px

## 🌙 Dark Mode

Dark mode is enabled by default. The theme persists in localStorage and can be toggled via the FAB (Floating Action Button) or mobile menu.

## 🌍 Internationalization

Currently supports Spanish (ES) and English (EN). Language preference is saved in localStorage.

## 🔧 Configuration

### Firebase Setup
Configure Firebase in `lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  // ... other config
};
```

### Environment Variables
Create a `.env.local` file for sensitive configuration.

## 📦 Build

```bash
npm run build
npm start
```

## 🚢 Deployment

This project is ready to deploy on:
- **Vercel** (recommended)
- **Netlify**
- Any Node.js hosting platform

## 📝 Notes

- All animations from the original site have been preserved
- CSS Modules ensure no style conflicts
- Framer Motion provides smooth, performant animations
- The design matches the original pixel-perfect

## 🤝 Contributing

This is a migration project. Please maintain consistency with the original design while improving code quality.

## 📄 License

Same as the original project.
