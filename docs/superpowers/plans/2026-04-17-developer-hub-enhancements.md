# Developer Hub Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 15 features to the developer hub: bookmarks, spaced repetition, blog reading time, weekly challenge, recommendations, shareable stats, skeleton loaders, page transitions, search filters, keyboard nav, Monaco theme sync, playground templates, PWA offline, AI code review, and multiplayer challenges.

**Architecture:** All user state lives in localStorage via a shared `lib/devHubStore.ts` (pure functions, no context). Features are added incrementally across 4 phases — each phase builds on the previous. The hub page (`page.tsx`, 940 lines) gets new sections inserted between existing ones.

**Tech Stack:** Next.js 16, React 19, TypeScript, Framer Motion, Monaco Editor, Firebase Firestore, Google Generative AI, Canvas API, Service Worker.

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `lib/devHubStore.ts` | Unified localStorage read/write for all user progress |
| `lib/spacedRepetition.ts` | SM-2 algorithm for interview spaced repetition |
| `lib/recommendations.ts` | Rule-based "what to learn next" engine |
| `lib/multiplayerRoom.ts` | Firebase multiplayer room CRUD + listeners |
| `components/ui/Skeleton.tsx` | Reusable shimmer skeleton loader |
| `components/ui/Skeleton.module.css` | Skeleton animation styles |
| `components/ShareCard/ShareProgressCard.tsx` | Canvas-based shareable stats card + modal |
| `components/ShareCard/ShareProgressCard.module.css` | Share card modal styles |
| `components/OfflineBanner/OfflineBanner.tsx` | Offline indicator banner |
| `components/OfflineBanner/OfflineBanner.module.css` | Offline banner styles |
| `app/api/code-review/route.ts` | AI code review endpoint |
| `app/[locale]/developer-section/challenges/multiplayer/page.tsx` | Multiplayer challenges page |
| `app/[locale]/developer-section/challenges/multiplayer/MultiplayerChallenge.module.css` | Multiplayer styles |
| `public/sw.js` | Service worker for offline caching |
| `public/manifest.json` | PWA manifest |

### Modified Files
| File | Changes |
|------|---------|
| `app/[locale]/developer-section/page.tsx` | Bookmarks, weekly challenge, recommendations, keyboard nav, share button, multiplayer card |
| `app/[locale]/developer-section/DeveloperSection.module.css` | Styles for all new hub sections |
| `app/[locale]/developer-section/layout.tsx` | Page transitions (AnimatePresence), SW registration |
| `app/[locale]/developer-section/blog/page.tsx` | Reading time + difficulty display |
| `app/[locale]/developer-section/blog/loading.tsx` | Skeleton loaders |
| `app/[locale]/developer-section/collaborative/page.tsx` | Skeleton fallback |
| `app/[locale]/developer-section/playground/page.tsx` | Templates dropdown, AI review, Monaco theme |
| `app/[locale]/developer-section/kotlin-playground/page.tsx` | Templates dropdown, AI review, Monaco theme |
| `app/[locale]/developer-section/react-interview/page.tsx` | SR review queue |
| `app/[locale]/developer-section/react-interview/[slug]/page.tsx` | SR rating buttons |
| `app/[locale]/developer-section/soft-skills-interview/page.tsx` | SR review queue |
| `app/[locale]/developer-section/soft-skills-interview/[slug]/page.tsx` | SR rating buttons |
| `app/[locale]/developer-section/backend-interview/page.tsx` | SR review queue |
| `lib/blogCategories.ts` | Add readingTime + difficulty to BlogPost |
| `lib/translations.ts` | ~100 new keys (es + en) |
| `components/ui/CodeEditor.tsx` | Theme sync with ThemeContext |
| `components/ui/HighlightedCode.tsx` | Theme sync for Prism |
| `components/Search/CommandPalette.tsx` | Filter chips |

---

## PHASE 1: Data Layer

### Task 1: Create devHubStore

**Files:**
- Create: `lib/devHubStore.ts`

- [ ] **Step 1: Create the store with types and migration logic**

```typescript
// lib/devHubStore.ts

const STORE_KEY = "dev-hub-store";

// Legacy keys to migrate
const LEGACY_KEYS = {
  recent: "dev-hub-recent",
  streak: "dev-hub-streak",
  changelog: "dev-hub-changelog-dismissed",
} as const;

export interface SRCardData {
  interval: number;
  easeFactor: number;
  nextReview: string; // ISO date YYYY-MM-DD
  repetitions: number;
}

export interface DevHubStore {
  bookmarks: string[];
  recentVisits: string[];
  streak: { lastDate: string; count: number };
  completedLessons: string[];
  interviewSR: Record<string, SRCardData>;
  changelogDismissed: string;
  weeklyChallengeDismissed: number;
  username: string;
}

const DEFAULT_STORE: DevHubStore = {
  bookmarks: [],
  recentVisits: [],
  streak: { lastDate: "", count: 0 },
  completedLessons: [],
  interviewSR: {},
  changelogDismissed: "",
  weeklyChallengeDismissed: 0,
  username: "",
};

function migrateFromLegacy(): Partial<DevHubStore> {
  const partial: Partial<DevHubStore> = {};
  try {
    const recent = localStorage.getItem(LEGACY_KEYS.recent);
    if (recent) {
      partial.recentVisits = JSON.parse(recent);
      localStorage.removeItem(LEGACY_KEYS.recent);
    }
    const streak = localStorage.getItem(LEGACY_KEYS.streak);
    if (streak) {
      partial.streak = JSON.parse(streak);
      localStorage.removeItem(LEGACY_KEYS.streak);
    }
    const changelog = localStorage.getItem(LEGACY_KEYS.changelog);
    if (changelog) {
      partial.changelogDismissed = changelog;
      localStorage.removeItem(LEGACY_KEYS.changelog);
    }
  } catch { /* ignore */ }
  return partial;
}

export function getStore(): DevHubStore {
  if (typeof window === "undefined") return { ...DEFAULT_STORE };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      return { ...DEFAULT_STORE, ...JSON.parse(raw) };
    }
    // First load: migrate legacy data
    const migrated = migrateFromLegacy();
    const store = { ...DEFAULT_STORE, ...migrated };
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    return store;
  } catch {
    return { ...DEFAULT_STORE };
  }
}

export function updateStore(partial: Partial<DevHubStore>): DevHubStore {
  const current = getStore();
  const updated = { ...current, ...partial };
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  } catch { /* quota exceeded */ }
  return updated;
}

// --- Bookmark helpers ---

export function toggleBookmark(id: string): boolean {
  const store = getStore();
  const index = store.bookmarks.indexOf(id);
  if (index >= 0) {
    store.bookmarks.splice(index, 1);
    updateStore({ bookmarks: store.bookmarks });
    return false; // removed
  }
  store.bookmarks.unshift(id);
  updateStore({ bookmarks: store.bookmarks });
  return true; // added
}

export function isBookmarked(id: string): boolean {
  return getStore().bookmarks.includes(id);
}

export function getBookmarks(): string[] {
  return getStore().bookmarks;
}

// --- Recent visits ---

export function trackVisit(cardId: string): void {
  const store = getStore();
  const recent = store.recentVisits.filter((id) => id !== cardId);
  recent.unshift(cardId);
  updateStore({ recentVisits: recent.slice(0, 10) });
}

export function getRecentVisits(max = 3): string[] {
  return getStore().recentVisits.slice(0, max);
}

// --- Streak ---

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (store.streak.lastDate === today) return store.streak.count || 1;
  if (store.streak.lastDate === yesterday) {
    const newCount = (store.streak.count || 0) + 1;
    updateStore({ streak: { lastDate: today, count: newCount } });
    return newCount;
  }
  updateStore({ streak: { lastDate: today, count: 1 } });
  return 1;
}

// --- Username ---

export function getUsername(): string {
  return getStore().username;
}

export function setUsername(name: string): void {
  updateStore({ username: name });
}

// --- Weekly challenge ---

export function isWeeklyChallengeDismissed(weekNumber: number): boolean {
  return getStore().weeklyChallengeDismissed === weekNumber;
}

export function dismissWeeklyChallenge(weekNumber: number): void {
  updateStore({ weeklyChallengeDismissed: weekNumber });
}

// --- Changelog ---

export function isChangelogDismissed(version: string): boolean {
  return getStore().changelogDismissed === version;
}

export function dismissChangelog(version: string): void {
  updateStore({ changelogDismissed: version });
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/devHubStore.ts
git commit -m "feat: add unified devHubStore for all user progress data"
```

---

### Task 2: Migrate hub page to devHubStore

**Files:**
- Modify: `app/[locale]/developer-section/page.tsx`

- [ ] **Step 1: Replace old localStorage helpers with devHubStore imports**

Remove these lines (399-437 in current file):
```
const RECENTLY_VISITED_KEY = "dev-hub-recent";
const STREAK_KEY = "dev-hub-streak";
const CHANGELOG_DISMISSED_KEY = "dev-hub-changelog-dismissed";
const MAX_RECENT = 3;

function getRecentlyVisited() { ... }
function trackVisit() { ... }
function getStreak() { ... }
```

