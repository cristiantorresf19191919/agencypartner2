'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Header.module.css';
import MobileMenu from './MobileMenu';
import { ProjectAdvisorStepper } from '@/components/ProjectAdvisor/ProjectAdvisorStepper';

interface NavLink {
  href: string;
  label: string;
  gradient?: boolean;
}

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [advisorOpen, setAdvisorOpen] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    const handleScroll = (): void => {
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
    { href: '/asesorias', label: 'Asesorías', gradient: true },
    { href: '/agentes', label: 'Agentes', gradient: true },
  ];

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
            <i className="fas fa-code"></i> Optimus<strong>Agency</strong>
          </Link>

          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith('#') ? (
                  <a
                    href={link.href}
                    className={link.gradient ? styles.gradientLink : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.querySelector(link.href);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
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
          </ul>

          <div className={styles.headerActions}>
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

            <button
              type="button"
              className={styles.advisorCta}
              onClick={() => setAdvisorOpen(true)}
            >
              <span className={styles.advisorCtaGlow} />
              <span className={styles.advisorCtaInner}>
                <i className="fa-solid fa-wand-magic-sparkles" />
                <span className={styles.advisorCtaText}>Planear mi proyecto con IA</span>
              </span>
            </button>
          </div>
        </nav>

        <div className={styles.headerWaveContainer}>
          <svg 
            width="100%" 
            height="150" 
            viewBox="0 0 1440 150" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '150px' }}
          >
            <defs>
              <linearGradient id="wave-gradient-index" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stopColor="#8e44ad" />
                <stop offset="95%" stopColor="#e91e63" />
              </linearGradient>
            </defs>
            <motion.path
              className={styles.wavePath}
              d="M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,0L0,0Z"
              stroke="none"
              strokeWidth="0"
              fill="url(#wave-gradient-index)"
              animate={{
                d: [
                  "M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,0L0,0Z",
                  "M0,150 C123.3,119.5,246.7,88.9,431,77 C615.3,65.1,860.7,71.7,1039,87 C1217.3,102.3,1328.7,126.1,1440,150L1440,0L0,0Z",
                  "M0,150 C131.7,168.4,263.5,186.8,432,188 C600.5,189.2,805.9,173.2,980,164 C1154.1,154.8,1297.1,152.4,1440,150L1440,0L0,0Z",
                  "M0,150 C171.6,149.5,343.2,148.9,500,141 C656.8,133.1,798.8,117.7,953,118 C1107.2,118.3,1273.6,134.1,1440,150L1440,0L0,0Z",
                  "M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,0L0,0Z",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </svg>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <ProjectAdvisorStepper open={advisorOpen} onClose={() => setAdvisorOpen(false)} />
    </>
  );
};

export default Header;

