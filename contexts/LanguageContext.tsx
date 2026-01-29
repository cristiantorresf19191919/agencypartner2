/* eslint-disable @typescript-eslint/no-empty-function */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import translations from '@/lib/translations';
import { pathnameHasLocale, getLocaleFromPathname } from '@/lib/i18n';

type SupportedLanguage = 'es' | 'en';

type TranslationKey = keyof (typeof translations)['es'];

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey | string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: 'es',
  setLanguage: () => { },
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
  const [language, setLanguageState] = useState<SupportedLanguage>('es');
  const [mounted, setMounted] = useState(false);

  // Sync language from URL locale: /es → Spanish, /en → English
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathnameHasLocale(pathname)) {
      const locale = getLocaleFromPathname(pathname) as SupportedLanguage;
      setLanguageState(locale);
      window.localStorage.setItem('language', locale);
      document.documentElement.lang = locale;
    }
  }, [pathname]);

  // Initial mount: prefer URL locale, then localStorage, then default
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      let lang: SupportedLanguage = 'es';
      if (pathnameHasLocale(pathname)) {
        lang = getLocaleFromPathname(pathname) as SupportedLanguage;
      } else {
        const saved =
          (window.localStorage.getItem('language') as SupportedLanguage) || 'es';
        lang = saved === 'es' || saved === 'en' ? saved : 'es';
      }
      setLanguageState(lang);
      window.localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', lang);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const t = (key: TranslationKey | string): string => {
    const currentTranslations = translations[language] as Record<string, string>;
    return currentTranslations?.[key] || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


