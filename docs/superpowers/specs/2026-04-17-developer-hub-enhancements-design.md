# Developer Hub Enhancements — Design Spec

**Date**: 2026-04-17
**Scope**: 15 features across 4 phases for the `/developer-section` hub

---

## Shared Infrastructure

### `lib/devHubStore.ts` — Unified localStorage Store

Pure functions (no React context) managing all user progress data under a single key.

```
localStorage key: "dev-hub-store"
{
  bookmarks: string[],
  recentVisits: string[],
  streak: { lastDate: string, count: number },
  completedLessons: string[],
  interviewSR: {
    [questionId: string]: {
      interval: number,
      easeFactor: number,
      nextReview: string,   // ISO date
      repetitions: number
    }
  },
  changelogDismissed: string,
  weeklyChallengeDismissed: number,
  username: string
}
```

**Migration**: On first load, reads old keys (`dev-hub-recent`, `dev-hub-streak`, `dev-hub-changelog-dismissed`), merges into new store, deletes old keys.

**API**: `getStore()`, `updateStore(partial)`, plus typed helpers: `toggleBookmark(id)`, `isBookmarked(id)`, `getBookmarks()`, `trackVisit(id)`, `getRecentVisits()`, `getStreak()`, `getUsername()`, `setUsername(name)`.

---

## Phase 1: Data Layer

### Feature 3: Bookmarks / "My List"

- Heart icon (outline → filled on toggle) positioned top-right of every hub card
- `toggleBookmark(cardId)` in devHubStore
- New "Your Saved Items" section on hub between "Recommended Next" and filter chips
- Only renders when bookmarks exist
- Empty state: hidden (no clutter)
- Framer Motion stagger animation matching existing card pattern

**Files**: `page.tsx` (hub), `lib/devHubStore.ts`, `DeveloperSection.module.css`, `lib/translations.ts` (+5 keys)

### Feature 5: Reading Time + Difficulty on Blog Cards

- Add `readingTime: number` and `difficulty: "beginner" | "intermediate" | "advanced"` to `BlogPost` interface
- Populate for all posts in `lib/blogCategories.ts`
- Blog listing renders `"8 min · Intermediate"` badge per card
- Difficulty color: beginner=#34D399, intermediate=#60A5FA, advanced=#A78BFA

**Files**: `lib/blogCategories.ts`, `blog/page.tsx`, `BlogPostPage.module.css`, `lib/translations.ts` (+4 keys)

### Feature 6: Weekly Featured Challenge

- Deterministic rotation: `weekIndex = Math.floor(Date.now() / 604800000) % challenges.length`
- Banner above "Continue Learning" with gradient accent, challenge title, difficulty, CTA
- Dismissable per week via `devHubStore.weeklyChallengeDismissed`
- Challenge pool: all entries from `challengesData.ts` + `reactChallengesData.ts`

**Files**: `page.tsx` (hub), `DeveloperSection.module.css`, `lib/devHubStore.ts`, `lib/translations.ts` (+4 keys)

---

## Phase 2: Intelligence

### Feature 4: Spaced Repetition for Interview Prep

**SM-2 Algorithm** (`lib/spacedRepetition.ts`):
- Input: current card state + quality rating (0-5)
- Output: updated { interval, easeFactor, nextReview, repetitions }
- Quality mapping: "Again"=0, "Hard"=2, "Good"=4, "Easy"=5
- Initial: interval=1, easeFactor=2.5

**Integration**:
- Rating buttons appear after viewing an answer on interview slug pages
- "Due for Review" section at top of interview listing pages (questions where nextReview <= today)
- Badge on hub interview cards: "N due" pill
- Questions with no SR data appear in "New Questions" pool

**Files**: `lib/spacedRepetition.ts` (new), `lib/devHubStore.ts`, `react-interview/page.tsx`, `react-interview/[slug]/page.tsx`, `soft-skills-interview/page.tsx`, `soft-skills-interview/[slug]/page.tsx`, `backend-interview/page.tsx`, `page.tsx` (hub), `lib/translations.ts` (+12 keys)

