'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Hero.module.css';

const TYPING_SPEED_MS = 45;
const START_DELAY_MS = 600;

function useTypingEffect(fullText: string, isActive: boolean) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const fullTextRef = useRef(fullText);
  fullTextRef.current = fullText;

  useEffect(() => {
    if (!isActive || !fullText) return;
    setDisplayedLength(0);
    setHasStarted(false);

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, START_DELAY_MS);

    return () => clearTimeout(startTimeout);
  }, [fullText, isActive]);

  useEffect(() => {
    if (!hasStarted || displayedLength >= fullTextRef.current.length) return;

    const id = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        if (next >= fullTextRef.current.length) clearInterval(id);
        return next;
      });
    }, TYPING_SPEED_MS);

    return () => clearInterval(id);
  }, [hasStarted, displayedLength]);

  return fullText.slice(0, displayedLength);
}

interface WindowWithParticlesJS extends Window {
  particlesJS?: (id: string, config: unknown) => void;
}

const Hero = () => {
  const { language, t } = useLanguage();
  const subtitleText = t('hero-subtitle');
  const typedSubtitle = useTypingEffect(subtitleText, true);
  const isTypingComplete = typedSubtitle.length === subtitleText.length;
  const particlesRef = useRef<HTMLDivElement>(null);
  const statProyectosRef = useRef<HTMLSpanElement>(null);
  const statSatisfaccionRef = useRef<HTMLSpanElement>(null);
  const statEntregaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize particles.js
    if (typeof window !== 'undefined' && (window as WindowWithParticlesJS).particlesJS && particlesRef.current) {
      (window as WindowWithParticlesJS).particlesJS!('particles-hero', {
        particles: {
          number: { value: 100 },
          color: { value: '#a06af9' },
          shape: { type: 'circle' },
          opacity: { value: 0.6, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#a06af9',
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
            },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            grab: {
              distance: 150,
              line_linked: {
                opacity: 0.4,
              },
            },
            push: {
              particles_nb: 4,
            },
          },
        },
        retina_detect: true,
      });
    }

    // Animate stats
    const animateNumber = (ref: React.RefObject<HTMLSpanElement | null>, end: number, suffix: string = ''): void => {
      if (!ref.current) return;
      let current = 0;
      const increment = end / 60; // 60 frames
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        if (ref.current) {
          ref.current.textContent = Math.floor(current) + suffix;
        }
      }, 1000 / 60);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'stat-proyectos') {
              animateNumber(statProyectosRef, 3, 'x');
            } else if (entry.target.id === 'stat-satisfaccion') {
              animateNumber(statSatisfaccionRef, 98, '%');
            } else if (entry.target.id === 'stat-entrega') {
              const suffix = language === 'en' ? ' days' : ' días';
              animateNumber(statEntregaRef, 7, suffix);
            }
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    [statProyectosRef, statSatisfaccionRef, statEntregaRef].forEach((ref) => {
      if (ref.current) statsObserver.observe(ref.current);
    });

    return () => {
      statsObserver.disconnect();
    };
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className={styles.hero}>
      <div id="particles-hero" ref={particlesRef} className={styles.particles}></div>

      <div className={styles.heroContent}>
        <motion.div
          className={styles.pill}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <i className="fas fa-bolt"></i> {t('hero-pill')}
        </motion.div>

        <motion.h1
          className={styles.heroTitle}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          dangerouslySetInnerHTML={{ __html: t('hero-title') }}
        />

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          aria-label={subtitleText}
        >
          {typedSubtitle}
          <span
            className={styles.typingCursor}
            aria-hidden
            style={{ opacity: isTypingComplete ? 0 : 1 }}
          />
        </motion.p>

        <motion.div
          className={styles.heroButtons}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a
            href="#contacto"
            className={styles.ctaButtonPrimary}
            onClick={() => {
              if (typeof window !== 'undefined') {
                const { trackCTAClick } = require('@/lib/analytics');
                trackCTAClick('hero_primary', 'hero_section');
              }
            }}
          >
            <i className="fas fa-rocket"></i> {t('cta-start')}
          </a>
          <a
            href="#servicios"
            className={styles.ctaButtonSecondary}
            onClick={() => {
              if (typeof window !== 'undefined') {
                const { trackCTAClick } = require('@/lib/analytics');
                trackCTAClick('hero_secondary', 'hero_section');
              }
            }}
          >
            {t('cta-services')}
          </a>
        </motion.div>

        <motion.div
          className={styles.heroFeatures}
          variants={statsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span className={styles.heroStatValue} id="stat-proyectos" ref={statProyectosRef}>
              0
            </span>
            <div className={styles.heroStatLabel}>{t('stat-proyectos-label')}</div>
          </motion.div>
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span className={styles.heroStatValue} id="stat-satisfaccion" ref={statSatisfaccionRef}>
              0
            </span>
            <div className={styles.heroStatLabel}>{t('stat-satisfaccion-label')}</div>
          </motion.div>
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span className={styles.heroStatValue} id="stat-entrega" ref={statEntregaRef}>
              0
            </span>
            <div className={styles.heroStatLabel}>{t('stat-entrega-label')}</div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.socialProof}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className={styles.socialProofLabel}>{t('social-proof')}</span>
          <div className={styles.socialProofLogos}>
            <span className={styles.socialProofItem}><i className="fas fa-store"></i> E-commerce</span>
            <span className={styles.socialProofItem}><i className="fas fa-briefcase-medical"></i> Salud</span>
            <span className={styles.socialProofItem}><i className="fas fa-graduation-cap"></i> EdTech</span>
            <span className={styles.socialProofItem}><i className="fas fa-utensils"></i> Restaurantes</span>
            <span className={styles.socialProofItem}><i className="fas fa-building"></i> SaaS</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

