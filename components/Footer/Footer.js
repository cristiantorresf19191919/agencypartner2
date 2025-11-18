'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerWave}>
        <svg
          width="100%"
          height="180"
          viewBox="0 0 1440 180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-gradient-footer" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#8e44ad" />
              <stop offset="30%" stopColor="#a06af9" />
              <stop offset="60%" stopColor="#e91e63" />
              <stop offset="100%" stopColor="#ff69b4" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,0 C120,40 240,80 360,85 C480,90 600,70 720,55 C840,40 960,30 1080,35 C1200,40 1320,50 1440,45 L1440,180 L0,180 Z"
            fill="url(#wave-gradient-footer)"
            style={{ shapeRendering: 'geometricPrecision' }}
            animate={{
              d: [
                "M0,0 C120,40 240,80 360,85 C480,90 600,70 720,55 C840,40 960,30 1080,35 C1200,40 1320,50 1440,45 L1440,180 L0,180 Z",
                "M0,0 C100,20 200,60 320,75 C440,90 560,80 680,65 C800,50 920,35 1040,40 C1160,45 1280,55 1440,50 L1440,180 L0,180 Z",
                "M0,0 C140,30 280,70 400,80 C520,90 640,75 760,60 C880,45 1000,30 1120,35 C1240,40 1320,45 1440,40 L1440,180 L0,180 Z",
                "M0,0 C110,35 220,75 340,82 C460,89 580,72 700,57 C820,42 940,32 1060,37 C1180,42 1300,52 1440,47 L1440,180 L0,180 Z",
                "M0,0 C130,25 260,65 380,78 C500,91 620,68 740,53 C860,38 980,28 1100,33 C1220,38 1340,48 1440,43 L1440,180 L0,180 Z",
                "M0,0 C150,45 300,80 420,88 C540,96 660,73 780,58 C900,43 1020,33 1140,38 C1260,43 1380,53 1440,48 L1440,180 L0,180 Z",
                "M0,0 C105,15 210,55 330,77 C450,99 570,76 690,61 C810,46 930,36 1050,41 C1170,46 1290,56 1440,51 L1440,180 L0,180 Z",
                "M0,0 C120,40 240,80 360,85 C480,90 600,70 720,55 C840,40 960,30 1080,35 C1200,40 1320,50 1440,45 L1440,180 L0,180 Z",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </div>
      <div className={styles.footerContainer}>
        <div className={styles.footerAbout}>
          <Link href="/" className={styles.logo}>
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
          <div className={styles.footerLinks}>
            <Link href="#">Política de Privacidad</Link>
            <Link href="#">Términos de Servicio</Link>
            <Link href="/asesorias" className={styles.gradientLink}>
              Asesorías
            </Link>
            <Link href="/agentes" className={styles.gradientLink}>
              Agentes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