Replace with import at top of file:
```typescript
import {
  getRecentVisits,
  trackVisit,
  getStreak,
  isChangelogDismissed,
  dismissChangelog,
  getBookmarks,
  toggleBookmark,
  isBookmarked,
  isWeeklyChallengeDismissed,
  dismissWeeklyChallenge,
} from "@/lib/devHubStore";
```

Update the `useEffect` at line 451:
```typescript
useEffect(() => {
  setRecentIds(getRecentVisits(3));
  setStreak(getStreak());
  if (!isChangelogDismissed(CHANGELOG_VERSION)) {
    setShowChangelog(true);
  }
}, []);
```

Update `handleDismissChangelog`:
```typescript
const handleDismissChangelog = useCallback(() => {
  setShowChangelog(false);
  dismissChangelog(CHANGELOG_VERSION);
}, []);
```

Update `handleCardClick`:
```typescript
const handleCardClick = useCallback((cardId: string) => {
  trackVisit(cardId);
}, []);
```

Remove `const MAX_RECENT = 3;` (now handled inside getRecentVisits).

- [ ] **Step 2: Verify the page still works**

Run: `npm run dev` and check the hub page loads, continue learning shows, streak shows, changelog dismisses correctly.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/developer-section/page.tsx
git commit -m "refactor: migrate hub page to unified devHubStore"
```

---

### Task 3: Bookmarks on hub cards + "Your Saved Items" section

**Files:**
- Modify: `app/[locale]/developer-section/page.tsx`
- Modify: `app/[locale]/developer-section/DeveloperSection.module.css`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add bookmark state and handler to hub page**

Add import at top:
```typescript
import {
  FavoriteBorder as HeartOutline,
  Favorite as HeartFilled,
} from "@mui/icons-material";
```

Add state inside component:
```typescript
const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

// In the init useEffect:
useEffect(() => {
  setRecentIds(getRecentVisits(3));
  setStreak(getStreak());
  setBookmarkedIds(new Set(getBookmarks()));
  if (!isChangelogDismissed(CHANGELOG_VERSION)) {
    setShowChangelog(true);
  }
}, []);
```

Add handler:
```typescript
const handleToggleBookmark = useCallback((e: React.MouseEvent, cardId: string) => {
  e.preventDefault();
  e.stopPropagation();
  const added = toggleBookmark(cardId);
  setBookmarkedIds((prev) => {
    const next = new Set(prev);
    if (added) next.add(cardId);
    else next.delete(cardId);
    return next;
  });
}, []);
```

- [ ] **Step 2: Add heart icon to each card in the grid**

Inside the card rendering (the `<motion.a>` in the navGrid loop), add right after `<div className={styles.glowEffect} />`:

```tsx
<button
  className={`${styles.bookmarkBtn} ${bookmarkedIds.has(card.id) ? styles.bookmarkBtnActive : ""}`}
  onClick={(e) => handleToggleBookmark(e, card.id)}
  aria-label={bookmarkedIds.has(card.id) ? t("hub-bookmark-remove") : t("hub-bookmark-add")}
>
  {bookmarkedIds.has(card.id) ? (
    <HeartFilled className={styles.bookmarkIcon} />
  ) : (
    <HeartOutline className={styles.bookmarkIcon} />
  )}
</button>
```

- [ ] **Step 3: Add "Your Saved Items" section**

Insert after the Continue Learning `</AnimatePresence>` block and before the `{/* Topic Filter Chips */}` comment:

```tsx
{/* Your Saved Items */}
<AnimatePresence>
  {bookmarkedIds.size > 0 && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.savedSection}
    >
      <div className={styles.savedHeader}>
        <HeartFilled className={styles.savedIcon} />
        <h2 className={styles.savedTitle}>{t("hub-saved-title")}</h2>
        <span className={styles.savedCount}>{bookmarkedIds.size}</span>
      </div>
      <div className={styles.continueGrid}>
        {Array.from(bookmarkedIds)
          .map((id) => allCards.find((c) => c.id === id))
          .filter(Boolean)
          .map((card) => {
            const Icon = card!.icon;
            return (
              <motion.a
                key={card!.id}
                href={createLocalizedPath(card!.href)}
                className={styles.continueCard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(card!.id)}
              >
                <div className={styles.continueCardIcon}>
                  <Icon />
                </div>
                <div className={styles.continueCardInfo}>
                  <div className={styles.continueCardTitle}>{t(card!.titleKey)}</div>
                  <div className={styles.continueCardSub}>{t("hub-saved-label")}</div>
                </div>
                <button
                  className={`${styles.bookmarkBtn} ${styles.bookmarkBtnActive} ${styles.bookmarkBtnInline}`}
                  onClick={(e) => handleToggleBookmark(e, card!.id)}
                  aria-label={t("hub-bookmark-remove")}
                >
                  <HeartFilled className={styles.bookmarkIcon} />
                </button>
              </motion.a>
            );
          })}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

- [ ] **Step 4: Add CSS for bookmarks**

Append to `DeveloperSection.module.css`:

```css
/* Bookmark button on cards */
.bookmarkBtn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.blogCard:hover .bookmarkBtn,
.bookmarkBtnActive {
  opacity: 1;
}

.bookmarkBtnActive {
  background: rgba(244, 63, 94, 0.2);
  border-color: rgba(244, 63, 94, 0.4);
}

.bookmarkIcon {
  font-size: 16px !important;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s ease;
}

.bookmarkBtnActive .bookmarkIcon {
  color: #f43f5e;
}

.bookmarkBtn:hover {
  background: rgba(244, 63, 94, 0.25);
  border-color: rgba(244, 63, 94, 0.5);
  transform: scale(1.1);
}

.bookmarkBtnInline {
  position: static;
  opacity: 1;
  flex-shrink: 0;
}

/* Saved Items Section */
.savedSection {
  margin-bottom: 2rem;
}

.savedHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.savedIcon {
  font-size: 20px !important;
  color: #f43f5e;
}

.savedTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.savedCount {
  background: rgba(244, 63, 94, 0.2);
  color: #f43f5e;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}
```

- [ ] **Step 5: Add translation keys**

Add to ES section in `lib/translations.ts` (after existing `course-*` keys):
```typescript
'hub-saved-title': 'Tus Guardados',
'hub-saved-label': 'Guardado',
'hub-bookmark-add': 'Guardar',
'hub-bookmark-remove': 'Quitar de guardados',
```

Add to EN section:
```typescript
'hub-saved-title': 'Your Saved Items',
'hub-saved-label': 'Saved',
'hub-bookmark-add': 'Bookmark',
'hub-bookmark-remove': 'Remove bookmark',
```

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/developer-section/page.tsx app/[locale]/developer-section/DeveloperSection.module.css lib/translations.ts lib/devHubStore.ts
git commit -m "feat: add bookmarks with heart icon on hub cards and saved items section"
```

---

### Task 4: Reading time + difficulty on blog cards

**Files:**
- Modify: `lib/blogCategories.ts`
- Modify: `app/[locale]/developer-section/blog/page.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Extend BlogPost interface and add data**

In `lib/blogCategories.ts`, update the interface:
```typescript
export interface BlogPost {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
  topics: string[];
  readingTime?: number;       // minutes
  difficulty?: "beginner" | "intermediate" | "advanced";
}
```

Then add `readingTime` and `difficulty` to every post in the `blogCategories` array. Use these heuristics:
- Short blog posts (patterns, single-concept): 5-8 min, beginner
- Medium blog posts (guides, multi-section): 10-15 min, intermediate
- Long blog posts (deep-dives, full courses): 18-25 min, advanced

Go through every post in the array and add both fields. Example for the first few:
```typescript
{ id: "react-patterns", ..., readingTime: 12, difficulty: "intermediate" },
{ id: "react-best-practices", ..., readingTime: 15, difficulty: "intermediate" },
{ id: "accessibility", ..., readingTime: 10, difficulty: "beginner" },
```

- [ ] **Step 2: Display reading time and difficulty in blog listing**

In `blog/page.tsx`, find the card rendering loop and add metadata below the description. The exact insertion point depends on the card layout — add after the description text:

```tsx
<div className={styles.blogCardMeta}>
  {post.readingTime && (
    <span className={styles.readingTime}>
      {post.readingTime} {t("blog-min-read")}
    </span>
  )}
  {post.difficulty && (
    <span className={`${styles.difficultyTag} ${styles[`difficulty-${post.difficulty}`]}`}>
      {t(`hub-level-${post.difficulty}`)}
    </span>
  )}
</div>
```

Add CSS to `BlogPostPage.module.css`:
```css
.blogCardMeta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.75rem;
}

.readingTime {
  color: rgba(255, 255, 255, 0.5);
}

.difficultyTag {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.7rem;
}

.difficulty-beginner {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}

.difficulty-intermediate {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.difficulty-advanced {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
}
```

