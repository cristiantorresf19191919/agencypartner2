'use client';

import { motion } from 'framer-motion';
import styles from './ServicesOverview.module.css';

const ServicesOverview = () => {
  const services = [
    {
      title: 'Landing Pages',
      icon: 'fas fa-globe',
      gradient: 'green',
      description: 'Páginas de aterrizaje optimizadas para conversión con diseño responsivo y carga ultrarrápida.',
      features: ['Diseño responsivo', 'SEO optimizado', 'Análisis integrado', 'Formularios de contacto'],
    },
    {
      title: 'Aplicaciones Web',
      icon: 'fas fa-code',
      gradient: 'blue',
      description: 'Aplicaciones web completas con funcionalidades avanzadas y experiencia de usuario excepcional.',
      features: ['React/Vue/Angular', 'Backend personalizado', 'Base de datos', 'Autenticación'],
    },
    {
      title: 'Sitios Corporativos',
      icon: 'fas fa-mobile-alt',
      gradient: 'purple',
      description: 'Sitios web empresariales que reflejan la profesionalidad y valores de tu marca.',
      features: ['CMS personalizado', 'Múltiples idiomas', 'Integración social', 'Blog incorporado'],
    },
    {
      title: 'E-commerce',
      icon: 'fas fa-bolt',
      gradient: 'orange',
      description: 'Tiendas online completas con pasarelas de pago y gestión de inventario integrada.',
      features: ['Carrito de compras', 'Pagos seguros', 'Gestión de stock', 'Panel de admin'],
    },
    {
      title: 'Plataformas SaaS',
      icon: 'fas fa-users',
      gradient: 'teal',
      description: 'Plataformas de software como servicio escalables con dashboard y gestión de usuarios.',
      features: ['Multi-tenancy', 'Subscripciones', 'API REST', 'Dashboard analytics'],
    },
    {
      title: 'Mantenimiento',
      icon: 'fas fa-shield-alt',
      gradient: 'pink',
      description: 'Soporte continuo, actualizaciones de seguridad y optimizaciones de rendimiento.',
      features: ['Soporte 24/7', 'Backups automáticos', 'Actualizaciones', 'Monitoreo'],
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="servicios-overview" className={styles.services}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-cubes"></i> ¿Qué podemos crear para tu negocio?
      </motion.div>
      
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Soluciones <strong>Digitales</strong> a tu Medida
      </motion.h2>
      
      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Desarrollo web profesional para cada necesidad: desde landing pages hasta plataformas SaaS y mantenimiento continuo.
      </motion.p>

      <motion.div
        className={styles.cardsContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            className={`${styles.serviceCard} ${styles[service.gradient]}`}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.cardIcon}>
              <i className={service.icon}></i>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <ul className={styles.featuresList}>
              {service.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ServicesOverview;

