'use client';

import { motion } from 'framer-motion';
import styles from './Pricing.module.css';
import { ReactNode } from 'react';

interface Plan {
  name: string;
  icon: string;
  iconColor: string;
  tag: string;
  price: string;
  oldPrice?: string;
  currency: string;
  featured?: boolean;
  features: string[];
  buttonText: string;
  buttonGradient: string;
}

interface PricingProps {
  sectionId?: string;
  pillIconClass?: string;
  pillText?: string;
  title?: ReactNode;
  subtitle?: string;
  plans?: Plan[];
  consultText?: string;
  consultCtaText?: string;
}

const defaultPlans: Plan[] = [
  {
    name: 'Starter',
    icon: 'bi bi-rocket',
    iconColor: 'purple',
    tag: 'Perfecto para landing pages y sitios web básicos',
    price: '$600,000',
    oldPrice: '$800,000',
    currency: 'COP ($150 USD)',
    features: [
      'Hasta 5 páginas',
      'Diseño responsivo',
      'SEO básico',
      'Formulario de contacto',
      'Hosting por 1 año',
      'Soporte por 30 días',
      '1 revisión incluida',
      'Entrega en 7-10 días',
    ],
    buttonText: 'Comenzar proyecto',
    buttonGradient: 'purple',
  },
  {
    name: 'Professional',
    icon: 'bi bi-briefcase',
    iconColor: 'pink',
    tag: 'Ideal para sitios corporativos y pequeñas aplicaciones',
    price: '$3,200,000',
    oldPrice: '$4,000,000',
    currency: 'COP ($800 USD)',
    featured: true,
    features: [
      'Hasta 15 páginas',
      'CMS personalizado',
      'SEO avanzado',
      'Múltiples formularios',
      'Blog integrado',
      'Análisis y métricas',
      'Hosting por 1 año',
      'Soporte por 3 meses',
      '3 revisiones incluidas',
      'Entrega en 14-21 días',
    ],
    buttonText: 'Comenzar proyecto',
    buttonGradient: 'pink',
  },
  {
    name: '¿Necesitas algo más complejo?',
    icon: 'bi bi-gear',
    iconColor: 'teal',
    tag: 'Aplicaciones web, sistemas empresariales, integraciones avanzadas',
    price: 'Desde $8,000,000',
    currency: 'COP ($2,000 USD)',
    features: [
      'Aplicaciones web complejas',
      'Sistemas empresariales',
      'Integraciones avanzadas',
    ],
    buttonText: 'Solicitar cotización personalizada',
    buttonGradient: 'teal',
  },
];

const Pricing = ({
  sectionId = 'servicios',
  pillIconClass = 'far fa-star',
  pillText = 'Nuestras Soluciones Digitales',
  title = (
    <>
      Precios <strong>Transparentes</strong>
    </>
  ),
  subtitle = 'Planes flexibles diseñados para adaptarse a proyectos de cualquier tamaño. Precios en pesos colombianos, sin costos ocultos.',
  plans = defaultPlans,
  consultText = '¿No estás seguro cuál es la mejor opción para tu negocio?',
  consultCtaText = 'Recibir Asesoría Gratuita',
}: PricingProps) => {
  return (
    <section id={sectionId} className={styles.features}>
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
        className={styles.pricingCards}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`${styles.pricingCard} ${plan.featured ? styles.featured : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: plan.featured ? 1.05 : 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles[plan.iconColor]}`}>
                <i className={plan.icon}></i>
              </div>
              <h3>{plan.name}</h3>
              <span className={styles.tag}>{plan.tag}</span>
            </div>
            <ul className={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <i className="fas fa-check"></i> {feature}
                </li>
              ))}
            </ul>
            <div className={styles.priceContainer}>
              {plan.oldPrice && (
                <span>
                  <del>{plan.oldPrice}</del>
                </span>
              )}
              <br />
              <strong>{plan.price}</strong>{' '}
              <span className={styles.currency}>{plan.currency}</span>
            </div>
            <a
              href="#contacto"
              className={`${styles.ctaButton} ${styles[plan.buttonGradient]}`}
            >
              {plan.buttonText}
            </a>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={styles.consultCta}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>{consultText}</p>
        <a href="#contacto" className={styles.ctaButtonSecondary}>
          {consultCtaText}
        </a>
      </motion.div>
    </section>
  );
};

export default Pricing;