### Feature 7: Recommendation Engine

**`lib/recommendations.ts`** — rule-based, evaluated in order:
1. Visited course, no challenges in topic → recommend challenges
2. Completed challenges, no interview prep → recommend interview
3. Only blog visits → recommend related course
4. React visitor, no TypeScript → recommend TS course
5. Kotlin visitor, no Android/Spring → recommend Android or Spring
6. Fallback: least-visited category

**Output**: 1-2 ContentCard refs + reason string. Renders as highlighted card with lightbulb icon between "Continue Learning" and "Your Saved Items". Hidden if < 3 recent visits.

**Files**: `lib/recommendations.ts` (new), `page.tsx` (hub), `DeveloperSection.module.css`, `lib/translations.ts` (+8 keys)

### Feature 9: Shareable Progress Card

- "Share Your Stats" button in hub stats bar
- Canvas-rendered card (600x340px): username, streak, bookmarks count, top 3 topics, branding, date
- Modal flow: click → edit username → preview → download PNG / copy to clipboard
- Canvas API only, no external libs
- Username stored in devHubStore

**Files**: `components/ShareCard/ShareProgressCard.tsx` (new), `components/ShareCard/ShareProgressCard.module.css` (new), `page.tsx` (hub), `lib/devHubStore.ts`, `lib/translations.ts` (+8 keys)

---

## Phase 3: Polish & UX

### Feature 10: Skeleton Loaders

- `components/ui/Skeleton.tsx` — reusable shimmer component (width, height, borderRadius props)
- CSS: `@keyframes shimmer` gradient sweep, 1.5s infinite
- Applied to: `blog/loading.tsx` (6 card skeletons), `collaborative/page.tsx` (editor skeleton), playground Monaco loaders, course slug pages

**Files**: `components/ui/Skeleton.tsx` (new), `components/ui/Skeleton.module.css` (new), `blog/loading.tsx`, `collaborative/page.tsx`, `playground/page.tsx`, `kotlin-playground/page.tsx`

### Feature 11: Page Transition Animations

- Wrap `{children}` in `developer-section/layout.tsx` with `AnimatePresence` + `motion.div`
- Key on `usePathname()`
- Enter: opacity 0→1, y 8→0, 200ms ease-out
- Exit: opacity 1→0, 100ms

**Files**: `developer-section/layout.tsx` (~15 lines added)

### Feature 12: Command Palette Search Filters

- Filter chips below search input: "All", "Blog", "Courses", "Challenges", "Interview"
- Filters results by SearchItem.section
- Chips use sectionColors for accents
- Reset on palette close
- Tab key cycles chips

**Files**: `components/Search/CommandPalette.tsx`, CommandPalette CSS module, `lib/translations.ts` (+5 keys)

### Feature 13: Keyboard-First Hub Navigation

- Extend existing keyboard handler in hub
- `j`/`k`: move focus between visible cards (focusedCardIndex state)
- `Enter`: navigate to focused card
- `b`: toggle bookmark on focused card
- `Escape`: clear focus
- Visible focus ring: 2px solid accent with offset
- Only active when no input focused
- Update shortcuts overlay with new entries

**Files**: `page.tsx` (hub), `DeveloperSection.module.css`, `lib/translations.ts` (+4 keys)

### Feature 14: Dark/Light Monaco Theme Sync

- `CodeEditor.tsx`: read `useTheme()`, map dark→"vs-dark", light→"vs"
- `HighlightedCode.tsx`: swap Prism theme class
- Playground pages using raw MonacoEditor: pass dynamic `theme` prop

**Files**: `components/ui/CodeEditor.tsx`, `components/ui/HighlightedCode.tsx`, `playground/page.tsx`, `kotlin-playground/page.tsx`

### Feature 8: Playground Templates

- "Templates" dropdown next to "New File" in both playgrounds
- React/TS: "Hello World", "Todo App", "API Fetch", "State Machine", "Custom Hook"
- Kotlin: "Hello World", "Collections", "Coroutines", "Data Classes", "Sealed Classes"
- Confirmation dialog if editor modified
- Template data: static arrays in each playground file

