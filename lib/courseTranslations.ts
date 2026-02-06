/**
 * Course content translations (Kotlin course, React course).
 * Uses locale from path; falls back to English when Spanish is missing.
 * Code (snippets, defaultCode, etc.) is never translated.
 */

import type { Locale } from "./i18n";
import type { DocTocItem, DocBlock } from "./coroutinesBasicsDoc";
import {
  COROUTINES_BASICS_TOC,
  COROUTINES_BASICS_BLOCKS,
} from "./coroutinesBasicsDoc";
import {
  COROUTINES_CHANNELS_TOC,
  COROUTINES_CHANNELS_BLOCKS,
} from "./coroutinesChannelsDoc";
import { getKotlinLessonById, type KotlinLesson } from "./kotlinCourseData";
import { getReactLessonById } from "./reactCourseData";
import type { WebCourseLesson } from "./webCourseTypes";

// ----- Coroutines basics (Spanish overrides) -----
const COROUTINES_BASICS_TOC_ES: DocTocItem[] = [
  { id: "coroutines-basics", label: "Conceptos básicos de corutinas" },
  { id: "suspending-functions", label: "Funciones de suspensión" },
  { id: "add-kotlinx-coroutines", label: "Añadir la biblioteca kotlinx.coroutines a tu proyecto" },
  { id: "create-first-coroutines", label: "Crea tu primera corutina" },
  {
    id: "coroutine-scope",
    label: "Alcance de corutinas y concurrencia estructurada",
    children: [
      { id: "coroutine-scope-function", label: "Crear un alcance con la función coroutineScope()" },
      { id: "extract-coroutine-builders", label: "Extraer constructores de corutinas del alcance" },
    ],
  },
  {
    id: "coroutine-builder-functions",
    label: "Funciones constructoras de corutinas",
    children: [
      { id: "launch", label: "CoroutineScope.launch()" },
      { id: "async", label: "CoroutineScope.async()" },
      { id: "runblocking", label: "runBlocking()" },
    ],
  },
  { id: "coroutine-dispatchers", label: "Despachadores de corutinas" },
  { id: "comparing-coroutines-threads", label: "Comparar corutinas e hilos JVM" },
  { id: "whats-next", label: "Qué sigue" },
];

