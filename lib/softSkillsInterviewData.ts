/**
 * Soft Skills Interview Questions for Developers
 * 60 bilingual (EN/ES) recruiter-grade behavioral interview questions
 * covering frameworks, sample answers, common mistakes, and follow-ups.
 */

export type SoftSkillCategory =
  | "Communication"
  | "Teamwork"
  | "Problem Solving"
  | "Leadership"
  | "Adaptability"
  | "Conflict Resolution"
  | "Time Management"
  | "Growth Mindset"
  | "Culture Fit"
  | "Career & Recruiter";

export type SoftSkillDifficulty = "Junior" | "Mid" | "Senior";

export type Lang = "en" | "es";

export interface Bilingual {
  en: string;
  es: string;
}

export interface BilingualList {
  en: string[];
  es: string[];
}

export interface SoftSkillQuestion {
  id: string;
  questionNumber: number;
  difficulty: SoftSkillDifficulty;
  category: SoftSkillCategory;
  title: Bilingual;
  question: Bilingual;
  context: Bilingual;
  whyAsked: Bilingual;
  commonMistakes: BilingualList;
  answerFramework: Bilingual;
  sampleAnswer: Bilingual;
  keyPoints: BilingualList;
  followUpQuestions: BilingualList;
}

// ============ Localized Category & Difficulty Labels ============

export const CATEGORY_LABELS: Record<SoftSkillCategory, Bilingual> = {
  Communication: { en: "Communication", es: "Comunicación" },
  Teamwork: { en: "Teamwork", es: "Trabajo en Equipo" },
  "Problem Solving": { en: "Problem Solving", es: "Resolución de Problemas" },
  Leadership: { en: "Leadership", es: "Liderazgo" },
  Adaptability: { en: "Adaptability", es: "Adaptabilidad" },
  "Conflict Resolution": { en: "Conflict Resolution", es: "Resolución de Conflictos" },
  "Time Management": { en: "Time Management", es: "Gestión del Tiempo" },
  "Growth Mindset": { en: "Growth Mindset", es: "Mentalidad de Crecimiento" },
  "Culture Fit": { en: "Culture Fit", es: "Ajuste Cultural" },
  "Career & Recruiter": { en: "Career & Recruiter", es: "Carrera y Reclutamiento" },
};

export const DIFFICULTY_LABELS: Record<SoftSkillDifficulty, Bilingual> = {
  Junior: { en: "Junior", es: "Junior" },
  Mid: { en: "Mid", es: "Intermedio" },
  Senior: { en: "Senior", es: "Senior" },
};