**Files**: `playground/page.tsx`, `kotlin-playground/page.tsx`, `PlaygroundPage.module.css`, `lib/translations.ts` (+10 keys)

---

## Phase 4: Big Bets

### Feature 15: Offline PWA Mode

- `public/sw.js`: hand-written service worker (~80 lines)
- Install: pre-cache app shell
- Fetch: network-first for navigation/API, cache-first for static assets
- Blog pages cached on visit for offline reading
- `public/manifest.json`: "OptimusAgency Dev Hub", theme #0a0a0f, start_url `/es/developer-section`
- Offline banner component when `navigator.onLine === false`
- SW registered in `developer-section/layout.tsx` useEffect
- Scope: `/developer-section` subtree only

**Files**: `public/sw.js` (new), `public/manifest.json` (new), `developer-section/layout.tsx`, `components/OfflineBanner/OfflineBanner.tsx` (new), `components/OfflineBanner/OfflineBanner.module.css` (new), `lib/translations.ts` (+3 keys)

### Feature 16: AI Code Review in Playgrounds

- "Get AI Feedback" button in playground toolbars
- `app/api/code-review/route.ts`: sends code to Google Generative AI with review system prompt
- Response: max 5 bullet points on bugs, performance, best practices, readability
- Renders in new panel below output
- Client-side 10s cooldown between requests
- Shimmer skeleton while loading, error state with retry

**Files**: `app/api/code-review/route.ts` (new), `playground/page.tsx`, `kotlin-playground/page.tsx`, `PlaygroundPage.module.css`, `lib/translations.ts` (+8 keys)

### Feature 17: Multiplayer Challenges

- New page: `challenges/multiplayer/page.tsx`
- Lobby: enter name → create/join room via Firebase Firestore
- Firestore doc `multiplayer-rooms/{roomId}`: challenge slug, players map, state machine (waiting→countdown→playing→finished), timestamps
- Split screen: your editor (left) + opponent code read-only (right, live-synced)
- Win: first to pass all test cases via Piston `/api/execute-code`
- 10-minute timer max
- Challenge selection: random or host picks
- Reuses: `lib/firebaseClient.ts`, CodeEditor, challenge test runners

**Files**: `challenges/multiplayer/page.tsx` (new), `challenges/multiplayer/MultiplayerChallenge.module.css` (new), `lib/multiplayerRoom.ts` (new), `page.tsx` (hub card), `lib/translations.ts` (+15 keys)

---

## Hub Section Order (after all features)

1. Changelog banner (existing, dismissable)
2. Weekly featured challenge banner (#6)
3. Offline banner (when offline, #15)
4. Stats bar (existing) + "Share Stats" button (#9)
5. Continue Learning (existing)
6. Recommended Next (#7)
7. Your Saved Items (#3)
8. Filter chips + keyboard shortcuts (#13)
9. Content grid (with bookmark hearts + focus ring)
10. Learning paths (existing)

---

## Translation Keys Summary

~100 new keys across all features, added to both `es` and `en` sections of `lib/translations.ts`.

## New Files Summary

| File | Purpose |
|------|---------|
| `lib/devHubStore.ts` | Unified localStorage store |
| `lib/spacedRepetition.ts` | SM-2 algorithm |
| `lib/recommendations.ts` | Rule-based recommendation engine |
| `lib/multiplayerRoom.ts` | Firebase multiplayer room management |
| `components/ui/Skeleton.tsx` + `.module.css` | Skeleton loader component |
| `components/ShareCard/ShareProgressCard.tsx` + `.module.css` | Shareable stats card |
| `components/OfflineBanner/OfflineBanner.tsx` + `.module.css` | Offline indicator |
| `app/api/code-review/route.ts` | AI code review endpoint |
| `app/[locale]/developer-section/challenges/multiplayer/page.tsx` + `.module.css` | Multiplayer challenges |
| `public/sw.js` | Service worker |
| `public/manifest.json` | PWA manifest |
