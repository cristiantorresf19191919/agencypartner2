'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeveloperSectionFont } from '@/contexts/DeveloperSectionFontContext';
import { useCommandPalette } from '@/contexts/CommandPaletteContext';
import { useLocale } from '@/lib/useLocale';
import { removeLocaleFromPathname, addLocaleToPathname, type Locale } from '@/lib/i18n';
import styles from './Header.module.css';

export interface DeveloperHeaderProps {
  /** Page title shown in mobile header center (e.g. "Blog", "Dev Hub") */
  pageTitle?: string;
  /** Called when mobile hamburger is tapped; drawer should open */
  onOpenDrawer?: () => void;
  /** When true, hamburger shows as active (drawer open) */
  drawerOpen?: boolean;
}

const DeveloperHeader = ({ pageTitle, onOpenDrawer, drawerOpen = false }: DeveloperHeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { contentFontSize, setContentFontSize } = useDeveloperSectionFont();
  const { open: openCommandPalette } = useCommandPalette();
  const { createLocalizedPath } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [overflowOpen, setOverflowOpen] = useState<boolean>(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [modifierKey, setModifierKey] = useState<string>('Ctrl'); // Default matches SSR
  const overflowRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const nextLocale: Locale = language === 'es' ? 'en' : 'es';
    setLanguage(nextLocale);
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    const newPath = addLocaleToPathname(pathWithoutLocale, nextLocale);
    router.push(newPath);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
      if (mobileMoreRef.current && !mobileMoreRef.current.contains(e.target as Node)) {
        setMobileMoreOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect Mac platform after hydration to avoid SSR mismatch
  useEffect(() => {
    if (navigator?.platform?.includes('Mac')) {
      setModifierKey('\u2318'); // ⌘
    }
  }, []);

  const fontSizeControls = (
    <div className={styles.developerFontSizeControls}>
      <span className={styles.developerFontSizeLabel}>{t('header-text-size')}</span>
      <button
        type="button"
        className={styles.developerFontSizeBtn}
        onClick={() => setContentFontSize((s) => Math.max(12, s - 2))}
        aria-label={t('header-decrease-size')}
        title={t('header-decrease-size')}
      >
        A−
      </button>
      <button
        type="button"
        className={styles.developerFontSizeBtn}
        onClick={() => setContentFontSize((s) => Math.min(24, s + 2))}
        aria-label={t('header-increase-size')}
        title={t('header-increase-size')}
      >
        A+
      </button>
    </div>
  );

  const mobileMoreContent = (
    <>
      <button
        type="button"
        onClick={() => {
          openCommandPalette();
          setMobileMoreOpen(false);
        }}
        className={styles.developerOverflowAction}
      >
        <i className="fas fa-search" /> {t('header-search') || 'Search'}
      </button>
      <div className={styles.developerOverflowDivider} />
      <div className={styles.developerFontSizeControls} style={{ padding: '8px 12px', marginBottom: 4 }}>
        <span className={styles.developerFontSizeLabel}>{t('header-text-size-mobile')}</span>
        <button
          type="button"
          className={styles.developerFontSizeBtn}
          onClick={() => { setContentFontSize((s) => Math.max(12, s - 2)); setMobileMoreOpen(false); }}
          aria-label={t('header-decrease')}
        >
          A−
        </button>
        <button
          type="button"
          className={styles.developerFontSizeBtn}
          onClick={() => { setContentFontSize((s) => Math.min(24, s + 2)); setMobileMoreOpen(false); }}
          aria-label={t('header-increase')}
        >
          A+
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          toggleTheme();
          setMobileMoreOpen(false);
        }}
        className={styles.developerOverflowAction}
      >
        {theme === 'dark' ? (
          <><i className="fas fa-sun" /> {t('header-light-theme')}</>
        ) : (
          <><i className="fas fa-moon" /> {t('header-dark-theme')}</>
        )}
      </button>
      <button
        type="button"
        onClick={() => {
          toggleLanguage();
          setMobileMoreOpen(false);
        }}
        className={styles.developerOverflowAction}
      >
        <i className="fas fa-language" /> {language === 'es' ? t('header-switch-english') : t('header-switch-spanish')}
      </button>
    </>
  );

  return (
    <header
      className={`${styles.header} ${styles.developerHeader} ${isScrolled ? styles.scrolled : ''}`}
    >
      <nav className={styles.nav}>
        {/* Mobile: left — hamburger + short logo */}
        <div className={styles.navLeft} ref={mobileNavRef}>
          {onOpenDrawer != null ? (
            <button
              type="button"
              onClick={onOpenDrawer}
              className={`${styles.developerDrawerToggle} ${drawerOpen ? styles.active : ''}`}
              aria-label={t('nav-blog') || 'Menu'}
              aria-expanded={drawerOpen}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className={`${styles.developerDrawerToggle} ${mobileNavOpen ? styles.active : ''}`}
              aria-label={t('header-menu')}
              aria-expanded={mobileNavOpen}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          )}
          <AnimatePresence>
            {mobileNavOpen && onOpenDrawer == null && (
              <motion.div
                className={styles.developerMobileNavMenu}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={createLocalizedPath('/developer-section')}
                  className={styles.developerOverflowLink}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {t('nav-developer-section')}
                </Link>
                <Link
                  href={createLocalizedPath('/developer-section/blog')}
                  className={styles.developerOverflowLink}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {t('nav-blog')}
                </Link>
                <Link
                  href={createLocalizedPath('/developer-section/challenges')}
                  className={styles.developerOverflowLink}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {t('nav-challenges')}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <Link
            href={createLocalizedPath('/')}
            className={`${styles.developerLogo} ${styles.developerLogoShort}`}
            style={{ textDecoration: 'none' }}
          >
            <span className={styles.codeSymbol}>&lt;/&gt;</span>
            <span className={styles.brandName}>Optimus</span>
          </Link>
        </div>

        {/* Mobile: center — page title */}
        <div className={styles.navCenter} title={pageTitle}>
          {pageTitle ?? t('nav-blog')}
        </div>

        {/* Desktop: full logo */}
        <Link
          href={createLocalizedPath('/')}
          className={`${styles.developerLogo} ${styles.developerLogoFull}`}
          style={{ textDecoration: 'none' }}
        >
          <span className={styles.codeSymbol}>&lt;/&gt;</span>
          <span className={styles.brandName}>Optimus</span>Agency
        </Link>

        <div className={styles.developerNavLinks}>
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
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={openCommandPalette}
            className={styles.searchButton}
            aria-label={t('header-search') || 'Search'}
            title={`${t('header-search') || 'Search'} (${modifierKey}+K)`}
          >
            <i className="fas fa-search" />
            <span className={styles.searchShortcut}>
              <kbd>{modifierKey}</kbd>
              <kbd>K</kbd>
            </span>
          </button>
          {fontSizeControls}
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
            aria-label={language === 'es' ? t('header-switch-english') : t('header-switch-spanish')}
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

        <div className={styles.developerOverflow} ref={overflowRef}>
          <button
            type="button"
            onClick={() => setOverflowOpen(!overflowOpen)}
            className={styles.developerOverflowButton}
            aria-label={t('header-menu')}
            aria-expanded={overflowOpen}
          >
            <i className="fas fa-ellipsis-v" aria-hidden />
          </button>
          <AnimatePresence>
            {overflowOpen && (
              <motion.div
                className={styles.developerOverflowMenu}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={createLocalizedPath('/developer-section')}
                  className={styles.developerOverflowLink}
                  onClick={() => setOverflowOpen(false)}
                >
                  {t('nav-developer-section')}
                </Link>
                <Link
                  href={createLocalizedPath('/developer-section/blog')}
                  className={styles.developerOverflowLink}
                  onClick={() => setOverflowOpen(false)}
                >
                  {t('nav-blog')}
                </Link>
                <Link
                  href={createLocalizedPath('/developer-section/challenges')}
                  className={styles.developerOverflowLink}
                  onClick={() => setOverflowOpen(false)}
                >
                  {t('nav-challenges')}
                </Link>
                <div className={styles.developerOverflowDivider} />
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setOverflowOpen(false);
                  }}
                  className={styles.developerOverflowAction}
                >
                  {theme === 'dark' ? (
                    <><i className="fas fa-sun" /> {t('header-light-theme')}</>
                  ) : (
                    <><i className="fas fa-moon" /> {t('header-dark-theme')}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleLanguage();
                    setOverflowOpen(false);
                  }}
                  className={styles.developerOverflowAction}
                >
                  <i className="fas fa-language" /> {language === 'es' ? t('header-switch-english') : t('header-switch-spanish')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile: right — single "more" menu (theme + language) */}
        <div className={styles.navRight} ref={mobileMoreRef}>
          <div className={styles.developerMobileMore}>
            <button
              type="button"
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className={styles.developerMobileMoreButton}
              aria-label={t('header-more-options')}
              aria-expanded={mobileMoreOpen}
            >
              <i className="fas fa-ellipsis-v" aria-hidden />
            </button>
            <AnimatePresence>
              {mobileMoreOpen && (
                <motion.div
                  className={styles.developerOverflowMenu}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6 }}
                >
                  {mobileMoreContent}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DeveloperHeader;

