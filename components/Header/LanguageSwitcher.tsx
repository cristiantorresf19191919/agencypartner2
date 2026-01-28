'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Header.module.css';

/**
 * Renders a toggle button to switch between English and Spanish.
 * Uses global language state from LanguageContext; UI updates instantly on change.
 */
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <button
      type="button"
      className={styles.languageSwitcher}
      onClick={toggleLanguage}
      aria-label={
        language === 'es'
          ? 'Switch to English'
          : 'Cambiar a español'
      }
    >
      <motion.span
        key={language}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={styles.languageLabel}
      >
        {language === 'es' ? 'EN' : 'ES'}
      </motion.span>
    </button>
  );
}
