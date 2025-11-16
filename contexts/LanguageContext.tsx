/* eslint-disable @typescript-eslint/no-empty-function */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import translations from '@/lib/translations';

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
  const [language, setLanguageState] = useState<SupportedLanguage>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedLang =
        (window.localStorage.getItem('language') as SupportedLanguage) || 'es';
      setLanguageState(savedLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = savedLang;
      }
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


