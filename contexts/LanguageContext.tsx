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

      // Listen for language changes from other parts of the app
      const handleLanguageChange = () => {
        const currentLang =
          (window.localStorage.getItem('language') as SupportedLanguage) || 'es';
        // Force state update to trigger re-renders
        setLanguageState((prevLang) => {
          if (prevLang !== currentLang) {
            return currentLang;
          }
          return prevLang;
        });
        if (typeof document !== 'undefined') {
          document.documentElement.lang = currentLang;
        }
        // Also update any elements with data-translate attribute (for non-React content)
        if (typeof document !== 'undefined') {
          document.querySelectorAll('[data-translate]').forEach((element) => {
            const key = element.getAttribute('data-translate');
            if (key && translations[currentLang] && translations[currentLang][key]) {
              if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                (element as HTMLInputElement).placeholder = translations[currentLang][key];
              } else {
                element.textContent = translations[currentLang][key];
              }
            }
          });
        }
      };

      // Listen to both window and document events
      window.addEventListener('languageChanged', handleLanguageChange);
      document.addEventListener('languageChanged', handleLanguageChange);

      return () => {
        window.removeEventListener('languageChanged', handleLanguageChange);
        document.removeEventListener('languageChanged', handleLanguageChange);
      };
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', lang);
      // Dispatch custom event for language change
      window.dispatchEvent(new CustomEvent('languageChanged'));
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      // Dispatch custom event for language change
      document.dispatchEvent(new CustomEvent('languageChanged'));
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


