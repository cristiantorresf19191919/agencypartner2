import type { Locale } from "./i18n";
import { getReactChallengeById, type ReactChallenge } from "./reactChallengesData";

/** Spanish overrides for React challenges. Code (problemCode, solution) is NEVER translated. */
const REACT_CHALLENGES_ES: Record<
  string,
  Partial<Pick<ReactChallenge, "title" | "description" | "explanation" | "hints">>
> = {
  "stale-closure-trap": {
    title: "La Trampa del Closure Obsoleto",
    description: `¿Por qué el alert muestra el conteo inicial (0) incluso después de hacer clic en el botón varias veces? Corrígelo sin agregar \`count\` al array de dependencias.

El closure captura \`count\` del primer render. Usa un Ref para rastrear el valor actual.`,
    explanation: `El closure captura \`count\` del primer render (0). Aunque el estado se actualiza, el closure del efecto sigue referenciando el valor anterior. Usa \`useRef\` para almacenar el conteo actual y acceder a él dentro del closure.`,
    hints: [
      "El problema es que los closures capturan los valores en el momento de su definición.",
      "useRef te permite almacenar un valor mutable que persiste entre renders.",
      "Actualiza el valor del ref en cada render, luego usa ref.current en el efecto.",
    ],
  },
  "synchronous-state-updates": {
    title: "¿Actualizaciones de Estado Síncronas?",
    description: `¿Qué se registra en la consola cuando se hace clic en el botón? Corrige el código para que ambas actualizaciones de estado se apliquen.

Las actualizaciones de estado son asíncronas y se agrupan en lotes. Como \`val\` es constante dentro del closure, ambas llamadas establecen el estado a \`0 + 1\`.`,
    explanation: `Consola: \`0\`. Las actualizaciones de estado se agrupan en lotes y son asíncronas. Valor renderizado: \`1\`. Como \`val\` es constante dentro del closure, ambas llamadas establecen el estado a \`0 + 1\`. Usa la forma de actualización funcional: \`setVal(prev => prev + 1)\`.`,
    hints: [
      "Las actualizaciones de estado son asíncronas y React las agrupa en lotes.",
      "Usa la forma de actualización funcional: setVal(prev => prev + 1).",
      "El console.log seguirá mostrando 0, pero el valor renderizado será 2.",
    ],
  },
  "context-unnecessary-rerenders": {
    title: "Context y Re-renders Innecesarios",
    description: `<Child /> está envuelto en \`React.memo\`, pero aún se re-renderiza cada vez que <Parent /> se actualiza. ¿Por qué? Corrígelo.

El objeto \`value\` se recrea (nueva referencia) en cada render, causando que todos los consumidores se re-rendericen.`,
    explanation: `El objeto \`value\` se recrea en cada render, generando una nueva referencia. Aunque \`React.memo\` verifica las props, los consumidores de Context siempre se re-renderizan cuando cambia la referencia del valor del contexto. Envuelve el valor en \`useMemo\` y las funciones en \`useCallback\`.`,
    hints: [
      "El problema es la igualdad por referencia de objetos: se crea un nuevo objeto en cada render.",
      "Usa useMemo para memorizar el objeto de valor del contexto.",
      "También memoriza las funciones con useCallback.",
    ],
  },
  "dependency-array-lying": {
    title: "Array de Dependencias Engañoso",
    description: `El usuario obtiene los datos correctamente, pero el componente entra en un bucle infinito de solicitudes de red. ¿Por qué?

\`fetchUser\` se define dentro del cuerpo del componente, por lo que es una nueva referencia de función en cada render, lo que activa el efecto.`,
    explanation: `\`fetchUser\` es una nueva referencia de función en cada render, por lo que el array de dependencias la detecta como cambiada, activando el efecto, que actualiza el estado, lo que provoca un render... ¡bucle infinito! Envuelve \`fetchUser\` en \`useCallback\` o muévela dentro de \`useEffect\`.`,
    hints: [
      "Las funciones definidas en el cuerpo del componente son nuevas en cada render.",
      "Usa useCallback con las dependencias adecuadas, o mueve la función dentro de useEffect.",
      "La dependencia real es userId, no fetchUser.",
    ],
  },
  "polymorphic-components": {
    title: "Componentes Polimórficos con TS",
    description: `Crea un componente \`Text\` que acepte una prop \`as\` (por ejemplo, 'h1', 'span', 'a') y herede correctamente los atributos HTML para esa etiqueta (por ejemplo, \`href\` solo debe ser válido si \`as="a"\`).`,
    explanation: `Usa tipos genéricos con \`React.ElementType\` y \`React.ComponentPropsWithoutRef\` para tipar correctamente los componentes polimórficos. El tipo del componente debe extender un elemento HTML válido o un componente de React.`,
    hints: [
      "Usa tipos genéricos con la restricción React.ElementType.",
      "Usa React.ComponentPropsWithoutRef para obtener las props correctas para cada tipo de elemento.",
      "El genérico C extends React.ElementType asegura la seguridad de tipos.",
    ],
  },
  "uselayout-effect-vs-effect": {
    title: "useLayoutEffect vs useEffect",
    description: `Ves una interfaz con parpadeo donde un elemento aparece arriba e instantáneamente salta hacia abajo. ¿Qué hook corrige esto y por qué?

\`useLayoutEffect\` se ejecuta de forma síncrona después de las mutaciones del DOM pero antes de que el navegador pinte, previniendo el parpadeo visual.`,
    explanation: `\`useEffect\` se ejecuta después de que el navegador pinta, así que ves el elemento en la posición 0 primero, y luego salta. \`useLayoutEffect\` se ejecuta de forma síncrona antes de pintar, así que la posición se establece antes de que el usuario vea algo.`,
    hints: [
      "useLayoutEffect se ejecuta de forma síncrona antes de que el navegador pinte.",
      "Úsalo cuando necesites medir el DOM o prevenir parpadeo visual.",
      "Reemplaza useEffect con useLayoutEffect.",
    ],
  },
  "conditional-hook": {
    title: "El Hook Condicional (El Movimiento Ilegal)",
    description: `¿Por qué React lanza un error aquí si \`isLoading\` cambia de true a false?

Los hooks dependen del orden de llamada. Los retornos condicionales antes de los hooks rompen la lista enlazada de hooks que React mantiene internamente.`,
    explanation: `Los hooks de React deben llamarse en el mismo orden en cada render. Cuando \`isLoading\` cambia, el número de hooks llamados cambia, rompiendo la lista enlazada interna de hooks de React. Siempre llama a los hooks en el nivel superior.`,
    hints: [
      "Los hooks siempre deben llamarse en el mismo orden en cada render.",
      "Nunca llames a hooks de forma condicional o después de retornos anticipados.",
      "Llama a todos los hooks al inicio del componente, antes de cualquier lógica condicional.",
    ],
  },
  "object-dependency-pitfall": {
    title: "La Trampa de la Dependencia de Objetos",
    description: `¿Por qué este efecto se ejecuta en cada render?

\`config\` es una nueva referencia de objeto en cada render, así que React lo detecta como cambiado.`,
    explanation: `Los objetos se comparan por referencia, no por valor. Aunque el contenido del objeto sea el mismo, es un nuevo objeto en cada render, así que el array de dependencias activa el efecto cada vez. Usa \`useMemo\` o mueve el objeto fuera del componente.`,
    hints: [
      "Los objetos se comparan por referencia, no por valor.",
      "Usa useMemo para memorizar el objeto, o muévelo fuera del componente.",
      "Si el objeto nunca cambia, muévelo al ámbito del módulo.",
    ],
  },
  "use-previous": {
    title: "Implementando usePrevious",
    description: `Escribe un hook personalizado \`usePrevious<T>(value: T)\` que devuelva el valor del render anterior.`,
    explanation: `Usa \`useRef\` para almacenar el valor anterior. Actualízalo en \`useEffect\`, que se ejecuta después del render. Devuelve el valor actual del ref, que todavía contiene el valor del render anterior.`,
    hints: [
      "Usa useRef para almacenar un valor mutable que persiste entre renders.",
      "Actualiza el ref en useEffect (que se ejecuta después del render).",
      "Devuelve ref.current, que todavía contiene el valor anterior.",
    ],
  },
  "react-memo-callback": {
    title: "React.memo y Props de Callback",
    description: `\`MemoizedButton\` sigue re-renderizándose cuando Parent se actualiza. Corrígelo.

\`handleClick\` es una nueva referencia de función cada vez, por lo que \`React.memo\` la detecta como cambiada.`,
    explanation: `\`handleClick\` se recrea en cada render, así que la comparación superficial de \`React.memo\` detecta una nueva referencia de función y re-renderiza. Envuelve \`handleClick\` en \`useCallback\` para mantener la misma referencia de función.`,
    hints: [
      "Las funciones se recrean en cada render a menos que se memoricen.",
      "Usa useCallback para mantener la misma referencia de función.",
      "Si el callback depende de valores, inclúyelos en el array de dependencias.",
    ],
  },
  "ref-vs-state": {
    title: "Ref vs State",
    description: `Necesitas contar cuántas veces se renderiza un componente sin causar un re-render adicional. ¿Cómo?

Usa \`useRef\`. Actualizar \`ref.current\` no provoca un re-render.`,
    explanation: `Usar \`useState\` para contar renders causa un bucle infinito porque cada actualización de estado provoca un re-render. Usa \`useRef\` en su lugar: actualizar \`ref.current\` no provoca re-renders.`,
    hints: [
      "useState provoca re-renders, lo que causaría un bucle infinito aquí.",
      "useRef te permite almacenar un valor mutable sin provocar re-renders.",
      "Actualiza ref.current directamente y léelo al renderizar.",
    ],
  },
  "synthetic-events": {
    title: "Eventos Sintéticos vs Nativos",
    description: `Si usas \`e.stopPropagation()\` en un \`onClick\` de React, ¿detiene un handler \`document.addEventListener('click')\` adjunto en un \`useEffect\`?

En React 17+, los eventos se adjuntan al contenedor raíz, no al document. \`stopPropagation\` en eventos sintéticos puede no prevenir los listeners nativos del document.`,
    explanation: `React 17+ adjunta los eventos al contenedor raíz. \`stopPropagation\` en eventos sintéticos detiene el sistema de eventos de React, pero los listeners nativos del document aún pueden ejecutarse. Para prevenir los listeners del document, usa \`e.nativeEvent.stopImmediatePropagation()\` o adjunta el listener al contenedor raíz.`,
    hints: [
      "React 17+ adjunta los eventos al contenedor raíz, no al document.",
      "stopPropagation en eventos sintéticos puede no detener los listeners nativos del document.",
      "Usa nativeEvent.stopImmediatePropagation() o adjunta el listener al contenedor raíz.",
    ],
  },
  "component-definition-inside-render": {
    title: "Definición de Componente dentro del Render",
    description: `¿Por qué esto es extremadamente malo para el rendimiento y la experiencia de usuario (pérdida de foco)?

\`Child\` es un nuevo tipo de componente en cada render. React desmonta la instancia anterior y monta una nueva, perdiendo el foco y el estado.`,
    explanation: `Definir un componente dentro de otro componente crea un nuevo tipo de componente en cada render. React lo trata como un componente completamente diferente, desmontando el anterior y montando uno nuevo, causando pérdida de foco y reinicio de estado.`,
    hints: [
      "Los componentes definidos dentro del render son tipos nuevos cada vez.",
      "React desmonta y remonta, perdiendo estado y foco.",
      "Siempre define los componentes en el ámbito del módulo o usa useMemo para la creación de componentes.",
    ],
  },
  "typing-forward-ref": {
    title: "Tipando forwardRef",
    description: `Tipa correctamente un componente que reenvía un ref a un \`HTMLInputElement\` y acepta una prop \`label\`.`,
    explanation: `El tipo del ref es el primer argumento genérico de \`forwardRef\`, y el tipo de props es el segundo. Usa \`HTMLInputElement\` para el tipo del ref.`,
    hints: [
      "forwardRef toma dos parámetros genéricos: tipo de ref y tipo de props.",
      "El tipo del ref va primero: forwardRef<RefType, PropsType>.",
      "Usa HTMLInputElement para los refs de input.",
    ],
  },
  "reducing-rerenders-composition": {
    title: "Reducir Re-renders mediante Composición",
    description: `\`SlowComponent\` se re-renderiza cuando \`color\` cambia. Optimízalo sin \`React.memo\`.

Usa composición: pasa \`SlowComponent\` como \`children\`. Los cambios de estado del padre no causarán que los children se re-rendericen si se pasan como props.`,
    explanation: `Cuando el estado de Parent cambia, todos los hijos se re-renderizan. Al pasar \`SlowComponent\` como prop \`children\`, React puede optimizar porque la referencia de la prop \`children\` no cambia aunque Parent se re-renderice (si se pasa desde afuera).`,
    hints: [
      "Los componentes se re-renderizan cuando cambia el estado del padre.",
      "Los hijos pasados como props a menudo se optimizan mejor.",
      "Compón extrayendo la lógica con estado en un componente envolvente.",
    ],
  },
  "key-prop-index": {
    title: "La Prop key: Índice como Key",
    description: `¿Por qué usar \`index\` como key es malo para una lista donde los elementos pueden reordenarse o eliminarse?

React usa las keys para comparar diferencias en el árbol. Si el item 0 se elimina, el item 1 se convierte en índice 0. React reutiliza el DOM y el estado del item 0 anterior para los nuevos datos, causando errores.`,
    explanation: `Cuando se usa el índice como key, React no puede distinguir entre elementos después de reordenar o eliminar. Reutiliza los nodos DOM incorrectamente, causando errores de estado (como foco/valor de input) y problemas de rendimiento. Usa IDs estables y únicos.`,
    hints: [
      "Las keys ayudan a React a identificar qué elementos cambiaron, se agregaron o se eliminaron.",
      "Las keys basadas en índices fallan cuando cambia el orden de la lista.",
      "Usa identificadores estables y únicos como keys (como IDs de los datos).",
    ],
  },
  "automatic-batching": {
    title: "Agrupación Automática (React 18)",
    description: `En React 18, si tienes dos actualizaciones de estado dentro de un \`setTimeout\`, ¿cuántas veces se renderiza el componente?

Una vez. React 18 introdujo la Agrupación Automática para promesas, timeouts y handlers de eventos nativos.`,
    explanation: `React 18 agrupa las actualizaciones de estado en timeouts, promesas y handlers de eventos nativos. Ambas actualizaciones se agrupan juntas, causando solo un render. En React 17, esto causaría dos renders.`,
    hints: [
      "React 18 agrupa actualizaciones en más escenarios que React 17.",
      "Los timeouts, promesas y handlers nativos agrupan actualizaciones.",
      "Solo ocurre un render para múltiples actualizaciones agrupadas.",
    ],
  },
  "use-reducer-complex-state": {
    title: "useReducer para Estado Complejo",
    description: `¿Por qué podría preferirse \`useReducer\` sobre \`useState\` para pasar callbacks profundamente?

La función \`dispatch\` de \`useReducer\` es estable (la identidad no cambia). Puedes pasarla a través de Context sin provocar re-renders de los consumidores.`,
    explanation: `Con \`useState\`, los callbacks como \`increment\` típicamente necesitan \`useCallback\` y dependencias. Con \`useReducer\`, \`dispatch\` siempre es estable, así que puedes pasarlo a través de Context sin memorización, evitando re-renders.`,
    hints: [
      "dispatch de useReducer tiene una identidad estable.",
      "No necesitas useCallback al pasar dispatch.",
      "Mejor para actualizaciones de estado complejas y paso profundo de props.",
    ],
  },
  "strict-mode-double-invoke": {
    title: "Doble Invocación de StrictMode",
    description: `¿Por qué \`console.log\` dentro de \`useEffect\` se ejecuta dos veces en desarrollo?

React StrictMode intencionalmente monta -> desmonta -> monta componentes para poner a prueba la lógica de limpieza de efectos y asegurar que los componentes sean resilientes al re-montaje.`,
    explanation: `StrictMode invoca los efectos dos veces en desarrollo para ayudar a encontrar errores. Asegura que tus funciones de limpieza funcionen correctamente y que los componentes puedan manejar ser montados/desmontados. Esto no ocurre en producción.`,
    hints: [
      "StrictMode es una funcionalidad exclusiva de desarrollo.",
      "Invoca los efectos dos veces para probar la lógica de limpieza.",
      "Esto no ocurre en las compilaciones de producción.",
    ],
  },
  "race-conditions-use-effect": {
    title: "Condiciones de Carrera en useEffect",
    description: `Un usuario hace clic en "Usuario 1" y luego rápidamente en "Usuario 2". La red para Usuario 1 es lenta y llega después de Usuario 2. La interfaz muestra los datos de Usuario 1 para Usuario 2. Corrígelo.

Usa un flag en la función de limpieza para ignorar respuestas obsoletas.`,
    explanation: `Cuando \`userId\` cambia rápidamente, múltiples solicitudes están en vuelo. La respuesta lenta de la primera solicitud puede sobrescribir la respuesta más rápida de la segunda. Usa una función de limpieza para cancelar o ignorar respuestas obsoletas.`,
    hints: [
      "Múltiples operaciones asíncronas pueden completarse en un orden diferente.",
      "Usa un flag en la función de limpieza para ignorar respuestas obsoletas.",
      "Establece el flag a false cuando el efecto se re-ejecuta o el componente se desmonta.",
    ],
  },
  "stale-closure-counter": {
    title: "La Trampa del Closure Obsoleto en el Contador",
    description: `El contador comienza en 0. El usuario hace clic en "Iniciar", pero el contador se queda en 1 y sigue parpadeando en 1 indefinidamente.

**El Problema:** El closure del \`useEffect\` captura el valor inicial de \`count\` (0). Aunque el estado se actualiza, el callback del intervalo sigue referenciando el valor anterior.

**La Tarea:**
1. Corrige el contador para que realmente incremente más allá de 1.
2. **Restricción:** No puedes agregar \`count\` al array de dependencias (agregarlo reiniciaría el intervalo cada segundo, lo cual es malo para el rendimiento).
3. **Expectativas de la Solución:** Debe usar la forma de actualización funcional \`setCount(prev => prev + 1)\`.`,
    explanation: `El closure captura \`count\` del primer render (0). Cuando \`setCount(count + 1)\` se ejecuta, siempre usa el valor capturado (0), así que establece el estado a 1. El intervalo sigue estableciéndolo en 1 cada segundo. Usa la forma de actualización funcional \`setCount(prev => prev + 1)\` para acceder al valor actual del estado en lugar del valor capturado por el closure.`,
    hints: [
      "El closure captura el valor inicial de count (0) del primer render.",
      "Usar count directamente en setCount siempre usa el valor capturado, no el estado actual.",
      "Usa la forma de actualización funcional: setCount(prev => prev + 1) para acceder al valor actual del estado.",
    ],
  },
  "race-condition-fetcher": {
    title: "El Fetcher con Condición de Carrera",
    description: `Tenemos una barra de búsqueda. Si escribes "React" rápidamente, las llamadas a la API para "R", "Re", "Rea", etc., se disparan. Si la respuesta de "R" llega *después* de la respuesta de "React", la interfaz muestra datos incorrectos.

**El Desafío:** Selecciona "Alice", luego inmediatamente selecciona "Bob". Observa que después de que Bob se carga, los datos de Alice los sobrescriben 2 segundos después.

**La Tarea:**
1. Selecciona "Alice", luego inmediatamente selecciona "Bob".
2. Observa que después de que Bob se carga, los datos de Alice los sobrescriben 2 segundos después.
3. **Corrígelo:** Usa un flag de limpieza o \`AbortController\` para ignorar la respuesta obsoleta.`,
    explanation: `Cuando \`person\` cambia rápidamente, múltiples solicitudes asíncronas están en vuelo. La respuesta lenta de "Alice" (2 segundos) puede llegar después de la respuesta rápida de "Bob" (200ms), sobrescribiendo los datos correctos. Usa una función de limpieza con un flag para rastrear si el efecto sigue siendo relevante, o usa \`AbortController\` para cancelar la solicitud.`,
    hints: [
      "Múltiples solicitudes asíncronas pueden completarse en un orden diferente.",
      "Usa una función de limpieza para rastrear si el efecto sigue siendo relevante.",
      "Establece un flag a false en la limpieza y verifícalo antes de actualizar el estado.",
    ],
  },
  "useless-memo": {
    title: "El Memo Inútil",
    description: `El \`HeavyComponent\` está envuelto en \`React.memo\`, pero se re-renderiza cada vez que el usuario escribe en el input, causando un retraso masivo.

**El Desafío:** Escribe en el campo de texto. Nota el retraso y los logs en consola.

**La Tarea:**
1. Escribe en el campo de texto. Nota el retraso y los logs en consola.
2. **Corrígelo:** Usa \`useCallback\` para estabilizar la referencia de la función.
3. **Seguimiento:** ¿Qué pasa si \`handleClick\` necesitara acceder a \`text\`? ¿Cómo lo actualizas sin romper la memorización? (Respuesta: patrón con Ref o actualizaciones funcionales).`,
    explanation: `\`handleClick\` se recrea en cada render porque se define en el cuerpo del componente. Aunque \`HeavyComponent\` está envuelto en \`React.memo\`, la nueva referencia de función en cada render hace que la comparación superficial de \`React.memo\` falle, provocando un re-render. Usa \`useCallback\` para memorizar la función y mantener la misma referencia entre renders.`,
    hints: [
      "Las funciones definidas en el cuerpo del componente se recrean en cada render.",
      "React.memo hace comparación superficial: nueva referencia de función = re-render.",
      "Usa useCallback para memorizar la función y mantener una referencia estable.",
      "Si handleClick necesitara text, usa useRef para almacenar text o usa actualizaciones funcionales para count.",
    ],
  },
  "effect-loop-death": {
    title: "El Bucle de la Muerte del Efecto",
    description: `La aplicación se cuelga o congela inmediatamente al cargar debido a un bucle infinito de renders.

**El Desafío:** La aplicación se cuelga o congela inmediatamente al cargar.

**La Tarea:**
1. Identifica por qué ocurre el bucle.
2. **Corrígelo:** Mueve \`config\` dentro del efecto, usa \`useMemo\`, o muévelo fuera del componente.`,
    explanation: `El objeto \`config\` se recrea en cada render, creando una nueva referencia cada vez. Como \`config\` está en el array de dependencias, React lo detecta como cambiado en cada render, activando el efecto. El efecto actualiza el estado, lo que provoca un render, que recrea \`config\`, que activa el efecto de nuevo... ¡bucle infinito! Mueve \`config\` dentro del efecto, usa \`useMemo\` para memorizarlo, o muévelo fuera del componente si nunca cambia.`,
    hints: [
      "Los objetos se comparan por referencia, no por valor.",
      "Se crea un nuevo objeto en cada render, así que React lo detecta como cambiado.",
      "Usa useMemo para memorizar el objeto, muévelo dentro del efecto, o muévelo fuera del componente.",
    ],
  },
  "master-refactor": {
    title: "La Refactorización Maestra",
    description: `Este es un "Componente Dios." Mezcla lógica de fetch, lógica de filtrado e interfaz. También recalcula el filtro en cada re-render (incluso los no relacionados).

**El Desafío:** Este componente tiene múltiples problemas de rendimiento:
1. El filtrado costoso se ejecuta incluso al alternar el Modo Oscuro (cambio de estado no relacionado)
2. FilterControls podría ser su propio componente para evitar re-renderizar la lista mientras se escribe
3. Sin separación de responsabilidades: todo está en un componente

**La Tarea:**
1. Extrae la lógica en un hook personalizado: \`useProductSearch(products)\`.
2. Optimiza el filtrado usando \`useMemo\`.
3. Evita que \`FilterControls\` se re-renderice cuando cambia la lista.`,
    explanation: `El componente tiene múltiples problemas de rendimiento: (1) La operación costosa de filtrado se ejecuta en cada render, incluso cuando solo cambia \`darkMode\`. (2) El componente completo se re-renderiza al escribir en el input del filtro. (3) Sin separación de responsabilidades. Extrae la lógica de filtrado en un hook personalizado con \`useMemo\`, separa el input del filtro en su propio componente y usa \`React.memo\` para prevenir re-renders innecesarios.`,
    hints: [
      "Extrae la lógica de filtrado en un hook personalizado que use useMemo.",
      "Separa el input del filtro en su propio componente envuelto en React.memo.",
      "Separa la lista de productos en su propio componente envuelto en React.memo.",
      "El hook personalizado solo debería recalcular cuando cambian los productos o el filtro.",
    ],
  },
  "concurrent-rendering-transition": {
    title: "Renderizado Concurrente con useTransition",
    description: `La interfaz se congela al filtrar una lista grande porque la actualización de estado bloquea el render. Los usuarios no pueden escribir en el input mientras se filtra.

**El Desafío:** Cuando escribes en el campo de búsqueda, el input deja de responder porque el filtrado costoso de la lista bloquea el render.

**La Tarea:**
1. Usa \`useTransition\` para marcar el filtrado como una actualización no urgente.
2. Muestra un indicador de carga mientras la transición está pendiente.
3. Mantén el input responsivo durante el filtrado.`,
    explanation: `Sin \`useTransition\`, React trata todas las actualizaciones de estado como urgentes, bloqueando el render. Cuando el filtrado ocurre, el input deja de responder. \`useTransition\` marca las actualizaciones como no urgentes, permitiendo que React mantenga la interfaz responsiva. Usa \`startTransition\` para envolver la actualización de estado y \`isPending\` para mostrar el estado de carga.`,
    hints: [
      "useTransition marca actualizaciones como no urgentes, manteniendo la interfaz responsiva.",
      "Separa el valor del input (urgente) del valor del filtro (no urgente).",
      "Usa startTransition para envolver actualizaciones de estado no urgentes.",
      "Usa isPending para mostrar el estado de carga durante las transiciones.",
    ],
  },
  "error-boundary-implementation": {
    title: "Implementación de Error Boundary",
    description: `Cuando un componente lanza un error, toda la aplicación se cuelga con una pantalla en blanco. Implementa un Error Boundary para capturar errores y mostrar una interfaz de respaldo.

**El Desafío:** Los errores en componentes hijos hacen que toda la aplicación se cuelgue.

**La Tarea:**
1. Crea un componente de clase Error Boundary (los hooks no pueden usarse para error boundaries).
2. Captura errores en el árbol de componentes.
3. Muestra una interfaz de respaldo con información del error.
4. Proporciona una forma de reiniciar el estado de error.`,
    explanation: `Los Error Boundaries son componentes de React que capturan errores de JavaScript en cualquier parte de su árbol de componentes hijos. Deben ser componentes de clase porque los hooks aún no soportan error boundaries. Implementa \`componentDidCatch\` y \`getDerivedStateFromError\` para capturar errores y actualizar el estado para mostrar una interfaz de respaldo.`,
    hints: [
      "Los Error Boundaries deben ser componentes de clase (los hooks no los soportan aún).",
      "Usa getDerivedStateFromError para actualizar el estado cuando ocurre un error.",
      "Usa componentDidCatch para registrar errores en servicios de reporte de errores.",
      "Renderiza una interfaz de respaldo cuando hasError es true.",
    ],
  },
  "compound-components": {
    title: "Patrón de Componentes Compuestos",
    description: `Crea un componente flexible \`Tabs\` usando el patrón de Componentes Compuestos. El componente debe permitir a los usuarios componer componentes Tab y TabPanel de forma flexible.

**El Desafío:** Crea un componente de Tabs reutilizable donde Tab y TabPanel trabajen juntos pero puedan componerse de forma flexible.

**La Tarea:**
1. Crea un componente \`Tabs\` que gestione el estado de la pestaña activa.
2. Crea componentes \`Tab\` y \`TabPanel\` que trabajen juntos.
3. Usa Context para compartir estado entre componentes.
4. Permite composición flexible de pestañas y paneles.`,
    explanation: `Los Componentes Compuestos te permiten crear componentes que trabajan juntos mientras mantienen flexibilidad. Usa Context para compartir estado (pestaña activa) entre Tabs, Tab y TabPanel. Tabs gestiona el estado, Tab dispara los cambios de pestaña, y TabPanel renderiza condicionalmente según la pestaña activa.`,
    hints: [
      "Usa Context para compartir estado entre Tabs, Tab y TabPanel.",
      "El componente Tabs gestiona el estado de la pestaña activa.",
      "El componente Tab usa el contexto para obtener/establecer la pestaña activa.",
      "TabPanel renderiza condicionalmente según la pestaña activa.",
    ],
  },
  "context-splitting-performance": {
    title: "División de Context para Rendimiento",
    description: `Un solo Context proporciona tanto datos de usuario como el tema, causando re-renders innecesarios. Cuando el tema cambia, los componentes que solo necesitan datos de usuario también se re-renderizan.

**El Desafío:** Divide el contexto para prevenir re-renders innecesarios.

**La Tarea:**
1. Divide el contexto único en UserContext y ThemeContext separados.
2. Asegura que los componentes solo se re-rendericen cuando cambia su contexto específico.
3. Usa React.memo para optimizar los consumidores.`,
    explanation: `Cuando un solo contexto contiene múltiples valores, cualquier cambio causa que todos los consumidores se re-rendericen, incluso si no usan el valor cambiado. Divide los contextos por responsabilidad (usuario vs tema) para que los componentes solo se re-rendericen cuando cambia su contexto específico. Usa \`useMemo\` para memorizar los valores del contexto y \`React.memo\` para optimizar los consumidores.`,
    hints: [
      "Divide los contextos por responsabilidad: contextos de usuario y tema separados.",
      "Usa useMemo para memorizar los valores del contexto.",
      "Envuelve los consumidores en React.memo para prevenir re-renders innecesarios.",
      "Los componentes solo se re-renderizarán cuando cambie su contexto específico.",
    ],
  },
  "custom-hook-dependencies": {
    title: "Hook Personalizado con Dependencias Complejas",
    description: `Crea un hook \`useDebounce\` que retrase un valor. El hook debe aceptar un valor y un retraso, y devolver el valor retrasado.

**El Desafío:** Implementa un hook personalizado que maneje correctamente la limpieza y las dependencias.

**La Tarea:**
1. Crea el hook \`useDebounce(value, delay)\`.
2. Devuelve el valor retrasado.
3. Limpia el timeout al desmontar o cuando cambien las dependencias.
4. Maneja casos extremos (valores null/undefined, cambio de delay).`,
    explanation: `Un hook de debounce retrasa la actualización del valor devuelto hasta después de un retraso especificado. Usa \`useState\` para almacenar el valor retrasado, \`useEffect\` para configurar el timeout, y devuelve una función de limpieza para limpiar el timeout cuando el componente se desmonta o las dependencias cambian.`,
    hints: [
      "Usa useState para almacenar el valor retrasado.",
      "Usa useEffect con value y delay en las dependencias.",
      "Configura setTimeout para actualizar el valor retrasado después del delay.",
      "Devuelve una función de limpieza con clearTimeout cuando el efecto se re-ejecute o se desmonte.",
    ],
  },
  "portal-event-handling": {
    title: "Portal con Manejo de Eventos",
    description: `Un modal renderizado mediante Portal no se cierra al hacer clic afuera porque el evento de clic no burbujea a través de la frontera del portal.

**El Desafío:** Maneja eventos de clic que se originan desde un Portal para cerrar un modal.

**La Tarea:**
1. Crea un componente de modal usando \`createPortal\`.
2. Detecta clics fuera del modal (en la superposición).
3. Cierra el modal al hacer clic afuera.
4. Evita que el modal se cierre al hacer clic dentro de él.`,
    explanation: `Los Portals renderizan hijos en un nodo del DOM fuera de la jerarquía del componente padre. El burbujeo de eventos funciona normalmente a través de portals en React, pero necesitas manejar el clic en la superposición correctamente. La implementación actual debería funcionar, pero podrías necesitar agregar manejo de eventos adecuado para casos extremos. Usa \`stopPropagation\` en el contenido del modal para evitar que los clics internos cierren el modal.`,
    hints: [
      "Los Portals renderizan en document.body, así que el manejo de eventos funciona normalmente.",
      "Usa useRef para rastrear el elemento del modal para detección de clics externos.",
      "Usa useEffect para agregar/remover event listeners para la tecla escape y clics externos.",
      "Usa stopPropagation en el contenido del modal para evitar que se cierre al hacer clic dentro.",
    ],
  },
  "suspense-error-boundary": {
    title: "Suspense con Error Boundaries",
    description: `Un componente que usa Suspense para obtención de datos necesita un manejo de errores adecuado. Cuando el fetch falla, Suspense no captura errores: necesitas un Error Boundary.

**El Desafío:** Combina Suspense para estados de carga con Error Boundaries para manejo de errores.

**La Tarea:**
1. Crea un componente Error Boundary.
2. Envuelve Suspense con el Error Boundary.
3. Maneja correctamente tanto los estados de carga como los de error.
4. Proporciona una forma de reintentar después de un error.`,
    explanation: `Suspense maneja estados de carga capturando promesas lanzadas, pero no maneja errores. Necesitas un Error Boundary para capturar errores. Envuelve Suspense con un Error Boundary para manejar tanto estados de carga como de error. El Error Boundary captura errores, y Suspense maneja la promesa de carga.`,
    hints: [
      "Suspense maneja la carga (promesas), los Error Boundaries manejan errores.",
      "Envuelve Suspense con un Error Boundary para manejar ambos casos.",
      "El Error Boundary captura errores, Suspense maneja las promesas lanzadas.",
      "Proporciona un mecanismo de reintento en la interfaz de respaldo del Error Boundary.",
    ],
  },
  "ref-forwarding-chain": {
    title: "Cadena de Reenvío de Refs",
    description: `Necesitas reenviar un ref a través de múltiples niveles de componentes para acceder a un elemento DOM profundo en el árbol.

**El Desafío:** Reenvía un ref desde Parent -> Child -> Grandchild -> elemento DOM.

**La Tarea:**
1. Crea una cadena de componentes: Parent, Child, Grandchild.
2. Reenvía el ref desde Parent al elemento input en Grandchild.
3. Usa \`forwardRef\` y \`useImperativeHandle\` si es necesario.
4. Accede al elemento input desde el componente Parent.`,
    explanation: `Usa \`forwardRef\` para reenviar refs a través de las fronteras de los componentes. Cada componente en la cadena debe reenviar el ref al siguiente nivel. Usa \`useImperativeHandle\` si necesitas personalizar lo que se expone a través del ref. El ref finalmente llega al elemento DOM.`,
    hints: [
      "Usa forwardRef para reenviar refs a través de las fronteras de los componentes.",
      "Cada componente en la cadena debe reenviar el ref usando forwardRef.",
      "El ref finalmente llega al elemento DOM (input).",
      "Usa useImperativeHandle si necesitas personalizar la API del ref.",
    ],
  },
  "use-deferred-value": {
    title: "useDeferredValue para Búsqueda",
    description: `Un input de búsqueda con filtrado costoso hace que el input tenga retraso. Usa \`useDeferredValue\` para diferir el cálculo costoso mientras mantienes el input responsivo.

**El Desafío:** El input deja de responder durante el filtrado costoso.

**La Tarea:**
1. Usa \`useDeferredValue\` para diferir la consulta de búsqueda.
2. Mantén el valor del input inmediato (responsivo).
3. Usa el valor diferido para el filtrado costoso.
4. Muestra un indicador de carga cuando los valores difieren.`,
    explanation: `\`useDeferredValue\` te permite diferir la actualización de un valor, manteniendo la interfaz responsiva. El valor del input se actualiza inmediatamente, pero el valor diferido (usado para el filtrado) se actualiza después de que React termine el trabajo urgente. Compara los valores inmediato y diferido para mostrar un estado de carga cuando difieren.`,
    hints: [
      "useDeferredValue difiere la actualización de un valor, manteniendo la interfaz responsiva.",
      "Mantén el valor del input inmediato, difiere el valor usado para el filtrado.",
      "Compara los valores original y diferido para detectar estado pendiente.",
      "Usa el valor diferido en useMemo para cálculos costosos.",
    ],
  },
  "use-imperative-handle": {
    title: "useImperativeHandle para API Personalizada de Ref",
    description: `Necesitas exponer una API personalizada a través de un ref en lugar del elemento DOM por defecto. Usa \`useImperativeHandle\` para personalizar qué métodos/propiedades son accesibles a través del ref.

**El Desafío:** Crea un componente que exponga métodos personalizados (focus, reset, getValue) a través de un ref en lugar del elemento DOM sin procesar.

**La Tarea:**
1. Usa \`forwardRef\` y \`useImperativeHandle\` juntos.
2. Expone métodos personalizados: \`focus()\`, \`reset()\` y \`getValue()\`.
3. Oculta los detalles de implementación interna.`,
    explanation: `\`useImperativeHandle\` personaliza el valor de la instancia que se expone al usar refs. Se usa con \`forwardRef\` para exponer una API personalizada en lugar del elemento DOM por defecto. Esto es útil cuando quieres ocultar detalles de implementación y proporcionar una API más limpia.`,
    hints: [
      "useImperativeHandle se usa con forwardRef para personalizar la API del ref.",
      "El primer argumento es el ref, el segundo es una función que devuelve la API expuesta.",
      "Incluye dependencias en el tercer argumento del array si la API expuesta depende del estado.",
      "Usa un ref interno para acceder al elemento DOM real.",
    ],
  },
  "render-props-pattern": {
    title: "Patrón Render Props",
    description: `Crea un componente \`MouseTracker\` usando el patrón Render Props. El componente debe rastrear la posición del mouse y permitir a los consumidores renderizar una interfaz personalizada basada en la posición.

**El Desafío:** Implementa un componente reutilizable que proporcione funcionalidad de rastreo del mouse a través de render props.

**La Tarea:**
1. Crea un componente \`MouseTracker\` que rastree la posición del mouse.
2. Usa el patrón render props: \`children\` como función.
3. Pasa las coordenadas del mouse (x, y) a la función de renderizado.
4. Maneja los eventos de movimiento del mouse y la limpieza.`,
    explanation: `Render Props es un patrón donde el \`children\` de un componente (o una prop) es una función que recibe estado/datos y devuelve JSX. Esto permite una composición flexible y reutilización de código. El componente gestiona el estado/lógica, y el consumidor decide cómo renderizarlo.`,
    hints: [
      "El patrón Render Props usa children (o una prop) como función.",
      "El componente gestiona el estado y lo pasa a la función de renderizado.",
      "Llama a children como función: children(data) o children?.(data).",
      "Maneja la limpieza de event listeners en useEffect.",
    ],
  },
  "higher-order-component": {
    title: "Componente de Orden Superior (HOC)",
    description: `Crea un Componente de Orden Superior que agregue verificación de autenticación a cualquier componente. El HOC debe redirigir al login si el usuario no está autenticado.

**El Desafío:** Implementa un patrón HOC reutilizable para autenticación.

**La Tarea:**
1. Crea el HOC \`withAuth\` que envuelva componentes.
2. Verifica el estado de autenticación.
3. Muestra un estado de carga mientras se verifica.
4. Redirige al login si no está autenticado, de lo contrario renderiza el componente envuelto.`,
    explanation: `Los Componentes de Orden Superior (HOCs) son funciones que toman un componente y devuelven un nuevo componente con funcionalidad adicional. Son útiles para responsabilidades transversales como autenticación, registro o obtención de datos. El HOC envuelve el componente original y agrega el comportamiento extra.`,
    hints: [
      "Un HOC es una función que toma un componente y devuelve un nuevo componente.",
      "El componente devuelto envuelve al original y agrega funcionalidad extra.",
      "Propaga las props al componente envuelto: <WrappedComponent {...props} />.",
      "Maneja los estados de carga y autenticación antes de renderizar.",
    ],
  },
  "use-id-hook": {
    title: "useId para Identificadores Únicos",
    description: `Cuando se renderiza el mismo componente múltiples veces, usar IDs codificados causa IDs duplicados en el DOM. Usa \`useId\` para generar IDs únicos que funcionen con SSR.

**El Desafío:** Genera IDs únicos para labels e inputs de formularios que funcionen entre renders del servidor y del cliente.

**La Tarea:**
1. Usa \`useId\` para generar un ID base.
2. Crea IDs únicos para label e input usando el ID base.
3. Asegura que los IDs sean únicos incluso cuando el componente se renderiza múltiples veces.
4. Funciona correctamente con Server-Side Rendering.`,
    explanation: `\`useId\` genera IDs únicos que son estables entre renders del servidor y del cliente. Es perfecto para generar IDs para elementos de formulario, atributos ARIA y otros casos donde necesitas identificadores únicos. El ID es único por instancia de componente y funciona con la hidratación de SSR.`,
    hints: [
      "useId genera IDs únicos que funcionan con SSR.",
      "Cada instancia de componente obtiene un ID único automáticamente.",
      "Para múltiples elementos relacionados, agrega sufijos al ID base.",
      "No uses useId para keys en listas: usa IDs estables de los datos.",
    ],
  },
  "controlled-uncontrolled": {
    title: "Componentes Controlados vs No Controlados",
    description: `El input del formulario no se reinicia al hacer clic en el botón de reinicio. Corrígelo convirtiendo a un componente controlado o usando un ref para acceso no controlado.

**El Desafío:** Haz que el botón de reinicio funcione correctamente.

**La Tarea:**
1. Convierte a componente controlado (recomendado) O
2. Usa ref para acceder al valor del componente no controlado.
3. Implementa la funcionalidad de reinicio que limpie el input.`,
    explanation: `Los componentes controlados tienen su valor controlado por el estado de React. Los componentes no controlados almacenan su estado en el DOM y usan refs para acceder a él. Para la funcionalidad de reinicio, los componentes controlados son más fáciles: simplemente reinicia el estado. Para los no controlados, usa un ref para acceder al input y establecer su valor.`,
    hints: [
      "Componentes controlados: el valor lo controla el estado de React, onChange actualiza el estado.",
      "Componentes no controlados: el valor se almacena en el DOM, usa ref para acceder/establecer el valor.",
      "Para reiniciar, lo controlado es más fácil: simplemente reinicia el estado.",
      "Para no controlado, usa ref.current.value = '' para reiniciar.",
    ],
  },
  "react-lazy-suspense": {
    title: "División de Código con React.lazy",
    description: `El bundle de la aplicación es demasiado grande. Divide el componente pesado \`Chart\` en un chunk separado que se cargue solo cuando sea necesario.

**El Desafío:** Implementa la división de código usando \`React.lazy\` y \`Suspense\`.

**La Tarea:**
1. Usa \`React.lazy\` para importar dinámicamente el componente Chart.
2. Envuélvelo en \`Suspense\` con un fallback de carga.
3. Carga el componente solo cuando la pestaña esté activa.
4. Maneja estados de carga y error.`,
    explanation: `\`React.lazy\` habilita la división de código importando componentes dinámicamente. Devuelve un componente que carga el módulo bajo demanda. Envuélvelo en \`Suspense\` para mostrar un fallback mientras se carga. Esto reduce el tamaño del bundle inicial y mejora el tiempo de carga.`,
    hints: [
      "React.lazy toma una función que devuelve un import dinámico: () => import('./Component').",
      "Envuelve los componentes lazy en Suspense con una interfaz de fallback.",
      "El componente solo se carga cuando se renderiza por primera vez.",
      "Usa Error Boundaries para manejar errores de carga.",
    ],
  },
  "use-memo-vs-callback": {
    title: "useMemo vs useCallback: Cuándo Usar Cada Uno",
    description: `El componente se re-renderiza innecesariamente. Determina si usar \`useMemo\` o \`useCallback\` y corrige el problema de rendimiento.

**El Desafío:** Optimiza el componente memorizando los valores correctos.

**La Tarea:**
1. Identifica qué necesita memorización (valor vs función).
2. Usa \`useMemo\` para cálculos costosos o valores de objetos/arrays.
3. Usa \`useCallback\` para referencias de funciones pasadas como props.
4. Previene re-renders innecesarios.`,
    explanation: `\`useMemo\` memoriza valores calculados (objetos, arrays, primitivos). \`useCallback\` memoriza referencias de funciones. Usa \`useMemo\` cuando quieras evitar recalcular cómputos costosos o cuando pases objetos/arrays como props. Usa \`useCallback\` cuando pases funciones como props a componentes memorizados.`,
    hints: [
      "useMemo: memoriza valores calculados (objetos, arrays, primitivos).",
      "useCallback: memoriza referencias de funciones.",
      "Usa useMemo cuando pases objetos/arrays a componentes memorizados.",
      "Usa useCallback cuando pases funciones a componentes memorizados.",
    ],
  },
  "custom-hook-composition": {
    title: "Componiendo Hooks Personalizados",
    description: `Crea un hook complejo \`useForm\` componiendo hooks más simples: \`useInput\`, \`useValidation\` y \`useSubmit\`.

**El Desafío:** Construye un hook de formulario reutilizable componiendo hooks más pequeños.

**La Tarea:**
1. Crea el hook \`useInput\` para gestión de campos individuales.
2. Crea el hook \`useValidation\` para validación de campos.
3. Crea el hook \`useSubmit\` para envío de formularios.
4. Compónlos en el hook \`useForm\`.`,
    explanation: `Los hooks personalizados pueden componerse juntos para construir funcionalidad más compleja. Cada hook maneja una responsabilidad específica (gestión de input, validación, envío), y se componen juntos en un hook de nivel superior. Esto sigue el principio de responsabilidad única y hace que los hooks sean reutilizables.`,
    hints: [
      "Descompón la funcionalidad compleja en hooks más pequeños y enfocados.",
      "Cada hook debe manejar una responsabilidad (input, validación, envío).",
      "Compón los hooks en un hook de nivel superior que combine su funcionalidad.",
      "Usa useCallback para memorizar handlers y prevenir re-renders innecesarios.",
    ],
  },
  "use-sync-external-store": {
    title: "useSyncExternalStore para Estado Externo",
    description: `Crea un hook que se suscriba a un almacén externo (como un gestor de estado global) usando \`useSyncExternalStore\`.

**El Desafío:** Suscríbete a estado externo y maneja las actualizaciones correctamente.

**La Tarea:**
1. Crea un hook personalizado \`useStore\` que use \`useSyncExternalStore\`.
2. Suscríbete a los cambios del almacén.
3. Devuelve el valor actual del almacén.
4. Maneja el Server-Side Rendering (getServerSnapshot).`,
    explanation: `\`useSyncExternalStore\` es un hook de React 18 para suscribirse a almacenes externos. Asegura que los componentes se mantengan sincronizados con el estado externo y maneja SSR correctamente. Requiere una función de suscripción, una función getSnapshot, y opcionalmente getServerSnapshot para SSR.`,
    hints: [
      "useSyncExternalStore toma tres argumentos: subscribe, getSnapshot, getServerSnapshot.",
      "subscribe: función que se suscribe al almacén y devuelve una función de desuscripción.",
      "getSnapshot: función que devuelve el valor actual del almacén.",
      "getServerSnapshot: igual que getSnapshot, usado para la hidratación de SSR.",
    ],
  },
  "hydration-mismatch": {
    title: "Corrección de Desajuste de Hidratación",
    description: `La aplicación muestra un error de desajuste de hidratación porque el HTML renderizado en el servidor no coincide con el render del cliente. Corrígelo asegurando que servidor y cliente rendericen el mismo contenido.

**El Desafío:** Corrige los desajustes de hidratación causados por código exclusivo del cliente (localStorage, Date, Math.random).

**La Tarea:**
1. Identifica qué causa el desajuste (APIs exclusivas del cliente).
2. Usa \`useState\` con \`useEffect\` para diferir el renderizado exclusivo del cliente.
3. Muestra un marcador de posición durante SSR que coincida con el estado inicial del cliente.
4. Asegura que el HTML del servidor y del cliente coincidan.`,
    explanation: `Los desajustes de hidratación ocurren cuando el HTML renderizado en el servidor no coincide con lo que React renderiza en el cliente. Esto sucede con APIs exclusivas del cliente (localStorage, window, Date, Math.random). Corrígelo usando \`useState\` + \`useEffect\` para diferir el código exclusivo del cliente hasta después de la hidratación, o usa \`useLayoutEffect\` para actualizaciones síncronas.`,
    hints: [
      "Los desajustes de hidratación ocurren cuando el HTML del servidor y del cliente difieren.",
      "Usa useState con un valor por defecto que coincida con la salida del SSR.",
      "Usa useEffect para leer valores exclusivos del cliente (localStorage, window) después de la hidratación.",
      "Muestra un marcador de posición durante SSR que coincida con el estado inicial del cliente.",
    ],
  },
  "useimperativehandle-pattern": {
    title: "Patrón useImperativeHandle",
    description: `Crea un componente de input personalizado que exponga los métodos \`focus()\` y \`clear()\` a los componentes padres a través de un ref.

**El Desafío:** Los componentes padres necesitan controlar imperativamente los componentes hijos (como enfocar un input o limpiar su valor).

**La Tarea:**
1. Usa \`forwardRef\` para reenviar el ref al componente.
2. Usa \`useImperativeHandle\` para personalizar el valor expuesto del ref.
3. Expone los métodos \`focus()\` y \`clear()\` en el ref.
4. Mantén el ref interno del input privado.`,
    explanation: `\`useImperativeHandle\` te permite personalizar el valor de la instancia que se expone a los componentes padres al usar \`ref\`. Combinado con \`forwardRef\`, puedes exponer una API personalizada mientras mantienes los detalles de implementación privados.`,
    hints: [
      "forwardRef permite que un componente reciba un ref de su padre.",
      "useImperativeHandle personaliza lo que el ref expone.",
      "Mantén los refs internos privados y solo expone los métodos necesarios.",
      "El segundo argumento de useImperativeHandle es una función que devuelve el objeto expuesto.",
    ],
  },
  "abort-controller-fetch": {
    title: "Prevención de Condiciones de Carrera con AbortController",
    description: `Este componente tiene una condición de carrera: si el usuario escribe rápidamente, resultados de fetch más antiguos pueden llegar después de los más nuevos y sobrescribir el estado correcto.

**El Desafío:** Previene condiciones de carrera en efectos asíncronos cuando las dependencias cambian rápidamente.

**La Tarea:**
1. Usa AbortController para cancelar solicitudes fetch pendientes.
2. Pasa la señal de abort al fetch.
3. Limpia abortando en la función de limpieza de useEffect.
4. Ignora los errores de fetch abortado de forma elegante.`,
    explanation: `Las condiciones de carrera ocurren cuando múltiples operaciones asíncronas se completan en un orden diferente al que se iniciaron. AbortController te permite cancelar solicitudes fetch pendientes. Cuando el efecto se re-ejecuta o el componente se desmonta, cancela la solicitud anterior para que los datos obsoletos nunca actualicen el estado.`,
    hints: [
      "AbortController puede cancelar solicitudes fetch.",
      "Pasa controller.signal a las opciones de fetch.",
      "Llama a controller.abort() en la limpieza de useEffect.",
      "Verifica AbortError en el catch para ignorar solicitudes canceladas.",
    ],
  },
  "suspense-lazy-loading": {
    title: "División de Código con React.lazy y Suspense",
    description: `La aplicación agrupa todos los componentes juntos, haciendo que la carga inicial sea lenta. Implementa la división de código para cargar componentes pesados solo cuando se necesiten.

**El Desafío:** Los componentes grandes ralentizan la carga inicial de la página.

**La Tarea:**
1. Usa \`React.lazy()\` para importar dinámicamente componentes pesados.
2. Envuelve los componentes lazy con \`Suspense\` y proporciona un fallback.
3. Implementa error boundaries para cargas lazy fallidas.
4. Muestra estados de carga mientras los componentes se están obteniendo.`,
    explanation: `\`React.lazy()\` habilita importaciones dinámicas, dividiendo el código en chunks separados. \`Suspense\` muestra un fallback mientras el componente se carga. Esto reduce el tamaño del bundle inicial y acelera la primera carga. Cada componente lazy se obtiene solo cuando se renderiza.`,
    hints: [
      "React.lazy() toma una función que llama a import() dinámico.",
      "Suspense debe envolver los componentes lazy y proporcionar un fallback.",
      "Cada componente lazy crea un chunk de bundle separado.",
      "Considera envolver Suspense con ErrorBoundary para fallos de carga.",
    ],
  },
  "optimistic-updates": {
    title: "Actualizaciones Optimistas de la Interfaz",
    description: `La aplicación de tareas se siente lenta porque espera al servidor antes de actualizar la interfaz. Implementa actualizaciones optimistas para que se sienta instantánea.

**El Desafío:** La latencia de red hace que las operaciones CRUD se sientan lentas.

**La Tarea:**
1. Actualiza la interfaz inmediatamente antes de que la llamada a la API se complete.
2. Revierte al estado anterior si la llamada a la API falla.
3. Maneja los estados de error de forma elegante.
4. Usa useReducer para la gestión de estado complejo.`,
    explanation: `Las actualizaciones optimistas actualizan la interfaz inmediatamente, asumiendo que la llamada al servidor tendrá éxito. Si falla, se revierte al estado anterior. Esto hace que las aplicaciones se sientan instantáneas. Usa try/catch con restauración de estado, o useReducer para lógica de reversión más compleja.`,
    hints: [
      "Actualiza el estado ANTES de la llamada a la API, no después.",
      "Guarda el estado anterior para una posible reversión.",
      "Usa IDs temporales para los elementos optimistas.",
      "Restaura el estado anterior en el bloque catch en caso de fallo.",
    ],
  },
  "portal-modal": {
    title: "Portal para Superposición de Modal",
    description: `El modal se renderiza dentro de un componente profundamente anidado, causando problemas de z-index y desbordamiento. El modal se recorta por contenedores padre con overflow: hidden.

**El Desafío:** Los modales renderizados dentro de contenedores anidados tienen problemas de z-index y recorte.

**La Tarea:**
1. Usa \`createPortal\` para renderizar el modal fuera de la jerarquía del DOM.
2. Haz Portal a document.body o a una raíz dedicada para modales.
3. Maneja la accesibilidad (trampa de foco, tecla escape).
4. Limpia el portal al desmontar.`,
    explanation: `\`createPortal\` renderiza hijos en una parte diferente del árbol DOM, fuera de la jerarquía del componente padre. Esto resuelve problemas de z-index y recorte por desbordamiento. El modal sigue comportándose como un componente hijo (los eventos burbujean, el contexto funciona) pero se renderiza a nivel del body.`,
    hints: [
      "createPortal toma (children, container) como argumentos.",
      "document.body es un destino común de portal para modales.",
      "Los eventos siguen burbujeando a través del árbol DOM virtual de React.",
      "Agrega manejo de teclado para accesibilidad (Escape para cerrar).",
    ],
  },
  "reducer-action-types": {
    title: "Reducer con Tipado Seguro de Acciones",
    description: `El reducer tiene strings de tipos de acción dispersos por todas partes, haciéndolo propenso a errores. Implementa un patrón de reducer con tipado seguro usando TypeScript.

**El Desafío:** Los tipos de acción basados en strings son propensos a errores y carecen de autocompletado.

**La Tarea:**
1. Define los tipos de acción como constantes o enums.
2. Crea funciones creadoras de acciones tipadas.
3. Usa uniones discriminadas para los tipos de acción.
4. Asegura el manejo exhaustivo de acciones en el reducer.`,
    explanation: `Usa uniones discriminadas de TypeScript para crear reducers con tipado seguro. Define los tipos de acción como una unión de objetos de acción específicos. Los creadores de acciones proporcionan seguridad de tipos y autocompletado. El compilador detecta errores tipográficos y payloads incorrectos.`,
    hints: [
      "Usa uniones discriminadas para los tipos de acción.",
      "Los creadores de acciones proporcionan seguridad de tipos y encapsulación.",
      "El tipo 'never' en el default asegura el manejo exhaustivo.",
      "TypeScript detectará errores tipográficos en los tipos de acción.",
    ],
  },
  "form-controlled-validation": {
    title: "Formulario Controlado con Validación en Tiempo Real",
    description: `Construye un formulario de registro con validación en tiempo real que muestre errores mientras el usuario escribe, pero solo después de que haya interactuado con cada campo.

**El Desafío:** Muestra errores de validación en el momento correcto: no en el render inicial, no mientras se escribe activamente, sino después de que el campo ha sido tocado.

**La Tarea:**
1. Rastrea el estado de "tocado" para cada campo.
2. Valida al perder el foco y al enviar.
3. Muestra errores solo para campos tocados con errores.
4. Deshabilita el envío cuando el formulario es inválido.`,
    explanation: `Rastrea el estado 'touched' (tocado) para cada campo para saber cuándo mostrar errores. Valida al perder el foco (al salir de un campo) y al enviar. Muestra errores solo para campos que están tanto tocados como inválidos. Usa useMemo para calcular el estado de validación eficientemente.`,
    hints: [
      "Rastrea el estado 'touched' separadamente de los valores.",
      "Usa onBlur para marcar los campos como tocados.",
      "Solo muestra errores para campos tocados que tengan errores.",
      "Toca todos los campos al enviar para revelar todos los errores.",
    ],
  },
  "context-split-optimization": {
    title: "División de Context para Rendimiento",
    description: `La aplicación re-renderiza todo cuando cambia cualquier valor del contexto. El objeto de usuario cambia raramente, pero alternar el tema causa que todos los consumidores se re-rendericen.

**El Desafío:** Un solo contexto con múltiples valores causa re-renders innecesarios.

**La Tarea:**
1. Divide el contexto en múltiples contextos más pequeños.
2. Agrupa los valores por frecuencia de actualización.
3. Usa providers separados para cada contexto.
4. Solo los componentes que usan el contexto cambiado se re-renderizan.`,
    explanation: `Divide el contexto por frecuencia de actualización. Los datos de usuario rara vez cambian. El tema puede cambiar ocasionalmente. Las notificaciones cambian frecuentemente. Cada provider de contexto envuelve a los hijos, y los consumidores solo se re-renderizan cuando cambia su contexto específico.`,
    hints: [
      "Divide el contexto según la frecuencia de cambio de cada valor.",
      "Los valores que cambian frecuentemente deben tener su propio contexto.",
      "Usa useMemo para memorizar los valores del contexto.",
      "Crea hooks personalizados para cada contexto para una API más limpia.",
    ],
  },
  "custom-hook-composition-2": {
    title: "Hooks Personalizados Componibles",
    description: `Crea un conjunto de hooks personalizados componibles que puedan combinarse para operaciones asíncronas complejas con funcionalidad de carga, error y reintento.

**El Desafío:** Construye hooks reutilizables que manejen patrones asíncronos comunes.

**La Tarea:**
1. Crea un hook \`useAsync\` para operaciones asíncronas.
2. Agrega capacidad de reintento automático.
3. Maneja estados de carga y error.
4. Haz los hooks componibles para casos de uso complejos.`,
    explanation: `Los hooks personalizados encapsulan lógica con estado reutilizable. Crea un hook base \`useAsync\` que maneje estados de carga, error y datos. Agrega funciones como reintento, activación manual y caché. Compón hooks juntos para casos de uso complejos.`,
    hints: [
      "Comienza con un hook base useAsync para todas las operaciones asíncronas.",
      "Devuelve una función execute para activación manual.",
      "Agrega lógica de reintento con retroceso exponencial.",
      "Construye hooks específicos (useFetch, useMutation) sobre los hooks base.",
    ],
  },
  "memo-children-optimization": {
    title: "Optimización de Props Children",
    description: `Incluso con React.memo, el componente hijo se re-renderiza porque la prop children cambia de referencia en cada render.

**El Desafío:** React.memo no funciona cuando la prop children se usa de forma ingenua.

**La Tarea:**
1. Comprende por qué children rompe la memorización.
2. Usa render props o patrones de composición.
3. Mueve children a una referencia estable.
4. Elige el patrón correcto para diferentes casos de uso.`,
    explanation: `Cuando se usa children como render prop, la función en línea crea una nueva referencia en cada render, rompiendo la memorización. Soluciones: 1) Usar useCallback para la render prop, 2) Extraer children a un componente, 3) Usar composición en lugar de render props.`,
    hints: [
      "Las funciones en línea crean nuevas referencias en cada render.",
      "useCallback estabiliza las referencias de render props.",
      "Extrae elementos repetidos a componentes memorizados.",
      "useMemo puede memorizar estructuras completas de children.",
    ],
  },
  "use-id-accessibility": {
    title: "Formularios Accesibles con useId",
    description: `Las etiquetas de formulario no están correctamente asociadas con los inputs, rompiendo la accesibilidad con lectores de pantalla. Genera IDs únicos y estables para los elementos del formulario.

**El Desafío:** Los IDs codificados pueden chocar en SSR o cuando los componentes se reutilizan.

**La Tarea:**
1. Usa el hook \`useId\` para generar IDs únicos.
2. Asocia labels con inputs usando htmlFor/id.
3. Usa IDs para aria-describedby en mensajes de error.
4. Asegura que los IDs sean estables entre servidor/cliente.`,
    explanation: `\`useId\` genera IDs únicos que son estables entre renders del servidor y del cliente. Usa estos IDs para pares htmlFor/id para asociar labels con inputs, y para aria-describedby para vincular mensajes de error. Cada instancia de componente obtiene su propio ID único.`,
    hints: [
      "useId genera IDs únicos por instancia de componente.",
      "Usa el mismo ID base con sufijos para elementos relacionados.",
      "htmlFor en el label debe coincidir con el id del input.",
      "aria-describedby vincula los inputs con sus mensajes de error.",
    ],
  },
  "debounce-search-input": {
    title: "Input de Búsqueda con Debounce",
    description: `El input de búsqueda dispara una solicitud a la API en cada pulsación de tecla, causando problemas de rendimiento y límites de tasa.

**El Desafío:** Demasiadas llamadas a la API cuando el usuario escribe rápidamente.

**La Tarea:**
1. Implementa debouncing para retrasar la llamada a la API.
2. Solo llama a la API después de que el usuario deje de escribir por 300ms.
3. Cancela las llamadas pendientes cuando el componente se desmonte.
4. Muestra un estado de carga mientras espera.`,
    explanation: `El debouncing retrasa la ejecución hasta después de una pausa en los eventos. Usa setTimeout para esperar, y limpia el timeout si el valor cambia antes de que se dispare. Esto previene llamadas excesivas a la API cuando los usuarios escriben rápidamente.`,
    hints: [
      "Usa setTimeout para retrasar la llamada a la API.",
      "Limpia el timeout en la limpieza de useEffect.",
      "Usa dos valores de estado: el valor inmediato del input y el valor con debounce.",
      "Solo haz fetch cuando cambie el valor con debounce.",
    ],
  },
  "infinite-scroll-list": {
    title: "Scroll Infinito con IntersectionObserver",
    description: `La lista carga todos los elementos de una vez, causando una carga inicial lenta y mal rendimiento con grandes conjuntos de datos.

**El Desafío:** Implementa un scroll infinito eficiente que cargue más elementos a medida que el usuario se desplaza.

**La Tarea:**
1. Usa IntersectionObserver para detectar cuando el usuario se desplaza cerca del final.
2. Carga más elementos cuando el elemento centinela sea visible.
3. Maneja estados de carga y previene solicitudes duplicadas.
4. Limpia el observer al desmontar.`,
    explanation: `IntersectionObserver detecta cuando un elemento entra en el viewport. Coloca un elemento "centinela" al final de la lista y obsérvalo. Cuando sea visible, carga más elementos. Desconecta el observer en la limpieza para prevenir fugas de memoria.`,
    hints: [
      "IntersectionObserver detecta la visibilidad de elementos.",
      "Usa un callback de ref para observar el último elemento.",
      "Desconecta los observers anteriores antes de crear nuevos.",
      "Rastrea los estados de loading y hasMore para prevenir problemas.",
    ],
  },
  "drag-and-drop-list": {
    title: "Lista Reordenable con Drag and Drop",
    description: `Crea una lista donde los elementos puedan reordenarse arrastrando. Usa la API nativa de Drag and Drop de HTML5.

**El Desafío:** Implementa reordenamiento por arrastrar y soltar sin bibliotecas externas.

**La Tarea:**
1. Haz los elementos de la lista arrastrables.
2. Maneja los eventos dragstart, dragover y drop.
3. Muestra retroalimentación visual durante el arrastre.
4. Actualiza el estado cuando se reordenen los elementos.`,
    explanation: `El Drag and Drop de HTML5 usa el atributo draggable y handlers de eventos. Almacena el índice del elemento arrastrado en dataTransfer. Al soltar, calcula el nuevo orden y actualiza el estado. Usa dragover para habilitar soltar y mostrar retroalimentación visual.`,
    hints: [
      "Establece draggable={true} en los elementos de la lista.",
      "preventDefault() en dragover habilita soltar.",
      "Usa dataTransfer para pasar datos entre eventos de arrastre.",
      "Usa splice e insert para reordenar el array.",
    ],
  },
  "virtual-list-performance": {
    title: "Lista Virtualizada para Grandes Volúmenes de Datos",
    description: `La lista renderiza 10,000 elementos causando que el navegador se congele. Implementa virtualización para renderizar solo los elementos visibles.

**El Desafío:** Renderizar miles de nodos DOM destruye el rendimiento.

**La Tarea:**
1. Calcula qué elementos son visibles en el viewport.
2. Solo renderiza los elementos visibles más un pequeño búfer.
3. Usa posicionamiento absoluto para mantener el comportamiento de scroll.
4. Maneja los eventos de scroll eficientemente.`,
    explanation: `La virtualización renderiza solo los elementos visibles. Calcula el rango visible desde scrollTop y la altura del contenedor. Usa posicionamiento absoluto con transform para posicionar los elementos. Agrega elementos búfer arriba/abajo para un scroll suave.`,
    hints: [
      "Calcula startIndex desde scrollTop / itemHeight.",
      "Usa un div espaciador con la altura total para habilitar scroll nativo.",
      "Posiciona los elementos visibles de forma absoluta según su índice.",
      "Agrega elementos búfer arriba y abajo del área visible.",
    ],
  },
};

// The second "custom-hook-composition" challenge in the data has a duplicate id.
// Map the internal duplicate to its translation key.
// (The array in reactChallengesData.ts contains two entries with id "custom-hook-composition";
// the second one is effectively id index 48 – "Composable Custom Hooks".)
// Because getReactChallengeById returns the *first* match, the second one
// is unreachable through that helper. We keep the translation entry above
// under "custom-hook-composition-2" for documentation, but it won't be
// served unless the source data fixes the duplicate id.

export function getReactChallengeForLocale(
  locale: Locale,
  id: string
): ReactChallenge | undefined {
  const base = getReactChallengeById(id);
  if (!base) return undefined;
  if (locale !== "es") return base;
  const es = REACT_CHALLENGES_ES[id];
  if (!es) return base;
  return { ...base, ...es };
}
