'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocale } from '@/lib/useLocale';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Header.module.css';

const DeveloperHeader = () => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { createLocalizedPath } = useLocale();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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
        <Link
          href={createLocalizedPath('/')}
          className={styles.logo}
          style={{ textDecoration: 'none' }}
        >
          <span className={styles.codeSymbol}>&lt;/&gt;</span>
          <span className={styles.brandName}>OptimusAgency</span>
        </Link>

        <Link
          href={createLocalizedPath('/developer-section')}
          className={styles.gradientLink}
          style={{ marginRight: '1.5rem', marginLeft: '2rem' }}
        >
          {t('nav-developer-section')}
        </Link>
        <Link
          href={createLocalizedPath('/developer-section/blog')}
          className={styles.gradientLink}
          style={{ marginRight: '1.5rem' }}
        >
          {t('nav-blog')}
        </Link>
        <Link
          href={createLocalizedPath('/developer-section/challenges')}
          className={styles.gradientLink}
          style={{ marginRight: 'auto' }}
        >
          {t('nav-challenges')}
        </Link>

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
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
};

export default DeveloperHeader;

