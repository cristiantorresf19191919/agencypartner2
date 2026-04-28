/**
 * Central registry for Spanish overlays on developer-section course content.
 *
 * Phase 1 ("course shells") = the navigable surface a learner sees:
 *   - Course landing copy (title/subtitle handled in lib/translations.ts)
 *   - Per-lesson titles shown in nav cards, sidebar, and lesson headers
 *
 * Lesson body content (paragraphs, code commentary, tagged sections) is NOT
 * translated here — it stays English with a "translation pending" badge when
 * locale is "es". Once a course's body is fully translated, add the contentEs
 * arrays directly into the data file.
 *
 * Each map is keyed by the lesson `id` produced by that course's build()
 * helper so we can do a single overlay step inside the data file:
 *
 *   const lessons = buildLessons().map(l => ({ ...l, titleEs: TITLES_ES[l.id] }));
 */

/* ─── TypeScript (10) ─── */
export const TS_TITLES_ES: Record<string, string> = {
  'ts-1': 'TypeScript 1: tipos básicos',
  'ts-2': 'TypeScript 2: arrays tipados',
  'ts-3': 'TypeScript 3: funciones con tipos',
  'ts-4': 'TypeScript 4: tipo Boolean',
  'ts-5': 'TypeScript 5: interfaces',
  'ts-6': 'TypeScript 6: parámetros opcionales',
  'ts-7': 'TypeScript 7: tipos unión',
  'ts-8': 'TypeScript 8: retorno void',
  'ts-9': 'TypeScript 9: tipos literales',
  'ts-10': 'TypeScript 10: arrays de objetos tipados',
};

/* ─── CSS Flexbox (8) ─── */
export const CSS_TITLES_ES: Record<string, string> = {
  'css-1': 'CSS Flexbox 1: introducción',
  'css-2': 'CSS Flexbox 2: flex-direction row',
  'css-3': 'CSS Flexbox 3: flex-direction column',
  'css-4': 'CSS Flexbox 4: justify-content center',
  'css-5': 'CSS Flexbox 5: justify-content space-between',
  'css-6': 'CSS Flexbox 6: align-items center',
  'css-7': 'CSS Flexbox 7: flex-wrap',
  'css-8': 'CSS Flexbox 8: gap',
};

/* ─── Azure (36) ─── */
export const AZURE_TITLES_ES: Record<string, string> = {
  'azure-1': 'Azure 1: conceptos cloud y portal de Azure',
  'azure-2': 'Azure 2: grupos de recursos y suscripciones',
  'azure-3': 'Azure 3: lo esencial de Azure CLI',
  'azure-4': 'Azure 4: plantillas ARM y Bicep',
  'azure-5': 'Azure 5: control de acceso basado en roles (RBAC)',
  'azure-6': 'Azure 6: gestión de costes y presupuestos',
  'azure-7': 'Azure 7: Azure Policy y gobernanza',
  'azure-8': 'Azure 8: tags y organización de recursos',
  'azure-9': 'Azure 9: máquinas virtuales',
  'azure-10': 'Azure 10: Azure App Service',
  'azure-11': 'Azure 11: Azure Functions (serverless)',
  'azure-12': 'Azure 12: Container Instances',
  'azure-13': 'Azure 13: Azure Kubernetes Service (AKS)',
  'azure-14': 'Azure 14: Logic Apps y automatización de flujos',
  'azure-15': 'Azure 15: Blob Storage',
  'azure-16': 'Azure 16: Table Storage y Queue Storage',
  'azure-17': 'Azure 17: Azure Cosmos DB',
  'azure-18': 'Azure 18: Azure SQL Database',
  'azure-19': 'Azure 19: Azure Cache for Redis',
  'azure-20': 'Azure 20: redes virtuales y subredes',
  'azure-21': 'Azure 21: Network Security Groups (NSGs)',
  'azure-22': 'Azure 22: Load Balancer y Application Gateway',
  'azure-23': 'Azure 23: Azure DNS y dominios personalizados',
  'azure-24': 'Azure 24: pipelines de Azure DevOps',
  'azure-25': 'Azure 25: GitHub Actions para Azure',
  'azure-26': 'Azure 26: Terraform sobre Azure',
  'azure-27': 'Azure 27: Azure Container Registry (ACR)',
  'azure-28': 'Azure 28: Azure Key Vault',
  'azure-29': 'Azure 29: Azure Monitor y Application Insights',
  'azure-30': 'Azure 30: arquitectura cloud — uniendo todo',
  'azure-31': 'Azure 31: Entra ID y MSAL.js — autenticación SPA',
  'azure-32': 'Azure 32: Entra ID + Spring Boot — Resource Server',
  'azure-33': 'Azure 33: Service Bus — topics, queues y dead-letter',
  'azure-34': 'Azure 34: Azure Artifacts — feeds privados de paquetes',
  'azure-35': 'Azure 35: Helm en AKS — overlays de values',
  'azure-36': 'Azure 36: integración con Key Vault a escala — pipeline, CSI y App Service',
};

