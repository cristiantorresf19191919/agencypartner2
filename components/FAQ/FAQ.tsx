'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';
import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
  icon?: string;
}

interface FAQProps {
  faqs?: FAQItem[];
  title?: ReactNode;
}

const FAQ = ({ faqs, title }: FAQProps) => {
  const { language, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate FAQs from translations
  const defaultFaqs = useMemo<FAQItem[]>(() => {
    const icons = [
      'fas fa-clock',
      'fas fa-code',
      'fas fa-server',
      'fas fa-headset',
      'fas fa-edit',
      'fas fa-shield-alt',
      'fas fa-plug',
      'fas fa-mobile-alt',
      'fas fa-credit-card',
      'fas fa-graduation-cap',
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      question: t(`faq-question-${i + 1}`),
      answer: t(`faq-answer-${i + 1}`),
      icon: icons[i],
    }));
  }, [t]);

  const displayFaqs = faqs || defaultFaqs;

  const toggleAccordion = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section id="faq" className={styles.faqSection}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-question-circle"></i> {t('faq-pill')}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        dangerouslySetInnerHTML={!title ? { __html: t('faq-main-title') } : undefined}
      >
        {title}
      </motion.h2>

      <motion.div
        className={styles.faqGrid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {displayFaqs.map((faq, index) => (
          <motion.div
            key={index}
            className={`${styles.faqCard} ${openIndex === index ? styles.open : ''}`}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer}>
                <i className={faq.icon || 'fas fa-question-circle'}></i>
              </div>
              <button
                className={styles.cardTrigger}
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                <h3>{faq.question}</h3>
                <span className={styles.chevron}>
                  <i className={`fas fa-chevron-${openIndex === index ? 'up' : 'down'}`}></i>
                </span>
              </button>
            </div>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  className={styles.cardContent}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className={styles.answerContent}>
                    <div className={styles.answerIcon}>
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={styles.faqContact}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p>{t('faq-contact-text')}</p>
        <a href="#contacto" className={styles.ctaButton}>
          <i className="fas fa-envelope"></i> {t('faq-contact-button')}
        </a>
      </motion.div>
    </section>
  );
};

export default FAQ;
