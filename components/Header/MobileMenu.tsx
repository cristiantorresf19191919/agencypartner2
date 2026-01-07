'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { language, setLanguage, t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
    onClose(); // Close mobile menu when language is switched
  };

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
      href: '/developer-section',
      icon: 'fas fa-code',
      title: '</>',
      description: t('nav-developer-section-desc'),
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
  ];

  const handleLinkClick = (href: string): void => {
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClose();
  };

  const overlayVariants = {
    closed: {
      clipPath: 'circle(0px at 0px 0px)',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    open: {
      clipPath: 'circle(150vh at 0px 0px)',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const contentVariants = {
    closed: {
      opacity: 0,
      y: 20,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.4,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + index * 0.1,
        duration: 0.4,
      },
    }),
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
          <motion.div
            className={styles.content}
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className={styles.logo}>
              <i className="fas fa-code"></i>
            </div>

            <div className={styles.title}>
              <h2>OptimusAgency</h2>
            </div>

            <nav className={styles.nav}>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  className={styles.navItem}
                  variants={itemVariants}
                  custom={index}
                  initial="closed"
                  animate="open"
                >
                  {item.href.startsWith('#') ? (
                    <a
                      href={item.href}
                      className={styles.navLink}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.href);
                      }}
                    >
                      <div className={styles.navContent}>
                        <div className={styles.navIcon}>
                          <i className={item.icon}></i>
                        </div>
                        <div className={styles.navText}>
                          <span className={`${styles.title} ${item.title === '</>' ? styles.codeSymbolTitle : ''}`}>{item.title}</span>
                          <span className={styles.description}>{item.description}</span>
                        </div>
                      </div>
                      <i className={`fas fa-chevron-right ${styles.arrow}`}></i>
                    </a>
                  ) : (
                    <Link href={createLocalizedPath(item.href)} className={styles.navLink} onClick={onClose}>
                      <div className={styles.navContent}>
                        <div className={styles.navIcon}>
                          <i className={item.icon}></i>
                        </div>
                        <div className={styles.navText}>
                          <span className={`${styles.title} ${item.title === '</>' ? styles.codeSymbolTitle : ''}`}>{item.title}</span>
                          <span className={styles.description}>{item.description}</span>
                        </div>
                      </div>
                      <i className={`fas fa-chevron-right ${styles.arrow}`}></i>
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className={styles.switchers}>
              <div className={styles.themeSwitcher}>
                <div className={styles.themeContainer}>
                  <div className={styles.themeLabel}>
                    <div className={styles.themeIconContainer}>
                      <i className={`fas fa-sun ${styles.lightIcon}`}></i>
                      <i className={`fas fa-moon ${styles.darkIcon}`}></i>
                    </div>
                    <span>Tema</span>
                  </div>
                  <button
                    className={styles.themeButton}
                    onClick={toggleTheme}
                    aria-label="Cambiar tema"
                  >
                    <div
                      className={`${styles.btnCircle} ${theme === 'dark' ? styles.active : ''}`}
                    ></div>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={theme === 'dark'}
                      readOnly
                    />
                  </button>
                </div>
              </div>

              <div className={styles.languageSwitcher}>
                <div className={styles.languageContainer}>
                  <div className={styles.languageLabel}>
                    <div className={styles.languageIconContainer}>
                      <i className="fas fa-globe"></i>
                    </div>
                    <span>Idioma</span>
                  </div>
                  <button
                    className={styles.languageButton}
                    onClick={toggleLanguage}
                    aria-label={`Switch to ${language === 'es' ? 'English' : 'Español'}`}
                  >
                    <motion.span
                      key={language}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={styles.languageText}
                    >
                      {language === 'es' ? 'EN' : 'ES'}
                    </motion.span>
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <p>OptimusAgency © {new Date().getFullYear()}</p>
              <p>Conectando el futuro digital</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