export const SOFT_SKILLS_QUESTIONS: SoftSkillQuestion[] = [
  // ============ Communication (1-5) ============
  {
    id: "ss-1-explain-technical-concept",
    questionNumber: 1,
    difficulty: "Mid",
    category: "Communication",
    title: {
      en: "Explain a Technical Concept to Non-Technical Stakeholders",
      es: "Explicar un Concepto Técnico a Stakeholders No Técnicos",
    },
    question: {
      en: "Tell me about a time when you had to explain a complex technical concept to a non-technical stakeholder. How did you approach it?",
      es: "Cuéntame sobre una ocasión en la que tuviste que explicar un concepto técnico complejo a un stakeholder no técnico. ¿Cómo lo abordaste?",
    },
    context: {
      en: "Developers often need to communicate with product managers, designers, clients, or executives who may not have technical backgrounds. This question assesses your ability to bridge the communication gap.",
      es: "Los desarrolladores suelen comunicarse con product managers, diseñadores, clientes o ejecutivos sin formación técnica. Esta pregunta evalúa tu capacidad para cerrar la brecha de comunicación.",
    },
    whyAsked: {
      en: "Interviewers want to see if you can simplify complexity without being condescending, use appropriate analogies, and ensure understanding.",
      es: "Los entrevistadores quieren ver si puedes simplificar la complejidad sin ser condescendiente, usar analogías apropiadas y asegurar la comprensión.",
    },
    commonMistakes: {
      en: [
        "Using too much jargon or technical terms without explanation",
        "Being condescending or impatient",
        "Giving a vague answer without a specific example",
        "Not checking for understanding",
      ],
      es: [
        "Usar demasiada jerga o términos técnicos sin explicación",
        "Ser condescendiente o impaciente",
        "Dar una respuesta vaga sin un ejemplo concreto",
        "No verificar que la otra persona entendió",
      ],
    },
    answerFramework: {
      en: "Use the STAR method: Situation (set the scene), Task (what needed to be communicated), Action (your approach), Result (outcome and feedback received).",
      es: "Usa el método STAR: Situación (contexto), Tarea (qué necesitabas comunicar), Acción (tu enfoque), Resultado (desenlace y feedback recibido).",
    },
    sampleAnswer: {
      en: `In my previous role, our team needed approval from the marketing department to migrate our email system to a new API. The marketing team was concerned about potential disruptions.

I scheduled a 30-minute meeting where I used the analogy of switching from a local post office to a courier service. I explained that while both deliver mail, the courier (new API) offers tracking, faster delivery, and better reliability.

I created a simple visual diagram showing the before/after flow, avoiding technical terms like 'REST endpoints' or 'webhooks.' Instead, I used phrases like 'automatic notifications' and 'real-time status updates.'

After the presentation, the marketing manager said it was the clearest technical explanation she'd received. We got approval that day, and the migration was completed with zero complaints from the marketing team.`,
      es: `En mi rol anterior, nuestro equipo necesitaba la aprobación del departamento de marketing para migrar el sistema de correo a una nueva API. Marketing estaba preocupado por posibles interrupciones.

Agendé una reunión de 30 minutos donde usé la analogía de cambiar una oficina postal local por un servicio de mensajería. Expliqué que, aunque ambos entregan correo, el mensajero (nueva API) ofrece rastreo, entrega más rápida y mayor fiabilidad.

Creé un diagrama visual sencillo mostrando el flujo antes/después, evitando términos como 'endpoints REST' o 'webhooks'. En su lugar, usé frases como 'notificaciones automáticas' y 'actualizaciones en tiempo real'.

Tras la presentación, la gerente de marketing dijo que fue la explicación técnica más clara que había recibido. Obtuvimos la aprobación ese mismo día y la migración se completó sin una sola queja de marketing.`,
    },
    keyPoints: {
      en: [
        "Choose relatable analogies from everyday life",
        "Use visual aids when possible",
        "Avoid jargon or define it simply",
        "Check for understanding with questions",
        "Focus on benefits, not implementation details",
      ],
      es: [
        "Elige analogías cercanas a la vida cotidiana",
        "Usa apoyos visuales cuando sea posible",
        "Evita la jerga o defínela de forma sencilla",
        "Verifica comprensión con preguntas",
        "Enfócate en beneficios, no en detalles de implementación",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you know when your explanation was successful?",
        "What do you do if they still don't understand after your explanation?",
        "How do you handle questions you don't immediately know the answer to?",
      ],
      es: [
        "¿Cómo sabes cuándo tu explicación fue exitosa?",
        "¿Qué haces si aún no entienden después de tu explicación?",
        "¿Cómo manejas preguntas cuya respuesta no conoces al instante?",
      ],
    },
  },
  {
    id: "ss-2-disagree-with-colleague",
    questionNumber: 2,
    difficulty: "Mid",
    category: "Communication",
    title: {
      en: "Disagreeing with a Colleague's Approach",
      es: "Discrepar con el Enfoque de un Colega",
    },
    question: {
      en: "Describe a time when you disagreed with a colleague's technical approach. How did you handle it?",
      es: "Describe una ocasión en la que discrepaste con el enfoque técnico de un colega. ¿Cómo lo manejaste?",
    },
    context: {
      en: "Healthy disagreement is normal in software development. This question evaluates your ability to express differing opinions constructively while maintaining professional relationships.",
      es: "El desacuerdo sano es normal en el desarrollo de software. Esta pregunta evalúa tu capacidad para expresar opiniones diferentes de forma constructiva manteniendo buenas relaciones profesionales.",
    },
    whyAsked: {
      en: "Teams with diverse perspectives build better software. Interviewers want to see you can disagree respectfully and find common ground.",
      es: "Los equipos con perspectivas diversas construyen mejor software. Los entrevistadores quieren ver que puedes discrepar con respeto y encontrar puntos en común.",
    },
    commonMistakes: {
      en: [
        "Describing the colleague negatively or blaming them",
        "Saying you always avoid conflict",
        "Not showing how you sought to understand their perspective",
        "Focusing only on being 'right'",
      ],
      es: [
        "Describir al colega de forma negativa o culparlo",
        "Decir que siempre evitas el conflicto",
        "No mostrar que buscaste entender su perspectiva",
        "Enfocarte sólo en tener 'la razón'",
      ],
    },
    answerFramework: {
      en: "Focus on: Understanding their perspective first, presenting your concerns with data/examples, finding common ground, and the collaborative resolution.",
      es: "Enfócate en: entender primero su perspectiva, presentar tus inquietudes con datos/ejemplos, encontrar puntos en común y la resolución colaborativa.",
    },
    sampleAnswer: {
      en: `During a code review, a senior colleague proposed using a complex microservices architecture for a feature that I believed could be built more simply as a monolithic module.

Instead of immediately pushing back, I asked questions to understand his reasoning. He was concerned about future scalability. I acknowledged that was valid, then shared my concern about the added complexity for our small team.

I proposed we document both approaches with pros/cons and present them to the team lead. We created a brief technical comparison showing timelines, maintenance overhead, and scalability tradeoffs.

The team decided on a modular monolith approach that could be extracted into services later if needed. My colleague appreciated that I validated his concerns, and we actually became better collaborators after that.`,
      es: `En una revisión de código, un colega senior propuso usar una arquitectura compleja de microservicios para una funcionalidad que yo creía que podía hacerse de forma más simple como un módulo monolítico.

En lugar de oponerme de inmediato, hice preguntas para entender su razonamiento. Le preocupaba la escalabilidad futura. Reconocí que era válido y luego compartí mi preocupación por la complejidad añadida para nuestro equipo pequeño.

Propuse documentar ambos enfoques con pros/contras y presentarlos al tech lead. Creamos una comparación técnica breve mostrando tiempos, carga de mantenimiento y trade-offs de escalabilidad.

El equipo eligió un monolito modular que podía extraerse a servicios después si era necesario. Mi colega valoró que validara sus preocupaciones, y terminamos siendo mejores colaboradores.`,
    },
    keyPoints: {
      en: [
        "Seek to understand before being understood",
        "Use 'I' statements instead of 'you' accusations",
        "Back opinions with data or examples",
        "Propose alternatives rather than just criticizing",
        "Focus on the best outcome for the project, not winning",
      ],
      es: [
        "Busca entender antes de ser entendido",
        "Usa frases en primera persona en vez de acusaciones",
        "Respalda tus opiniones con datos o ejemplos",
        "Propón alternativas en vez de sólo criticar",
        "Enfócate en el mejor resultado para el proyecto, no en ganar",
      ],
    },
    followUpQuestions: {
      en: [
        "What if they had refused to consider your perspective?",
        "How do you handle disagreements with more senior team members?",
        "Have you ever been wrong in a technical disagreement? What did you learn?",
      ],
      es: [
        "¿Qué habrías hecho si se negara a considerar tu perspectiva?",
        "¿Cómo manejas desacuerdos con miembros más senior?",
        "¿Alguna vez te equivocaste en un desacuerdo técnico? ¿Qué aprendiste?",
      ],
    },
  },
  {
    id: "ss-3-receive-critical-feedback",
    questionNumber: 3,
    difficulty: "Junior",
    category: "Communication",
    title: {
      en: "Receiving Critical Feedback",
      es: "Recibir Feedback Crítico",
    },
    question: {
      en: "Tell me about a time you received critical feedback on your work. How did you respond?",
      es: "Cuéntame sobre una vez que recibiste feedback crítico sobre tu trabajo. ¿Cómo respondiste?",
    },
    context: {
      en: "Code reviews, performance reviews, and retrospectives are opportunities for growth. This question assesses your emotional intelligence and growth mindset.",
      es: "Las revisiones de código, evaluaciones de desempeño y retrospectivas son oportunidades de crecimiento. Esta pregunta evalúa tu inteligencia emocional y mentalidad de crecimiento.",
    },
    whyAsked: {
      en: "Interviewers want to ensure you can accept feedback gracefully, learn from it, and implement changes without becoming defensive.",
      es: "Los entrevistadores quieren asegurarse de que puedes aceptar feedback con madurez, aprender de él e implementar cambios sin ponerte a la defensiva.",
    },
    commonMistakes: {
      en: [
        "Describing feedback as unfair or unwarranted",
        "Not showing how you actually changed behavior",
        "Being defensive in your answer",
        "Giving an example where you were obviously right",
      ],
      es: [
        "Describir el feedback como injusto o inmerecido",
        "No mostrar que realmente cambiaste tu comportamiento",
        "Mostrarte a la defensiva en tu respuesta",
        "Dar un ejemplo donde claramente tenías la razón",
      ],
    },
    answerFramework: {
      en: "Structure: The feedback received, your initial reaction, how you processed it, actions you took, and the positive outcome.",
      es: "Estructura: el feedback recibido, tu reacción inicial, cómo lo procesaste, las acciones que tomaste y el resultado positivo.",
    },
    sampleAnswer: {
      en: `During a code review, a senior developer told me that my code was 'clever but unmaintainable.' Initially, I felt defensive because I'd spent hours optimizing the solution.

I took a step back and asked her to elaborate. She pointed out that my nested ternaries and one-liners were hard to follow. She said, 'Code is read more than it's written.'

Instead of arguing, I asked if she could show me how she'd approach the same problem. She refactored my 10-line function into 25 lines with clear variable names and comments.

I adopted her approach going forward. Three months later, when I had to debug that same code, I was grateful for the readability. Now I follow the principle that explicit is better than implicit, and I actually mentor others on this.`,
      es: `En una revisión de código, una desarrolladora senior me dijo que mi código era 'ingenioso pero difícil de mantener'. Al principio me puse a la defensiva porque había invertido horas optimizando la solución.

Di un paso atrás y le pedí que me explicara más. Señaló que mis ternarios anidados y one-liners eran difíciles de seguir. Dijo: 'El código se lee más veces de las que se escribe'.

En lugar de discutir, le pedí que me mostrara cómo abordaría ella el mismo problema. Refactorizó mi función de 10 líneas a 25 con nombres claros y comentarios.

Adopté su enfoque desde entonces. Tres meses después, cuando tuve que depurar ese mismo código, agradecí la legibilidad. Ahora sigo el principio de que lo explícito es mejor que lo implícito, y hasta mentorizo a otros en esto.`,
    },
    keyPoints: {
      en: [
        "Show emotional maturity in your initial reaction",
        "Ask clarifying questions to understand fully",
        "Demonstrate concrete changes you made",
        "Highlight the positive outcome",
        "Show you value feedback as a growth opportunity",
      ],
      es: [
        "Muestra madurez emocional en tu reacción inicial",
        "Haz preguntas aclaratorias para entender completamente",
        "Demuestra cambios concretos que hiciste",
        "Destaca el resultado positivo",
        "Muestra que valoras el feedback como oportunidad de crecimiento",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you differentiate between valid feedback and unfair criticism?",
        "How do you give critical feedback to others?",
        "What's the most impactful feedback you've ever received?",
      ],
      es: [
        "¿Cómo distingues entre feedback válido y crítica injusta?",
        "¿Cómo das feedback crítico a otros?",
        "¿Cuál es el feedback más impactante que has recibido?",
      ],
    },
  },
  {
    id: "ss-4-communicate-bad-news",
    questionNumber: 4,
    difficulty: "Senior",
    category: "Communication",
    title: {
      en: "Communicating Bad News to Stakeholders",
      es: "Comunicar Malas Noticias a los Stakeholders",
    },
    question: {
      en: "Describe a situation where you had to deliver bad news to a stakeholder or manager. How did you handle it?",
      es: "Describe una situación en la que tuviste que dar malas noticias a un stakeholder o manager. ¿Cómo la manejaste?",
    },
    context: {
      en: "Projects don't always go as planned. Timelines slip, bugs emerge, and requirements change. This question assesses your integrity and communication skills under pressure.",
      es: "Los proyectos no siempre salen según lo planeado. Los plazos se retrasan, aparecen bugs y los requisitos cambian. Esta pregunta evalúa tu integridad y habilidades de comunicación bajo presión.",
    },
    whyAsked: {
      en: "Transparency and early communication prevent small issues from becoming crises. Interviewers want to see you take ownership rather than hide problems.",
      es: "La transparencia y la comunicación temprana evitan que los problemas pequeños se conviertan en crisis. Los entrevistadores quieren ver que tomas responsabilidad en vez de ocultar problemas.",
    },
    commonMistakes: {
      en: [
        "Blaming others or external factors entirely",
        "Describing hiding the issue until it became critical",
        "Not having any solution or mitigation to propose",
        "Being overly apologetic without taking action",
      ],
      es: [
        "Culpar totalmente a otros o a factores externos",
        "Describir cómo ocultaste el problema hasta que se volvió crítico",
        "No tener ninguna solución o mitigación que proponer",
        "Disculparte en exceso sin tomar acción",
      ],
    },
    answerFramework: {
      en: "Structure: The bad news, when and how you communicated it, the solutions you proposed, and the outcome.",
      es: "Estructura: la mala noticia, cuándo y cómo la comunicaste, las soluciones que propusiste y el resultado.",
    },
    sampleAnswer: {
      en: `Two weeks before a product launch, I discovered a significant security vulnerability in our authentication flow. Fixing it properly would require delaying the launch by at least a week.

I documented the issue, its potential impact, and three options: delay the launch, launch with a temporary fix and immediate follow-up patch, or limit the initial rollout to reduce risk exposure.

I scheduled a call with my manager within an hour of the discovery. I presented the facts clearly, took responsibility for not catching it earlier in testing, and walked through the options with my recommendations.

My manager appreciated the early notification and thorough analysis. We chose to delay by five days with a limited soft launch. The client was initially disappointed but later thanked us for prioritizing security over speed.`,
      es: `Dos semanas antes del lanzamiento de un producto, descubrí una vulnerabilidad de seguridad importante en el flujo de autenticación. Corregirla correctamente requería retrasar el lanzamiento al menos una semana.

Documenté el problema, su impacto potencial y tres opciones: retrasar el lanzamiento, lanzar con un parche temporal y un fix posterior, o limitar el rollout inicial para reducir la exposición al riesgo.

Agendé una llamada con mi manager en la primera hora tras el descubrimiento. Presenté los hechos con claridad, asumí responsabilidad por no detectarlo antes en pruebas y recorrí las opciones con mis recomendaciones.

Mi manager valoró el aviso temprano y el análisis. Decidimos retrasar cinco días con un soft launch limitado. El cliente se decepcionó al inicio, pero luego nos agradeció priorizar la seguridad sobre la velocidad.`,
    },
    keyPoints: {
      en: [
        "Communicate early rather than hoping problems resolve",
        "Come prepared with facts and options",
        "Take appropriate responsibility",
        "Focus on solutions, not just the problem",
        "Follow up after the situation is resolved",
      ],
      es: [
        "Comunica pronto en vez de esperar que el problema se resuelva solo",
        "Llega preparado con hechos y opciones",
        "Asume la responsabilidad que corresponda",
        "Enfócate en soluciones, no sólo en el problema",
        "Haz seguimiento después de resolver la situación",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you decide when to escalate issues?",
        "What if your manager had pushed back on delaying?",
        "How do you prevent similar issues in the future?",
      ],
      es: [
        "¿Cómo decides cuándo escalar un problema?",
        "¿Qué habrías hecho si tu manager se oponía al retraso?",
        "¿Cómo previenes problemas similares a futuro?",
      ],
    },
  },
  {
    id: "ss-5-written-communication",
    questionNumber: 5,
    difficulty: "Mid",
    category: "Communication",
    title: {
      en: "Effective Written Communication",
      es: "Comunicación Escrita Efectiva",
    },
    question: {
      en: "How do you ensure your written communication (emails, documentation, Slack messages) is effective? Give an example.",
      es: "¿Cómo aseguras que tu comunicación escrita (correos, documentación, mensajes de Slack) sea efectiva? Da un ejemplo.",
    },
    context: {
      en: "Remote work and async communication make written skills essential. This question evaluates your ability to communicate clearly and efficiently in writing.",
      es: "El trabajo remoto y la comunicación asíncrona hacen esenciales las habilidades escritas. Esta pregunta evalúa tu capacidad para comunicar con claridad y eficiencia por escrito.",
    },
    whyAsked: {
      en: "Poor written communication causes confusion, delays, and friction. Interviewers want to see you can write clearly for different audiences.",
      es: "La mala comunicación escrita causa confusión, retrasos y fricción. Los entrevistadores quieren ver que escribes con claridad para distintas audiencias.",
    },
    commonMistakes: {
      en: [
        "Saying you just write naturally without thought",
        "Not providing a specific example",
        "Ignoring the importance of context and audience",
        "Focusing only on grammar/spelling",
      ],
      es: [
        "Decir que simplemente escribes 'de forma natural'",
        "No dar un ejemplo concreto",
        "Ignorar la importancia del contexto y la audiencia",
        "Enfocarte sólo en gramática/ortografía",
      ],
    },
    answerFramework: {
      en: "Discuss your process: audience consideration, structure, review, and a specific example with its positive outcome.",
      es: "Habla de tu proceso: consideración de la audiencia, estructura, revisión y un ejemplo concreto con su resultado positivo.",
    },
    sampleAnswer: {
      en: `When writing technical documentation, I follow a structured approach. For a recent API documentation project, I started by identifying my audiences: developers integrating the API, and support staff troubleshooting issues.

For each endpoint, I used a consistent template: what it does (one sentence), when to use it, required parameters with examples, success/error responses, and common gotchas.

I had a colleague with less API experience review it before publishing. She pointed out two areas where I'd assumed knowledge that beginners wouldn't have.

After revisions, we published the docs. Support tickets related to API integration dropped by 40% in the following month. The sales team even started using the docs in demos because they were that clear.`,
      es: `Cuando escribo documentación técnica sigo un enfoque estructurado. En un proyecto reciente de documentación de API, empecé identificando mis audiencias: desarrolladores que integran la API y soporte que resuelve incidencias.

Para cada endpoint usé una plantilla consistente: qué hace (una frase), cuándo usarlo, parámetros requeridos con ejemplos, respuestas de éxito/error y gotchas comunes.

Le pedí a una colega con menos experiencia en APIs que lo revisara antes de publicar. Identificó dos secciones donde yo asumía conocimientos que un principiante no tendría.

Tras las revisiones, publicamos. Los tickets de soporte sobre integración de API bajaron 40% el mes siguiente. Incluso el equipo de ventas empezó a usar la documentación en demos por lo clara que era.`,
    },
    keyPoints: {
      en: [
        "Consider your audience's knowledge level",
        "Use consistent structure and formatting",
        "Include examples for complex concepts",
        "Get feedback before finalizing",
        "Keep messages concise but complete",
      ],
      es: [
        "Considera el nivel de conocimiento de tu audiencia",
        "Usa estructura y formato consistentes",
        "Incluye ejemplos para conceptos complejos",
        "Pide feedback antes de finalizar",
        "Sé conciso pero completo",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle misunderstandings from written communication?",
        "When do you prefer written vs. verbal communication?",
        "How do you document technical decisions?",
      ],
      es: [
        "¿Cómo manejas malentendidos por comunicación escrita?",
        "¿Cuándo prefieres comunicación escrita vs. verbal?",
        "¿Cómo documentas decisiones técnicas?",
      ],
    },
  },

  // ============ Teamwork (6-10) ============
  {
    id: "ss-6-cross-functional-collaboration",
    questionNumber: 6,
    difficulty: "Mid",
    category: "Teamwork",
    title: {
      en: "Cross-Functional Team Collaboration",
      es: "Colaboración en Equipos Multidisciplinares",
    },
    question: {
      en: "Tell me about a successful project where you worked with people from different disciplines (design, product, QA). What made it successful?",
      es: "Cuéntame sobre un proyecto exitoso donde trabajaste con personas de distintas disciplinas (diseño, producto, QA). ¿Qué lo hizo exitoso?",
    },
    context: {
      en: "Modern software development requires collaboration across design, product, engineering, and QA. This question assesses your ability to work effectively with diverse skill sets.",
      es: "El desarrollo moderno requiere colaboración entre diseño, producto, ingeniería y QA. Esta pregunta evalúa tu capacidad para trabajar con habilidades diversas.",
    },
    whyAsked: {
      en: "Siloed teams ship worse products. Interviewers want to see you value and leverage diverse perspectives.",
      es: "Los equipos aislados entregan peores productos. Los entrevistadores quieren ver que valoras y aprovechas perspectivas diversas.",
    },
    commonMistakes: {
      en: [
        "Focusing only on your own contributions",
        "Describing other disciplines as obstacles",
        "Not explaining your specific role in collaboration",
        "Giving a vague answer without concrete practices",
      ],
      es: [
        "Enfocarte sólo en tus aportes",
        "Describir otras disciplinas como obstáculos",
        "No explicar tu rol concreto en la colaboración",
        "Dar una respuesta vaga sin prácticas concretas",
      ],
    },
    answerFramework: {
      en: "Describe the project, the different disciplines involved, specific collaboration practices, your role, and the successful outcome.",
      es: "Describe el proyecto, las disciplinas involucradas, prácticas concretas de colaboración, tu rol y el resultado exitoso.",
    },
    sampleAnswer: {
      en: `I led the frontend development for a checkout redesign project involving a product manager, UX designer, two backend developers, and a QA engineer.

We started with a kickoff where everyone shared their concerns and constraints. The designer was worried about implementation fidelity; I assured her we'd do pixel-perfect implementation and invited her to our frontend reviews.

We established a shared Figma-to-code handoff process with component annotations. I created a shared Slack channel and proposed daily 15-minute syncs during the two-week sprint.

When QA found edge cases the designer hadn't considered, I facilitated a quick session where we solved them together. The project shipped on time with zero critical bugs. Our NPS score for checkout increased by 15 points.`,
      es: `Lideré el frontend de un rediseño de checkout con un product manager, una diseñadora UX, dos backend developers y un ingeniero de QA.

Arrancamos con un kickoff donde cada uno compartió sus preocupaciones. La diseñadora temía pérdida de fidelidad; le aseguré que haríamos pixel-perfect y la invité a nuestras revisiones de frontend.

Establecimos un handoff Figma-a-código con anotaciones de componente. Creé un canal de Slack compartido y propuse syncs diarios de 15 minutos durante el sprint de dos semanas.

Cuando QA encontró edge cases que la diseñadora no había considerado, facilité una sesión rápida para resolverlos juntos. El proyecto se entregó a tiempo con cero bugs críticos. Nuestro NPS de checkout subió 15 puntos.`,
    },
    keyPoints: {
      en: [
        "Establish clear communication channels early",
        "Understand each discipline's concerns and constraints",
        "Create shared artifacts everyone can reference",
        "Facilitate rather than dominate discussions",
        "Celebrate collective wins, not individual contributions",
      ],
      es: [
        "Establece canales de comunicación claros desde el inicio",
        "Entiende las preocupaciones y restricciones de cada disciplina",
        "Crea artefactos compartidos que todos puedan consultar",
        "Facilita en lugar de dominar las discusiones",
        "Celebra los logros colectivos, no solo los individuales",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle conflicts between disciplines?",
        "What do you do when a designer's vision isn't technically feasible?",
        "How do you ensure QA is involved early enough?",
      ],
      es: [
        "¿Cómo manejas conflictos entre disciplinas?",
        "¿Qué haces cuando la visión de un diseñador no es técnicamente factible?",
        "¿Cómo aseguras que QA se involucre lo suficientemente temprano?",
      ],
    },
  },
  {
    id: "ss-7-help-struggling-teammate",
    questionNumber: 7,
    difficulty: "Mid",
    category: "Teamwork",
    title: {
      en: "Helping a Struggling Teammate",
      es: "Ayudar a un Compañero con Dificultades",
    },
    question: {
      en: "Describe a time when a teammate was struggling with their work. How did you help them?",
      es: "Describe una ocasión en la que un compañero tenía dificultades con su trabajo. ¿Cómo lo ayudaste?",
    },
    context: {
      en: "Strong teams support each other. This question evaluates your empathy, mentoring ability, and willingness to help others succeed.",
      es: "Los buenos equipos se apoyan mutuamente. Esta pregunta evalúa tu empatía, capacidad de mentoría y disposición para ayudar a otros a tener éxito.",
    },
    whyAsked: {
      en: "Team players lift others up. Interviewers want to see you care about collective success, not just your own.",
      es: "Los buenos colegas elevan a los demás. Los entrevistadores quieren ver que te importa el éxito colectivo, no sólo el tuyo.",
    },
    commonMistakes: {
      en: [
        "Making yourself the hero of the story",
        "Describing the teammate as incompetent",
        "Just doing their work for them",
        "Not respecting their autonomy or dignity",
      ],
      es: [
        "Convertirte en el héroe de la historia",
        "Describir al compañero como incompetente",
        "Simplemente hacer su trabajo por él",
        "No respetar su autonomía o dignidad",
      ],
    },
    answerFramework: {
      en: "Describe how you noticed the struggle, how you approached them, the support you provided, and the outcome for them.",
      es: "Describe cómo notaste la dificultad, cómo te acercaste, el apoyo que brindaste y el resultado para esa persona.",
    },
    sampleAnswer: {
      en: `A junior developer on my team was taking much longer than expected on a feature and seemed stressed during standups. Instead of waiting for the deadline to pass, I approached him after a meeting.

I said, 'I remember feeling overwhelmed when I started here. Would it help to pair program for an hour?' He seemed relieved and agreed.

We discovered he understood the requirements but was stuck on an unfamiliar library. Rather than taking over, I guided him through the documentation and asked questions to help him reason through solutions.

Over two sessions, he completed the feature himself. A few weeks later, he was helping another new team member with the same tool. The key was offering help without judgment and ensuring he owned the solution.`,
      es: `Un desarrollador junior de mi equipo estaba tardando mucho más de lo esperado en una funcionalidad y parecía estresado en los standups. En lugar de esperar a que se pasara el plazo, me acerqué tras una reunión.

Le dije: 'Recuerdo sentirme abrumado cuando empecé aquí. ¿Te ayudaría que hagamos pair programming una hora?' Pareció aliviado y aceptó.

Descubrimos que entendía los requisitos, pero estaba atascado en una librería desconocida. En lugar de tomar el control, lo guié por la documentación y le hice preguntas para que él mismo razonara las soluciones.

En dos sesiones completó la funcionalidad él solo. Semanas después ya estaba ayudando a otro miembro nuevo con la misma herramienta. La clave fue ofrecer ayuda sin juicio y asegurar que él fuera dueño de la solución.`,
    },
    keyPoints: {
      en: [
        "Notice early signs of struggle (don't wait for failure)",
        "Approach with empathy, not criticism",
        "Guide rather than do it for them",
        "Respect their autonomy and dignity",
        "Follow up to ensure continued success",
      ],
      es: [
        "Detecta señales tempranas de dificultad (no esperes al fracaso)",
        "Acércate con empatía, no con crítica",
        "Guía en lugar de hacer el trabajo por ellos",
        "Respeta su autonomía y dignidad",
        "Da seguimiento para asegurar el éxito sostenido",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you balance helping others with your own workload?",
        "What if someone refuses help but clearly needs it?",
        "How do you give feedback to struggling teammates?",
      ],
      es: [
        "¿Cómo balanceas ayudar a otros con tu propia carga?",
        "¿Qué haces si alguien rechaza la ayuda pero claramente la necesita?",
        "¿Cómo das feedback a compañeros con dificultades?",
      ],
    },
  },
  {
    id: "ss-8-remote-team-collaboration",
    questionNumber: 8,
    difficulty: "Mid",
    category: "Teamwork",
    title: {
      en: "Remote Team Collaboration",
      es: "Colaboración en Equipos Remotos",
    },
    question: {
      en: "How do you build relationships and collaborate effectively with teammates in different time zones?",
      es: "¿Cómo construyes relaciones y colaboras efectivamente con compañeros en distintas zonas horarias?",
    },
    context: {
      en: "Distributed teams are now common. This question assesses your async communication skills and ability to maintain team cohesion remotely.",
      es: "Los equipos distribuidos son comunes hoy. Esta pregunta evalúa tus habilidades de comunicación asíncrona y la capacidad de mantener cohesión de equipo en remoto.",
    },
    whyAsked: {
      en: "Remote work requires intentional effort to build trust and maintain productivity. Interviewers want to see you can thrive in distributed environments.",
      es: "El trabajo remoto requiere esfuerzo intencional para construir confianza y mantener productividad. Los entrevistadores quieren ver que puedes prosperar en entornos distribuidos.",
    },
    commonMistakes: {
      en: [
        "Saying remote work is easy for you without specifics",
        "Not addressing time zone challenges",
        "Ignoring the human/social aspect of remote teams",
        "Relying only on scheduled meetings",
      ],
      es: [
        "Decir que el remoto te resulta fácil sin detalles",
        "No abordar los retos de zonas horarias",
        "Ignorar el aspecto humano/social de los equipos remotos",
        "Confiar sólo en reuniones agendadas",
      ],
    },
    answerFramework: {
      en: "Discuss specific practices for async communication, time zone overlap strategies, and relationship building in remote settings.",
      es: "Comenta prácticas concretas de comunicación asíncrona, estrategias de overlap horario y construcción de relaciones en contextos remotos.",
    },
    sampleAnswer: {
      en: `On my last team, we had developers in California, Poland, and India spanning 13 hours of time zones.

For async work, I started every PR with a detailed description explaining not just what but why, making reviews easier for colleagues reviewing while I slept. I used Loom videos for complex explanations that would take multiple messages.

We identified a 2-hour overlap window and protected it for collaborative work like architecture discussions and pair programming. For non-urgent items, we used Slack threads with clear deadlines.

To build relationships, we had optional monthly coffee chats where we'd randomly pair people for 30-minute non-work conversations. After six months, we had the highest team engagement scores in the company despite being fully remote.`,
      es: `En mi último equipo teníamos desarrolladores en California, Polonia e India, cubriendo 13 horas de diferencia horaria.

Para trabajo asíncrono, iniciaba cada PR con una descripción detallada explicando no sólo qué sino por qué, facilitando las revisiones de colegas mientras yo dormía. Usaba videos Loom para explicaciones complejas que tomarían varios mensajes.

Identificamos una ventana de overlap de 2 horas y la protegimos para trabajo colaborativo como arquitectura y pair programming. Para asuntos no urgentes, usábamos hilos de Slack con plazos claros.

Para construir relaciones, teníamos coffee chats mensuales opcionales con emparejamientos aleatorios de 30 minutos. Tras seis meses, teníamos los puntajes de engagement más altos de la empresa a pesar de ser completamente remotos.`,
    },
    keyPoints: {
      en: [
        "Over-communicate in async messages with context",
        "Use video for complex explanations",
        "Protect overlap time for collaboration",
        "Build relationships intentionally",
        "Document decisions for async visibility",
      ],
      es: [
        "Sobre-comunica en mensajes asíncronos con contexto",
        "Usa video para explicaciones complejas",
        "Protege el tiempo de overlap para colaboración",
        "Construye relaciones de forma intencional",
        "Documenta decisiones para visibilidad asíncrona",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle urgent issues outside working hours?",
        "What tools have you found most effective for remote work?",
        "How do you prevent remote work burnout?",
      ],
      es: [
        "¿Cómo manejas urgencias fuera del horario laboral?",
        "¿Qué herramientas te resultan más efectivas para trabajo remoto?",
        "¿Cómo previenes el burnout en remoto?",
      ],
    },
  },
  {
    id: "ss-9-new-team-contribution",
    questionNumber: 9,
    difficulty: "Junior",
    category: "Teamwork",
    title: {
      en: "Contributing to a New Team",
      es: "Contribuir a un Equipo Nuevo",
    },
    question: {
      en: "Tell me about a time you joined a new team. How did you ramp up and start contributing?",
      es: "Cuéntame sobre una vez que te uniste a un equipo nuevo. ¿Cómo te pusiste al día y empezaste a aportar?",
    },
    context: {
      en: "Onboarding effectively shows self-sufficiency and learning ability. This question evaluates how you adapt to new environments and establish yourself.",
      es: "Hacer onboarding de forma efectiva demuestra autosuficiencia y capacidad de aprendizaje. Esta pregunta evalúa cómo te adaptas a nuevos entornos.",
    },
    whyAsked: {
      en: "New hires need to become productive quickly. Interviewers want to see you can navigate ambiguity and integrate smoothly.",
      es: "Las nuevas incorporaciones deben volverse productivas rápido. Los entrevistadores quieren ver que puedes navegar la ambigüedad e integrarte sin fricción.",
    },
    commonMistakes: {
      en: [
        "Claiming you figured everything out alone",
        "Not showing how you asked for help appropriately",
        "Criticizing the previous code/team",
        "Describing passive onboarding without initiative",
      ],
      es: [
        "Afirmar que resolviste todo solo",
        "No mostrar cómo pediste ayuda apropiadamente",
        "Criticar el código/equipo anterior",
        "Describir un onboarding pasivo sin iniciativa",
      ],
    },
    answerFramework: {
      en: "Describe how you learned the codebase/processes, built relationships, and made initial contributions that added value.",
      es: "Describe cómo aprendiste el código/procesos, construiste relaciones y realizaste contribuciones iniciales que aportaron valor.",
    },
    sampleAnswer: {
      en: `When I joined my current company, the codebase was 5 years old with limited documentation.

In my first week, I focused on listening and understanding. I scheduled 1:1s with each team member to learn about their areas of expertise and what they wished someone would fix. I took detailed notes and created a personal wiki of domain knowledge.

For code, I started by tracing through the main user flows with a debugger, asking questions in our team channel when stuck. I made my first PR a documentation improvement for the area that confused me most.

By week three, I'd identified a recurring bug in our integration tests that everyone had accepted as flaky. I proposed a fix, got feedback, and shipped it. This built credibility and showed I could contribute while still learning.`,
      es: `Cuando entré a mi empresa actual, el código tenía 5 años y documentación limitada.

En mi primera semana me enfoqué en escuchar y entender. Agendé 1:1 con cada miembro para conocer sus áreas de expertise y qué les gustaría que alguien arreglara. Tomé notas detalladas y creé una wiki personal de conocimiento del dominio.

Para el código, empecé trazando los flujos principales con el debugger y preguntando en el canal del equipo cuando me atascaba. Mi primer PR fue una mejora de documentación en el área que más me confundía.

En la tercera semana identifiqué un bug recurrente en los tests de integración que todos aceptaban como 'flaky'. Propuse una solución, recibí feedback y la entregué. Eso construyó credibilidad y demostró que podía aportar mientras seguía aprendiendo.`,
    },
    keyPoints: {
      en: [
        "Listen and learn before suggesting changes",
        "Build relationships through 1:1 conversations",
        "Document your learning to help future hires",
        "Find quick wins that add value early",
        "Ask questions openly to show engagement",
      ],
      es: [
        "Escucha y aprende antes de sugerir cambios",
        "Construye relaciones mediante 1:1",
        "Documenta tu aprendizaje para ayudar a futuros nuevos",
        "Encuentra quick wins que aporten valor temprano",
        "Haz preguntas abiertamente para demostrar interés",
      ],
    },
    followUpQuestions: {
      en: [
        "How long does it typically take you to feel fully productive?",
        "What would you do differently if onboarding again?",
        "How do you handle imposter syndrome when starting?",
      ],
      es: [
        "¿Cuánto tiempo te toma sentirte totalmente productivo?",
        "¿Qué harías diferente en un próximo onboarding?",
        "¿Cómo manejas el síndrome del impostor al comenzar?",
      ],
    },
  },
  {
    id: "ss-10-take-team-input",
    questionNumber: 10,
    difficulty: "Mid",
    category: "Teamwork",
    title: {
      en: "Incorporating Team Feedback",
      es: "Incorporar Feedback del Equipo",
    },
    question: {
      en: "Describe a time when your team disagreed with your proposed solution. How did you handle their input?",
      es: "Describe una ocasión en la que tu equipo no estuvo de acuerdo con tu solución propuesta. ¿Cómo manejaste su feedback?",
    },
    context: {
      en: "Good solutions often emerge from diverse perspectives. This question evaluates your openness to feedback and collaborative problem-solving.",
      es: "Las buenas soluciones suelen surgir de perspectivas diversas. Esta pregunta evalúa tu apertura al feedback y la resolución colaborativa de problemas.",
    },
    whyAsked: {
      en: "Interviewers want to see you can put team success above personal preference and genuinely consider others' input.",
      es: "Los entrevistadores quieren ver que puedes poner el éxito del equipo por encima de tu preferencia personal y considerar genuinamente las aportaciones de otros.",
    },
    commonMistakes: {
      en: [
        "Describing how you convinced them you were right",
        "Dismissing their concerns as uninformed",
        "Not showing genuine consideration of alternatives",
        "Taking feedback personally",
      ],
      es: [
        "Describir cómo los convenciste de que tenías razón",
        "Desestimar sus preocupaciones como desinformadas",
        "No mostrar consideración genuina por alternativas",
        "Tomar el feedback de forma personal",
      ],
    },
    answerFramework: {
      en: "Describe your proposal, the team's concerns, how you explored alternatives together, and the final decision.",
      es: "Describe tu propuesta, las preocupaciones del equipo, cómo exploraron alternativas juntos y la decisión final.",
    },
    sampleAnswer: {
      en: `I proposed migrating our monolithic application to microservices to improve scalability. During the tech spec review, several teammates pushed back hard.

Instead of defending my position, I asked each person to share their specific concerns. A senior engineer worried about operational complexity. A junior developer was concerned about learning curve. Our DevOps lead pointed out our monitoring wasn't ready for distributed systems.

I realized I'd been focused on the ideal end state without considering our team's current capabilities and constraints. I proposed we create a decision matrix weighing pros/cons of microservices vs. modular monolith vs. hybrid approach.

After the analysis, we chose a modular monolith that could be decomposed later. My original proposal would have caused significant problems. The team's input made the final solution much better.`,
      es: `Propuse migrar nuestra aplicación monolítica a microservicios para mejorar la escalabilidad. En la revisión de la spec, varios compañeros se opusieron con fuerza.

En lugar de defender mi posición, pedí a cada persona que compartiera sus preocupaciones concretas. Un ingeniero senior temía la complejidad operacional. Un desarrollador junior se preocupaba por la curva de aprendizaje. Nuestro DevOps señaló que el monitoreo no estaba listo para sistemas distribuidos.

Me di cuenta de que me había enfocado en el estado ideal sin considerar las capacidades y restricciones actuales. Propuse crear una matriz de decisión con pros/contras de microservicios vs. monolito modular vs. enfoque híbrido.

Tras el análisis elegimos un monolito modular que podía descomponerse después. Mi propuesta original habría causado problemas importantes. El feedback del equipo hizo que la solución final fuera mucho mejor.`,
    },
    keyPoints: {
      en: [
        "Welcome disagreement as valuable input",
        "Ask clarifying questions to understand concerns",
        "Evaluate alternatives objectively",
        "Be willing to change your mind with good reasoning",
        "Credit the team for the improved solution",
      ],
      es: [
        "Da la bienvenida al desacuerdo como aporte valioso",
        "Haz preguntas aclaratorias para entender las inquietudes",
        "Evalúa alternativas objetivamente",
        "Sé capaz de cambiar de opinión con buen razonamiento",
        "Reconoce al equipo por la solución mejorada",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle situations where the team can't reach consensus?",
        "What if you're still convinced your approach was better?",
        "How do you build a culture where people feel safe disagreeing?",
      ],
      es: [
        "¿Cómo manejas situaciones donde el equipo no llega a consenso?",
        "¿Qué haces si sigues convencido de que tu enfoque era mejor?",
        "¿Cómo construyes una cultura donde sea seguro discrepar?",
      ],
    },
  },

  // ============ Problem Solving (11-15) ============
  {
    id: "ss-11-approach-unfamiliar-problem",
    questionNumber: 11,
    difficulty: "Mid",
    category: "Problem Solving",
    title: {
      en: "Approaching an Unfamiliar Problem",
      es: "Abordar un Problema Desconocido",
    },
    question: {
      en: "Tell me about a time you had to solve a problem in a domain or technology you weren't familiar with.",
      es: "Cuéntame sobre una ocasión en la que tuviste que resolver un problema en un dominio o tecnología que no conocías.",
    },
    context: {
      en: "Developers constantly face new challenges. This question assesses your learning ability and problem-solving approach under uncertainty.",
      es: "Los desarrolladores enfrentan retos nuevos constantemente. Esta pregunta evalúa tu capacidad de aprendizaje y enfoque de resolución bajo incertidumbre.",
    },
    whyAsked: {
      en: "Technology changes rapidly. Interviewers want to see you can navigate unfamiliar territory effectively.",
      es: "La tecnología cambia rápido. Los entrevistadores quieren ver que puedes navegar territorio desconocido con efectividad.",
    },
    commonMistakes: {
      en: [
        "Claiming you already knew everything",
        "Not showing your learning process",
        "Describing paralysis from uncertainty",
        "Not leveraging available resources",
      ],
      es: [
        "Afirmar que ya sabías todo",
        "No mostrar tu proceso de aprendizaje",
        "Describir parálisis por la incertidumbre",
        "No aprovechar los recursos disponibles",
      ],
    },
    answerFramework: {
      en: "Describe the unfamiliar area, your learning approach, how you applied new knowledge, and the successful outcome.",
      es: "Describe el área desconocida, tu enfoque de aprendizaje, cómo aplicaste el nuevo conocimiento y el resultado exitoso.",
    },
    sampleAnswer: {
      en: `I was asked to implement real-time notifications using WebSockets, a technology I'd never used before.

I started by spending two hours reading documentation and watching a tutorial to understand the core concepts. Then I sketched the system architecture on paper before writing any code.

I found an open-source chat application using similar technology and studied its implementation. Rather than copying, I understood the patterns and applied them to our use case.

For unknowns, I created small proof-of-concept experiments. When stuck on connection handling, I reached out to a colleague who'd used WebSockets before. A 20-minute conversation saved me hours of trial and error.

I delivered the feature on time. It handled 10,000 concurrent connections in load testing.`,
      es: `Me pidieron implementar notificaciones en tiempo real con WebSockets, una tecnología que nunca había usado.

Comencé con dos horas de documentación y un tutorial para entender los conceptos base. Luego dibujé la arquitectura en papel antes de escribir código.

Encontré una aplicación de chat open-source con tecnología similar y estudié su implementación. En lugar de copiar, entendí los patrones y los apliqué a nuestro caso.

Para los puntos desconocidos, hice pequeños proofs-of-concept. Cuando me atasqué con el manejo de conexiones, hablé con un colega que ya había usado WebSockets. Una conversación de 20 minutos me ahorró horas de prueba y error.

Entregué la funcionalidad a tiempo. Soportaba 10.000 conexiones concurrentes en pruebas de carga.`,
    },
    keyPoints: {
      en: [
        "Start with foundational understanding before coding",
        "Learn from existing implementations",
        "Build small experiments to test assumptions",
        "Know when to ask for help",
        "Document learnings for others",
      ],
      es: [
        "Comienza con el entendimiento fundamental antes de codificar",
        "Aprende de implementaciones existentes",
        "Construye pequeños experimentos para probar hipótesis",
        "Sabe cuándo pedir ayuda",
        "Documenta los aprendizajes para otros",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you decide how much to learn before starting?",
        "What resources do you typically use for learning?",
        "How do you handle pressure to deliver while learning?",
      ],
      es: [
        "¿Cómo decides cuánto aprender antes de empezar?",
        "¿Qué recursos usas típicamente para aprender?",
        "¿Cómo manejas la presión de entregar mientras aprendes?",
      ],
    },
  },
  {
    id: "ss-12-debug-complex-issue",
    questionNumber: 12,
    difficulty: "Mid",
    category: "Problem Solving",
    title: {
      en: "Debugging a Complex Issue",
      es: "Depurar un Problema Complejo",
    },
    question: {
      en: "Walk me through your process for debugging a particularly challenging issue.",
      es: "Guíame por tu proceso para depurar un problema particularmente difícil.",
    },
    context: {
      en: "Debugging is a core developer skill. This question evaluates your systematic approach and persistence when facing difficult problems.",
      es: "Depurar es una habilidad clave. Esta pregunta evalúa tu enfoque sistemático y tu persistencia ante problemas difíciles.",
    },
    whyAsked: {
      en: "Interviewers want to see logical thinking, systematic approaches, and ability to handle frustration productively.",
      es: "Los entrevistadores quieren ver pensamiento lógico, enfoque sistemático y capacidad para manejar la frustración productivamente.",
    },
    commonMistakes: {
      en: [
        "Describing random trial and error",
        "Not explaining your thought process",
        "Skipping steps in your debugging method",
        "Not using available tools and resources",
      ],
      es: [
        "Describir prueba y error aleatorio",
        "No explicar tu razonamiento",
        "Saltarte pasos en tu método de depuración",
        "No usar herramientas y recursos disponibles",
      ],
    },
    answerFramework: {
      en: "Walk through a specific bug: how you reproduced it, narrowed down the cause, verified the fix, and prevented recurrence.",
      es: "Recorre un bug concreto: cómo lo reprodujiste, cómo aislaste la causa, cómo verificaste el fix y cómo preveniste la recurrencia.",
    },
    sampleAnswer: {
      en: `We had a production issue where users randomly couldn't log in. It happened once every few hundred requests, making reproduction difficult.

First, I gathered data: affected users, timestamps, server logs, and any error messages. I noticed the failures clustered around specific time windows.

I hypothesized it could be a race condition, memory issue, or external dependency. I added detailed logging to the authentication flow and deployed to staging with synthetic traffic.

After analyzing logs, I narrowed it to our session cache. Under high load, the cache write and subsequent read were racing. I reproduced it locally with a load testing script.

The fix was adding appropriate locking. I wrote a regression test that simulated the race condition. Then I created a runbook for similar issues.`,
      es: `Tuvimos un problema en producción donde los usuarios aleatoriamente no podían iniciar sesión. Ocurría una vez cada varios cientos de requests, lo que dificultaba reproducirlo.

Primero reuní datos: usuarios afectados, timestamps, logs del servidor y mensajes de error. Noté que las fallas se concentraban en ciertas ventanas de tiempo.

Hipoteticé que podía ser una race condition, un problema de memoria o una dependencia externa. Añadí logs detallados al flujo de autenticación y desplegué a staging con tráfico sintético.

Tras analizar logs, lo reduje a nuestro session cache. Bajo carga alta, la escritura del cache y la lectura siguiente estaban en race. Lo reproduje localmente con un script de carga.

El fix fue agregar locking apropiado. Escribí un test de regresión que simulaba la condición. Luego creé un runbook para problemas similares.`,
    },
    keyPoints: {
      en: [
        "Gather data before hypothesizing",
        "Form and test hypotheses systematically",
        "Reproduce the issue reliably before fixing",
        "Verify fixes with tests",
        "Document for future reference",
      ],
      es: [
        "Reúne datos antes de hipotetizar",
        "Formula y prueba hipótesis sistemáticamente",
        "Reproduce el problema de forma fiable antes de corregirlo",
        "Verifica fixes con tests",
        "Documenta para referencia futura",
      ],
    },
    followUpQuestions: {
      en: [
        "What's the hardest bug you've ever solved?",
        "How do you handle bugs you can't reproduce?",
        "When do you decide to ask for help while debugging?",
      ],
      es: [
        "¿Cuál es el bug más difícil que has resuelto?",
        "¿Cómo manejas bugs que no puedes reproducir?",
        "¿Cuándo decides pedir ayuda al depurar?",
      ],
    },
  },
  {
    id: "ss-13-technical-tradeoff-decision",
    questionNumber: 13,
    difficulty: "Senior",
    category: "Problem Solving",
    title: {
      en: "Making Technical Tradeoff Decisions",
      es: "Tomar Decisiones de Trade-off Técnico",
    },
    question: {
      en: "Describe a situation where you had to choose between multiple technical approaches with different tradeoffs.",
      es: "Describe una situación donde tuviste que elegir entre múltiples enfoques técnicos con trade-offs distintos.",
    },
    context: {
      en: "Engineering is about tradeoffs. This question assesses your decision-making process and ability to weigh competing concerns.",
      es: "La ingeniería es cuestión de trade-offs. Esta pregunta evalúa tu proceso de decisión y tu capacidad para ponderar preocupaciones en competencia.",
    },
    whyAsked: {
      en: "There's rarely a perfect solution. Interviewers want to see you can evaluate options and make defensible decisions.",
      es: "Rara vez hay solución perfecta. Los entrevistadores quieren ver que puedes evaluar opciones y tomar decisiones defendibles.",
    },
    commonMistakes: {
      en: [
        "Describing the choice as obvious",
        "Not explaining the tradeoffs clearly",
        "Making the decision alone without input",
        "Not considering long-term implications",
      ],
      es: [
        "Describir la elección como obvia",
        "No explicar los trade-offs con claridad",
        "Tomar la decisión solo sin consultar",
        "No considerar implicaciones de largo plazo",
      ],
    },
    answerFramework: {
      en: "Present the problem, the options considered with their tradeoffs, your decision-making process, and the outcome.",
      es: "Presenta el problema, las opciones consideradas con sus trade-offs, tu proceso de decisión y el resultado.",
    },
    sampleAnswer: {
      en: `We needed to add search functionality to our e-commerce platform. The options were: build with PostgreSQL full-text search, integrate Elasticsearch, or use a managed search service like Algolia.

PostgreSQL was simplest with no new infrastructure, but limited in features and would degrade under heavy load. Elasticsearch was powerful but required DevOps investment and expertise we didn't have. Algolia was feature-rich and managed, but expensive at scale.

I created a decision matrix weighing: implementation time, ongoing maintenance, scalability, cost at different traffic levels, and team expertise.

I presented this to the team and product manager. Given our timeline and team size, we chose Algolia for MVP with a plan to evaluate migration to Elasticsearch if costs became prohibitive after reaching scale.

We launched search in two weeks instead of two months.`,
      es: `Necesitábamos agregar búsqueda a nuestra plataforma de e-commerce. Las opciones eran: construir con full-text search de PostgreSQL, integrar Elasticsearch o usar un servicio gestionado como Algolia.

PostgreSQL era lo más simple sin nueva infraestructura, pero con features limitados y degradación bajo carga alta. Elasticsearch era potente pero requería inversión en DevOps y expertise que no teníamos. Algolia era rico en features y gestionado, pero caro a escala.

Creé una matriz de decisión ponderando: tiempo de implementación, mantenimiento, escalabilidad, costo a distintos niveles de tráfico y expertise del equipo.

Lo presenté al equipo y al PM. Dado nuestro plazo y tamaño, elegimos Algolia para el MVP con un plan para evaluar migración a Elasticsearch si los costos se volvían prohibitivos al escalar.

Lanzamos búsqueda en dos semanas en vez de dos meses.`,
    },
    keyPoints: {
      en: [
        "Identify all viable options",
        "List tradeoffs for each option clearly",
        "Consider short-term and long-term implications",
        "Involve stakeholders in the decision",
        "Document reasoning for future reference",
      ],
      es: [
        "Identifica todas las opciones viables",
        "Lista los trade-offs de cada opción con claridad",
        "Considera implicaciones a corto y largo plazo",
        "Involucra a los stakeholders en la decisión",
        "Documenta el razonamiento para referencia futura",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle regret if a decision turns out wrong?",
        "When is good enough better than perfect?",
        "How do you balance technical ideal with business constraints?",
      ],
      es: [
        "¿Cómo manejas el arrepentimiento si una decisión resulta errada?",
        "¿Cuándo 'lo suficientemente bueno' es mejor que 'lo perfecto'?",
        "¿Cómo balanceas el ideal técnico con las restricciones de negocio?",
      ],
    },
  },
  {
    id: "ss-14-improve-inefficient-process",
    questionNumber: 14,
    difficulty: "Mid",
    category: "Problem Solving",
    title: {
      en: "Improving an Inefficient Process",
      es: "Mejorar un Proceso Ineficiente",
    },
    question: {
      en: "Tell me about a time you identified and improved an inefficient process or workflow.",
      es: "Cuéntame sobre una vez que identificaste y mejoraste un proceso o flujo de trabajo ineficiente.",
    },
    context: {
      en: "Great developers improve not just code but processes. This question evaluates your initiative and ability to drive improvements.",
      es: "Los grandes desarrolladores mejoran no sólo código sino procesos. Esta pregunta evalúa tu iniciativa y capacidad de impulsar mejoras.",
    },
    whyAsked: {
      en: "Interviewers want proactive problem-solvers who make teams more efficient, not just those who accept status quo.",
      es: "Los entrevistadores buscan personas proactivas que mejoran la eficiencia del equipo, no sólo quienes aceptan el statu quo.",
    },
    commonMistakes: {
      en: [
        "Describing trivial improvements",
        "Not quantifying the impact",
        "Making changes without team buy-in",
        "Ignoring why the old process existed",
      ],
      es: [
        "Describir mejoras triviales",
        "No cuantificar el impacto",
        "Hacer cambios sin buy-in del equipo",
        "Ignorar por qué existía el proceso anterior",
      ],
    },
    answerFramework: {
      en: "Describe the inefficiency, your analysis, the proposed solution, how you got buy-in, and the measurable impact.",
      es: "Describe la ineficiencia, tu análisis, la solución propuesta, cómo obtuviste buy-in y el impacto medible.",
    },
    sampleAnswer: {
      en: `Our deployment process took 4 hours of manual work: updating configs, running scripts, and verifying each environment. Deployments were stressful and error-prone.

I tracked each deployment for two weeks, documenting time spent on each step. I found 80% was repetitive and scriptable. The remaining 20% were actual human decisions.

I drafted a proposal to automate the repetitive steps and created a prototype CI/CD pipeline. I presented the time analysis and demo to the team, asking for feedback before committing fully.

With team input, we refined the approach and rolled it out over three sprints. We reduced deployment time from 4 hours to 30 minutes. Errors dropped by 90%.`,
      es: `Nuestro proceso de despliegue tomaba 4 horas de trabajo manual: actualizar configs, ejecutar scripts y verificar cada entorno. Los deploys eran estresantes y propensos a errores.

Rastreé cada despliegue durante dos semanas, documentando el tiempo de cada paso. Descubrí que 80% era repetitivo y automatizable. El 20% restante eran decisiones humanas reales.

Redacté una propuesta para automatizar los pasos repetitivos y creé un prototipo de pipeline CI/CD. Presenté el análisis y la demo al equipo, pidiendo feedback antes de comprometerme del todo.

Con las aportaciones del equipo refinamos el enfoque y lo implementamos en tres sprints. Redujimos el tiempo de despliegue de 4 horas a 30 minutos. Los errores cayeron 90%.`,
    },
    keyPoints: {
      en: [
        "Quantify the current inefficiency",
        "Understand why the current process exists",
        "Propose solutions with evidence",
        "Get buy-in before major changes",
        "Measure the improvement afterwards",
      ],
      es: [
        "Cuantifica la ineficiencia actual",
        "Entiende por qué existe el proceso actual",
        "Propón soluciones con evidencia",
        "Obtén buy-in antes de cambios grandes",
        "Mide la mejora después",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you identify which processes to improve?",
        "What if the team resists the change?",
        "How do you balance improvement work with feature delivery?",
      ],
      es: [
        "¿Cómo identificas qué procesos mejorar?",
        "¿Qué haces si el equipo se resiste al cambio?",
        "¿Cómo balanceas el trabajo de mejora con la entrega de features?",
      ],
    },
  },
  {
    id: "ss-15-work-with-constraints",
    questionNumber: 15,
    difficulty: "Mid",
    category: "Problem Solving",
    title: {
      en: "Working Within Tight Constraints",
      es: "Trabajar con Restricciones Ajustadas",
    },
    question: {
      en: "Describe a project where you had to deliver with significant constraints (time, budget, resources). How did you succeed?",
      es: "Describe un proyecto donde tuviste que entregar con restricciones importantes (tiempo, presupuesto, recursos). ¿Cómo tuviste éxito?",
    },
    context: {
      en: "Real-world projects have constraints. This question assesses your ability to prioritize, negotiate, and deliver value under pressure.",
      es: "Los proyectos reales tienen restricciones. Esta pregunta evalúa tu capacidad de priorizar, negociar y entregar valor bajo presión.",
    },
    whyAsked: {
      en: "Interviewers want to see you can be practical and effective, not just theoretical. Constraints test creativity and prioritization.",
      es: "Los entrevistadores quieren ver que eres práctico y efectivo, no sólo teórico. Las restricciones prueban la creatividad y la priorización.",
    },
    commonMistakes: {
      en: [
        "Complaining about the constraints",
        "Describing heroic overtime as the solution",
        "Not showing how you prioritized",
        "Delivering poor quality due to rushing",
      ],
      es: [
        "Quejarte de las restricciones",
        "Describir horas extra heroicas como la solución",
        "No mostrar cómo priorizaste",
        "Entregar mala calidad por apurarte",
      ],
    },
    answerFramework: {
      en: "Describe the constraints, how you prioritized, what tradeoffs you made, and how you delivered value within limits.",
      es: "Describe las restricciones, cómo priorizaste, qué trade-offs aceptaste y cómo entregaste valor dentro de los límites.",
    },
    sampleAnswer: {
      en: `We had to launch a competitor response feature in 3 weeks instead of the planned 8 weeks. The full scope was impossible.

I worked with the product manager to identify the must-have vs. nice-to-have features. We cut scope to the core value proposition: three features instead of eight, serving 80% of use cases.

For implementation, I chose proven patterns over novel approaches to reduce risk. I paired with another developer to parallelize work and catch issues early.

We were transparent with stakeholders about what would and wouldn't make the deadline. We shipped the core features on time with acceptable quality. The remaining features were added over the following month.`,
      es: `Teníamos que lanzar una funcionalidad de respuesta a la competencia en 3 semanas en vez de las 8 planeadas. El alcance completo era imposible.

Trabajé con el PM para identificar must-have vs. nice-to-have. Recortamos el alcance al núcleo de valor: tres funcionalidades en vez de ocho, cubriendo el 80% de los casos.

Para la implementación, elegí patrones probados sobre enfoques novedosos para reducir riesgo. Hice pair programming con otro desarrollador para paralelizar trabajo y detectar problemas temprano.

Fuimos transparentes con los stakeholders sobre qué entraría y qué no. Entregamos las funcionalidades core a tiempo con calidad aceptable. Las restantes se agregaron el mes siguiente.`,
    },
    keyPoints: {
      en: [
        "Negotiate scope rather than quality",
        "Identify the highest-value items",
        "Use proven approaches to reduce risk",
        "Communicate constraints and tradeoffs clearly",
        "Deliver complete small over incomplete large",
      ],
      es: [
        "Negocia alcance, no calidad",
        "Identifica lo de mayor valor",
        "Usa enfoques probados para reducir riesgo",
        "Comunica restricciones y trade-offs con claridad",
        "Entrega algo pequeño pero completo antes que algo grande e incompleto",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle unrealistic deadlines?",
        "When should you push back on constraints?",
        "How do you prevent technical debt from accumulating under pressure?",
      ],
      es: [
        "¿Cómo manejas fechas límite poco realistas?",
        "¿Cuándo deberías empujar de regreso contra las restricciones?",
        "¿Cómo evitas acumular deuda técnica bajo presión?",
      ],
    },
  },

  // ============ Leadership (16-20) ============
  {
    id: "ss-16-lead-without-authority",
    questionNumber: 16,
    difficulty: "Senior",
    category: "Leadership",
    title: {
      en: "Leading Without Formal Authority",
      es: "Liderar Sin Autoridad Formal",
    },
    question: {
      en: "Tell me about a time you led an initiative or influenced outcomes without having formal authority.",
      es: "Cuéntame sobre una ocasión en la que lideraste una iniciativa o influiste en resultados sin tener autoridad formal.",
    },
    context: {
      en: "Leadership isn't just for managers. This question assesses your ability to drive change and influence through expertise and collaboration.",
      es: "El liderazgo no es exclusivo de los managers. Esta pregunta evalúa tu capacidad para impulsar cambios e influir mediante expertise y colaboración.",
    },
    whyAsked: {
      en: "Companies value informal leaders who improve teams without needing a title. Interviewers want to see initiative and influence skills.",
      es: "Las empresas valoran líderes informales que mejoran equipos sin necesitar un título. Los entrevistadores buscan iniciativa y habilidades de influencia.",
    },
    commonMistakes: {
      en: [
        "Waiting for someone to give you authority",
        "Forcing changes on reluctant teammates",
        "Taking credit for team accomplishments",
        "Confusing leadership with management",
      ],
      es: [
        "Esperar a que alguien te dé autoridad",
        "Forzar cambios a compañeros reticentes",
        "Adueñarte de logros del equipo",
        "Confundir liderazgo con gestión",
      ],
    },
    answerFramework: {
      en: "Describe the initiative, how you built consensus, how you led without formal power, and the outcome.",
      es: "Describe la iniciativa, cómo construiste consenso, cómo lideraste sin poder formal y el resultado.",
    },
    sampleAnswer: {
      en: `I noticed our team had no consistent code style, causing lengthy discussions in every code review. As a mid-level developer, I had no authority to mandate changes.

I started by gathering data: I tracked time spent on style discussions in PRs over a month. Then I researched linting tools and created a proposal with the time savings analysis.

Instead of pushing my solution, I invited interested teammates to a lunch discussion. We collaboratively chose ESLint with a specific config, allowing everyone to feel ownership.

I volunteered to set it up and create the migration plan. Within a month, the whole team adopted it. Code review time dropped 20%. My manager asked me to lead similar initiatives, which eventually led to a tech lead role.`,
      es: `Noté que nuestro equipo no tenía un estilo de código consistente, causando discusiones largas en cada code review. Como desarrollador mid, no tenía autoridad para imponer cambios.

Comencé reuniendo datos: rastreé el tiempo gastado en discusiones de estilo en PRs durante un mes. Luego investigué herramientas de linting y creé una propuesta con el análisis de ahorro de tiempo.

En lugar de imponer mi solución, invité a compañeros interesados a una discusión en el almuerzo. Juntos elegimos ESLint con una config específica, permitiendo que todos sintieran ownership.

Me ofrecí a configurarlo y crear el plan de migración. En un mes todo el equipo lo adoptó. El tiempo de code review bajó 20%. Mi manager me pidió liderar iniciativas similares, lo que eventualmente llevó a un rol de tech lead.`,
    },
    keyPoints: {
      en: [
        "Identify problems that affect the team",
        "Build your case with data",
        "Involve others in the solution",
        "Do the work to make adoption easy",
        "Lead through service, not authority",
      ],
      es: [
        "Identifica problemas que afectan al equipo",
        "Construye tu caso con datos",
        "Involucra a otros en la solución",
        "Haz el trabajo para que la adopción sea fácil",
        "Lidera a través del servicio, no de la autoridad",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle resistance to change?",
        "What's the difference between leading and managing?",
        "How do you influence senior colleagues?",
      ],
      es: [
        "¿Cómo manejas la resistencia al cambio?",
        "¿Cuál es la diferencia entre liderar y gestionar?",
        "¿Cómo influyes sobre colegas senior?",
      ],
    },
  },
  {
    id: "ss-17-mentor-junior-developer",
    questionNumber: 17,
    difficulty: "Senior",
    category: "Leadership",
    title: {
      en: "Mentoring a Junior Developer",
      es: "Mentorizar a un Desarrollador Junior",
    },
    question: {
      en: "Describe your experience mentoring someone less experienced. What was your approach and what did they achieve?",
      es: "Describe tu experiencia mentorizando a alguien con menos experiencia. ¿Cuál fue tu enfoque y qué logró esa persona?",
    },
    context: {
      en: "Growing others multiplies your impact. This question assesses your ability to develop talent and share knowledge effectively.",
      es: "Hacer crecer a otros multiplica tu impacto. Esta pregunta evalúa tu capacidad para desarrollar talento y compartir conocimiento.",
    },
    whyAsked: {
      en: "Senior developers are expected to lift others. Interviewers want to see you can teach and invest in others' growth.",
      es: "Se espera que los desarrolladores senior impulsen a otros. Los entrevistadores quieren ver que puedes enseñar e invertir en el crecimiento ajeno.",
    },
    commonMistakes: {
      en: [
        "Describing doing their work for them",
        "Being condescending about their knowledge gaps",
        "Not having a structured approach",
        "Focusing only on technical skills",
      ],
      es: [
        "Describir que hiciste su trabajo por ellos",
        "Ser condescendiente sobre sus vacíos de conocimiento",
        "No tener un enfoque estructurado",
        "Enfocarte sólo en habilidades técnicas",
      ],
    },
    answerFramework: {
      en: "Describe the mentee, your approach, specific techniques you used, and their growth over time.",
      es: "Describe al mentee, tu enfoque, técnicas concretas que usaste y su crecimiento en el tiempo.",
    },
    sampleAnswer: {
      en: `I was assigned to mentor a bootcamp graduate joining our team. She had potential but lacked production experience and confidence.

I started by understanding her goals and current skills through a 1:1. We created a 90-day plan with clear milestones: first commit, first PR merged, first feature owned, first production issue resolved.

For each milestone, I provided graduated support. Early on, we paired frequently. As she grew, I shifted to code reviews with detailed feedback. I always explained the 'why' behind suggestions.

After three months, she was independently shipping features and had the confidence to disagree with my code review comments (with good reasoning!). She's now mentoring the next new hire.`,
      es: `Me asignaron mentorizar a una graduada de bootcamp que se unió al equipo. Tenía potencial pero carecía de experiencia en producción y confianza.

Comencé entendiendo sus metas y habilidades actuales en un 1:1. Creamos un plan a 90 días con hitos claros: primer commit, primer PR mergeado, primera feature propia, primer incidente de producción resuelto.

Para cada hito brindé apoyo graduado. Al inicio hacíamos pair programming frecuente. Al crecer, pasé a code reviews con feedback detallado. Siempre explicaba el 'por qué' detrás de las sugerencias.

Tras tres meses entregaba features de forma independiente y tenía la confianza de discrepar con mis comentarios de review (¡con buen razonamiento!). Ahora mentoriza al siguiente nuevo.`,
    },
    keyPoints: {
      en: [
        "Understand their goals and starting point",
        "Create clear milestones and expectations",
        "Explain reasoning, not just answers",
        "Gradually increase independence",
        "Celebrate their growth and achievements",
      ],
      es: [
        "Entiende sus metas y punto de partida",
        "Crea hitos y expectativas claras",
        "Explica el razonamiento, no sólo las respuestas",
        "Aumenta gradualmente la independencia",
        "Celebra su crecimiento y logros",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle a mentee who isn't progressing?",
        "What's the most important thing you learned from mentoring?",
        "How do you balance mentoring with your own work?",
      ],
      es: [
        "¿Cómo manejas a un mentee que no progresa?",
        "¿Qué es lo más importante que aprendiste mentorizando?",
        "¿Cómo balanceas mentoría con tu propio trabajo?",
      ],
    },
  },
  {
    id: "ss-18-drive-technical-decision",
    questionNumber: 18,
    difficulty: "Senior",
    category: "Leadership",
    title: {
      en: "Driving a Technical Decision",
      es: "Impulsar una Decisión Técnica",
    },
    question: {
      en: "Tell me about a significant technical decision you drove. How did you build consensus and ensure successful execution?",
      es: "Cuéntame sobre una decisión técnica importante que impulsaste. ¿Cómo construiste consenso y aseguraste una ejecución exitosa?",
    },
    context: {
      en: "Technical leadership involves guiding important decisions. This question assesses your ability to lead technical strategy and bring others along.",
      es: "El liderazgo técnico implica guiar decisiones importantes. Esta pregunta evalúa tu capacidad de liderar estrategia técnica y llevar a otros contigo.",
    },
    whyAsked: {
      en: "Interviewers want to see you can own technical direction, not just implement others' decisions.",
      es: "Los entrevistadores quieren ver que puedes tomar dirección técnica, no sólo implementar decisiones ajenas.",
    },
    commonMistakes: {
      en: [
        "Making unilateral decisions without input",
        "Not considering opposing viewpoints",
        "Failing to follow through on execution",
        "Taking sole credit for team decisions",
      ],
      es: [
        "Tomar decisiones unilaterales sin input",
        "No considerar puntos de vista opuestos",
        "No dar seguimiento a la ejecución",
        "Atribuirte en solitario decisiones del equipo",
      ],
    },
    answerFramework: {
      en: "Describe the decision, how you researched and proposed it, how you built consensus, and how you ensured successful execution.",
      es: "Describe la decisión, cómo la investigaste y propusiste, cómo construiste consenso y cómo aseguraste la ejecución exitosa.",
    },
    sampleAnswer: {
      en: `I identified that our frontend build times had grown to 8 minutes, significantly slowing development. I proposed migrating from Webpack to Vite.

First, I created a technical RFC documenting the problem, proposed solution, alternatives considered, risks, and rollback plan. I shared it for async feedback for a week.

I addressed concerns raised: backward compatibility, learning curve, and migration effort. I created a proof-of-concept with one module showing build time dropping to 30 seconds.

After addressing feedback, I led a team decision meeting. We planned the migration in phases over two sprints. I paired with teammates on tricky migrations. Build times dropped from 8 minutes to 45 seconds.`,
      es: `Identifiqué que nuestros tiempos de build del frontend habían crecido a 8 minutos, ralentizando mucho el desarrollo. Propuse migrar de Webpack a Vite.

Primero creé un RFC técnico documentando el problema, la solución propuesta, alternativas consideradas, riesgos y plan de rollback. Lo compartí para feedback asíncrono durante una semana.

Abordé las inquietudes planteadas: compatibilidad, curva de aprendizaje y esfuerzo de migración. Creé un proof-of-concept con un módulo mostrando el build bajando a 30 segundos.

Tras integrar el feedback lideré una reunión de decisión. Planeamos la migración en fases sobre dos sprints. Hice pair programming en las migraciones difíciles. El build pasó de 8 minutos a 45 segundos.`,
    },
    keyPoints: {
      en: [
        "Document your proposal formally (RFC/design doc)",
        "Research alternatives and address concerns",
        "Get buy-in before starting execution",
        "Plan execution in manageable phases",
        "Support the team through the change",
      ],
      es: [
        "Documenta tu propuesta formalmente (RFC/design doc)",
        "Investiga alternativas y aborda inquietudes",
        "Obtén buy-in antes de empezar la ejecución",
        "Planea la ejecución en fases manejables",
        "Apoya al equipo durante el cambio",
      ],
    },
    followUpQuestions: {
      en: [
        "What if consensus couldn't be reached?",
        "How do you handle technical decisions you disagree with?",
        "What makes a good technical RFC?",
      ],
      es: [
        "¿Qué harías si no se llegara a consenso?",
        "¿Cómo manejas decisiones técnicas con las que no estás de acuerdo?",
        "¿Qué hace bueno a un RFC técnico?",
      ],
    },
  },
  {
    id: "ss-19-take-ownership",
    questionNumber: 19,
    difficulty: "Mid",
    category: "Leadership",
    title: {
      en: "Taking Ownership of a Problem",
      es: "Tomar Responsabilidad de un Problema",
    },
    question: {
      en: "Describe a time when you took ownership of a problem that wasn't strictly your responsibility.",
      es: "Describe una ocasión en la que asumiste responsabilidad de un problema que no era estrictamente tuyo.",
    },
    context: {
      en: "Ownership mindset is valued in all roles. This question assesses your initiative and willingness to go beyond your job description.",
      es: "La mentalidad de ownership es valorada en todos los roles. Esta pregunta evalúa tu iniciativa y disposición a ir más allá de tu descripción de puesto.",
    },
    whyAsked: {
      en: "Great team members see problems and solve them, regardless of formal responsibility. Interviewers want to see this mindset.",
      es: "Los grandes colaboradores ven los problemas y los resuelven, sin importar la responsabilidad formal. Los entrevistadores quieren ver esta mentalidad.",
    },
    commonMistakes: {
      en: [
        "Overstepping without coordination",
        "Taking ownership for credit rather than impact",
        "Not respecting others' domains",
        "Describing situations where you had to be asked",
      ],
      es: [
        "Extralimitarte sin coordinación",
        "Tomar ownership por el crédito y no por el impacto",
        "No respetar dominios ajenos",
        "Describir situaciones donde tuvieron que pedírtelo",
      ],
    },
    answerFramework: {
      en: "Describe the problem, why you stepped up, how you approached it respectfully, and the outcome.",
      es: "Describe el problema, por qué diste el paso, cómo lo abordaste con respeto y el resultado.",
    },
    sampleAnswer: {
      en: `Our customer support team was overwhelmed with a specific type of bug report. The bug was in a module no one on my team owned, and the responsible team was busy with a critical deadline.

Instead of waiting, I investigated the reports myself. I found the root cause in two hours and created a minimal fix. But rather than just submitting a PR to a codebase I didn't own, I reached out to the owning team's tech lead.

I explained what I'd found and offered to submit the fix with their guidance. They appreciated the proactive help and asked me to submit the PR with one of their engineers as reviewer.

The bug was fixed within a day instead of waiting two weeks.`,
      es: `Nuestro equipo de soporte estaba abrumado con un tipo de reporte de bug. El bug estaba en un módulo que nadie de mi equipo mantenía, y el equipo responsable estaba ocupado con un plazo crítico.

En lugar de esperar, investigué los reportes. Encontré la causa raíz en dos horas y creé un fix mínimo. Pero antes de simplemente abrir un PR en un código que no era mío, contacté al tech lead del equipo dueño.

Expliqué lo que había encontrado y ofrecí enviar el fix con su guía. Valoraron la ayuda proactiva y me pidieron abrir el PR con uno de sus ingenieros como revisor.

El bug se arregló en un día en vez de esperar dos semanas.`,
    },
    keyPoints: {
      en: [
        "See a problem, own the solution",
        "Respect existing ownership and coordinate",
        "Offer help rather than taking over",
        "Follow through until resolution",
        "Build relationships, not territory",
      ],
      es: [
        "Ve un problema, hazte dueño de la solución",
        "Respeta el ownership existente y coordina",
        "Ofrece ayuda en lugar de tomar el control",
        "Da seguimiento hasta la resolución",
        "Construye relaciones, no territorio",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you know when to step in vs. wait?",
        "What if the owning team resented your involvement?",
        "How do you balance ownership with boundaries?",
      ],
      es: [
        "¿Cómo sabes cuándo intervenir vs. esperar?",
        "¿Qué harías si al equipo dueño le molestara tu intervención?",
        "¿Cómo balanceas ownership con límites?",
      ],
    },
  },
  {
    id: "ss-20-rally-team-through-difficulty",
    questionNumber: 20,
    difficulty: "Senior",
    category: "Leadership",
    title: {
      en: "Rallying the Team Through Difficulty",
      es: "Unir al Equipo en Momentos Difíciles",
    },
    question: {
      en: "Tell me about a time your team faced a significant challenge or setback. How did you help the team through it?",
      es: "Cuéntame sobre una ocasión en la que tu equipo enfrentó un reto o revés importante. ¿Cómo ayudaste al equipo a superarlo?",
    },
    context: {
      en: "Teams face setbacks. This question assesses your ability to maintain morale and lead through difficult times.",
      es: "Los equipos enfrentan reveses. Esta pregunta evalúa tu capacidad de mantener la moral y liderar en momentos difíciles.",
    },
    whyAsked: {
      en: "Resilience and positive influence during challenges are valuable leadership traits interviewers look for.",
      es: "La resiliencia y la influencia positiva en momentos difíciles son rasgos de liderazgo valiosos que los entrevistadores buscan.",
    },
    commonMistakes: {
      en: [
        "Downplaying the severity of the challenge",
        "Focusing only on your individual contributions",
        "Not acknowledging team members' struggles",
        "Describing toxic positivity over genuine support",
      ],
      es: [
        "Minimizar la gravedad del reto",
        "Enfocarte sólo en tus aportes individuales",
        "No reconocer las dificultades de los compañeros",
        "Describir positividad tóxica en vez de apoyo genuino",
      ],
    },
    answerFramework: {
      en: "Describe the challenge, its impact on the team, how you provided support, and how the team emerged.",
      es: "Describe el reto, su impacto en el equipo, cómo brindaste apoyo y cómo salió adelante el equipo.",
    },
    sampleAnswer: {
      en: `Our major product launch had a critical bug that took down the system for 4 hours on day one. The team was demoralized and worried about job security.

I called a quick team meeting to acknowledge the situation honestly. I said, 'This is tough, and it's okay to feel frustrated. But we're going to fix this together.'

I helped organize the incident response: one group on the fix, another on customer communication, a third on monitoring. I took the monitoring shift so others could focus on the harder technical work.

After we recovered, I pushed back when management wanted an immediate post-mortem. The team needed 24 hours to decompress first. We had the post-mortem two days later, focused on learning, not blame.`,
      es: `Nuestro lanzamiento importante tuvo un bug crítico que dejó el sistema caído 4 horas el primer día. El equipo estaba desmoralizado y preocupado por su estabilidad laboral.

Convoqué una reunión rápida para reconocer la situación con honestidad. Dije: 'Esto es duro, y está bien sentirse frustrado. Pero vamos a solucionarlo juntos'.

Ayudé a organizar la respuesta al incidente: un grupo en el fix, otro en comunicación con el cliente, un tercero en monitoreo. Tomé el turno de monitoreo para que otros se concentraran en el trabajo técnico más difícil.

Tras recuperarnos, me opuse cuando management quiso un post-mortem inmediato. El equipo necesitaba 24 horas para descomprimir. Hicimos el post-mortem dos días después, enfocado en aprendizaje, no en culpas.`,
    },
    keyPoints: {
      en: [
        "Acknowledge challenges honestly",
        "Provide practical structure and support",
        "Protect the team when needed",
        "Focus on learning, not blame",
        "Recognize the team's resilience afterward",
      ],
      es: [
        "Reconoce los retos con honestidad",
        "Brinda estructura y apoyo prácticos",
        "Protege al equipo cuando haga falta",
        "Enfócate en aprendizaje, no en culpas",
        "Reconoce la resiliencia del equipo después",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you maintain your own morale during team struggles?",
        "What if a team member was clearly at fault?",
        "How do you prevent burnout during crises?",
      ],
      es: [
        "¿Cómo mantienes tu propia moral durante las crisis?",
        "¿Qué harías si un miembro fuera claramente responsable?",
        "¿Cómo previenes el burnout en crisis?",
      ],
    },
  },

  // ============ Adaptability (21-25) ============
  {
    id: "ss-21-handle-sudden-priority-change",
    questionNumber: 21,
    difficulty: "Mid",
    category: "Adaptability",
    title: {
      en: "Handling Sudden Priority Changes",
      es: "Manejar Cambios Repentinos de Prioridades",
    },
    question: {
      en: "Describe a time when priorities suddenly changed mid-project. How did you adapt?",
      es: "Describe una ocasión en la que las prioridades cambiaron de repente a mitad de proyecto. ¿Cómo te adaptaste?",
    },
    context: {
      en: "Business needs change, and developers must adapt. This question assesses your flexibility and ability to handle disruption.",
      es: "Las necesidades del negocio cambian, y los desarrolladores deben adaptarse. Esta pregunta evalúa tu flexibilidad y capacidad de manejar disrupciones.",
    },
    whyAsked: {
      en: "Rigidity slows teams down. Interviewers want to see you can pivot without losing productivity or morale.",
      es: "La rigidez ralentiza a los equipos. Los entrevistadores quieren ver que puedes pivotar sin perder productividad ni moral.",
    },
    commonMistakes: {
      en: [
        "Complaining about the change",
        "Describing resistance rather than adaptation",
        "Not showing how you managed the transition",
        "Ignoring impact on teammates",
      ],
      es: [
        "Quejarte del cambio",
        "Describir resistencia en vez de adaptación",
        "No mostrar cómo gestionaste la transición",
        "Ignorar el impacto en los compañeros",
      ],
    },
    answerFramework: {
      en: "Describe the change, your initial reaction, how you adapted, and the successful outcome.",
      es: "Describe el cambio, tu reacción inicial, cómo te adaptaste y el resultado exitoso.",
    },
    sampleAnswer: {
      en: `Three weeks into a four-week feature build, we learned a competitor had launched similar functionality. Leadership wanted us to pivot to a different differentiating feature immediately.

My initial reaction was frustration, as we'd invested significant effort. But I took a few minutes to process before responding. Then I focused on what we could salvage.

I analyzed our work: 60% of the code was reusable for the new feature with modifications. I proposed a plan to leadership showing what we could carry forward and what needed to be rebuilt.

We delivered the pivoted feature on time by leveraging our existing work. The competitor-response feature ended up being more valuable than the original plan.`,
      es: `Tres semanas dentro de un desarrollo de cuatro semanas, supimos que un competidor había lanzado funcionalidad similar. Dirección quería que pivotáramos a una funcionalidad diferenciadora de inmediato.

Mi reacción inicial fue frustración, ya que habíamos invertido esfuerzo significativo. Pero me tomé unos minutos para procesar antes de responder. Luego me enfoqué en lo que podíamos rescatar.

Analicé nuestro trabajo: el 60% del código era reutilizable para la nueva funcionalidad con modificaciones. Propuse un plan a dirección mostrando qué podíamos conservar y qué había que reconstruir.

Entregamos la funcionalidad pivotada a tiempo aprovechando el trabajo existente. La respuesta al competidor terminó siendo más valiosa que el plan original.`,
    },
    keyPoints: {
      en: [
        "Process your reaction before responding",
        "Look for what can be salvaged or repurposed",
        "Create a clear transition plan",
        "Support teammates through the change",
        "Find the opportunity in the disruption",
      ],
      es: [
        "Procesa tu reacción antes de responder",
        "Busca qué puede rescatarse o reutilizarse",
        "Crea un plan de transición claro",
        "Apoya a los compañeros durante el cambio",
        "Encuentra la oportunidad en la disrupción",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle multiple priority changes?",
        "When should you push back on changes?",
        "How do you communicate priority changes to your team?",
      ],
      es: [
        "¿Cómo manejas múltiples cambios de prioridad?",
        "¿Cuándo deberías oponerte a un cambio?",
        "¿Cómo comunicas cambios de prioridad a tu equipo?",
      ],
    },
  },
  {
    id: "ss-22-learn-new-technology-quickly",
    questionNumber: 22,
    difficulty: "Mid",
    category: "Adaptability",
    title: {
      en: "Learning a New Technology Quickly",
      es: "Aprender una Tecnología Nueva Rápidamente",
    },
    question: {
      en: "Tell me about a time you had to learn a new technology or framework quickly for a project.",
      es: "Cuéntame sobre una ocasión en la que tuviste que aprender rápido una tecnología o framework nuevo para un proyecto.",
    },
    context: {
      en: "Technology evolves constantly. This question assesses your learning agility and ability to become productive in new domains.",
      es: "La tecnología evoluciona constantemente. Esta pregunta evalúa tu agilidad de aprendizaje y tu capacidad para volverte productivo en nuevos dominios.",
    },
    whyAsked: {
      en: "Interviewers want to see you can upskill efficiently and apply new knowledge effectively under time pressure.",
      es: "Los entrevistadores quieren ver que puedes actualizarte eficientemente y aplicar nuevo conocimiento bajo presión de tiempo.",
    },
    commonMistakes: {
      en: [
        "Describing superficial learning",
        "Not showing your learning strategy",
        "Claiming expertise after minimal exposure",
        "Not leveraging available resources",
      ],
      es: [
        "Describir aprendizaje superficial",
        "No mostrar tu estrategia de aprendizaje",
        "Afirmar expertise tras exposición mínima",
        "No aprovechar los recursos disponibles",
      ],
    },
    answerFramework: {
      en: "Describe the technology, your learning approach, how you applied it, and the outcome.",
      es: "Describe la tecnología, tu enfoque de aprendizaje, cómo la aplicaste y el resultado.",
    },
    sampleAnswer: {
      en: `Our team decided to migrate from REST to GraphQL for our new API. I had no GraphQL experience and had two weeks to become productive.

I created a structured learning plan: days 1-2 fundamentals through official docs and tutorials; days 3-4 building a small personal project; days 5-7 studying our codebase to understand where GraphQL would fit; week 2 implementing a real feature with support from our one GraphQL-experienced colleague.

I time-boxed learning sessions to avoid rabbit holes. When stuck, I'd search for 15 minutes, then ask for help.

By week two, I was contributing productively. Within a month, I'd given a lunch-and-learn to help others onboard.`,
      es: `Nuestro equipo decidió migrar de REST a GraphQL para la nueva API. Yo no tenía experiencia en GraphQL y tenía dos semanas para ser productivo.

Creé un plan de aprendizaje estructurado: días 1-2 fundamentos con docs oficiales y tutoriales; días 3-4 construir un pequeño proyecto personal; días 5-7 estudiar nuestro codebase para entender dónde encajaría GraphQL; semana 2 implementar una funcionalidad real con apoyo del único colega con experiencia.

Puse time-box a las sesiones para evitar rabbit holes. Cuando me atascaba, buscaba 15 minutos y luego pedía ayuda.

En la segunda semana ya aportaba productivamente. En un mes había dado un lunch-and-learn para ayudar a otros a hacer onboarding.`,
    },
    keyPoints: {
      en: [
        "Create a structured learning plan",
        "Balance theory with practical application",
        "Time-box learning to avoid rabbit holes",
        "Know when to ask for help",
        "Share learnings with the team",
      ],
      es: [
        "Crea un plan de aprendizaje estructurado",
        "Balancea teoría con aplicación práctica",
        "Pon time-box al aprendizaje para evitar rabbit holes",
        "Sabe cuándo pedir ayuda",
        "Comparte los aprendizajes con el equipo",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you stay current with technology trends?",
        "What's your go-to approach for learning?",
        "How do you decide what's worth learning deeply?",
      ],
      es: [
        "¿Cómo te mantienes al día con las tendencias tecnológicas?",
        "¿Cuál es tu enfoque habitual de aprendizaje?",
        "¿Cómo decides qué vale la pena aprender en profundidad?",
      ],
    },
  },
  {
    id: "ss-23-adapt-to-company-change",
    questionNumber: 23,
    difficulty: "Mid",
    category: "Adaptability",
    title: {
      en: "Adapting to Organizational Change",
      es: "Adaptarse a Cambios Organizacionales",
    },
    question: {
      en: "Describe how you adapted to a significant organizational change (new manager, team restructure, process change).",
      es: "Describe cómo te adaptaste a un cambio organizacional importante (nuevo manager, reestructura de equipo, cambio de proceso).",
    },
    context: {
      en: "Organizations evolve through restructures, leadership changes, and process updates. This question assesses your resilience through change.",
      es: "Las organizaciones evolucionan mediante reestructuras, cambios de liderazgo y actualizaciones de proceso. Esta pregunta evalúa tu resiliencia ante el cambio.",
    },
    whyAsked: {
      en: "Change resistance hurts teams. Interviewers want to see you can thrive through organizational shifts.",
      es: "La resistencia al cambio perjudica a los equipos. Los entrevistadores quieren ver que puedes prosperar ante cambios organizacionales.",
    },
    commonMistakes: {
      en: [
        "Expressing bitterness about the change",
        "Describing passive acceptance",
        "Not showing how you actively adapted",
        "Ignoring the human element of change",
      ],
      es: [
        "Expresar amargura por el cambio",
        "Describir aceptación pasiva",
        "No mostrar cómo te adaptaste activamente",
        "Ignorar el elemento humano del cambio",
      ],
    },
    answerFramework: {
      en: "Describe the change, its impact, how you adapted, and how you supported others through it.",
      es: "Describe el cambio, su impacto, cómo te adaptaste y cómo apoyaste a otros.",
    },
    sampleAnswer: {
      en: `Our company reorganized, and my team was merged with another team under a new manager. We went from a tight-knit group of 5 to a larger team of 12 with different processes.

Initially, I was anxious about losing our team culture. Instead of resisting, I scheduled a 1:1 with the new manager to understand her vision and share our team's strengths.

I volunteered to help with integration by documenting our team's tribal knowledge and suggesting process compromises that kept the best of both approaches.

Within three months, the combined team was more effective than either original team.`,
      es: `Nuestra empresa se reorganizó y mi equipo se fusionó con otro bajo una nueva manager. Pasamos de un grupo unido de 5 a uno mayor de 12 con procesos distintos.

Inicialmente tenía ansiedad por perder nuestra cultura de equipo. En lugar de resistirme, agendé un 1:1 con la nueva manager para entender su visión y compartir las fortalezas de nuestro equipo.

Me ofrecí a ayudar con la integración documentando el conocimiento tribal del equipo y sugiriendo compromisos de proceso que mantuvieran lo mejor de ambos enfoques.

En tres meses el equipo combinado fue más efectivo que cualquiera de los originales.`,
    },
    keyPoints: {
      en: [
        "Approach change with curiosity, not resistance",
        "Understand leadership's perspective",
        "Proactively contribute to successful transition",
        "Support teammates through the change",
        "Find opportunities in the new structure",
      ],
      es: [
        "Aborda el cambio con curiosidad, no con resistencia",
        "Entiende la perspectiva del liderazgo",
        "Contribuye proactivamente a una transición exitosa",
        "Apoya a los compañeros durante el cambio",
        "Encuentra oportunidades en la nueva estructura",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle change you disagree with?",
        "What's the hardest organizational change you've experienced?",
        "How do you help resistant colleagues adapt?",
      ],
      es: [
        "¿Cómo manejas cambios con los que no estás de acuerdo?",
        "¿Cuál es el cambio organizacional más difícil que has vivido?",
        "¿Cómo ayudas a adaptarse a colegas reticentes?",
      ],
    },
  },
  {
    id: "ss-24-handle-ambiguous-requirements",
    questionNumber: 24,
    difficulty: "Mid",
    category: "Adaptability",
    title: {
      en: "Handling Ambiguous Requirements",
      es: "Manejar Requisitos Ambiguos",
    },
    question: {
      en: "Tell me about a time you had to work with incomplete or ambiguous requirements. How did you proceed?",
      es: "Cuéntame sobre una ocasión en la que tuviste que trabajar con requisitos incompletos o ambiguos. ¿Cómo procediste?",
    },
    context: {
      en: "Requirements are rarely perfect. This question assesses your ability to make progress despite uncertainty.",
      es: "Los requisitos rara vez son perfectos. Esta pregunta evalúa tu capacidad de avanzar pese a la incertidumbre.",
    },
    whyAsked: {
      en: "Waiting for perfect information causes delays. Interviewers want to see you can navigate ambiguity productively.",
      es: "Esperar información perfecta causa retrasos. Los entrevistadores quieren ver que puedes navegar la ambigüedad productivamente.",
    },
    commonMistakes: {
      en: [
        "Waiting indefinitely for clarity",
        "Making assumptions without validation",
        "Blaming product/business for unclear requirements",
        "Building the wrong thing without checking",
      ],
      es: [
        "Esperar indefinidamente por claridad",
        "Hacer suposiciones sin validación",
        "Culpar a producto/negocio por requisitos poco claros",
        "Construir algo incorrecto sin verificar",
      ],
    },
    answerFramework: {
      en: "Describe the ambiguity, how you sought clarity, how you proceeded with remaining uncertainty, and the outcome.",
      es: "Describe la ambigüedad, cómo buscaste claridad, cómo procediste con la incertidumbre restante y el resultado.",
    },
    sampleAnswer: {
      en: `I was assigned to build an 'admin dashboard' with a one-page spec that said 'show key metrics and allow user management.' No mockups, no specific metrics defined.

Instead of waiting for perfect requirements, I listed my assumptions and unknowns, then scheduled a 30-minute meeting with the product manager to clarify the most critical questions.

For metrics, we identified three must-haves together. For user management, I proposed starting with the most common operations based on support tickets.

I built an MVP in one week and demoed it. Because I'd architected flexibly, adding features was straightforward. This iterative approach got us to a solid dashboard in three weeks.`,
      es: `Me asignaron construir un 'admin dashboard' con una spec de una página que decía 'mostrar métricas clave y permitir gestión de usuarios'. Sin mockups ni métricas específicas.

En lugar de esperar requisitos perfectos, listé mis suposiciones y desconocidos, y agendé una reunión de 30 minutos con el PM para aclarar lo más crítico.

Para métricas identificamos juntos tres must-haves. Para gestión de usuarios, propuse empezar con las operaciones más comunes basándome en tickets de soporte.

Construí un MVP en una semana y lo demostré. Como había diseñado con flexibilidad, agregar features fue sencillo. Este enfoque iterativo nos llevó a un dashboard sólido en tres semanas.`,
    },
    keyPoints: {
      en: [
        "Document assumptions and unknowns",
        "Proactively seek clarity on critical items",
        "Proceed with reasonable assumptions",
        "Build flexibility for changes",
        "Iterate with stakeholders frequently",
      ],
      es: [
        "Documenta suposiciones y desconocidos",
        "Busca proactivamente claridad en lo crítico",
        "Avanza con suposiciones razonables",
        "Construye con flexibilidad para cambios",
        "Itera frecuentemente con los stakeholders",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you prioritize which ambiguities to resolve first?",
        "What if the stakeholder isn't available to clarify?",
        "How do you balance moving fast with getting it right?",
      ],
      es: [
        "¿Cómo priorizas qué ambigüedades resolver primero?",
        "¿Qué haces si el stakeholder no está disponible para aclarar?",
        "¿Cómo balanceas moverse rápido con hacerlo bien?",
      ],
    },
  },
  {
    id: "ss-25-work-outside-comfort-zone",
    questionNumber: 25,
    difficulty: "Mid",
    category: "Adaptability",
    title: {
      en: "Working Outside Your Comfort Zone",
      es: "Trabajar Fuera de tu Zona de Confort",
    },
    question: {
      en: "Describe a situation where you had to take on responsibilities outside your comfort zone or expertise.",
      es: "Describe una situación en la que tuviste que asumir responsabilidades fuera de tu zona de confort o expertise.",
    },
    context: {
      en: "Growth happens outside comfort zones. This question assesses your willingness to stretch and grow.",
      es: "El crecimiento ocurre fuera de la zona de confort. Esta pregunta evalúa tu disposición a estirarte y crecer.",
    },
    whyAsked: {
      en: "Teams need flexible members who can fill gaps. Interviewers want to see you embrace growth opportunities.",
      es: "Los equipos necesitan miembros flexibles que llenen huecos. Los entrevistadores quieren ver que abrazas las oportunidades de crecimiento.",
    },
    commonMistakes: {
      en: [
        "Staying only in comfortable areas",
        "Pretending expertise you don't have",
        "Not showing vulnerability or learning",
        "Describing reluctance without growth",
      ],
      es: [
        "Quedarte sólo en áreas cómodas",
        "Aparentar un expertise que no tienes",
        "No mostrar vulnerabilidad o aprendizaje",
        "Describir reticencia sin crecimiento",
      ],
    },
    answerFramework: {
      en: "Describe the uncomfortable responsibility, how you approached it, what you learned, and the outcome.",
      es: "Describe la responsabilidad incómoda, cómo la abordaste, qué aprendiste y el resultado.",
    },
    sampleAnswer: {
      en: `Our team lead left unexpectedly, and I was asked to facilitate sprint ceremonies temporarily. I'm naturally introverted and had never led meetings.

I was nervous but saw it as a growth opportunity. I reached out to an engineering manager I respected and asked for tips. She suggested I observe her facilitate a meeting and gave me a framework.

For my first standup, I over-prepared: agenda, talking points, and time allocations. It was awkward, but I got through it. I asked the team for anonymous feedback and iterated.

By week four, I found my own style and discovered I actually enjoyed helping the team stay aligned. The experience expanded my view of leadership.`,
      es: `Nuestro tech lead se fue inesperadamente y me pidieron facilitar las ceremonias de sprint temporalmente. Soy naturalmente introvertido y nunca había liderado reuniones.

Estaba nervioso pero lo vi como una oportunidad de crecimiento. Contacté a un engineering manager que respetaba y le pedí consejos. Me sugirió observar su facilitación y me dio un framework.

Para mi primer standup me sobrepreparé: agenda, puntos y tiempos. Fue incómodo, pero lo logré. Pedí feedback anónimo al equipo e iteré.

En la cuarta semana encontré mi propio estilo y descubrí que disfrutaba ayudar al equipo a mantenerse alineado. La experiencia amplió mi visión del liderazgo.`,
    },
    keyPoints: {
      en: [
        "Embrace discomfort as growth opportunity",
        "Seek guidance from those with experience",
        "Prepare thoroughly for unfamiliar situations",
        "Ask for feedback and iterate",
        "Reflect on what you learned",
      ],
      es: [
        "Abraza la incomodidad como oportunidad de crecimiento",
        "Busca guía de quienes tienen experiencia",
        "Prepárate a fondo para situaciones desconocidas",
        "Pide feedback e itera",
        "Reflexiona sobre lo aprendido",
      ],
    },
    followUpQuestions: {
      en: [
        "What's something you're still uncomfortable with?",
        "How do you push yourself to grow?",
        "When should you say no to stretch assignments?",
      ],
      es: [
        "¿Con qué sigues sintiéndote incómodo?",
        "¿Cómo te empujas a crecer?",
        "¿Cuándo deberías decir no a asignaciones de stretch?",
      ],
    },
  },

  // ============ Conflict Resolution (26-30) ============
  {
    id: "ss-26-resolve-team-conflict",
    questionNumber: 26,
    difficulty: "Senior",
    category: "Conflict Resolution",
    title: {
      en: "Resolving a Conflict Between Team Members",
      es: "Resolver un Conflicto Entre Miembros del Equipo",
    },
    question: {
      en: "Describe a time when two colleagues were in conflict. How did you help resolve it?",
      es: "Describe una ocasión en la que dos colegas estaban en conflicto. ¿Cómo ayudaste a resolverlo?",
    },
    context: {
      en: "Conflicts happen in teams. This question assesses your conflict resolution skills and ability to maintain team harmony.",
      es: "Los conflictos ocurren en los equipos. Esta pregunta evalúa tus habilidades de resolución y tu capacidad de mantener la armonía.",
    },
    whyAsked: {
      en: "Unresolved conflicts hurt productivity. Interviewers want to see you can help navigate interpersonal challenges.",
      es: "Los conflictos sin resolver dañan la productividad. Los entrevistadores quieren ver que puedes ayudar a navegar retos interpersonales.",
    },
    commonMistakes: {
      en: [
        "Taking sides",
        "Avoiding conflict rather than addressing it",
        "Escalating unnecessarily",
        "Gossiping about the conflict",
      ],
      es: [
        "Tomar partido",
        "Evitar el conflicto en vez de abordarlo",
        "Escalar innecesariamente",
        "Chismorrear sobre el conflicto",
      ],
    },
    answerFramework: {
      en: "Describe the conflict, your role, how you helped resolve it, and the outcome.",
      es: "Describe el conflicto, tu rol, cómo ayudaste a resolverlo y el resultado.",
    },
    sampleAnswer: {
      en: `Two teammates had growing tension over code review comments. One felt the other was overly critical; the other felt their feedback was being ignored.

I noticed the tension affecting team dynamics and approached them individually first. I listened to each perspective without judgment and found both had valid points.

I suggested we have a coffee chat, all three of us, in a neutral setting. I facilitated by establishing ground rules: one person speaks at a time, focus on behaviors not personalities.

It turned out the underlying issue was different expectations about code review purpose. Once that was clear, we created shared code review guidelines as a team.`,
      es: `Dos compañeros tenían tensión creciente por comentarios de code review. Uno sentía que el otro era demasiado crítico; el otro sentía que su feedback era ignorado.

Noté que la tensión afectaba la dinámica del equipo y me acerqué a cada uno primero. Escuché cada perspectiva sin juzgar y encontré que ambos tenían puntos válidos.

Sugerí un coffee chat entre los tres en un entorno neutral. Facilité estableciendo reglas: una persona habla a la vez, enfoque en comportamientos no en personalidades.

Resultó que el problema de fondo era expectativas distintas sobre el propósito del code review. Una vez claro, creamos guidelines compartidos de code review como equipo.`,
    },
    keyPoints: {
      en: [
        "Address conflict early before it escalates",
        "Hear all perspectives without judgment",
        "Look for underlying issues",
        "Facilitate, don't dictate solutions",
        "Create structures to prevent recurrence",
      ],
      es: [
        "Aborda el conflicto temprano antes de que escale",
        "Escucha todas las perspectivas sin juicio",
        "Busca problemas de fondo",
        "Facilita, no dictes soluciones",
        "Crea estructuras para prevenir recurrencia",
      ],
    },
    followUpQuestions: {
      en: [
        "What if one party refused to engage?",
        "When should conflicts be escalated to management?",
        "How do you prevent conflicts from starting?",
      ],
      es: [
        "¿Qué harías si una de las partes se negara a participar?",
        "¿Cuándo deberían escalarse los conflictos a management?",
        "¿Cómo previenes que los conflictos comiencen?",
      ],
    },
  },
  {
    id: "ss-27-manage-difficult-stakeholder",
    questionNumber: 27,
    difficulty: "Mid",
    category: "Conflict Resolution",
    title: {
      en: "Managing a Difficult Stakeholder",
      es: "Gestionar a un Stakeholder Difícil",
    },
    question: {
      en: "Tell me about a time you had to work with a difficult stakeholder or client. How did you manage the relationship?",
      es: "Cuéntame sobre una ocasión en la que tuviste que trabajar con un stakeholder o cliente difícil. ¿Cómo manejaste la relación?",
    },
    context: {
      en: "Not all stakeholders are easy to work with. This question assesses your professional patience and relationship management skills.",
      es: "No todos los stakeholders son fáciles. Esta pregunta evalúa tu paciencia profesional y tus habilidades de gestión de relaciones.",
    },
    whyAsked: {
      en: "Interviewers want to see you can maintain professionalism and get work done despite challenging relationships.",
      es: "Los entrevistadores quieren ver que mantienes profesionalismo y entregas pese a relaciones complicadas.",
    },
    commonMistakes: {
      en: [
        "Describing the stakeholder only negatively",
        "Avoiding them rather than engaging",
        "Escalating without trying to resolve",
        "Letting frustration show in your answer",
      ],
      es: [
        "Describir al stakeholder sólo de forma negativa",
        "Evitarlo en vez de interactuar",
        "Escalar sin intentar resolver",
        "Dejar que la frustración se note en tu respuesta",
      ],
    },
    answerFramework: {
      en: "Describe the challenge, your approach to understanding and managing it, and the improved outcome.",
      es: "Describe el reto, tu enfoque para entenderlo y gestionarlo, y el resultado mejorado.",
    },
    sampleAnswer: {
      en: `I worked with a product manager who would frequently change requirements mid-sprint and become frustrated when features weren't exactly as imagined.

Instead of labeling him as difficult, I tried to understand his perspective. In a 1:1, I learned he was under pressure from sales who wanted features for specific clients.

I proposed a weekly 30-minute sync where he could share upcoming client needs, and we could discuss feasibility before he made promises. I also started sending him daily async updates.

For mid-sprint changes, we agreed on a process: emergency changes were okay, but regular changes would wait for the next sprint. Our sprint completion rate went from 60% to 90%.`,
      es: `Trabajé con un product manager que frecuentemente cambiaba requisitos a mitad de sprint y se frustraba cuando las features no eran exactamente como las imaginaba.

En vez de etiquetarlo como difícil, intenté entender su perspectiva. En un 1:1 supe que estaba bajo presión de ventas que pedían features para clientes específicos.

Propuse un sync semanal de 30 minutos donde podía compartir necesidades futuras, y pudiéramos discutir factibilidad antes de que hiciera promesas. También empecé a enviarle updates asíncronos diarios.

Para cambios a mitad de sprint acordamos un proceso: urgencias sí, cambios normales esperaban al siguiente sprint. Nuestra tasa de completitud de sprint pasó de 60% a 90%.`,
    },
    keyPoints: {
      en: [
        "Seek to understand their pressures",
        "Build regular communication channels",
        "Create processes that address their needs",
        "Set boundaries with empathy",
        "Focus on partnership, not adversary",
      ],
      es: [
        "Busca entender sus presiones",
        "Construye canales de comunicación regulares",
        "Crea procesos que atiendan sus necesidades",
        "Pon límites con empatía",
        "Enfócate en alianza, no en adversario",
      ],
    },
    followUpQuestions: {
      en: [
        "What if they refused to follow agreed processes?",
        "How do you handle stakeholders who don't trust developers?",
        "When should you escalate stakeholder issues?",
      ],
      es: [
        "¿Qué harías si se negaran a seguir los procesos acordados?",
        "¿Cómo manejas stakeholders que no confían en desarrolladores?",
        "¿Cuándo deberías escalar problemas con stakeholders?",
      ],
    },
  },
  {
    id: "ss-28-push-back-on-unreasonable-request",
    questionNumber: 28,
    difficulty: "Senior",
    category: "Conflict Resolution",
    title: {
      en: "Pushing Back on Unreasonable Requests",
      es: "Oponerse a Peticiones Irrazonables",
    },
    question: {
      en: "Describe a time when you pushed back on an unreasonable request from a manager or stakeholder.",
      es: "Describe una ocasión en la que te opusiste a una petición irrazonable de un manager o stakeholder.",
    },
    context: {
      en: "Sometimes requests are unreasonable and need to be challenged. This question assesses your judgment and assertiveness.",
      es: "A veces las peticiones son irrazonables y deben cuestionarse. Esta pregunta evalúa tu juicio y asertividad.",
    },
    whyAsked: {
      en: "Yes-people create problems. Interviewers want to see you can respectfully push back when needed.",
      es: "Los 'sí-señor' crean problemas. Los entrevistadores quieren ver que puedes oponerte con respeto cuando hace falta.",
    },
    commonMistakes: {
      en: [
        "Always saying yes to avoid conflict",
        "Pushing back without offering alternatives",
        "Being confrontational or disrespectful",
        "Not picking your battles wisely",
      ],
      es: [
        "Siempre decir sí para evitar conflicto",
        "Oponerte sin ofrecer alternativas",
        "Ser confrontacional o irrespetuoso",
        "No elegir bien tus batallas",
      ],
    },
    answerFramework: {
      en: "Describe the unreasonable request, why it was problematic, how you pushed back constructively, and the outcome.",
      es: "Describe la petición irrazonable, por qué era problemática, cómo te opusiste constructivamente y el resultado.",
    },
    sampleAnswer: {
      en: `My manager asked me to implement a 'quick' security fix by storing passwords in plain text temporarily while we migrated systems. He was under pressure to meet a deadline.

I understood the pressure but couldn't compromise on security. I explained the risks: regulatory implications, potential data breach, and damage to user trust.

Instead of just saying no, I proposed alternatives: delay the migration by one week to do it properly, or use a two-phase approach where the secure path was built first.

He appreciated that I provided options rather than just pushback. We went with the two-phase approach and launched securely on time.`,
      es: `Mi manager me pidió implementar un fix de seguridad 'rápido' almacenando contraseñas en texto plano temporalmente mientras migrábamos sistemas. Estaba bajo presión por una fecha límite.

Entendí la presión pero no podía ceder en seguridad. Expliqué los riesgos: implicaciones regulatorias, brecha potencial de datos y daño a la confianza del usuario.

En lugar de simplemente decir no, propuse alternativas: retrasar la migración una semana para hacerlo bien, o un enfoque en dos fases donde la ruta segura se construyera primero.

Valoró que ofreciera opciones en lugar de sólo oponerme. Elegimos el enfoque de dos fases y lanzamos con seguridad a tiempo.`,
    },
    keyPoints: {
      en: [
        "Understand the underlying pressure or need",
        "Explain the 'why' behind your pushback",
        "Offer alternative solutions",
        "Be respectful but firm on important issues",
        "Know which battles are worth fighting",
      ],
      es: [
        "Entiende la presión o necesidad subyacente",
        "Explica el 'por qué' detrás de tu oposición",
        "Ofrece soluciones alternativas",
        "Sé respetuoso pero firme en lo importante",
        "Sabe qué batallas vale la pena pelear",
      ],
    },
    followUpQuestions: {
      en: [
        "What if they insisted despite your pushback?",
        "How do you decide when to push back?",
        "Have you ever been wrong in pushing back?",
      ],
      es: [
        "¿Qué harías si insistieran a pesar de tu oposición?",
        "¿Cómo decides cuándo oponerte?",
        "¿Alguna vez te equivocaste al oponerte?",
      ],
    },
  },
  {
    id: "ss-29-repair-damaged-relationship",
    questionNumber: 29,
    difficulty: "Senior",
    category: "Conflict Resolution",
    title: {
      en: "Repairing a Damaged Professional Relationship",
      es: "Reparar una Relación Profesional Dañada",
    },
    question: {
      en: "Tell me about a time you damaged a professional relationship and had to repair it.",
      es: "Cuéntame sobre una ocasión en la que dañaste una relación profesional y tuviste que repararla.",
    },
    context: {
      en: "Mistakes happen in relationships. This question assesses your humility and ability to take responsibility and rebuild trust.",
      es: "Los errores ocurren en las relaciones. Esta pregunta evalúa tu humildad y capacidad de asumir responsabilidad y reconstruir confianza.",
    },
    whyAsked: {
      en: "Interviewers want to see emotional maturity, accountability, and ability to recover from interpersonal mistakes.",
      es: "Los entrevistadores quieren ver madurez emocional, responsabilidad y capacidad de recuperarse de errores interpersonales.",
    },
    commonMistakes: {
      en: [
        "Blaming the other person",
        "Minimizing your role in the damage",
        "Describing superficial repair without genuine change",
        "Not showing what you learned",
      ],
      es: [
        "Culpar a la otra persona",
        "Minimizar tu rol en el daño",
        "Describir reparación superficial sin cambio genuino",
        "No mostrar lo que aprendiste",
      ],
    },
    answerFramework: {
      en: "Describe what damaged the relationship, how you recognized your role, steps you took to repair it, and the outcome.",
      es: "Describe lo que dañó la relación, cómo reconociste tu rol, los pasos para repararla y el resultado.",
    },
    sampleAnswer: {
      en: `During a stressful sprint, I publicly criticized a teammate's code in a standup, calling it 'sloppy.' I was frustrated and spoke without thinking.

She stopped collaborating with me, and the team atmosphere became tense. A colleague pointed out that my comment was inappropriate, even if my technical concerns were valid.

I scheduled a private conversation, apologized sincerely without excuses, and acknowledged the impact of my words. I asked how I could make it right. Over the following weeks, I made a point to acknowledge her contributions in meetings and provide balanced feedback privately first.

It took about a month for the relationship to fully recover. I learned to never give critical feedback publicly.`,
      es: `Durante un sprint estresante, critiqué públicamente el código de una compañera en un standup, llamándolo 'descuidado'. Estaba frustrado y hablé sin pensar.

Dejó de colaborar conmigo y el ambiente del equipo se tensó. Un colega me señaló que mi comentario fue inapropiado, aunque mis preocupaciones técnicas fueran válidas.

Agendé una conversación privada, me disculpé sinceramente sin excusas y reconocí el impacto de mis palabras. Le pregunté cómo podía remediarlo. Durante semanas me aseguré de reconocer sus contribuciones en reuniones y dar feedback balanceado en privado primero.

Tomó cerca de un mes recuperar totalmente la relación. Aprendí a nunca dar feedback crítico en público.`,
    },
    keyPoints: {
      en: [
        "Recognize and own your mistake",
        "Apologize sincerely without excuses",
        "Ask how to make it right",
        "Change behavior consistently",
        "Be patient as trust rebuilds",
      ],
      es: [
        "Reconoce y asume tu error",
        "Discúlpate con sinceridad, sin excusas",
        "Pregunta cómo puedes remediarlo",
        "Cambia el comportamiento de forma consistente",
        "Sé paciente mientras se reconstruye la confianza",
      ],
    },
    followUpQuestions: {
      en: [
        "What if they refused to forgive you?",
        "How do you prevent yourself from similar mistakes?",
        "What's the most important thing you learned from this?",
      ],
      es: [
        "¿Qué harías si se negaran a perdonarte?",
        "¿Cómo previenes errores similares?",
        "¿Qué fue lo más importante que aprendiste?",
      ],
    },
  },
  {
    id: "ss-30-handle-unfair-treatment",
    questionNumber: 30,
    difficulty: "Mid",
    category: "Conflict Resolution",
    title: {
      en: "Handling Perceived Unfair Treatment",
      es: "Manejar un Trato Percibido Como Injusto",
    },
    question: {
      en: "Describe a time when you felt you were treated unfairly at work. How did you handle it?",
      es: "Describe una ocasión en la que sentiste que te trataron injustamente en el trabajo. ¿Cómo lo manejaste?",
    },
    context: {
      en: "Perceptions of unfairness can damage morale and relationships. This question assesses your maturity in handling difficult situations.",
      es: "La percepción de injusticia puede dañar la moral y las relaciones. Esta pregunta evalúa tu madurez al manejar situaciones difíciles.",
    },
    whyAsked: {
      en: "Interviewers want to see you can address concerns professionally without damaging relationships or productivity.",
      es: "Los entrevistadores quieren ver que puedes abordar preocupaciones de forma profesional sin dañar relaciones ni productividad.",
    },
    commonMistakes: {
      en: [
        "Complaining without taking action",
        "Becoming bitter or passive-aggressive",
        "Escalating before trying to resolve directly",
        "Not considering other perspectives",
      ],
      es: [
        "Quejarte sin tomar acción",
        "Volverte amargado o pasivo-agresivo",
        "Escalar antes de intentar resolver directamente",
        "No considerar otras perspectivas",
      ],
    },
    answerFramework: {
      en: "Describe the situation, your initial reaction, how you addressed it constructively, and the outcome.",
      es: "Describe la situación, tu reacción inicial, cómo la abordaste constructivamente y el resultado.",
    },
    sampleAnswer: {
      en: `I was passed over for a tech lead role that went to a colleague with less experience. I initially felt resentful, believing I deserved the promotion.

Instead of complaining to teammates, I asked my manager for feedback on why I wasn't selected. I approached it as wanting to understand, not challenge the decision.

She explained that while my technical skills were strong, the role required more stakeholder management experience, which my colleague had. She outlined what I'd need to demonstrate for future opportunities.

Six months later, a similar role opened, and I got it. The feedback and growth period made me more prepared than I would have been earlier.`,
      es: `Me pasaron por alto para un rol de tech lead que fue a un colega con menos experiencia. Al principio sentí resentimiento, creyendo que merecía el ascenso.

En vez de quejarme con los compañeros, le pedí feedback a mi manager sobre por qué no fui seleccionado. Lo abordé como querer entender, no cuestionar la decisión.

Me explicó que aunque mis habilidades técnicas eran fuertes, el rol requería más experiencia en gestión de stakeholders, que mi colega tenía. Me delineó qué necesitaba demostrar para futuras oportunidades.

Seis meses después se abrió un rol similar y lo obtuve. El feedback y el período de crecimiento me dejaron más preparado.`,
    },
    keyPoints: {
      en: [
        "Process your reaction before acting",
        "Seek understanding, not just validation",
        "Consider perspectives you might be missing",
        "Use feedback for growth",
        "Maintain professionalism regardless of outcome",
      ],
      es: [
        "Procesa tu reacción antes de actuar",
        "Busca entendimiento, no sólo validación",
        "Considera perspectivas que puedas estar pasando por alto",
        "Usa el feedback para crecer",
        "Mantén el profesionalismo sin importar el resultado",
      ],
    },
    followUpQuestions: {
      en: [
        "What if the feedback seemed unfair too?",
        "How do you distinguish valid unfairness from perception?",
        "When should unfairness be formally escalated?",
      ],
      es: [
        "¿Qué harías si el feedback también pareciera injusto?",
        "¿Cómo distingues una injusticia real de una percepción?",
        "¿Cuándo una injusticia debería escalarse formalmente?",
      ],
    },
  },

  // ============ Time Management (31-35) ============
  {
    id: "ss-31-manage-multiple-priorities",
    questionNumber: 31,
    difficulty: "Mid",
    category: "Time Management",
    title: {
      en: "Managing Multiple Competing Priorities",
      es: "Gestionar Múltiples Prioridades en Competencia",
    },
    question: {
      en: "How do you handle having multiple urgent priorities competing for your attention?",
      es: "¿Cómo manejas tener múltiples prioridades urgentes compitiendo por tu atención?",
    },
    context: {
      en: "Developers often juggle multiple tasks and stakeholders. This question assesses your prioritization and organization skills.",
      es: "Los desarrolladores suelen malabarear múltiples tareas y stakeholders. Esta pregunta evalúa tu priorización y organización.",
    },
    whyAsked: {
      en: "Chaos without prioritization hurts productivity. Interviewers want to see you have systems for managing competing demands.",
      es: "El caos sin priorización daña la productividad. Los entrevistadores quieren ver que tienes sistemas para gestionar demandas en competencia.",
    },
    commonMistakes: {
      en: [
        "Saying you just work harder",
        "Not having a clear prioritization framework",
        "Trying to do everything at once",
        "Not communicating about tradeoffs",
      ],
      es: [
        "Decir que simplemente trabajas más",
        "No tener un framework claro de priorización",
        "Intentar hacer todo a la vez",
        "No comunicar los trade-offs",
      ],
    },
    answerFramework: {
      en: "Describe a specific situation with competing priorities, your prioritization approach, how you communicated, and the outcome.",
      es: "Describe una situación concreta con prioridades en competencia, tu enfoque de priorización, cómo comunicaste y el resultado.",
    },
    sampleAnswer: {
      en: `Last month, I had a production bug to fix, a feature deadline, and was supporting a teammate with an integration issue, all marked as urgent.

I started by listing all three tasks with their actual urgency and impact. The production bug affected 5% of users; the feature was needed for a sales demo in two days; the teammate was blocked without my help.

I used a simple framework: impact versus effort. I spent 30 minutes unblocking my teammate, then fixed the production bug (high impact, medium effort) and created a quick patch.

For the feature, I communicated with the PM that I could deliver 80% functionality by the deadline. All three were addressed successfully.`,
      es: `El mes pasado tenía un bug de producción, un deadline de feature y estaba apoyando a una compañera con un problema de integración, todos marcados como urgentes.

Empecé listando las tres tareas con su urgencia e impacto reales. El bug afectaba al 5% de usuarios; la feature se necesitaba para una demo de ventas en dos días; la compañera estaba bloqueada sin mi ayuda.

Usé un framework simple: impacto vs. esfuerzo. Dediqué 30 minutos a desbloquear a mi compañera, luego arreglé el bug de producción (alto impacto, esfuerzo medio) y creé un parche rápido.

Para la feature, comuniqué al PM que podía entregar 80% de funcionalidad para el deadline. Las tres se atendieron con éxito.`,
    },
    keyPoints: {
      en: [
        "List and assess all priorities objectively",
        "Use a framework (impact, urgency, effort)",
        "Communicate tradeoffs to stakeholders",
        "Look for quick wins that unblock others",
        "Be realistic about what's achievable",
      ],
      es: [
        "Lista y evalúa todas las prioridades objetivamente",
        "Usa un framework (impacto, urgencia, esfuerzo)",
        "Comunica trade-offs a los stakeholders",
        "Busca quick wins que desbloqueen a otros",
        "Sé realista sobre lo que es alcanzable",
      ],
    },
    followUpQuestions: {
      en: [
        "What if everything truly is equally urgent?",
        "How do you handle constant interruptions?",
        "What tools do you use for task management?",
      ],
      es: [
        "¿Qué haces si todo es verdaderamente urgente?",
        "¿Cómo manejas interrupciones constantes?",
        "¿Qué herramientas usas para gestión de tareas?",
      ],
    },
  },
  {
    id: "ss-32-meet-tight-deadline",
    questionNumber: 32,
    difficulty: "Mid",
    category: "Time Management",
    title: {
      en: "Meeting a Tight Deadline",
      es: "Cumplir un Plazo Ajustado",
    },
    question: {
      en: "Tell me about a time you had to meet a very tight deadline. How did you ensure success?",
      es: "Cuéntame sobre una ocasión en la que tuviste que cumplir un plazo muy ajustado. ¿Cómo aseguraste el éxito?",
    },
    context: {
      en: "Deadlines create pressure. This question assesses your ability to perform under time constraints without sacrificing quality.",
      es: "Los plazos crean presión. Esta pregunta evalúa tu capacidad de rendir bajo restricciones de tiempo sin sacrificar calidad.",
    },
    whyAsked: {
      en: "Business needs sometimes require fast delivery. Interviewers want to see you can handle pressure effectively.",
      es: "Las necesidades de negocio a veces requieren entrega rápida. Los entrevistadores quieren ver que manejas la presión.",
    },
    commonMistakes: {
      en: [
        "Describing all-nighters as the solution",
        "Cutting corners on quality",
        "Not planning or just winging it",
        "Working in isolation without communication",
      ],
      es: [
        "Describir desveladas como la solución",
        "Recortar calidad",
        "No planear o improvisar",
        "Trabajar aislado sin comunicación",
      ],
    },
    answerFramework: {
      en: "Describe the deadline, your planning approach, execution tactics, and how you delivered successfully.",
      es: "Describe el plazo, tu enfoque de planeación, tácticas de ejecución y cómo entregaste con éxito.",
    },
    sampleAnswer: {
      en: `We needed to launch a payment integration in one week instead of the planned three weeks due to a partner contract deadline.

I immediately broke down the work into must-have versus nice-to-have features. The must-haves were: process payments and handle errors gracefully.

I created a daily milestone plan and shared it with the team and stakeholders so everyone knew the progress checkpoints.

I focused ruthlessly on the critical path, deferring code cleanup and edge cases that weren't blocking launch. We shipped the core functionality in five days, allowing two days for testing.`,
      es: `Necesitábamos lanzar una integración de pagos en una semana en vez de las tres planeadas por un plazo contractual con un partner.

Inmediatamente descompuse el trabajo en must-have vs. nice-to-have. Los must-haves eran: procesar pagos y manejar errores con elegancia.

Creé un plan de hitos diarios y lo compartí con el equipo y stakeholders para que todos conocieran los checkpoints.

Me enfoqué sin piedad en la ruta crítica, dejando la limpieza de código y edge cases que no bloqueaban el lanzamiento. Enviamos la funcionalidad core en cinco días, dejando dos días para pruebas.`,
    },
    keyPoints: {
      en: [
        "Break work into critical versus deferrable",
        "Create visible milestones and checkpoints",
        "Focus ruthlessly on the critical path",
        "Communicate progress frequently",
        "Don't sacrifice core quality for speed",
      ],
      es: [
        "Divide el trabajo en crítico vs. postergable",
        "Crea hitos y checkpoints visibles",
        "Enfócate sin piedad en la ruta crítica",
        "Comunica el progreso frecuentemente",
        "No sacrifiques la calidad del core por velocidad",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you prevent technical debt from tight deadlines?",
        "What if you realized the deadline was impossible?",
        "How do you recover from deadline pressure?",
      ],
      es: [
        "¿Cómo evitas deuda técnica por plazos ajustados?",
        "¿Qué harías si te das cuenta de que el plazo es imposible?",
        "¿Cómo te recuperas de la presión de plazos?",
      ],
    },
  },
  {
    id: "ss-33-balance-deep-work-availability",
    questionNumber: 33,
    difficulty: "Mid",
    category: "Time Management",
    title: {
      en: "Balancing Deep Work with Availability",
      es: "Balancear Trabajo Profundo con Disponibilidad",
    },
    question: {
      en: "How do you balance the need for focused coding time with being available to your team?",
      es: "¿Cómo balanceas la necesidad de tiempo enfocado para programar con estar disponible para tu equipo?",
    },
    context: {
      en: "Developers need focus time, but teams need collaboration. This question assesses how you manage this tension.",
      es: "Los desarrolladores necesitan tiempo de enfoque, pero los equipos necesitan colaboración. Esta pregunta evalúa cómo manejas esta tensión.",
    },
    whyAsked: {
      en: "Constant context-switching hurts productivity, but so does unavailability. Interviewers want to see thoughtful approaches.",
      es: "El context switching constante daña la productividad, pero la indisponibilidad también. Los entrevistadores quieren ver enfoques reflexivos.",
    },
    commonMistakes: {
      en: [
        "Being always available (no deep work)",
        "Being always unavailable (hurting team)",
        "Not having a system",
        "Not communicating your availability",
      ],
      es: [
        "Estar siempre disponible (sin deep work)",
        "Estar siempre indisponible (perjudicando al equipo)",
        "No tener un sistema",
        "No comunicar tu disponibilidad",
      ],
    },
    answerFramework: {
      en: "Describe your approach, specific tactics you use, how you communicate availability, and the outcomes.",
      es: "Describe tu enfoque, tácticas concretas que usas, cómo comunicas tu disponibilidad y los resultados.",
    },
    sampleAnswer: {
      en: `I protect focus time while remaining a good team player through a few practices.

I block 2-3 hours each morning as focus time on my calendar and communicate this to my team. During this time, I turn off Slack notifications and work on complex tasks.

For urgent issues, teammates know they can text me. I batch communication: I check Slack at set intervals and respond to everything then.

For PR reviews, I commit to reviewing within 4 hours during working time, so teammates aren't blocked. This system increased my output while teammates report I'm still responsive.`,
      es: `Protejo el tiempo de enfoque manteniéndome como buen miembro del equipo mediante algunas prácticas.

Bloqueo 2-3 horas cada mañana como tiempo de enfoque en mi calendario y lo comunico al equipo. En ese tiempo apago notificaciones de Slack y trabajo en tareas complejas.

Para urgencias, los compañeros saben que pueden enviarme mensaje. Hago batch de comunicación: reviso Slack en intervalos fijos y respondo todo entonces.

Para PR reviews, me comprometo a revisar en 4 horas dentro del horario laboral. Este sistema aumentó mi output y los compañeros reportan que sigo siendo responsivo.`,
    },
    keyPoints: {
      en: [
        "Schedule and protect focus time",
        "Communicate availability clearly",
        "Have escalation paths for true emergencies",
        "Batch communication for efficiency",
        "Make response time commitments",
      ],
      es: [
        "Agenda y protege el tiempo de enfoque",
        "Comunica tu disponibilidad con claridad",
        "Ten rutas de escalado para urgencias reales",
        "Haz batch de comunicación para eficiencia",
        "Comprométete con tiempos de respuesta",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle cultures that expect instant responses?",
        "What's your ideal focus time length?",
        "How do you handle focus time when collaborating heavily?",
      ],
      es: [
        "¿Cómo manejas culturas que esperan respuestas instantáneas?",
        "¿Cuál es tu duración ideal de tiempo de enfoque?",
        "¿Cómo manejas el tiempo de enfoque cuando colaboras mucho?",
      ],
    },
  },
  {
    id: "ss-34-handle-context-switching",
    questionNumber: 34,
    difficulty: "Mid",
    category: "Time Management",
    title: {
      en: "Handling Frequent Context Switching",
      es: "Manejar Context Switching Frecuente",
    },
    question: {
      en: "How do you maintain productivity when your work requires frequent context switching?",
      es: "¿Cómo mantienes la productividad cuando tu trabajo requiere context switching frecuente?",
    },
    context: {
      en: "Many roles involve juggling different types of work. This question assesses your ability to manage cognitive load.",
      es: "Muchos roles implican malabarear tipos distintos de trabajo. Esta pregunta evalúa tu capacidad de gestionar la carga cognitiva.",
    },
    whyAsked: {
      en: "Context switching has costs. Interviewers want to see you understand this and have strategies to manage it.",
      es: "El context switching tiene costos. Los entrevistadores quieren ver que lo entiendes y tienes estrategias para gestionarlo.",
    },
    commonMistakes: {
      en: [
        "Saying you're good at multitasking (you're not)",
        "Not acknowledging the cost of switching",
        "Not having strategies to minimize impact",
        "Getting stressed by switching without coping",
      ],
      es: [
        "Decir que eres bueno multitareando (nadie lo es)",
        "No reconocer el costo del cambio",
        "No tener estrategias para minimizar el impacto",
        "Estresarte por el cambio sin afrontamiento",
      ],
    },
    answerFramework: {
      en: "Describe a high-switching environment, your strategies for managing it, and how you maintain quality.",
      es: "Describe un entorno con mucho cambio, tus estrategias para gestionarlo y cómo mantienes la calidad.",
    },
    sampleAnswer: {
      en: `On my current team, I handle code reviews, production support, and feature development, requiring constant context switches.

I minimize switching costs with several strategies. First, I keep detailed notes on where I left off in each context. Second, I batch similar tasks. Third, I use checklists for complex tasks so I don't forget steps when interrupted.

Finally, I've accepted that perfect productivity isn't possible with frequent switching. I aim for 'good enough' progress across all areas rather than perfection in one.`,
      es: `En mi equipo actual manejo code reviews, soporte de producción y desarrollo de features, lo que requiere cambios constantes de contexto.

Minimizo los costos con varias estrategias. Primero, mantengo notas detalladas de dónde me quedé en cada contexto. Segundo, hago batch de tareas similares. Tercero, uso checklists para tareas complejas para no olvidar pasos cuando me interrumpen.

Finalmente, acepté que la productividad perfecta no es posible con cambios frecuentes. Apunto a progreso 'suficiente' en todas las áreas en vez de perfección en una.`,
    },
    keyPoints: {
      en: [
        "Document state before switching",
        "Batch similar tasks together",
        "Use checklists for complex tasks",
        "Accept reduced efficiency and plan for it",
        "Protect some time for deep focus",
      ],
      es: [
        "Documenta el estado antes de cambiar",
        "Agrupa tareas similares",
        "Usa checklists para tareas complejas",
        "Acepta eficiencia reducida y planéalo",
        "Protege algo de tiempo para enfoque profundo",
      ],
    },
    followUpQuestions: {
      en: [
        "What's your biggest challenge with context switching?",
        "How do you handle surprise interruptions?",
        "What tools help you manage multiple contexts?",
      ],
      es: [
        "¿Cuál es tu mayor reto con el context switching?",
        "¿Cómo manejas interrupciones inesperadas?",
        "¿Qué herramientas te ayudan a gestionar múltiples contextos?",
      ],
    },
  },
  {
    id: "ss-35-long-term-project-motivation",
    questionNumber: 35,
    difficulty: "Mid",
    category: "Time Management",
    title: {
      en: "Maintaining Motivation on Long Projects",
      es: "Mantener la Motivación en Proyectos Largos",
    },
    question: {
      en: "How do you stay motivated and productive on long-term projects that span months?",
      es: "¿Cómo te mantienes motivado y productivo en proyectos de largo plazo que duran meses?",
    },
    context: {
      en: "Long projects can lead to fatigue. This question assesses your ability to sustain effort over extended periods.",
      es: "Los proyectos largos pueden causar fatiga. Esta pregunta evalúa tu capacidad de sostener el esfuerzo en períodos extendidos.",
    },
    whyAsked: {
      en: "Many important projects take months. Interviewers want to see you can maintain quality and motivation over time.",
      es: "Muchos proyectos importantes duran meses. Los entrevistadores quieren ver que mantienes calidad y motivación en el tiempo.",
    },
    commonMistakes: {
      en: [
        "Not acknowledging motivation challenges",
        "Relying only on willpower",
        "Not having progress markers",
        "Isolating on long projects",
      ],
      es: [
        "No reconocer los retos de motivación",
        "Confiar sólo en la fuerza de voluntad",
        "No tener marcadores de progreso",
        "Aislarte en proyectos largos",
      ],
    },
    answerFramework: {
      en: "Describe a long project, challenges you faced, strategies for maintaining momentum, and how you delivered.",
      es: "Describe un proyecto largo, los retos que enfrentaste, las estrategias para mantener el momentum y cómo entregaste.",
    },
    sampleAnswer: {
      en: `I spent eight months leading a backend rewrite project. By month three, the team's motivation was declining as the end seemed far away.

I implemented several strategies. First, we broke the project into two-week sprints with clear, achievable goals. Celebrating small wins kept morale up.

Second, I created a visible progress tracker showing percentage complete. Third, I varied the work to prevent monotony.

Finally, I kept connecting our work to impact. Every month, I shared metrics showing how our improvements were helping users. We delivered on time and under budget.`,
      es: `Pasé ocho meses liderando un rewrite del backend. Para el tercer mes, la motivación del equipo decaía porque el final parecía lejano.

Implementé varias estrategias. Primero, descompusimos el proyecto en sprints de dos semanas con metas claras y alcanzables. Celebrar pequeñas victorias mantenía la moral.

Segundo, creé un tracker visible de progreso. Tercero, varié el trabajo para prevenir monotonía.

Finalmente, conecté nuestro trabajo al impacto. Cada mes compartí métricas mostrando cómo las mejoras ayudaban a los usuarios. Entregamos a tiempo y bajo presupuesto.`,
    },
    keyPoints: {
      en: [
        "Break long projects into visible milestones",
        "Celebrate incremental progress",
        "Vary work to prevent monotony",
        "Connect work to meaningful impact",
        "Check in on team motivation regularly",
      ],
      es: [
        "Divide proyectos largos en hitos visibles",
        "Celebra el progreso incremental",
        "Varía el trabajo para prevenir monotonía",
        "Conecta el trabajo con impacto significativo",
        "Revisa la motivación del equipo con regularidad",
      ],
    },
    followUpQuestions: {
      en: [
        "What do you do when you lose motivation?",
        "How do you handle project fatigue?",
        "What's the longest project you've worked on?",
      ],
      es: [
        "¿Qué haces cuando pierdes la motivación?",
        "¿Cómo manejas la fatiga de proyecto?",
        "¿Cuál es el proyecto más largo en el que has trabajado?",
      ],
    },
  },

  // ============ Growth Mindset (36-40) ============
  {
    id: "ss-36-biggest-failure-learned",
    questionNumber: 36,
    difficulty: "Senior",
    category: "Growth Mindset",
    title: {
      en: "Learning from Your Biggest Failure",
      es: "Aprender del Fracaso Más Grande",
    },
    question: {
      en: "What's the biggest mistake or failure you've experienced in your career, and what did you learn from it?",
      es: "¿Cuál es el error o fracaso más grande en tu carrera y qué aprendiste de él?",
    },
    context: {
      en: "Failure is a teacher. This question assesses your self-awareness, humility, and ability to grow from setbacks.",
      es: "El fracaso es maestro. Esta pregunta evalúa tu autoconocimiento, humildad y capacidad de crecer tras reveses.",
    },
    whyAsked: {
      en: "Everyone fails. Interviewers want to see you can own failures, learn from them, and grow stronger.",
      es: "Todos fallamos. Los entrevistadores quieren ver que asumes los fracasos, aprendes de ellos y te fortaleces.",
    },
    commonMistakes: {
      en: [
        "Describing a minor failure to avoid vulnerability",
        "Blaming others or circumstances",
        "Not showing genuine learning",
        "Describing something that wasn't actually your fault",
      ],
      es: [
        "Describir un fracaso menor para evitar vulnerabilidad",
        "Culpar a otros o a las circunstancias",
        "No mostrar aprendizaje genuino",
        "Describir algo que en realidad no fue culpa tuya",
      ],
    },
    answerFramework: {
      en: "Describe a genuine failure, own your role, explain what you learned, and show how you applied that learning.",
      es: "Describe un fracaso genuino, asume tu rol, explica lo aprendido y muestra cómo aplicaste ese aprendizaje.",
    },
    sampleAnswer: {
      en: `Early in my career, I shipped a feature without adequate testing because I was confident in my code. It caused a data corruption bug that affected hundreds of users and took a week to fully resolve.

The root cause was my overconfidence. I had assumed my code was correct without verification. I was also conflict-averse and hadn't pushed back when asked to skip testing.

I learned several lessons. First, test coverage isn't optional, especially for data operations. Second, my confidence should be proportional to my verification. Third, speaking up about risks is my responsibility.

I now advocate strongly for testing and have never shipped a similar bug.`,
      es: `Al inicio de mi carrera, envié una feature sin testing adecuado porque confiaba en mi código. Causó un bug de corrupción de datos que afectó a cientos de usuarios y tomó una semana resolver.

La causa raíz fue mi exceso de confianza. Había asumido que mi código era correcto sin verificación. También era averso al conflicto y no me opuse cuando me pidieron saltar el testing.

Aprendí varias lecciones. Primero, la cobertura de pruebas no es opcional, sobre todo para operaciones de datos. Segundo, mi confianza debe ser proporcional a la verificación. Tercero, hablar sobre los riesgos es mi responsabilidad.

Ahora abogo fuerte por el testing y nunca he enviado un bug similar.`,
    },
    keyPoints: {
      en: [
        "Choose a real, meaningful failure",
        "Own your role completely",
        "Extract specific, actionable lessons",
        "Show how you applied the learning",
        "Demonstrate growth from the experience",
      ],
      es: [
        "Elige un fracaso real y significativo",
        "Asume tu rol por completo",
        "Extrae lecciones específicas y accionables",
        "Muestra cómo aplicaste el aprendizaje",
        "Demuestra crecimiento desde la experiencia",
      ],
    },
    followUpQuestions: {
      en: [
        "How did you handle the immediate aftermath?",
        "Have you had similar situations since?",
        "How do you prevent overconfidence now?",
      ],
      es: [
        "¿Cómo manejaste las consecuencias inmediatas?",
        "¿Has tenido situaciones similares desde entonces?",
        "¿Cómo previenes el exceso de confianza ahora?",
      ],
    },
  },
  {
    id: "ss-37-seek-feedback-improvement",
    questionNumber: 37,
    difficulty: "Mid",
    category: "Growth Mindset",
    title: {
      en: "Proactively Seeking Feedback",
      es: "Buscar Feedback Proactivamente",
    },
    question: {
      en: "How do you actively seek feedback to improve your skills?",
      es: "¿Cómo buscas activamente feedback para mejorar tus habilidades?",
    },
    context: {
      en: "Growth requires feedback. This question assesses whether you actively pursue improvement rather than waiting for it.",
      es: "El crecimiento requiere feedback. Esta pregunta evalúa si persigues activamente la mejora en vez de esperarla.",
    },
    whyAsked: {
      en: "Self-directed learners outperform those who only improve when told to. Interviewers want to see initiative in growth.",
      es: "Los autodidactas superan a quienes sólo mejoran cuando se les dice. Los entrevistadores quieren ver iniciativa en tu crecimiento.",
    },
    commonMistakes: {
      en: [
        "Only accepting feedback when given",
        "Not having specific feedback practices",
        "Asking for feedback but not acting on it",
        "Only seeking positive feedback",
      ],
      es: [
        "Sólo aceptar feedback cuando te lo dan",
        "No tener prácticas específicas de feedback",
        "Pedir feedback pero no actuar sobre él",
        "Buscar sólo feedback positivo",
      ],
    },
    answerFramework: {
      en: "Describe your feedback-seeking practices, specific examples, how you process feedback, and improvements made.",
      es: "Describe tus prácticas para buscar feedback, ejemplos concretos, cómo lo procesas y las mejoras realizadas.",
    },
    sampleAnswer: {
      en: `I actively seek feedback through several channels.

For code, I ask reviewers to be specifically critical. I say, 'Please don't go easy on me. What could be better?' This permission makes people more honest.

Quarterly, I ask my manager three specific questions: What should I start doing? Stop doing? Continue doing? The specificity gets more actionable feedback.

When I receive feedback, I write it down, sit with it for a day before responding, and then identify one specific action to take. This habit has accelerated my growth more than any course or book.`,
      es: `Busco feedback activamente por varios canales.

Para código, pido a los reviewers que sean críticos específicamente. Les digo: 'Por favor no me hagas concesiones. ¿Qué podría ser mejor?' Ese permiso hace que sean más honestos.

Cada trimestre le hago a mi manager tres preguntas específicas: ¿Qué debería empezar a hacer? ¿Dejar de hacer? ¿Seguir haciendo? La especificidad consigue feedback más accionable.

Cuando recibo feedback, lo escribo, lo dejo reposar un día antes de responder y luego identifico una acción concreta. Este hábito ha acelerado mi crecimiento más que cualquier curso o libro.`,
    },
    keyPoints: {
      en: [
        "Ask for feedback proactively and regularly",
        "Make it safe for people to be honest",
        "Ask specific questions, not general ones",
        "Process feedback before reacting",
        "Take concrete action on feedback received",
      ],
      es: [
        "Pide feedback proactiva y regularmente",
        "Haz que sea seguro ser honesto contigo",
        "Haz preguntas específicas, no generales",
        "Procesa el feedback antes de reaccionar",
        "Toma acción concreta sobre el feedback recibido",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you handle feedback you disagree with?",
        "What's the most impactful feedback you've received?",
        "How do you give feedback to others?",
      ],
      es: [
        "¿Cómo manejas feedback con el que no estás de acuerdo?",
        "¿Cuál es el feedback más impactante que has recibido?",
        "¿Cómo das feedback a otros?",
      ],
    },
  },
  {
    id: "ss-38-skill-development-approach",
    questionNumber: 38,
    difficulty: "Mid",
    category: "Growth Mindset",
    title: {
      en: "Continuous Skill Development",
      es: "Desarrollo Continuo de Habilidades",
    },
    question: {
      en: "How do you approach continuous learning and skill development as a developer?",
      es: "¿Cómo abordas el aprendizaje continuo y el desarrollo de habilidades como desarrollador?",
    },
    context: {
      en: "Technology evolves rapidly. This question assesses your commitment to staying current and growing your capabilities.",
      es: "La tecnología evoluciona rápido. Esta pregunta evalúa tu compromiso con mantenerte al día y desarrollar tus capacidades.",
    },
    whyAsked: {
      en: "Stagnant developers become obsolete. Interviewers want to see you have a sustainable approach to continuous learning.",
      es: "Los desarrolladores estancados se vuelven obsoletos. Los entrevistadores quieren ver que tienes un enfoque sostenible de aprendizaje continuo.",
    },
    commonMistakes: {
      en: [
        "Saying you learn on the job only",
        "Listing courses without application",
        "Not having a learning system",
        "Chasing every new technology without depth",
      ],
      es: [
        "Decir que sólo aprendes en el trabajo",
        "Listar cursos sin aplicación",
        "No tener un sistema de aprendizaje",
        "Perseguir toda nueva tecnología sin profundidad",
      ],
    },
    answerFramework: {
      en: "Describe your learning philosophy, specific practices, how you apply learning, and examples of skills developed.",
      es: "Describe tu filosofía de aprendizaje, prácticas concretas, cómo aplicas lo aprendido y ejemplos de habilidades desarrolladas.",
    },
    sampleAnswer: {
      en: `I balance depth and breadth in my learning with a structured approach.

For depth, I choose one technology each quarter to learn thoroughly. This quarter it's Kubernetes. I allocate 5 hours weekly, using a mix of documentation, courses, and hands-on projects.

For breadth, I follow engineering blogs and newsletters, spending 30 minutes daily scanning what's new.

I learn best by building, so I always have a side project applying what I'm learning. I also learn from colleagues through lunch-and-learns. Teaching others is how I solidify my own understanding.`,
      es: `Balanceo profundidad y amplitud en mi aprendizaje con un enfoque estructurado.

Para profundidad, elijo una tecnología cada trimestre para aprender a fondo. Este trimestre es Kubernetes. Dedico 5 horas semanales con mezcla de documentación, cursos y proyectos prácticos.

Para amplitud, sigo blogs y newsletters de ingeniería, dedicando 30 minutos diarios a revisar novedades.

Aprendo mejor construyendo, así que siempre tengo un side project aplicando lo que aprendo. También aprendo de colegas vía lunch-and-learns. Enseñar a otros es como solidifico mi propio entendimiento.`,
    },
    keyPoints: {
      en: [
        "Have a structured learning approach",
        "Balance depth in focus areas with breadth awareness",
        "Apply learning through projects",
        "Learn from and teach colleagues",
        "Make learning a sustainable habit",
      ],
      es: [
        "Ten un enfoque estructurado de aprendizaje",
        "Balancea profundidad con conciencia amplia",
        "Aplica el aprendizaje mediante proyectos",
        "Aprende de colegas y enseña a otros",
        "Haz del aprendizaje un hábito sostenible",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you decide what to learn next?",
        "How do you balance learning with work demands?",
        "What's on your learning list currently?",
      ],
      es: [
        "¿Cómo decides qué aprender a continuación?",
        "¿Cómo balanceas el aprendizaje con las demandas del trabajo?",
        "¿Qué tienes actualmente en tu lista de aprendizaje?",
      ],
    },
  },
  {
    id: "ss-39-change-opinion-with-evidence",
    questionNumber: 39,
    difficulty: "Mid",
    category: "Growth Mindset",
    title: {
      en: "Changing Your Opinion with New Evidence",
      es: "Cambiar de Opinión con Nueva Evidencia",
    },
    question: {
      en: "Tell me about a time when you had a strong opinion that you changed based on new information.",
      es: "Cuéntame sobre una vez que tuviste una opinión fuerte que cambiaste basándote en nueva información.",
    },
    context: {
      en: "Intellectual humility is valuable. This question assesses your ability to update beliefs when presented with better information.",
      es: "La humildad intelectual es valiosa. Esta pregunta evalúa tu capacidad de actualizar creencias ante mejor información.",
    },
    whyAsked: {
      en: "Stubborn engineers cause problems. Interviewers want to see you can change your mind when warranted.",
      es: "Los ingenieros tercos crean problemas. Los entrevistadores quieren ver que cambias de opinión cuando corresponde.",
    },
    commonMistakes: {
      en: [
        "Claiming to never be wrong",
        "Describing a trivial opinion change",
        "Not showing genuine conviction before the change",
        "Not explaining what changed your mind",
      ],
      es: [
        "Afirmar que nunca te equivocas",
        "Describir un cambio de opinión trivial",
        "No mostrar convicción genuina antes del cambio",
        "No explicar qué te hizo cambiar de opinión",
      ],
    },
    answerFramework: {
      en: "Describe your original strong opinion, the new information, how you processed it, and your changed position.",
      es: "Describe tu opinión fuerte original, la nueva información, cómo la procesaste y tu posición cambiada.",
    },
    sampleAnswer: {
      en: `I was strongly against using TypeScript, believing it added complexity without proportional benefit. I advocated for plain JavaScript in team discussions.

Then I joined a team with a large TypeScript codebase. Initially, I was frustrated with type annotations. But after a month, I noticed I was catching bugs during development that would have reached production in JavaScript.

I tracked my experience. The types prevented several null reference errors and API mismatches. Refactoring was dramatically safer.

I had to admit I was wrong. I'm now a TypeScript advocate and have helped convert two other projects. The experience taught me to be skeptical of strong opinions I've never tested in practice.`,
      es: `Estaba fuertemente en contra de usar TypeScript, creyendo que añadía complejidad sin beneficio proporcional. Abogaba por JavaScript puro en las discusiones del equipo.

Luego me uní a un equipo con un gran codebase de TypeScript. Al principio me frustraban las anotaciones de tipo. Pero tras un mes, noté que estaba atrapando bugs durante el desarrollo que habrían llegado a producción en JavaScript.

Rastreé mi experiencia. Los tipos previnieron varios errores de null reference y desajustes con APIs. El refactoring era dramáticamente más seguro.

Tuve que admitir que estaba equivocado. Ahora soy defensor de TypeScript y he ayudado a convertir otros dos proyectos. La experiencia me enseñó a desconfiar de las opiniones fuertes que nunca probé.`,
    },
    keyPoints: {
      en: [
        "Have genuine conviction in the original position",
        "Be open to evidence that challenges your view",
        "Update your position based on evidence, not pressure",
        "Own the change without defensiveness",
        "Apply the lesson (be more open-minded)",
      ],
      es: [
        "Ten convicción genuina en la posición original",
        "Sé abierto a la evidencia que desafía tu visión",
        "Actualiza tu posición por evidencia, no por presión",
        "Asume el cambio sin ponerte a la defensiva",
        "Aplica la lección (sé más abierto)",
      ],
    },
    followUpQuestions: {
      en: [
        "What opinions do you hold now that might be wrong?",
        "How do you stay open to being wrong?",
        "What makes you change your mind versus dig in?",
      ],
      es: [
        "¿Qué opiniones actuales podrían estar equivocadas?",
        "¿Cómo te mantienes abierto a estar equivocado?",
        "¿Qué te hace cambiar de opinión vs. aferrarte?",
      ],
    },
  },
  {
    id: "ss-40-career-growth-vision",
    questionNumber: 40,
    difficulty: "Senior",
    category: "Growth Mindset",
    title: {
      en: "Your Career Growth Vision",
      es: "Tu Visión de Crecimiento Profesional",
    },
    question: {
      en: "Where do you see yourself in your career in 5 years, and how are you working toward that?",
      es: "¿Dónde te ves en tu carrera en 5 años y cómo estás trabajando para lograrlo?",
    },
    context: {
      en: "Career direction shows ambition and planning. This question assesses your self-awareness and goal orientation.",
      es: "La dirección de carrera muestra ambición y planeación. Esta pregunta evalúa tu autoconocimiento y orientación a metas.",
    },
    whyAsked: {
      en: "Interviewers want to see alignment between your goals and what the role offers, plus evidence you're actively growing.",
      es: "Los entrevistadores quieren ver alineación entre tus metas y lo que el rol ofrece, y evidencia de que creces activamente.",
    },
    commonMistakes: {
      en: [
        "Giving generic answers like 'your manager'",
        "Not having thought about it",
        "Goals disconnected from current actions",
        "Goals that don't fit the company/role",
      ],
      es: [
        "Dar respuestas genéricas como 'tu manager'",
        "No haberlo pensado",
        "Metas desconectadas de tus acciones actuales",
        "Metas que no encajan con la empresa/rol",
      ],
    },
    answerFramework: {
      en: "Describe your career vision, why it excites you, and specific actions you're taking now to get there.",
      es: "Describe tu visión de carrera, por qué te emociona y las acciones concretas que tomas ahora para llegar.",
    },
    sampleAnswer: {
      en: `In five years, I see myself as a technical leader who shapes architecture decisions and grows other engineers, either as a staff engineer or engineering manager.

What excites me about this direction is the multiplied impact. Right now, I can deliver what I build. In that role, I'd enable entire teams to build better software.

I'm working toward this through several actions. I'm developing technical depth by leading architecture discussions. I'm building leadership skills by mentoring junior developers and leading cross-team initiatives.

This role excites me because it's on that growth path.`,
      es: `En cinco años me veo como un líder técnico que da forma a decisiones de arquitectura y hace crecer a otros ingenieros, ya sea como staff engineer o engineering manager.

Lo que me emociona de esta dirección es el impacto multiplicado. Hoy puedo entregar lo que construyo. En ese rol habilitaría a equipos enteros a construir mejor software.

Trabajo hacia eso mediante varias acciones. Desarrollo profundidad técnica liderando discusiones de arquitectura. Construyo habilidades de liderazgo mentorizando juniors y liderando iniciativas entre equipos.

Este rol me emociona porque está en esa ruta de crecimiento.`,
    },
    keyPoints: {
      en: [
        "Have a clear, specific direction",
        "Explain why it excites you (not just what it is)",
        "Show current actions toward that goal",
        "Connect your goals to the role you're interviewing for",
        "Show flexibility in the exact path",
      ],
      es: [
        "Ten una dirección clara y específica",
        "Explica por qué te emociona (no sólo qué es)",
        "Muestra acciones actuales hacia esa meta",
        "Conecta tus metas con el rol al que postulas",
        "Muestra flexibilidad en la ruta exacta",
      ],
    },
    followUpQuestions: {
      en: [
        "What's your biggest gap in reaching that goal?",
        "How would this role help you get there?",
        "What would make you change your career direction?",
      ],
      es: [
        "¿Cuál es tu mayor brecha para alcanzar esa meta?",
        "¿Cómo te ayudaría este rol a llegar ahí?",
        "¿Qué te haría cambiar tu dirección de carrera?",
      ],
    },
  },

  // ============ Culture Fit (41-50) ============
  {
    id: "ss-41-why-this-company",
    questionNumber: 41,
    difficulty: "Junior",
    category: "Culture Fit",
    title: {
      en: "Why Do You Want to Work Here?",
      es: "¿Por Qué Quieres Trabajar Aquí?",
    },
    question: {
      en: "Why do you want to work at this company specifically?",
      es: "¿Por qué quieres trabajar específicamente en esta empresa?",
    },
    context: {
      en: "Recruiters weed out candidates who are applying everywhere. This question checks whether you did your homework and if there is real alignment.",
      es: "Los reclutadores filtran a candidatos que aplican a todo. Esta pregunta verifica si hiciste tu tarea y si hay alineación real.",
    },
    whyAsked: {
      en: "Companies want people who chose them intentionally. A strong 'why' signals commitment, reduces attrition risk, and shows research.",
      es: "Las empresas quieren personas que las eligieron intencionadamente. Un 'por qué' sólido indica compromiso, reduce el riesgo de rotación y muestra investigación.",
    },
    commonMistakes: {
      en: [
        "Generic flattery ('you're a great company')",
        "Only mentioning salary or perks",
        "Repeating the company's marketing copy verbatim",
        "Having nothing specific to point to",
      ],
      es: [
        "Halagos genéricos ('son una gran empresa')",
        "Mencionar sólo salario o beneficios",
        "Repetir el copy de marketing palabra por palabra",
        "No tener nada específico que señalar",
      ],
    },
    answerFramework: {
      en: "Connect three things: something specific about the company (product, mission, engineering culture), something about the role, and how it ties to your career goals.",
      es: "Conecta tres cosas: algo específico de la empresa (producto, misión, cultura de ingeniería), algo del rol y cómo se vincula con tus metas de carrera.",
    },
    sampleAnswer: {
      en: `Three things drew me to this role. First, your engineering blog — particularly the post on how your platform team migrated from Heroku to Kubernetes — told me your culture values thoughtful engineering and transparency about tradeoffs.

Second, the role itself is exactly where I want to grow. I've been a backend engineer for four years, and the chance to work on event-driven systems at your scale is rare.

Third, your mission to reduce friction for small businesses resonates personally. My family ran a shop that closed partly because the tooling was too expensive. Helping teams like them matters to me.

I'm not casting a wide net — I'm applying to three companies I have strong reasons to join, and you're one.`,
      es: `Tres cosas me atrajeron a este rol. Primero, su blog de ingeniería — especialmente el post sobre cómo su plataforma migró de Heroku a Kubernetes — me mostró que la cultura valora la ingeniería reflexiva y la transparencia sobre los trade-offs.

Segundo, el rol es exactamente donde quiero crecer. He sido backend durante cuatro años, y la oportunidad de trabajar en sistemas event-driven a su escala es rara.

Tercero, su misión de reducir fricción para pequeñas empresas me resuena a nivel personal. Mi familia tenía una tienda que cerró en parte porque las herramientas eran demasiado caras. Ayudar a equipos como el suyo me importa.

No estoy aplicando en masa — estoy postulando a tres empresas por las que tengo razones fuertes para unirme, y ustedes son una.`,
    },
    keyPoints: {
      en: [
        "Reference something specific you researched",
        "Connect the role to your career trajectory",
        "Tie personal motivation to company mission when authentic",
        "Avoid generic praise and marketing speak",
        "Signal you're being selective, not desperate",
      ],
      es: [
        "Referencia algo concreto que investigaste",
        "Conecta el rol con tu trayectoria de carrera",
        "Vincula tu motivación personal con la misión, si es auténtico",
        "Evita los halagos genéricos y el lenguaje de marketing",
        "Señala que eres selectivo, no desesperado",
      ],
    },
    followUpQuestions: {
      en: [
        "What else do you know about our business?",
        "What concerns do you have about joining us?",
        "What would make you turn down this role?",
      ],
      es: [
        "¿Qué más sabes sobre nuestro negocio?",
        "¿Qué preocupaciones tienes respecto a unirte?",
        "¿Qué te haría rechazar este rol?",
      ],
    },
  },
  {
    id: "ss-42-ideal-work-environment",
    questionNumber: 42,
    difficulty: "Junior",
    category: "Culture Fit",
    title: {
      en: "Describe Your Ideal Work Environment",
      es: "Describe tu Ambiente Laboral Ideal",
    },
    question: {
      en: "What kind of team culture and work environment brings out your best work?",
      es: "¿Qué tipo de cultura de equipo y ambiente laboral saca lo mejor de ti?",
    },
    context: {
      en: "Culture fit is a two-way street. Recruiters use this to gauge whether you'll thrive in their environment and whether you'll churn.",
      es: "El ajuste cultural es de doble vía. Los reclutadores lo usan para medir si prosperarás en su entorno y si te quedarás.",
    },
    whyAsked: {
      en: "A candidate who needs constant autonomy in a highly-structured team — or vice versa — will be miserable. They want honest signal, not performed answers.",
      es: "Un candidato que necesita autonomía constante en un equipo muy estructurado — o al revés — la pasará mal. Buscan señal honesta, no respuestas actuadas.",
    },
    commonMistakes: {
      en: [
        "Describing the exact environment described in the job post (obvious pandering)",
        "Listing contradictory preferences to 'cover all bases'",
        "Being so flexible you sound preference-less",
        "Naming only perks instead of working dynamics",
      ],
      es: [
        "Describir exactamente el entorno del job post (evidente complacencia)",
        "Listar preferencias contradictorias para 'cubrir todo'",
        "Ser tan flexible que suenas sin preferencias",
        "Nombrar sólo beneficios en vez de dinámicas de trabajo",
      ],
    },
    answerFramework: {
      en: "Name two or three concrete dynamics that genuinely motivate you (autonomy level, feedback cadence, decision-making style), then show self-awareness about trade-offs.",
      es: "Nombra dos o tres dinámicas concretas que realmente te motivan (nivel de autonomía, cadencia de feedback, estilo de decisión) y muestra autoconocimiento sobre trade-offs.",
    },
    sampleAnswer: {
      en: `I do my best work with three things: clear ownership, direct feedback, and a team that debates ideas openly.

Clear ownership means I know what outcomes I'm accountable for. I don't need micromanagement, but I thrive when expectations are explicit rather than assumed.

Direct feedback matters more than pleasant feedback. I'd rather hear 'this design won't scale' early than 'looks great' and discover problems in production.

Open debate means people disagree on the idea without making it personal. On my current team, we do this well in design reviews — people push back, I push back, and we reach better decisions.

I'm less effective in heavily hierarchical cultures where junior voices aren't heard, or in teams where conflict avoidance leads to ambiguous ownership.`,
      es: `Doy lo mejor con tres cosas: ownership claro, feedback directo y un equipo que debate ideas abiertamente.

Ownership claro significa que sé de qué resultados soy responsable. No necesito micromanagement, pero prospero cuando las expectativas son explícitas y no asumidas.

El feedback directo me importa más que el feedback amable. Prefiero oír 'este diseño no escala' temprano que 'se ve bien' y descubrir problemas en producción.

El debate abierto significa que las personas discrepan sobre la idea sin hacerlo personal. En mi equipo actual esto funciona bien en design reviews — la gente me cuestiona, yo cuestiono, y llegamos a mejores decisiones.

Soy menos efectivo en culturas fuertemente jerárquicas donde no se escuchan voces junior, o en equipos donde evitar el conflicto lleva a ownership ambiguo.`,
    },
    keyPoints: {
      en: [
        "Pick specific dynamics, not buzzwords",
        "Be honest about what drains you, not just what energizes you",
        "Show self-awareness, not a wish list",
        "Avoid obvious pandering to the job description",
        "Leave room for the interviewer to share their reality",
      ],
      es: [
        "Elige dinámicas específicas, no buzzwords",
        "Sé honesto sobre qué te agota, no sólo qué te energiza",
        "Muestra autoconocimiento, no una lista de deseos",
        "Evita la complacencia obvia con la descripción del puesto",
        "Deja espacio para que el entrevistador comparta su realidad",
      ],
    },
    followUpQuestions: {
      en: [
        "What kind of manager brings out your best?",
        "How do you handle environments that don't match your ideal?",
        "What part of our culture might not fit you?",
      ],
      es: [
        "¿Qué tipo de manager saca lo mejor de ti?",
        "¿Cómo manejas entornos que no coinciden con tu ideal?",
        "¿Qué parte de nuestra cultura podría no encajar contigo?",
      ],
    },
  },
  {
    id: "ss-43-remote-vs-office",
    questionNumber: 43,
    difficulty: "Junior",
    category: "Culture Fit",
    title: {
      en: "Remote, Hybrid, or In-Office?",
      es: "¿Remoto, Híbrido o Presencial?",
    },
    question: {
      en: "Do you prefer remote, hybrid, or in-office work, and why?",
      es: "¿Prefieres trabajo remoto, híbrido o presencial, y por qué?",
    },
    context: {
      en: "Post-pandemic, work arrangement alignment is a top reason for early attrition. Recruiters want to know if the company's policy will actually work for you.",
      es: "Tras la pandemia, la alineación en la modalidad de trabajo es una de las principales causas de rotación temprana. Los reclutadores quieren saber si la política de la empresa realmente te funcionará.",
    },
    whyAsked: {
      en: "A mismatch here is expensive for both sides. Interviewers want your honest preference, not the answer they want to hear.",
      es: "Un desajuste aquí es caro para ambos lados. Los entrevistadores quieren tu preferencia honesta, no la respuesta que quieren oír.",
    },
    commonMistakes: {
      en: [
        "Saying 'I'm flexible with anything' to avoid the question",
        "Bad-mouthing one setup versus another",
        "Answering only based on commute, not work effectiveness",
        "Not reading the company's actual policy before answering",
      ],
      es: [
        "Decir 'soy flexible con todo' para evitar la pregunta",
        "Hablar mal de una modalidad frente a otra",
        "Responder sólo en función del trayecto, no de la efectividad",
        "No leer la política real de la empresa antes de responder",
      ],
    },
    answerFramework: {
      en: "State your genuine preference, explain the working-style reason, and confirm how it matches (or compromises with) the company's policy.",
      es: "Indica tu preferencia genuina, explica la razón de estilo de trabajo y confirma cómo encaja (o llegas a un compromiso) con la política de la empresa.",
    },
    sampleAnswer: {
      en: `I work best in a hybrid model — roughly two to three days in-office for collaborative work, the rest remote for deep focus.

The reason is specific. Design discussions, onboarding a new teammate, and cross-team alignment land much faster in person. Deep coding work and code reviews, I do better at home where I can protect uninterrupted blocks.

I saw your posting specifies three days in-office at your downtown location, and that works for me. I live 25 minutes away, so commute isn't an issue. If the policy changed to fully in-office, I'd want to talk about it, but the current setup is a genuine fit.

If I were in a fully remote role, I'd compensate with more intentional video syncs and occasional travel for team weeks.`,
      es: `Trabajo mejor en modelo híbrido — unos dos o tres días en oficina para trabajo colaborativo, el resto remoto para enfoque profundo.

La razón es específica. Las discusiones de diseño, el onboarding de un nuevo compañero y la alineación entre equipos se resuelven más rápido en persona. El trabajo profundo de código y los code reviews los hago mejor en casa, donde puedo proteger bloques sin interrupciones.

Vi que el puesto especifica tres días en su sede del centro y eso me funciona. Vivo a 25 minutos, así que el trayecto no es problema. Si la política cambiara a presencial total me gustaría conversarlo, pero el esquema actual encaja genuinamente.

Si fuera un rol 100% remoto, compensaría con más syncs de video intencionales y viajes ocasionales para semanas de equipo.`,
    },
    keyPoints: {
      en: [
        "Give a genuine preference, not a hedge",
        "Back it with working-style reasons, not lifestyle reasons",
        "Acknowledge the company's actual policy",
        "Show flexibility where honest, firmness where real",
        "Avoid polarized takes on remote vs. office",
      ],
      es: [
        "Da una preferencia genuina, no una respuesta ambigua",
        "Respáldala con razones de estilo de trabajo, no de estilo de vida",
        "Reconoce la política real de la empresa",
        "Muestra flexibilidad donde sea honesto y firmeza donde sea real",
        "Evita posturas polarizadas sobre remoto vs. oficina",
      ],
    },
    followUpQuestions: {
      en: [
        "What if our policy changed after you joined?",
        "How do you build relationships in remote settings?",
        "Would you relocate for the right role?",
      ],
      es: [
        "¿Qué pasaría si nuestra política cambiara después de tu ingreso?",
        "¿Cómo construyes relaciones en entornos remotos?",
        "¿Te reubicarías por el rol adecuado?",
      ],
    },
  },
  {
    id: "ss-44-work-life-balance",
    questionNumber: 44,
    difficulty: "Mid",
    category: "Culture Fit",
    title: {
      en: "How Do You Protect Work-Life Balance?",
      es: "¿Cómo Proteges tu Balance Vida-Trabajo?",
    },
    question: {
      en: "How do you think about work-life balance, and how do you protect it?",
      es: "¿Cómo piensas sobre el balance vida-trabajo y cómo lo proteges?",
    },
    context: {
      en: "This question screens for two risks: candidates who will burn out quickly, and candidates who will clock out the moment pressure hits.",
      es: "Esta pregunta filtra dos riesgos: candidatos que se quemarán rápido y candidatos que se desconectarán al primer signo de presión.",
    },
    whyAsked: {
      en: "Recruiters want sustainable performers — people who push when needed but don't normalize 60-hour weeks.",
      es: "Los reclutadores quieren desempeños sostenibles — gente que empuja cuando hace falta pero no normaliza semanas de 60 horas.",
    },
    commonMistakes: {
      en: [
        "Claiming 'I'll work whatever hours are needed'",
        "Claiming you never work past 5 no matter what",
        "Blaming a former employer for poor balance",
        "Talking about balance only in terms of time, not energy",
      ],
      es: [
        "Afirmar 'trabajaré las horas que sean necesarias'",
        "Afirmar que nunca trabajas más allá de las 5 pase lo que pase",
        "Culpar a un empleador anterior por mal balance",
        "Hablar de balance sólo en horas, no en energía",
      ],
    },
    answerFramework: {
      en: "Describe your default rhythm, how you flex it in crunch periods, and the boundaries you hold to stay sustainable long-term.",
      es: "Describe tu ritmo por defecto, cómo lo flexibilizas en crunch y los límites que mantienes para ser sostenible a largo plazo.",
    },
    sampleAnswer: {
      en: `My default is a focused 8-to-9 hour day. I start early, protect a no-meeting block in the morning for deep work, and sign off at a consistent time so I can recover.

During crunch periods — a launch, an incident, a hard deadline — I'll extend, work weekends if needed, and be fully present. But I treat that as a season, not a setting. After a crunch, I deliberately take a slower week to reset.

The boundary I hold is no non-urgent Slack after hours. I respond to pages and true blockers, but I don't answer 'just a quick question' messages at 9 pm. Otherwise, everything becomes urgent.

This has kept me productive for six years without a burnout episode, while still shipping hard launches.`,
      es: `Mi ritmo por defecto es una jornada enfocada de 8 a 9 horas. Empiezo temprano, protejo un bloque sin reuniones por la mañana para trabajo profundo y cierro a una hora consistente para recuperarme.

En períodos de crunch — un lanzamiento, un incidente, un deadline duro — me extiendo, trabajo fines de semana si hace falta y estoy completamente presente. Pero lo trato como una temporada, no como el estándar. Tras un crunch me tomo deliberadamente una semana más lenta para resetear.

El límite que mantengo es nada de Slack no urgente fuera de horario. Respondo pages y bloqueos reales, pero no contesto 'una preguntita' a las 9 pm. Si no, todo se vuelve urgente.

Esto me ha mantenido productivo durante seis años sin burnout, entregando lanzamientos exigentes.`,
    },
    keyPoints: {
      en: [
        "Have a real default rhythm, not 'whatever it takes'",
        "Distinguish crunch seasons from baseline culture",
        "Name concrete boundaries you hold",
        "Tie balance to long-term performance, not laziness",
        "Show sustainability, not slogans",
      ],
      es: [
        "Ten un ritmo real por defecto, no 'lo que haga falta'",
        "Distingue temporadas de crunch del ritmo base",
        "Nombra límites concretos que mantienes",
        "Vincula el balance con el desempeño a largo plazo, no con pereza",
        "Muestra sostenibilidad, no eslóganes",
      ],
    },
    followUpQuestions: {
      en: [
        "When's the last time you worked a weekend? Why?",
        "How do you handle a manager who doesn't respect balance?",
        "What's your recovery routine after a launch?",
      ],
      es: [
        "¿Cuándo fue la última vez que trabajaste un fin de semana? ¿Por qué?",
        "¿Cómo manejas a un manager que no respeta el balance?",
        "¿Cuál es tu rutina de recuperación tras un lanzamiento?",
      ],
    },
  },
  {
    id: "ss-45-describe-in-three-words",
    questionNumber: 45,
    difficulty: "Junior",
    category: "Culture Fit",
    title: {
      en: "Describe Yourself in Three Words",
      es: "Descríbete en Tres Palabras",
    },
    question: {
      en: "How would your closest coworker describe you in three words?",
      es: "¿Cómo te describiría tu colega más cercano en tres palabras?",
    },
    context: {
      en: "This forces specificity and self-awareness. Vague or cliché answers signal a candidate who hasn't thought about how they show up.",
      es: "Esto fuerza especificidad y autoconocimiento. Respuestas vagas o cliché señalan a un candidato que no ha pensado en cómo se presenta.",
    },
    whyAsked: {
      en: "Recruiters watch whether the words match what comes up in references and in the rest of the interview.",
      es: "Los reclutadores observan si las palabras coinciden con lo que aparece en referencias y en el resto de la entrevista.",
    },
    commonMistakes: {
      en: [
        "Using buzzwords like 'passionate,' 'driven,' 'team player' without backing",
        "Picking traits the job ad listed",
        "Using traits you can't back with a story",
        "Overstating to sound impressive",
      ],
      es: [
        "Usar buzzwords como 'apasionado', 'motivado', 'team player' sin respaldo",
        "Elegir rasgos que el anuncio listaba",
        "Usar rasgos que no puedes respaldar con una historia",
        "Exagerar para sonar impresionante",
      ],
    },
    answerFramework: {
      en: "Pick three distinct traits, ideally covering work style, collaboration style, and one honest rough edge. Back each with a one-line example.",
      es: "Elige tres rasgos distintos, idealmente cubriendo estilo de trabajo, estilo colaborativo y una arista honesta. Respalda cada uno con un ejemplo breve.",
    },
    sampleAnswer: {
      en: `They'd probably say: deliberate, direct, and sometimes stubborn.

Deliberate — I slow down on decisions that are hard to reverse. When we debated moving to a new payment provider, I pushed for a two-week evaluation rather than a same-week pick, and it saved us from signing with a vendor that had a data residency issue.

Direct — I flag problems early and don't soften them into 'maybe we should consider.' In reviews, people know where I stand.

Stubborn — when I've formed a position on something I've deeply investigated, I hold it even when pushed. I'm working on this; specifically, recognizing when 'stubborn' becomes 'closed' and creating earlier off-ramps. A teammate gave me feedback on this last year, and I've been more explicit about what evidence would change my mind.`,
      es: `Probablemente dirían: deliberado, directo y a veces testarudo.

Deliberado — bajo el ritmo en decisiones difíciles de revertir. Cuando debatimos cambiar de proveedor de pagos, empujé para una evaluación de dos semanas en vez de una decisión en la misma semana, y eso nos salvó de firmar con un proveedor con un problema de residencia de datos.

Directo — levanto problemas temprano y no los suavizo a 'quizás deberíamos considerar'. En reviews, la gente sabe dónde estoy parado.

Testarudo — cuando me he formado una posición tras investigar a fondo, la mantengo aunque me presionen. Estoy trabajando en esto; en particular, en reconocer cuándo 'testarudo' se vuelve 'cerrado' y crear salidas antes. Un compañero me dio feedback sobre esto el año pasado y he sido más explícito sobre qué evidencia me haría cambiar de opinión.`,
    },
    keyPoints: {
      en: [
        "Pick distinct, non-overlapping traits",
        "Avoid cliché buzzwords",
        "Back each word with a concrete story",
        "Include at least one honest rough edge",
        "Show self-awareness and growth on the rough edge",
      ],
      es: [
        "Elige rasgos distintos, sin solaparse",
        "Evita buzzwords cliché",
        "Respalda cada palabra con una historia concreta",
        "Incluye al menos una arista honesta",
        "Muestra autoconocimiento y crecimiento sobre esa arista",
      ],
    },
    followUpQuestions: {
      en: [
        "How would your manager's three words differ?",
        "What's the trait you wish you had?",
        "What would a teammate who doesn't like working with you say?",
      ],
      es: [
        "¿En qué diferirían las tres palabras de tu manager?",
        "¿Qué rasgo desearías tener?",
        "¿Qué diría un compañero al que no le gusta trabajar contigo?",
      ],
    },
  },
  {
    id: "ss-46-handling-monotony",
    questionNumber: 46,
    difficulty: "Mid",
    category: "Culture Fit",
    title: {
      en: "Handling Tedious or Repetitive Work",
      es: "Manejar Trabajo Tedioso o Repetitivo",
    },
    question: {
      en: "Not every task is exciting. How do you stay engaged when the work is tedious or repetitive?",
      es: "No toda tarea es emocionante. ¿Cómo te mantienes comprometido cuando el trabajo es tedioso o repetitivo?",
    },
    context: {
      en: "Production engineering includes migrations, bug triage, compliance work, and documentation — work that doesn't make highlight reels but has to happen.",
      es: "La ingeniería en producción incluye migraciones, triaje de bugs, cumplimiento y documentación — trabajo que no sale en highlights pero que debe pasar.",
    },
    whyAsked: {
      en: "Recruiters want engineers who handle unglamorous work with rigor, not ones who only shine on greenfield features.",
      es: "Los reclutadores quieren ingenieros que manejen el trabajo menos glamoroso con rigor, no sólo quienes brillan en features nuevas.",
    },
    commonMistakes: {
      en: [
        "Claiming you never find work tedious",
        "Refusing tedious work entirely",
        "Saying you just 'push through' with no system",
        "Describing yourself as needing constant novelty",
      ],
      es: [
        "Afirmar que nunca encuentras tedioso el trabajo",
        "Rechazar totalmente el trabajo tedioso",
        "Decir que 'aguantas' sin un sistema",
        "Describirte como alguien que necesita novedad constante",
      ],
    },
    answerFramework: {
      en: "Acknowledge honestly that some work is tedious, then describe how you turn it into something useful — automation, learning, or improving the process for the next person.",
      es: "Reconoce honestamente que algo del trabajo es tedioso, luego describe cómo lo conviertes en algo útil — automatización, aprendizaje o mejora del proceso para el próximo.",
    },
    sampleAnswer: {
      en: `Yes, some work is tedious — the third quarter's compliance tickets aren't exciting. I do three things so I stay sharp on them.

First, I look for what can be automated. In my last role, I spent two days writing a script that turned a recurring 6-hour manual audit into 20 minutes. That work paid back for every subsequent quarter.

Second, I use tedious work as learning time for something adjacent. If I'm patching 40 low-risk CVEs, I'm also deepening my understanding of our dependency graph and how our security scanner works.

Third, I batch it. I don't scatter tedious tasks across focus blocks; I dedicate a morning. Finishing a pile in one session feels better than dragging it out.

I don't pretend these tasks are my favorite. I just refuse to do them sloppily.`,
      es: `Sí, algo del trabajo es tedioso — los tickets de cumplimiento del tercer trimestre no son emocionantes. Hago tres cosas para mantenerme atento.

Primero, busco qué automatizar. En mi último rol, pasé dos días escribiendo un script que convirtió una auditoría manual recurrente de 6 horas en 20 minutos. Ese trabajo se pagó solo cada trimestre siguiente.

Segundo, uso el trabajo tedioso como tiempo de aprendizaje sobre algo adyacente. Si parcho 40 CVEs de bajo riesgo, también profundizo en nuestro grafo de dependencias y cómo funciona nuestro scanner.

Tercero, lo agrupo. No esparzo tareas tediosas en bloques de enfoque; le dedico una mañana. Terminar una pila en una sesión se siente mejor que arrastrarla.

No pretendo que estas tareas sean mis favoritas. Simplemente me niego a hacerlas descuidadamente.`,
    },
    keyPoints: {
      en: [
        "Admit some work is tedious — don't perform enthusiasm",
        "Show you look for leverage (automation, tooling)",
        "Treat tedious work as calibration, not punishment",
        "Batch and complete, don't drag out",
        "Commit to quality even on unglamorous work",
      ],
      es: [
        "Admite que algo es tedioso — no actúes entusiasmo",
        "Muestra que buscas apalancamiento (automatización, tooling)",
        "Trata el trabajo tedioso como calibración, no castigo",
        "Agrupa y termina, no arrastres",
        "Comprométete con la calidad incluso en trabajo poco glamoroso",
      ],
    },
    followUpQuestions: {
      en: [
        "When did you last push back on tedious work?",
        "How much tedious work is too much?",
        "Tell me about a boring task that paid off.",
      ],
      es: [
        "¿Cuándo te opusiste por última vez a trabajo tedioso?",
        "¿Cuánto trabajo tedioso es demasiado?",
        "Cuéntame sobre una tarea aburrida que valió la pena.",
      ],
    },
  },
  {
    id: "ss-47-what-motivates-you",
    questionNumber: 47,
    difficulty: "Junior",
    category: "Culture Fit",
    title: {
      en: "What Motivates You?",
      es: "¿Qué te Motiva?",
    },
    question: {
      en: "What motivates you in your work day-to-day?",
      es: "¿Qué te motiva en tu trabajo día a día?",
    },
    context: {
      en: "Motivation drives sustained performance. Recruiters are checking whether your drivers match what the role actually delivers.",
      es: "La motivación impulsa desempeño sostenido. Los reclutadores verifican si tus drivers coinciden con lo que el rol realmente entrega.",
    },
    whyAsked: {
      en: "If you're motivated by shipping customer-facing features, a platform team role will starve you. Honest motivation helps both sides match well.",
      es: "Si te motiva entregar features de cara al usuario, un rol de equipo de plataforma te deja hambriento. La motivación honesta ayuda al match de ambos lados.",
    },
    commonMistakes: {
      en: [
        "Listing only 'solving hard problems'",
        "Saying 'money' or 'titles' as primary drivers",
        "Generic answers like 'making impact'",
        "Listing everything without priority",
      ],
      es: [
        "Listar sólo 'resolver problemas difíciles'",
        "Decir 'dinero' o 'títulos' como drivers principales",
        "Respuestas genéricas como 'generar impacto'",
        "Listar todo sin priorizar",
      ],
    },
    answerFramework: {
      en: "Name two genuine motivators, give a concrete example of each, and tie them to what the role offers.",
      es: "Nombra dos motivadores genuinos, da un ejemplo concreto de cada uno y vincúlalos con lo que el rol ofrece.",
    },
    sampleAnswer: {
      en: `Two things motivate me most: visible impact and learning curves.

For impact, I want to see my work change something real — a metric, a user experience, a team process. Last quarter, a caching change I made dropped p95 latency from 800ms to 140ms, and watching the graph drop was one of my best work moments all year.

For learning curves, I get energy from stretch work. When I was assigned to lead our first multi-region failover test, I'd never touched that domain. The steepness of that learning was motivating in itself.

This role interests me because the product has real user-visible impact, and the platform scope would put me on a learning curve I don't currently have.`,
      es: `Dos cosas me motivan sobre todo: impacto visible y curvas de aprendizaje.

Para el impacto, quiero ver mi trabajo cambiar algo real — una métrica, una experiencia de usuario, un proceso de equipo. El trimestre pasado, un cambio de caching que hice redujo la latencia p95 de 800ms a 140ms, y ver la gráfica caer fue uno de mis mejores momentos del año.

Para las curvas de aprendizaje, obtengo energía del stretch. Cuando me asignaron a liderar nuestra primera prueba de failover multi-región, nunca había tocado ese dominio. La inclinación misma de esa curva me motivó.

Este rol me interesa porque el producto tiene impacto visible al usuario y el alcance de plataforma me pondría en una curva de aprendizaje que no tengo ahora.`,
    },
    keyPoints: {
      en: [
        "Pick two or three real drivers, not a list",
        "Back each with a concrete past example",
        "Tie them to what the role actually offers",
        "Acknowledge that motivation isn't infinite",
        "Avoid generic impact-talk",
      ],
      es: [
        "Elige dos o tres drivers reales, no una lista",
        "Respalda cada uno con un ejemplo concreto",
        "Vincúlalos con lo que el rol realmente ofrece",
        "Reconoce que la motivación no es infinita",
        "Evita el discurso genérico de impacto",
      ],
    },
    followUpQuestions: {
      en: [
        "What demotivates you?",
        "How do you stay motivated during slow quarters?",
        "Is money a motivator for you?",
      ],
      es: [
        "¿Qué te desmotiva?",
        "¿Cómo te mantienes motivado en trimestres lentos?",
        "¿El dinero es un motivador para ti?",
      ],
    },
  },
  {
    id: "ss-48-greatest-strength",
    questionNumber: 48,
    difficulty: "Junior",
    category: "Culture Fit",
    title: {
      en: "Your Greatest Strength",
      es: "Tu Mayor Fortaleza",
    },
    question: {
      en: "What do you consider your greatest professional strength, and how does it show up?",
      es: "¿Cuál consideras tu mayor fortaleza profesional y cómo se manifiesta?",
    },
    context: {
      en: "Recruiters want specificity and evidence, not a list of adjectives. They also want to know how the strength shows up on a team.",
      es: "Los reclutadores quieren especificidad y evidencia, no una lista de adjetivos. También quieren saber cómo se manifiesta la fortaleza en un equipo.",
    },
    whyAsked: {
      en: "This question checks self-awareness and whether you can tell a crisp, evidence-backed story under pressure.",
      es: "Esta pregunta verifica autoconocimiento y si puedes contar una historia nítida respaldada en evidencia bajo presión.",
    },
    commonMistakes: {
      en: [
        "Listing three strengths instead of picking one",
        "Picking a strength you can't back with a story",
        "Describing a tool skill (React, SQL) instead of a real strength",
        "Picking something everyone claims (hardworking, team player)",
      ],
      es: [
        "Listar tres fortalezas en lugar de elegir una",
        "Elegir una que no puedes respaldar con una historia",
        "Describir una habilidad de herramienta (React, SQL) en vez de una fortaleza real",
        "Elegir algo que todos reclaman (esforzado, team player)",
      ],
    },
    answerFramework: {
      en: "Name one strength, define what it actually means in your context, give a specific story where it made a measurable difference, and name a visible downside to stay honest.",
      es: "Nombra una fortaleza, define lo que realmente significa en tu contexto, da una historia concreta donde hizo diferencia medible y nombra una desventaja visible para mantener honestidad.",
    },
    sampleAnswer: {
      en: `My strongest trait is what I'd call 'decomposition under pressure' — taking a chaotic problem and breaking it into tractable pieces quickly.

Concrete example: we had a production outage last year where three systems were failing simultaneously and no one was sure which was the root cause. In the first 15 minutes, I mapped the dependency chain on a whiteboard, identified which symptoms could only come from one upstream source, and ruled out two red herrings. We had the root cause in 40 minutes, versus an estimated 3+ hours of trial and error.

The downside: on open-ended exploration where decomposition isn't useful yet, I can force structure too early. My last manager pushed back on that once, and she was right — I'd narrowed a design space before we'd really diverged.`,
      es: `Mi rasgo más fuerte es lo que llamaría 'descomposición bajo presión' — tomar un problema caótico y partirlo en piezas manejables rápido.

Ejemplo concreto: tuvimos una caída en producción el año pasado donde tres sistemas fallaban al mismo tiempo y nadie estaba seguro cuál era la causa raíz. En los primeros 15 minutos, mapeé la cadena de dependencias en un pizarrón, identifiqué qué síntomas sólo podían venir de una fuente aguas arriba y descarté dos pistas falsas. Tuvimos la causa raíz en 40 minutos, contra las 3+ horas estimadas de prueba y error.

La desventaja: en exploración abierta donde la descomposición aún no es útil, puedo forzar estructura demasiado temprano. Mi última manager me lo señaló una vez y tenía razón — había estrechado un espacio de diseño antes de que realmente divergiéramos.`,
    },
    keyPoints: {
      en: [
        "Pick one strength, not a list",
        "Define it in your own words",
        "Back it with a specific, measurable story",
        "Name a real downside honestly",
        "Avoid generic traits everyone claims",
      ],
      es: [
        "Elige una fortaleza, no una lista",
        "Defínela con tus propias palabras",
        "Respáldala con una historia específica y medible",
        "Nombra una desventaja real honestamente",
        "Evita rasgos genéricos que todos reclaman",
      ],
    },
    followUpQuestions: {
      en: [
        "When has that strength backfired?",
        "How is that strength different from your peers'?",
        "What's the strength you'd like to develop next?",
      ],
      es: [
        "¿Cuándo te ha jugado en contra esa fortaleza?",
        "¿En qué se diferencia de la de tus pares?",
        "¿Qué fortaleza te gustaría desarrollar después?",
      ],
    },
  },
  {
    id: "ss-49-greatest-weakness",
    questionNumber: 49,
    difficulty: "Mid",
    category: "Culture Fit",
    title: {
      en: "Your Greatest Weakness",
      es: "Tu Mayor Debilidad",
    },
    question: {
      en: "What is your greatest professional weakness?",
      es: "¿Cuál es tu mayor debilidad profesional?",
    },
    context: {
      en: "This is the most abused interview question. Recruiters are not fooled by 'I'm a perfectionist' — they want a real weakness and evidence you're working on it.",
      es: "Es la pregunta más sobreexplotada. Los reclutadores no se convencen con 'soy perfeccionista' — quieren una debilidad real y evidencia de que trabajas en ella.",
    },
    whyAsked: {
      en: "It screens for self-awareness, honesty, and whether you can grow. Candidates who dodge reveal that they can't.",
      es: "Filtra por autoconocimiento, honestidad y capacidad de crecer. Quienes la esquivan revelan que no pueden.",
    },
    commonMistakes: {
      en: [
        "Framing a strength as a weakness ('I work too hard')",
        "Picking a weakness irrelevant to the job",
        "Naming a weakness with no mitigation plan",
        "Naming a fatal weakness for the role ('I dislike feedback')",
      ],
      es: [
        "Disfrazar una fortaleza como debilidad ('trabajo demasiado')",
        "Elegir una debilidad irrelevante al trabajo",
        "Nombrar una debilidad sin plan de mitigación",
        "Nombrar una debilidad fatal para el rol ('no me gusta el feedback')",
      ],
    },
    answerFramework: {
      en: "Name a real, honest weakness, give an example where it cost you something, describe what you're concretely doing about it, and show current progress.",
      es: "Nombra una debilidad real y honesta, da un ejemplo donde te costó algo, describe qué haces concretamente y muestra el progreso actual.",
    },
    sampleAnswer: {
      en: `My real weakness is underestimating communication overhead on cross-team projects. I plan engineering work accurately, but I consistently under-plan the time it takes to align four stakeholders, chase async approvals, and re-explain decisions.

Concrete cost: last year I led a migration that I estimated at six weeks. The code work took five, but we slipped to eight because I hadn't budgeted for the legal and compliance reviews I should have anticipated.

What I'm doing about it: I now add a fixed 30% coordination buffer to any cross-functional project, I front-load stakeholder identification in the first week, and I put recurring async status updates on a schedule so I'm not reactive to 'where are we?' pings.

The last two projects I've led came in within 10% of my estimate, which is the best I've done on this dimension.`,
      es: `Mi debilidad real es subestimar el overhead de comunicación en proyectos entre equipos. Planifico el trabajo de ingeniería con precisión, pero subestimo sistemáticamente el tiempo de alinear cuatro stakeholders, perseguir aprobaciones asíncronas y re-explicar decisiones.

Costo concreto: el año pasado lideré una migración que estimé en seis semanas. El trabajo de código tomó cinco, pero nos extendimos a ocho porque no había presupuestado las revisiones legales y de cumplimiento que debí anticipar.

Lo que estoy haciendo: ahora agrego un buffer fijo del 30% para coordinación en cualquier proyecto multi-funcional, identifico stakeholders en la primera semana y pongo updates asíncronos recurrentes en agenda para no ser reactivo a '¿por dónde vamos?'.

Los dos últimos proyectos que he liderado cerraron dentro del 10% de mi estimación, que es lo mejor que he hecho en esta dimensión.`,
    },
    keyPoints: {
      en: [
        "Pick a real, non-fatal weakness",
        "Give a concrete story where it cost you",
        "Describe specific, ongoing corrective actions",
        "Show measurable progress or early results",
        "Stay short of self-flagellation",
      ],
      es: [
        "Elige una debilidad real y no fatal",
        "Da una historia concreta donde te costó",
        "Describe acciones correctivas específicas y en curso",
        "Muestra progreso medible o primeros resultados",
        "No caigas en la autoflagelación",
      ],
    },
    followUpQuestions: {
      en: [
        "What's a weakness you haven't fixed yet?",
        "Who's given you the most useful feedback on weaknesses?",
        "How do you avoid overcorrecting?",
      ],
      es: [
        "¿Qué debilidad aún no has corregido?",
        "¿Quién te ha dado el feedback más útil sobre debilidades?",
        "¿Cómo evitas sobrecorregir?",
      ],
    },
  },
  {
    id: "ss-50-what-success-looks-like",
    questionNumber: 50,
    difficulty: "Mid",
    category: "Culture Fit",
    title: {
      en: "What Does Success Look Like to You?",
      es: "¿Cómo se ve el Éxito Para Ti?",
    },
    question: {
      en: "What does success in this role look like to you after one year?",
      es: "¿Cómo se ve para ti el éxito en este rol después de un año?",
    },
    context: {
      en: "Recruiters use this to check whether your definition of success matches the role and whether you're oriented toward outcomes, not just activity.",
      es: "Los reclutadores lo usan para verificar si tu definición de éxito coincide con el rol y si te orientas a resultados, no sólo a actividad.",
    },
    whyAsked: {
      en: "Mismatched definitions of success cause disappointment within six months. Aligned definitions help both sides.",
      es: "Definiciones desalineadas de éxito causan decepción a los seis meses. Definiciones alineadas ayudan a ambas partes.",
    },
    commonMistakes: {
      en: [
        "Vague answers like 'growing and contributing'",
        "Defining success only in terms of your promotion",
        "Not naming what the company would gain",
        "Skipping ramp-up milestones entirely",
      ],
      es: [
        "Respuestas vagas como 'crecer y contribuir'",
        "Definir éxito sólo en términos de tu ascenso",
        "No nombrar lo que la empresa ganaría",
        "Saltar por completo los hitos de ramp-up",
      ],
    },
    answerFramework: {
      en: "Structure by phase: ramp-up in the first 90 days, meaningful contribution by six months, and a specific outcome you'd own by the one-year mark.",
      es: "Estructura por fase: ramp-up en los primeros 90 días, contribución significativa a los seis meses y un resultado concreto del que serías responsable al año.",
    },
    sampleAnswer: {
      en: `Three milestones.

First 90 days: I've shipped my first non-trivial change end-to-end, I've built relationships with the three or four teammates I'll work with most, and I understand the main service boundaries well enough to know what I don't know.

By six months: I'm leading at least one meaningful initiative — ideally something that touches both engineering quality and user outcome. I'm contributing to design reviews, and teammates are starting to tag me in when there's a problem in my area of focus.

By one year: I own a non-trivial piece of the system where I'm the default decision-maker, and there's a metric I can point to — latency down, deploy frequency up, something — where I drove the result.

If I hit those and I'm still energized, it's a good year for both of us.`,
      es: `Tres hitos.

Primeros 90 días: he entregado mi primer cambio no trivial de extremo a extremo, he construido relaciones con los tres o cuatro compañeros con los que trabajaré más y entiendo las fronteras principales de servicios lo suficiente para saber qué no sé.

A los seis meses: lidero al menos una iniciativa significativa — idealmente algo que toca calidad de ingeniería y resultado al usuario. Contribuyo en design reviews y los compañeros empiezan a taggearme cuando hay un problema en mi área.

Al año: soy dueño de una pieza no trivial del sistema donde soy el decisor por defecto, y hay una métrica que puedo señalar — latencia abajo, frecuencia de deploy arriba, algo — donde impulsé el resultado.

Si cumplo esos hitos y sigo con energía, es un buen año para ambos.`,
    },
    keyPoints: {
      en: [
        "Structure by ramp-up phases",
        "Balance your growth with company outcome",
        "Name a specific metric or decision you'd own",
        "Stay realistic for the time horizon",
        "Invite the interviewer to calibrate you",
      ],
      es: [
        "Estructura por fases de ramp-up",
        "Balancea tu crecimiento con el resultado de la empresa",
        "Nombra una métrica o decisión específica de la que serías dueño",
        "Mantente realista para el horizonte de tiempo",
        "Invita al entrevistador a calibrarte",
      ],
    },
    followUpQuestions: {
      en: [
        "What if reality looks different at six months?",
        "How would you measure your own success?",
        "What would make you feel unsuccessful even if the team is happy?",
      ],
      es: [
        "¿Qué pasa si la realidad se ve distinta a los seis meses?",
        "¿Cómo medirías tu propio éxito?",
        "¿Qué te haría sentir sin éxito aun si el equipo está contento?",
      ],
    },
  },

  // ============ Career & Recruiter (51-60) ============
  {
    id: "ss-51-tell-me-about-yourself",
    questionNumber: 51,
    difficulty: "Junior",
    category: "Career & Recruiter",
    title: {
      en: "Tell Me About Yourself",
      es: "Háblame de Ti",
    },
    question: {
      en: "Walk me through your background — tell me about yourself.",
      es: "Hazme un recorrido por tu trayectoria — háblame de ti.",
    },
    context: {
      en: "This is usually the opening question and sets the tone. A rambling answer signals poor communication; a rehearsed one signals inauthenticity.",
      es: "Suele ser la pregunta de apertura y marca el tono. Una respuesta dispersa señala mala comunicación; una actuada señala falta de autenticidad.",
    },
    whyAsked: {
      en: "Recruiters want a crisp 90-second version of your story that connects past → present → why this role.",
      es: "Los reclutadores quieren una versión nítida de 90 segundos de tu historia que conecte pasado → presente → por qué este rol.",
    },
    commonMistakes: {
      en: [
        "Reading your résumé verbatim",
        "Starting at childhood or college",
        "Taking more than two minutes",
        "Not landing on why you're here today",
      ],
      es: [
        "Leer tu CV textual",
        "Empezar en la infancia o la universidad",
        "Tomar más de dos minutos",
        "No aterrizar en por qué estás aquí hoy",
      ],
    },
    answerFramework: {
      en: "Use a Past → Present → Future structure: 20 seconds on background, 40 on current role and what you've built, 30 on why this role is the next step.",
      es: "Usa Pasado → Presente → Futuro: 20 segundos de background, 40 del rol actual y lo que has construido, 30 de por qué este rol es el siguiente paso.",
    },
    sampleAnswer: {
      en: `I've spent the last seven years building backend systems, mostly in fintech.

I started at a payments startup right after a computer-science degree, where I learned how to ship in a high-stakes environment. I moved to my current role three years ago, a larger company where I own a service that processes around two million daily events. In the last year I've led two projects I'm proud of: a replay tool that cut incident recovery time in half, and a schema evolution framework the rest of engineering now uses.

I'm looking for this role because I want to work on a higher-throughput system with a stronger platform culture, and the problem space you described in the first call — event stream reliability at scale — is exactly what I want to spend the next chapter on.

Happy to go deeper on any of those.`,
      es: `He pasado los últimos siete años construyendo sistemas backend, mayormente en fintech.

Empecé en una startup de pagos justo tras una carrera en ciencias de la computación, donde aprendí a entregar en un entorno de alta exigencia. Me cambié a mi rol actual hace tres años, una empresa más grande donde soy dueño de un servicio que procesa unos dos millones de eventos diarios. En el último año lideré dos proyectos de los que estoy orgulloso: una herramienta de replay que redujo a la mitad el tiempo de recuperación ante incidentes y un framework de evolución de esquemas que el resto de ingeniería ahora usa.

Busco este rol porque quiero trabajar en un sistema de mayor throughput con una cultura de plataforma más fuerte, y el espacio de problema que describieron en la primera llamada — fiabilidad de streams de eventos a escala — es exactamente donde quiero invertir el próximo capítulo.

Feliz de profundizar en cualquier punto.`,
    },
    keyPoints: {
      en: [
        "Keep it to 90 seconds",
        "Use Past → Present → Future structure",
        "Highlight one or two concrete accomplishments",
        "Land on why this role specifically",
        "End by inviting follow-up questions",
      ],
      es: [
        "Mantente en 90 segundos",
        "Usa la estructura Pasado → Presente → Futuro",
        "Destaca uno o dos logros concretos",
        "Aterriza en por qué este rol específicamente",
        "Cierra invitando a profundizar",
      ],
    },
    followUpQuestions: {
      en: [
        "Can you tell me more about that replay tool project?",
        "What made you leave your first company?",
        "What's missing from your current role?",
      ],
      es: [
        "¿Puedes contarme más sobre ese proyecto de replay?",
        "¿Qué te hizo salir de tu primera empresa?",
        "¿Qué le falta a tu rol actual?",
      ],
    },
  },
  {
    id: "ss-52-why-leaving-current-job",
    questionNumber: 52,
    difficulty: "Mid",
    category: "Career & Recruiter",
    title: {
      en: "Why Are You Leaving Your Current Role?",
      es: "¿Por Qué Estás Dejando tu Rol Actual?",
    },
    question: {
      en: "Why are you looking to leave your current job?",
      es: "¿Por qué buscas dejar tu trabajo actual?",
    },
    context: {
      en: "Recruiters use this to gauge whether the pull is real, whether there are red flags with your current employer or you, and whether the new role actually solves the pull.",
      es: "Los reclutadores lo usan para medir si el pull es real, si hay banderas rojas con tu empleador actual o contigo, y si el nuevo rol realmente resuelve ese pull.",
    },
    whyAsked: {
      en: "They want honest, forward-looking reasons — not complaints. Chronic complainers repeat the pattern at the next job.",
      es: "Quieren razones honestas y enfocadas al futuro — no quejas. Los quejosos crónicos repiten el patrón en el siguiente trabajo.",
    },
    commonMistakes: {
      en: [
        "Trashing your current employer or manager",
        "Making it only about money",
        "Giving vague 'looking for new challenges' answers",
        "Sounding like you're running from something, not toward something",
      ],
      es: [
        "Hablar mal de tu empleador o manager actual",
        "Hacerlo sólo sobre dinero",
        "Dar respuestas vagas como 'busco nuevos retos'",
        "Sonar como que huyes de algo, no que vas hacia algo",
      ],
    },
    answerFramework: {
      en: "Acknowledge what's good where you are, explain what growth dimension is capped, and connect that specifically to what this new role offers.",
      es: "Reconoce lo bueno donde estás, explica qué dimensión de crecimiento está topada y conecta eso específicamente con lo que ofrece el nuevo rol.",
    },
    sampleAnswer: {
      en: `I've had a strong three years at my current company. I own a real piece of the system, my manager is supportive, and I've grown a lot.

What's capped is the technical ceiling. Our platform processes around 500 requests per second on a good day. I've learned what this scale has to teach me, and the next layer of problems — multi-region consistency, genuine high-throughput systems, platform-level reliability engineering — isn't available to me there.

This role specifically is at a scale where those problems are the daily work. That's the pull. My current job is good, and I'd stay if this weren't the right next step; the move is about what I'm moving toward, not running from.`,
      es: `He tenido tres años sólidos en mi empresa actual. Soy dueño de una pieza real del sistema, mi manager me apoya y he crecido mucho.

Lo que está topado es el techo técnico. Nuestra plataforma procesa unos 500 requests por segundo en un día bueno. He aprendido lo que esta escala puede enseñarme, y la siguiente capa de problemas — consistencia multi-región, sistemas de verdadero alto throughput, ingeniería de fiabilidad a nivel plataforma — no está disponible ahí.

Este rol específicamente está a una escala donde esos problemas son el día a día. Ese es el pull. Mi trabajo actual es bueno, y me quedaría si este no fuera el paso correcto; el movimiento es por hacia dónde voy, no de qué huyo.`,
    },
    keyPoints: {
      en: [
        "Start by acknowledging what's good",
        "Name the specific dimension that's capped",
        "Tie it to what this new role offers",
        "Frame as moving toward, not running from",
        "Never bad-mouth current employer",
      ],
      es: [
        "Empieza reconociendo lo bueno",
        "Nombra la dimensión específica que está topada",
        "Vincúlalo con lo que ofrece el nuevo rol",
        "Enmárcalo como ir hacia, no huir de",
        "Nunca hables mal del empleador actual",
      ],
    },
    followUpQuestions: {
      en: [
        "Have you raised this with your current manager?",
        "What would make you stay?",
        "What's the risk we hire you and you leave in a year for the same reason?",
      ],
      es: [
        "¿Has hablado esto con tu manager actual?",
        "¿Qué te haría quedarte?",
        "¿Cuál es el riesgo de que te contratemos y te vayas en un año por la misma razón?",
      ],
    },
  },
  {
    id: "ss-53-salary-expectations",
    questionNumber: 53,
    difficulty: "Mid",
    category: "Career & Recruiter",
    title: {
      en: "Salary Expectations",
      es: "Expectativas Salariales",
    },
    question: {
      en: "What are your salary expectations for this role?",
      es: "¿Cuáles son tus expectativas salariales para este rol?",
    },
    context: {
      en: "Salary negotiation starts here. Answering too early with a number can anchor low; refusing entirely signals inexperience.",
      es: "La negociación salarial empieza aquí. Dar un número demasiado pronto puede anclar bajo; negarse del todo señala inexperiencia.",
    },
    whyAsked: {
      en: "Recruiters screen whether you're in the band. Savvy answers keep room for negotiation after you've demonstrated value.",
      es: "Los reclutadores filtran si entras en el rango. Las respuestas hábiles dejan espacio para negociar tras demostrar valor.",
    },
    commonMistakes: {
      en: [
        "Blurting a specific number early",
        "Giving a huge range that signals no research",
        "Sharing your current salary unprompted",
        "Saying 'whatever you offer is fine'",
      ],
      es: [
        "Soltar un número específico temprano",
        "Dar un rango enorme que señala falta de investigación",
        "Compartir tu salario actual sin que te lo pidan",
        "Decir 'lo que ofrezcan está bien'",
      ],
    },
    answerFramework: {
      en: "Anchor on researched market range, confirm it aligns with the role's level, and redirect to total compensation when asked for a single number prematurely.",
      es: "Ancla en un rango de mercado investigado, confirma que se alinea con el nivel del rol y redirige a compensación total cuando pidan un solo número prematuramente.",
    },
    sampleAnswer: {
      en: `Based on the role, level, and what I've seen in the market for similar senior backend positions in this region, I'm targeting a base in the range of 165 to 185 thousand, with total compensation — including equity and bonus — in the 220 to 260 range.

That said, I care about the whole package, not just base. If equity vesting, sign-on, or leveling is structured differently here, I'd rather see the full offer and calibrate together.

Before locking a number, I'd want to hear where this role falls in your level framework. If you share that, I can give you a more precise answer.`,
      es: `Basándome en el rol, el nivel y lo que he visto en el mercado para posiciones backend senior similares en esta región, apunto a una base en el rango de 165 a 185 mil, con compensación total — incluyendo equity y bonus — en el rango 220 a 260.

Dicho esto, me importa el paquete completo, no sólo la base. Si el vesting de equity, el sign-on o el leveling están estructurados de otra forma aquí, prefiero ver la oferta completa y calibrar juntos.

Antes de fijar un número, me gustaría saber dónde cae este rol en su framework de niveles. Si me lo compartes, puedo darte una respuesta más precisa.`,
    },
    keyPoints: {
      en: [
        "Anchor with a researched range, not a point",
        "Reframe total compensation, not just base",
        "Turn the question back when possible",
        "Signal you know the market",
        "Don't share current salary unprompted",
      ],
      es: [
        "Ancla con un rango investigado, no un punto",
        "Reencuadra como compensación total, no sólo base",
        "Devuelve la pregunta cuando sea posible",
        "Señala que conoces el mercado",
        "No compartas tu salario actual sin que te lo pidan",
      ],
    },
    followUpQuestions: {
      en: [
        "What's your current base salary?",
        "What if our maximum is below your range?",
        "Is this offer negotiable on equity or just base?",
      ],
      es: [
        "¿Cuál es tu salario base actual?",
        "¿Qué pasa si nuestro tope está por debajo de tu rango?",
        "¿La oferta es negociable en equity o sólo en base?",
      ],
    },
  },
  {
    id: "ss-54-career-gap-explanation",
    questionNumber: 54,
    difficulty: "Mid",
    category: "Career & Recruiter",
    title: {
      en: "Explaining a Career Gap",
      es: "Explicar un Vacío en la Carrera",
    },
    question: {
      en: "I see there's a gap on your résumé — can you walk me through that time?",
      es: "Veo que hay un vacío en tu CV — ¿puedes explicarme ese período?",
    },
    context: {
      en: "Career gaps are increasingly normal (caregiving, burnout recovery, layoffs, self-directed learning). What matters is a calm, honest, forward-oriented explanation.",
      es: "Los vacíos de carrera son cada vez más normales (cuidado familiar, recuperación de burnout, despidos, aprendizaje autodidacta). Lo que importa es una explicación tranquila, honesta y enfocada al futuro.",
    },
    whyAsked: {
      en: "Recruiters are watching how you handle the question more than the gap itself. Defensiveness or inconsistency is the red flag.",
      es: "Los reclutadores observan más cómo manejas la pregunta que el vacío en sí. La defensiva o la inconsistencia son la bandera roja.",
    },
    commonMistakes: {
      en: [
        "Being vague or evasive",
        "Apologizing excessively",
        "Pretending you were 'consulting' when you weren't",
        "Going into more detail than the question asked for",
      ],
      es: [
        "Ser vago o evasivo",
        "Disculparte en exceso",
        "Pretender que estabas 'consultando' cuando no",
        "Dar más detalle del que pide la pregunta",
      ],
    },
    answerFramework: {
      en: "Name what happened factually, explain what you used the time for, and show how you're reentering with intention.",
      es: "Nombra lo que pasó de forma fáctica, explica para qué usaste el tiempo y muestra que regresas con intención.",
    },
    sampleAnswer: {
      en: `Between my 2023 role ending and the start of 2024, I took about nine months off. Two reasons. First, I'd been through a severe incident response period and recognized I was close to burnout. Second, my father was seriously ill, and I needed to be present with my family.

I used the first part of that time for recovery and family responsibilities. The second half, once things stabilized, I used for learning I'd been pushing off — I went deep on distributed systems, rebuilt a side project in Rust, and did a short certificate course on systems design.

I'm returning now with clarity about what kind of role I want and sustainable capacity. The gap wasn't wasted, and I'd rather have taken it than shown up half-present at a job.`,
      es: `Entre el fin de mi rol de 2023 y el inicio de 2024, me tomé cerca de nueve meses. Dos razones. Primero, había pasado por un período severo de respuesta a incidentes y reconocí que estaba cerca del burnout. Segundo, mi padre estuvo seriamente enfermo y necesitaba estar presente con mi familia.

Usé la primera parte para recuperación y responsabilidades familiares. La segunda mitad, una vez que las cosas se estabilizaron, la usé para aprendizaje que había pospuesto — profundicé en sistemas distribuidos, reconstruí un side project en Rust e hice un certificado corto en diseño de sistemas.

Regreso ahora con claridad sobre el tipo de rol que quiero y capacidad sostenible. El vacío no fue desperdicio, y prefiero haberlo tomado que haberme presentado a medias en un trabajo.`,
    },
    keyPoints: {
      en: [
        "State facts calmly, without over-apologizing",
        "Show what you actually did with the time",
        "Frame the return with intention, not desperation",
        "Share only what's relevant — you don't owe full detail",
        "Demonstrate self-awareness, not shame",
      ],
      es: [
        "Enuncia los hechos con calma, sin disculparte de más",
        "Muestra qué hiciste realmente con el tiempo",
        "Enmarca el retorno con intención, no desesperación",
        "Comparte sólo lo relevante — no debes todo el detalle",
        "Demuestra autoconocimiento, no vergüenza",
      ],
    },
    followUpQuestions: {
      en: [
        "How do you feel about returning to full-time work?",
        "What signs would tell you you're overextending again?",
        "Would you be comfortable with on-call in this role?",
      ],
      es: [
        "¿Cómo te sientes volviendo a tiempo completo?",
        "¿Qué señales te dirían que estás sobreextendido de nuevo?",
        "¿Estarías cómodo con on-call en este rol?",
      ],
    },
  },
  {
    id: "ss-55-handling-job-rejection",
    questionNumber: 55,
    difficulty: "Mid",
    category: "Career & Recruiter",
    title: {
      en: "Bouncing Back from a Rejection",
      es: "Recuperarse de un Rechazo",
    },
    question: {
      en: "Tell me about a time you were rejected from a job or promotion. How did you handle it?",
      es: "Cuéntame sobre una ocasión en la que te rechazaron para un trabajo o ascenso. ¿Cómo lo manejaste?",
    },
    context: {
      en: "Rejection resilience is a leading indicator of career longevity. Recruiters want to see how you process a 'no.'",
      es: "La resiliencia ante el rechazo es un indicador clave de longevidad profesional. Los reclutadores quieren ver cómo procesas un 'no'.",
    },
    whyAsked: {
      en: "They want evidence you learn from rejection rather than stew or repeat the same pattern.",
      es: "Quieren evidencia de que aprendes del rechazo en vez de rumiar o repetir el patrón.",
    },
    commonMistakes: {
      en: [
        "Blaming the interviewer or process",
        "Claiming you were never really rejected",
        "Showing unresolved bitterness",
        "Not naming what you actually learned",
      ],
      es: [
        "Culpar al entrevistador o al proceso",
        "Afirmar que nunca fuiste realmente rechazado",
        "Mostrar amargura sin resolver",
        "No nombrar lo que realmente aprendiste",
      ],
    },
    answerFramework: {
      en: "Briefly describe the rejection, the honest reason behind it, what you did to close the gap, and the later outcome.",
      es: "Describe brevemente el rechazo, la razón honesta detrás, qué hiciste para cerrar la brecha y el resultado posterior.",
    },
    sampleAnswer: {
      en: `Two years ago, I interviewed for a senior role at a company I really wanted to join. I got through four rounds and was rejected after the system design interview.

I asked for real feedback and actually got it: my design was correct but I'd talked past the interviewer's concerns instead of engaging with them. I'd treated it as a monologue rather than a conversation.

That stung. I took a week to be honestly disappointed, then made it concrete. I did eight mock system design sessions with a paid mentor focusing on dialogue, not monologue. I started recording my practice sessions and reviewing how many times I cut off the interviewer.

A year later, I interviewed at a comparable company and got the offer. The original rejection is the single piece of feedback that most changed how I interview.`,
      es: `Hace dos años entrevisté para un rol senior en una empresa a la que realmente quería entrar. Pasé cuatro rondas y me rechazaron después del system design.

Pedí feedback real y lo obtuve: mi diseño era correcto pero había hablado encima de las preocupaciones del entrevistador en vez de engancharme con ellas. Lo traté como monólogo, no como conversación.

Eso me dolió. Me tomé una semana para decepcionarme honestamente, y luego lo hice concreto. Hice ocho sesiones de mock de system design con un mentor pagado, enfocándome en diálogo, no monólogo. Empecé a grabar mis prácticas y a revisar cuántas veces cortaba al entrevistador.

Un año después entrevisté en una empresa comparable y obtuve la oferta. Ese rechazo original es el feedback que más cambió cómo entrevisto.`,
    },
    keyPoints: {
      en: [
        "Pick a real rejection, not a soft one",
        "Ask for honest feedback and accept it",
        "Allow yourself to feel it before fixing it",
        "Take concrete, measurable corrective action",
        "Show the later outcome that proves growth",
      ],
      es: [
        "Elige un rechazo real, no blando",
        "Pide feedback honesto y acéptalo",
        "Date permiso de sentirlo antes de corregirlo",
        "Toma acción correctiva concreta y medible",
        "Muestra el resultado posterior que prueba el crecimiento",
      ],
    },
    followUpQuestions: {
      en: [
        "What would have helped you most in that moment?",
        "How do you stay motivated through rejection cycles?",
        "Are you applying elsewhere right now?",
      ],
      es: [
        "¿Qué te habría ayudado más en ese momento?",
        "¿Cómo te mantienes motivado en ciclos de rechazo?",
        "¿Estás aplicando en otros lugares ahora mismo?",
      ],
    },
  },
  {
    id: "ss-56-why-we-should-hire-you",
    questionNumber: 56,
    difficulty: "Mid",
    category: "Career & Recruiter",
    title: {
      en: "Why Should We Hire You?",
      es: "¿Por Qué Deberíamos Contratarte?",
    },
    question: {
      en: "Out of all the candidates we're considering, why should we hire you?",
      es: "De todos los candidatos que estamos considerando, ¿por qué deberíamos contratarte a ti?",
    },
    context: {
      en: "This question checks whether you can articulate your unique value without arrogance and whether you've internalized what the role actually needs.",
      es: "Esta pregunta evalúa si puedes articular tu valor único sin arrogancia y si has internalizado lo que el rol realmente necesita.",
    },
    whyAsked: {
      en: "Recruiters want evidence of self-knowledge and role-knowledge intersecting, not generic 'I'm hardworking' lines.",
      es: "Los reclutadores quieren evidencia de autoconocimiento y conocimiento del rol intersectándose, no frases genéricas de 'soy esforzado'.",
    },
    commonMistakes: {
      en: [
        "Bashing other candidates",
        "Listing generic virtues",
        "Oversell / arrogance",
        "Listing tools without tying them to the role",
      ],
      es: [
        "Menospreciar a otros candidatos",
        "Listar virtudes genéricas",
        "Sobreventa / arrogancia",
        "Listar herramientas sin vincularlas al rol",
      ],
    },
    answerFramework: {
      en: "Pick two or three specific strengths that intersect with the role's core needs, back each with an outcome, and acknowledge what another candidate might bring that you don't.",
      es: "Elige dos o tres fortalezas específicas que intersequen con las necesidades core del rol, respalda cada una con un resultado y reconoce qué podría aportar otro candidato que tú no.",
    },
    sampleAnswer: {
      en: `I won't claim to be better than every candidate — you've probably seen strong people. I can tell you specifically what I bring.

First, production reliability scars. I've led two post-mortems where the root cause was subtle database contention, and I know what to do when the dashboard is red. Your job description emphasizes reliability work, and I've lived it.

Second, cross-team influence without formal authority. I drove a company-wide adoption of structured logging at my last role as an IC. Your role sits between two teams; that muscle matters.

Third, I'm at the level where I still write a lot of code. I'm not looking to step out of implementation.

What I'd bring less of than some candidates: I haven't worked at your exact scale, so there's a ramp-up on some patterns. I'm confident I'll close that gap quickly, but I won't pretend otherwise.`,
      es: `No diré ser mejor que todo candidato — probablemente han visto gente fuerte. Puedo decirte específicamente qué aporto.

Primero, cicatrices de fiabilidad en producción. He liderado dos post-mortems donde la causa raíz fue contención sutil de base de datos, y sé qué hacer cuando el dashboard está en rojo. Su descripción enfatiza el trabajo de fiabilidad, y lo he vivido.

Segundo, influencia entre equipos sin autoridad formal. Impulsé la adopción de logging estructurado en toda la empresa en mi último rol como IC. Su rol se ubica entre dos equipos; ese músculo importa.

Tercero, estoy en el nivel donde aún escribo mucho código. No busco salir de la implementación.

Lo que traería menos que algunos candidatos: no he trabajado a su escala exacta, así que hay un ramp-up en algunos patrones. Confío en cerrar esa brecha rápido, pero no voy a pretender lo contrario.`,
    },
    keyPoints: {
      en: [
        "Name two or three specific intersecting strengths",
        "Back each with a real outcome, not a claim",
        "Avoid generic traits",
        "Acknowledge an honest gap to stay credible",
        "Don't disparage other candidates",
      ],
      es: [
        "Nombra dos o tres fortalezas específicas que intersecan",
        "Respalda cada una con un resultado real, no una afirmación",
        "Evita rasgos genéricos",
        "Reconoce una brecha honesta para mantener credibilidad",
        "No menosprecies a otros candidatos",
      ],
    },
    followUpQuestions: {
      en: [
        "What's the gap that most worries us about your background?",
        "If we don't pick you, what should our reason be?",
        "How would your impact be different at this scale?",
      ],
      es: [
        "¿Qué brecha es la que más nos preocupa de tu background?",
        "Si no te elegimos, ¿cuál debería ser nuestra razón?",
        "¿Cómo sería diferente tu impacto a esta escala?",
      ],
    },
  },
  {
    id: "ss-57-questions-for-interviewer",
    questionNumber: 57,
    difficulty: "Junior",
    category: "Career & Recruiter",
    title: {
      en: "What Questions Do You Have for Us?",
      es: "¿Qué Preguntas Tienes Para Nosotros?",
    },
    question: {
      en: "What questions do you have for me or for the team?",
      es: "¿Qué preguntas tienes para mí o para el equipo?",
    },
    context: {
      en: "Having no questions is a serious red flag. This is also your chance to gather the information you need to make a decision if an offer comes.",
      es: "No tener preguntas es una bandera roja importante. También es tu oportunidad de reunir la información que necesitas para decidir si llega una oferta.",
    },
    whyAsked: {
      en: "Recruiters want evidence you're evaluating them too, and that you think at the level required for the role.",
      es: "Los reclutadores quieren evidencia de que también los evalúas a ellos y de que piensas al nivel que el rol requiere.",
    },
    commonMistakes: {
      en: [
        "Saying 'no, I think we covered everything'",
        "Asking things you could Google",
        "Only asking about perks",
        "Asking gotcha questions to prove you're smart",
      ],
      es: [
        "Decir 'no, creo que lo cubrimos todo'",
        "Preguntar cosas que podrías googlear",
        "Preguntar sólo sobre beneficios",
        "Hacer preguntas trampa para mostrarte inteligente",
      ],
    },
    answerFramework: {
      en: "Prepare three questions in tiers: one about the role's real day-to-day, one about the team and success, and one about the trajectory of the company or area.",
      es: "Prepara tres preguntas en niveles: una sobre el día a día real del rol, una sobre el equipo y el éxito, y una sobre la trayectoria de la empresa o el área.",
    },
    sampleAnswer: {
      en: `A few, yes.

First, on the role: what's a concrete example of a project someone in this role owned end-to-end in the last six months? I want to calibrate on actual scope, not just the job description.

Second, on the team: what's the biggest internal tension your team is navigating right now? Every team has one, and I'd rather know it than be surprised in month two.

Third, on the company: what would have to be true in two years for this team to have been successful? I'm trying to understand what you're actually optimizing for.

And a selfish one: what's your honest take on the current onboarding experience? I want to know what I'd be walking into week one.`,
      es: `Unas cuantas, sí.

Primero, sobre el rol: ¿cuál es un ejemplo concreto de un proyecto del que alguien en este rol fue dueño de extremo a extremo en los últimos seis meses? Quiero calibrar el alcance real, no sólo la descripción del puesto.

Segundo, sobre el equipo: ¿cuál es la mayor tensión interna que su equipo está navegando ahora? Todo equipo tiene una, y prefiero saberla antes que sorprenderme en el mes dos.

Tercero, sobre la empresa: ¿qué tendría que ser cierto en dos años para que este equipo haya tenido éxito? Intento entender qué están optimizando realmente.

Y una egoísta: ¿cuál es tu opinión honesta sobre la experiencia de onboarding actual? Quiero saber con qué me encontraría en la primera semana.`,
    },
    keyPoints: {
      en: [
        "Always have at least three prepared questions",
        "Vary the tiers: role, team, company",
        "Ask things you can't find online",
        "Probe for honest friction, not puff answers",
        "Save perk/benefits questions for the recruiter, not the hiring manager",
      ],
      es: [
        "Ten siempre al menos tres preguntas preparadas",
        "Varía los niveles: rol, equipo, empresa",
        "Pregunta cosas que no puedes encontrar online",
        "Indaga por fricción honesta, no respuestas edulcoradas",
        "Guarda preguntas de beneficios para el reclutador, no el hiring manager",
      ],
    },
    followUpQuestions: {
      en: [
        "What's one thing that surprised you about joining here?",
        "What's the last thing this team got wrong, and how did it go?",
        "How is performance actually evaluated?",
      ],
      es: [
        "¿Qué te sorprendió al unirte aquí?",
        "¿Qué es lo último que este equipo hizo mal, y cómo resultó?",
        "¿Cómo se evalúa realmente el desempeño?",
      ],
    },
  },
  {
    id: "ss-58-counter-offer",
    questionNumber: 58,
    difficulty: "Senior",
    category: "Career & Recruiter",
    title: {
      en: "Handling a Counter-Offer",
      es: "Manejar una Contraoferta",
    },
    question: {
      en: "If your current employer made a compelling counter-offer once you resigned, what would you do?",
      es: "Si tu empleador actual hiciera una contraoferta atractiva tras tu renuncia, ¿qué harías?",
    },
    context: {
      en: "Recruiters ask this to check commitment and to understand whether the move is about money or about a real career reason.",
      es: "Los reclutadores preguntan esto para verificar compromiso y entender si el movimiento es por dinero o por una razón real de carrera.",
    },
    whyAsked: {
      en: "Counter-offer acceptance has a high one-year attrition rate. Hiring teams want to know you've thought about this honestly.",
      es: "Aceptar una contraoferta tiene una alta tasa de rotación en el primer año. Los equipos de contratación quieren saber si lo has pensado honestamente.",
    },
    commonMistakes: {
      en: [
        "Pretending you'd never consider one",
        "Saying 'I'd take whatever pays more'",
        "Being unclear about your real motivations",
        "Answering before thinking",
      ],
      es: [
        "Fingir que nunca la considerarías",
        "Decir 'tomaría la que pague más'",
        "No tener claras tus motivaciones reales",
        "Responder sin pensar",
      ],
    },
    answerFramework: {
      en: "Acknowledge the scenario honestly, explain the decision criteria you'd apply, and anchor on the career reason that drove the move in the first place.",
      es: "Reconoce el escenario honestamente, explica el criterio de decisión que aplicarías y ancla en la razón de carrera que motivó el movimiento en primer lugar.",
    },
    sampleAnswer: {
      en: `Honest answer: I'd listen, but I wouldn't take it.

The reason I'm leaving is a technical-ceiling problem, not a money problem. A counter-offer solves money. It doesn't solve that my current platform operates at a scale where I've already learned what it has to teach me. A bigger salary doing the same work would just delay this same conversation in 18 months.

I'd also weigh the data on counter-offers. Most people who accept them leave within a year anyway, because the underlying reason didn't actually change.

If I get to resignation, I've already decided. I'd tell my current manager I appreciate the gesture but the decision stands.

That said, if you offer me this role, I'd rather know now whether there's anything in my motivations I'm not reading clearly, so we don't both end up here.`,
      es: `Respuesta honesta: escucharía, pero no la aceptaría.

La razón por la que me voy es un problema de techo técnico, no de dinero. Una contraoferta resuelve el dinero. No resuelve que mi plataforma actual opera a una escala donde ya aprendí lo que tenía para enseñarme. Un salario más alto haciendo el mismo trabajo sólo retrasaría esta misma conversación en 18 meses.

También ponderaría los datos sobre contraofertas. La mayoría de quienes las aceptan se van en un año de todos modos, porque la razón de fondo no cambió.

Si llego a la renuncia, ya decidí. Le diría a mi manager actual que aprecio el gesto pero la decisión queda.

Dicho esto, si me ofrecen este rol, prefiero saber ahora si hay algo en mis motivaciones que no esté leyendo con claridad, para que no terminemos ambos aquí.`,
    },
    keyPoints: {
      en: [
        "Answer honestly, not tactically",
        "Anchor on the non-monetary reason for leaving",
        "Reference the counter-offer attrition data if it helps",
        "Reassure the hiring team without being hollow",
        "Invite them to test your motivations",
      ],
      es: [
        "Responde honestamente, no tácticamente",
        "Ancla en la razón no monetaria de tu salida",
        "Menciona los datos de rotación por contraoferta si ayuda",
        "Tranquiliza al equipo sin sonar hueco",
        "Invítalos a poner a prueba tus motivaciones",
      ],
    },
    followUpQuestions: {
      en: [
        "What if the counter-offer was significantly larger than our offer?",
        "Have you told your current employer you're interviewing?",
        "When would you resign if we made an offer today?",
      ],
      es: [
        "¿Y si la contraoferta fuera significativamente mayor que la nuestra?",
        "¿Le has dicho a tu empleador actual que estás entrevistando?",
        "¿Cuándo renunciarías si hiciéramos una oferta hoy?",
      ],
    },
  },
  {
    id: "ss-59-notice-period-start-date",
    questionNumber: 59,
    difficulty: "Junior",
    category: "Career & Recruiter",
    title: {
      en: "Notice Period and Start Date",
      es: "Período de Aviso y Fecha de Inicio",
    },
    question: {
      en: "What's your notice period, and when could you realistically start?",
      es: "¿Cuál es tu período de aviso y cuándo podrías empezar realmente?",
    },
    context: {
      en: "Recruiters align start dates with team onboarding cycles. Vague answers stall offers; confident answers accelerate them.",
      es: "Los reclutadores alinean fechas de inicio con ciclos de onboarding del equipo. Respuestas vagas frenan ofertas; respuestas claras las aceleran.",
    },
    whyAsked: {
      en: "They're planning. They also want to see whether you'll leave your current employer professionally, since that's a signal for how you'd leave them one day.",
      es: "Están planeando. También quieren ver si dejarás a tu empleador actual profesionalmente, ya que es una señal de cómo los dejarías a ellos algún día.",
    },
    commonMistakes: {
      en: [
        "Promising to start immediately without burning bridges",
        "Vague 'as soon as possible'",
        "Not accounting for contractual notice",
        "Forgetting to mention planned time off",
      ],
      es: [
        "Prometer arrancar de inmediato sin quemar puentes",
        "Un vago 'lo antes posible'",
        "No considerar el aviso contractual",
        "Olvidar mencionar tiempo libre ya planeado",
      ],
    },
    answerFramework: {
      en: "State your notice period, confirm you'd honor it, give a concrete target start date, and flag any pre-existing commitments.",
      es: "Indica tu período de aviso, confirma que lo honrarás, da una fecha de inicio concreta y señala compromisos previos.",
    },
    sampleAnswer: {
      en: `My notice is four weeks — I'd want to honor that fully. I'm in the middle of one critical deliverable, and leaving it clean matters to me.

With that, if we aligned on an offer in the next two weeks, I could realistically start on the first Monday of the month after next. That gives us the notice period plus a short buffer.

One thing to flag: I have a pre-booked family trip in the week of [date]. Five days. I'd want to take that unpaid if it's within the first few months.

If you need someone sooner, I can tell you honestly what I could and couldn't move up.`,
      es: `Mi aviso es de cuatro semanas — quiero honrarlo completo. Estoy en medio de un entregable crítico, y dejarlo limpio me importa.

Con eso, si alineamos una oferta en las próximas dos semanas, podría empezar realistamente el primer lunes del mes siguiente. Eso cubre el período de aviso más un pequeño buffer.

Un punto a señalar: tengo un viaje familiar ya reservado en la semana del [fecha]. Cinco días. Me gustaría tomarlo sin goce si cae dentro de los primeros meses.

Si necesitan a alguien antes, puedo decirte honestamente qué podría y qué no podría adelantar.`,
    },
    keyPoints: {
      en: [
        "State notice period clearly",
        "Commit to honoring it — signals professionalism",
        "Give a specific target start date",
        "Flag any pre-booked commitments early",
        "Offer flexibility where honest",
      ],
      es: [
        "Indica claramente el período de aviso",
        "Comprométete a honrarlo — señala profesionalismo",
        "Da una fecha de inicio específica",
        "Señala compromisos previos pronto",
        "Ofrece flexibilidad donde sea honesto",
      ],
    },
    followUpQuestions: {
      en: [
        "Is your notice period contractual or standard practice?",
        "Would your manager try to extend the notice?",
        "Can you start sooner if we cover a sign-on to offset lost bonus?",
      ],
      es: [
        "¿Tu aviso es contractual o práctica estándar?",
        "¿Tu manager intentaría extender el aviso?",
        "¿Podrías empezar antes si cubrimos un sign-on para compensar el bono perdido?",
      ],
    },
  },
  {
    id: "ss-60-handling-a-layoff",
    questionNumber: 60,
    difficulty: "Mid",
    category: "Career & Recruiter",
    title: {
      en: "Being Affected by a Layoff",
      es: "Ser Afectado por un Despido Colectivo",
    },
    question: {
      en: "You were laid off from your previous role. Can you walk me through what happened?",
      es: "Fuiste despedido en tu rol anterior. ¿Puedes contarme qué pasó?",
    },
    context: {
      en: "Layoffs are common and not a mark against you. Recruiters check whether you can tell the story with dignity and without bitterness.",
      es: "Los despidos colectivos son comunes y no son una marca en tu contra. Los reclutadores revisan si puedes contar la historia con dignidad y sin amargura.",
    },
    whyAsked: {
      en: "They want to see you can describe a hard business decision cleanly, without trashing the prior employer, and with clarity on what you took away from it.",
      es: "Quieren ver que puedes describir una decisión difícil de negocio con limpieza, sin atacar al empleador anterior y con claridad sobre lo que te llevaste de ella.",
    },
    commonMistakes: {
      en: [
        "Being bitter or blaming leadership",
        "Oversharing about the politics",
        "Pretending it didn't affect you",
        "Not explaining what you've done since",
      ],
      es: [
        "Ser amargo o culpar al liderazgo",
        "Compartir de más sobre las políticas internas",
        "Fingir que no te afectó",
        "No explicar qué has hecho desde entonces",
      ],
    },
    answerFramework: {
      en: "State the business reason factually, describe where you were at and what you shipped before it happened, share what you did during the transition, and land on how you've moved forward.",
      es: "Enuncia la razón de negocio de forma fáctica, describe dónde estabas y qué entregaste antes de que ocurriera, comparte qué hiciste durante la transición y aterriza en cómo avanzaste.",
    },
    sampleAnswer: {
      en: `In the February 2024 round of layoffs, my company reduced headcount by around 20% across the org. My team was one of the most affected — we lost seven of twelve engineers, including me.

It wasn't a performance decision. The company had over-hired in 2022 and had to correct. My manager was candid and supportive. I'd shipped our analytics pipeline migration the month before, which was a meaningful ship.

I used the first two weeks to decompress honestly — layoffs hit harder than you expect. Then I got structured: I updated my résumé, reached out to my network, and started a side project that became my portfolio centerpiece. I did around 25 technical interviews across 10 companies over three months.

I'm now selective about where I interview. I'm here specifically because the role and technical scope match what I want, not because I'm desperate.`,
      es: `En la ronda de despidos de febrero de 2024, mi empresa redujo ~20% de plantilla en toda la org. Mi equipo fue de los más afectados — perdimos siete de doce ingenieros, yo incluido.

No fue una decisión de desempeño. La empresa había sobrecontratado en 2022 y tenía que corregir. Mi manager fue franco y me apoyó. Había entregado la migración de nuestro pipeline de analítica el mes anterior, un entregable significativo.

Usé las primeras dos semanas para descomprimir honestamente — los despidos pegan más fuerte de lo que uno espera. Luego me estructuré: actualicé el CV, contacté a mi red y empecé un side project que se convirtió en la pieza central de mi portafolio. Hice unas 25 entrevistas técnicas en 10 empresas durante tres meses.

Ahora soy selectivo con dónde entrevisto. Estoy aquí específicamente porque el rol y el alcance técnico encajan con lo que quiero, no porque esté desesperado.`,
    },
    keyPoints: {
      en: [
        "State the business reason factually",
        "Avoid bitterness or blame",
        "Reference a concrete shipped accomplishment from before the layoff",
        "Describe how you used the transition productively",
        "Show you're selective now, not desperate",
      ],
      es: [
        "Enuncia la razón de negocio de forma fáctica",
        "Evita la amargura o las culpas",
        "Referencia un logro concreto entregado antes del despido",
        "Describe cómo usaste la transición productivamente",
        "Muestra que eres selectivo ahora, no desesperado",
      ],
    },
    followUpQuestions: {
      en: [
        "How long were you out of work?",
        "Have you had other offers during this search?",
        "What's your financial runway, in case I push on start date?",
      ],
      es: [
        "¿Cuánto tiempo estuviste sin trabajo?",
        "¿Has tenido otras ofertas durante esta búsqueda?",
        "¿Cuál es tu margen financiero, por si presiono en la fecha de inicio?",
      ],
    },
  },

];

