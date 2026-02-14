'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/useLocale';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Footer.module.css';

const MOBILE_BREAKPOINT = 768;

const Footer = (): React.JSX.Element => {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const contactHref = createLocalizedPath('/') + '#contacto';
  const footerRef = useRef<HTMLElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setIsCollapsed(false);
    };
    setIsMobile(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowBackToTop(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { href: 'https://linkedin.com', icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
    { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
    { href: 'https://github.com', icon: 'fab fa-github', label: 'GitHub' },
  ];

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.footerWave}>
        <svg
          width="100%"
          height="120"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={styles.waveSvg}
        >
          <defs>
            <linearGradient id="wave-gradient-footer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A06AF9" />
              <stop offset="50%" stopColor="#C855F5" />
              <stop offset="100%" stopColor="#F8549B" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z"
            fill="url(#wave-gradient-footer)"
            initial={{ d: "M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z" }}
            animate={{
              d: [
                "M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z",
                "M0,80 C180,75 360,55 540,55 C720,55 900,65 1080,65 C1260,65 1440,60 1440,60 L1440,120 L0,120 Z",
                "M0,85 C180,85 360,45 540,45 C720,45 900,75 1080,75 C1260,75 1440,55 1440,55 L1440,120 L0,120 Z",
                "M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      <div className={styles.footerContainer}>
        {/* Mobile-only: collapsible header with logo + toggle */}
        {isMobile && (
          <div className={styles.footerHeader}>
            <Link href={createLocalizedPath('/')} className={styles.logo}>
              <i className="fas fa-code"></i> OptimusAgency
            </Link>
            <button
              type="button"
              onClick={() => setIsCollapsed((c) => !c)}
              className={styles.footerToggle}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? t('show-more') : t('show-less')}
            >
              <motion.span
                className={styles.footerToggleIcon}
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <i className="fas fa-chevron-down" aria-hidden />
              </motion.span>
            </button>
          </div>
        )}

        <div
          className={`${styles.footerCollapsible} ${isMobile && isCollapsed ? styles.footerCollapsibleClosed : ''}`}
          aria-hidden={isMobile && isCollapsed}
        >
          <div className={styles.footerMain}>
            {/* Left column: logo (desktop only in brand), tagline, CTA, contact, social */}
            <div className={styles.footerBrand}>
              {!isMobile && (
                <Link href={createLocalizedPath('/')} className={styles.logo}>
                  <i className="fas fa-code"></i> OptimusAgency
                </Link>
              )}
              <p className={styles.tagline}>{t('footer-about')}</p>
            <a href={contactHref} className={styles.ctaButton}>
              {t('footer-cta')} — {t('footer-cta-quote')}
            </a>
            <a
              href="mailto:hola@optimusagency.com"
              className={styles.contactEmail}
            >
              hola@optimusagency.com
            </a>
            <div className={styles.socialRow}>
              <span className={styles.socialLabel}>{t('footer-follow')}</span>
              <div className={styles.socialIcons}>
                {socialLinks.map(({ href, icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={label}
                  >
                    <i className={icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: services navigation */}
          <div className={styles.footerNav}>
            <h4 className={styles.navHeading}>{t('footer-services')}</h4>
            <nav className={styles.serviceLinks}>
              <Link href={createLocalizedPath('/developer-section')} className={styles.serviceLink}>
                {t('nav-developer-section')}
              </Link>
              <Link href={createLocalizedPath('/asesorias')} className={styles.serviceLink}>
                {t('footer-asesorias')}
              </Link>
              <Link href={createLocalizedPath('/agentes')} className={styles.serviceLink}>
                {t('footer-agentes')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Cristian - developer/founder */}
        <div className={styles.developerInfo}>
          <div className={styles.developerCard}>
            <Image
              src="/images/portfolio/cris.jpg"
              alt="Cristian"
              width={80}
              height={80}
              className={styles.developerImage}
            />
            <div className={styles.developerMeta}>
              <p className={styles.developerName}>Cristian</p>
            </div>
          </div>
        </div>

        {/* Bottom: legal links + copyright */}
        <div className={styles.footerBottom}>
          <nav className={styles.legalLinks}>
            <Link href="#">{t('footer-privacy')}</Link>
            <span className={styles.legalSeparator}>·</span>
            <Link href="#">{t('footer-terms')}</Link>
          </nav>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} OptimusAgency. {t('footer-copyright')}
          </p>
        </div>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            className={styles.backToTop}
            onClick={scrollToTop}
            aria-label={t('footer-back-to-top')}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className={styles.backToTopIcon}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
