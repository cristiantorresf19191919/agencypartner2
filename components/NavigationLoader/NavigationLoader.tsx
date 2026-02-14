'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useNavigationLoader } from '@/contexts/NavigationLoaderContext';
import ShapeMorphLoader from './ShapeMorphLoader';
import styles from './NavigationLoader.module.css';

const statusLines = [
  'Preparing Developer Hub...',
  'Loading resources...',
  'Fetching components...',
  'Almost ready...',
];

const NavigationLoader = () => {
  const { isLoading, hideLoader } = useNavigationLoader();
  const router = useRouter();
  const [statusIndex, setStatusIndex] = useState(0);

  // Rotate status messages every 700ms
  useEffect(() => {
    if (!isLoading) {
      setStatusIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusLines.length);
    }, 700);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleCancel = useCallback(() => {
    hideLoader();
    router.back();
  }, [hideLoader, router]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="assertive"
        >
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <ShapeMorphLoader size={100} />

            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                className={styles.message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {statusLines[statusIndex]}
              </motion.p>
            </AnimatePresence>

            <div className={styles.shimmerBar}>
              <div className={styles.shimmerFill} />
            </div>

            <button
              className={styles.cancelButton}
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationLoader;