/** Spanish overrides for coroutines basics blocks (index -> partial block). Missing indices keep English. */
const COROUTINES_BASICS_BLOCKS_ES: Record<number, Partial<DocBlock>> = {
  0: { text: "Conceptos básicos de corutinas" },
  1: {
    text: "Para crear aplicaciones que ejecuten varias tareas a la vez (concurrencia), Kotlin usa corutinas. Una corutina es un cálculo suspendible que permite escribir código concurrente de forma clara y secuencial. Las corutinas pueden ejecutarse de forma concurrente entre sí y en paralelo.",
  },
  2: {
    text: "En la JVM y en Kotlin/Native, todo el código concurrente (incluidas las corutinas) se ejecuta en hilos gestionados por el sistema operativo. Las corutinas pueden suspender su ejecución en lugar de bloquear un hilo. Así, una corutina puede suspenderse esperando datos mientras otra se ejecuta en el mismo hilo.",
  },
  3: {
    text: "Para más información sobre la diferencia entre corutinas e hilos, consulta Comparar corutinas e hilos JVM.",
  },
  4: {
    alt: "Diagrama: Paralelo (varios hilos, una tarea cada uno), Concurrente (un hilo, varias tareas entrelazadas), Paralelo y concurrente.",
  },
  5: { text: "Funciones de suspensión" },
  6: {
    text: "El bloque básico de las corutinas es la función de suspensión. Permite pausar una operación y reanudarla más tarde sin cambiar la estructura del código.",
  },
  7: { text: "Para declarar una función de suspensión, usa la palabra clave suspend:" },
  8: { text: "Solo puedes llamar a una función de suspensión desde otra función de suspensión. Para llamarlas en el punto de entrada de una aplicación Kotlin, marca la función main() con suspend:" },
  9: { text: "Este ejemplo aún no usa concurrencia, pero al marcar las funciones con suspend permites que llamen a otras funciones de suspensión y ejecuten código concurrente." },
  10: { text: "Aunque suspend es parte del lenguaje Kotlin, la mayoría de las funciones de corutinas están en la biblioteca kotlinx.coroutines." },
  11: { text: "Añadir la biblioteca kotlinx.coroutines al proyecto" },
  12: { text: "Para incluir kotlinx.coroutines en tu proyecto, añade la dependencia según tu herramienta de construcción:" },
  13: { text: "Crea tu primera corutina" },
  14: {
    content: "Los ejemplos de esta página usan la expresión explícita this con las funciones constructoras CoroutineScope.launch() y CoroutineScope.async(). Estas constructoras son funciones de extensión sobre CoroutineScope, y this se refiere al CoroutineScope actual. Para un ejemplo práctico, ver Extraer constructores de corutinas del alcance.",
  },
  15: { text: "Para crear una corutina en Kotlin necesitas:" },
  16: {
    items: [
      "Una función de suspensión.",
      "Un alcance de corutina en el que ejecutarla, por ejemplo dentro de withContext().",
      "Una función constructora como CoroutineScope.launch() para iniciarla.",
      "Un despachador que controle qué hilos usa.",
    ],
  },
  17: { text: "Veamos un ejemplo con varias corutinas en un entorno multihilo:" },
  18: { text: "Paso 1: Importa la biblioteca kotlinx.coroutines:" },
  19: { text: "Paso 2: Marca con suspend las funciones que pueden pausarse y reanudarse:" },
  20: {
    content: "Aunque en algunos proyectos puedes marcar main() como suspend, puede no ser posible al integrar con código existente o con un framework. En ese caso, consulta la documentación del framework para ver si permite llamar a funciones de suspensión. Si no, usa runBlocking() para llamarlas bloqueando el hilo actual.",
  },
  21: { text: "Paso 3: Añade la función delay() para simular una tarea de suspensión (p. ej. obtener datos o escribir en base de datos):" },
  22: { text: "Paso 4: Usa withContext(Dispatchers.Default) para definir un punto de entrada de código concurrente multihilo en un pool de hilos compartido:" },
  23: {
    content: "La función de suspensión withContext() se usa sobre todo para cambiar de contexto; en este ejemplo también define un punto de entrada no bloqueante para código concurrente. Usa el despachador Dispatchers.Default. Las corutinas lanzadas dentro del bloque withContext() comparten el mismo alcance (concurrencia estructurada).",
  },
  24: { text: "Paso 5: Usa una función constructora como CoroutineScope.launch() para iniciar la corutina:" },
  25: { text: "Paso 6: Combina todo para ejecutar varias corutinas a la vez en un pool de hilos compartido:" },
  26: { text: "Prueba a ejecutar el ejemplo varias veces. El orden de salida y los nombres de los hilos pueden cambiar en cada ejecución, porque el SO decide cuándo se ejecutan los hilos." },
  27: {
    content: "Puedes mostrar los nombres de las corutinas junto a los nombres de los hilos en la salida. Para ello, pasa la opción de VM -Dkotlinx.coroutines.debug en tu herramienta de construcción o en la configuración de ejecución del IDE. Ver Depuración de corutinas.",
  },
  28: { text: "Alcance de corutinas y concurrencia estructurada" },
  29: { text: "Cuando ejecutas muchas corutinas en una aplicación, necesitas una forma de gestionarlas por grupos. Las corutinas de Kotlin se basan en el principio de concurrencia estructurada." },
  30: { text: "Según este principio, las corutinas forman una jerarquía de tareas padre e hijas con ciclos de vida vinculados. El ciclo de vida de una corutina es la secuencia de estados desde su creación hasta completarse, fallar o cancelarse." },
  31: { text: "Una corutina padre espera a que sus hijas terminen antes de finalizar. Si la padre falla o se cancela, todas sus hijas se cancelan recursivamente. Mantener las corutinas conectadas así hace que la cancelación y el manejo de errores sean predecibles y seguros." },
  32: { text: "Para mantener la concurrencia estructurada, las nuevas corutinas solo pueden lanzarse en un CoroutineScope que defina y gestione su ciclo de vida. El CoroutineScope incluye el contexto, que define el despachador y otras propiedades. Cuando inicias una corutina dentro de otra, esta pasa a ser hija del alcance padre." },
  33: { text: "Llamar a una función constructora como CoroutineScope.launch() sobre un CoroutineScope inicia una corutina hija. Dentro del bloque, el receptor es un CoroutineScope anidado, así que las corutinas que lances ahí serán sus hijas." },
  34: { text: "Crear un alcance con la función coroutineScope()" },
  35: { text: "Para crear un nuevo alcance de corutinas con el contexto actual, usa coroutineScope(). Esta función crea una corutina raíz del subárbol. Es la padre directa de las corutinas lanzadas dentro del bloque. coroutineScope() ejecuta el bloque de suspensión y espera hasta que el bloque y las corutinas lanzadas en él terminen." },
  36: { text: "Ejemplo:" },
  37: { text: "Como en este ejemplo no se especifica despachador, los CoroutineScope.launch() dentro del bloque coroutineScope() heredan el contexto actual. Si ese contexto no tiene despachador, se usa Dispatchers.Default." },
  38: { text: "Extraer constructores de corutinas del alcance" },
  39: { text: "En algunos casos querrás extraer las llamadas a constructores (p. ej. CoroutineScope.launch()) en funciones separadas." },
  40: { text: "Considera este ejemplo:" },
  41: {
    content: "También puedes escribir this.launch sin el this explícito (como launch). Estos ejemplos usan this explícito para resaltar que es una función de extensión sobre CoroutineScope. Para más información sobre lambdas con receptor en Kotlin, ver Function literals with receiver.",
  },
  42: { text: "La función coroutineScope() recibe una lambda con un receptor CoroutineScope. Dentro de esa lambda, el receptor implícito es un CoroutineScope, así que funciones como CoroutineScope.launch() y CoroutineScope.async() se resuelven como extensiones sobre ese receptor." },
  43: { text: "Para extraer las constructoras a otra función, esa función debe declarar un receptor CoroutineScope; si no, habrá error de compilación." },
  44: { text: "Funciones constructoras de corutinas" },
  45: { text: "Una función constructora de corutinas es una función que acepta una lambda suspend que define la corutina a ejecutar. Algunos ejemplos:" },
  46: {
    items: ["CoroutineScope.launch()", "CoroutineScope.async()", "runBlocking()", "withContext()", "coroutineScope()"],
  },
  47: { text: "Las funciones constructoras requieren un CoroutineScope. Puede ser un alcance existente o uno creado con coroutineScope(), runBlocking() o withContext(). Cada constructora define cómo empieza la corutina y cómo se obtiene su resultado." },
  48: { text: "CoroutineScope.launch()" },
  49: { text: "CoroutineScope.launch() es una función de extensión sobre CoroutineScope. Inicia una nueva corutina sin bloquear el resto del alcance." },
  50: { text: "Usa CoroutineScope.launch() para ejecutar una tarea en paralelo cuando no necesitas el resultado o no quieres esperarlo:" },
  51: { text: "Tras ejecutar el ejemplo, verás que main() no queda bloqueada por CoroutineScope.launch() y sigue ejecutando código mientras la corutina trabaja en segundo plano." },
  52: {
    content: "CoroutineScope.launch() devuelve un Job. Usa ese Job para esperar a que la corutina lanzada termine. Para más información, ver Cancelación y tiempos de espera.",
  },
  53: { text: "CoroutineScope.async()" },
  54: { text: "CoroutineScope.async() es una función de extensión sobre CoroutineScope. Inicia un cálculo concurrente dentro de un alcance y devuelve un Deferred que representa el resultado futuro. Usa .await() para suspender hasta que el resultado esté listo:" },
  55: { text: "runBlocking()" },
  56: { text: "runBlocking() crea un alcance de corutinas y bloquea el hilo actual hasta que las corutinas lanzadas en ese alcance terminen." },
  57: { text: "Usa runBlocking() solo cuando no haya otra opción para llamar a código de suspensión desde código no suspendido:" },
  58: { text: "Despachadores de corutinas" },
  59: { text: "Un despachador de corutinas controla en qué hilo o pool de hilos se ejecutan las corutinas. Las corutinas no están atadas a un solo hilo: pueden pausarse en un hilo y reanudarse en otro. Así puedes ejecutar muchas corutinas a la vez sin dedicar un hilo a cada una." },
  60: {
    content: "Aunque las corutinas pueden suspenderse y reanudarse en hilos distintos, los valores escritos antes de la suspensión siguen estando disponibles en la misma corutina al reanudarse.",
  },
  61: { text: "El despachador trabaja junto con el alcance para definir cuándo y dónde se ejecutan las corutinas. El alcance controla el ciclo de vida; el despachador controla qué hilos se usan." },
  62: {
    content: "No tienes que especificar un despachador para cada corutina. Por defecto heredan el despachador del alcance padre. Puedes especificar un despachador para ejecutar una corutina en otro contexto.",
  },
  63: { text: "Si el contexto no incluye un despachador, las constructoras usan Dispatchers.Default." },
  64: { text: "La biblioteca kotlinx.coroutines incluye distintos despachadores. Por ejemplo, Dispatchers.Default ejecuta corutinas en un pool de hilos compartido, ideal para operaciones que usan mucho la CPU." },
  65: { text: "Para especificar un despachador en una constructora como CoroutineScope.launch(), pásalo como argumento:" },
  66: { text: "También puedes usar un bloque withContext() para ejecutar todo su código en un despachador concreto:" },
  67: { text: "Para más información sobre despachadores, incluyendo Dispatchers.IO y Dispatchers.Main, ver Contexto de corutinas y despachadores." },
  68: { text: "Comparar corutinas e hilos JVM" },
  69: { text: "Las corutinas son cálculos suspendibles que ejecutan código de forma concurrente como los hilos en la JVM, pero funcionan de forma distinta." },
  70: { text: "Un hilo lo gestiona el sistema operativo. Los hilos pueden ejecutar tareas en paralelo en varios núcleos. Crear un hilo implica asignar memoria para su pila. Los hilos son potentes pero costosos en recursos." },
  71: { text: "Una corutina no está ligada a un hilo concreto. Puede suspenderse en un hilo y reanudarse en otro, así que muchas corutinas pueden compartir el mismo pool. Cuando una corutina se suspende, el hilo no queda bloqueado. Esto hace que las corutinas sean mucho más ligeras que los hilos." },
  72: { text: "Comparación de corutinas e hilos" },
  73: { text: "Ejemplo: 50.000 corutinas esperando 5 segundos y luego imprimiendo un punto (.):" },
  74: { text: "La misma idea con hilos JVM:" },
  75: { text: "La versión con hilos usa mucha más memoria porque cada hilo necesita su propia pila. Para 50.000 hilos puede ser hasta 100 GB, frente a unos 500 MB para el mismo número de corutinas." },
  76: { text: "Según el SO, la versión JDK y la configuración, la versión con hilos puede lanzar un error de memoria o ralentizar la creación de hilos." },
  77: { text: "Qué sigue" },
  78: { text: "Descubre más sobre cómo combinar funciones de suspensión en Componer funciones de suspensión." },
  79: { text: "Aprende a cancelar corutinas y manejar tiempos de espera en Cancelación y tiempos de espera." },
  80: { text: "Profundiza en la ejecución y los hilos en Contexto de corutinas y despachadores." },
  81: { text: "Aprende a devolver múltiples valores calculados de forma asíncrona en Flujos asíncronos." },
};