/* ─── Apollo GraphQL Course (25) ─── */
export const APOLLO_TITLES_ES: Record<string, string> = {
  'apollo-1': 'Apollo 1: queries y useQuery',
  'apollo-2': 'Apollo 2: variables y queries dinámicas',
  'apollo-3': 'Apollo 3: fragments y composición',
  'apollo-4': 'Apollo 4: mutaciones y UI optimista',
  'apollo-5': 'Apollo 5: fetch policies',
  'apollo-6': 'Apollo 6: lectura y escritura en caché',
  'apollo-7': 'Apollo 7: type policies',
  'apollo-8': 'Apollo 8: variables reactivas',
  'apollo-9': 'Apollo 9: invalidación de caché',
  'apollo-10': 'Apollo 10: paginación',
  'apollo-11': 'Apollo 11: manejo de errores y links',
  'apollo-12': 'Apollo 12: hooks con Suspense',
  'apollo-13': 'Apollo 13: subscriptions y polling',
  'apollo-14': 'Apollo 14: testing en Apollo',
  'apollo-15': 'Apollo 15: optimización de rendimiento',
  'apollo-16': 'Apollo 16: custom hooks',
  'apollo-17': 'Apollo 17: desarrollo guiado por schema',
  'apollo-18': 'Apollo 18: gestión de estado local',
  'apollo-19': 'Apollo 19: patrones de autenticación',
  'apollo-20': 'Apollo 20: subida de archivos',
  'apollo-21': 'Apollo 21: DevTools y depuración',
  'apollo-22': 'Apollo 22: SSR con Next.js',
  'apollo-23': 'Apollo 23: soporte offline',
  'apollo-24': 'Apollo 24: arquitectura en tiempo real',
  'apollo-25': 'Apollo 25: checklist de producción',
};

/* ─── Apollo Challenges (10) ─── */
export const APOLLO_CHALLENGE_TITLES_ES: Record<string, string> = {
  'write-your-first-query': 'Escribe tu primera query',
  'dynamic-variables': 'Variables dinámicas',
  'fragment-composition': 'Composición con fragments',
  'optimistic-mutation': 'Mutación optimista',
  'cache-surgery': 'Cirugía de caché',
  'reactive-local-state': 'Estado local reactivo',
  'pagination-merge': 'Paginación con merge',
  'error-boundary-chain': 'Cadena de error boundaries',
  'suspense-waterfall-fix': 'Arregla el waterfall de Suspense',
  'full-stack-cache': 'Caché de stack completo',
};

/* ─── Android-Kotlin (10) ─── */
export const ANDROID_TITLES_ES: Record<string, string> = {
  'level-1-hello-compose': 'Nivel 1: el átomo (Hello Compose)',
  'level-2-state-interactivity': 'Nivel 2: estado e interactividad',
  'level-3-layouts-modifiers': 'Nivel 3: layouts y modifiers',
  'level-4-lists': 'Nivel 4: listas (el nuevo RecyclerView)',
  'level-5-state-hoisting': 'Nivel 5: state hoisting (flujo de datos unidireccional)',
  'level-6-viewmodel-flow': 'Nivel 6: ViewModel y Flow (arquitectura)',
  'level-7-navigation': 'Nivel 7: navegación moderna',
  'level-8-side-effects': 'Nivel 8: efectos secundarios',
  'level-9-network-stack': 'Nivel 9: stack de red completo (Retrofit + Repository)',
  'level-10-dependency-injection': 'Nivel 10: inyección de dependencias (Hilt)',
};

