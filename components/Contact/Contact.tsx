'use client';

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import styles from './Contact.module.css';
import LoadingOverlay from './LoadingOverlay';
import { trackFormStart, trackFormSubmit } from '@/lib/analytics';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

const Contact = (): React.JSX.Element => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    // Track when user starts interacting with form
    trackFormStart('contact_form');
  }, []);

  const showToast = (type: 'success' | 'error', message: string): void => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await addDoc(collection(db, 'contactRequests'), {
        ...formData,
        createdAt: serverTimestamp(),
        source: 'website-contact-section',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
      });

      trackFormSubmit('contact_form', true);
      showToast('success', t('contact-toast-success'));
    } catch (error) {
      console.error('Error guardando contacto en Firebase:', error);
      trackFormSubmit('contact_form', false);
      showToast('error', t('contact-toast-error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className={styles.contact}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="far fa-paper-plane"></i> {t('contact-pill')}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        dangerouslySetInnerHTML={{ __html: t('contact-title') }}
      />

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        dangerouslySetInnerHTML={{ __html: t('contact-subtitle') }}
      />

      <motion.div
        className={styles.urgencyBanner}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-clock"></i>
        <span dangerouslySetInnerHTML={{ __html: t('contact-urgency-banner') }} />
      </motion.div>

      <div className={styles.contactContainer}>
        <motion.form
          id="contact-form"
          className={styles.contactForm}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{t('contact-label-name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={t('contact-placeholder-name')}
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">{t('contact-label-email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t('contact-placeholder-email')}
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">{t('contact-label-phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder={t('contact-placeholder-phone')}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company">{t('contact-label-company')}</label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder={t('contact-placeholder-company')}
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="projectType">{t('contact-label-project-type')}</label>
              <select
                id="projectType"
                name="projectType"
                required
                value={formData.projectType}
                onChange={handleChange}
              >
                <option value="">{t('contact-select-project-type')}</option>
                <option value="landing-page">{t('contact-option-landing-page')}</option>
                <option value="corporativo">{t('contact-option-corporativo')}</option>
                <option value="e-commerce">{t('contact-option-ecommerce')}</option>
                <option value="web-app">{t('contact-option-web-app')}</option>
                <option value="rediseño">{t('contact-option-rediseño')}</option>
                <option value="otro">{t('contact-option-otro')}</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="budget">{t('contact-label-budget')}</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">{t('contact-select-budget')}</option>
                <option value="starter">{t('contact-option-budget-starter')}</option>
                <option value="professional">{t('contact-option-budget-professional')}</option>
                <option value="custom">{t('contact-option-budget-custom')}</option>
                <option value="no-seguro">{t('contact-option-budget-unsure')}</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="timeline">{t('contact-label-timeline')}</label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
            >
              <option value="">{t('contact-select-timeline')}</option>
              <option value="1-2-weeks">{t('contact-option-timeline-1-2-weeks')}</option>
              <option value="3-4-weeks">{t('contact-option-timeline-3-4-weeks')}</option>
              <option value="1-2-months">{t('contact-option-timeline-1-2-months')}</option>
              <option value="flexible">{t('contact-option-timeline-flexible')}</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">{t('contact-label-message')}</label>
            <textarea
              id="message"
              name="message"
              placeholder={t('contact-placeholder-message')}
              rows={5}
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className={styles.ctaButton} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> {t('contact-btn-submitting')}
              </>
            ) : (
              <>
                <i className="fas fa-rocket"></i> {t('contact-btn')}
              </>
            )}
          </button>
        </motion.form>

        <motion.div
          className={styles.contactInfo}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className={styles.infoBox}>
            <h4>{t('contact-why-title')}</h4>
            <ul>
              <li>{t('contact-why-1')}</li>
              <li>{t('contact-why-2')}</li>
              <li>{t('contact-why-3')}</li>
              <li>{t('contact-why-4')}</li>
              <li>{t('contact-why-5')}</li>
            </ul>
          </div>
        </motion.div>
      </div>
      <LoadingOverlay show={isSubmitting} />
      {toast && (
        <div
          className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError
            }`}
        >
          <span className={styles.toastIcon}>
            {toast.type === 'success' ? '✓' : '!'}
          </span>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      )}
    </section>
  );
};

export default Contact;



