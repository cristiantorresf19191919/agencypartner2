'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // Skip page transitions for developer-section routes
  // These pages have their own framer-motion animations which conflict
  // with the wrapper animation, causing black screen on client-side navigation
  const isDeveloperSection = pathname?.includes('/developer-section');

  if (isDeveloperSection) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{ width: '100%', minHeight: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
