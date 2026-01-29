'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing/Pricing';
import FAQ from '@/components/FAQ/FAQ';
import Portfolio from '@/components/Portfolio/Portfolio';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const mentoringCases = [
  {
    title: 'Laura G. (Desarrolladora Frontend)',
    description:
      '"Gracias a la mentoría, conseguí mi primer trabajo como desarrolladora y lancé mi portafolio en React."',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    link: '#contacto',
    stats: [
      { icon: 'fas fa-code', value: '+3', label: 'Proyectos lanzados' },
      { icon: 'fas fa-user-graduate', value: '1er empleo', label: 'Logrado' },
      { icon: 'fas fa-star', value: '5/5', label: 'Valoración' },
    ],
  },
  {
    title: 'Carlos M. (Backend & DevOps)',
    description:
      '"Me ayudaron a estructurar mi backend con Spring Boot y Docker. Ahora mi app es escalable y segura."',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    link: '#contacto',
    stats: [
      { icon: 'fas fa-server', value: '+2', label: 'Microservicios' },
      { icon: 'fas fa-database', value: '+3', label: 'Bases de datos' },
      { icon: 'fas fa-star', value: '5/5', label: 'Valoración' },
    ],
  },
  {
    title: 'Andrea P. (Mobile & Flutter)',
    description:
      '"Las clases personalizadas de Flutter me permitieron lanzar mi primera app en Google Play."',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    link: '#contacto',
    stats: [
      { icon: 'fab fa-google-play', value: '1', label: 'App publicada' },
      { icon: 'fas fa-mobile-alt', value: 'Flutter', label: 'Stack' },
      { icon: 'fas fa-star', value: '5/5', label: 'Valoración' },
    ],
  },
];