/* ─── Kotlin ↔ Java Interop (8) ─── */
export const KOTLIN_INTEROP_TITLES_ES: Record<string, string> = {
  'comparison-to-java': 'Comparación con Java',
  'calling-java-from-kotlin': 'Llamar a Java desde Kotlin',
  'calling-kotlin-from-java': 'Llamar a Kotlin desde Java',
  'using-java-records-in-kotlin': 'Usar Records de Java en Kotlin',
  'strings-java-kotlin': 'Strings en Java y Kotlin',
  'collections-java-kotlin': 'Colecciones en Java y Kotlin',
  'nullability-java-kotlin': 'Nullability en Java y Kotlin',
  'standard-input': 'Entrada estándar',
};

/* ─── Java (40) ─── */
export const JAVA_TITLES_ES: Record<string, string> = {
  'java-1': 'Java 1: primitivos, wrappers y autoboxing',
  'java-2': 'Java 2: Strings, inmutabilidad y StringBuilder',
  'java-3': 'Java 3: control de flujo, etiquetas y returns tempranos',
  'java-4': 'Java 4: arrays, varargs y copias defensivas',
  'java-5': 'Java 5: métodos, sobrecarga y la firma de main',
  'java-6': 'Java 6: clases, constructores y this/super',
  'java-7': 'Java 7: herencia y sobreescritura de métodos',
  'java-8': 'Java 8: polimorfismo, clases abstractas e interfaces',
  'java-9': 'Java 9: composición sobre herencia',
  'java-10': 'Java 10: clases selladas (Java 17)',
  'java-11': 'Java 11: Records y semántica de valor (Java 16)',
  'java-12': 'Java 12: clases y métodos genéricos',
  'java-13': 'Java 13: wildcards y PECS',
  'java-14': 'Java 14: borrado de tipos y métodos puente',
  'java-15': 'Java 15: parámetros de tipo acotados',
  'java-16': 'Java 16: var, inferencia de tipos y lambdas',
  'java-17': 'Java 17: ArrayList vs LinkedList',
  'java-18': 'Java 18: internals de HashMap',
  'java-19': 'Java 19: contrato equals/hashCode',
  'java-20': 'Java 20: TreeMap y colecciones ordenadas',
  'java-21': 'Java 21: ConcurrentHashMap y lock striping',
  'java-22': 'Java 22: CopyOnWriteArrayList y cuándo gana',
  'java-23': 'Java 23: lambdas e interfaces funcionales',
  'java-24': 'Java 24: Stream API — evaluación lazy',
  'java-25': 'Java 25: Collectors — groupingBy, partitioningBy, joining',
  'java-26': 'Java 26: streams paralelos — cuándo ayudan',
  'java-27': 'Java 27: Optional — evitando null',
  'java-28': 'Java 28: Thread, Runnable y Thread.start vs run',
  'java-29': 'Java 29: synchronized, volatile y Atomic',
  'java-30': 'Java 30: ExecutorService y thread pools',
  'java-31': 'Java 31: composición con CompletableFuture',
  'java-32': 'Java 32: Virtual Threads (Project Loom)',
  'java-33': 'Java 33: BlockingQueue y patrón productor-consumidor',
  'java-34': 'Java 34: heap, stack y memoria generacional',
  'java-35': 'Java 35: algoritmos de GC — G1, ZGC, Shenandoah',
  'java-36': 'Java 36: carga de clases y modelo de delegación',
  'java-37': 'Java 37: tipos de referencia — Strong, Soft, Weak, Phantom',
  'java-38': 'Java 38: pattern matching para instanceof y switch',
  'java-39': 'Java 39: text blocks, switch expressions y recap Java 8→17',
  'java-40': 'Java 40: capstone — caché LRU acotado y thread-safe',
};

