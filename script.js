// script.js
// ——— Importar sólo desde la CDN de Firebase (v9 modular) ———
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ——— Tu configuración de Firebase (cópiala de la consola, Apps web) ———
const firebaseConfig = {
  apiKey: "AIzaSyAY8bJ3fj_Z3XiFCYhB9-0Np6d6Hsihq88",
  authDomain: "agencyparnertdhip.firebaseapp.com",
  projectId: "agencyparnertdhip",
  storageBucket: "agencyparnertdhip.firebasestorage.app",
  messagingSenderId: "544806440830",
  appId: "1:544806440830:web:f5b2877ce2162dd3dfad2f"
};

// ——— Inicializa Firebase y Firestore ———
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ——— Language translations ———
const translations = {
  es: {
    // Navigation
    'nav-servicios': 'Servicios',
    'nav-casos-exito': 'Casos de Éxito',
    'nav-contacto': 'Contacto',
    'nav-asesorias': 'Asesorías',
    'nav-agentes': 'Agentes',
    
    // Hero Section
    'hero-pill': 'Desarrollo Web Profesional',
    'hero-title': 'Convierte clics en clientes en 14 días',
    'hero-subtitle-1': 'Impulsa tu negocio con páginas web que convierten.',
    'hero-subtitle-2': 'Landing pages irresistibles para captar más clientes.',
    'hero-subtitle-3': 'Desarrollamos tu presencia digital en tiempo récord.',
    'hero-subtitle-4': 'Tu web, tu mejor vendedor 24/7.',
    'hero-banner': 'Lleva tu negocio a vender 24/7 desde el día 1',
    'stat-proyectos': 'Proyectos completados',
    'stat-satisfaccion': 'Satisfacción del cliente',
    'stat-entrega': 'Entrega promedio',
    'btn-empezar': 'Empezar mi proyecto',
    'btn-ver-servicios': 'Ver nuestros servicios',
    
    // Quotation Page
    'quote-pill': 'Propuesta Comercial',
    'quote-title': 'Construcción de Sitio Web Profesional',
    'quote-subtitle-1': 'Diseño, desarrollo y optimización de sitio web enfocado en generación de leads.',
    'quote-subtitle-2': 'Marketing y conversión para empresas de paneles solares.',
    'quote-subtitle-3': 'Calculadora solar interactiva con estimación de ahorros.',
    'quote-subtitle-4': 'Tu sitio web, tu mejor vendedor 24/7.',
    'stat-inversion': 'Inversión Total',
    'stat-etapas': 'Etapas de Desarrollo',
    'stat-semanas': 'Semanas de Entrega',
    'btn-detalles': 'Ver Detalles Completos',
    'btn-ajustes': 'Solicitar Ajustes',
    
    // Investment
    'investment-title': 'Inversión Total Estimada',
    'investment-note': 'Este valor puede variar si se añaden funcionalidades no contempladas en este acuerdo',
    
    // Project Objective
    'objective-pill': 'Objetivo del Proyecto',
    'objective-title': 'Crear una Página Web Profesional',
    'objective-subtitle': 'Sitio web responsivo, optimizado para móviles, con enfoque comercial que permita atraer clientes, calcular ahorros energéticos y visualizar beneficios de forma clara y convincente.',
    
    // Development Stages
    'stages-pill': 'Entregables por Etapas',
    'stages-title': 'Proceso de Desarrollo',
    'stages-subtitle': 'Cada etapa incluye pagos específicos y entregables claros para garantizar transparencia y calidad.',
    
    // Stage 1
    'stage1-title': 'Etapa 1 – Estrategia y Estructura',
    'stage1-price': 'Pago inicial: $800.000',
    'stage1-meta': 'Alinear visión de marca + diseño claro + estrategia de conversión',
    'stage1-feature-1': 'Reunión de descubrimiento y definición de objetivos',
    'stage1-feature-2': 'Arquitectura de información del sitio',
    'stage1-feature-3': 'Wireframes de estructura de página',
    'stage1-feature-4': 'Redacción persuasiva de textos (copywriting optimizado para conversión y SEO local)',
    'stage1-feature-5': 'Diseño visual inicial enfocado en versión mobile-first',
    'stage1-feature-6': 'Formulario de contacto directo a WhatsApp o correo',
    
    // Stage 2
    'stage2-title': 'Etapa 2 – Desarrollo y Funcionalidad',
    'stage2-price': 'Pago: $1.600.000',
    'stage2-meta': 'Tener el sitio funcional, visual, confiable y enfocado en conversión',
    'stage2-feature-1': 'Desarrollo completo del sitio con secciones Home, Servicios, Proyectos, Testimonios y Contacto',
    'stage2-feature-2': 'Implementación de algoritmo a gusto del cliente para calculadora solar interactiva (dirección + factura promedio)',
    'stage2-feature-3': 'Gráficos circulares (Pie Charts) automáticos con estimación de ahorro',
    'stage2-feature-4': 'Optimización de velocidad, SEO técnico y responsive mobile',
    'stage2-feature-5': 'Implementación de seguimiento con Analytics y eventos (si aplica)',
    'stage2-feature-6': 'Revisión UX/UI por especialista QA (Karen)',
    
    // Stage 3
    'stage3-title': 'Etapa 3 – Profesionalización + Marketing',
    'stage3-price': 'Pago final: $1.600.000',
    'stage3-meta': 'Sitio completo, convincente, vendible y escalable',
    'stage3-feature-1': 'Generación automática de cotización en PDF descargable, con logo, consumo estimado y ahorro',
    'stage3-feature-2': 'Integración con Google Maps, testimonios e iconografía visual',
    'stage3-feature-3': 'Blog autogestionable para atraer tráfico orgánico (SEO inbound)',
    'stage3-feature-4': 'Alta en Google Business + configuración básica SEO local',
    'stage3-feature-5': 'Asesoría personalizada para campañas de marketing digital',
    'stage3-feature-6': 'Soporte técnico y ajustes menores post-lanzamiento (15 días)',
    
    // Benefits
    'benefits-pill': 'Beneficios con Enfoque en Marketing',
    'benefits-title': '¿Por qué Elegirnos?',
    'benefit-1-title': 'Captación Automática',
    'benefit-1-desc': 'Captación automática de leads calificados las 24 horas del día.',
    'benefit-2-title': 'ROI Visual',
    'benefit-2-desc': 'Visualización clara del retorno de inversión solar para tus clientes.',
    'benefit-3-title': 'Gráficos Simplificados',
    'benefit-3-desc': 'Gráficos que simplifican conceptos técnicos para el cliente final.',
    'benefit-4-title': 'Posicionamiento SEO',
    'benefit-4-desc': 'Posicionamiento como experto en energía solar en Google.',
    'benefit-5-title': 'Optimización Mobile',
    'benefit-5-desc': 'Optimización total para celulares (donde ocurre el 80% del tráfico).',
    'benefit-6-title': 'Cotización Automática',
    'benefit-6-desc': 'Cotización en PDF automática que reemplaza al vendedor.',
    
    // Commercial Conditions
    'condition-1': 'Todo elemento adicional fuera del alcance descrito se cotiza por separado',
    'condition-2': 'Los pagos se hacen según avance de cada etapa',
    'condition-3': 'El proyecto puede entregarse en 3 a 5 semanas, dependiendo de la aprobación de contenidos y feedback',
    'condition-4': 'El precio incluye hosting básico por 3 meses si no se tiene dominio activo',
    
    // Commercial Conditions
    'conditions-pill': 'Condiciones Comerciales',
    'conditions-title': 'Términos Transparentes',
    
    // Closing
    'closing-title': 'Tu sitio web será más que una vitrina',
    'closing-text': 'Será un asesor de ventas digital, trabajando 24/7 por ti, incluso mientras estás en el techo instalando paneles.',
    'btn-aceptar': 'Aceptar Propuesta',
    
    // FAQ
    'faq-title': 'Preguntas Frecuentes',
    'faq-contact': '¿No encuentras la respuesta que buscas?',
    'btn-contactar': 'Contacta con nosotros',
    'faq-question-1': '¿Cuánto tiempo toma desarrollar mi proyecto?',
    'faq-answer-1': 'Los tiempos varían según la complejidad: Landing pages básicas (7-10 días), sitios corporativos (14-21 días), y aplicaciones complejas (30-45 días). Siempre mantenemos comunicación constante sobre el progreso.',
    'faq-question-2': '¿Qué tecnologías utilizan para el desarrollo?',
    'faq-answer-2': 'Usamos tecnologías modernas como React, Next.js, Node.js, Firebase, y herramientas de diseño como Figma y Webflow, según las necesidades del proyecto.',
    'faq-question-3': '¿Incluyen hosting y dominio en el precio?',
    'faq-answer-3': 'Sí, todos los planes incluyen hosting por 1 año. El dominio puede incluirse o gestionarse aparte según el plan y la preferencia del cliente.',
    'faq-question-4': '¿Ofrecen soporte después de la entrega?',
    'faq-answer-4': 'Sí, ofrecemos soporte post-entrega: 30 días para Starter, 3 meses para Professional, y opciones personalizadas para proyectos complejos.',
    'faq-question-5': '¿Puedo solicitar cambios durante el desarrollo?',
    'faq-answer-5': 'Sí, puedes solicitar cambios. Starter incluye 1 revisión, Professional incluye 3, y los proyectos personalizados se acuerdan según el alcance.',
    'faq-question-6': '¿Qué pasa si no estoy satisfecho con el resultado?',
    'faq-answer-6': 'Trabajamos contigo hasta que estés satisfecho dentro de las revisiones incluidas. Si hay desacuerdo, buscamos una solución justa y transparente.',
    'faq-question-7': '¿Pueden integrar mi sitio con sistemas existentes?',
    'faq-answer-7': 'Sí, realizamos integraciones con CRMs, ERPs, pasarelas de pago y otros sistemas según tus necesidades.',
    'faq-question-8': '¿Los sitios son optimizados para móviles?',
    'faq-answer-8': 'Todos nuestros sitios son 100% responsive y optimizados para móviles y tablets.',
    'faq-question-9': '¿Cómo es el proceso de pago?',
    'faq-answer-9': 'El pago se realiza en dos partes: 50% al iniciar y 50% al entregar el proyecto, salvo acuerdos especiales.',
    'faq-question-10': '¿Proporcionan capacitación para usar el sitio?',
    'faq-answer-10': 'Sí, ofrecemos capacitación básica para que puedas administrar tu sitio o tienda.',
    
    // Contact
    'contact-pill': '¿Aceptas la Propuesta?',
    'contact-title': '¿Listo para dar el siguiente paso?',
    'contact-subtitle': 'Completa el formulario para confirmar tu aceptación o solicitar ajustes a la propuesta.',
    'contact-name': 'Nombre completo *',
    'contact-email': 'Email *',
    'contact-phone': 'Teléfono',
    'contact-company': 'Empresa',
    'contact-decision': 'Decisión sobre la propuesta *',
    'contact-decision-1': 'Acepto la propuesta tal como está',
    'contact-decision-2': 'Acepto con algunos ajustes',
    'contact-decision-3': 'Necesito negociar términos',
    'contact-decision-4': 'No estoy interesado',
    'contact-message': 'Comentarios adicionales',
    'contact-placeholder': 'Describe cualquier ajuste que necesites, preguntas sobre la propuesta, o cualquier otra información relevante...',
    'btn-enviar': 'Enviar Respuesta',
    
    // Footer
    'footer-text': 'Transformamos ideas en activos digitales que venden. Especialistas en landing pages de alta conversión y desarrollo web profesional.',
    'footer-made': 'Hecho con amor y energía en Colombia',
    'footer-copyright': 'Todos los derechos reservados.',
    
    // Contact Benefits
    'benefit-info-1': 'Propuesta detallada y transparente',
    'benefit-info-2': 'Respuesta rápida en menos de 24 horas',
    'benefit-info-3': 'Experiencia con empresas colombianas',
    'benefit-info-4': 'Soporte en español',
    'benefit-info-5': 'Precios competitivos en pesos colombianos',
    
    // Language
    'lang-es': 'Español',
    'lang-en': 'English',
    
    // Mobile Menu
    'mobile-nav-detalles-title': 'Detalles',
    'mobile-nav-detalles-desc': 'Información del proyecto',
    'mobile-nav-faq-title': 'FAQ',
    'mobile-nav-faq-desc': 'Preguntas frecuentes',
    'mobile-nav-contacto-title': 'Contacto',
    'mobile-nav-contacto-desc': 'Ponte en contacto',
    'mobile-nav-asesorias-title': 'Asesorías',
    'mobile-nav-asesorias-desc': 'Consultoría especializada',
    'mobile-nav-agentes-title': 'Agentes',
    'mobile-nav-agentes-desc': 'Nuestro equipo'
  },
  en: {
    // Navigation
    'nav-servicios': 'Services',
    'nav-casos-exito': 'Success Cases',
    'nav-contacto': 'Contact',
    'nav-asesorias': 'Consulting',
    'nav-agentes': 'Agents',
    
    // Hero Section
    'hero-pill': 'Professional Web Development',
    'hero-title': 'Convert clicks into clients in 14 days',
    'hero-subtitle-1': 'Boost your business with converting web pages.',
    'hero-subtitle-2': 'Irresistible landing pages to capture more clients.',
    'hero-subtitle-3': 'We develop your digital presence in record time.',
    'hero-subtitle-4': 'Your website, your best 24/7 salesperson.',
    'hero-banner': 'Take your business to sell 24/7 from day 1',
    'stat-proyectos': 'Completed Projects',
    'stat-satisfaccion': 'Client Satisfaction',
    'stat-entrega': 'Average Delivery',
    'btn-empezar': 'Start my project',
    'btn-ver-servicios': 'See our services',
    
    // Quotation Page
    'quote-pill': 'Commercial Proposal',
    'quote-title': 'Professional Website Construction',
    'quote-subtitle-1': 'Design, development and optimization of website focused on lead generation.',
    'quote-subtitle-2': 'Marketing and conversion for solar panel companies.',
    'quote-subtitle-3': 'Interactive solar calculator with savings estimation.',
    'quote-subtitle-4': 'Your website, your best 24/7 salesperson.',
    'stat-inversion': 'Total Investment',
    'stat-etapas': 'Development Stages',
    'stat-semanas': 'Delivery Weeks',
    'btn-detalles': 'See Complete Details',
    'btn-ajustes': 'Request Adjustments',
    
    // Investment
    'investment-title': 'Total Estimated Investment',
    'investment-note': 'This value may vary if functionalities not contemplated in this agreement are added',
    
    // Project Objective
    'objective-pill': 'Project Objective',
    'objective-title': 'Create a Professional Website',
    'objective-subtitle': 'Responsive website, optimized for mobile, with commercial focus that allows attracting clients, calculating energy savings and visualizing benefits clearly and convincingly.',
    
    // Development Stages
    'stages-pill': 'Deliverables by Stages',
    'stages-title': 'Development Process',
    'stages-subtitle': 'Each stage includes specific payments and clear deliverables to ensure transparency and quality.',
    
    // Stage 1
    'stage1-title': 'Stage 1 – Strategy and Structure',
    'stage1-price': 'Initial payment: $800,000',
    'stage1-meta': 'Align brand vision + clear design + conversion strategy',
    'stage1-feature-1': 'Discovery meeting and objective definition',
    'stage1-feature-2': 'Site information architecture',
    'stage1-feature-3': 'Page structure wireframes',
    'stage1-feature-4': 'Persuasive text writing (copywriting optimized for conversion and local SEO)',
    'stage1-feature-5': 'Initial visual design focused on mobile-first version',
    'stage1-feature-6': 'Direct contact form to WhatsApp or email',
    
    // Stage 2
    'stage2-title': 'Stage 2 – Development and Functionality',
    'stage2-price': 'Payment: $1,600,000',
    'stage2-meta': 'Have the site functional, visual, reliable and conversion-focused',
    'stage2-feature-1': 'Complete site development with Home, Services, Projects, Testimonials and Contact sections',
    'stage2-feature-2': 'Implementation of client-tailored algorithm for interactive solar calculator (address + average bill)',
    'stage2-feature-3': 'Automatic circular graphics (Pie Charts) with savings estimation',
    'stage2-feature-4': 'Speed optimization, technical SEO, and mobile responsiveness',
    'stage2-feature-5': 'Implementation of tracking with Analytics and events (if applicable)',
    'stage2-feature-6': 'UX/UI review by QA specialist (Karen)',
    
    // Stage 3
    'stage3-title': 'Stage 3 – Professionalization + Marketing',
    'stage3-price': 'Final payment: $1,600,000',
    'stage3-meta': 'Complete, convincing, sellable and scalable site',
    'stage3-feature-1': 'Automatic generation of downloadable PDF quotation, with logo, estimated consumption and savings',
    'stage3-feature-2': 'Integration with Google Maps, testimonials and visual iconography',
    'stage3-feature-3': 'Self-manageable blog to attract organic traffic (SEO inbound)',
    'stage3-feature-4': 'Google Business registration + basic local SEO configuration',
    'stage3-feature-5': 'Personalized advice for digital marketing campaigns',
    'stage3-feature-6': 'Technical support and minor post-launch adjustments (15 days)',
    
    // Benefits
    'benefits-pill': 'Benefits with Marketing Focus',
    'benefits-title': 'Why Choose Us?',
    'benefit-1-title': 'Automatic Lead Capture',
    'benefit-1-desc': 'Automatic capture of qualified leads 24 hours a day.',
    'benefit-2-title': 'Visual ROI',
    'benefit-2-desc': 'Clear visualization of solar investment return for your clients.',
    'benefit-3-title': 'Simplified Graphics',
    'benefit-3-desc': 'Graphics that simplify technical concepts for the end client.',
    'benefit-4-title': 'SEO Positioning',
    'benefit-4-desc': 'Positioning as a solar energy expert on Google.',
    'benefit-5-title': 'Mobile Optimization',
    'benefit-5-desc': 'Total optimization for mobile phones (where 80% of traffic occurs).',
    'benefit-6-title': 'Automatic Quotation',
    'benefit-6-desc': 'Automatic PDF quotation that replaces the salesperson.',
    
    // Commercial Conditions
    'condition-1': 'Any additional element outside the described scope is quoted separately',
    'condition-2': 'Payments are made according to the progress of each stage',
    'condition-3': 'The project can be delivered in 3 to 5 weeks, depending on content approval and feedback',
    'condition-4': 'The price includes basic hosting for 3 months if there is no active domain',
    
    // Commercial Conditions
    'conditions-pill': 'Commercial Conditions',
    'conditions-title': 'Transparent Terms',
    
    // Closing
    'closing-title': 'Your website will be more than a showcase',
    'closing-text': 'It will be a digital sales advisor, working 24/7 for you, even while you are on the roof installing panels.',
    'btn-aceptar': 'Accept Proposal',
    
    // FAQ
    'faq-title': 'Frequently Asked Questions',
    'faq-contact': "Can't find the answer you're looking for?",
    'btn-contactar': 'Contact us',
    'faq-question-1': 'How long does it take to develop my project?',
    'faq-answer-1': 'Times vary according to complexity: Basic landing pages (7-10 days), corporate sites (14-21 days), and complex applications (30-45 days). We always maintain constant communication about progress.',
    'faq-question-2': 'What technologies do you use for development?',
    'faq-answer-2': 'We use modern technologies like React, Next.js, Node.js, Firebase, and design tools like Figma and Webflow, according to project needs.',
    'faq-question-3': 'Do you include hosting and domain in the price?',
    'faq-answer-3': 'Yes, all plans include hosting for 1 year. The domain can be included or managed separately according to the plan and client preference.',
    'faq-question-4': 'Do you offer support after delivery?',
    'faq-answer-4': 'Yes, we offer post-delivery support: 30 days for Starter, 3 months for Professional, and custom options for complex projects.',
    'faq-question-5': 'Can I request changes during development?',
    'faq-answer-5': 'Yes, you can request changes. Starter includes 1 revision, Professional includes 3, and custom projects are agreed upon according to scope.',
    'faq-question-6': 'What happens if I\'m not satisfied with the result?',
    'faq-answer-6': 'We work with you until you\'re satisfied within the included revisions. If there\'s disagreement, we seek a fair and transparent solution.',
    'faq-question-7': 'Can you integrate my site with existing systems?',
    'faq-answer-7': 'Yes, we perform integrations with CRMs, ERPs, payment gateways and other systems according to your needs.',
    'faq-question-8': 'Are the sites optimized for mobile?',
    'faq-answer-8': 'All our sites are 100% responsive and optimized for mobile phones and tablets.',
    'faq-question-9': 'How is the payment process?',
    'faq-answer-9': 'Payment is made in two parts: 50% to start and 50% when delivering the project, except for special agreements.',
    'faq-question-10': 'Do you provide training to use the site?',
    'faq-answer-10': 'Yes, we offer basic training so you can manage your site or store.',
    
    // Contact
    'contact-pill': 'Do You Accept the Proposal?',
    'contact-title': 'Ready to take the next step?',
    'contact-subtitle': 'Complete the form to confirm your acceptance or request adjustments to the proposal.',
    'contact-name': 'Full name *',
    'contact-email': 'Email *',
    'contact-phone': 'Phone',
    'contact-company': 'Company',
    'contact-decision': 'Decision on the proposal *',
    'contact-decision-1': 'I accept the proposal as is',
    'contact-decision-2': 'I accept with some adjustments',
    'contact-decision-3': 'I need to negotiate terms',
    'contact-decision-4': 'I am not interested',
    'contact-message': 'Additional comments',
    'contact-placeholder': 'Describe any adjustments you need, questions about the proposal, or any other relevant information...',
    'btn-enviar': 'Send Response',
    
    // Footer
    'footer-text': 'We transform ideas into digital assets that sell. Specialists in high-conversion landing pages and professional web development.',
    'footer-made': 'Made with love and energy in Colombia',
    'footer-copyright': 'All rights reserved.',
    
    // Contact Benefits
    'benefit-info-1': 'Detailed and transparent proposal',
    'benefit-info-2': 'Quick response in less than 24 hours',
    'benefit-info-3': 'Experience with Colombian companies',
    'benefit-info-4': 'Support in Spanish',
    'benefit-info-5': 'Competitive prices in Colombian pesos',
    
    // Language
    'lang-es': 'Español',
    'lang-en': 'English',
    
    // Mobile Menu
    'mobile-nav-detalles-title': 'Details',
    'mobile-nav-detalles-desc': 'Project information',
    'mobile-nav-faq-title': 'FAQ',
    'mobile-nav-faq-desc': 'Frequently asked questions',
    'mobile-nav-contacto-title': 'Contact',
    'mobile-nav-contacto-desc': 'Get in touch',
    'mobile-nav-asesorias-title': 'Consulting',
    'mobile-nav-asesorias-desc': 'Specialized consulting',
    'mobile-nav-agentes-title': 'Agents',
    'mobile-nav-agentes-desc': 'Our team'
  }
};

