'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';

const defaultFaqs = [
  {
    question: '¿Cuánto tiempo toma desarrollar mi proyecto?',
    answer:
      'Los tiempos varían según la complejidad: Landing pages básicas (7-10 días), sitios corporativos (14-21 días), y aplicaciones complejas (30-45 días). Siempre mantenemos comunicación constante sobre el progreso.',
  },
  {
    question: '¿Qué tecnologías utilizan para el desarrollo?',
    answer:
      'Usamos tecnologías modernas como React, Next.js, Node.js, Firebase, y herramientas de diseño como Figma y Webflow, según las necesidades del proyecto.',
  },
  {
    question: '¿Incluyen hosting y dominio en el precio?',
    answer:
      'Sí, todos los planes incluyen hosting por 1 año. El dominio puede incluirse o gestionarse aparte según el plan y la preferencia del cliente.',
  },
  {
    question: '¿Ofrecen soporte después de la entrega?',
    answer:
      'Sí, ofrecemos soporte post-entrega: 30 días para Starter, 3 meses para Professional, y opciones personalizadas para proyectos complejos.',
  },
  {
    question: '¿Puedo solicitar cambios durante el desarrollo?',
    answer:
      'Sí, puedes solicitar cambios. Starter incluye 1 revisión, Professional incluye 3, y los proyectos personalizados se acuerdan según el alcance.',
  },
  {
    question: '¿Qué pasa si no estoy satisfecho con el resultado?',
    answer:
      'Trabajamos contigo hasta que estés satisfecho dentro de las revisiones incluidas. Si hay desacuerdo, buscamos una solución justa y transparente.',
  },
  {
    question: '¿Pueden integrar mi sitio con sistemas existentes?',
    answer:
      'Sí, realizamos integraciones con CRMs, ERPs, pasarelas de pago y otros sistemas según tus necesidades.',
  },
  {
    question: '¿Los sitios son optimizados para móviles?',
    answer:
      'Todos nuestros sitios son 100% responsive y optimizados para móviles y tablets.',
  },
  {
    question: '¿Cómo es el proceso de pago?',
    answer:
      'El pago se realiza en dos partes: 50% al iniciar y 50% al entregar el proyecto, salvo acuerdos especiales.',
  },
  {
    question: '¿Proporcionan capacitación para usar el sitio?',
    answer:
      'Sí, ofrecemos capacitación básica para que puedas administrar tu sitio o tienda.',
  },
];

const FAQ = ({ faqs = defaultFaqs, title }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>
        {title || (
          <>
            Preguntas <strong>Frecuentes</strong>
          </>
        )}
      </h2>

      <div className={styles.accordion}>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className={`${styles.accordionItem} ${openIndex === index ? styles.open : ''}`}
            layout
            transition={{ layout: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] } }}
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
        <p>¿No encuentras la respuesta que buscas?</p>
        <a href="#contacto" className={styles.ctaButton}>
          Contacta con nosotros
        </a>
      </div>
    </section>
  );
};

export default FAQ;