// ----- Coroutines and channels (Spanish overrides) -----
const COROUTINES_CHANNELS_TOC_ES: DocTocItem[] = [
  { id: "before-you-start", label: "Antes de empezar" },
  { id: "run-the-code", label: "Ejecutar el código" },
  { id: "blocking-requests", label: "Peticiones bloqueantes" },
  { id: "task-1", label: "Tarea 1" },
  { id: "solution-task-1", label: "Solución de la tarea 1" },
  { id: "callbacks", label: "Callbacks" },
  { id: "background-thread", label: "Usar un hilo en segundo plano" },
  { id: "task-2", label: "Tarea 2" },
  { id: "solution-task-2", label: "Solución de la tarea 2" },
  { id: "retrofit-callback-api", label: "Usar la API de callbacks de Retrofit" },
  { id: "suspending-functions", label: "Funciones de suspensión" },
  { id: "coroutines", label: "Corutinas" },
  { id: "concurrency", label: "Concurrencia" },
  { id: "structured-concurrency", label: "Concurrencia estructurada" },
  { id: "showing-progress", label: "Mostrar progreso" },
  { id: "channels", label: "Canales" },
  { id: "task-7", label: "Tarea 7" },
];

/** Spanish overrides for coroutines and channels blocks. */
const COROUTINES_CHANNELS_BLOCKS_ES: Record<number, Partial<DocBlock>> = {
  0: { text: "Tutorial de corutinas y canales" },
  1: {
    text: "En este tutorial aprenderás a usar corutinas en IntelliJ IDEA para hacer peticiones de red sin bloquear el hilo subyacente ni usar callbacks.",
  },
  2: {
    content: "No se requieren conocimientos previos de corutinas, pero se espera que estés familiarizado con la sintaxis básica de Kotlin.",
  },
  3: { text: "Aprenderás:" },
  4: {
    items: [
      "Por qué y cómo usar funciones de suspensión para peticiones de red.",
      "Cómo enviar peticiones de forma concurrente con corutinas.",
      "Cómo compartir información entre corutinas usando canales.",
    ],
  },
  5: {
    text: "Para las peticiones de red necesitarás la biblioteca Retrofit; el enfoque de este tutorial sirve también para otras bibliotecas que soporten corutinas.",
  },
  6: {
    content: "Puedes encontrar las soluciones de todas las tareas en la rama solutions del repositorio del proyecto.",
  },
  7: { text: "Antes de empezar" },
  8: {
    text: "Descarga e instala la última versión de IntelliJ IDEA, clona la plantilla del proyecto (intro-coroutines) y genera un token de GitHub para la API: indica un nombre (p. ej. coroutines-tutorial), no selecciones alcances, haz clic en Generate token y cópialo.",
  },
  9: { alt: "Generar un nuevo token de GitHub" },
  10: { text: "Ejecutar el código" },
  11: {
    text: "El programa carga los colaboradores de todos los repositorios de la organización indicada (por defecto \"kotlin\"). Más adelante añadirás la lógica para ordenar a los usuarios por número de contribuciones.",
  },
  12: {
    text: "Abre el archivo src/contributors/main.kt y ejecuta la función main(). Verás la siguiente ventana:",
  },
  13: { alt: "Ventana de GitHub Contributors" },
  14: {
    text: "Si la fuente es demasiado pequeña, ajústala cambiando setDefaultFontSize(18f) en la función main().",
  },
  15: { text: "Introduce tu usuario y token (o contraseña) de GitHub en los campos correspondientes." },
  16: { text: "Asegúrate de que la opción BLOCKING esté seleccionada en el menú Variant." },
  17: {
    text: "Haz clic en Load contributors. La interfaz se congelará un momento y luego mostrará la lista de colaboradores.",
  },
  18: {
    text: "Abre la salida del programa para comprobar que se han cargado los datos. La lista de colaboradores se registra tras cada petición correcta.",
  },
  19: { text: "Peticiones bloqueantes" },
  20: {
    text: "Hay varias formas de implementar esta lógica: con peticiones bloqueantes o con callbacks. Compararás estas soluciones con una basada en corutinas y verás cómo usar canales para compartir información entre corutinas.",
  },
  21: {
    text: "Usarás la biblioteca Retrofit para hacer peticiones HTTP a GitHub: lista de repositorios de una organización y lista de colaboradores por repositorio.",
  },
  22: {
    text: "Esta API la usa la función loadContributorsBlocking() para obtener la lista de colaboradores de la organización.",
  },
  // More indices can be added; rest fall back to English
};

// ----- Getters -----

export function getCoroutinesBasicsDoc(locale: Locale): { toc: DocTocItem[]; blocks: DocBlock[] } {
  if (locale !== "es") {
    return { toc: COROUTINES_BASICS_TOC, blocks: COROUTINES_BASICS_BLOCKS };
  }
  const blocks: DocBlock[] = COROUTINES_BASICS_BLOCKS.map((b, i) => {
    const over = COROUTINES_BASICS_BLOCKS_ES[i];
    if (!over || Object.keys(over).length === 0) return b;
    return { ...b, ...over } as DocBlock;
  });
  return { toc: COROUTINES_BASICS_TOC_ES, blocks };
}

export function getCoroutinesChannelsDoc(locale: Locale): { toc: DocTocItem[]; blocks: DocBlock[] } {
  if (locale !== "es") {
    return { toc: COROUTINES_CHANNELS_TOC, blocks: COROUTINES_CHANNELS_BLOCKS };
  }
  const blocks: DocBlock[] = COROUTINES_CHANNELS_BLOCKS.map((b, i) => {
    const over = COROUTINES_CHANNELS_BLOCKS_ES[i];
    if (!over || Object.keys(over).length === 0) return b;
    return { ...b, ...over } as DocBlock;
  });
  return { toc: COROUTINES_CHANNELS_TOC_ES, blocks };
}

