/**
 * Spanish translations for React 19 interview lesson data.
 * Code (starterCode, oldWayCode, newWayCode) is NEVER translated.
 */

import type { Locale } from "./i18n";
import { getReact19LessonById, type React19Lesson } from "./react19InterviewData";

/** Spanish overrides for React 19 interview lessons. Code (starterCode, oldWayCode, newWayCode) is NEVER translated. */
const REACT19_LESSONS_ES: Record<
  string,
  Partial<
    Pick<
      React19Lesson,
      "title" | "concept" | "description" | "previewDescription" | "explanation"
    >
  >
> = {
  "lesson-1-use-api": {
    title: "La muerte de useEffect para obtener datos",
    concept: "La nueva API use",
    description:
      "El cambio: ya no necesitamos useEffect + useState + flags de carga para obtener datos simples. Podemos \"desenvolver\" promesas directamente en el render.",
    previewDescription:
      'La pantalla muestra "Loading Profile..."... la petición de red termina... e instantáneamente aparece "Cristian" sin un solo useEffect.',
    explanation:
      "El hook `use` de React 19 permite desenvolver promesas directamente en el render. Combinado con Suspense, esto elimina la necesidad de gestionar manualmente el estado de carga. El componente se suspende automáticamente hasta que la promesa se resuelve.",
  },
  "lesson-2-use-action-state": {
    title: "Formularios sin sufrimiento (useActionState)",
    concept: "Server Actions y estado",
    description:
      "El cambio: olvídate de onSubmit, e.preventDefault() y crear estados genéricos de isSubmitting. React 19 gestiona el ciclo de vida del formulario por ti.",
    previewDescription:
      'El usuario escribe "React 19" y presiona Enter. El botón cambia instantáneamente a "Updating..." y se deshabilita. Después de 1s, vuelve a su estado normal y aparece el texto "Updated to React 19" debajo.',
    explanation:
      "`useActionState` gestiona automáticamente el estado de envío de formularios. Proporciona el estado actual, una función de envío y un booleano de pendiente. El formulario se deshabilita automáticamente durante el envío, y puedes devolver estado desde la función de acción para mostrar errores o mensajes de éxito.",
  },
  "lesson-3-use-form-status": {
    title: "Comunicación entre componentes (useFormStatus)",
    concept: "Acceso profundo al estado",
    description:
      'El cambio: tienes un SubmitButton anidado profundamente en un formulario. En React 18, tenías que pasar props de carga a través de 5 niveles. En React 19, el componente hijo puede "preguntarle" al formulario padre si está ocupado.',
    previewDescription:
      "El SubmitButton sabe automáticamente cuándo el formulario se está enviando, sin necesidad de pasar ninguna prop.",
    explanation:
      "`useFormStatus` permite que los componentes hijos accedan al estado pendiente del formulario padre sin prop drilling. El hook se conecta automáticamente al ancestro `<form>` más cercano y proporciona el estado de pendiente.",
  },
  "lesson-4-use-optimistic": {
    title: "La UI optimista (useOptimistic)",
    concept: "Gratificación instantánea",
    description:
      "El cambio: los usuarios odian esperar. Incluso si el servidor tarda 2 segundos, muestra el cambio al instante.",
    previewDescription:
      'El usuario escribe "Hello" y presiona Enviar. Instantáneamente: "Hello (Sending...)" aparece en la lista (atenuado). 2 segundos después: la etiqueta "(Sending...)" desaparece cuando llegan los datos reales del servidor.',
    explanation:
      "`useOptimistic` permite mostrar actualizaciones optimistas de inmediato mientras la petición real al servidor está en curso. Si el servidor falla, React revierte automáticamente la actualización optimista. Esto proporciona retroalimentación instantánea a los usuarios.",
  },
  "lesson-5-react-compiler": {
    title: "El React Compiler (adiós a useMemo)",
    concept: "Optimización automática",
    description:
      "El cambio: React 19 introduce el React Compiler (herramienta de compilación opcional). Memoriza automáticamente tus componentes y valores.",
    previewDescription:
      "El compilador optimiza automáticamente tu código en tiempo de compilación, así puedes escribir JavaScript natural sin memoización manual.",
    explanation:
      "El React Compiler optimiza automáticamente tu código en tiempo de compilación. Memoriza valores y estabiliza referencias a funciones, eliminando la necesidad de `useMemo` y `useCallback` manuales en la mayoría de los casos. Puedes escribir JavaScript natural y dejar que el compilador se encargue del rendimiento.",
  },
  "lesson-6-forward-ref": {
    title: "La muerte de forwardRef",
    concept: "ref como una prop",
    description:
      "El cambio: durante años, pasar un ref a un componente hijo era una pesadilla. Tenías que envolver el hijo en forwardRef y separar los argumentos. React 19 trata ref como cualquier otra prop.",
    previewDescription:
      "Los refs ahora se pueden pasar como props regulares, eliminando la necesidad del wrapper forwardRef.",
    explanation:
      "En React 19, `ref` se trata como una prop regular. Puedes desestructurarla de las props igual que cualquier otra prop, eliminando la necesidad de `forwardRef`. Esto simplifica las APIs de los componentes y facilita el trabajo con refs.",
  },
  "lesson-7-native-metadata": {
    title: "Metadata nativa (adiós a react-helmet)",
    concept: "Elevación de metadata del documento",
    description:
      "El cambio: modificar el <title> o agregar etiquetas <meta> solía requerir librerías de terceros o hacks con useEffect. React 19 ahora \"eleva\" nativamente estas etiquetas al <head> de tu documento, sin importar dónde se rendericen.",
    previewDescription:
      "Las etiquetas title y meta se elevan automáticamente al head del documento, visibles en la pestaña del navegador y para SEO.",
    explanation:
      "React 19 eleva automáticamente las etiquetas `<title>` y `<meta>` al head del documento, sin importar dónde se rendericen en el árbol de componentes. Esto elimina la necesidad de librerías como react-helmet o manipulación manual del DOM.",
  },
  "lesson-8-context-provider": {
    title: "Context Providers más limpios",
    concept: "<Context> como Provider",
    description:
      "El cambio: ya no necesitamos escribir .Provider. Es un cambio pequeño, pero elimina ruido visual.",
    previewDescription:
      "Context se puede usar directamente como provider sin el sufijo .Provider.",
    explanation:
      "En React 19, puedes usar el Context directamente como provider sin el sufijo `.Provider`. Esto reduce el ruido visual y hace que el uso de context sea más conciso manteniendo la misma funcionalidad.",
  },
  "lesson-9-ref-cleanup": {
    title: "Limpieza en Callback Refs",
    concept: "Funciones de limpieza en ref",
    description:
      'El cambio: al usar un "Callback Ref" (una función pasada a ref en lugar de un objeto useRef), no se podían limpiar fácilmente los efectos secundarios cuando el elemento se eliminaba. React 19 permite devolver una función de limpieza, exactamente como useEffect.',
    previewDescription:
      "Cuando el elemento se elimina, la función de limpieza se ejecuta automáticamente, desconectando el observer.",
    explanation:
      "Los callback refs en React 19 pueden devolver una función de limpieza, similar a `useEffect`. Esta función de limpieza se invoca cuando el elemento se elimina del DOM, facilitando la limpieza de observers, event listeners u otros efectos secundarios.",
  },
  "lesson-10-architecture": {
    title: "La arquitectura (Client vs Server)",
    concept: 'Directivas ("use client", "use server")',
    description:
      "El cambio: aunque popularizadas por Next.js, ahora son especificaciones del núcleo de React. Definen la \"frontera\" entre el código que se ejecuta en el servidor (renderizado de HTML/acceso a base de datos) y el código que se ejecuta en el navegador (interactividad/estado).",
    previewDescription:
      "Las directivas separan claramente el código de servidor y cliente, permitiendo mejor seguridad y rendimiento.",
    explanation:
      "Las directivas `\"use client\"` y `\"use server\"` de React 19 separan claramente el código de cliente y servidor. Las server actions pueden acceder de forma segura a bases de datos y APIs, mientras que los client components manejan la interactividad. Esta arquitectura mejora la seguridad y el rendimiento.",
  },
  "lesson-11-web-components": {
    title: "Interoperabilidad con Web Components",
    concept: "Soporte para Custom Elements",
    description:
      'El cambio: React 18 y versiones anteriores tenían problemas con Web Components (ej. <my-slider>), frecuentemente fallando al pasar propiedades correctamente o al manejar eventos personalizados. React 19 pasa todas las pruebas de "Custom Elements Everywhere."',
    previewDescription:
      "Los Web Components ahora funcionan sin problemas con React 19, con manejo adecuado de eventos y paso de propiedades.",
    explanation:
      "React 19 tiene soporte completo para Web Components, manejando correctamente eventos personalizados (con el prefijo `on`), propiedades de objetos y atributos de clase. Esto permite una integración fluida con librerías de Web Components como Lit o Shoelace.",
  },
  "lesson-12-asset-loading": {
    title: "Carga nativa de assets (estilos y scripts)",
    concept: "Elevación y deduplicación de recursos",
    description:
      "El cambio: en React 18, si querías cargar de forma diferida una hoja de estilos o un script para un componente específico, tenías que usar librerías externas o hacks complicados. React 19 ahora maneja nativamente la carga de recursos, asegurando que solo se carguen una vez, incluso si el componente se renderiza múltiples veces.",
    previewDescription:
      "Las hojas de estilos y scripts se elevan automáticamente al head y se deduplican, incluso si el componente se renderiza múltiples veces.",
    explanation:
      "React 19 maneja nativamente la carga de hojas de estilos y scripts. Las etiquetas `<link>` y `<script>` se elevan automáticamente al head del documento, y React asegura que solo se carguen una vez mediante deduplicación. La prop `precedence` controla el orden de carga.",
  },
  "lesson-13-hydration-errors": {
    title: 'La corrección del "Error de Hidratación"',
    concept: "Depuración con cordura",
    description:
      'El cambio: todos los que han usado Next.js o SSR conocen el temido error: "Text content does not match server-rendered HTML." En React 18, este error era un muro de texto inútil. React 19 actúa como git diff.',
    previewDescription:
      "Los errores de hidratación ahora muestran una vista de diff clara que señala la discrepancia exacta, facilitando mucho la depuración.",
    explanation:
      "React 19 proporciona mensajes de error de hidratación mucho mejores con una vista tipo diff que muestra exactamente qué difiere entre el renderizado del servidor y el del cliente. Esto facilita significativamente la depuración de problemas de SSR sin requerir cambios en el código.",
  },
  "lesson-14-use-deferred-value": {
    title: "Configuración inicial de useDeferredValue",
    concept: 'Ocultar el estado "obsoleto"',
    description:
      "El cambio: useDeferredValue se usa para mantener la UI responsiva durante actualizaciones pesadas. Antes, no se podía establecer un valor inicial, por lo que el primer renderizado podía mostrar undefined o parpadear.",
    previewDescription:
      "useDeferredValue ahora puede aceptar un valor inicial, previniendo parpadeos de undefined en el primer renderizado.",
    explanation:
      "`useDeferredValue` en React 19 acepta un segundo parámetro opcional para el valor inicial. Esto previene estados iniciales undefined o con parpadeos, haciendo la transición más suave y predecible.",
  },
  "lesson-15-preloading": {
    title: "APIs de precarga (preload, preinit)",
    concept: "Hints para el navegador",
    description:
      'El cambio: en lugar de agregar manualmente etiquetas <link rel="preload"> en tu index.html y esperar que coincidan con tus componentes, puedes indicarle imperativamente al navegador que comience a cargar fuentes o scripts antes de que el componente se renderice.',
    previewDescription:
      "Los recursos se pueden precargar de forma imperativa, mejorando el rendimiento al iniciar descargas antes de que sean necesarias.",
    explanation:
      "React 19 proporciona las funciones `preload` y `preinit` de `react-dom` para iniciar imperativamente la carga de recursos. `preload` comienza la descarga de recursos, mientras que `preinit` inicia la descarga y ejecución de scripts. Esto te da un control detallado sobre los tiempos de carga de recursos.",
  },
};

export function getReact19LessonForLocale(
  locale: Locale,
  id: string,
): React19Lesson | undefined {
  const base = getReact19LessonById(id);
  if (!base) return undefined;
  if (locale !== "es") return base;
  const es = REACT19_LESSONS_ES[id];
  if (!es) return base;
  return { ...base, ...es };
}
