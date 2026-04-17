// ---------------------------------------------------------------------------
// devHubStore – unified localStorage store for all developer-section progress
// ---------------------------------------------------------------------------

const STORE_KEY = "dev-hub-store";

// Legacy keys (pre-migration)
const LEGACY_RECENT_KEY = "dev-hub-recent";
const LEGACY_STREAK_KEY = "dev-hub-streak";
const LEGACY_CHANGELOG_KEY = "dev-hub-changelog-dismissed";

// ── Types ─────────────────────────────────────────────────────────────────

export interface SRCardData {
  interval: number;
  easeFactor: number;
  nextReview: string; // ISO date
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

// ── Defaults ──────────────────────────────────────────────────────────────

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

// ── Internal helpers ──────────────────────────────────────────────────────

let migrated = false;

function isSSR(): boolean {
  return typeof window === "undefined";
}

/** Read raw store from localStorage, returning defaults on any error. */
function readRaw(): DevHubStore {
  if (isSSR()) return { ...DEFAULT_STORE };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { ...DEFAULT_STORE };
    return { ...DEFAULT_STORE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STORE };
  }
}

/** Write store to localStorage. */
function writeStore(store: DevHubStore): void {
  if (isSSR()) return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // localStorage full or blocked – silently ignore
  }
}

/** Migrate legacy keys into the unified store (runs once per session). */
function runMigration(): void {
  if (isSSR() || migrated) return;
  migrated = true;

  try {
    const existing = localStorage.getItem(STORE_KEY);
    if (existing) return; // already migrated

    const store: DevHubStore = { ...DEFAULT_STORE };

    // dev-hub-recent → recentVisits
    const rawRecent = localStorage.getItem(LEGACY_RECENT_KEY);
    if (rawRecent) {
      try {
        const parsed = JSON.parse(rawRecent);
        if (Array.isArray(parsed)) store.recentVisits = parsed;
      } catch {
        /* ignore bad data */
      }
    }

    // dev-hub-streak → streak
    const rawStreak = localStorage.getItem(LEGACY_STREAK_KEY);
    if (rawStreak) {
      try {
        const parsed = JSON.parse(rawStreak);
        if (parsed && typeof parsed === "object") {
          store.streak = {
            lastDate: parsed.lastDate ?? "",
            count: parsed.count ?? 0,
          };
        }
      } catch {
        /* ignore bad data */
      }
    }

    // dev-hub-changelog-dismissed → changelogDismissed
    const rawChangelog = localStorage.getItem(LEGACY_CHANGELOG_KEY);
    if (rawChangelog) {
      store.changelogDismissed = rawChangelog;
    }

    writeStore(store);

    // Clean up legacy keys
    localStorage.removeItem(LEGACY_RECENT_KEY);
    localStorage.removeItem(LEGACY_STREAK_KEY);
    localStorage.removeItem(LEGACY_CHANGELOG_KEY);
  } catch {
    // If anything goes wrong, just mark as migrated so we don't retry
  }
}

// ── Core functions ────────────────────────────────────────────────────────

/** Read the full store, running migration on first access. */
export function getStore(): DevHubStore {
  if (isSSR()) return { ...DEFAULT_STORE };
  runMigration();
  return readRaw();
}

/** Merge a partial update into the store and persist it. */
export function updateStore(partial: Partial<DevHubStore>): DevHubStore {
  if (isSSR()) return { ...DEFAULT_STORE };
  const store = { ...getStore(), ...partial };
  writeStore(store);
  return store;
}

// ── Bookmark helpers ──────────────────────────────────────────────────────

/** Toggle a bookmark. Returns `true` if the item was added, `false` if removed. */
export function toggleBookmark(id: string): boolean {
  if (isSSR()) return false;
  try {
    const store = getStore();
    const idx = store.bookmarks.indexOf(id);
    if (idx === -1) {
      store.bookmarks.push(id);
      writeStore(store);
      return true;
    }
    store.bookmarks.splice(idx, 1);
    writeStore(store);
    return false;
  } catch {
    return false;
  }
}

export function isBookmarked(id: string): boolean {
  if (isSSR()) return false;
  try {
    return getStore().bookmarks.includes(id);
  } catch {
    return false;
  }
}

export function getBookmarks(): string[] {
  if (isSSR()) return [];
  try {
    return getStore().bookmarks;
  } catch {
    return [];
  }
}

// ── Recent visits ─────────────────────────────────────────────────────────

/** Record a visit, keeping max 10 entries (most recent first). */
export function trackVisit(cardId: string): void {
  if (isSSR()) return;
  try {
    const store = getStore();
    const filtered = store.recentVisits.filter((id) => id !== cardId);
    filtered.unshift(cardId);
    store.recentVisits = filtered.slice(0, 10);
    writeStore(store);
  } catch {
    // silently ignore
  }
}

/** Return the most recent visits. */
export function getRecentVisits(max: number = 3): string[] {
  if (isSSR()) return [];
  try {
    return getStore().recentVisits.slice(0, max);
  } catch {
    return [];
  }
}

// ── Streak ────────────────────────────────────────────────────────────────

/**
 * Get the current visit streak. Mirrors the original logic:
 * - Same day → return stored count
 * - Yesterday → increment count and persist
 * - Older → reset to 1
 */
export function getStreak(): number {
  if (isSSR()) return 0;
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (store.streak.lastDate === today) return store.streak.count || 1;

    if (store.streak.lastDate === yesterday) {
      const newCount = (store.streak.count || 0) + 1;
      updateStore({ streak: { lastDate: today, count: newCount } });
      return newCount;
    }

    // Streak broken – reset
    updateStore({ streak: { lastDate: today, count: 1 } });
    return 1;
  } catch {
    return 1;
  }
}

// ── Username ──────────────────────────────────────────────────────────────

export function getUsername(): string {
  if (isSSR()) return "";
  try {
    return getStore().username;
  } catch {
    return "";
  }
}

export function setUsername(name: string): void {
  if (isSSR()) return;
  try {
    updateStore({ username: name });
  } catch {
    // silently ignore
  }
}

// ── Weekly challenge ──────────────────────────────────────────────────────

export function isWeeklyChallengeDismissed(weekNumber: number): boolean {
  if (isSSR()) return false;
  try {
    return getStore().weeklyChallengeDismissed >= weekNumber;
  } catch {
    return false;
  }
}

export function dismissWeeklyChallenge(weekNumber: number): void {
  if (isSSR()) return;
  try {
    updateStore({ weeklyChallengeDismissed: weekNumber });
  } catch {
    // silently ignore
  }
}

// ── Changelog ─────────────────────────────────────────────────────────────

export function isChangelogDismissed(version: string): boolean {
  if (isSSR()) return false;
  try {
    return getStore().changelogDismissed === version;
  } catch {
    return false;
  }
}

export function dismissChangelog(version: string): void {
  if (isSSR()) return;
  try {
    updateStore({ changelogDismissed: version });
  } catch {
    // silently ignore
  }
}