- [ ] **Step 3: Add translation keys**

ES:
```typescript
'blog-min-read': 'min de lectura',
```

EN:
```typescript
'blog-min-read': 'min read',
```

(Difficulty labels already exist as `hub-level-beginner`, `hub-level-intermediate`, `hub-level-advanced`.)

- [ ] **Step 4: Commit**

```bash
git add lib/blogCategories.ts app/[locale]/developer-section/blog/page.tsx lib/translations.ts
git commit -m "feat: add reading time and difficulty badges to blog cards"
```

---

### Task 5: Weekly featured challenge banner

**Files:**
- Modify: `app/[locale]/developer-section/page.tsx`
- Modify: `app/[locale]/developer-section/DeveloperSection.module.css`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add weekly challenge logic and state**

Add imports at top of hub page:
```typescript
import { CHALLENGES } from "@/lib/challengesData";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
```

Add helper function before the component:
```typescript
function getWeeklyChallenge() {
  const weekNumber = Math.floor(Date.now() / 604800000);
  const index = weekNumber % CHALLENGES.length;
  return { challenge: CHALLENGES[index], weekNumber };
}
```

Add state inside component:
```typescript
const [showWeeklyChallenge, setShowWeeklyChallenge] = useState(false);
const weekly = getWeeklyChallenge();
```

In the init `useEffect`, add:
```typescript
if (!isWeeklyChallengeDismissed(weekly.weekNumber)) {
  setShowWeeklyChallenge(true);
}
```

Add handler:
```typescript
const handleDismissWeekly = useCallback(() => {
  setShowWeeklyChallenge(false);
  dismissWeeklyChallenge(weekly.weekNumber);
}, [weekly.weekNumber]);
```

- [ ] **Step 2: Add banner JSX**

Insert after the Changelog banner `</AnimatePresence>` and before `{/* Topic Filter Chips */}`:

```tsx
{/* Weekly Featured Challenge */}
<AnimatePresence>
  {showWeeklyChallenge && (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      transition={{ duration: 0.35 }}
      className={styles.weeklyBanner}
    >
      <div className={styles.weeklyContent}>
        <div className={styles.weeklyLeft}>
          <TrophyIcon className={styles.weeklyIcon} />
          <div>
            <span className={styles.weeklyLabel}>{t("hub-weekly-label")}</span>
            <span className={styles.weeklyTitle}>{weekly.challenge.title}</span>
          </div>
        </div>
        <div className={styles.weeklyRight}>
          <span className={`${styles.weeklyDifficulty} ${styles[`weekly${weekly.challenge.difficulty}`]}`}>
            {weekly.challenge.difficulty}
          </span>
          <a
            href={createLocalizedPath(`/developer-section/challenges/${weekly.challenge.id}`)}
            className={styles.weeklyCta}
            onClick={() => handleCardClick("challenges")}
          >
            {t("hub-weekly-cta")}
            <ArrowRight className={styles.weeklyCtaArrow} />
          </a>
          <button className={styles.weeklyClose} onClick={handleDismissWeekly} aria-label="Dismiss">
            <CloseIcon className={styles.weeklyCloseIcon} />
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

- [ ] **Step 3: Add CSS**

Append to `DeveloperSection.module.css`:
```css
/* Weekly Challenge Banner */
.weeklyBanner {
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.weeklyContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 14px 20px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  flex-wrap: wrap;
}

