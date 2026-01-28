'use client';

import { motion } from 'framer-motion';
import styles from './ServicesOverview.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

interface Service {
  title: string;
  icon: string;
  gradient: string;
  description: string;
  features: string[];
}

const ServicesOverview = () => {
  const { language, t } = useLanguage();

  const services: Service[] = [
    {
      title: t('service-landing-title'),
      icon: 'fas fa-globe',
      gradient: 'green',
      description: t('service-landing-desc'),
      features: [
        t('service-landing-feature-1'),
        t('service-landing-feature-2'),
        t('service-landing-feature-3'),
        t('service-landing-feature-4'),
      ],
    },
    {
      title: t('service-apps-title'),
      icon: 'fas fa-code',
      gradient: 'blue',
      description: t('service-apps-desc'),
      features: [
        t('service-apps-feature-1'),
        t('service-apps-feature-2'),
        t('service-apps-feature-3'),
        t('service-apps-feature-4'),
      ],
    },
    {
      title: t('service-corporate-title'),
      icon: 'fas fa-mobile-alt',
      gradient: 'purple',
      description: t('service-corporate-desc'),
      features: [
        t('service-corporate-feature-1'),
        t('service-corporate-feature-2'),
        t('service-corporate-feature-3'),
        t('service-corporate-feature-4'),
      ],
    },
    {
      title: t('service-ecommerce-title'),
      icon: 'fas fa-bolt',
      gradient: 'orange',
      description: t('service-ecommerce-desc'),
      features: [
        t('service-ecommerce-feature-1'),
        t('service-ecommerce-feature-2'),
        t('service-ecommerce-feature-3'),
        t('service-ecommerce-feature-4'),
      ],
    },
    {
      title: t('service-saas-title'),
      icon: 'fas fa-users',
      gradient: 'teal',
      description: t('service-saas-desc'),
      features: [
        t('service-saas-feature-1'),
        t('service-saas-feature-2'),
        t('service-saas-feature-3'),
        t('service-saas-feature-4'),
      ],
    },
    {
      title: t('service-maintenance-title'),
      icon: 'fas fa-shield-alt',
      gradient: 'pink',
      description: t('service-maintenance-desc'),
      features: [
        t('service-maintenance-feature-1'),
        t('service-maintenance-feature-2'),
        t('service-maintenance-feature-3'),
        t('service-maintenance-feature-4'),
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="servicios-overview" className={styles.services}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-cubes"></i> {t('services-pill')}
      </motion.div>
      
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        dangerouslySetInnerHTML={{ __html: t('services-title') }}
      />
      
      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t('services-subtitle')}
      </motion.p>

      <motion.div
        className={styles.cardsContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            className={`${styles.serviceCard} ${styles[service.gradient]}`}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.cardIcon} aria-hidden="true" role="presentation">
              <i className={service.icon}></i>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <ul className={styles.featuresList}>
              {service.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ServicesOverview;

