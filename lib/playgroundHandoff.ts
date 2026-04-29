/**
 * Tiny client-side handoff for "Open in playground" buttons. The source page
 * stores the snippet in sessionStorage and navigates to the playground; the
 * playground reads & clears the pending code on mount.
 *
 * sessionStorage is preferred over a URL query param because:
 *   - No URL length limit on long snippets.
 *   - The pending code naturally clears when the tab closes.
 */

const KEY = "playground-pending-code-v1";

export interface PendingCode {
  language: string;
  code: string;
  /** Free-form source label (e.g. "kotlin-course/lambda-receiver"). */
  source?: string;
}

export function setPendingCode(payload: PendingCode): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Quota / disabled storage — silent
  }
}

export function consumePendingCode(): PendingCode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.code === "string" &&
      typeof parsed.language === "string"
    ) {
      return parsed as PendingCode;
    }
    return null;
  } catch {
    return null;
  }
}

/** Lightweight check (does not consume). Used to decide whether to render a banner. */
export function peekPendingCode(): PendingCode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.code === "string" &&
      typeof parsed.language === "string"
    ) {
      return parsed as PendingCode;
    }
    return null;
  } catch {
    return null;
  }
}

/** Returns the right playground route for a given language. */
export function playgroundPathForLanguage(lang: string): string {
  const normalized = lang.toLowerCase();
  if (normalized === "kotlin" || normalized === "kt") {
    return "/developer-section/kotlin-playground";
  }
  return "/developer-section/playground";
}
