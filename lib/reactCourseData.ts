/**
 * React Course - Lessons from militalearning adapted for agencypartner2.
 * Uses Monaco editor with TypeScript/React autocomplete and live preview.
 */

import type { WebCourseLesson } from "./webCourseTypes";

function buildReactLessons(): WebCourseLesson[] {
  const raw: (Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & { content: [string, string] })[] = [
    {
      title: "React 1: Your First Component",
      content: [
        "Welcome to React! A **component** is a function that returns JSX (HTML with superpowers). Use `App` and `export default App` as the root so the preview knows what to render.",
        "Create your first component `Gatito` that shows '¡Miau! Soy un gatito feliz 🐱'. Use it in `App` with `<Gatito />` and `export default App`.",
      ],
      defaultCode: `function Gatito() {\n  return <h1>¡Miau! Soy un gatito feliz 🐱</h1>;\n}\n\nfunction App() {\n  return <Gatito />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("function Gatito") || code.includes("const Gatito")) && code.includes("return") && (code.includes("<h1>") || code.includes("Miau")),
        message: "🐱 Your first React component is ready!",
      }),
    },
    {
      title: "React 2: Props",
      content: [
        "Components can receive **props** (properties). Props are like gifts you pass to your component.",
        "Create a component `Perrito` that receives a prop `nombre` and shows '¡Guau! Soy {nombre} 🐶'. Use it in `App` with `<Perrito nombre=\"Max\" />` and `export default App`.",
      ],
      defaultCode: `function Perrito({ nombre }) {\n  return <h2>¡Guau! Soy {nombre} 🐶</h2>;\n}\n\nfunction App() {\n  return <Perrito nombre="Max" />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("{ nombre }") || code.includes("props.nombre")) && (code.includes("{nombre}") || code.includes("props.nombre")),
        message: "🐶 Props mastered!",
      }),
    },
    {
      title: "React 3: JSX and nesting",
      content: [
        "In React we use **JSX** to create HTML. JSX is like HTML but inside JavaScript.",
        "Create a component `Conejita` that returns a div with a paragraph saying '¡Hop! Soy una conejita saltarina 🐰'. Use it in `App` with `<Conejita />` and `export default App`.",
      ],
      defaultCode: `function Conejita() {\n  return (\n    <div>\n      <p>¡Hop! ¡Hop! Soy una conejita saltarina 🐰</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Conejita />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("<div>") && code.includes("<p>") && code.includes("Conejita"),
        message: "🐰 JSX learned!",
      }),
    },
    {
      title: "React 4: Multiple props",
      content: [
        "Components can have **multiple props**. You can pass as many properties as you want.",
        "Create a component `Pajarito` that receives `nombre` and `cancion` as props and shows '{nombre} canta: {cancion} 🐦'. Use it in `App`: `<Pajarito nombre=\"Piolín\" cancion=\"Tweet tweet\" />` and `export default App`.",
      ],
      defaultCode: `function Pajarito({ nombre, cancion }) {\n  return <p>{nombre} canta: {cancion} 🐦</p>;\n}\n\nfunction App() {\n  return <Pajarito nombre="Piolín" cancion="Tweet tweet" />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.match(/\{\s*\w+\s*,\s*\w+\s*\}/g) || []).length > 0 && code.includes("nombre") && code.includes("cancion"),
        message: "🐦 Multiple props mastered!",
      }),
    },
    {
      title: "Composition I: Components inside components",
      content: [
        "**Composition** is putting components inside others. Create `Titulo`, `Cuerpo`, and `Tarjeta` that uses them with JSX.",
        "Create `Titulo`, `Cuerpo` and `Tarjeta`. `Tarjeta` must render `<Titulo />` and `<Cuerpo />` inside a div. `App` renders `<Tarjeta />` and `export default App`.",
      ],
      defaultCode: `function Titulo() {\n  return <h2>Mi Tarjeta</h2>;\n}\n\nfunction Cuerpo() {\n  return <p>Contenido aquí.</p>;\n}\n\nfunction Tarjeta() {\n  return (\n    <div className="tarjeta">\n      <Titulo />\n      <Cuerpo />\n    </div>\n  );\n}\n\nfunction App() {\n  return <Tarjeta />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("Titulo") && code.includes("Cuerpo") && code.includes("Tarjeta") && (code.includes("<Titulo />") || code.includes("<Titulo/>")) && (code.includes("<Cuerpo />") || code.includes("<Cuerpo/>")),
        message: "🧩 Composition mastered!",
      }),
    },
    {
      title: "Composition II: Passing props when composing",
      content: [
        "When composing, the **parent** passes props to **children**. Create `Saludo` that receives `nombre` and `Pagina` that uses `<Saludo nombre=\"Milita\" />`.",
        "Create `Saludo({ nombre })` that shows 'Hola, {nombre}!'. Create `Pagina` that renders `<Saludo nombre=\"Milita\" />` and a paragraph. `App` uses `<Pagina />` and `export default App`.",
      ],
      defaultCode: `function Saludo({ nombre }) {\n  return <h2>Hola, {nombre}!</h2>;\n}\n\nfunction Pagina() {\n  return (\n    <div>\n      <Saludo nombre="Milita" />\n      <p>Bienvenida a la lección de composición.</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Pagina />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("Saludo") && (code.includes("{ nombre }") || code.includes("nombre")) && code.includes("Pagina") && (code.includes('nombre="Milita"') || code.includes('nombre=\\"Milita\\"')),
        message: "🧩 Props when composing mastered!",
      }),
    },
    {
      title: "React 5: className",
      content: [
        "Use **className** in JSX (instead of 'class') to style your components.",
        "Create a component `Osito` with a div with `className=\"abrazador\"` that shows '¡Abrazo de osito! 🐻'. Use it in `App` with `<Osito />` and `export default App`.",
      ],
      defaultCode: `function Osito() {\n  return <div className="abrazador">¡Abrazo de osito! 🐻</div>;\n}\n\nfunction App() {\n  return <Osito />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("className=") || code.includes("className =")) && code.includes("Osito"),
        message: "🐻 className learned!",
      }),
    },
    {
      title: "React 6: Inline styles",
      content: [
        "Components can have **inline styles** using JavaScript objects. Use `style={{ color: 'pink', fontSize: '20px' }}`.",
        "Create a component `Mariposa` with a div that has inline style `style={{ color: 'pink', fontSize: '20px' }}` and shows '¡Vuelo libre! 🦋'. Use it in `App` with `<Mariposa />` and `export default App`.",
      ],
      defaultCode: `function Mariposa() {\n  return (\n    <div style={{ color: 'pink', fontSize: '20px' }}>\n      ¡Vuelo libre! 🦋\n    </div>\n  );\n}\n\nfunction App() {\n  return <Mariposa />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("style={{") || code.includes("style={{")) && code.includes("color:"),
        message: "🦋 Inline styles mastered!",
      }),
    },
    {
      title: "React 7: Lists with map",
      content: [
        "You can use **arrays** in JSX to render lists. Use `map` to transform each item into JSX. Always provide a unique `key` prop.",
        "Create a component `Elefante` that shows a list of friends using `map`. Create `amigos = ['Luna', 'Sol', 'Estrella']` and `{amigos.map(...)}`. Use it in `App` with `<Elefante />` and `export default App`.",
      ],
      defaultCode: `function Elefante() {\n  const amigos = ['Luna', 'Sol', 'Estrella'];\n  return (\n    <ul>\n      {amigos.map(amigo => <li key={amigo}>{amigo} 🐘</li>)}\n    </ul>\n  );\n}\n\nfunction App() {\n  return <Elefante />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes(".map(") && (code.includes("['") || code.includes('["')) && code.includes("key="),
        message: "🐘 Lists in JSX mastered!",
      }),
    },
    {
      title: "React 8: Conditionals in JSX",
      content: [
        "Components can use **conditionals** with `&&` or `? :`. Render different content based on props or state.",
        "Create a component `Pinguino` that receives a prop `feliz` (true/false). If happy, show '¡Estoy bailando! 🐧', otherwise 'Estoy triste 😢'. Use it in `App`: `<Pinguino feliz={true} />` and `export default App`.",
      ],
      defaultCode: `function Pinguino({ feliz }) {\n  return (\n    <div>\n      {feliz ? <p>¡Estoy bailando! 🐧</p> : <p>Estoy triste 😢</p>}\n    </div>\n  );\n}\n\nfunction App() {\n  return <Pinguino feliz={true} />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("?") && code.includes(":") && code.includes("feliz"),
        message: "🐧 Conditionals in JSX learned!",
      }),
    },
    {
      title: "React 9: useState",
      content: [
        "**useState** is a hook that remembers values. The component re-renders when the state changes.",
        "Create a component `Canguro` that uses `useState` to count jumps. Use `const [saltos, setSaltos] = useState(0)` and a button that increments the count.",
      ],
      defaultCode: `import { useState } from 'react';\nfunction Canguro() {\n  const [saltos, setSaltos] = useState(0);\n  return (\n    <div>\n      <p>Saltos: {saltos} 🦘</p>\n      <button onClick={() => setSaltos(saltos + 1)}>Saltar</button>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Canguro />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useState") && (code.includes("setSaltos") || code.includes("setState")) && code.includes("onClick"),
        message: "🦘 useState mastered!",
      }),
    },
    {
      title: "React 10: Events (onClick)",
      content: [
        "Components can have **events** like `onClick`. The dolphin wants to play when you click!",
        "Create a component `Delfin` with a button that has `onClick` and shows '¡Splash! Estoy jugando 🐬' when clicked. Use it in `App` with `<Delfin />` and `export default App`.",
      ],
      defaultCode: `function Delfin() {\n  const handleClick = () => {\n    console.log("¡Splash! Estoy jugando 🐬");\n  };\n  return <button onClick={handleClick}>¡Hazme clic!</button>;\n}\n\nfunction App() {\n  return <Delfin />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("onClick=") && code.includes("handleClick"),
        message: "🐬 Events learned!",
      }),
    },
  ];

  return raw.map((lesson, i) => {
    const id = `react-${i + 1}`;
    const next = i < raw.length - 1 ? `react-${i + 2}` : undefined;
    const prev = i > 0 ? `react-${i}` : undefined;
    return {
      ...lesson,
      id,
      step: i + 1,
      nextStep: next,
      prevStep: prev,
      content: lesson.content,
    };
  });
}

export const REACT_COURSE_LESSONS = buildReactLessons();

export function getReactLessonById(slug: string): WebCourseLesson | undefined {
  return REACT_COURSE_LESSONS.find((l) => l.id === slug);
}
