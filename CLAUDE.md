# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint (next lint)
```

No test framework is configured.

## Architecture

**Framework**: Next.js 16 (App Router) with React 19 and TypeScript 5.3.

### Routing & i18n

All pages live under `app/[locale]/` with locale-based dynamic routing (`en`, `es`). The default locale is `es`. Middleware (`middleware.ts`) redirects non-localized paths to `/{defaultLocale}/{path}`. API routes (`app/api/`) and static files bypass locale routing.

Key route groups:
- `app/[locale]/page.tsx` — Landing page (agency site)
- `app/[locale]/developer-section/` — Developer hub with blog, courses, challenges, playground, collaborative editor
- `app/[locale]/agentes/` — AI agents page
- `app/[locale]/asesorias/` — Consulting/mentoring services
- `app/api/chat/` — Google Generative AI chat endpoint
- `app/api/recommend-project/` — AI project advisor endpoint

### Provider Hierarchy

Root layout (`app/layout.tsx`) wraps the app in nested context providers:
`ThemeProvider > LanguageProvider > ProjectAdvisorProvider > FABProvider`

Global floating components (FloatingChat, FAB, ProjectAdvisorWrapper) render at the root level outside route content.

### State Management

React Context only (no Redux/Zustand). Six contexts in `contexts/`:
- **ThemeContext** — Dark/light mode (persisted to localStorage, applied via `data-theme` attribute)
- **LanguageContext** — ES/EN translations
- **FABContext** — Floating Action Button visibility
- **ProjectAdvisorContext** — AI advisor modal state
- **CommandPaletteContext** — Command palette state
- **DeveloperSectionFontContext** — Font size preferences for dev section

### Styling

- **Primary**: Tailwind CSS 4 via `@tailwindcss/postcss`
- **Secondary**: CSS Modules (`.module.css`) for component-scoped styles
- **Global variables**: Defined in `styles/globals.css` (colors, spacing, shadows)
- **Dark mode**: Selector-based (`data-theme="dark"`)
- **Animations**: Framer Motion for component transitions

### Data Layer

Large static data files live in `lib/`:
- `translations.ts` — Main UI translation strings
- `courseTranslations.ts` — Course content translations
- `kotlinCourseData.ts`, `reactCourseData.ts` — Full course curricula (100KB+ each)
- `reactChallengesData.ts`, `challengesData.ts` — Coding challenge definitions
- `blogCategories.ts` — Blog post metadata
- `softSkillsInterviewData.ts` — Interview prep content
- `searchIndex.ts` — Global search index

### Key Integrations

- **Firebase** (`lib/firebaseClient.ts`) — Firestore for contact forms and collaborative editor persistence
- **Google Generative AI** (`@google/generative-ai`, `@google/genai`) — Powers chatbot and project advisor
- **Monaco Editor** (`@monaco-editor/react`) — Code editors in courses, playground, challenges
- **Yjs** + Firebase (`lib/firebaseYjsProvider.ts`) — Real-time collaborative editing

### Path Aliases (tsconfig)

```
@/*            → ./*
@/components/* → ./components/*
@/styles/*     → ./styles/*
@/contexts/*   → ./contexts/*
@/lib/*        → ./lib/*
```

## Deployment

Configured for Netlify (`netlify.toml`). Also deployable to Vercel.