// ============ Helper Functions ============

export function getLocalizedText(field: Bilingual, lang: Lang): string {
  return field[lang];
}

export function getLocalizedList(field: BilingualList, lang: Lang): string[] {
  return field[lang];
}

export function getCategoryLabel(category: SoftSkillCategory, lang: Lang): string {
  return CATEGORY_LABELS[category][lang];
}

export function getDifficultyLabel(difficulty: SoftSkillDifficulty, lang: Lang): string {
  return DIFFICULTY_LABELS[difficulty][lang];
}

export function getSoftSkillQuestionById(id: string): SoftSkillQuestion | undefined {
  return SOFT_SKILLS_QUESTIONS.find((q) => q.id === id);
}

export function getAllSoftSkillQuestionIds(): string[] {
  return SOFT_SKILLS_QUESTIONS.map((q) => q.id);
}

export function getSoftSkillQuestionsByCategory(category: SoftSkillCategory): SoftSkillQuestion[] {
  return SOFT_SKILLS_QUESTIONS.filter((q) => q.category === category);
}

export function getSoftSkillQuestionsByDifficulty(difficulty: SoftSkillDifficulty): SoftSkillQuestion[] {
  return SOFT_SKILLS_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function getAllSoftSkillCategories(): SoftSkillCategory[] {
  return [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Leadership",
    "Adaptability",
    "Conflict Resolution",
    "Time Management",
    "Growth Mindset",
    "Culture Fit",
    "Career & Recruiter",
  ];
}

export function searchSoftSkillQuestions(query: string, lang: Lang): SoftSkillQuestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return SOFT_SKILLS_QUESTIONS;
  return SOFT_SKILLS_QUESTIONS.filter((item) => {
    return (
      item.title[lang].toLowerCase().includes(q) ||
      item.question[lang].toLowerCase().includes(q) ||
      getCategoryLabel(item.category, lang).toLowerCase().includes(q)
    );
  });
}

export function shuffleQuestions(questions: SoftSkillQuestion[] = SOFT_SKILLS_QUESTIONS): SoftSkillQuestion[] {
  const arr = [...questions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