// ——— Language switching function ———
function switchLanguage(lang) {
  const currentLang = lang || 'es';
  localStorage.setItem('language', currentLang);
  
  // Update all translatable elements
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[currentLang][key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[currentLang][key];
      } else {
        element.textContent = translations[currentLang][key];
      }
    }
  });
  
  // Update language button text
  const langBtn = document.getElementById('language-toggle');
  if (langBtn) {
    langBtn.textContent = currentLang === 'es' ? 'EN' : 'ES';
    langBtn.setAttribute('data-lang', currentLang === 'es' ? 'en' : 'es');
  }
  
  // Update document language
  document.documentElement.lang = currentLang;
  
  // Dispatch custom event for language change
  document.dispatchEvent(new CustomEvent('languageChanged'));
}

// ——— Helper para animaciones y scroll (tu código existente) ———
document.addEventListener('DOMContentLoaded', () => {

  // Initialize language
  const savedLang = localStorage.getItem('language') || 'es';
  switchLanguage(savedLang);

  // Language toggle
  const langBtn = document.getElementById('language-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const currentLang = langBtn.getAttribute('data-lang') || 'en';
      switchLanguage(currentLang);
    });
  }

  // Instant scrolling (no smooth behavior)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href'))
        .scrollIntoView({ behavior: 'auto' });
    });
  });

  // Efecto en header
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 50
      ? '0 2px 10px rgba(0,0,0,0.07)'
      : 'none';
  });

  // Scroll animations
  const scrollObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    scrollObserver.observe(el);
  });

  // ——— Envío de formulario ———
  document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.timestamp = new Date();

    // Guarda en Firestore
    try {
      const docRef = await addDoc(collection(db, 'contacts'), data);
      console.log('Documento creado con ID:', docRef.id);
      alert('Gracias por tu mensaje. Te contactaremos pronto.');
      e.target.reset();
    } catch (err) {
      console.error('Error guardando en Firestore:', err);
      alert('Hubo un error al enviar tu mensaje. Intenta de nuevo.');
    }
  });

  // Animate hero title on load
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.classList.add('hero-title-animate');
  }

  // Dark/Light mode toggle (unified logic) - Dark mode by default
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  
  // Set dark mode as default unless user explicitly chose light mode
  if (saved === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
  }
  
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // === MouseFollower sticky logic for hero section (with debug) ===
  let mf;
  let stuck = false;

  // Initialize MouseFollower only once!
  if (window.MouseFollower) {
    mf = new MouseFollower({
      container: document.querySelector('.hero'),
      visible: true,
      speed: 0.35,
      ease: 'expo.out',
      skewing: 0.1,
      className: 'mf-cursor',
      innerClassName: 'mf-cursor-inner',
    });
    window.mf = mf;
  }

  const heroSection = document.querySelector('.hero');

  function stickCursorToCorner() {
    if (mf && !stuck) {
      if (typeof mf.setPosition === 'function') {
        mf.setPosition({ x: 40, y: window.innerHeight - 40 });
      }
      if (typeof mf.lock === 'function') {
        mf.lock();
      }
      stuck = true;
    }
  }

  function releaseCursor() {
    if (mf && stuck) {
      if (typeof mf.unlock === 'function') {
        mf.unlock();
      }
      stuck = false;
    }
  }

  if (heroSection && window.MouseFollower) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          stickCursorToCorner();
        } else {
          releaseCursor();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(heroSection);
  }

  window.addEventListener('resize', () => {
    if (stuck && mf && typeof mf.setPosition === 'function') {
      mf.setPosition({ x: 40, y: window.innerHeight - 40 });
    }
  });
});

