'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './LogoMarquee.module.css';

interface MarqueeItem {
  icon: string;
  label: string;
}

const LogoMarquee = () => {
  const { language } = useLanguage();

  const techItems: MarqueeItem[] = [
    { icon: 'fab fa-react', label: 'React' },
    { icon: 'fab fa-node-js', label: 'Node.js' },
    { icon: 'fab fa-js-square', label: 'TypeScript' },
    { icon: 'fas fa-bolt', label: 'Next.js' },
    { icon: 'fab fa-figma', label: 'Figma' },
    { icon: 'fab fa-aws', label: 'AWS' },
    { icon: 'fab fa-docker', label: 'Docker' },
    { icon: 'fas fa-database', label: 'PostgreSQL' },
    { icon: 'fab fa-google', label: 'Firebase' },
    { icon: 'fas fa-cloud', label: 'Vercel' },
    { icon: 'fab fa-stripe-s', label: 'Stripe' },
    { icon: 'fas fa-shield-alt', label: 'SSL/TLS' },
  ];

  const industryItems: MarqueeItem[] = [
    { icon: 'fas fa-store', label: language === 'es' ? 'E-commerce' : 'E-commerce' },
    { icon: 'fas fa-briefcase-medical', label: language === 'es' ? 'Salud' : 'Healthcare' },
    { icon: 'fas fa-graduation-cap', label: 'EdTech' },
    { icon: 'fas fa-utensils', label: language === 'es' ? 'Restaurantes' : 'Restaurants' },
    { icon: 'fas fa-building', label: 'SaaS' },
    { icon: 'fas fa-gavel', label: language === 'es' ? 'Legal' : 'Legal' },
    { icon: 'fas fa-home', label: language === 'es' ? 'Inmobiliaria' : 'Real Estate' },
    { icon: 'fas fa-dumbbell', label: 'Fitness' },
    { icon: 'fas fa-palette', label: language === 'es' ? 'Creativo' : 'Creative' },
    { icon: 'fas fa-truck', label: language === 'es' ? 'Logística' : 'Logistics' },
    { icon: 'fas fa-solar-panel', label: language === 'es' ? 'Energía' : 'Energy' },
    { icon: 'fas fa-chart-pie', label: language === 'es' ? 'Finanzas' : 'Finance' },
  ];

  const renderTrack = (items: MarqueeItem[], direction: 'left' | 'right') => {
    // Duplicate items for seamless loop
    const doubled = [...items, ...items];
    return (
      <div className={`${styles.marqueeTrack} ${direction === 'right' ? styles.reverse : ''}`}>
        {doubled.map((item, index) => (
          <div key={index} className={styles.marqueeItem}>
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className={styles.marqueeSection}>
      <div className={styles.marqueeLabel}>
        {language === 'es' ? 'Tecnologías que utilizamos' : 'Technologies we use'}
      </div>
      <div className={styles.marqueeContainer}>
        {renderTrack(techItems, 'left')}
      </div>
      <div className={styles.marqueeLabel}>
        {language === 'es' ? 'Industrias que servimos' : 'Industries we serve'}
      </div>
      <div className={styles.marqueeContainer}>
        {renderTrack(industryItems, 'right')}
      </div>
    </section>
  );
};

export default LogoMarquee;
