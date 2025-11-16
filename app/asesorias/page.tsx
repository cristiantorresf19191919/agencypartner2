'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing/Pricing';
import FAQ from '@/components/FAQ/FAQ';
import Portfolio from '@/components/Portfolio/Portfolio';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import FAB from '@/components/FAB/FAB';

const mentoringPlans = [
  {
    name: 'Asesoría Express',
    icon: 'fas fa-bolt',
    iconColor: 'yellow',
    tag: 'Resuelve tus dudas puntuales',
    price: '$120,000',
    currency: 'COP',
    features: [
      '1 sesión personalizada (60 min)',
      'Resolución de bloqueos',
      'Revisión de código en vivo',
      'Grabación de la sesión',
      'Soporte por chat 24h',
    ],
    buttonText: 'Agendar ahora',
    buttonGradient: 'purple',
  },
  {
    name: 'Mentoría Continua',
    icon: 'fas fa-user-graduate',
    iconColor: 'green',
    tag: 'Acompañamiento y evolución constante',
    price: '$390,000',
    currency: 'COP/mes',
    featured: true,
    features: [
      '4 sesiones mensuales 1:1',
      'Seguimiento de tu proyecto',
      'Plan de aprendizaje personalizado',
      'Code review y buenas prácticas',
      'Material de apoyo exclusivo',
      'Soporte por chat ilimitado',
    ],
    buttonText: 'Quiero mentoría',
    buttonGradient: 'pink',
  },
  {
    name: 'Clases Personalizadas',
    icon: 'fas fa-chalkboard-teacher',
    iconColor: 'teal',
    tag: 'Aprende lo que realmente necesitas',
    price: '$150,000',
    currency: 'COP/sesión',
    features: [
      'Temas a la medida (JS, Python, Kotlin, etc.)',
      'Ejercicios prácticos y retos',
      'Acceso a grabaciones',
      'Feedback en tiempo real',
      'Material descargable',
    ],
    buttonText: 'Solicitar clase',
    buttonGradient: 'teal',
  },
  {
    name: 'Arquitectura & Code Review',
    icon: 'fas fa-project-diagram',
    iconColor: 'purple',
    tag: 'Mejora tu software con expertos',
    price: '$250,000',
    currency: 'COP',
    features: [
      'Análisis de arquitectura',
      'Revisión de código profesional',
      'Recomendaciones de escalabilidad',
      'Seguridad y performance',
      'Informe detallado y plan de acción',
    ],
    buttonText: 'Mejorar mi software',
    buttonGradient: 'purple',
  },
];

const mentoringFaqs = [
  {
    question: '¿Qué tecnologías cubren las asesorías?',
    answer:
      'JavaScript, Python, Kotlin, Flutter, Spring Boot, Docker, bases de datos SQL y NoSQL, arquitectura de software, buenas prácticas y más.',
  },
  {
    question: '¿Cómo se agenda una sesión?',
    answer:
      'Simplemente llena el formulario de contacto o escríbenos por WhatsApp. Te responderemos en menos de 24h para coordinar fecha y hora.',
  },
  {
    question: '¿Puedo llevar mi propio proyecto o código?',
    answer:
      '¡Por supuesto! Puedes traer tu proyecto, código o idea y te ayudamos a resolver dudas, mejorar la arquitectura o avanzar más rápido.',
  },
  {
    question: '¿Las clases y asesorías son grabadas?',
    answer:
      'Sí, todas las sesiones pueden ser grabadas y te compartimos el video para que repases cuando quieras.',
  },
  {
    question: '¿Qué nivel necesito para tomar una mentoría?',
    answer:
      'No importa tu nivel: desde principiante hasta avanzado. Adaptamos la mentoría a tus objetivos y conocimientos.',
  },
  {
    question: '¿Puedo pedir ayuda para entrevistas técnicas o coding interviews?',
    answer:
      '¡Claro! Te preparamos para entrevistas técnicas, algoritmos, estructuras de datos y simulacros de entrevistas reales.',
  },
  {
    question: '¿Incluyen material de estudio y ejercicios?',
    answer:
      'Sí, recibirás material de apoyo, ejercicios prácticos y recursos recomendados según tu objetivo.',
  },
  {
    question: '¿Cómo es el proceso de pago?',
    answer:
      'Puedes pagar por transferencia, Nequi, Daviplata o tarjeta. Te enviamos los datos al agendar.',
  },
  {
    question: '¿Puedo solicitar factura o recibo?',
    answer:
      'Sí, emitimos factura electrónica o recibo si lo necesitas para tu empresa o contabilidad.',
  },
  {
    question: '¿Ofrecen asesoría para empresas o equipos?',
    answer:
      'Sí, realizamos talleres, capacitaciones y consultoría para equipos de desarrollo y empresas.',
  },
];

const mentoringCases = [
  {
    title: 'Laura G. (Desarrolladora Frontend)',
    description:
      '"Gracias a la mentoría, conseguí mi primer trabajo como desarrolladora y lancé mi portafolio en React."',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
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
    stats: [
      { icon: 'fab fa-google-play', value: '1', label: 'App publicada' },
      { icon: 'fas fa-mobile-alt', value: 'Flutter', label: 'Stack' },
      { icon: 'fas fa-star', value: '5/5', label: 'Valoración' },
    ],
  },
];

export default function AsesoriasPage() {
  return (
    <main>
      <Header />
      <Hero />
      <Pricing
        sectionId="servicios"
        pillIconClass="fas fa-laptop-code"
        pillText="Servicios de Mentoría y Asesoría"
        title={
          <>
            Soluciones <strong>a tu medida</strong>
          </>
        }
        subtitle="Acompañamiento experto, clases prácticas y consultoría para que avances más rápido y seguro en tu carrera o proyecto."
        plans={mentoringPlans}
        consultText="¿No sabes qué servicio elegir? ¡Te ayudo a encontrar la mejor opción para ti!"
        consultCtaText="Recibir asesoría gratuita"
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
        pillText="Testimonios y Casos de Éxito"
        title={
          <>
            Historias de <strong>impacto real</strong>
          </>
        }
        subtitle="Más de 100 estudiantes y profesionales han transformado su carrera y proyectos con nuestra mentoría."
        cases={mentoringCases}
      />
      <Contact />
      <Footer />
      <FAB />
    </main>
  );
}


