/**
 * Cross-course progress tracking. Uses localStorage; client-only — server-side
 * callers should treat all reads as empty.
 *
 * Storage shape (single key, JSON):
 *   {
 *     "kotlin-course": {
 *       lastLessonId: "lambda-expressions-with-receiver",
 *       lastLessonTitle: "Lambda expressions with receiver",
 *       lastVisitedAt: 1714305000000,
 *       completed: { "hello-world": 1714200000000, ... },
 *     },
 *     ...
 *   }
 */

const STORAGE_KEY = "dev-course-progress-v1";

export interface CourseProgress {
  lastLessonId?: string;
  lastLessonTitle?: string;
  lastLessonHref?: string;
  lastVisitedAt?: number;
  /** Lesson id -> completion timestamp. */
  completed?: Record<string, number>;
}

export type ProgressMap = Record<string, CourseProgress>;

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("course-progress-changed"));
  } catch {
    // Swallow — quota exceeded etc.
  }
}

export function getCourseProgress(courseId: string): CourseProgress {
  return readAll()[courseId] ?? {};
}

export function getAllProgress(): ProgressMap {
  return readAll();
}

export function recordLessonVisit(
  courseId: string,
  lesson: { id: string; title: string; href: string },
): void {
  const map = readAll();
  const current = map[courseId] ?? {};
  const isNewLesson = current.lastLessonId !== lesson.id;
  map[courseId] = {
    ...current,
    lastLessonId: lesson.id,
    lastLessonTitle: lesson.title,
    lastLessonHref: lesson.href,
    lastVisitedAt: Date.now(),
  };
  writeAll(map);
  // Reward XP only when a different lesson is opened (avoid double-counting
  // hot-reloads / refreshes of the same page).
  if (isNewLesson) {
    awardXP(5, "visit");
    bumpStreak();
  }
}

export function recordLessonCompletion(courseId: string, lessonId: string): void {
  const map = readAll();
  const current = map[courseId] ?? {};
  const wasCompleted = !!current.completed?.[lessonId];
  const completed = { ...(current.completed ?? {}), [lessonId]: Date.now() };
  map[courseId] = { ...current, completed };
  writeAll(map);
  if (!wasCompleted) {
    awardXP(25, "complete");
    bumpStreak();
  }
}

/* ─────────────────────────────────────────────────────────────────
 * Streak + XP — minimal client-only gamification, separate key so the
 * progress map shape stays clean.
 * ───────────────────────────────────────────────────────────────── */

const STREAK_KEY = "dev-streak-v1";

export interface StreakState {
  /** Total XP earned across all activities. */
  xp: number;
  /** Current streak count, in days. */
  streak: number;
  /** Longest streak ever reached. */
  bestStreak: number;
  /** ISO date (YYYY-MM-DD) of the last activity. */
  lastDay?: string;
}

function readStreak(): StreakState {
  if (typeof window === "undefined") {
    return { xp: 0, streak: 0, bestStreak: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (!raw) return { xp: 0, streak: 0, bestStreak: 0 };
    const parsed = JSON.parse(raw);
    return {
      xp: typeof parsed?.xp === "number" ? parsed.xp : 0,
      streak: typeof parsed?.streak === "number" ? parsed.streak : 0,
      bestStreak:
        typeof parsed?.bestStreak === "number"
          ? parsed.bestStreak
          : typeof parsed?.streak === "number"
            ? parsed.streak
            : 0,
      lastDay: typeof parsed?.lastDay === "string" ? parsed.lastDay : undefined,
    };
  } catch {
    return { xp: 0, streak: 0, bestStreak: 0 };
  }
}

function writeStreak(state: StreakState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("streak-changed"));
  } catch {
    /* ignore */
  }
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function diffDays(a: string, b: string): number {
  // Both ISO YYYY-MM-DD; treat as UTC midnight.
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86_400_000);
}

export function awardXP(
  amount: number,
  _reason: "visit" | "complete" | "manual" = "manual",
): void {
  const state = readStreak();
  writeStreak({ ...state, xp: state.xp + amount });
}

export function bumpStreak(): void {
  const state = readStreak();
  const today = todayKey();
  if (state.lastDay === today) return;
  if (!state.lastDay) {
    writeStreak({ ...state, streak: 1, bestStreak: Math.max(1, state.bestStreak), lastDay: today });
    return;
  }
  const gap = diffDays(state.lastDay, today);
  let nextStreak = state.streak;
  if (gap === 1) nextStreak = state.streak + 1;
  else if (gap <= 0) return; // clock skew or same day
  else nextStreak = 1;
  writeStreak({
    ...state,
    streak: nextStreak,
    bestStreak: Math.max(state.bestStreak, nextStreak),
    lastDay: today,
  });
}

export function getStreakState(): StreakState {
  return readStreak();
}

/** Auto-decay: if the user opens the app and a day has been missed, reset
 *  the live streak to 0 (without losing bestStreak or XP). */
export function maybeResetStreak(): void {
  const state = readStreak();
  if (!state.lastDay) return;
  const gap = diffDays(state.lastDay, todayKey());
  if (gap > 1 && state.streak !== 0) {
    writeStreak({ ...state, streak: 0 });
  }
}

export function clearCourseProgress(courseId: string): void {
  const map = readAll();
  delete map[courseId];
  writeAll(map);
}

export function clearAllProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("course-progress-changed"));
}

export function progressFraction(courseId: string, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  const completed = readAll()[courseId]?.completed ?? {};
  return Math.min(1, Object.keys(completed).length / totalLessons);
}
