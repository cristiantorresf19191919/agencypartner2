'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import styles from './Contact.module.css';
import LoadingOverlay from './LoadingOverlay';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

const Contact = (): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: 'success' | 'error', message: string): void => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await addDoc(collection(db, 'contactRequests'), {
        ...formData,
        createdAt: serverTimestamp(),
        source: 'website-contact-section',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
      });

      showToast('success', '¡Gracias! Recibimos tu mensaje y te contactaremos en menos de 24 horas.');
    } catch (error) {
      console.error('Error guardando contacto en Firebase:', error);
      showToast(
        'error',
        'Ups, algo salió mal al enviar el formulario. Intenta nuevamente en unos segundos.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className={styles.contact}>
      <motion.div
        className={styles.pill}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <i className="far fa-paper-plane"></i> Empezá Tu Proyecto
      </motion.div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        ¿Listo para dar el
        <br />
        <strong>siguiente paso?</strong>
      </motion.h2>

      <motion.p
        className={styles.sectionSubtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Completa el formulario y empecemos. Te contactaremos con una propuesta clara y{' '}
        <strong>alineada a los objetivos</strong> de tu negocio.
      </motion.p>

      <div className={styles.contactContainer}>
        <motion.form
          id="contact-form"
          className={styles.contactForm}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Juan Camilo"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="test@gmail.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+57 322 347 93 37"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company">Empresa</label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Mi Empresa SRL"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="projectType">Tipo de proyecto *</label>
              <select
                id="projectType"
                name="projectType"
                required
                value={formData.projectType}
                onChange={handleChange}
              >
                <option value="">Selecciona el tipo de proyecto</option>
                <option value="landing-page">Landing Page</option>
                <option value="corporativo">Sitio Web Corporativo</option>
                <option value="e-commerce">Tienda Online (E-commerce)</option>
                <option value="web-app">Aplicación Web</option>
                <option value="rediseño">Rediseño de sitio existente</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="budget">Presupuesto estimado</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Selecciona tu presupuesto</option>
                <option value="starter">$600,000 COP (Starter)</option>
                <option value="professional">$3,200,000 COP (Professional)</option>
                <option value="custom">$8,000,000 COP (Custom)</option>
                <option value="no-seguro">No estoy seguro</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="timeline">Timeframe esperado</label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
            >
              <option value="">¿Cuándo necesitas el proyecto?</option>
              <option value="1-2-weeks">1-2 Semanas</option>
              <option value="3-4-weeks">3-4 Semanas</option>
              <option value="1-2-months">1-2 Meses</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Cuéntanos sobre tu proyecto</label>
            <textarea
              id="message"
              name="message"
              placeholder="Describe tu negocio, objetivos, público objetivo, funcionalidades específicas que necesitas..."
              rows={5}
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className={styles.ctaButton} disabled={isSubmitting}>
            Solicitar Propuesta Gratuita
          </button>
        </motion.form>

        <motion.div
          className={styles.contactInfo}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className={styles.infoBox}>
            <h4>¿Por qué elegirnos?</h4>
            <ul>
              <li>Consulta gratuita sin compromiso</li>
              <li>Respuesta rápida en menos de 24 horas</li>
              <li>Experiencia con empresas colombianas</li>
              <li>Soporte en español</li>
              <li>Precios competitivos en pesos colombianos</li>
            </ul>
          </div>
        </motion.div>
      </div>
      <LoadingOverlay show={isSubmitting} />
      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === 'success' ? styles.toastSuccess : styles.toastError
          }`}
        >
          <span className={styles.toastIcon}>
            {toast.type === 'success' ? '✓' : '!'}
          </span>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      )}
    </section>
  );
};

export default Contact;

