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
  map[courseId] = {
    ...current,
    lastLessonId: lesson.id,
    lastLessonTitle: lesson.title,
    lastLessonHref: lesson.href,
    lastVisitedAt: Date.now(),
  };
  writeAll(map);
}

export function recordLessonCompletion(courseId: string, lessonId: string): void {
  const map = readAll();
  const current = map[courseId] ?? {};
  const completed = { ...(current.completed ?? {}), [lessonId]: Date.now() };
  map[courseId] = { ...current, completed };
  writeAll(map);
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
