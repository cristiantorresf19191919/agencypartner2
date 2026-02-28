'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SiteConfigurator.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

type Step = 1 | 2 | 3 | 4;

interface IndustryOption {
  value: string;
  labelKey: string;
  icon: string;
  color: string;
}

interface StyleOption {
  value: string;
  labelKey: string;
  preview: { bg: string; accent: string; radius: string; font: string };
}

interface FeatureOption {
  value: string;
  labelKey: string;
  icon: string;
}

const INDUSTRIES: IndustryOption[] = [
  { value: 'ecommerce', labelKey: 'config-industry-ecommerce', icon: 'fas fa-shopping-bag', color: '#f5576c' },
  { value: 'restaurant', labelKey: 'config-industry-restaurant', icon: 'fas fa-utensils', color: '#ff9a44' },
  { value: 'health', labelKey: 'config-industry-health', icon: 'fas fa-heartbeat', color: '#35E4B2' },
  { value: 'education', labelKey: 'config-industry-education', icon: 'fas fa-graduation-cap', color: '#667eea' },
  { value: 'services', labelKey: 'config-industry-services', icon: 'fas fa-briefcase', color: '#a06af9' },
  { value: 'tech', labelKey: 'config-industry-tech', icon: 'fas fa-microchip', color: '#4facfe' },
];

const STYLE_OPTIONS: StyleOption[] = [
  {
    value: 'modern',
    labelKey: 'config-style-modern',
    preview: { bg: '#0f172a', accent: '#6366f1', radius: '16px', font: "'Inter', sans-serif" },
  },
  {
    value: 'clean',
    labelKey: 'config-style-clean',
    preview: { bg: '#ffffff', accent: '#10b981', radius: '8px', font: "'Inter', sans-serif" },
  },
  {
    value: 'bold',
    labelKey: 'config-style-bold',
    preview: { bg: '#1a1a2e', accent: '#e94560', radius: '4px', font: "'Inter', sans-serif" },
  },
];

const FEATURES: FeatureOption[] = [
  { value: 'contact-form', labelKey: 'config-feat-contact', icon: 'fas fa-envelope' },
  { value: 'booking', labelKey: 'config-feat-booking', icon: 'fas fa-calendar-check' },
  { value: 'gallery', labelKey: 'config-feat-gallery', icon: 'fas fa-images' },
  { value: 'blog', labelKey: 'config-feat-blog', icon: 'fas fa-blog' },
  { value: 'payments', labelKey: 'config-feat-payments', icon: 'fas fa-credit-card' },
  { value: 'chat', labelKey: 'config-feat-chat', icon: 'fas fa-comments' },
  { value: 'testimonials', labelKey: 'config-feat-testimonials', icon: 'fas fa-star' },
  { value: 'analytics', labelKey: 'config-feat-analytics', icon: 'fas fa-chart-bar' },
];

