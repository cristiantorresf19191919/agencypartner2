'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ExitIntentModal.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

const STORAGE_KEY = 'exit-intent-dismissed';

const ExitIntentModal = (): React.JSX.Element => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback(() => {
    // Only show once per session
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setIsOpen(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Desktop: detect mouse leaving viewport at top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && e.relatedTarget === null) {
        show();
      }
    };

    // Mobile: detect inactivity (60s with no scroll/touch)
    let inactivityTimer: ReturnType<typeof setTimeout>;
    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Only trigger if user has scrolled at least 20% of page
        const scrollDepth = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        if (scrollDepth > 0.2) {
          show();
        }
      }, 60000);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', resetInactivity, { passive: true });
    window.addEventListener('touchstart', resetInactivity, { passive: true });
    resetInactivity();

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', resetInactivity);
      window.removeEventListener('touchstart', resetInactivity);
      clearTimeout(inactivityTimer);
    };
  }, [show]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCTA = () => {
    setIsOpen(false);
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className={styles.iconWrapper}>
              <div className={styles.iconCircle}>
                <i className="fas fa-hand-paper"></i>
              </div>
            </div>

            <h3 className={styles.title}>
              {t('exit-title')}
            </h3>
            <p className={styles.subtitle}>
              {t('exit-subtitle')}
            </p>

            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <i className="fas fa-check-circle"></i>
                <span>{t('exit-benefit-1')}</span>
              </div>
              <div className={styles.benefitItem}>
                <i className="fas fa-check-circle"></i>
                <span>{t('exit-benefit-2')}</span>
              </div>
              <div className={styles.benefitItem}>
                <i className="fas fa-check-circle"></i>
                <span>{t('exit-benefit-3')}</span>
              </div>
            </div>

            <button className={styles.ctaButton} onClick={handleCTA}>
              <i className="fas fa-rocket"></i> {t('exit-cta')}
            </button>
            <button className={styles.dismissLink} onClick={handleClose}>
              {t('exit-dismiss')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
