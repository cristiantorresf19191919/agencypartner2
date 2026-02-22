'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './ResultsBanner.module.css';

interface StatItem {
  icon: string;
  end: number;
  suffix: string;
  label: string;
}

const ResultsBanner = () => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);

  const stats: StatItem[] = [
    {
      icon: 'fas fa-laptop-code',
      end: 50,
      suffix: '+',
      label: language === 'es' ? 'Proyectos entregados' : 'Projects delivered',
    },
    {
      icon: 'fas fa-handshake',
      end: 30,
      suffix: '+',
      label: language === 'es' ? 'Clientes satisfechos' : 'Happy clients',
    },
    {
      icon: 'fas fa-globe-americas',
      end: 5,
      suffix: '',
      label: language === 'es' ? 'Países atendidos' : 'Countries served',
    },
    {
      icon: 'fas fa-server',
      end: 99,
      suffix: '.9%',
      label: language === 'es' ? 'Uptime garantizado' : 'Guaranteed uptime',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          stats.forEach((stat, idx) => {
            let current = 0;
            const increment = stat.end / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.end) {
                current = stat.end;
                clearInterval(timer);
              }
              setCounters((prev) => {
                const next = [...prev];
                next[idx] = Math.floor(current);
                return next;
              });
            }, 1000 / 50);
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className={styles.resultsBanner}>
      <div className={styles.bgOrbs} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
        <div className={`${styles.orb} ${styles.orb3}`}></div>
      </div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className={styles.title}>
          {language === 'es' ? (
            <>
              Resultados que <span className={styles.highlight}>hablan por sí solos</span>
            </>
          ) : (
            <>
              Results that <span className={styles.highlight}>speak for themselves</span>
            </>
          )}
        </h2>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statItem}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.statIcon}>
                <i className={stat.icon}></i>
              </div>
              <div className={styles.statValue}>
                {counters[index]}
                {stat.suffix}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ResultsBanner;