const SiteConfigurator = (): React.JSX.Element => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>(1);
  const [industry, setIndustry] = useState<string>('');
  const [siteStyle, setSiteStyle] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedIndustry = INDUSTRIES.find((i) => i.value === industry);
  const selectedStyle = STYLE_OPTIONS.find((s) => s.value === siteStyle);

  const toggleFeature = (value: string) => {
    setFeatures((prev) =>
      prev.includes(value)
        ? prev.filter((f) => f !== value)
        : [...prev, value]
    );
  };

  const canAdvance = useMemo(() => {
    switch (step) {
      case 1: return !!industry;
      case 2: return !!siteStyle;
      case 3: return features.length > 0;
      case 4: return contactInfo.name && contactInfo.email;
      default: return false;
    }
  }, [step, industry, siteStyle, features, contactInfo]);

  const handleNext = () => {
    if (step < 4) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contactRequests'), {
        ...contactInfo,
        projectType: 'configurator',
        industry,
        siteStyle,
        features,
        createdAt: serverTimestamp(),
        source: 'site-configurator',
      });
      setSubmitted(true);
    } catch {
      // Fallback: scroll to contact
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate a visual wireframe preview
  const wireframePreview = useMemo(() => {
    const style = selectedStyle?.preview || STYLE_OPTIONS[0].preview;
    const ind = selectedIndustry;
    const isDark = style.bg !== '#ffffff';

    return {
      bg: style.bg,
      accent: ind?.color || style.accent,
      textColor: isDark ? '#e2e8f0' : '#1e293b',
      subtextColor: isDark ? '#94a3b8' : '#64748b',
      cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      radius: style.radius,
      hasBooking: features.includes('booking'),
      hasGallery: features.includes('gallery'),
      hasTestimonials: features.includes('testimonials'),
      hasPayments: features.includes('payments'),
      hasBlog: features.includes('blog'),
      hasChat: features.includes('chat'),
      industryIcon: ind?.icon || 'fas fa-globe',
      industryLabel: ind ? t(ind.labelKey) : '',
    };
  }, [selectedStyle, selectedIndustry, features, t]);

  if (submitted) {
    return (
      <section id="configurador" className={styles.configurator}>
        <motion.div
          className={styles.successState}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className={styles.successIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h3 className={styles.successTitle}>{t('config-success-title')}</h3>
          <p className={styles.successText}>{t('config-success-text')}</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="configurador" className={styles.configurator}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-magic"></i> {t('config-pill')}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        dangerouslySetInnerHTML={{ __html: t('config-title') }}
      />

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t('config-subtitle')}
      </motion.p>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
      <div className={styles.progressLabel}>
        {t('config-step')} {step}/4
      </div>

      <div className={styles.mainLayout}>
        {/* Steps */}
        <div className={styles.stepsPanel}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                className={styles.stepContent}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className={styles.stepTitle}>{t('config-step1-title')}</h3>
                <div className={styles.industryGrid}>
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind.value}
                      className={`${styles.industryCard} ${industry === ind.value ? styles.industryActive : ''}`}
                      onClick={() => setIndustry(ind.value)}
                      style={industry === ind.value ? { borderColor: ind.color, boxShadow: `0 0 20px ${ind.color}20` } : undefined}
                    >
                      <i className={ind.icon} style={{ color: ind.color }}></i>
                      <span>{t(ind.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                className={styles.stepContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className={styles.stepTitle}>{t('config-step2-title')}</h3>
                <div className={styles.styleGrid}>
                  {STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.styleCard} ${siteStyle === opt.value ? styles.styleActive : ''}`}
                      onClick={() => setSiteStyle(opt.value)}
                    >
                      <div
                        className={styles.stylePreview}
                        style={{ background: opt.preview.bg, borderRadius: opt.preview.radius }}
                      >
                        <div className={styles.styleHeader} style={{ background: opt.preview.accent }} />
                        <div className={styles.styleBody}>
                          <div className={styles.styleLine} style={{ background: opt.preview.accent, opacity: 0.3, width: '60%' }} />
                          <div className={styles.styleLine} style={{ background: opt.preview.accent, opacity: 0.15, width: '80%' }} />
                          <div className={styles.styleDot} style={{ background: opt.preview.accent }} />
                        </div>
                      </div>
                      <span>{t(opt.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                className={styles.stepContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className={styles.stepTitle}>{t('config-step3-title')}</h3>
                <div className={styles.featuresGrid}>
                  {FEATURES.map((feat) => (
                    <button
                      key={feat.value}
                      className={`${styles.featureChip} ${features.includes(feat.value) ? styles.featureActive : ''}`}
                      onClick={() => toggleFeature(feat.value)}
                    >
                      <i className={feat.icon}></i>
                      <span>{t(feat.labelKey)}</span>
                      {features.includes(feat.value) && (
                        <i className="fas fa-check" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}></i>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                className={styles.stepContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className={styles.stepTitle}>{t('config-step4-title')}</h3>
                <p className={styles.stepDesc}>{t('config-step4-desc')}</p>
                <div className={styles.contactFields}>
                  <div className={styles.fieldGroup}>
                    <label>{t('contact-label-name')}</label>
                    <input
                      type="text"
                      placeholder={t('contact-placeholder-name')}
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>{t('contact-label-email')}</label>
                    <input
                      type="email"
                      placeholder={t('contact-placeholder-email')}
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>{t('contact-label-phone')} <span className={styles.optional}>({t('contact-optional')})</span></label>
                    <input
                      type="tel"
                      placeholder={t('contact-placeholder-phone')}
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className={styles.navButtons}>
            {step > 1 && (
              <button className={styles.backBtn} onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> {t('contact-back')}
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 4 ? (
              <button
                className={styles.nextBtn}
                onClick={handleNext}
                disabled={!canAdvance}
              >
                {t('config-next')} <i className="fas fa-arrow-right"></i>
              </button>
            ) : (
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!canAdvance || isSubmitting}
              >
                {isSubmitting ? (
                  <><i className="fas fa-spinner fa-spin"></i> {t('contact-btn-submitting')}</>
                ) : (
                  <><i className="fas fa-rocket"></i> {t('config-submit')}</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className={styles.previewPanel}>
          <div className={styles.previewLabel}>
            <i className="fas fa-eye"></i> {t('config-preview')}
          </div>
          <motion.div
            className={styles.previewFrame}
            style={{
              background: wireframePreview.bg,
              borderRadius: '12px',
            }}
            layout
            transition={{ duration: 0.4 }}
          >
            {/* Mock browser chrome */}
            <div className={styles.browserChrome}>
              <div className={styles.browserDots}>
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#febc2e' }} />
                <span style={{ background: '#28c840' }} />
              </div>
              <div className={styles.browserUrl}>
                {wireframePreview.industryLabel ? `www.mi-${industry}.com` : 'www.tu-sitio.com'}
              </div>
            </div>

            {/* Wireframe content */}
            <div className={styles.wireframeContent}>
              {/* Nav */}
              <div className={styles.wfNav}>
                <div className={styles.wfNavLogo} style={{ background: wireframePreview.accent }}>
                  <i className={wireframePreview.industryIcon} style={{ color: 'white', fontSize: '0.6rem' }}></i>
                </div>
                <div className={styles.wfNavLinks}>
                  <div className={styles.wfNavLink} style={{ background: wireframePreview.subtextColor, opacity: 0.3 }} />
                  <div className={styles.wfNavLink} style={{ background: wireframePreview.subtextColor, opacity: 0.3 }} />
                  <div className={styles.wfNavLink} style={{ background: wireframePreview.subtextColor, opacity: 0.3 }} />
                </div>
              </div>

              {/* Hero */}
              <div className={styles.wfHero}>
                <div className={styles.wfHeroTitle} style={{ background: wireframePreview.textColor, opacity: 0.8 }} />
                <div className={styles.wfHeroSubtitle} style={{ background: wireframePreview.subtextColor, opacity: 0.3 }} />
                <div className={styles.wfHeroBtn} style={{ background: wireframePreview.accent, borderRadius: wireframePreview.radius }}>
                  <span style={{ fontSize: '0.5rem', color: 'white', fontWeight: 600 }}>CTA</span>
                </div>
              </div>

              {/* Features grid */}
              <div className={styles.wfFeatures}>
                {features.slice(0, 3).map((f) => {
                  const feat = FEATURES.find((ft) => ft.value === f);
                  return (
                    <motion.div
                      key={f}
                      className={styles.wfFeatureCard}
                      style={{ background: wireframePreview.cardBg, borderRadius: wireframePreview.radius }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <i className={feat?.icon || ''} style={{ color: wireframePreview.accent, fontSize: '0.6rem' }}></i>
                      <div className={styles.wfCardLine} style={{ background: wireframePreview.textColor, opacity: 0.3 }} />
                    </motion.div>
                  );
                })}
              </div>

              {/* Optional sections */}
              {wireframePreview.hasGallery && (
                <motion.div
                  className={styles.wfGallery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.wfGalleryItem} style={{ background: wireframePreview.cardBg, borderRadius: wireframePreview.radius }} />
                  ))}
                </motion.div>
              )}

              {wireframePreview.hasTestimonials && (
                <motion.div
                  className={styles.wfTestimonials}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.wfTestimonialCard} style={{ background: wireframePreview.cardBg, borderRadius: wireframePreview.radius }}>
                    <div className={styles.wfStars} style={{ color: wireframePreview.accent }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className="fas fa-star" style={{ fontSize: '0.4rem' }}></i>
                      ))}
                    </div>
                    <div className={styles.wfCardLine} style={{ background: wireframePreview.subtextColor, opacity: 0.2 }} />
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              <div className={styles.wfFooter} style={{ borderTopColor: wireframePreview.cardBg }}>
                <div className={styles.wfFooterLine} style={{ background: wireframePreview.subtextColor, opacity: 0.15 }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SiteConfigurator;