/** Kotlin lesson Spanish overrides: id -> { title?, content?, practice? }. All lesson routes support Spanish (title at minimum). */
const KOTLIN_LESSONS_ES: Record<string, { title?: string; content?: KotlinLesson["content"]; practice?: { title?: string; description?: string }[] }> = {
  "hello-world": {
    title: "Hola mundo",
    content: [
      "Aquí tienes un programa simple que imprime \"¡Hola, mundo!\":",
      "En Kotlin, fun declara una función. La función main() es el punto de entrada. El cuerpo va entre llaves {}. println() y print() escriben en la salida estándar.",
      "Una función es un conjunto de instrucciones que realiza una tarea. Puedes reutilizarla cuando la necesites.",
      "Variables — Los programas necesitan almacenar datos. En Kotlin, val para solo lectura y var para mutable. No puedes cambiar un val. Usa el operador = para asignar.",
      "Se recomienda declarar todas las variables como val. Usa var solo cuando sea necesario.",
      "Plantillas de cadenas — Usa expresiones con $ para acceder a variables. Las cadenas van entre comillas \". Para evaluar código en una plantilla usa ${}.",
    ],
  },
  "basic-types": {
    title: "Tipos básicos",
    content: [
      "Cada variable y estructura de datos en Kotlin tiene un tipo. Los tipos indican al compilador qué puedes hacer con esa variable. La capacidad de Kotlin de inferir el tipo se llama inferencia de tipos.",
      "Tipos básicos: Enteros (Byte, Short, Int, Long), Enteros sin signo (UByte, UShort, UInt, ULong), Punto flotante (Float, Double), Booleanos (Boolean), Caracteres (Char), Cadenas (String).",
      "+=, -=, *=, /= y %= son operadores de asignación aumentada.",
      "Para declarar una variable sin inicializarla, especifica su tipo con :. Kotlin puede manejarlo siempre que las variables se inicialicen antes de la primera lectura.",
    ],
    practice: [{ title: "Ejercicio", description: "Declara una variable Int year con valor 2024 y una variable Double price con valor 19.99. Imprime ambas usando plantillas de cadenas." }],
  },
  "collections": {
    title: "Colecciones",
    content: [
      "Kotlin ofrece colecciones para agrupar datos: Listas (ordenadas, permiten duplicados), Conjuntos (sin orden, elementos únicos), Mapas (pares clave-valor con claves únicas).",
      "Lista: listOf() para solo lectura, mutableListOf() para mutable. Usa [] para acceso por índice, .first(), .last(), .count(), operador in, .add(), .remove().",
      "Conjunto: setOf() para solo lectura, mutableSetOf() para mutable. Los elementos duplicados se eliminan. Usa .count(), operador in, .add(), .remove().",
      "Mapa: mapOf() y mutableMapOf(). Usa \"clave\" to valor. Acceso con [], añadir con juiceMenu[\"coco\"] = 150. Usa .count(), .containsKey(), .keys, .values.",
    ],
    practice: [
      { title: "Ejercicio 1", description: "Tienes una lista de números \"verdes\" y una de \"rojos\". Imprime cuántos números hay en total." },
      { title: "Ejercicio 2", description: "Tienes un conjunto de protocolos soportados por tu servidor. Un usuario solicita un protocolo. Comprueba si está soportado. isSupported debe ser Boolean. Imprime: \"Soporte para {requested}: {isSupported}\"." },
      { title: "Ejercicio 3", description: "Define un mapa que relacione los números 1 a 3 con su escritura (1->\"one\", 2->\"two\", 3->\"three\"). Úsalo para escribir el número n = 2." },
    ],
  },
  "control-flow": {
    title: "Flujo de control",
    content: [
      "Como otros lenguajes, Kotlin puede tomar decisiones según si una expresión se evalúa a true. Esas expresiones se llaman expresiones condicionales. Kotlin también puede crear y recorrer bucles.",
      "Expresiones condicionales — Kotlin ofrece if y when. Si tienes que elegir, recomendamos when porque: facilita la lectura, es más fácil añadir ramas y reduce errores.",
      "If — La condición va entre paréntesis () y la acción entre llaves {}. No hay operador ternario en Kotlin; if puede usarse como expresión. Con una línea por acción, las llaves son opcionales.",
      "When — Usa when para varias ramas. El valor va en (), las ramas en {}, usa -> para separar condición de acción. when puede ser sentencia o expresión. when con sujeto hace el código más legible y ayuda a Kotlin a comprobar que se cubren todos los casos.",
      "Rangos — Usa .. para inclusivo (1..4 = 1,2,3,4), ..< para final exclusivo (1..<4 = 1,2,3), downTo para inverso (4 downTo 1), step para incremento (1..5 step 2 = 1,3,5). También con Char.",
      "Bucles — for recorre un rango o colección. while se ejecuta mientras la condición sea true. do-while se ejecuta al menos una vez y luego comprueba la condición.",
    ],
    practice: [
      { title: "Condicional: Juego de dados", description: "Crea un juego en el que ganas si dos dados muestran el mismo número. Lee dos enteros de stdin (uno por línea). Usa if para imprimir \"You win :)\" si coinciden o \"You lose :(\" si no." },
      { title: "Condicional: Acciones de botones", description: "Con when, imprime la acción de cada botón. Lee el botón de stdin. A->Yes, B->No, X->Menu, Y->Nothing, otro->\"There is no such button\"." },
      { title: "Bucles: Porciones de pizza (while)", description: "Refactoriza el programa de pizza con while. Cuenta porciones hasta 8, imprimiendo cada paso. Línea final: \"There are 8 slices of pizza. Hooray! We have a whole pizza! :D\"." },
      { title: "Bucles: Fizz buzz", description: "Imprime números del 1 al 100. Sustituye divisible por 3 por \"fizz\", por 5 por \"buzz\", por ambos por \"fizzbuzz\"." },
      { title: "Bucles: Palabras que empiezan por l", description: "Usa for e if para imprimir solo las palabras que empiezan por la letra l de la lista." },
    ],
  },
  "functions": {
    title: "Funciones",
    content: [
      "Puedes declarar funciones en Kotlin con la palabra clave fun. Los parámetros van en (), cada uno con tipo. El tipo de retorno va después de () con :. Cuerpo en {}. Usa return para salir o devolver un valor. Omite el tipo de retorno y return para Unit.",
      "Argumentos nombrados — Al llamar a una función puedes usar los nombres de los parámetros. Con argumentos nombrados, el orden puede ser cualquiera.",
      "Valores por defecto — Usa = después del tipo para dar un valor por defecto. Los llamadores pueden omitir parámetros con valor por defecto. Tras el primero omitido, nombra el resto.",
      "Funciones sin retorno — Si una función no devuelve un valor útil, su tipo es Unit. No hace falta declarar Unit ni usar return.",
      "Funciones de expresión única — Quita {} y usa = para el cuerpo. Kotlin infiere el tipo de retorno. Ejemplo: fun sum(x: Int, y: Int) = x + y",
      "Retornos anticipados — Usa return para salir de la función cuando se cumpla una condición.",
      "Expresiones lambda — Funciones anónimas concisas. Sintaxis: { params -> body }. Úsalas con .filter(), .map(), etc. Tipos de función: (ParamType) -> ReturnType. Las lambdas finales pueden ir fuera de ().",
    ],
    practice: [
      { title: "Ejercicio 1: circleArea", description: "Escribe una función circleArea que reciba radius (Int) y devuelva el área. Usa kotlin.math.PI. Imprime circleArea(2)." },
      { title: "Ejercicio 2: circleArea expresión única", description: "Reescribe circleArea como función de expresión única." },
      { title: "Ejercicio 3: intervalInSeconds con valores por defecto", description: "Añade valores por defecto (hours=0, minutes=0, seconds=0) y usa argumentos nombrados para que las llamadas sean más legibles." },
      { title: "Lambda: Construir URLs", description: "Usa una lambda (p. ej. con .map) para crear URLs: prefix + \"/\" + id + \"/\" + action para cada action." },
      { title: "Lambda: repeatN", description: "Escribe repeatN(n: Int, action: () -> Unit) que ejecute action n veces. Úsala para imprimir \"Hello\" 5 veces." },
    ],
  },
  "classes": {
    title: "Clases",
    content: [
      "Kotlin soporta programación orientada a objetos con clases y objetos. Los objetos almacenan datos; las clases declaran características. Crea objetos a partir de clases para no repetir declaraciones.",
      "Propiedades — Decláralas entre paréntesis () tras el nombre de la clase o en el cuerpo {}. Usa val para solo lectura, var para mutable. Las propiedades en () sin val/var no son accesibles tras la creación.",
      "Crear instancia — Usa el constructor. Kotlin crea uno automáticamente a partir de los parámetros del encabezado.",
      "Acceder a propiedades — instancia.propiedad. Usa plantillas de cadenas: ${instancia.propiedad}.",
      "Funciones miembro — Define el comportamiento dentro del cuerpo de la clase. Llama con instancia.nombreFunción().",
      "Clases de datos — Usa la palabra clave data. Obtienes automáticamente toString(), equals()/==, copy(). Útil para almacenar datos sin código repetitivo.",
      "copy() — Crea una copia, opcionalmente con propiedades distintas. Más seguro que modificar el original.",
    ],
    practice: [
      { title: "Ejercicio 1: Clase de datos Employee", description: "Define una clase de datos Employee con name (val) y salary (var). main crea una, la imprime, suma 10 al salary e imprime de nuevo." },
      { title: "Ejercicio 2: Person, Name, Address, City", description: "Declara las clases de datos Name(firstName, lastName), Address(street, city) y City(name, country) para que Person compile. Añade println(person) al final de main." },
      { title: "Ejercicio 3: RandomEmployeeGenerator", description: "Define la clase RandomEmployeeGenerator con var minSalary, var maxSalary en el encabezado, y lista names + generateEmployee() en el cuerpo. Usa Random.nextInt(from, until) y names.random()." },
    ],
  },
  "null-safety": {
    title: "Seguridad nula",
    content: [
      "Kotlin permite valores nulos cuando algo falta o no está definido. La seguridad nula detecta posibles problemas en tiempo de compilación.",
      "Tipos anulables — Por defecto los tipos no aceptan null. Añade ? tras el tipo para hacerlo anulable: String?.",
      "Comprobar null — Usa expresiones condicionales: if (maybeString != null && maybeString.length > 0).",
      "Operador de llamada segura ?. — Accede de forma segura a propiedades o funciones en objetos posiblemente nulos. Devuelve null si el objeto es null. Encadena: person.company?.address?.country.",
      "Operador Elvis ?: — Proporciona un valor por defecto cuando se detecta null. Lado izquierdo = qué comprobar, derecho = valor por defecto. Ejemplo: nullable?.length ?: 0",
    ],
    practice: [{ title: "Ejercicio: salaryById", description: "Escribe salaryById(id: Int) que devuelva el salario del empleado para ese id, o 0 si el empleado es null. Usa employeeById(id)?.salary ?: 0" }],
  },
  "extension-functions": {
    title: "Funciones de extensión",
    content: [
      "En este capítulo verás funciones especiales de Kotlin que hacen el código más conciso y legible.",
      "A menudo necesitas modificar el comportamiento de un programa sin cambiar el código original. Por ejemplo, añadir funcionalidad a una clase de una biblioteca externa.",
      "Puedes hacerlo con funciones de extensión. Las llamas igual que las funciones miembro, usando un punto .",
      "El receptor es aquello sobre lo que se llama la función. Es decir, con qué o dónde se comparte la información.",
      "Para crear una función de extensión, escribe el nombre de la clase que quieres extender seguido de . y el nombre de tu función. Sigue con el resto de la declaración. El receptor se accede en el cuerpo con this.",
      "Puedes definir funciones de extensión en cualquier sitio, lo que permite diseños orientados a extensiones y separar la funcionalidad central de las características secundarias.",
    ],
  },
  "scope-functions": {
    title: "Funciones de alcance",
    content: [
      "Las funciones de alcance (let, run, with, apply, also) ejecutan un bloque en el contexto de un objeto. Cada una usa el receptor (this o it) de forma distinta.",
      "let — Usa it como nombre del receptor. Útil para llamadas encadenadas o cuando el receptor puede ser null. Devuelve el resultado del lambda.",
      "run — Ejecuta en el receptor como this. Devuelve el resultado del lambda. Útil para inicialización y cómputos.",
      "with — No es una función de extensión; recibe el objeto como argumento. with(obj) { ... }.",
      "apply — Ejecuta en el receptor como this. Devuelve el propio receptor. Ideal para configurar propiedades: obj.apply { prop = value }.",
      "also — Recibe el objeto como it. Devuelve el receptor. Útil para efectos secundarios o logging sin cambiar el objeto.",
    ],
  },
  "lambda-expressions-with-receiver": {
    title: "Expresiones lambda con receptor",
    content: [
      "Una lambda con receptor tiene un objeto receptor (this) dentro del bloque. La sintaxis es Tipo.() -> Retorno. Útil para DSLs y funciones de extensión que aceptan lambdas.",
    ],
  },
  "classes-and-interfaces": {
    title: "Clases e interfaces",
    content: [
      "Las interfaces declaran contratos sin implementación. Las clases las implementan con override. Puedes tener propiedades abstractas y funciones con implementación por defecto en interfaces.",
    ],
  },
  "objects": {
    title: "Objetos",
    content: [
      "object declara un singleton: una única instancia con nombre. object : Interface implementa interfaces. Los companion object viven dentro de una clase y dan miembros estáticos (factory, constantes).",
    ],
  },
  "open-and-special-classes": {
    title: "Clases abiertas y especiales",
    content: [
      "Por defecto las clases son final. Marca una clase con open para permitir herencia. Las sealed class restringen las subclases a un conjunto conocido; útiles para modelar estados o expresiones.",
    ],
  },
  "properties": {
    title: "Propiedades",
    content: [
      "Las propiedades pueden tener getters y setters personalizados. Usa field en el setter para acceder al valor de respaldo. Las propiedades delegadas (by lazy, by Delegates.observable) reutilizan lógica de acceso.",
    ],
  },
  "null-safety-patterns": {
    title: "Patrones de seguridad nula",
    content: [
      "Patrones para trabajar con tipos anulables: comprobaciones inteligentes (smart casts), let para ejecutar solo si no es null, requireNotNull y checkNotNull para aserciones en tiempo de ejecución.",
    ],
  },
  "libraries-and-apis": {
    title: "Bibliotecas y APIs",
    content: [
      "Kotlin puede llamar a código Java y viceversa. Las anotaciones @JvmStatic, @JvmOverloads y @JvmField ayudan a la interoperabilidad. Usa bibliotecas del ecosistema (Gradle, Maven) para añadir dependencias.",
    ],
  },
  "coroutines-basics": { title: "Conceptos básicos de corutinas" },
  "coroutines-and-channels": { title: "Corutinas y canales - tutorial" },
  "cancellation-and-timeouts": {
    title: "Cancelación y tiempos de espera",
    content: [
      "La cancelación permite detener una corutina antes de que termine. Usa el Job devuelto por launch o async para cancelar.",
      "La cancelación es cooperativa: la corutina debe comprobar la cancelación en puntos de suspensión o con isActive / ensureActive().",
      "withTimeoutOrNull(timeout) ejecuta un bloque con un tiempo límite; devuelve null si se supera el tiempo.",
    ],
  },
  "composing-suspending-functions": {
    title: "Componer funciones de suspensión",
    content: [
      "Esta sección cubre distintas formas de componer funciones de suspensión.",
      "Secuencial por defecto: Si necesitas que dos funciones de suspensión se ejecuten una tras otra (p. ej. usando el resultado de la primera para llamar a la segunda), usa invocación secuencial normal. El código en una corutina es secuencial por defecto. Usa measureTimeMillis { } para ver que ambas llamadas se suman (p. ej. ~2017 ms para dos retardos de 1 segundo).",
      "Concurrencia con async: Cuando no hay dependencias entre las dos llamadas y quieres la respuesta más rápido, usa async. Como launch, async inicia una corutina que se ejecuta en paralelo. La diferencia: launch devuelve un Job sin resultado; async devuelve un Deferred, un futuro no bloqueante. Usa .await() en el Deferred para obtener el resultado. Deferred también es un Job, así que puedes cancelarlo. Con dos llamadas async, el tiempo total es el de un retardo (~1017 ms). La concurrencia con corutinas es siempre explícita.",
      "Async con inicio perezoso: Pon el parámetro start en CoroutineStart.LAZY para que la corutina solo empiece cuando se necesite su resultado con await() o cuando se llame a Job.start(). Úsalo cuando quieras controlar cuándo empieza cada corutina. Si solo llamas a await() sin start(), las corutinas se ejecutan secuencialmente (await inicia y espera). El caso de uso de async(start = CoroutineStart.LAZY) es sustituir la función lazy estándar cuando el cálculo implica funciones de suspensión.",
      "Funciones estilo async: Definir funciones xxxAsync() que usan GlobalScope.async y devuelven Deferred es un estilo de otros lenguajes pero no recomendado en Kotlin. Esas funciones no son de suspensión y pueden llamarse desde cualquier sitio, pero renuncian a la concurrencia estructurada. Si el llamador lanza antes de hacer await, el trabajo en segundo plano sigue sin poder cancelarse. Debes usar @OptIn(DelicateCoroutinesApi::class) para GlobalScope.",
      "Concurrencia estructurada con async: Refactoriza el trabajo concurrente en una función de suspensión que use coroutineScope { }. Dentro, usa async para cada parte y espera los resultados. Si la función lanza, se cancelan todas las corutinas del alcance. Así se mantienen la cancelación y la propagación de fallos.",
      "La cancelación se propaga siempre por la jerarquía: Si un async hijo lanza (p. ej. ArithmeticException), el otro hijo se cancela y la excepción se reporta al llamador. Verás ejecutarse el bloque finally del primer hijo (p. ej. \"First child was cancelled\") y luego el mensaje de la excepción.",
    ],
  },
  "coroutine-context-and-dispatchers": {
    title: "Contexto de corutinas y despachadores",
    content: [
      "Las corutinas se ejecutan en un CoroutineContext (Job, Dispatcher). Dispatchers.Default, IO, Main y Unconfined determinan en qué hilo(s) se ejecuta el código. Usa withContext para cambiar de despachador de forma suspendida.",
    ],
  },
  "asynchronous-flow": {
    title: "Flujo asíncrono",
    content: [
      "Flow es un tipo que emite múltiples valores de forma asíncrona. Es cold: no hace nada hasta que se collect. Usa flow { }, map, filter, y operadores como collect, toList. Útil para streams de datos o eventos.",
    ],
  },
  "channels": {
    title: "Canales",
    content: [
      "Los canales permiten enviar valores entre corutinas. Channel puede ser rendezvous, buffered o unlimited. send() y receive() son suspendidos. Varias corutinas pueden enviar o recibir en el mismo canal.",
    ],
  },
  "coroutine-exception-handling": {
    title: "Manejo de excepciones en corutinas",
    content: [
      "Las excepciones no capturadas en una corutina pueden propagarse al padre o al CoroutineExceptionHandler. Usa try/catch alrededor de launch/async o un handler. En coroutineScope, un hijo que falla cancela a los hermanos.",
    ],
  },
  "shared-mutable-state-and-concurrency": {
    title: "Estado mutable compartido y concurrencia",
    content: [
      "Compartir estado mutable entre corutinas puede provocar condiciones de carrera. Usa mutex, atomic types o canales para sincronizar. Las variables @Volatile y AtomicReference son opciones de bajo nivel.",
    ],
  },
  "select-expression": {
    title: "Expresión select",
    content: [
      "select permite esperar a la primera de varias operaciones suspendidas (varios Deferred o Channel). Útil para timeouts, elegir el primer resultado disponible o combinar múltiples fuentes de datos.",
    ],
  },
  "debug-coroutines-intellij": {
    title: "Depurar corutinas en IntelliJ",
    content: [
      "El depurador de corutinas del plugin de Kotlin en IntelliJ IDEA muestra las corutinas activas y suspendidas en la pestaña Coroutines. Usa la opción -Dkotlinx.coroutines.debug para ver nombres en los logs.",
    ],
  },
  "debug-kotlin-flow-intellij": {
    title: "Depurar Kotlin Flow en IntelliJ",
    content: [
      "Puedes inspeccionar el flujo de datos en un Flow usando puntos de ruptura y la vista de depuración. El plugin de Kotlin ofrece soporte para seguir las emisiones y los operadores.",
    ],
  },
};

