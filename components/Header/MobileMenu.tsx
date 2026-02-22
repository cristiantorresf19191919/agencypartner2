'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjectAdvisor } from '@/contexts/ProjectAdvisorContext';
import { useNavigationLoader } from '@/contexts/NavigationLoaderContext';
import { useLocale } from '@/lib/useLocale';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { openAdvisor } = useProjectAdvisor();
  const { showLoader } = useNavigationLoader();
  const { createLocalizedPath } = useLocale();

  const navItems: NavItem[] = [
    {
      href: '#faq',
      icon: 'fas fa-question-circle',
      title: 'FAQ',
      description: 'Preguntas frecuentes',
    },
    {
      href: '#contacto',
      icon: 'fas fa-envelope',
      title: 'Contacto',
      description: 'Ponte en contacto',
    },
    {
      href: '/asesorias',
      icon: 'fas fa-chalkboard-teacher',
      title: 'Asesorías',
      description: 'Consultoría especializada',
    },
    {
      href: '/agentes',
      icon: 'fas fa-users',
      title: 'Agentes',
      description: 'Nuestro equipo',
    },
    {
      href: createLocalizedPath('/developer-section'),
      icon: 'fas fa-code',
      title: 'Dev',
      description: 'Blog, challenges y herramientas',
    },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClose();
  };

  const handleAdvisorClick = () => {
    openAdvisor();
    onClose();
  };

  /* ── Animation variants ── */

  const overlayVariants = {
    closed: {
      clipPath: 'circle(0px at 0px 0px)',
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    open: {
      clipPath: 'circle(150vh at 0px 0px)',
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const contentVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { delay: 0.15, duration: 0.3, staggerChildren: 0.06, delayChildren: 0.2 },
    },
  };

  // Spring entrance with slide-up
  const itemVariants = {
    closed: { opacity: 0, y: 24 },
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
  };

  const headerVariants = {
    closed: { opacity: 0, scale: 0.8 },
    open: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.1 },
    },
  };

  const closeButtonVariants = {
    closed: { opacity: 0, rotate: -90, scale: 0.5 },
    open: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 12, delay: 0.3 },
    },
  };

  const ctaVariants = {
    closed: { opacity: 0, y: 20, scale: 0.95 },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 14, delay: 0.65 },
    },
  };

  const footerVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { delay: 0.75, duration: 0.4 } },
  };

  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-mobile-menu-open', 'true');
    } else {
      document.body.removeAttribute('data-mobile-menu-open');
    }
    return () => document.body.removeAttribute('data-mobile-menu-open');
  }, [isOpen]);

  const renderNavLink = (item: NavItem) => {
    const inner = (
      <>
        <div className={styles.navContent}>
          <div className={styles.navIcon}>
            <i className={item.icon}></i>
          </div>
          <div className={styles.navText}>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.description}>{item.description}</span>
          </div>
        </div>
        <i className={`fas fa-chevron-right ${styles.arrow}`}></i>
      </>
    );

    if (item.href.startsWith('#')) {
      return (
        <a
          href={item.href}
          className={styles.navLink}
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick(item.href);
          }}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link
        href={item.href}
        className={styles.navLink}
        onClick={() => {
          if (item.href.includes('developer-section')) {
            showLoader('Loading Developer Hub...');
          }
          onClose();
        }}
      >
        {inner}
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onClick={onClose}
        >
          {/* Floating gradient orbs */}
          <div className={styles.orbField} aria-hidden>
            <motion.div
              className={`${styles.orb} ${styles.orb1}`}
              animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={`${styles.orb} ${styles.orb2}`}
              animate={{ scale: [1, 0.9, 1.1, 1], rotate: [0, -90, -180, -360] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={`${styles.orb} ${styles.orb3}`}
              animate={{ scale: [1, 1.2, 0.95, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            className={styles.content}
            variants={contentVariants}
            initial="closed"
            animate="open"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button with rotation entrance */}
            <motion.button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Cerrar menú"
              variants={closeButtonVariants}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
            >
              <i className="fas fa-xmark"></i>
            </motion.button>

            {/* Header with spring scale */}
            <motion.div className={styles.headerRow} variants={headerVariants}>
              <div className={styles.logo}>
                <i className="fas fa-code"></i>
              </div>
              <div className={styles.title}>
                <h2>OptimusAgency</h2>
              </div>
            </motion.div>

            {/* Nav items: scrollable list, flat on gradient with faint dividers */}
            <div className={styles.navScroll}>
              <nav className={styles.nav}>
                {navItems.map((item) => (
                  <motion.div
                    key={item.href}
                    className={styles.navItem}
                    variants={itemVariants}
                  >
                    {renderNavLink(item)}
                  </motion.div>
                ))}
                <motion.div className={styles.navItem} variants={itemVariants}>
                  <button
                    className={styles.navLink}
                    onClick={handleAdvisorClick}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div className={styles.navContent}>
                      <div className={styles.navIcon}>
                        <i className="fas fa-robot"></i>
                      </div>
                      <div className={styles.navText}>
                        <span className={styles.title}>Asesor de Proyecto</span>
                        <span className={styles.description}>Recomendación personalizada</span>
                      </div>
                    </div>
                    <i className={`fas fa-chevron-right ${styles.arrow}`}></i>
                  </button>
                </motion.div>
              </nav>
            </div>

            {/* CTA + footer sticky at bottom */}
            <div className={styles.stickyBottom}>
              <motion.div className={styles.ctaSection} variants={ctaVariants}>
              <a
                href="#contacto"
                className={styles.ctaButton}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#contacto');
                }}
              >
                <i className="fas fa-rocket"></i>
                Empezar mi proyecto
                <motion.span
                  className={styles.ctaShine}
                  animate={{ x: ['-100%', '250%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                  aria-hidden
                />
              </a>
            </motion.div>

              {/* Footer fade in */}
              <motion.div className={styles.footer} variants={footerVariants}>
              <div className={styles.footerTop}>
                <p className={styles.footerBrand}>OptimusAgency © {new Date().getFullYear()}</p>
                <div className={styles.footerControls}>
                  <button
                    className={styles.langToggle}
                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                    aria-label="Cambiar idioma"
                  >
                    {language === 'es' ? 'EN' : 'ES'}
                  </button>
                  <span className={styles.footerDivider} />
                  <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label="Cambiar tema"
                  >
                    <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                    <div className={styles.toggleTrack}>
                      <div
                        className={`${styles.toggleThumb} ${theme === 'dark' ? styles.toggleActive : ''}`}
                      ></div>
                    </div>
                  </button>
                </div>
              </div>
              <p className={styles.footerTagline}>Conectando el futuro digital</p>
            </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
