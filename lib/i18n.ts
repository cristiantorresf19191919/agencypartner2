export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

/**
 * Returns the Spanish value when locale is "es" and a Spanish value is present;
 * otherwise falls back to the English (canonical) value. Used by every
 * developer-section data file that opts into the bilingual shape.
 */
export function pickLang<T>(lang: string, es: T | undefined | null, en: T): T {
  return lang === 'es' && es !== undefined && es !== null ? es : en;
}

/**
 * Convenience for arrays where missing es means "fall back item by item".
 * If `es` is shorter than `en`, missing entries fall back to the English entry.
 */
export function pickLangArray<T>(lang: string, es: T[] | undefined, en: T[]): T[] {
  if (lang !== 'es' || !es) return en;
  return en.map((item, i) => (es[i] !== undefined ? es[i] : item));
}

/**
 * Check if a pathname has a locale prefix
 */
export function pathnameHasLocale(pathname: string): boolean {
  return locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
}

/**
 * Extract locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return defaultLocale;
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length);
    }
    if (pathname === `/${locale}`) {
      return '/';
    }
  }
  return pathname;
}

/**
 * Add locale to pathname
 */
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  // If it's just the root, return /locale
  if (pathname === '/') {
    return `/${locale}`;
  }
  // If pathname already has a locale, replace it
  if (pathnameHasLocale(pathname)) {
    return `/${locale}${removeLocaleFromPathname(pathname)}`;
  }
  // Otherwise, add the locale
  return `/${locale}${pathname}`;
}

