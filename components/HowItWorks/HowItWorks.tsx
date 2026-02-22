'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './HowItWorks.module.css';

interface Step {
  icon: string;
  number: string;
  title: string;
  description: string;
  color: string;
}

const HowItWorks = () => {
  const { language } = useLanguage();

  const steps: Step[] = [
    {
      icon: 'fas fa-comments',
      number: '01',
      title: language === 'es' ? 'Descubrimiento' : 'Discovery',
      description:
        language === 'es'
          ? 'Entendemos tu negocio, objetivos y audiencia. Definimos alcance, funcionalidades y cronograma.'
          : 'We understand your business, goals, and audience. We define scope, features, and timeline.',
      color: 'purple',
    },
    {
      icon: 'fas fa-pencil-ruler',
      number: '02',
      title: language === 'es' ? 'Diseño' : 'Design',
      description:
        language === 'es'
          ? 'Creamos wireframes y diseños UI/UX centrados en conversión. Tú apruebas antes de desarrollar.'
          : 'We create conversion-focused wireframes and UI/UX designs. You approve before development.',
      color: 'pink',
    },
    {
      icon: 'fas fa-code',
      number: '03',
      title: language === 'es' ? 'Desarrollo' : 'Development',
      description:
        language === 'es'
          ? 'Construimos tu proyecto con tecnología moderna. Te mostramos avances semanales y recibes feedback en tiempo real.'
          : 'We build your project with modern tech. Weekly progress updates and real-time feedback.',
      color: 'teal',
    },
    {
      icon: 'fas fa-rocket',
      number: '04',
      title: language === 'es' ? 'Lanzamiento' : 'Launch',
      description:
        language === 'es'
          ? 'Publicamos tu sitio optimizado para SEO y rendimiento. Incluimos soporte post-lanzamiento y capacitación.'
          : 'We deploy your SEO and performance-optimized site. Includes post-launch support and training.',
      color: 'orange',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  return (
    <section className={styles.howItWorks}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <i className="fas fa-route"></i>{' '}
        {language === 'es' ? 'Proceso Simple' : 'Simple Process'}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {language === 'es' ? (
          <>
            Cómo <strong>trabajamos</strong>
          </>
        ) : (
          <>
            How we <strong>work</strong>
          </>
        )}
      </motion.h2>

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {language === 'es'
          ? 'De la idea al lanzamiento en 4 pasos claros. Sin sorpresas, sin letra pequeña.'
          : 'From idea to launch in 4 clear steps. No surprises, no fine print.'}
      </motion.p>

      <motion.div
        className={styles.stepsGrid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`${styles.stepCard} ${styles[step.color]}`}
            variants={stepVariants}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
          >
            <div className={styles.stepNumber}>{step.number}</div>
            <div className={styles.stepIconWrapper}>
              <i className={step.icon}></i>
            </div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
            {index < steps.length - 1 && (
              <div className={styles.connector} aria-hidden="true">
                <i className="fas fa-chevron-right"></i>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorks;
