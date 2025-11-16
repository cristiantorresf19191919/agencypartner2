'use client';

import { motion } from 'framer-motion';
import styles from './Pricing.module.css';

const AgentsPricing = () => {
  const agents = [
    {
      name: 'Agente de Soporte',
      icon: 'bi bi-headset',
      iconColor: 'purple',
      tag: 'Atención al cliente 24/7',
      price: '$1,500,000',
      currency: 'COP/mes',
      features: [
        'Responde preguntas frecuentes',
        'Resuelve problemas comunes',
        'Escala a un humano si es necesario',
        'Integración con WhatsApp y Web',
        'Panel de control y métricas',
      ],
      buttonText: 'Automatizar soporte',
      buttonGradient: 'purple',
      featured: false,
    },
    {
      name: 'Agente de Ventas',
      icon: 'bi bi-cash-coin',
      iconColor: 'pink',
      tag: 'Califica leads y cierra ventas',
      price: '$2,800,000',
      currency: 'COP/mes',
      features: [
        'Calificación de leads automática',
        'Agenda reuniones y demos',
        'Responde dudas de productos',
        'Recuperación de carritos',
        'Integración con CRM',
        'Reportes de conversión',
      ],
      buttonText: 'Aumentar ventas',
      buttonGradient: 'pink',
      featured: true,
    },
    {
      name: 'Agente de Procesos',
      icon: 'fas fa-robot',
      iconColor: 'teal',
      tag: 'Automatiza tareas internas',
      price: '$1,800,000',
      currency: 'COP/mes',
      features: [
        'Onboarding de empleados',
        'Soporte de RRHH y TI',
        'Gestión de documentos',
        'Automatización de reportes',
        'Base de conocimiento interna',
      ],
      buttonText: 'Optimizar procesos',
      buttonGradient: 'teal',
      featured: false,
    },
  ];

  return (
    <section id="servicios-agentes" className={styles.features}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="fas fa-cogs"></i> Nuestras Soluciones de IA
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Agentes <strong>listos para trabajar</strong>
      </motion.h2>

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Implementamos agentes virtuales entrenados para resolver necesidades específicas de tu
        negocio, desde el primer día.
      </motion.p>

      <motion.div
        className={styles.pricingCards}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
      >
        {agents.map((agent, index) => (
          <motion.div
            key={index}
            className={`${styles.pricingCard} ${agent.featured ? styles.featured : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: agent.featured ? 1.05 : 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles[agent.iconColor]}`}>
                <i className={agent.icon}></i>
              </div>
              <h3>{agent.name}</h3>
              <span className={styles.tag}>{agent.tag}</span>
            </div>
            <ul className={styles.featuresList}>
              {agent.features.map((feature, idx) => (
                <li key={idx}>
                  <i className="fas fa-check"></i> {feature}
                </li>
              ))}
            </ul>
            <div className={styles.priceContainer}>
              <strong>{agent.price}</strong>{' '}
              <span className={styles.currency}>{agent.currency}</span>
            </div>
            <a
              href="#contacto"
              className={`${styles.ctaButton} ${styles[agent.buttonGradient]}`}
            >
              {agent.buttonText}
            </a>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={styles.consultCta}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>¿Necesitas una solución a la medida? ¡Construimos el agente perfecto para tu reto!</p>
        <a href="#contacto" className={styles.ctaButtonSecondary}>
          Cotización personalizada
        </a>
      </motion.div>
    </section>
  );
};

export default AgentsPricing;