.weeklyLeft {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weeklyIcon {
  font-size: 24px !important;
  color: #fbbf24;
}

.weeklyLabel {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fbbf24;
}

.weeklyTitle {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
}

.weeklyRight {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weeklyDifficulty {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
}

.weeklyEasy {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}

.weeklyMedium {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.weeklyCta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fbbf24;
  text-decoration: none;
  transition: opacity 0.2s;
}

.weeklyCta:hover {
  opacity: 0.8;
}

.weeklyCtaArrow {
  font-size: 16px !important;
}

.weeklyClose {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s;
}

.weeklyClose:hover {
  color: white;
}

.weeklyCloseIcon {
  font-size: 18px !important;
}
```

- [ ] **Step 4: Add translation keys**

ES:
```typescript
'hub-weekly-label': 'Reto de la Semana',
'hub-weekly-cta': 'Intentar reto',
```

EN:
```typescript
'hub-weekly-label': 'Challenge of the Week',
'hub-weekly-cta': 'Try challenge',
```

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/developer-section/page.tsx app/[locale]/developer-section/DeveloperSection.module.css lib/translations.ts
git commit -m "feat: add weekly featured challenge banner to developer hub"
```

---

## PHASE 2: Intelligence

### Task 6: Spaced repetition algorithm

**Files:**
- Create: `lib/spacedRepetition.ts`

- [ ] **Step 1: Implement SM-2 algorithm**

```typescript
// lib/spacedRepetition.ts
import type { SRCardData } from "./devHubStore";

export type SRQuality = 0 | 1 | 2 | 3 | 4 | 5;

export const SR_RATINGS = [
  { quality: 0 as SRQuality, labelKey: "sr-again" },
  { quality: 2 as SRQuality, labelKey: "sr-hard" },
  { quality: 4 as SRQuality, labelKey: "sr-good" },
  { quality: 5 as SRQuality, labelKey: "sr-easy" },
] as const;

export function newCard(): SRCardData {
  return {
    interval: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString().slice(0, 10),
    repetitions: 0,
  };
}

export function reviewCard(card: SRCardData, quality: SRQuality): SRCardData {
  let { interval, easeFactor, repetitions } = card;

  if (quality < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    nextReview: nextDate.toISOString().slice(0, 10),
    repetitions,
  };
}

export function isDue(card: SRCardData): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return card.nextReview <= today;
}

export function getDueCount(srData: Record<string, SRCardData>): number {
  return Object.values(srData).filter(isDue).length;
}

export function getDueIds(srData: Record<string, SRCardData>): string[] {
  return Object.entries(srData)
    .filter(([, card]) => isDue(card))
    .map(([id]) => id);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/spacedRepetition.ts
git commit -m "feat: add SM-2 spaced repetition algorithm"
```

---

### Task 7: Add SR rating buttons to interview slug pages + review queue on listing pages

**Files:**
- Modify: `app/[locale]/developer-section/soft-skills-interview/[slug]/page.tsx`
- Modify: `app/[locale]/developer-section/soft-skills-interview/page.tsx`
- Modify: `app/[locale]/developer-section/react-interview/[slug]/page.tsx`
- Modify: `app/[locale]/developer-section/react-interview/page.tsx`
- Modify: `app/[locale]/developer-section/backend-interview/page.tsx`
- Modify: `app/[locale]/developer-section/page.tsx` (hub — due badge)
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add SR rating buttons to soft-skills-interview/[slug]/page.tsx**

Read the current file. Find where the answer/response content ends. Add after it:

```tsx
// Import at top:
import { getStore, updateStore } from "@/lib/devHubStore";
import { SR_RATINGS, reviewCard, newCard } from "@/lib/spacedRepetition";
import type { SRQuality } from "@/lib/spacedRepetition";

// Inside the component, add state:
const [srRated, setSrRated] = useState(false);

// Add handler:
const handleSRRate = useCallback((quality: SRQuality) => {
  const store = getStore();
  const questionId = `soft-skills-${slug}`;
  const current = store.interviewSR[questionId] || newCard();
  const updated = reviewCard(current, quality);
  updateStore({
    interviewSR: { ...store.interviewSR, [questionId]: updated },
  });
  setSrRated(true);
}, [slug]);

// Add JSX after the answer content, before the prev/next navigation:
{!srRated ? (
  <div className={playStyles.srRatingSection}>
    <p className={playStyles.srRatingLabel}>{t("sr-how-well")}</p>
    <div className={playStyles.srRatingButtons}>
      {SR_RATINGS.map((r) => (
        <button
          key={r.quality}
          className={playStyles.srRatingBtn}
          onClick={() => handleSRRate(r.quality)}
        >
          {t(r.labelKey)}
        </button>
      ))}
    </div>
  </div>
) : (
  <div className={playStyles.srRatedMsg}>{t("sr-rated-thanks")}</div>
)}
```

- [ ] **Step 2: Apply the same SR pattern to react-interview/[slug]/page.tsx and backend-interview/page.tsx**

For `react-interview/[slug]/page.tsx`, use `questionId = \`react-interview-${slug}\``.
For `backend-interview/page.tsx`, since it's a single page with multiple sections, add ratings per section using `questionId = \`backend-${sectionId}\``.

The same imports, state, handler, and JSX pattern from Step 1 apply to each file.

- [ ] **Step 3: Add "Due for Review" section to soft-skills-interview/page.tsx**

```tsx
// Import at top:
import { getStore } from "@/lib/devHubStore";
import { getDueIds } from "@/lib/spacedRepetition";

// Inside component:
const store = getStore();
const dueIds = getDueIds(store.interviewSR)
  .filter((id) => id.startsWith("soft-skills-"))
  .map((id) => id.replace("soft-skills-", ""));

const dueQuestions = SOFT_SKILLS_QUESTIONS.filter((q) => dueIds.includes(q.id));

// Add JSX before the main question grid:
{dueQuestions.length > 0 && (
  <div className={styles.srDueSection}>
    <h3 className={styles.srDueTitle}>
      🔄 {t("sr-due-title")} ({dueQuestions.length})
    </h3>
    <div className={styles.srDueGrid}>
      {dueQuestions.map((q) => (
        <Link key={q.id} href={createLocalizedPath(`/developer-section/soft-skills-interview/${q.id}`)} className={styles.srDueCard}>
          <span>{language === "es" ? q.questionEs : q.question}</span>
        </Link>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 4: Apply same review queue to react-interview/page.tsx**

Same pattern, filtering by `react-interview-` prefix.

- [ ] **Step 5: Add "due" badge to hub interview cards**

In `page.tsx` (hub), inside the card rendering loop, add a badge when the card is an interview card:

```tsx
// Add to imports:
import { getDueCount } from "@/lib/spacedRepetition";

// In the component, add:
const srDueCount = getDueCount(getStore().interviewSR);

// In the card rendering, after the difficulty badge, add:
{card.category === "interview" && srDueCount > 0 && (
  <span className={styles.srDueBadge}>
    {srDueCount} {t("sr-due-short")}
  </span>
)}
```

- [ ] **Step 6: Add CSS for SR elements**

Add to `ChallengesPage.module.css` (shared by interview pages):
```css
.srRatingSection {
  margin-top: 24px;
  padding: 16px;
  background: rgba(167, 107, 249, 0.08);
  border: 1px solid rgba(167, 107, 249, 0.2);
  border-radius: 12px;
  text-align: center;
}

.srRatingLabel {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
}

.srRatingButtons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.srRatingBtn {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.srRatingBtn:hover {
  background: rgba(167, 107, 249, 0.2);
  border-color: rgba(167, 107, 249, 0.4);
}

.srRatedMsg {
  margin-top: 16px;
  text-align: center;
  color: #34d399;
  font-size: 0.85rem;
}

.srDueSection {
  margin-bottom: 2rem;
}

.srDueTitle {
  font-size: 1rem;
  font-weight: 600;
  color: #fbbf24;
  margin-bottom: 12px;
}

.srDueGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}

.srDueCard {
  padding: 12px 16px;
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  text-decoration: none;
  transition: background 0.2s;
}

.srDueCard:hover {
  background: rgba(251, 191, 36, 0.15);
}
```

Add to `DeveloperSection.module.css`:
```css
.srDueBadge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}
```

- [ ] **Step 7: Add translation keys**

ES:
```typescript
'sr-how-well': '¿Qué tan bien recordaste esto?',
'sr-again': 'De nuevo',
'sr-hard': 'Difícil',
'sr-good': 'Bien',
'sr-easy': 'Fácil',
'sr-rated-thanks': '¡Registrado! Volverá a aparecer según tu progreso.',
'sr-due-title': 'Repaso pendiente',
'sr-due-short': 'pendientes',
```

EN:
```typescript
'sr-how-well': 'How well did you remember this?',
'sr-again': 'Again',
'sr-hard': 'Hard',
'sr-good': 'Good',
'sr-easy': 'Easy',
'sr-rated-thanks': 'Recorded! This will resurface based on your progress.',
'sr-due-title': 'Due for Review',
'sr-due-short': 'due',
```

- [ ] **Step 8: Commit**

```bash
git add lib/spacedRepetition.ts lib/devHubStore.ts lib/translations.ts app/[locale]/developer-section/soft-skills-interview/ app/[locale]/developer-section/react-interview/ app/[locale]/developer-section/backend-interview/ app/[locale]/developer-section/page.tsx app/[locale]/developer-section/DeveloperSection.module.css app/[locale]/developer-section/challenges/ChallengesPage.module.css
git commit -m "feat: add spaced repetition with rating buttons and review queue for interview prep"
```

---

### Task 8: Recommendation engine

**Files:**
- Create: `lib/recommendations.ts`
- Modify: `app/[locale]/developer-section/page.tsx`
- Modify: `app/[locale]/developer-section/DeveloperSection.module.css`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Create recommendations engine**

```typescript
// lib/recommendations.ts
import { getStore } from "./devHubStore";

interface Recommendation {
  cardId: string;
  reasonKey: string;
}

// Map card IDs to topic categories
const TOPIC_MAP: Record<string, string> = {
  "react-course": "react",
  "react-challenges": "react",
  "react-interview": "react",
  "kotlin-course": "kotlin",
  "kotlin-java-interop": "kotlin",
  "android-kotlin": "kotlin",
  "spring-reactive": "kotlin",
  "reactor-flux": "kotlin",
  "typescript-course": "typescript",
  "css-course": "css",
  "challenges": "general",
  "soft-skills-interview": "interview",
  "backend-interview": "interview",
};

const COURSE_TO_CHALLENGE: Record<string, string> = {
  "react-course": "react-challenges",
  "kotlin-course": "challenges",
  "typescript-course": "challenges",
};

const CHALLENGE_TO_INTERVIEW: Record<string, string> = {
  "react-challenges": "react-interview",
  "challenges": "backend-interview",
};

export function getRecommendations(): Recommendation[] {
  const store = getStore();
  const recent = store.recentVisits;
  if (recent.length < 3) return [];

  const visited = new Set(recent);
  const results: Recommendation[] = [];

  // Rule 1: Visited a course but not its challenges
  for (const [course, challenge] of Object.entries(COURSE_TO_CHALLENGE)) {
    if (visited.has(course) && !visited.has(challenge)) {
      results.push({ cardId: challenge, reasonKey: "rec-try-challenges" });
      break;
    }
  }

  // Rule 2: Did challenges but not interview prep
  if (results.length === 0) {
    for (const [challenge, interview] of Object.entries(CHALLENGE_TO_INTERVIEW)) {
      if (visited.has(challenge) && !visited.has(interview)) {
        results.push({ cardId: interview, reasonKey: "rec-try-interview" });
        break;
      }
    }
  }

  // Rule 3: React visitor but no TypeScript
  if (results.length === 0 && visited.has("react-course") && !visited.has("typescript-course")) {
    results.push({ cardId: "typescript-course", reasonKey: "rec-try-typescript" });
  }

  // Rule 4: Kotlin visitor but no Android/Spring
  if (results.length === 0 && visited.has("kotlin-course")) {
    if (!visited.has("android-kotlin")) {
      results.push({ cardId: "android-kotlin", reasonKey: "rec-try-android" });
    } else if (!visited.has("spring-reactive")) {
      results.push({ cardId: "spring-reactive", reasonKey: "rec-try-spring" });
    }
  }

  // Rule 5: Only blog, suggest a course
  if (results.length === 0 && visited.has("blog") && !recent.some((id) => id.endsWith("-course"))) {
    results.push({ cardId: "react-course", reasonKey: "rec-try-course" });
  }

  return results.slice(0, 2);
}
```

- [ ] **Step 2: Add recommendation section to hub page**

Import at top of hub page:
```typescript
import { getRecommendations } from "@/lib/recommendations";
import { Lightbulb as LightbulbIcon } from "@mui/icons-material";
```

Add state:
```typescript
const [recommendations, setRecommendations] = useState<Array<{ cardId: string; reasonKey: string }>>([]);
```

In init useEffect:
```typescript
setRecommendations(getRecommendations());
```

Insert JSX after Continue Learning and before Saved Items:
```tsx
{/* Recommended Next */}
<AnimatePresence>
  {recommendations.length > 0 && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.recommendSection}
    >
      <div className={styles.recommendHeader}>
        <LightbulbIcon className={styles.recommendIcon} />
        <h2 className={styles.recommendTitle}>{t("hub-recommend-title")}</h2>
      </div>
      <div className={styles.continueGrid}>
        {recommendations.map((rec) => {
          const card = allCards.find((c) => c.id === rec.cardId);
          if (!card) return null;
          const Icon = card.icon;
          return (
            <motion.a
              key={card.id}
              href={createLocalizedPath(card.href)}
              className={styles.recommendCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(card.id)}
            >
              <div className={styles.continueCardIcon}>
                <Icon />
              </div>
              <div className={styles.continueCardInfo}>
                <div className={styles.continueCardTitle}>{t(card.titleKey)}</div>
                <div className={styles.recommendReason}>{t(rec.reasonKey)}</div>
              </div>
              <ArrowRight className={styles.continueCardArrow} />
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

- [ ] **Step 3: Add CSS**

```css
.recommendSection {
  margin-bottom: 2rem;
}

.recommendHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.recommendIcon {
  font-size: 20px !important;
  color: #fbbf24;
}

.recommendTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.recommendCard {
  composes: continueCard;
  border-color: rgba(251, 191, 36, 0.15);
  background: rgba(251, 191, 36, 0.04);
}

.recommendCard:hover {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.08);
}

.recommendReason {
  font-size: 0.75rem;
  color: #fbbf24;
  opacity: 0.8;
}
```

- [ ] **Step 4: Add translation keys**

ES:
```typescript
'hub-recommend-title': '¿Qué aprender ahora?',
'rec-try-challenges': 'Pon a prueba lo que aprendiste',
'rec-try-interview': 'Prepárate para entrevistas',
'rec-try-typescript': 'Complementa React con TypeScript',
'rec-try-android': 'Lleva Kotlin a Android',
'rec-try-spring': 'Explora Spring Reactive',
'rec-try-course': 'Empieza con un curso interactivo',
```

EN:
```typescript
'hub-recommend-title': 'What to Learn Next',
'rec-try-challenges': 'Test what you learned',
'rec-try-interview': 'Prepare for interviews',
'rec-try-typescript': 'Pair React with TypeScript',
'rec-try-android': 'Take Kotlin to Android',
'rec-try-spring': 'Explore Spring Reactive',
'rec-try-course': 'Start with an interactive course',
```

- [ ] **Step 5: Commit**

```bash
git add lib/recommendations.ts app/[locale]/developer-section/page.tsx app/[locale]/developer-section/DeveloperSection.module.css lib/translations.ts
git commit -m "feat: add rule-based recommendation engine to developer hub"
```

---

### Task 9: Shareable progress card

**Files:**
- Create: `components/ShareCard/ShareProgressCard.tsx`
- Create: `components/ShareCard/ShareProgressCard.module.css`
- Modify: `app/[locale]/developer-section/page.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Create ShareProgressCard component**

This is a modal component with canvas rendering. Due to its size (~150 lines), the implementing agent should:

1. Create `components/ShareCard/ShareProgressCard.tsx` with:
   - Props: `{ open: boolean; onClose: () => void; streak: number; bookmarkCount: number; recentTopics: string[] }`
   - Username input field (reads/writes via `getUsername()`/`setUsername()` from devHubStore)
   - Canvas ref that renders a 600x340 card with: dark gradient background, username, stats (streak, bookmarks, topics), "OptimusAgency Dev Hub" branding, current date
   - "Download PNG" button: `canvas.toBlob()` → download link
   - "Copy to Clipboard" button: `navigator.clipboard.write([new ClipboardItem({"image/png": blob})])`
   - Modal overlay with Framer Motion fade in/out

2. Create `components/ShareCard/ShareProgressCard.module.css` with modal overlay, card preview, input, and button styles.

- [ ] **Step 2: Add share button to hub stats bar**

In `page.tsx`, add import:
```typescript
import { Share as ShareIcon } from "@mui/icons-material";
import dynamic from "next/dynamic";

const ShareProgressCard = dynamic(() => import("@/components/ShareCard/ShareProgressCard"), { ssr: false });
```

Add state:
```typescript
const [showShareCard, setShowShareCard] = useState(false);
```

Add button after the stats bar's last `<div className={styles.statItem}>`:
```tsx
<button className={styles.shareStatsBtn} onClick={() => setShowShareCard(true)}>
  <ShareIcon className={styles.shareStatsIcon} />
  <span>{t("hub-share-stats")}</span>
</button>
```

Add modal at end of component (before `</main>`):
```tsx
<ShareProgressCard
  open={showShareCard}
  onClose={() => setShowShareCard(false)}
  streak={streak}
  bookmarkCount={bookmarkedIds.size}
  recentTopics={recentIds.slice(0, 3)}
/>
```

- [ ] **Step 3: Add translations**

ES:
```typescript
'hub-share-stats': 'Compartir',
'share-card-title': 'Comparte tu progreso',
'share-card-username': 'Tu nombre',
'share-card-download': 'Descargar PNG',
'share-card-copy': 'Copiar al portapapeles',
'share-card-copied': '¡Copiado!',
'share-card-branding': 'OptimusAgency Dev Hub',
```

EN:
```typescript
'hub-share-stats': 'Share',
'share-card-title': 'Share Your Progress',
'share-card-username': 'Your name',
'share-card-download': 'Download PNG',
'share-card-copy': 'Copy to clipboard',
'share-card-copied': 'Copied!',
'share-card-branding': 'OptimusAgency Dev Hub',
```

- [ ] **Step 4: Commit**

```bash
git add components/ShareCard/ app/[locale]/developer-section/page.tsx lib/translations.ts
git commit -m "feat: add shareable progress card with canvas rendering"
```

---

## PHASE 3: Polish & UX

### Task 10: Skeleton loaders

**Files:**
- Create: `components/ui/Skeleton.tsx`
- Create: `components/ui/Skeleton.module.css`
- Modify: `app/[locale]/developer-section/blog/loading.tsx`
- Modify: `app/[locale]/developer-section/collaborative/page.tsx`
- Modify: `app/[locale]/developer-section/playground/page.tsx`
- Modify: `app/[locale]/developer-section/kotlin-playground/page.tsx`

- [ ] **Step 1: Create Skeleton component**

```typescript
// components/ui/Skeleton.tsx
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({ width = "100%", height = 20, borderRadius = 6, className }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className || ""}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`${styles.skeletonCard} ${className || ""}`}>
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="75%" />
      <Skeleton height={32} width="40%" borderRadius={8} />
    </div>
  );
}
```

```css
/* components/ui/Skeleton.module.css */
.skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeletonCard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}
```

- [ ] **Step 2: Update blog/loading.tsx**

```typescript
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <div style={{ padding: "120px 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update Monaco loading spinners in playgrounds**

In `playground/page.tsx` and `kotlin-playground/page.tsx`, find the `dynamic()` loading callback and replace:

```typescript
import { Skeleton } from "@/components/ui/Skeleton";

// In the dynamic import loading:
loading: () => (
  <div className={styles.editorLoading}>
    <Skeleton height={300} borderRadius={8} />
  </div>
),
```

- [ ] **Step 4: Update collaborative page loading**

In `collaborative/page.tsx`, replace the fallback:
```tsx
<Suspense fallback={
  <main className={styles.page}>
    <div className={styles.loading}>
      <Skeleton width={200} height={24} />
      <Skeleton width={300} height={16} />
    </div>
  </main>
}>
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/Skeleton.tsx components/ui/Skeleton.module.css app/[locale]/developer-section/blog/loading.tsx app/[locale]/developer-section/collaborative/page.tsx app/[locale]/developer-section/playground/page.tsx app/[locale]/developer-section/kotlin-playground/page.tsx
git commit -m "feat: add skeleton loaders for blog, playgrounds, and collaborative editor"
```

---

### Task 11: Page transition animations

**Files:**
- Modify: `app/[locale]/developer-section/layout.tsx`

- [ ] **Step 1: Add AnimatePresence wrapper**

```typescript
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DeveloperSectionFontProvider } from "@/contexts/DeveloperSectionFontContext";
import { CommandPaletteProvider } from "@/contexts/CommandPaletteContext";
import CommandPalette from "@/components/Search/CommandPalette";

type DeveloperSectionLayoutProps = {
  children: ReactNode;
};

export default function DeveloperSectionLayout({ children }: DeveloperSectionLayoutProps) {
  const pathname = usePathname();

  return (
    <CommandPaletteProvider>
      <DeveloperSectionFontProvider>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <CommandPalette />
      </DeveloperSectionFontProvider>
    </CommandPaletteProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/developer-section/layout.tsx
git commit -m "feat: add page transition animations to developer section"
```

---

### Task 12: Command palette search filters

**Files:**
- Modify: `components/Search/CommandPalette.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add filter state and chips**

Read the current `CommandPalette.tsx`. Add after the search input element:

```tsx
// New state:
const [searchFilter, setSearchFilter] = useState<string>("all");

// Filter chips data:
const paletteFilters = [
  { id: "all", labelKey: "palette-filter-all" },
  { id: "blog", labelKey: "palette-filter-blog" },
  { id: "react-course", labelKey: "palette-filter-courses" },
  { id: "challenges", labelKey: "palette-filter-challenges" },
  { id: "interview", labelKey: "palette-filter-interview" },
];

// Filter the results:
const filteredResults = useMemo(() => {
  if (searchFilter === "all") return results;
  return results.filter((item) => item.sectionKey.includes(searchFilter));
}, [results, searchFilter]);

// Reset filter on close:
// In the close/cleanup handler, add: setSearchFilter("all");

// JSX — add below the search input:
<div className={styles.paletteFilters}>
  {paletteFilters.map((f) => (
    <button
      key={f.id}
      className={`${styles.paletteFilterChip} ${searchFilter === f.id ? styles.paletteFilterActive : ""}`}
      onClick={() => setSearchFilter(f.id)}
    >
      {t(f.labelKey)}
    </button>
  ))}
</div>
```

Then replace all references to `results` in the rendering with `filteredResults`.

- [ ] **Step 2: Add CSS**

In the CommandPalette CSS module:
```css
.paletteFilters {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
}

.paletteFilterChip {
  padding: 4px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.paletteFilterChip:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.paletteFilterActive {
  background: rgba(160, 106, 249, 0.2);
  border-color: rgba(160, 106, 249, 0.4);
  color: white;
}
```

- [ ] **Step 3: Add translations**

ES:
```typescript
'palette-filter-all': 'Todos',
'palette-filter-blog': 'Blog',
'palette-filter-courses': 'Cursos',
'palette-filter-challenges': 'Retos',
'palette-filter-interview': 'Entrevistas',
```

EN:
```typescript
'palette-filter-all': 'All',
'palette-filter-blog': 'Blog',
'palette-filter-courses': 'Courses',
'palette-filter-challenges': 'Challenges',
'palette-filter-interview': 'Interview',
```

- [ ] **Step 4: Commit**

```bash
git add components/Search/CommandPalette.tsx lib/translations.ts
git commit -m "feat: add content filter chips to command palette"
```

---

### Task 13: Keyboard-first hub navigation

**Files:**
- Modify: `app/[locale]/developer-section/page.tsx`
- Modify: `app/[locale]/developer-section/DeveloperSection.module.css`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add focus state and keyboard handlers**

Add state:
```typescript
const [focusedCardIndex, setFocusedCardIndex] = useState(-1);
```

Compute visible card IDs:
```typescript
const visibleCards = filteredGroups.flatMap((g) => g.cards);
```

Extend the existing keyboard handler (the `useEffect` with `handleKeyDown`):
```typescript
// Add inside handleKeyDown, after the existing shortcuts:
if (e.key === "j" || e.key === "J") {
  setFocusedCardIndex((prev) => Math.min(prev + 1, visibleCards.length - 1));
}
if (e.key === "k" || e.key === "K") {
  setFocusedCardIndex((prev) => Math.max(prev - 1, 0));
}
if (e.key === "Enter" && focusedCardIndex >= 0 && focusedCardIndex < visibleCards.length) {
  const card = visibleCards[focusedCardIndex];
  handleCardClick(card.id);
  window.location.href = createLocalizedPath(card.href);
}
if (e.key === "b" || e.key === "B") {
  if (focusedCardIndex >= 0 && focusedCardIndex < visibleCards.length) {
    const card = visibleCards[focusedCardIndex];
    const added = toggleBookmark(card.id);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (added) next.add(card.id);
      else next.delete(card.id);
      return next;
    });
  }
}
```

Note: Add `focusedCardIndex`, `visibleCards`, `createLocalizedPath` to the useEffect dependency array.

Reset focus when filter changes:
```typescript
// When activeFilter changes, reset focus:
useEffect(() => {
  setFocusedCardIndex(-1);
}, [activeFilter]);
```

- [ ] **Step 2: Add focus ring class to cards**

In the card rendering, add to the `<motion.a>` className:
```tsx
className={`${styles.blogCard} ${visibleCards.indexOf(card) === focusedCardIndex ? styles.cardFocused : ""}`}
```

- [ ] **Step 3: Add focus ring CSS**

```css
.cardFocused {
  outline: 2px solid rgba(160, 106, 249, 0.6);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(160, 106, 249, 0.1);
}
```

- [ ] **Step 4: Update shortcuts overlay**

Extend `shortcutsList`:
```typescript
const shortcutsList = [
  { keys: "?", descKey: "hub-shortcut-toggle" },
  { keys: "1–6", descKey: "hub-shortcut-filters" },
  { keys: "j / k", descKey: "hub-shortcut-navigate" },
  { keys: "Enter", descKey: "hub-shortcut-open" },
  { keys: "b", descKey: "hub-shortcut-bookmark" },
  { keys: "Esc", descKey: "hub-shortcut-close" },
  { keys: "Home", descKey: "hub-shortcut-top" },
];
```

- [ ] **Step 5: Add translations**

ES:
```typescript
'hub-shortcut-navigate': 'Navegar entre tarjetas',
'hub-shortcut-open': 'Abrir tarjeta seleccionada',
'hub-shortcut-bookmark': 'Guardar/quitar de guardados',
```

EN:
```typescript
'hub-shortcut-navigate': 'Navigate between cards',
'hub-shortcut-open': 'Open selected card',
'hub-shortcut-bookmark': 'Toggle bookmark',
```

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/developer-section/page.tsx app/[locale]/developer-section/DeveloperSection.module.css lib/translations.ts
git commit -m "feat: add j/k/Enter/b keyboard navigation to developer hub"
```

---

### Task 14: Dark/light Monaco theme sync

**Files:**
- Modify: `components/ui/CodeEditor.tsx`
- Modify: `app/[locale]/developer-section/playground/page.tsx`
- Modify: `app/[locale]/developer-section/kotlin-playground/page.tsx`

- [ ] **Step 1: Add theme awareness to CodeEditor**

In `components/ui/CodeEditor.tsx`, import the theme context:
```typescript
import { useTheme } from "@/contexts/ThemeContext";
```

Inside the component, get the theme:
```typescript
const { theme: appTheme } = useTheme();
const monacoTheme = appTheme === "light" ? "vs" : "vs-dark-bright-keywords";
```

Replace the hardcoded `theme="vs-dark-bright-keywords"` on the Monaco editor with `theme={monacoTheme}`.

Also update `monaco.editor.setTheme()` in the `onMount` handler to use `monacoTheme`.

- [ ] **Step 2: Update playground pages**

In `playground/page.tsx` and `kotlin-playground/page.tsx`, find `theme="vs-dark"` on the MonacoEditor component. Replace with:

```typescript
import { useTheme } from "@/contexts/ThemeContext";

// Inside component:
const { theme: appTheme } = useTheme();

// On MonacoEditor:
theme={appTheme === "light" ? "vs" : "vs-dark"}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/CodeEditor.tsx app/[locale]/developer-section/playground/page.tsx app/[locale]/developer-section/kotlin-playground/page.tsx
git commit -m "feat: sync Monaco editor theme with app dark/light mode"
```

---

### Task 15: Playground templates

**Files:**
- Modify: `app/[locale]/developer-section/playground/page.tsx`
- Modify: `app/[locale]/developer-section/kotlin-playground/page.tsx`
- Modify: `app/[locale]/developer-section/playground/PlaygroundPage.module.css`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add template data and UI to TypeScript playground**

In `playground/page.tsx`, add template definitions before the component:
```typescript
const TEMPLATES = [
  {
    nameKey: "tpl-hello-world",
    files: [{ name: "index.ts", code: `console.log("Hello, World!");\nconsole.log("TypeScript is great!");` }],
  },
  {
    nameKey: "tpl-todo-app",
    files: [
      { name: "index.ts", code: `import { TodoList } from "./todo";\n\nconst list = new TodoList();\nlist.add("Learn TypeScript");\nlist.add("Build something cool");\nlist.toggle(0);\nlist.print();` },
      { name: "todo.ts", code: `interface Todo {\n  text: string;\n  done: boolean;\n}\n\nexport class TodoList {\n  private items: Todo[] = [];\n\n  add(text: string) {\n    this.items.push({ text, done: false });\n  }\n\n  toggle(index: number) {\n    if (this.items[index]) this.items[index].done = !this.items[index].done;\n  }\n\n  print() {\n    this.items.forEach((t, i) => {\n      console.log(\`\${t.done ? "✅" : "⬜"} \${i}: \${t.text}\`);\n    });\n  }\n}` },
    ],
  },
  {
    nameKey: "tpl-api-fetch",
    files: [{ name: "index.ts", code: `async function fetchUser(id: number) {\n  const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);\n  const user = await res.json();\n  console.log(\`Name: \${user.name}\`);\n  console.log(\`Email: \${user.email}\`);\n  console.log(\`City: \${user.address.city}\`);\n}\n\nfetchUser(1);` }],
  },
  {
    nameKey: "tpl-state-machine",
    files: [{ name: "index.ts", code: `type State = "idle" | "loading" | "success" | "error";\ntype Event = "FETCH" | "RESOLVE" | "REJECT" | "RESET";\n\nconst transitions: Record<State, Partial<Record<Event, State>>> = {\n  idle: { FETCH: "loading" },\n  loading: { RESOLVE: "success", REJECT: "error" },\n  success: { RESET: "idle" },\n  error: { RESET: "idle", FETCH: "loading" },\n};\n\nfunction transition(state: State, event: Event): State {\n  return transitions[state][event] ?? state;\n}\n\nlet current: State = "idle";\nconst events: Event[] = ["FETCH", "RESOLVE", "RESET", "FETCH", "REJECT", "RESET"];\n\nfor (const event of events) {\n  const next = transition(current, event);\n  console.log(\`\${current} --[\${event}]--> \${next}\`);\n  current = next;\n}` }],
  },
  {
    nameKey: "tpl-custom-hook",
    files: [{ name: "index.ts", code: `// Custom hook pattern (plain TS demo)\nfunction useCounter(initial = 0) {\n  let count = initial;\n  return {\n    get: () => count,\n    increment: () => ++count,\n    decrement: () => --count,\n    reset: () => { count = initial; return count; },\n  };\n}\n\nconst counter = useCounter(10);\nconsole.log("Start:", counter.get());\ncounter.increment();\ncounter.increment();\nconsole.log("After 2 increments:", counter.get());\ncounter.decrement();\nconsole.log("After decrement:", counter.get());\nconsole.log("After reset:", counter.reset());` }],
  },
];
```

Add state and UI inside the component:
```typescript
const [showTemplates, setShowTemplates] = useState(false);
const [hasEdited, setHasEdited] = useState(false);
```

Track edits in the onChange handler — set `hasEdited = true` when code changes.

Add template button next to "New File":
```tsx
<div className={styles.templateDropdown}>
  <button className={styles.templateBtn} onClick={() => setShowTemplates(!showTemplates)}>
    {t("tpl-label")} ▾
  </button>
  {showTemplates && (
    <div className={styles.templateMenu}>
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.nameKey}
          className={styles.templateMenuItem}
          onClick={() => {
            if (hasEdited && !confirm(t("tpl-confirm-replace"))) return;
            // Reset files to template
            setFiles(tpl.files.map((f) => ({ ...f, uri: `file:///src/${f.name}` })));
            setActiveFile(tpl.files[0].name);
            setHasEdited(false);
            setShowTemplates(false);
            // Reset Monaco models
            const monaco = monacoRef.current;
            if (monaco) {
              tpl.files.forEach((file) => {
                const uri = monaco.Uri.parse(`file:///src/${file.name}`);
                const m = monaco.editor.getModel(uri);
                if (m) m.setValue(file.code);
                else monaco.editor.createModel(file.code, "typescript", uri);
              });
            }
          }}
        >
          {t(tpl.nameKey)}
        </button>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 2: Add same pattern to Kotlin playground with Kotlin templates**

Kotlin templates: "Hello World", "Collections", "Coroutines", "Data Classes", "Sealed Classes" — each with appropriate Kotlin starter code.

- [ ] **Step 3: Add CSS**

```css
.templateDropdown {
  position: relative;
}

.templateBtn {
  composes: newFileButton;
  background: rgba(160, 106, 249, 0.1);
  border-color: rgba(160, 106, 249, 0.3);
}

.templateMenu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  margin-top: 4px;
  min-width: 180px;
  background: #1e1e2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.templateMenuItem {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.templateMenuItem:hover {
  background: rgba(160, 106, 249, 0.15);
  color: white;
}
```

- [ ] **Step 4: Add translations**

ES:
```typescript
'tpl-label': 'Plantillas',
'tpl-confirm-replace': '¿Reemplazar el código actual con esta plantilla?',
'tpl-hello-world': 'Hello World',
'tpl-todo-app': 'App de Tareas',
'tpl-api-fetch': 'API Fetch',
'tpl-state-machine': 'Máquina de Estados',
'tpl-custom-hook': 'Custom Hook',
'tpl-kt-hello': 'Hello World',
'tpl-kt-collections': 'Colecciones',
'tpl-kt-coroutines': 'Coroutines',
'tpl-kt-data-classes': 'Data Classes',
'tpl-kt-sealed': 'Sealed Classes',
```

EN:
```typescript
'tpl-label': 'Templates',
'tpl-confirm-replace': 'Replace current code with this template?',
'tpl-hello-world': 'Hello World',
'tpl-todo-app': 'Todo App',
'tpl-api-fetch': 'API Fetch',
'tpl-state-machine': 'State Machine',
'tpl-custom-hook': 'Custom Hook',
'tpl-kt-hello': 'Hello World',
'tpl-kt-collections': 'Collections',
'tpl-kt-coroutines': 'Coroutines',
'tpl-kt-data-classes': 'Data Classes',
'tpl-kt-sealed': 'Sealed Classes',
```

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/developer-section/playground/page.tsx app/[locale]/developer-section/kotlin-playground/page.tsx app/[locale]/developer-section/playground/PlaygroundPage.module.css lib/translations.ts
git commit -m "feat: add code templates dropdown to playgrounds"
```

---

## PHASE 4: Big Bets

### Task 16: PWA offline mode

**Files:**
- Create: `public/sw.js`
- Create: `public/manifest.json`
- Create: `components/OfflineBanner/OfflineBanner.tsx`
- Create: `components/OfflineBanner/OfflineBanner.module.css`
- Modify: `app/[locale]/developer-section/layout.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Create service worker**

```javascript
// public/sw.js
const CACHE_NAME = "dev-hub-v1";
const APP_SHELL = ["/es/developer-section", "/en/developer-section"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and API routes
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;

  // Static assets: cache-first
  if (url.pathname.match(/\.(js|css|png|jpg|svg|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
      )
    );
    return;
  }

  // Pages: network-first, cache fallback
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
});
```

- [ ] **Step 2: Create PWA manifest**

```json
{
  "name": "OptimusAgency Dev Hub",
  "short_name": "Dev Hub",
  "description": "Resources, guides and challenges for developers",
  "start_url": "/es/developer-section",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#0a0a0f",
  "icons": [
    { "src": "/favicon.ico", "sizes": "48x48", "type": "image/x-icon" }
  ]
}
```

- [ ] **Step 3: Create OfflineBanner**

```typescript
// components/OfflineBanner/OfflineBanner.tsx
"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./OfflineBanner.module.css";

export default function OfflineBanner() {
  const { t } = useLanguage();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    setOffline(!navigator.onLine);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className={styles.banner}>
      <span>📡 {t("offline-banner")}</span>
    </div>
  );
}
```

```css
/* components/OfflineBanner/OfflineBanner.module.css */
.banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10100;
  padding: 6px 16px;
  background: rgba(251, 146, 60, 0.9);
  color: white;
  font-size: 0.8rem;
  text-align: center;
  font-weight: 500;
}
```

- [ ] **Step 4: Register SW and add OfflineBanner in layout**

Update `developer-section/layout.tsx` — add inside the component:
```typescript
import OfflineBanner from "@/components/OfflineBanner/OfflineBanner";

// Add useEffect for SW registration:
useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}, []);

// Add <OfflineBanner /> before the AnimatePresence
```

- [ ] **Step 5: Add translations**

ES: `'offline-banner': 'Estás sin conexión — el contenido en caché está disponible'`
EN: `'offline-banner': "You're offline — cached content is available"`

- [ ] **Step 6: Commit**

```bash
git add public/sw.js public/manifest.json components/OfflineBanner/ app/[locale]/developer-section/layout.tsx lib/translations.ts
git commit -m "feat: add PWA offline mode with service worker and offline banner"
```

---

### Task 17: AI code review in playgrounds

**Files:**
- Create: `app/api/code-review/route.ts`
- Modify: `app/[locale]/developer-section/playground/page.tsx`
- Modify: `app/[locale]/developer-section/kotlin-playground/page.tsx`
- Modify: `app/[locale]/developer-section/playground/PlaygroundPage.module.css`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Create AI code review API route**

```typescript
// app/api/code-review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

const SYSTEM_PROMPT = `You are a code reviewer. Review the provided code. Be concise (max 5 bullet points). Focus on: bugs, performance, best practices, readability. If the code is good, say so briefly. Respond in the same language the user writes their comments in — if comments are in Spanish, respond in Spanish; if in English, respond in English.`;

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || typeof code !== "string" || code.length > 10000) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Language: ${language || "typescript"}\n\nCode:\n\`\`\`\n${code}\n\`\`\`` },
    ]);

    const text = result.response.text();
    return NextResponse.json({ review: text });
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json({ error: "AI review failed" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Add AI review button and panel to TypeScript playground**

In `playground/page.tsx`, add state:
```typescript
const [aiReview, setAiReview] = useState<string | null>(null);
const [aiLoading, setAiLoading] = useState(false);
const [aiCooldown, setAiCooldown] = useState(false);
```

Add handler:
```typescript
const requestAiReview = useCallback(async () => {
  if (aiCooldown || aiLoading) return;
  setAiLoading(true);
  setAiReview(null);
  try {
    const code = files.map((f) => `// ${f.name}\n${f.code}`).join("\n\n");
    const res = await fetch("/api/code-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language: "typescript" }),
    });
    const data = await res.json();
    setAiReview(data.review || data.error || t("ai-review-error"));
  } catch {
    setAiReview(t("ai-review-error"));
  } finally {
    setAiLoading(false);
    setAiCooldown(true);
    setTimeout(() => setAiCooldown(false), 10000);
  }
}, [files, aiCooldown, aiLoading, t]);
```

Add button in toolbar:
```tsx
<button
  className={`${styles.iconButton} ${aiCooldown ? styles.iconButtonDisabled : ""}`}
  onClick={requestAiReview}
  disabled={aiCooldown || aiLoading}
  aria-label={t("ai-review-btn")}