// Enhanced JavaScript for improved UI/UX
document.addEventListener('DOMContentLoaded', function() {
    
    // Enhanced Scroll Animations with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Add staggered animation for cards
                if (entry.target.classList.contains('pricing-cards-container') || 
                    entry.target.classList.contains('services-cards-container')) {
                    const cards = entry.target.querySelectorAll('.pricing-card, .service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all animate-on-scroll elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Enhanced Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Add loading states
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"], .cta-button.full-width');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Enviando...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.textContent = '¡Enviado!';
                submitBtn.classList.remove('loading');
                submitBtn.style.background = 'var(--teal-gradient)';
                
                // Reset form
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });

        // Enhanced form validation and feedback
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Add floating label effect
            if (input.type !== 'submit') {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('focused');
                    }
                });
                
                // Real-time validation
                input.addEventListener('input', function() {
                    validateField(this);
                });
            }
        });
    }

    // Enhanced Accordion with smooth animations
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const content = item.querySelector('.accordion-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');
                
                // Close all other items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        if (otherContent) {
                            otherContent.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                    content.style.maxHeight = '0';
                } else {
                    item.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // Enhanced Navigation with instant scrolling
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'auto'
                });
            }
        });
    });

    // Enhanced WhatsApp Button with better interaction
    const whatsappBtn = document.querySelector('.whatsapp-button-container');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Open WhatsApp with pre-filled message
            const message = encodeURIComponent('Hola! Me interesa conocer más sobre sus servicios.');
            const whatsappUrl = `https://wa.me/573001234567?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Enhanced Card Hover Effects
    const cards = document.querySelectorAll('.pricing-card, .service-card, .contact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced Button Interactions
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Enhanced Accessibility Features
    // Add keyboard navigation for cards
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });

    // Enhanced Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--cta-gradient);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Enhanced Performance: Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Enhanced Error Handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // You could send this to an error tracking service
    });

    // Enhanced Mobile Experience
    if ('ontouchstart' in window) {
        // Add touch-specific enhancements
        document.body.classList.add('touch-device');
        
        // Improve touch targets
        const touchTargets = document.querySelectorAll('button, a, .cta-button');
   
    }
});

// Enhanced Form Validation
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Remove existing error states
    field.classList.remove('error', 'success');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Validation rules
    if (fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor ingresa un email válido';
        }
    } else if (fieldType === 'tel') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Por favor ingresa un número de teléfono válido';
        }
    } else if (field.required && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    }
    
    // Apply validation state
    if (value) {
        if (isValid) {
            field.classList.add('success');
        } else {
            field.classList.add('error');
            showErrorMessage(field, errorMessage);
        }
    }
}

function showErrorMessage(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    field.parentElement.appendChild(errorDiv);
}

// Enhanced Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced Analytics (if needed)
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom event tracking
    console.log('Event tracked:', eventName, eventData);
}

// Enhanced Performance Monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
        }
    }
});

performanceObserver.observe({ entryTypes: ['navigation'] });

// Make translations globally available and dispatch event
window.translations = translations;
document.dispatchEvent(new Event('translationsLoaded'));