export function getKotlinLessonForLocale(locale: Locale, id: string): KotlinLesson | undefined {
  const lesson = getKotlinLessonById(id);
  if (!lesson) return undefined;
  if (locale !== "es") return lesson;
  const t = KOTLIN_LESSONS_ES[id];
  if (!t) return lesson;
  const practice =
    t.practice && lesson.practice
      ? lesson.practice.map((p, i) => ({
          ...p,
          title: t.practice![i]?.title ?? p.title,
          description: t.practice![i]?.description ?? p.description,
        }))
      : lesson.practice;
  return {
    ...lesson,
    title: t.title ?? lesson.title,
    content: t.content ?? lesson.content,
    practice,
  };
}

/** React lesson Spanish overrides: id -> { title?, content?, sections? }. All React lesson routes support Spanish. */
const REACT_LESSONS_ES: Record<
  string,
  { title?: string; content?: string[]; sections?: { title?: string; body?: string }[] }
> = {
  "react-1": {
    title: "React 1: Tu primer componente",
    content: [
      "Un componente es una función que devuelve JSX. Usa App y export default App como raíz.",
      "Crea un componente AppHeader que devuelva un h1 con el título. Úsalo en App con <AppHeader />.",
    ],
    sections: [
      { title: "¿Qué es un componente?", body: "En React, la interfaz se construye con **componentes**: funciones que devuelven **JSX**. Cada app tiene un componente raíz, normalmente `App`. Los componentes son bloques reutilizables." },
      { title: "Crea tu primer componente", body: "Crea un componente **AppHeader** que devuelva un `<h1>` con el texto \"Dashboard\". En **App**, renderízalo con `<AppHeader />` y mantén `export default App`." },
    ],
  },
  "react-2": {
    title: "React 2: Props",
    content: [
      "Los componentes pueden recibir props (propiedades). Las props permiten pasar datos al componente.",
      "Crea un componente UserGreeting que reciba la prop name y muestre '¡Hola, {name}!'. Úsalo en App con <UserGreeting name=\"Alex\" />.",
    ],
    sections: [
      { title: "Pasar datos con props", body: "Las **props** son entradas que pasas a un componente. Son de solo lectura y permiten que el padre personalice lo que renderiza el hijo. Usa desestructuración: `function UserCard({ name }) { ... }`." },
      { title: "Tu turno", body: "Crea **UserGreeting** que reciba la prop **name** y muestre \"¡Hola, {name}!\" en un encabezado o párrafo. Úsalo en **App** con `<UserGreeting name=\"Alex\" />` y `export default App`." },
    ],
  },
  "react-3": {
    title: "React 3: JSX y anidación",
    content: [
      "En React usamos JSX para describir la interfaz. Puedes anidar elementos dentro de divs y fragmentos.",
      "Crea un componente Card que devuelva un div con un título y un párrafo. Úsalo en App.",
    ],
    sections: [
      { title: "JSX y anidación", body: "**JSX** se parece a HTML pero vive en JavaScript. Envuelve varios elementos en un padre (p. ej. `<div>`) o en un Fragment. Usa paréntesis para return multilínea." },
      { title: "Tu turno", body: "Crea un componente **Card** que devuelva un `<div>` con un encabezado y un `<p>` dentro (el texto que quieras). Úsalo en **App** con `<Card />` y `export default App`." },
    ],
  },
  "react-4": {
    title: "React 4: Múltiples props",
    content: [
      "Los componentes pueden recibir varias props. Desestructúralas en la lista de parámetros.",
      "Crea un componente ProductRow que reciba name y price y los muestre. Úsalo en App con <ProductRow name=\"Widget\" price=\"$9.99\" />.",
    ],
    sections: [
      { title: "Múltiples props", body: "Desestructura varias props a la vez: `function Row({ name, price }) { ... }`. Pásalas al usar el componente: `<Row name=\"Widget\" price=\"$9.99\" />`." },
      { title: "Tu turno", body: "Crea **ProductRow** que reciba **name** y **price** y muestre \"{name} — {price}\". Úsalo en **App**: `<ProductRow name=\"Widget\" price=\"$9.99\" />` y `export default App`." },
    ],
  },
  "react-5": {
    title: "Composición I: Componentes dentro de componentes",
    content: [
      "**Composición** es poner componentes dentro de otros. Crea Title, Body y Card que los use con JSX.",
      "Crea Title, Body y Card. Card debe renderizar <Title /> y <Body /> dentro de un div. App renderiza <Card /> y export default App.",
    ],
    sections: [
      { title: "Composición", body: "**Composición** significa construir la UI con componentes más pequeños. Un componente puede renderizar otros. Mantén los componentes enfocados: un `Card` puede usar `Title` y `Body`." },
      { title: "Tu turno", body: "Crea **Title**, **Body** y **Card**. **Card** debe renderizar `<Title />` y `<Body />` dentro de un `<div>`. Usa **App** para renderizar `<Card />` y mantén `export default App`." },
    ],
  },
  "react-6": {
    title: "Composición II: Pasar props al componer",
    content: [
      "Al componer, el **padre** pasa props a los **hijos**. Crea Greeting que reciba name y Page que use <Greeting name=\"Alex\" />.",
      "Crea Greeting({ name }) que muestre '¡Hola, {name}!'. Crea Page que renderice <Greeting name=\"Alex\" /> y un párrafo. App usa <Page /> y export default App.",
    ],
    sections: [
      { title: "Props al componer", body: "Al **componer** componentes, el **padre** pasa **props** a los hijos. El hijo las recibe (p. ej. `Greeting({ name })`) y el padre pasa valores: `<Greeting name=\"Alex\" />`." },
      { title: "Tu turno", body: "Crea **Greeting** que reciba la prop **name** y muestre \"¡Hola, {name}!\" en un encabezado. Crea **Page** que renderice `<Greeting name=\"Alex\" />` y un `<p>`. Usa **App** para renderizar `<Page />` y mantén `export default App`." },
    ],
  },
  "react-7": {
    title: "React 5: className",
    content: [
      "Usa **className** en JSX (en lugar de 'class') para dar estilo a los componentes.",
      "Crea un componente Highlight con un div que tenga className=\"highlight\" y muestre \"Mensaje importante\". Úsalo en App con <Highlight /> y export default App.",
    ],
    sections: [
      { title: "className en JSX", body: "En JSX usas **className** en lugar de `class` de HTML (reservado en JavaScript). Pasa un string: `className=\"my-box\"` o `className={dynamicValue}`." },
      { title: "Tu turno", body: "Crea un componente **Highlight** que devuelva un `<div>` con `className=\"highlight\"` y el texto \"Mensaje importante\". Úsalo en **App** con `<Highlight />` y `export default App`." },
    ],
  },
  "react-8": {
    title: "React 6: Estilos en línea",
    content: [
      "Los componentes pueden tener **estilos en línea** con objetos JavaScript. Usa style={{ color: 'pink', fontSize: '20px' }}.",
      "Crea un componente StatusBadge con un span con style={{ color: '#22c55e', fontWeight: 'bold' }} y el texto \"Active\". Úsalo en App con <StatusBadge /> y export default App.",
    ],
    sections: [
      { title: "Estilos en línea", body: "Pasa un **objeto JavaScript** a la prop `style`. Usa camelCase: `fontSize`, no `font-size`. Los valores son strings (p. ej. '20px') o números para props sin unidad." },
      { title: "Tu turno", body: "Crea **StatusBadge** que devuelva un `<span>` con `style={{ color: '#22c55e', fontWeight: 'bold' }}` y el texto \"Active\". Úsalo en **App** con `<StatusBadge />` y `export default App`." },
    ],
  },
  "react-9": {
    title: "React 7: Listas con map",
    content: [
      "Puedes usar **arrays** en JSX para renderizar listas. Usa map para transformar cada elemento en JSX. Proporciona siempre una prop **key** única.",
      "Crea un componente ItemList que muestre una lista con map. Usa items = ['React', 'TypeScript', 'Node'] y {items.map(...)} con key único. Úsalo en App con <ItemList /> y export default App.",
    ],
    sections: [
      { title: "Renderizar listas", body: "Usa **map** para convertir un array en JSX. Cada elemento de nivel superior debe tener una prop **key** (única y estable) para que React rastree los elementos correctamente." },
      { title: "Tu turno", body: "Crea **ItemList** con `items = ['React', 'TypeScript', 'Node']` y renderiza un `<ul>` de `<li>` con `items.map(...)`. Da a cada `<li>` un `key={item}`. Usa **App** para renderizar `<ItemList />` y `export default App`." },
    ],
  },
  "react-10": {
    title: "React 8: Condicionales en JSX",
    content: [
      "Los componentes pueden usar **condicionales** con && o ? :. Renderiza contenido distinto según props o estado.",
      "Crea un componente StatusMessage que reciba la prop online (boolean). Si es true muestra \"You are online\"; si no, \"You are offline\". Úsalo en App: <StatusMessage online={true} /> y export default App.",
    ],
    sections: [
      { title: "Condicionales en JSX", body: "Usa el **ternario** `condition ? a : b` o el **short-circuit** `condition && <JSX />` para renderizar contenido distinto. Mantén las expresiones legibles; para lógica compleja usa una variable." },
      { title: "Tu turno", body: "Crea **StatusMessage** que reciba la prop **online**. Si `online` es true muestra \"You are online\"; si no \"You are offline\". Úsalo en **App** con `<StatusMessage online={true} />` y `export default App`." },
    ],
  },
  "react-11": {
    title: "React 9: useState",
    content: [
      "**useState** es un hook que recuerda valores. El componente se vuelve a renderizar cuando el estado cambia.",
      "Crea un componente Counter que use useState para un contador. Usa const [count, setCount] = useState(0) y un botón que incremente el contador al hacer clic.",
    ],
    sections: [
      { title: "useState", body: "**useState(initial)** devuelve `[value, setValue]`. Llama a **setValue** para actualizar; React vuelve a renderizar. No mutes el estado directamente; usa siempre el setter." },
      { title: "Tu turno", body: "Crea **Counter** con `const [count, setCount] = useState(0)`. Renderiza el contador y un botón que llame a `setCount(count + 1)` al hacer clic. Usa **App** para renderizar `<Counter />` y `export default App`." },
    ],
  },
  "react-12": {
    title: "React 10: Eventos (onClick)",
    content: [
      "Los componentes pueden tener **eventos** como onClick. Pasa una función (no una llamada). Usa un manejador como handleClick para claridad.",
      "Crea un componente ActionButton con un botón que tenga onClick y muestre un alert \"Clicked!\" al hacer clic. Úsalo en App con <ActionButton /> y export default App.",
    ],
    sections: [
      { title: "Manejadores de eventos", body: "Pasa una **función** a `onClick` (p. ej. `onClick={handleClick}`). No la invoques: `onClick={handleClick()}` se ejecutaría en cada render. Usa funciones flecha para manejadores cortos." },
      { title: "Tu turno", body: "Crea **ActionButton** con un botón. Al hacer clic, muestra `alert(\"Clicked!\")`. Usa **App** para renderizar `<ActionButton />` y `export default App`." },
    ],
  },
  "react-13": {
    title: "React 11: Efectos secundarios con useEffect",
    content: [
      "**useEffect** ejecuta código después del render: datos, timers, suscripciones. Úsalo para efectos secundarios, no para estado derivado. El **array de dependencias** controla cuándo se ejecuta: [] = una vez al montar, [a, b] = cuando a o b cambien. Añade **cleanup** para timers/suscripciones (devuelve una función).",
      "Prueba el timer: cuenta cada segundo y hace cleanup al desmontar. Cambia el array de dependencias y observa cuándo se vuelve a ejecutar el efecto.",
    ],
  },
  "react-14": {
    title: "React 12: Eventos y formularios (componentes controlados)",
    content: [
      "Los **componentes controlados** vinculan el valor del input al estado con `value={state}` y `onChange`. Usa `onSubmit` en formularios y `e.preventDefault()` para evitar recargar. Validación básica: comprueba valores antes de enviar o muestra errores.",
      "Completa el formulario: name y email están controlados. Al enviar, muestra un alert con los valores. Añade una comprobación (p. ej. longitud del nombre > 0) y muestra un mensaje de error si no es válido.",
    ],
  },
  "react-15": {
    title: "React 13: Listas, keys y rendimiento",
    content: [
      "Usa siempre una **key** al renderizar listas (p. ej. `key={item.id}`). Las keys ayudan a React a emparejar elementos entre re-renders. Mantén el **estado cerca** de donde se usa y **divide componentes** para que solo re-renderice la parte que cambia.",
      "La lista de tareas usa keys y estado local. Añade una tarea y observa que solo la lista se re-renderiza. Las keys deben ser estables y únicas (evita el índice del array cuando la lista puede reordenarse).",
    ],
  },
  "react-16": {
    title: "React 14: Refs con useRef",
    content: [
      "**useRef** devuelve un objeto ref mutable: úsalo para **acceso al DOM** (focus, scroll, medir) o para **persistir un valor** sin provocar re-renders. Las refs sobreviven a los re-renders; cambiar `ref.current` no dispara un render.",
      "Haz clic en 'Focus input' para enfocar el campo con una ref. El contador se guarda en una ref para actualizarse sin re-renderizar todo el componente.",
    ],
  },
  "react-17": {
    title: "React 15: useReducer",
    content: [
      "**useReducer** es como useState pero para estado complejo: envías **actions** y un **reducer** devuelve el siguiente estado. Útil cuando tienes varios subvalores o el siguiente estado depende del anterior.",
      "El contador usa un reducer con las actions 'increment' y 'decrement'. Prueba a añadir una action 'reset' que ponga el contador a 0.",
    ],
  },
  "react-18": {
    title: "React 16: useMemo, useCallback y React.memo",
    content: [
      "**useMemo** cachea un valor calculado; **useCallback** cachea una función (para que los hijos no re-rendericen innecesariamente). **React.memo** evita re-renderizar un componente cuando las props son iguales (shallow). Úsalos para resolver problemas reales de rendimiento, no en todas partes.",
      "La lista costosa está memorizada. El contador del padre se actualiza pero la lista solo se recalcula cuando cambia 'filter'. Prueba a envolver un hijo en React.memo y pasar un manejador con useCallback.",
    ],
  },
  "react-19": {
    title: "React 19: Límites de error (concepto)",
    content: [
      "Los **límites de error** capturan errores de JavaScript en el árbol debajo y muestran una UI de respaldo. **No** capturan errores en manejadores de eventos, código asíncrono o en el propio límite. Colócalos a nivel de ruta o de sección para que un fallo no tire toda la app.",
      "Este demo usa un componente de clase ErrorBoundary. Haz clic en 'Throw' para provocar un error; el límite lo captura y muestra el fallback.",
    ],
  },
  "react-20": {
    title: "React 18: Hooks personalizados",
    content: [
      "Los **hooks personalizados** extraen lógica reutilizable (useState + useEffect + etc.) en una función cuyo nombre empieza por `use`. Sigue las **reglas de los hooks**: solo llama hooks en el nivel superior y desde funciones de React.",
      "useWindowWidth devuelve el ancho actual de la ventana y se actualiza al redimensionar. useCounter es un contador reutilizable. Usa uno en App y renderiza el valor.",
    ],
  },
  "react-21": {
    title: "React 19: Límites de error (concepto)",
    content: [
      "Los **límites de error** capturan errores de JavaScript en el árbol debajo y muestran una UI de respaldo. **No** capturan errores en manejadores de eventos, código asíncrono o en el propio límite. Colócalos a nivel de ruta o de sección para que un fallo no tire toda la app.",
      "Este demo usa un componente de clase ErrorBoundary. Haz clic en 'Throw' para provocar un error; el límite lo captura y muestra el fallback.",
    ],
  },
  "react-22": {
    title: "React 19 (1): Actions",
    content: [
      "Las **Actions** son transiciones asíncronas de primera clase en React 19. Pasas una función async a un formulario o a APIs estilo startTransition. Mejoran **envíos de formularios**, **estados pending** (React los rastrea) y **manejo de errores**.",
      "Este demo simula el patrón: un formulario ejecuta una 'action' async y muestra pending/éxito. En React 19 usarías la prop action en form o useActionState.",
    ],
  },
  "react-23": { title: "React 19 (2): useActionState", content: ["**useActionState** une una action con estado (pending, datos, error). Úsalo para formularios que envían datos y muestran estado de envío o errores."] },
  "react-24": { title: "React 19 (3): useFormStatus", content: ["**useFormStatus** devuelve el estado del formulario padre (pending, data, method). Úsalo dentro de componentes hijos del form para mostrar loading o deshabilitar botones mientras se envía."] },
  "react-25": { title: "React 19 (4): useOptimistic", content: ["**useOptimistic** permite mostrar una actualización optimista en la UI antes de que el servidor responda. Si la petición falla, React revierte al estado anterior."] },
  "react-26": { title: "React 19 (5): useTransition", content: ["**useTransition** marca actualizaciones de estado como transiciones no urgentes. La UI sigue respondiendo mientras se prepara el siguiente estado."] },
  "react-27": { title: "React 19 (6): useDeferredValue", content: ["**useDeferredValue** difiere un valor: React puede seguir mostrando el valor anterior mientras calcula el nuevo. Útil para mantener la UI fluida con listas o filtros costosos."] },
  "react-28": { title: "React 19 (7): Suspense para datos", content: ["**Suspense** permite mostrar un fallback mientras se cargan datos o componentes. En React 19 puedes usar Suspense con fuentes de datos que se integren con el ciclo de render."] },
  "react-29": { title: "React 19 (8): Precarga de recursos", content: ["La **precarga de recursos** (preload) permite cargar scripts, hojas de estilo o datos antes de que se necesiten, reduciendo la espera cuando el usuario navega."] },
  "react-30": {
    title: "React 19 (9): Strict Mode y efectos idempotentes",
    content: [
      "En **Strict Mode**, React monta, desmonta y vuelve a montar componentes para detectar efectos no idempotentes. Asegúrate de que los efectos tengan **cleanup** (return una función) para que sea seguro ejecutarlos dos veces.",
    ],
  },
  "react-31": {
    title: "React 19 (10): Mentalidad de migración",
    content: [
      "**No reescribes** toda la app. Adopta **actions** y **flujos optimistas** donde ya tengas formularios y mutaciones. Mantén useState/useEffect existentes; añade useActionState o useOptimistic donde simplifiquen el código.",
      "Este paso es conceptual. Tu app puede mezclar: formularios antiguos se quedan, los nuevos usan actions; listas críticas usan useDeferredValue. El objetivo es la adopción gradual.",
    ],
  },
};

export function getReactLessonForLocale(locale: Locale, id: string): WebCourseLesson | undefined {
  const lesson = getReactLessonById(id);
  if (!lesson) return undefined;
  if (locale !== "es") return lesson;
  const t = REACT_LESSONS_ES[id];
  if (!t) return lesson;
  const sections =
    t.sections && lesson.sections
      ? lesson.sections.map((s, i) => ({
          ...s,
          title: t.sections![i]?.title ?? s.title,
          body: t.sections![i]?.body ?? s.body,
        }))
      : lesson.sections;
  return {
    ...lesson,
    title: t.title ?? lesson.title,
    content: t.content ?? lesson.content,
    sections,
  };
}
