'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './ROICalculator.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

const ROICalculator = (): React.JSX.Element => {
  const { t } = useLanguage();
  const [monthlyVisitors, setMonthlyVisitors] = useState(2000);
  const [conversionRate, setConversionRate] = useState(1.5);
  const [averageOrderValue, setAverageOrderValue] = useState(80);

  const results = useMemo(() => {
    const currentLeads = Math.round(monthlyVisitors * (conversionRate / 100));
    // A professional site typically doubles conversion rate
    const improvedRate = conversionRate * 2.5;
    const improvedLeads = Math.round(monthlyVisitors * (improvedRate / 100));
    const currentRevenue = currentLeads * averageOrderValue;
    const improvedRevenue = improvedLeads * averageOrderValue;
    const monthlyGain = improvedRevenue - currentRevenue;
    const yearlyGain = monthlyGain * 12;

    return {
      currentLeads,
      improvedLeads,
      currentRevenue,
      improvedRevenue,
      monthlyGain,
      yearlyGain,
      improvedRate,
    };
  }, [monthlyVisitors, conversionRate, averageOrderValue]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="roi-calculator" className={styles.calculator}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-chart-line"></i> {t('roi-pill')}
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        dangerouslySetInnerHTML={{ __html: t('roi-title') }}
      />

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {t('roi-subtitle')}
      </motion.p>

      <motion.div
        className={styles.calculatorContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Sliders */}
        <div className={styles.slidersPanel}>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label>{t('roi-visitors-label')}</label>
              <span className={styles.sliderValue}>
                {monthlyVisitors.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={50000}
              step={100}
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderRange}>
              <span>100</span>
              <span>50,000</span>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label>{t('roi-conversion-label')}</label>
              <span className={styles.sliderValue}>{conversionRate}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={10}
              step={0.1}
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderRange}>
              <span>0.1%</span>
              <span>10%</span>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label>{t('roi-order-label')}</label>
              <span className={styles.sliderValue}>{formatCurrency(averageOrderValue)}</span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={averageOrderValue}
              onChange={(e) => setAverageOrderValue(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderRange}>
              <span>$10</span>
              <span>$1,000</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultComparison}>
            <div className={styles.resultBefore}>
              <span className={styles.resultLabel}>{t('roi-current')}</span>
              <span className={styles.resultNumber}>
                {results.currentLeads} {t('roi-leads')}
              </span>
              <span className={styles.resultRevenue}>
                {formatCurrency(results.currentRevenue)}/{t('roi-month')}
              </span>
            </div>
            <div className={styles.resultArrow}>
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className={styles.resultAfter}>
              <span className={styles.resultLabel}>{t('roi-improved')}</span>
              <span className={styles.resultNumber}>
                {results.improvedLeads} {t('roi-leads')}
              </span>
              <span className={styles.resultRevenue}>
                {formatCurrency(results.improvedRevenue)}/{t('roi-month')}
              </span>
            </div>
          </div>

          <div className={styles.gainBox}>
            <div className={styles.gainItem}>
              <span className={styles.gainLabel}>{t('roi-monthly-gain')}</span>
              <span className={styles.gainValue}>
                +{formatCurrency(results.monthlyGain)}
              </span>
            </div>
            <div className={styles.gainDivider} />
            <div className={styles.gainItem}>
              <span className={styles.gainLabel}>{t('roi-yearly-gain')}</span>
              <span className={styles.gainValueBig}>
                +{formatCurrency(results.yearlyGain)}
              </span>
            </div>
          </div>

          <p className={styles.gainNote}>{t('roi-note')}</p>

          <button className={styles.ctaButton} onClick={scrollToContact}>
            <i className="fas fa-rocket"></i> {t('roi-cta')}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default ROICalculator;
