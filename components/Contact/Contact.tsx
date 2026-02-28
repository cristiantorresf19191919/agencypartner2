'use client';

import React, { useState, FormEvent, ChangeEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  projectType: string;
  message: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

interface ProjectTypeOption {
  value: string;
  labelKey: string;
  icon: string;
  gradient: string;
}

const PROJECT_TYPES: ProjectTypeOption[] = [
  { value: 'landing-page', labelKey: 'contact-type-landing', icon: 'fas fa-rocket', gradient: 'linear-gradient(135deg, #35E4B2 0%, #20c997 100%)' },
  { value: 'web-app', labelKey: 'contact-type-webapp', icon: 'fas fa-code', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { value: 'e-commerce', labelKey: 'contact-type-ecommerce', icon: 'fas fa-shopping-cart', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { value: 'corporativo', labelKey: 'contact-type-corporate', icon: 'fas fa-building', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { value: 'rediseño', labelKey: 'contact-type-redesign', icon: 'fas fa-paint-brush', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { value: 'otro', labelKey: 'contact-type-other', icon: 'fas fa-ellipsis-h', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
];

const Contact = (): React.JSX.Element => {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [formStarted, setFormStarted] = useState(false);

  const showToast = (type: 'success' | 'error', message: string): void => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSelectProjectType = useCallback((value: string) => {
    if (!formStarted) {
      trackFormStart('contact_form');
      setFormStarted(true);
    }
    setFormData(prev => ({ ...prev, projectType: value }));
    setStep(2);
  }, [formStarted]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await addDoc(collection(db, 'contactRequests'), {
        ...formData,
        createdAt: serverTimestamp(),
        source: 'website-contact-section-v2',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: '',
      });
      setStep(1);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectedType = PROJECT_TYPES.find(p => p.value === formData.projectType);

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
        dangerouslySetInnerHTML={{ __html: t('contact-subtitle-v2') }}
      />

      {/* Step indicator */}
      <motion.div
        className={styles.stepIndicator}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={`${styles.stepDot} ${step >= 1 ? styles.stepActive : ''}`}>
          <span>1</span>
        </div>
        <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : ''}`} />
        <div className={`${styles.stepDot} ${step >= 2 ? styles.stepActive : ''}`}>
          <span>2</span>
        </div>
      </motion.div>

      <div className={styles.contactContainer}>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              className={styles.stepContent}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3 className={styles.stepTitle}>
                {t('contact-step1-title')}
              </h3>
              <p className={styles.stepDesc}>
                {t('contact-step1-desc')}
              </p>
              <div className={styles.typeGrid}>
                {PROJECT_TYPES.map((type) => (
                  <motion.button
                    key={type.value}
                    className={styles.typeCard}
                    onClick={() => handleSelectProjectType(type.value)}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div
                      className={styles.typeIcon}
                      style={{ background: type.gradient }}
                    >
                      <i className={type.icon}></i>
                    </div>
                    <span className={styles.typeLabel}>{t(type.labelKey)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step-2"
              className={styles.stepContent}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Selected type badge */}
              {selectedType && (
                <motion.div
                  className={styles.selectedBadge}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div
                    className={styles.selectedBadgeIcon}
                    style={{ background: selectedType.gradient }}
                  >
                    <i className={selectedType.icon}></i>
                  </div>
                  <span>{t(selectedType.labelKey)}</span>
                  <button
                    className={styles.changeBadge}
                    onClick={() => setStep(1)}
                    type="button"
                  >
                    {t('contact-change')}
                  </button>
                </motion.div>
              )}

              <form
                id="contact-form"
                className={styles.contactForm}
                onSubmit={handleSubmit}
              >
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
                    autoFocus
                  />
                </div>
                <div className={styles.formRow}>
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
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">
                    {t('contact-label-message')} <span className={styles.optional}>({t('contact-optional')})</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t('contact-placeholder-message')}
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => setStep(1)}
                  >
                    <i className="fas fa-arrow-left"></i> {t('contact-back')}
                  </button>
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
                </div>
              </form>

              {/* Trust signals */}
              <div className={styles.trustSignals}>
                <div className={styles.trustItem}>
                  <i className="fas fa-clock"></i>
                  <span>{t('contact-why-1')}</span>
                </div>
                <div className={styles.trustItem}>
                  <i className="fas fa-shield-alt"></i>
                  <span>{t('contact-why-2')}</span>
                </div>
                <div className={styles.trustItem}>
                  <i className="fas fa-headset"></i>
                  <span>{t('contact-why-3')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LoadingOverlay show={isSubmitting} />
      {toast && (
        <div
          className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
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
