'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Header.module.css';
import MobileMenu from './MobileMenu';
import { useProjectAdvisor } from '@/contexts/ProjectAdvisorContext';
import { useNavigationLoader } from '@/contexts/NavigationLoaderContext';
import { useLocale } from '@/lib/useLocale';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavLink {
  href: string;
  label: string;
  gradient?: boolean;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAdvisor } = useProjectAdvisor();
  const { showLoader } = useNavigationLoader();
  const { createLocalizedPath } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const totalScrollable = docHeight - windowHeight;

      const progress =
        totalScrollable > 0 ? Math.min((scrollTop / totalScrollable) * 100, 100) : 0;

      setIsScrolled(scrollTop > 50);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { href: '#faq', label: 'FAQ' },
    { href: '#contacto', label: 'Contacto' },
    { href: '/asesorias', label: 'Asesorías' },
    { href: '/agentes', label: 'Agentes' },
  ];

  const handleAdvisorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openAdvisor();
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.scrollProgressBar}>
          <div
            className={styles.scrollProgressBarFill}
            style={{ transform: `scaleX(${scrollProgress / 100})` }}
          />
        </div>
        <nav className={styles.nav}>
          <button
            className={`${styles.mobileMenuToggle} ${mobileMenuOpen ? styles.active : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú móvil"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>

          <Link href="/" className={styles.logo}>
            <i className="fas fa-code"></i>
            <span className={styles.logoText}>Optimus<strong>Agency</strong></span>
          </Link>

          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith('#') ? (
                  <a
                    href={link.href}
                    className={link.gradient ? styles.gradientLink : ''}
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className={link.gradient ? styles.gradientLink : ''}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href={createLocalizedPath('/developer-section')}
                className={styles.devLink}
                title="Developer section — blog, challenges & tools"
                onClick={() => showLoader('Loading Developer Hub...')}
              >
                <span className={styles.devLinkIcon}>&lt;/&gt;</span>
                <span>Dev</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleAdvisorClick}
                className={styles.advisorButton}
                aria-label="Abrir asesor de proyecto"
              >
                <i className="fas fa-robot"></i>
                <span>Asesor de Proyecto</span>
              </button>
            </li>
          </ul>

          <div className={styles.headerToggles}>
            <button
              className={`${styles.headerToggleBtn} ${styles.headerLangBtn}`}
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              aria-label="Cambiar idioma"
            >
              {language === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              className={styles.headerToggleBtn}
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
          </div>
        </nav>

        <div className={styles.headerWaveContainer}>
          <svg
            width="100%"
            height="180"
            viewBox="0 0 1440 180"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '180px' }}
          >
            <defs>
              <linearGradient id="wave-gradient-index" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#8e44ad" />
                <stop offset="30%" stopColor="#a06af9" />
                <stop offset="60%" stopColor="#e91e63" />
                <stop offset="100%" stopColor="#ff69b4" />
              </linearGradient>
            </defs>
            <motion.path
              className={styles.wavePath}
              d="M0,180 C120,140 240,100 360,95 C480,90 600,110 720,125 C840,140 960,150 1080,145 C1200,140 1320,130 1440,135 L1440,0 L0,0 Z"
              stroke="none"
              fill="url(#wave-gradient-index)"
              initial={{ d: "M0,180 C120,140 240,100 360,95 C480,90 600,110 720,125 C840,140 960,150 1080,145 C1200,140 1320,130 1440,135 L1440,0 L0,0 Z" }}
              animate={{
                d: [
                  "M0,180 C120,140 240,100 360,95 C480,90 600,110 720,125 C840,140 960,150 1080,145 C1200,140 1320,130 1440,135 L1440,0 L0,0 Z",
                  "M0,180 C100,160 200,120 320,105 C440,90 560,100 680,115 C800,130 920,145 1040,140 C1160,135 1280,125 1440,130 L1440,0 L0,0 Z",
                  "M0,180 C140,150 280,110 400,100 C520,90 640,105 760,120 C880,135 1000,150 1120,145 C1240,140 1320,135 1440,140 L1440,0 L0,0 Z",
                  "M0,180 C110,145 220,105 340,98 C460,91 580,108 700,123 C820,138 940,148 1060,143 C1180,138 1300,128 1440,133 L1440,0 L0,0 Z",
                  "M0,180 C130,155 260,115 380,102 C500,89 620,112 740,127 C860,142 980,152 1100,147 C1220,142 1340,132 1440,137 L1440,0 L0,0 Z",
                  "M0,180 C150,135 300,100 420,92 C540,84 660,107 780,122 C900,137 1020,147 1140,142 C1260,137 1380,127 1440,132 L1440,0 L0,0 Z",
                  "M0,180 C105,165 210,125 330,103 C450,81 570,104 690,119 C810,134 930,144 1050,139 C1170,134 1290,124 1440,129 L1440,0 L0,0 Z",
                  "M0,180 C120,140 240,100 360,95 C480,90 600,110 720,125 C840,140 960,150 1080,145 C1200,140 1320,130 1440,135 L1440,0 L0,0 Z",
                ],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default Header;

