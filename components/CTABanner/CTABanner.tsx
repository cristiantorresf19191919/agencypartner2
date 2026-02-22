'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './CTABanner.module.css';

const CTABanner = () => {
  const { language } = useLanguage();

  return (
    <section className={styles.ctaBanner}>
      <div className={styles.gridPattern} aria-hidden="true"></div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className={styles.urgencyBadge}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className={styles.pulsingDot}></span>
          {language === 'es'
            ? 'Cupos limitados este mes'
            : 'Limited spots this month'}
        </motion.div>

        <h2 className={styles.title}>
          {language === 'es' ? (
            <>
              Tu competencia ya tiene presencia digital.
              <br />
              <span className={styles.gradient}>
                ¿Y tú?
              </span>
            </>
          ) : (
            <>
              Your competition already has a digital presence.
              <br />
              <span className={styles.gradient}>
                Do you?
              </span>
            </>
          )}
        </h2>

        <p className={styles.subtitle}>
          {language === 'es'
            ? 'Cada día sin un sitio web profesional es un día de ventas perdidas. Empieza hoy con una propuesta gratuita y sin compromiso.'
            : 'Every day without a professional website is a day of lost sales. Start today with a free, no-obligation proposal.'}
        </p>

        <div className={styles.buttonGroup}>
          <motion.a
            href="#contacto"
            className={styles.ctaPrimary}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                const { trackCTAClick } = require('@/lib/analytics');
                trackCTAClick('mid_page_cta_primary', 'cta_banner');
              }
            }}
          >
            <i className="fas fa-paper-plane"></i>{' '}
            {language === 'es' ? 'Solicitar propuesta gratis' : 'Get a free proposal'}
          </motion.a>
          <motion.a
            href="#servicios"
            className={styles.ctaSecondary}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'es' ? 'Ver planes y precios' : 'See plans & pricing'}
          </motion.a>
        </div>

        <div className={styles.trustSignals}>
          <span>
            <i className="fas fa-shield-alt"></i>{' '}
            {language === 'es' ? 'Sin compromiso' : 'No obligation'}
          </span>
          <span>
            <i className="fas fa-clock"></i>{' '}
            {language === 'es' ? 'Respuesta en <24h' : 'Response in <24h'}
          </span>
          <span>
            <i className="fas fa-lock"></i>{' '}
            {language === 'es' ? '100% confidencial' : '100% confidential'}
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default CTABanner;
