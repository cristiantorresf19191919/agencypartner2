'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/useLocale';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Footer.module.css';

const Footer = (): JSX.Element => {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const pathname = usePathname();
  const isDeveloperSection = pathname?.includes('/developer-section');
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerWave}>
        <svg
          width="100%"
          height="120"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={styles.waveSvg}
        >
          <defs>
            <linearGradient id="wave-gradient-footer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A06AF9" />
              <stop offset="50%" stopColor="#C855F5" />
              <stop offset="100%" stopColor="#F8549B" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z"
            fill="url(#wave-gradient-footer)"
            initial={{ d: "M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z" }}
            animate={{
              d: [
                "M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z",
                "M0,80 C180,75 360,55 540,55 C720,55 900,65 1080,65 C1260,65 1440,60 1440,60 L1440,120 L0,120 Z",
                "M0,85 C180,85 360,45 540,45 C720,45 900,75 1080,75 C1260,75 1440,55 1440,55 L1440,120 L0,120 Z",
                "M0,90 C180,90 360,50 540,50 C720,50 900,70 1080,70 C1260,70 1440,50 1440,50 L1440,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
      <div className={styles.footerContainer}>
        <div className={styles.footerAbout}>
          <Link href={createLocalizedPath('/')} className={styles.logo}>
            <i className="fas fa-code"></i> OptimusAgency
          </Link>
          <p>
            Transformamos ideas en activos digitales que venden. Especialistas en landing pages
            de alta conversión y desarrollo web profesional.
          </p>
          <p className={styles.madeWith}>
            Hecho con <i className="fas fa-heart"></i> y <i className="fas fa-bolt"></i> en
            Colombia
          </p>
          <p>© {new Date().getFullYear()} OptimusAgency. Todos los derechos reservados.</p>
          
          {isDeveloperSection && (
            <div className={styles.developerInfo}>
              <Image
                src="/images/portfolio/cris.jpg"
                alt="Cris Developer"
                width={80}
                height={80}
                className={styles.developerImage}
              />
              <p className={styles.developerName}>Cris Developer Senior</p>
            </div>
          )}
          
          <div className={styles.footerLinks}>
            <Link href="#">Política de Privacidad</Link>
            <Link href="#">Términos de Servicio</Link>
            <Link href={createLocalizedPath('/developer-section')} className={styles.gradientLink}>
              {t('nav-developer-section')}
            </Link>
            <Link href={createLocalizedPath('/asesorias')} className={styles.gradientLink}>
              Asesorías
            </Link>
            <Link href={createLocalizedPath('/agentes')} className={styles.gradientLink}>
              Agentes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



