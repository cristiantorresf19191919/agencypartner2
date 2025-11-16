'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const Hero = () => {
  const particlesRef = useRef(null);
  const statProyectosRef = useRef(null);
  const statSatisfaccionRef = useRef(null);
  const statEntregaRef = useRef(null);

  useEffect(() => {
    // Initialize particles.js
    if (typeof window !== 'undefined' && window.particlesJS && particlesRef.current) {
      window.particlesJS('particles-hero', {
        particles: {
          number: { value: 80 },
          color: { value: '#a06af9' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
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
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
        },
        retina_detect: true,
      });
    }

    // Animate stats
    const animateNumber = (ref, end, suffix = '') => {
      if (!ref.current) return;
      let current = 0;
      const increment = end / 60; // 60 frames
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        ref.current.textContent = Math.floor(current) + suffix;
      }, 1000 / 60);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'stat-proyectos') {
              animateNumber(statProyectosRef, 15, '+');
            } else if (entry.target.id === 'stat-satisfaccion') {
              animateNumber(statSatisfaccionRef, 98, '%');
            } else if (entry.target.id === 'stat-entrega') {
              animateNumber(statEntregaRef, 7, ' días');
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

  const bannerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.6, ease: 'easeOut' },
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
          <i className="fas fa-bolt"></i> Desarrollo Web Profesional
        </motion.div>

        <motion.h1
          className={styles.heroTitle}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Convierte <strong>clics</strong> en clientes en <strong>14&nbsp;días</strong>
        </motion.h1>

        <motion.div
          className={styles.floatingBanner}
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
        >
          <i className="fas fa-route"></i>
          <span>Lleva tu negocio a vender 24/7 desde el día 1</span>
        </motion.div>

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Desarrollo web profesional para tu negocio
        </motion.p>

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
            <div className={styles.heroStatLabel}>Proyectos completados</div>
          </motion.div>
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span className={styles.heroStatValue} id="stat-satisfaccion" ref={statSatisfaccionRef}>
              0
            </span>
            <div className={styles.heroStatLabel}>Satisfacción del cliente</div>
          </motion.div>
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span className={styles.heroStatValue} id="stat-entrega" ref={statEntregaRef}>
              0
            </span>
            <div className={styles.heroStatLabel}>Entrega promedio</div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.heroButtons}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <a href="#contacto" className={styles.ctaButtonPrimary}>
            Empezar mi proyecto
          </a>
          <a href="#servicios" className={styles.ctaButtonSecondary}>
            Ver nuestros servicios
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

