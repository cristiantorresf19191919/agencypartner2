'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocale } from '@/lib/useLocale';
import { SearchBar } from '@/components/Search';
import styles from './Header.module.css';

const DeveloperHeader = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { createLocalizedPath } = useLocale();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.codeSymbol}>&lt;/&gt;</span>
        </div>

        <Link
          href={createLocalizedPath('/developer-section/blog')}
          className={styles.gradientLink}
          style={{ marginRight: 'auto', marginLeft: '2rem' }}
        >
          {t('nav-blog')}
        </Link>

        <div style={{ marginRight: '1rem' }}>
          <SearchBar />
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? (
                <i className="fas fa-sun" style={{ color: '#ffd700' }} />
              ) : (
                <i className="fas fa-moon" style={{ color: '#a06af9' }} />
              )}
            </motion.div>
          </button>
          <button
            type="button"
            className={styles.languageSwitcher}
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'es' ? 'English' : 'Español'}`}
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
        </div>
      </nav>
    </header>
  );
};

export default DeveloperHeader;

