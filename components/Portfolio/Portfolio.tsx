'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Portfolio.module.css';

interface PortfolioStat {
  icon: string;
  value: string;
  label: string;
}

interface PortfolioCase {
  title: string;
  description: string;
  image: string;
  link: string;
  stats: PortfolioStat[];
}

interface PortfolioProps {
  sectionId?: string;
  pillIconClass?: string;
  pillText?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  cases?: PortfolioCase[];
}

const getDefaultCases = (t: (key: string) => string): PortfolioCase[] => [
  {
    title: t('portfolio-auraspa-title'),
    description: t('portfolio-auraspa-desc'),
    image: '/images/portfolio/auraspa.png',
    link: 'https://yakelinbustamante.netlify.app/',
    stats: [
      { icon: 'fas fa-spa', value: '100%', label: t('portfolio-auraspa-stat-1-label') },
      { icon: 'far fa-eye', value: '15K+', label: t('portfolio-auraspa-stat-2-label') },
      { icon: 'fas fa-calendar-check', value: '500+', label: t('portfolio-auraspa-stat-3-label') },
    ],
  },
  {
    title: t('portfolio-solcity-title'),
    description: t('portfolio-solcity-desc'),
    image: '/images/portfolio/solcity.png',
    link: 'https://solaroptimus.netlify.app/',
    stats: [
      { icon: 'fas fa-solar-panel', value: '15+ MW', label: t('portfolio-solcity-stat-1-label') },
      { icon: 'far fa-eye', value: '30K+', label: t('portfolio-solcity-stat-2-label') },
      { icon: 'fas fa-users', value: '500+', label: t('portfolio-solcity-stat-3-label') },
    ],
  },
  {
    title: t('portfolio-yakeline-title'),
    description: t('portfolio-yakeline-desc'),
    image: '/images/portfolio/yakeline.png',
    link: 'https://yakelinbustamante.netlify.app/',
    stats: [
      { icon: 'fas fa-chart-line', value: '10+', label: t('portfolio-yakeline-stat-1-label') },
      { icon: 'far fa-eye', value: '25K+', label: t('portfolio-yakeline-stat-2-label') },
      { icon: 'fas fa-briefcase', value: '200+', label: t('portfolio-yakeline-stat-3-label') },
    ],
  },
];

const Portfolio = ({
  sectionId = 'casos-de-exito',
  pillIconClass = 'fas fa-chart-line',
  pillText,
  title,
  subtitle,
  cases,
}: PortfolioProps): React.JSX.Element => {
  const { t } = useLanguage();

  const defaultPillText = pillText || t('portfolio-pill');
  const defaultTitle = title || (
    <span dangerouslySetInnerHTML={{ __html: t('portfolio-title') }} />
  );
  const defaultSubtitle = subtitle || (
    <span dangerouslySetInnerHTML={{ __html: t('portfolio-subtitle') }} />
  );
  const defaultCases = cases || getDefaultCases(t);

  return (
    <section id={sectionId} className={styles.portfolio}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className={pillIconClass}></i> {defaultPillText}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {defaultTitle}
      </motion.h2>

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {defaultSubtitle}
      </motion.p>

      <motion.div
        className={styles.portfolioGrid}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {defaultCases.map((caseItem, index) => (
          <motion.a
            key={index}
            href={caseItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portfolioItem}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.portfolioImage}>
              <img src={caseItem.image} alt={caseItem.title} />
            </div>
            <div className={styles.portfolioInfo}>
              <h4>{caseItem.title}</h4>
              <p>{caseItem.description}</p>
            </div>
            <div className={styles.portfolioStats}>
              {caseItem.stats.map((stat, idx) => (
                <div key={idx}>
                  <i className={stat.icon}></i>
                  <span>{stat.value}</span>
                  <small>{stat.label}</small>
                </div>
              ))}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default Portfolio;



