'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFAB } from '@/contexts/FABContext';
import styles from './FAB.module.css';

const FAB = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const toggleFAB = (): void => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: 'theme' | 'language', e?: React.MouseEvent<HTMLButtonElement>): void => {
    if (action === 'theme') {
      e?.preventDefault();
      toggleTheme();
      setTimeout(() => setIsOpen(false), 300);
    } else if (action === 'language') {
      e?.preventDefault();
      setLanguage(language === 'es' ? 'en' : 'es');
      setTimeout(() => setIsOpen(false), 300);
    }
    // WhatsApp is handled as a link, no need to close FAB
  };

  // Radial fan: 135° arc (45°–135°), radius ~72px so 48px buttons don’t overlap
  const fabPositions: Array<{ x: number; y: number }> = [
    { x: -51, y: -51 }, // Language (upper-left, 135°)
    { x: 0, y: -72 },   // Theme (top, 90°)
    { x: 51, y: -51 },  // WhatsApp (upper-right, 45°)
  ];

  const fabVariants = {
    closed: {
      scale: 0,
      opacity: 0,
      x: 0,
      y: 0,
      filter: 'blur(8px)',
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    open: (index: number) => ({
      scale: 1,
      opacity: 1,
      x: fabPositions[index].x,
      y: fabPositions[index].y,
      filter: 'blur(0px)',
      transition: {
        delay: index * 0.04,
        type: 'spring' as const,
        stiffness: 500,
        damping: 25,
        mass: 0.8,
        velocity: 2,
      },
    }),
  };

  return (
    <div className={styles.fabContainer}>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.a
              href="https://wa.me/573237992985?text=Hola,%20he%20visto%20tu%20web%20y%20quiero%20una%20cotizaci%C3%B3n"
              className={`${styles.fabSecondary} ${styles.whatsapp}`}
              variants={fabVariants}
              initial="closed"
              animate="open"
              exit="closed"
              custom={2}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </motion.a>
            <motion.button
              className={`${styles.fabSecondary} ${styles.theme}`}
              variants={fabVariants}
              initial="closed"
              animate="open"
              exit="closed"
              custom={1}
              onClick={(e) => handleAction('theme', e)}
              aria-label="Cambiar tema"
            >
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </motion.button>
            <motion.button
              className={`${styles.fabSecondary} ${styles.language}`}
              variants={fabVariants}
              initial="closed"
              animate="open"
              exit="closed"
              custom={0}
              onClick={(e) => handleAction('language', e)}
              aria-label="Cambiar idioma"
            >
              {language === 'es' ? 'EN' : 'ES'}
            </motion.button>
          </>
        )}
      </AnimatePresence>
      <motion.button
        className={`${styles.fabMain} ${isOpen ? styles.active : ''}`}
        onClick={toggleFAB}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir acciones rápidas"
        aria-expanded={isOpen}
      >
        <motion.i
          className="fas fa-plus"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1] as const
          }}
        />
      </motion.button>
    </div>
  );
};

export default FAB;