export default function AsesoriasPage() {
  const { t } = useLanguage();

  const mentoringFaqs = [
    {
      question: t('asesorias-faq-1-q') || '¿Qué tecnologías cubren las asesorías?',
      answer: t('asesorias-faq-1-a') || 'JavaScript, Python, Kotlin, Flutter, Spring Boot, Docker, bases de datos SQL y NoSQL, arquitectura de software, buenas prácticas y más.',
    },
    {
      question: t('asesorias-faq-2-q') || '¿Cómo se agenda una sesión?',
      answer: t('asesorias-faq-2-a') || 'Simplemente llena el formulario de contacto o escríbenos por WhatsApp. Te responderemos en menos de 24h para coordinar fecha y hora.',
    },
    {
      question: t('asesorias-faq-3-q') || '¿Puedo llevar mi propio proyecto o código?',
      answer: t('asesorias-faq-3-a') || '¡Por supuesto! Puedes traer tu proyecto, código o idea y te ayudamos a resolver dudas, mejorar la arquitectura o avanzar más rápido.',
    },
    {
      question: t('asesorias-faq-4-q') || '¿Las clases y asesorías son grabadas?',
      answer: t('asesorias-faq-4-a') || 'Sí, todas las sesiones pueden ser grabadas y te compartimos el video para que repases cuando quieras.',
    },
    {
      question: t('asesorias-faq-5-q') || '¿Qué nivel necesito para tomar una mentoría?',
      answer: t('asesorias-faq-5-a') || 'No importa tu nivel: desde principiante hasta avanzado. Adaptamos la mentoría a tus objetivos y conocimientos.',
    },
    {
      question: t('asesorias-faq-6-q') || '¿Puedo pedir ayuda para entrevistas técnicas o coding interviews?',
      answer: t('asesorias-faq-6-a') || '¡Claro! Te preparamos para entrevistas técnicas, algoritmos, estructuras de datos y simulacros de entrevistas reales.',
    },
    {
      question: t('asesorias-faq-7-q') || '¿Incluyen material de estudio y ejercicios?',
      answer: t('asesorias-faq-7-a') || 'Sí, recibirás material de apoyo, ejercicios prácticos y recursos recomendados según tu objetivo.',
    },
    {
      question: t('asesorias-faq-8-q') || '¿Cómo es el proceso de pago?',
      answer: t('asesorias-faq-8-a') || 'Puedes pagar por transferencia, Nequi, Daviplata o tarjeta. Te enviamos los datos al agendar.',
    },
    {
      question: t('asesorias-faq-9-q') || '¿Puedo solicitar factura o recibo?',
      answer: t('asesorias-faq-9-a') || 'Sí, emitimos factura electrónica o recibo si lo necesitas para tu empresa o contabilidad.',
    },
    {
      question: t('asesorias-faq-10-q') || '¿Ofrecen asesoría para empresas o equipos?',
      answer: t('asesorias-faq-10-a') || 'Sí, realizamos talleres, capacitaciones y consultoría para equipos de desarrollo y empresas.',
    },
  ];

  const mentoringPlans = [
    {
      name: t('asesorias-plan-express-name'),
      icon: 'fas fa-bolt',
      iconColor: 'yellow',
      tag: t('asesorias-plan-express-tag'),
      price: t('asesorias-plan-express-price'),
      oldPrice: '$150,000',
      currency: t('asesorias-plan-express-currency'),
      features: [
        t('asesorias-plan-express-feature-1'),
        t('asesorias-plan-express-feature-2'),
        t('asesorias-plan-express-feature-3'),
        t('asesorias-plan-express-feature-4'),
        t('asesorias-plan-express-feature-5'),
      ],
      buttonText: t('asesorias-plan-express-button'),
      buttonGradient: 'purple',
    },
    {
      name: t('asesorias-plan-continua-name'),
      icon: 'fas fa-user-graduate',
      iconColor: 'green',
      tag: t('asesorias-plan-continua-tag'),
      price: t('asesorias-plan-continua-price'),
      oldPrice: '$450,000',
      currency: t('asesorias-plan-continua-currency'),
      featured: true,
      features: [
        t('asesorias-plan-continua-feature-1'),
        t('asesorias-plan-continua-feature-2'),
        t('asesorias-plan-continua-feature-3'),
        t('asesorias-plan-continua-feature-4'),
        t('asesorias-plan-continua-feature-5'),
        t('asesorias-plan-continua-feature-6'),
      ],
      buttonText: t('asesorias-plan-continua-button'),
      buttonGradient: 'pink',
    },
    {
      name: t('asesorias-plan-clases-name'),
      icon: 'fas fa-chalkboard-teacher',
      iconColor: 'teal',
      tag: t('asesorias-plan-clases-tag'),
      price: t('asesorias-plan-clases-price'),
      oldPrice: '$180,000',
      currency: t('asesorias-plan-clases-currency'),
      features: [
        t('asesorias-plan-clases-feature-1'),
        t('asesorias-plan-clases-feature-2'),
        t('asesorias-plan-clases-feature-3'),
        t('asesorias-plan-clases-feature-4'),
        t('asesorias-plan-clases-feature-5'),
      ],
      buttonText: t('asesorias-plan-clases-button'),
      buttonGradient: 'teal',
    },
    {
      name: t('asesorias-plan-arch-name'),
      icon: 'fas fa-project-diagram',
      iconColor: 'purple',
      tag: t('asesorias-plan-arch-tag'),
      price: t('asesorias-plan-arch-price'),
      oldPrice: '$300,000',
      currency: t('asesorias-plan-arch-currency'),
      features: [
        t('asesorias-plan-arch-feature-1'),
        t('asesorias-plan-arch-feature-2'),
        t('asesorias-plan-arch-feature-3'),
        t('asesorias-plan-arch-feature-4'),
        t('asesorias-plan-arch-feature-5'),
      ],
      buttonText: t('asesorias-plan-arch-button'),
      buttonGradient: 'purple',
    },
  ];

  return (
    <main>
      <Header />
      <Hero />
      <Pricing
        sectionId="servicios"
        pillIconClass="fas fa-laptop-code"
        pillText={t('asesorias-pill')}
        title={
          <>
            Soluciones <strong>a tu medida</strong>
          </>
        }
        subtitle={t('asesorias-subtitle')}
        plans={mentoringPlans}
        consultText={t('asesorias-consult-text')}
        consultCtaText={t('asesorias-consult-cta')}
      />
      <FAQ
        faqs={mentoringFaqs}
        title={
          <>
            Preguntas <strong>Frecuentes</strong>
          </>
        }
      />
      <Portfolio
        sectionId="casos-de-exito"
        pillIconClass="fas fa-star"
        pillText={t('asesorias-portfolio-pill')}
        title={
          <>
            Historias de <strong>impacto real</strong>
          </>
        }
        subtitle={
          <>
            {t('asesorias-portfolio-subtitle')}
          </>
        }
        cases={mentoringCases}
      />
      <Contact />
      <Footer />
    </main>
  );
}

