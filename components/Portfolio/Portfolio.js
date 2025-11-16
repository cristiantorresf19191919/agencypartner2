'use client';

import { motion } from 'framer-motion';
import styles from './Portfolio.module.css';

const defaultCases = [
  {
    title: 'RestauranTech',
    description: 'Landing page para startup de delivery que aumentó conversiones en 340%',
    image:
      'https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max',
    stats: [
      { icon: 'fas fa-arrow-up-trending', value: '+340%', label: 'Conversión' },
      { icon: 'far fa-eye', value: '50K', label: 'Visitas' },
      { icon: 'fas fa-dollar-sign', value: '$25K', label: 'Ingresos' },
    ],
  },
  {
    title: 'FitnessPro',
    description: 'Tienda online de suplementos deportivos con sistema de suscripciones',
    image:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max',
    stats: [
      { icon: 'fas fa-arrow-up-trending', value: '+280%', label: 'Conversión' },
      { icon: 'far fa-eye', value: '100K', label: 'Visitas' },
      { icon: 'fas fa-dollar-sign', value: '$45K', label: 'Ingresos' },
    ],
  },
  {
    title: 'EduTech Solutions',
    description: 'Plataforma educativa que conecta estudiantes con tutores especializados',
    image: 'https://epicwebsol.com/wp-content/uploads/2013/09/co03.jpg',
    stats: [
      { icon: 'fas fa-arrow-up-trending', value: '+220%', label: 'Conversión' },
      { icon: 'far fa-eye', value: '75K', label: 'Visitas' },
      { icon: 'fas fa-dollar-sign', value: '$35K', label: 'Ingresos' },
    ],
  },
];

const Portfolio = ({
  sectionId = 'casos-de-exito',
  pillIconClass = 'fas fa-chart-line',
  pillText = 'Casos de Éxito',
  title = (
    <>
      Lo que hemos hecho para
      <br />
      <strong>otros negocios como el tuyo</strong>
    </>
  ),
  subtitle = (
    <>
      Más de <strong>120 casos de éxito</strong> respaldan nuestro enfoque en{' '}
      <strong>resultados reales</strong> y medibles.
    </>
  ),
  cases = defaultCases,
}) => {
  return (
    <section id={sectionId} className={styles.portfolio}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className={pillIconClass}></i> {pillText}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {subtitle}
      </motion.p>

      <motion.div
        className={styles.portfolioGrid}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {cases.map((caseItem, index) => (
          <motion.div
            key={index}
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Portfolio;

