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
          height="100%"
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-gradient-footer" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="5%" stopColor="#8e44ad" />
              <stop offset="95%" stopColor="#e91e63" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,0L0,0Z"
            fill="url(#wave-gradient-footer)"
            style={{ shapeRendering: 'geometricPrecision' }}
            transform="translate(0, 22)"
            animate={{
              d: [
                "M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,0L0,0Z",
                "M0,150 C123.3,119.5,246.7,88.9,431,77 C615.3,65.1,860.7,71.7,1039,87 C1217.3,102.3,1328.7,126.1,1440,150L1440,0L0,0Z",
                "M0,150 C131.7,168.4,263.5,186.8,432,188 C600.5,189.2,805.9,173.2,980,164 C1154.1,154.8,1297.1,152.4,1440,150L1440,0L0,0Z",
                "M0,150 C171.6,149.5,343.2,148.9,500,141 C656.8,133.1,798.8,117.7,953,118 C1107.2,118.3,1273.6,134.1,1440,150L1440,0L0,0Z",
                "M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,0L0,0Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
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

