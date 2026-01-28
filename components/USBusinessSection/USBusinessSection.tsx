'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './USBusinessSection.module.css';

const USBusinessSection = () => {
  const { language } = useLanguage();

  // Only show this section when language is English
  if (language !== 'en') {
    return null;
  }

  const benefits = [
    {
      icon: 'fas fa-clock',
      title: 'Save 20+ Hours Weekly',
      description: 'Automate repetitive tasks and manual processes that drain your team\'s productivity.',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Scale Without Limits',
      description: 'Build custom software that grows with your business, eliminating bottlenecks and inefficiencies.',
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'Reduce Operational Costs',
      description: 'Cut overhead by up to 40% with intelligent automation and streamlined workflows.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Enterprise-Grade Security',
      description: 'Bank-level encryption and compliance-ready solutions for your sensitive business data.',
    },
  ];

  const useCases = [
    {
      title: 'Automated Workflow Systems',
      description: 'Eliminate manual data entry and streamline your operations with custom automation.',
    },
    {
      title: 'Custom CRM Solutions',
      description: 'Tailored customer relationship management that fits your unique business processes.',
    },
    {
      title: 'Inventory & Order Management',
      description: 'Real-time tracking, automated reordering, and intelligent stock optimization.',
    },
    {
      title: 'Reporting & Analytics Dashboards',
      description: 'Transform raw data into actionable insights with beautiful, interactive visualizations.',
    },
  ];

  return (
    <section className={styles.usBusinessSection}>
      <div className={styles.container}>
        {/* Hero Message */}
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.badge}>
            <i className="fas fa-rocket"></i>
            <span>Built for US Businesses</span>
          </div>
          
          <h2 className={styles.mainTitle}>
            Stop Wasting Time on <span className={styles.gradientText}>Manual Procedures</span>
          </h2>
          
          <p className={styles.subtitle}>
            We build custom software solutions that automate your workflows, eliminate repetitive tasks, 
            and give your team back the hours they need to focus on what truly matters—growing your business.
          </p>

          <div className={styles.statsGrid}>
            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.statIcon}>
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className={styles.statValue}>20+</div>
              <div className={styles.statLabel}>Hours Saved Weekly</div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.statIcon}>
                <i className="fas fa-percentage"></i>
              </div>
              <div className={styles.statValue}>40%</div>
              <div className={styles.statLabel}>Cost Reduction</div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.statIcon}>
                <i className="fas fa-sync-alt"></i>
              </div>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>Automated Operations</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className={styles.benefitsGrid}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={styles.benefitCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className={styles.benefitIcon}>
                <i className={benefit.icon}></i>
              </div>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDescription}>{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          className={styles.useCasesSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <h3 className={styles.useCasesTitle}>
            Solutions That <span className={styles.gradientText}>Transform</span> Your Operations
          </h3>
          
          <div className={styles.useCasesGrid}>
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                className={styles.useCaseCard}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <div className={styles.useCaseNumber}>{index + 1}</div>
                <h4 className={styles.useCaseTitle}>{useCase.title}</h4>
                <p className={styles.useCaseDescription}>{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              Ready to <span className={styles.gradientText}>Automate</span> Your Business?
            </h3>
            <p className={styles.ctaDescription}>
              Let's discuss how custom software can eliminate your manual processes and boost productivity.
            </p>
            <div className={styles.ctaButtons}>
              <a href="#contacto" className={styles.ctaPrimary}>
                <span>Schedule Free Consultation</span>
                <i className="fas fa-arrow-right"></i>
              </a>
              <a href="#servicios" className={styles.ctaSecondary}>
                View Our Solutions
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default USBusinessSection;

