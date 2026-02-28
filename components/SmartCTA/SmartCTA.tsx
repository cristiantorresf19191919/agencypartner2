'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SmartCTA.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

interface CTAState {
  text: string;
  icon: string;
  target: string;
}

const SmartCTA = (): React.JSX.Element | null => {
  const { t } = useLanguage();
  const [ctaState, setCtaState] = useState<CTAState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const getCTAForScrollDepth = useCallback((depth: number): CTAState | null => {
    // Don't show in the first 10% (hero is visible)
    if (depth < 10) return null;

    if (depth < 30) {
      // User is at services section
      return {
        text: t('smart-cta-services'),
        icon: 'fas fa-th-large',
        target: '#servicios',
      };
    } else if (depth < 50) {
      // User is at pricing area
      return {
        text: t('smart-cta-pricing'),
        icon: 'fas fa-tags',
        target: '#precios',
      };
    } else if (depth < 75) {
      // User is deep — show talk to advisor
      return {
        text: t('smart-cta-talk'),
        icon: 'fas fa-comments',
        target: '#contacto',
      };
    } else {
      // Bottom of page — most urgent CTA
      return {
        text: t('smart-cta-start'),
        icon: 'fas fa-rocket',
        target: '#contacto',
      };
    }
  }, [t]);

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      const newCTA = getCTAForScrollDepth(depth);
      if (newCTA) {
        setCtaState(newCTA);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getCTAForScrollDepth, dismissed]);

  const handleClick = () => {
    if (!ctaState) return;
    const target = document.querySelector(ctaState.target);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && ctaState && !dismissed && (
        <motion.div
          className={styles.smartCTA}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <button className={styles.ctaButton} onClick={handleClick}>
            <i className={ctaState.icon}></i>
            <span>{ctaState.text}</span>
          </button>
          <button
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <i className="fas fa-times"></i>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartCTA;
