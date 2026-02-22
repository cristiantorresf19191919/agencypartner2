'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useInView, animate, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Hero.module.css';

/* ─── helpers ──────────────────────────────────────── */

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
    const startTimeout = setTimeout(() => setHasStarted(true), START_DELAY_MS);
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

function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const handler = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [x, y]);
  return { x, y };
}

/* ─── Magnetic wrapper ─────────────────────────────── */

function MagneticButton({ children, className, href, onClick }: {
  children: React.ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 15 });
  const springY = useSpring(y, { stiffness: 250, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.a>
  );
}

/* ─── Floating Orbs (replaces particles.js) ────────── */

const ORB_CONFIGS = [
  { size: 420, x: '10%',  y: '15%', color: 'rgba(160,106,249,0.25)', delay: 0,   duration: 18 },
  { size: 340, x: '75%',  y: '20%', color: 'rgba(53,228,178,0.18)',  delay: 2,   duration: 22 },
  { size: 280, x: '55%',  y: '65%', color: 'rgba(255,105,180,0.15)', delay: 4,   duration: 20 },
  { size: 200, x: '20%',  y: '75%', color: 'rgba(53,228,178,0.12)',  delay: 1,   duration: 16 },
  { size: 160, x: '85%',  y: '70%', color: 'rgba(160,106,249,0.15)', delay: 3,   duration: 24 },
];

function FloatingOrbs() {
  const mouse = useMousePosition();
  return (
    <div className={styles.orbContainer} aria-hidden>
      {ORB_CONFIGS.map((orb, i) => {
        const parallaxFactor = 0.02 + i * 0.008;
        return (
          <motion.div
            key={i}
            className={styles.orb}
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              x: useTransform(mouse.x, (v) => (v - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * parallaxFactor),
              y: useTransform(mouse.y, (v) => (v - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * parallaxFactor),
            }}
            animate={{
              scale: [1, 1.2, 1, 0.9, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Grid background ──────────────────────────────── */

function GridBackground() {
  return (
    <div className={styles.gridBg} aria-hidden>
      <div className={styles.gridLines} />
      <motion.div
        className={styles.gridGlow}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ─── Animated counter ─────────────────────────────── */

function AnimatedCounter({ end, suffix, duration = 2 }: { end: number; suffix: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated || !ref.current) return;
    setHasAnimated(true);
    const controls = animate(0, end, {
      duration,
      ease: [0.34, 1.56, 0.64, 1], // overshoot spring-like
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.floor(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [isInView, end, suffix, duration, hasAnimated]);

  return <span ref={ref} className={styles.heroStatValue}>0</span>;
}

/* ─── Split text word reveal ───────────────────────── */

function SplitTextReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{
              hidden: { y: '110%', rotateX: 40, opacity: 0 },
              visible: {
                y: '0%',
                rotateX: 0,
                opacity: 1,
                transition: { type: 'spring', stiffness: 100, damping: 12 },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ─── Stretchy stat card ───────────────────────────── */

function StretchyStatCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      className={styles.heroStat}
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 10,
        delay,
      }}
      whileHover={{
        scale: 1.08,
        y: -6,
        transition: { type: 'spring', stiffness: 400, damping: 15 },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main Hero ────────────────────────────────────── */

const Hero = () => {
  const { language, t } = useLanguage();
  const subtitleText = t('hero-subtitle');
  const typedSubtitle = useTypingEffect(subtitleText, true);
  const isTypingComplete = typedSubtitle.length === subtitleText.length;
  const heroRef = useRef<HTMLElement>(null);
  const [mouseGlow, setMouseGlow] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMouseGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      onMouseMove={handleMouseMove}
    >
      {/* Gradient mesh background */}
      <div className={styles.meshGradient} aria-hidden />
      <GridBackground />
      <FloatingOrbs />

      {/* Mouse-following glow */}
      <div
        className={styles.mouseGlow}
        style={{ left: mouseGlow.x, top: mouseGlow.y }}
        aria-hidden
      />

      {/* Noise texture overlay */}
      <div className={styles.noiseOverlay} aria-hidden />

      <motion.div
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Pill badge */}
        <motion.div variants={itemVariants}>
          <motion.div
            className={styles.pill}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(53,228,178,0.3)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <span className={styles.pillDot} />
            <span>{t('hero-pill')}</span>
          </motion.div>
        </motion.div>

        {/* Title with word-by-word reveal */}
        <motion.div variants={itemVariants}>
          <h1 className={styles.heroTitle}>
            <SplitTextReveal
              text={language === 'en' ? 'Turn clicks into clients in 14 days' : 'Convierte clics en clientes en 14 días'}
              delay={0.4}
            />
          </h1>
        </motion.div>

        {/* Typing subtitle */}
        <motion.p
          className={styles.heroSubtitle}
          variants={itemVariants}
          aria-label={subtitleText}
        >
          {typedSubtitle}
          <span
            className={styles.typingCursor}
            aria-hidden
            style={{ opacity: isTypingComplete ? 0 : 1 }}
          />
        </motion.p>

        {/* Magnetic CTA buttons */}
        <motion.div className={styles.heroButtons} variants={itemVariants}>
          <MagneticButton
            href="#contacto"
            className={styles.ctaButtonPrimary}
            onClick={() => {
              if (typeof window !== 'undefined') {
                const { trackCTAClick } = require('@/lib/analytics');
                trackCTAClick('hero_primary', 'hero_section');
              }
            }}
          >
            <span className={styles.ctaIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </span>
            <span>{t('cta-start')}</span>
            <motion.span
              className={styles.ctaShine}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          </MagneticButton>

          <MagneticButton
            href="#servicios"
            className={styles.ctaButtonSecondary}
            onClick={() => {
              if (typeof window !== 'undefined') {
                const { trackCTAClick } = require('@/lib/analytics');
                trackCTAClick('hero_secondary', 'hero_section');
              }
            }}
          >
            <span>{t('cta-services')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </MagneticButton>
        </motion.div>

        {/* Stats with elastic counters */}
        <motion.div className={styles.heroFeatures} variants={itemVariants}>
          <StretchyStatCard delay={0.6}>
            <AnimatedCounter end={3} suffix="x" />
            <div className={styles.heroStatLabel}>{t('stat-proyectos-label')}</div>
          </StretchyStatCard>

          <div className={styles.statDivider} />

          <StretchyStatCard delay={0.8}>
            <AnimatedCounter end={98} suffix="%" />
            <div className={styles.heroStatLabel}>{t('stat-satisfaccion-label')}</div>
          </StretchyStatCard>

          <div className={styles.statDivider} />

          <StretchyStatCard delay={1.0}>
            <AnimatedCounter
              end={7}
              suffix={language === 'en' ? ' days' : ' días'}
            />
            <div className={styles.heroStatLabel}>{t('stat-entrega-label')}</div>
          </StretchyStatCard>
        </motion.div>

        {/* Social proof */}
        <motion.div className={styles.socialProof} variants={itemVariants}>
          <span className={styles.socialProofLabel}>{t('social-proof')}</span>
          <div className={styles.socialProofLogos}>
            {[
              { icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z', label: 'E-commerce' },
              { icon: 'M22 12h-4l-3 9L9 3l-3 9H2', label: 'Salud' },
              { icon: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5', label: 'EdTech' },
              { icon: 'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3', label: 'Restaurantes' },
              { icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', label: 'SaaS' },
            ].map((item, i) => (
              <motion.span
                key={item.label}
                className={styles.socialProofItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -2, color: '#35E4B2' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
