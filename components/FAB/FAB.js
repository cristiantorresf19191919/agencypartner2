'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './FAB.module.css';

const FAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action, e) => {
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

  // Radial fan positions (135° arc, counterclockwise from top) – closer to main FAB
  const fabPositions = [
    { x: -85, y: -30 }, // Language (top-left)
    { x: -45, y: -75 }, // Theme (top)
    { x: 15, y: -85 },  // WhatsApp (top-right)
  ];

  const fabVariants = {
    closed: {
      scale: 0.6,
      opacity: 0,
      x: 0,
      y: 0,
      filter: 'blur(4px)',
      transition: {
        duration: 0.18,
        ease: [0.33, 0.0, 0.2, 1],
      },
    },
    open: (index) => ({
      scale: 1,
      opacity: 1,
      x: fabPositions[index].x,
      y: fabPositions[index].y,
      filter: 'blur(0px)',
      transition: {
        delay: index * 0.06,
        type: 'spring',
        stiffness: 7980,
        damping: 24,
        mass: 0.9,
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
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
};

export default FAB;

