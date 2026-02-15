'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps content with the same scroll-triggered cascade animation as ServicesOverview:
 * only animates when section enters view while scrolling down; uses opacity, y, and blur.
 */
const AnimatedSection = ({ children, className }: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.08, once: true });
  const lastScrollY = useRef(0);
  const scrollDirectionDown = useRef(true);
  const hasAnimated = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY ?? document.documentElement.scrollTop;
      scrollDirectionDown.current = y > lastScrollY.current;
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isInView && !hasAnimated.current && scrollDirectionDown.current) {
      hasAnimated.current = true;
      setShouldAnimate(true);
    }
  }, [isInView]);

  const variants = {
    hidden: {
      opacity: 0,
      y: 48,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 0.61, 0.36, 1],
      },
    },
  };

  return (
    <div ref={sectionRef} className={className}>
      <motion.div
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
        variants={variants}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AnimatedSection;