>
  <SparklesIcon fontSize="small" />
  <span>{aiLoading ? "…" : t("ai-review-btn")}</span>
</button>
```

Add panel after the output grid:
```tsx
{aiReview && (
  <div className={styles.aiPanel}>
    <div className={styles.aiPanelHeader}>
      <SparklesIcon fontSize="small" />
      <span>{t("ai-review-title")}</span>
      <button className={styles.aiPanelClose} onClick={() => setAiReview(null)}>×</button>
    </div>
    <div className={styles.aiPanelBody}>{aiReview}</div>
  </div>
)}
```

- [ ] **Step 3: Apply same pattern to Kotlin playground**

Same state, handler (with `language: "kotlin"`), button, and panel.

- [ ] **Step 4: Add CSS**

```css
.aiPanel {
  margin-top: 12px;
  background: rgba(160, 106, 249, 0.06);
  border: 1px solid rgba(160, 106, 249, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.aiPanelHeader {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(160, 106, 249, 0.1);
  font-size: 0.85rem;
  font-weight: 600;
  color: #c4a6ff;
}

.aiPanelClose {
  margin-left: auto;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  cursor: pointer;
}

.aiPanelBody {
  padding: 14px;
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  white-space: pre-wrap;
}

.iconButtonDisabled {
  opacity: 0.4;
  pointer-events: none;
}
```

- [ ] **Step 5: Add translations**

ES:
```typescript
'ai-review-btn': 'IA Feedback',
'ai-review-title': 'Revisión de IA',
'ai-review-error': 'No se pudo obtener feedback. Inténtalo de nuevo.',
```

EN:
```typescript
'ai-review-btn': 'AI Feedback',
'ai-review-title': 'AI Review',
'ai-review-error': 'Could not get feedback. Try again.',
```

- [ ] **Step 6: Commit**

```bash
git add app/api/code-review/route.ts app/[locale]/developer-section/playground/page.tsx app/[locale]/developer-section/kotlin-playground/page.tsx app/[locale]/developer-section/playground/PlaygroundPage.module.css lib/translations.ts
git commit -m "feat: add AI-powered code review to playgrounds via Google Generative AI"
```

---

### Task 18: Multiplayer challenges

**Files:**
- Create: `lib/multiplayerRoom.ts`
- Create: `app/[locale]/developer-section/challenges/multiplayer/page.tsx`
- Create: `app/[locale]/developer-section/challenges/multiplayer/MultiplayerChallenge.module.css`
- Modify: `app/[locale]/developer-section/page.tsx` (add hub card)
- Modify: `lib/translations.ts`

- [ ] **Step 1: Create multiplayerRoom.ts**

```typescript
// lib/multiplayerRoom.ts
import { doc, setDoc, onSnapshot, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseClient";

export interface PlayerData {
  name: string;
  code: string;
  status: "waiting" | "coding" | "submitted";
  submittedAt?: number;
  passed?: boolean;
}

export interface RoomData {
  challengeId: string;
  players: Record<string, PlayerData>;
  state: "waiting" | "countdown" | "playing" | "finished";
  startedAt?: number;
  createdAt?: unknown;
}

const COLLECTION = "multiplayer-rooms";

export function generateRoomId(): string {
  return `mp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function createRoom(roomId: string, challengeId: string, playerName: string): Promise<void> {
  const playerId = `p-${Math.random().toString(36).slice(2, 9)}`;
  await setDoc(doc(db, COLLECTION, roomId), {
    challengeId,
    players: {
      [playerId]: { name: playerName, code: "", status: "waiting" },
    },
    state: "waiting",
    createdAt: serverTimestamp(),
  } satisfies RoomData as RoomData);
}

export async function joinRoom(roomId: string, playerName: string): Promise<string | null> {
  const ref = doc(db, COLLECTION, roomId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as RoomData;
  if (Object.keys(data.players).length >= 2) return null;
  const playerId = `p-${Math.random().toString(36).slice(2, 9)}`;
  await updateDoc(ref, {
    [`players.${playerId}`]: { name: playerName, code: "", status: "waiting" },
  });
  return playerId;
}

export function subscribeToRoom(roomId: string, callback: (data: RoomData) => void): () => void {
  return onSnapshot(doc(db, COLLECTION, roomId), (snap) => {
    if (snap.exists()) callback(snap.data() as RoomData);
  });
}

export async function updatePlayerCode(roomId: string, playerId: string, code: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, roomId), {
    [`players.${playerId}.code`]: code,
  });
}

export async function submitSolution(roomId: string, playerId: string, passed: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTION, roomId), {
    [`players.${playerId}.status`]: "submitted",
    [`players.${playerId}.submittedAt`]: Date.now(),
    [`players.${playerId}.passed`]: passed,
  });
}

export async function startGame(roomId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, roomId), {
    state: "playing",
    startedAt: Date.now(),
  });
}
```

- [ ] **Step 2: Create multiplayer page**

This is a large component (~300 lines). The implementing agent should create `challenges/multiplayer/page.tsx` with:

1. **Lobby state**: Form with room ID input, player name, create/join buttons
2. **Game state**: Split screen — left: own CodeEditor (writable), right: opponent CodeEditor (read-only, synced via `subscribeToRoom`)
3. **Challenge display**: Title, description, test cases from `CHALLENGES` data
4. **Timer**: 10-minute countdown from `room.startedAt`
5. **Submit flow**: Run code via `/api/execute-code`, check against test cases, call `submitSolution()`
6. **Winner detection**: When both submitted or timer expires, show results modal
7. **Challenge selection**: Dropdown in lobby for host to pick challenge (defaults to random)

Key patterns to follow:
- Use `DeveloperHeader` and `Footer` like other pages
- Use `useLanguage()` for all text
- Use `useLocale()` for paths
- Dynamic import for CodeEditor (`{ ssr: false }`)

- [ ] **Step 3: Create multiplayer CSS module**

The implementing agent should create `MultiplayerChallenge.module.css` with:
- Lobby form styles (centered card, inputs, buttons)
- Split-screen grid (2 columns on desktop, stacked on mobile)
- Timer bar (fixed top, gradient progress)
- Winner modal (overlay, centered card with result)

- [ ] **Step 4: Add multiplayer card to hub**

In `page.tsx` (hub), add to the `challenges` content group:
```typescript
{
  id: "multiplayer-challenges",
  category: "challenge",
  href: "/developer-section/challenges/multiplayer",
  icon: PeopleIcon,
  titleKey: "multiplayer-card-title",
  descKey: "multiplayer-card-desc",
  ctaKey: "multiplayer-card-cta",
  difficulty: "intermediate",
  tags: ["general"],
},
```

Import `People as PeopleIcon` from MUI.

- [ ] **Step 5: Add translations**

ES:
```typescript
'multiplayer-card-title': 'Retos Multijugador',
'multiplayer-card-desc': 'Compite en tiempo real. Mismo reto, pantalla dividida, el primero en resolverlo gana.',
'multiplayer-card-cta': 'Jugar ahora',
'mp-lobby-title': 'Retos Multijugador',
'mp-create': 'Crear sala',
'mp-join': 'Unirse a sala',
'mp-room-id': 'ID de sala',
'mp-your-name': 'Tu nombre',
'mp-waiting': 'Esperando oponente...',
'mp-opponent': 'Oponente',
'mp-you': 'Tú',
'mp-submit': 'Enviar solución',
'mp-time-left': 'Tiempo restante',
'mp-winner': '¡Ganador!',
'mp-draw': '¡Empate!',
'mp-play-again': 'Jugar de nuevo',
```

EN:
```typescript
'multiplayer-card-title': 'Multiplayer Challenges',
'multiplayer-card-desc': 'Compete in real-time. Same challenge, split screen, first to solve wins.',
'multiplayer-card-cta': 'Play now',
'mp-lobby-title': 'Multiplayer Challenges',
'mp-create': 'Create room',
'mp-join': 'Join room',
'mp-room-id': 'Room ID',
'mp-your-name': 'Your name',
'mp-waiting': 'Waiting for opponent...',
'mp-opponent': 'Opponent',
'mp-you': 'You',
'mp-submit': 'Submit solution',
'mp-time-left': 'Time remaining',
'mp-winner': 'Winner!',
'mp-draw': 'Draw!',
'mp-play-again': 'Play again',
```

- [ ] **Step 6: Commit**

```bash
git add lib/multiplayerRoom.ts app/[locale]/developer-section/challenges/multiplayer/ app/[locale]/developer-section/page.tsx lib/translations.ts
git commit -m "feat: add multiplayer challenges with Firebase real-time sync"
```

---

## Final Verification

### Task 19: Build verification and cleanup

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep -v "pixi\|@pixi"
```

Expected: No errors in any files we created or modified.

- [ ] **Step 2: Run dev server and smoke test**

```bash
npm run dev
```

Verify:
- Hub page loads with all new sections (weekly challenge, recommendations, bookmarks, share button)
- Bookmark hearts appear on cards and toggle
- Keyboard shortcuts j/k/Enter/b work
- Blog page shows reading time and difficulty
- Interview slug pages show SR rating buttons
- Command palette has filter chips
- Playground has templates dropdown and AI review button
- Page transitions animate between routes
- Monaco theme changes with dark/light toggle

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup for developer hub enhancements"
```
