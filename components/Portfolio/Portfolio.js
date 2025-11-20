'use client';

import { motion } from 'framer-motion';
import styles from './Portfolio.module.css';

const defaultCases = [
  {
    title: 'AuraSpa',
    description: 'Plataforma web para reserva de servicios terapéuticos a domicilio, con sistema de reservas intuitivo y profesional',
    image: '/images/portfolio/auraspa.png',
    link: 'https://yakelinbustamante.netlify.app/',
    stats: [
      { icon: 'fas fa-spa', value: '100%', label: 'Satisfacción' },
      { icon: 'far fa-eye', value: '15K+', label: 'Visitas' },
      { icon: 'fas fa-calendar-check', value: '500+', label: 'Reservas' },
    ],
  },
  {
    title: 'SolCity',
    description: 'Sistemas solares fotovoltaicos a medida para hogares y empresas en Colombia. Calculadora de ahorro y cotizaciones en línea',
    image: '/images/portfolio/solcity.png',
    link: 'https://solaroptimus.netlify.app/',
    stats: [
      { icon: 'fas fa-solar-panel', value: '15+ MW', label: 'Instalados' },
      { icon: 'far fa-eye', value: '30K+', label: 'Visitas' },
      { icon: 'fas fa-users', value: '500+', label: 'Clientes' },
    ],
  },
  {
    title: 'Yakeline Contadora',
    description: 'Asesoría contable y tributaria profesional. Optimización fiscal, manejo de casos DIAN y protección patrimonial para empresas',
    image: '/images/portfolio/yakeline.png',
    link: 'https://yakelinbustamante.netlify.app/',
    stats: [
      { icon: 'fas fa-chart-line', value: '10+', label: 'Años exp.' },
      { icon: 'far fa-eye', value: '25K+', label: 'Visitas' },
      { icon: 'fas fa-briefcase', value: '200+', label: 'Clientes' },
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

