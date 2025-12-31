'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

interface WindowWithParticlesJS extends Window {
  particlesJS?: (id: string, config: unknown) => void;
}

const AgentsHero = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const statResolucionRef = useRef<HTMLSpanElement>(null);
  const statDisponibilidadRef = useRef<HTMLSpanElement>(null);
  const statProcesosRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize particles.js
    if (typeof window !== 'undefined' && (window as WindowWithParticlesJS).particlesJS && particlesRef.current) {
      (window as WindowWithParticlesJS).particlesJS!('particles-hero-agentes', {
        particles: {
          number: { value: 80 },
          color: { value: '#a06af9' },
          shape: { type: 'circle' },
          opacity: { value: 0.4, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 130,
            color: '#ffffff',
            opacity: 0.25,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: false },
            resize: true,
          },
          modes: {
            repulse: { distance: 90, duration: 0.4 },
          },
        },
        retina_detect: true,
      });
    }

    const animateNumber = (ref: React.RefObject<HTMLSpanElement>, end: number, suffix: string = ''): void => {
      if (!ref.current) return;
      let current = 0;
      const increment = end / 60;
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
            if (entry.target.id === 'stat-resolucion') {
              animateNumber(statResolucionRef, 90, '%');
            } else if (entry.target.id === 'stat-disponibilidad') {
              animateNumber(statDisponibilidadRef, 24, '/7');
            } else if (entry.target.id === 'stat-procesos') {
              animateNumber(statProcesosRef, 50, '+');
            }
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    [statResolucionRef, statDisponibilidadRef, statProcesosRef].forEach((ref) => {
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
      <div id="particles-hero-agentes" ref={particlesRef} className={styles.particles}></div>

      <div className={styles.heroContent}>
        <motion.div
          className={styles.pill}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <i className="fas fa-robot"></i> Agentes Virtuales Inteligentes
        </motion.div>

        <motion.h1
          className={styles.heroTitle}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Automatiza tu negocio con <strong>agentes virtuales</strong> que atienden, venden y
          resuelven <strong>24/7</strong>
        </motion.h1>

        <motion.div
          className={styles.floatingBanner}
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
        >
          <i className="fas fa-brain"></i>
          <span>Soluciones de IA para atención al cliente, ventas y procesos internos</span>
        </motion.div>

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Implementamos agentes virtuales entrenados con la información de tu negocio para que
          respondan, automaticen y escalen tu operación sin sumar más horas humanas.
        </motion.p>

        <motion.div
          className={styles.heroFeatures}
          variants={statsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span
              className={styles.heroStatValue}
              id="stat-resolucion"
              ref={statResolucionRef}
            >
              0
            </span>
            <div className={styles.heroStatLabel}>Tasa de resolución</div>
          </motion.div>
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span
              className={styles.heroStatValue}
              id="stat-disponibilidad"
              ref={statDisponibilidadRef}
            >
              0
            </span>
            <div className={styles.heroStatLabel}>Disponibilidad</div>
          </motion.div>
          <motion.div className={styles.heroStat} variants={statVariants}>
            <span
              className={styles.heroStatValue}
              id="stat-procesos"
              ref={statProcesosRef}
            >
              0
            </span>
            <div className={styles.heroStatLabel}>Procesos automatizados</div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.heroButtons}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <a href="#contacto" className={styles.ctaButtonPrimary}>
            Crear mi agente virtual
          </a>
          <a href="#servicios-agentes" className={styles.ctaButtonSecondary}>
            Ver soluciones
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AgentsHero;

