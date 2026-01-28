'use client';

import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, addLocaleToPathname, removeLocaleFromPathname, type Locale } from './i18n';

/**
 * Hook to get current locale and create locale-aware paths
 */
export function useLocale() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  const createLocalizedPath = (path: string): string => {
    // If path is an anchor link, return as-is
    if (path.startsWith('#')) {
      return path;
    }
    
    // Remove locale from path if it exists
    const pathWithoutLocale = removeLocaleFromPathname(path);
    
    // Add current locale to path
    return addLocaleToPathname(pathWithoutLocale, locale);
  };

  return {
    locale,
    createLocalizedPath,
  };
}