/* ─── MobX (65) ─── */
export const MOBX_TITLES_ES: Record<string, string> = {
  'mobx-1': 'MobX 1: ¿Qué es MobX? El modelo de reactividad',
  'mobx-2': 'MobX 2: observable y makeObservable',
  'mobx-3': 'MobX 3: makeAutoObservable — el atajo',
  'mobx-4': 'MobX 4: action — mutaciones atómicas de estado',
  'mobx-5': 'MobX 5: computed — derivaciones auto-memoizadas',
  'mobx-6': 'MobX 6: autorun — tu primera reacción',
  'mobx-7': 'MobX 7: reaction vs autorun vs when',
  'mobx-8': 'MobX 8: observable.box — observables primitivos',
  'mobx-9': 'MobX 9: Deep vs Shallow vs Ref',
  'mobx-10': 'MobX 10: arrays, mapas y sets observables',
  'mobx-11': 'MobX 11: toJS — serializando observables',
  'mobx-12': 'MobX 12: el grafo de derivaciones',
  'mobx-13': 'MobX 13: transacciones y batching',
  'mobx-14': 'MobX 14: configure — modo estricto y ajustes',
  'mobx-15': 'MobX 15: observer — el puente con React',
  'mobx-16': 'MobX 16: estado observable local vs global',
  'mobx-17': 'MobX 17: patrón Provider + Context',
  'mobx-18': 'MobX 18: formularios controlados con MobX',
  'mobx-19': 'MobX 19: store de fetching asíncrono',
  'mobx-20': 'MobX 20: UI optimista al estilo useOptimistic con MobX',
  'mobx-21': 'MobX 21: re-renders granulares por fila en listas',
  'mobx-22': 'MobX 22: stores derivados — composición entre stores',
  'mobx-23': 'MobX 23: inicialización lazy con onBecomeObserved',
  'mobx-24': 'MobX 24: disposers y limpieza en React',
  'mobx-25': 'MobX 25: persistencia en localStorage vía autorun',
  'mobx-26': 'MobX 26: búsqueda con debounce — MobX + React',
  'mobx-27': 'MobX 27: store de paginación',
  'mobx-28': 'MobX 28: scroll infinito',
  'mobx-29': 'MobX 29: wizard de formulario con validación por paso',
  'mobx-30': 'MobX 30: pila de Deshacer/Rehacer',
  'mobx-31': 'MobX 31: servicio de notificaciones toast',
  'mobx-32': 'MobX 32: gestor de modales',
  'mobx-33': 'MobX 33: store de autenticación',
  'mobx-34': 'MobX 34: estado tipo router con historial',
  'mobx-35': 'MobX 35: selectores derivados (composición de computed)',
  'mobx-36': 'MobX 36: igualdad estructural en computed',
  'mobx-37': 'MobX 37: keepAlive en computed',
  'mobx-38': "MobX 38: spy() — el flujo de eventos de MobX",
  'mobx-39': 'MobX 39: trace() para depuración dirigida',
  'mobx-40': 'MobX 40: alternativa a mobx-logger',
  'mobx-41': 'MobX 41: ejecutar múltiples stores en React',
  'mobx-42': 'MobX 42: hook useStore tipado a medida',
  'mobx-43': 'MobX 43: patrones de TypeScript con MobX',
  'mobx-44': 'MobX 44: probando un store de forma aislada',
  'mobx-45': 'MobX 45: probando componentes observer',
  'mobx-46': 'MobX 46: Atoms — la primitiva de bajo nivel',
  'mobx-47': 'MobX 47: store de suscripción WebSocket',
  'mobx-48': 'MobX 48: flujos asíncronos con flow() y generadores',
  'mobx-49': 'MobX 49: parámetros de action y logging',
  'mobx-50': 'MobX 50: Error Boundary + observer',
  'mobx-51': 'MobX 51: DI con RootStore + separación por interfaces',
  'mobx-52': 'MobX 52: entidades de dominio con métodos',
  'mobx-53': 'MobX 53: checklist de rendimiento',
  'mobx-54': 'MobX 54: observable sobre POJOs vs clases',
  'mobx-55': 'MobX 55: when() como Promise',
  'mobx-56': 'MobX 56: MobX vs Redux cara a cara',
  'mobx-57': 'MobX 57: MobX vs Zustand',
  'mobx-58': 'MobX 58: trampa común — destructurar observables',
  'mobx-59': 'MobX 59: trampa común — pasar un primitivo a un hijo memoizado',
  'mobx-60': 'MobX 60: mobx-react vs mobx-react-lite',
  'mobx-61': 'MobX 61: Signals vs observables de MobX',
  'mobx-62': 'MobX 62: MobX-State-Tree (MST) — introducción breve',
  'mobx-63': 'MobX 63: escalando MobX en apps grandes',
  'mobx-64': 'MobX 64: diseño de sistema — dashboard de e-commerce',
  'mobx-65': 'MobX 65: capstone — TodoMVC edición entrevista',
};
