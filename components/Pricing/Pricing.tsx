'use client';

import { motion } from 'framer-motion';
import styles from './Pricing.module.css';
import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

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

const getDefaultPlans = (t: (key: string) => string): Plan[] => [
  {
    name: t('pricing-starter-title'),
    icon: 'bi bi-rocket',
    iconColor: 'purple',
    tag: t('pricing-starter-tag'),
    price: t('pricing-starter-price'),
    oldPrice: t('pricing-starter-old-price'),
    currency: t('pricing-starter-currency'),
    features: [
      t('pricing-starter-feature-1'),
      t('pricing-starter-feature-2'),
      t('pricing-starter-feature-3'),
      t('pricing-starter-feature-4'),
      t('pricing-starter-feature-5'),
      t('pricing-starter-feature-6'),
      t('pricing-starter-feature-7'),
      t('pricing-starter-feature-8'),
    ],
    buttonText: t('pricing-starter-button'),
    buttonGradient: 'purple',
  },
  {
    name: t('pricing-professional-title'),
    icon: 'bi bi-briefcase',
    iconColor: 'pink',
    tag: t('pricing-professional-tag'),
    price: t('pricing-professional-price'),
    oldPrice: t('pricing-professional-old-price'),
    currency: t('pricing-professional-currency'),
    featured: true,
    features: [
      t('pricing-professional-feature-1'),
      t('pricing-professional-feature-2'),
      t('pricing-professional-feature-3'),
      t('pricing-professional-feature-4'),
      t('pricing-professional-feature-5'),
      t('pricing-professional-feature-6'),
      t('pricing-professional-feature-7'),
      t('pricing-professional-feature-8'),
      t('pricing-professional-feature-9'),
      t('pricing-professional-feature-10'),
    ],
    buttonText: t('pricing-professional-button'),
    buttonGradient: 'pink',
  },
  {
    name: t('pricing-enterprise-title'),
    icon: 'bi bi-gear',
    iconColor: 'teal',
    tag: t('pricing-enterprise-tag'),
    price: t('pricing-enterprise-price'),
    currency: t('pricing-enterprise-currency'),
    features: [
      t('pricing-enterprise-feature-1'),
      t('pricing-enterprise-feature-2'),
      t('pricing-enterprise-feature-3'),
      t('pricing-enterprise-feature-4'),
    ],
    buttonText: t('pricing-enterprise-button'),
    buttonGradient: 'teal',
  },
];

const Pricing = ({
  sectionId = 'servicios',
  pillIconClass = 'far fa-star',
  pillText,
  title,
  subtitle,
  plans,
  consultText,
  consultCtaText,
}: PricingProps) => {
  const { language, t } = useLanguage();
  
  const defaultPlans = getDefaultPlans(t);
  
  const defaultPillText = pillText || t('pricing-pill');
  const defaultTitle = title || t('pricing-title');
  const defaultSubtitle = subtitle || t('pricing-subtitle');
  const defaultConsultText = consultText || t('pricing-consult-text');
  const defaultConsultCtaText = consultCtaText || t('pricing-consult-button');
  const finalPlans = plans || defaultPlans;
  return (
    <section id={sectionId} className={styles.features}>
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
        dangerouslySetInnerHTML={typeof defaultTitle === 'string' ? { __html: defaultTitle } : undefined}
      >
        {typeof defaultTitle !== 'string' ? defaultTitle : null}
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
        className={styles.pricingCards}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
      >
        {finalPlans.map((plan, index) => (
          <motion.div
            key={index}
            className={`${styles.pricingCard} ${plan.featured ? styles.featured : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.cardHeader}>
              {index === 0 && (
                <div className={styles.limitedOffer}>
                  <i className="fas fa-fire"></i> {language === 'es' ? 'Oferta Limitada' : 'Limited Offer'}
                </div>
              )}
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
            <div className={styles.cardFooter}>
              <div className={styles.priceContainer}>
                {plan.oldPrice && (
                  <>
                    <span><del>{plan.oldPrice}</del></span>
                    <br />
                  </>
                )}
                <strong>{plan.price}</strong>
                {plan.currency ? <span className={styles.currency}> {plan.currency}</span> : null}
              </div>
              <a
                href="#contacto"
                className={`${styles.ctaButton} ${styles[plan.buttonGradient]}`}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const { trackCTAClick, trackPricingView } = require('@/lib/analytics');
                    trackCTAClick(`pricing_${plan.name.toLowerCase()}`, 'pricing_section');
                    trackPricingView(plan.name);
                  }
                }}
              >
                <i className="fas fa-arrow-right" aria-hidden /> {plan.buttonText}
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={styles.consultCta}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>{defaultConsultText}</p>
        <a href="#contacto" className={styles.ctaButtonSecondary}>
          {defaultConsultCtaText}
        </a>
      </motion.div>
    </section>
  );
};

export default Pricing;

