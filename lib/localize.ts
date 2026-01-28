/**
 * Types and helpers for bilingual content (en/es).
 * Use with LanguageContext to resolve the correct string per locale.
 */
export type Locale = 'en' | 'es';

export type TranslatedString = { en: string; es: string };

/**
 * Resolve a translated string for the given locale.
 * Falls back to English if the locale value is missing.
 */
export function localize(s: TranslatedString, locale: Locale): string {
  return s[locale] ?? s.en;
}

/**
 * Resolve an array of translated strings for the given locale.
 */
export function localizeTopics(
  topics: TranslatedString[],
  locale: Locale
): string[] {
  return topics.map((t) => localize(t, locale));
}
