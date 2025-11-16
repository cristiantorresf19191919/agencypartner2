'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';

const AgentsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: '¿Cómo "aprende" el agente sobre mi negocio?',
      answer:
        'Entrenamos el agente con tu propia información: documentos, sitio web, FAQs y bases de datos. Aprende de tu contenido para dar respuestas precisas y alineadas con tu marca.',
    },
    {
      question: '¿En qué canales puede operar el agente?',
      answer:
        'Nuestros agentes se integran con los canales más usados: WhatsApp Business, tu sitio web, Facebook Messenger, Instagram, Slack y más.',
    },
    {
      question: '¿El agente puede escalar la conversación a un humano?',
      answer:
        'Sí. Diseñamos flujos para que el agente identifique cuándo un caso requiere intervención humana y pueda transferir la conversación de forma transparente a tu equipo.',
    },
    {
      question: '¿Cuánto tiempo toma la implementación?',
      answer:
        'Un agente básico puede estar operativo en 1–2 semanas. Soluciones más complejas pueden tomar de 3 a 4 semanas, dependiendo del alcance y las integraciones necesarias.',
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>
        Preguntas <strong>Frecuentes</strong>
      </h2>

      <div className={styles.accordion}>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className={`${styles.accordionItem} ${openIndex === index ? styles.open : ''}`}
            layout
            transition={{
              layout: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] },
            }}
          >
            <button
              className={styles.accordionTrigger}
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
            >
              {faq.question}
              <span className={styles.chevron}>
                <i className="fas fa-chevron-right"></i>
              </span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  className={styles.accordionContent}
                  initial={{ opacity: 0, scaleY: 0.9 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.9 }}
                  transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{ originY: 0 }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className={styles.faqContact}>
        <p>¿Tienes otra pregunta sobre agentes virtuales?</p>
        <a href="#contacto" className={styles.ctaButton}>
          Contáctanos
        </a>
      </div>
    </section>
  );
};

export default AgentsFAQ;


