'use client';

import { motion } from 'framer-motion';
import styles from './Testimonials.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  metrics: string[];
  rating: number;
}

const Testimonials = () => {
  const { language, t } = useLanguage();

  const testimonials: Testimonial[] = [
    {
      name: language === 'es' ? 'María González' : 'Sarah Johnson',
      role: language === 'es' ? 'CEO' : 'CEO',
      company: language === 'es' ? 'FashionStore.com' : 'Atlanta Boutique',
      content: language === 'es'
        ? 'Incrementamos nuestras ventas en un 23% en solo 2 semanas. El análisis fue preciso y las mejoras funcionaron inmediatamente.'
        : 'We increased our sales by 23% in just 2 weeks. The analysis was spot-on and the improvements worked immediately.',
      metrics: language === 'es' ? ['📈 +23% conversión', '⏱️ 2 semanas'] : ['📈 +23% conversion', '⏱️ 2 weeks'],
      rating: 5,
    },
    {
      name: language === 'es' ? 'Carlos Rodríguez' : 'Michael Chen',
      role: language === 'es' ? 'Fundador' : 'Founder',
      company: language === 'es' ? 'TechGadgets.co' : 'Georgia Tech Solutions',
      content: language === 'es'
        ? 'Transformaron nuestro sitio web. Pasamos de 0.8% a 1.8% de conversión. ROI increíble en solo 30 días.'
        : 'They transformed our website. We went from 0.8% to 1.8% conversion rate. Incredible ROI in just 30 days.',
      metrics: language === 'es' ? ['📈 +125% conversión', '💰 ROI 400%'] : ['📈 +125% conversion', '💰 400% ROI'],
      rating: 5,
    },
    {
      name: language === 'es' ? 'Ana Martínez' : 'Jennifer Williams',
      role: language === 'es' ? 'Marketing Manager' : 'Marketing Director',
      company: language === 'es' ? 'BeautyShop' : 'Savannah Beauty Co.',
      content: language === 'es'
        ? 'El plan Starter fue perfecto para nosotros. Resultados rápidos y profesionales. Definitivamente los recomiendo.'
        : 'The Starter plan was perfect for us. Fast and professional results. I definitely recommend them.',
      metrics: language === 'es' ? ['📈 +18% conversión', '⚡ 1 semana'] : ['📈 +18% conversion', '⚡ 1 week'],
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className={styles.testimonials}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-star"></i> {language === 'es' ? 'Resultados Comprobados' : 'Proven Results'}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {language === 'es' ? (
          <>
            Clientes que <strong>Confían en Nosotros</strong>
          </>
        ) : (
          <>
            Clients Who <strong>Trust Us</strong>
          </>
        )}
      </motion.h2>

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {language === 'es'
          ? 'Resultados reales de empresas que transformaron su presencia digital con nosotros'
          : 'Real results from businesses that transformed their digital presence with us'}
      </motion.p>

      <motion.div
        className={styles.testimonialsContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className={styles.testimonialCard}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.testimonialHeader}>
              <div className={styles.testimonialAvatar}>
                <i className="fas fa-user"></i>
              </div>
              <div className={styles.testimonialInfo}>
                <h4>{testimonial.name}</h4>
                <p>
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
              <div className={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
            </div>
            <div className={styles.testimonialContent}>
              <p>"{testimonial.content}"</p>
            </div>
            <div className={styles.testimonialMetrics}>
              {testimonial.metrics.map((metric, idx) => (
                <span key={idx} className={styles.metric}>
                  {metric}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;

