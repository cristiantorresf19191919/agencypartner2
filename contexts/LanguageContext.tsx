/* eslint-disable @typescript-eslint/no-empty-function */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import translations from '@/lib/translations';
import { getLocaleFromPathname, addLocaleToPathname, type Locale } from '@/lib/i18n';

type SupportedLanguage = 'es' | 'en';

type TranslationKey = keyof (typeof translations)['es'];

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey | string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: 'es',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  // Initialize from current pathname so the correct locale is available on first render
  const [language, setLanguageState] = useState<SupportedLanguage>(
    () => getLocaleFromPathname(pathname || '/')
  );
  const [mounted, setMounted] = useState(false);

  // Initialize and sync language with URL pathname
  useEffect(() => {
    if (typeof window !== 'undefined' && pathname) {
      const localeFromPath = getLocaleFromPathname(pathname);
      setLanguageState(localeFromPath);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = localeFromPath;
      }
    }
    setMounted(true);
  }, [pathname]);

  const setLanguage = (lang: SupportedLanguage) => {
    // Update state immediately for instant UI feedback
    setLanguageState(lang);

    // Keep <html lang> in sync
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }

    // Update URL to reflect language change - the pathname syncs state on navigation
    if (pathname) {
      const newPath = addLocaleToPathname(pathname, lang);
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      router.push(`${newPath}${hash}`, { scroll: false });
    }
  };

  const t = (key: TranslationKey | string): string => {
    const currentTranslations = translations[language] as Record<string, string>;
    return currentTranslations?.[key] || key;
  };

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


