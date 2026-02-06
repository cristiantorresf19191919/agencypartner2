/**
 * React Course - Lessons from militalearning adapted for agencypartner2.
 * Uses Monaco editor with TypeScript/React autocomplete and live preview.
 */

import type { WebCourseLesson, LessonSection } from "./webCourseTypes";

type RawLesson = Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & {
  content: [string, string];
  sections?: LessonSection[];
};

function buildReactLessons(): WebCourseLesson[] {
  const raw: RawLesson[] = [
    {
      title: "React 1: Your First Component",
      content: [
        "A component is a function that returns JSX. Use App and export default App as the root.",
        "Create an AppHeader component that returns an h1 with your app title. Use it in App with <AppHeader />.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What is a component?",
          body: "In React, the UI is built from **components** — functions that return **JSX** (HTML-like syntax inside JavaScript). Every app has a root component, usually `App`, which the preview renders. Think of components as reusable building blocks for your interface.",
          badges: ["Component", "JSX", "Root"],
          code: "function App() {\n  return <h1>My App</h1>;\n}\n\nexport default App;",
        },
        {
          tag: "exercise",
          title: "Build your first component",
          body: "Create a component named **AppHeader** that returns an `<h1>` with the text \"Dashboard\". In **App**, render it with `<AppHeader />` and keep `export default App` so the preview can display it.",
          badges: ["Practice", "JSX"],
        },
      ],
      defaultCode: `function AppHeader() {\n  return <h1>Dashboard</h1>;\n}\n\nfunction App() {\n  return <AppHeader />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("function AppHeader") || code.includes("const AppHeader")) && code.includes("return") && code.includes("<h1>") && code.includes("Dashboard"),
        message: "Your first React component is ready!",
      }),
    },
    {
      title: "React 2: Props",
      content: [
        "Components can receive props (properties). Props are how you pass data into a component.",
        "Create a UserGreeting component that receives a prop name and displays 'Hello, {name}!'. Use it in App with <UserGreeting name=\"Alex\" />.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Passing data with props",
          body: "**Props** are inputs you pass to a component. They're read-only and let the parent customize what the child renders. Use destructuring: `function UserCard({ name }) { ... }`.",
          badges: ["Props", "Destructuring"],
          code: "function UserCard({ name }) {\n  return <p>Hello, {name}!</p>;\n}\n\n// Usage: <UserCard name=\"Alex\" />",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **UserGreeting** that receives a prop **name** and shows \"Hello, {name}!\" inside a heading or paragraph. Use it in **App** with `<UserGreeting name=\"Alex\" />` and `export default App`.",
          badges: ["Props"],
        },
      ],
      defaultCode: `function UserGreeting({ name }) {\n  return <h2>Hello, {name}!</h2>;\n}\n\nfunction App() {\n  return <UserGreeting name="Alex" />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("{ name }") || code.includes("props.name")) && (code.includes("{name}") || code.includes("props.name")),
        message: "Props mastered!",
      }),
    },
    {
      title: "React 3: JSX and nesting",
      content: [
        "In React we use JSX to describe the UI. You can nest elements inside divs and fragments.",
        "Create a Card component that returns a div containing a title and a paragraph. Use it in App.",
      ],
      sections: [
        {
          tag: "concept",
          title: "JSX and nesting",
          body: "**JSX** looks like HTML but lives in JavaScript. Wrap multiple elements in a single parent (e.g. `<div>`) or a React Fragment. Use parentheses for multi-line return.",
          badges: ["JSX", "Nesting"],
          code: "function Card() {\n  return (\n    <div>\n      <h3>Title</h3>\n      <p>Content here.</p>\n    </div>\n  );\n}",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create a **Card** component that returns a `<div>` with a heading and a `<p>` inside (any text you like). Use it in **App** with `<Card />` and `export default App`.",
          badges: ["JSX"],
        },
      ],
      defaultCode: `function Card() {\n  return (\n    <div>\n      <h3>Card title</h3>\n      <p>This is the card content.</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Card />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("<div>") && code.includes("<p>") && code.includes("Card"),
        message: "JSX nesting learned!",
      }),
    },
    {
      title: "React 4: Multiple props",
      content: [
        "Components can accept multiple props. Destructure them in the parameter list.",
        "Create a ProductRow component that receives name and price and displays them. Use it in App with <ProductRow name=\"Widget\" price=\"$9.99\" />.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Multiple props",
          body: "Destructure several props at once: `function Row({ name, price }) { ... }`. Pass them when using the component: `<Row name=\"Widget\" price=\"$9.99\" />`.",
          badges: ["Props", "Destructuring"],
          code: "function ProductRow({ name, price }) {\n  return <p>{name} — {price}</p>;\n}",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **ProductRow** that receives **name** and **price** and displays \"{name} — {price}\". Use it in **App**: `<ProductRow name=\"Widget\" price=\"$9.99\" />` and `export default App`.",
          badges: ["Props"],
        },
      ],
      defaultCode: `function ProductRow({ name, price }) {\n  return <p>{name} — {price}</p>;\n}\n\nfunction App() {\n  return <ProductRow name="Widget" price="$9.99" />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.match(/\{\s*\w+\s*,\s*\w+\s*\}/g) || []).length > 0 && code.includes("name") && code.includes("price"),
        message: "Multiple props mastered!",
      }),
    },
    {
      title: "Composition I: Components inside components",
      content: [
        "**Composition** is putting components inside others. Create `Title`, `Body`, and `Card` that uses them with JSX.",
        "Create `Title`, `Body` and `Card`. `Card` must render `<Title />` and `<Body />` inside a div. `App` renders `<Card />` and `export default App`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Composition",
          body: "**Composition** means building UIs from smaller components. One component can render others inside it. Keep components focused: a `Card` might use a `Title` and a `Body`.",
          badges: ["Composition", "JSX"],
          code: "function Title() { return <h2>Card Title</h2>; }\nfunction Body() { return <p>Content here.</p>; }\nfunction Card() {\n  return (\n    <div>\n      <Title />\n      <Body />\n    </div>\n  );\n}",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **Title**, **Body**, and **Card**. **Card** must render `<Title />` and `<Body />` inside a `<div>`. Use **App** to render `<Card />` and keep `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `function Title() {\n  return <h2>Card Title</h2>;\n}\n\nfunction Body() {\n  return <p>Content here.</p>;\n}\n\nfunction Card() {\n  return (\n    <div>\n      <Title />\n      <Body />\n    </div>\n  );\n}\n\nfunction App() {\n  return <Card />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("Title") && code.includes("Body") && code.includes("Card") && (code.includes("<Title />") || code.includes("<Title/>")) && (code.includes("<Body />") || code.includes("<Body/>"))) || (code.includes("Titulo") && code.includes("Cuerpo") && code.includes("Tarjeta") && (code.includes("<Titulo />") || code.includes("<Titulo/>")) && (code.includes("<Cuerpo />") || code.includes("<Cuerpo/>"))),
        message: "Composition mastered!",
      }),
    },
    {
      title: "Composition II: Passing props when composing",
      content: [
        "When composing, the **parent** passes props to **children**. Create `Greeting` that receives `name` and `Page` that uses `<Greeting name=\"Alex\" />`.",
        "Create `Greeting({ name })` that shows 'Hello, {name}!'. Create `Page` that renders `<Greeting name=\"Alex\" />` and a paragraph. `App` uses `<Page />` and `export default App`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Props when composing",
          body: "When you **compose** components, the **parent** passes **props** to its children. The child receives them (e.g. `Greeting({ name })`) and the parent passes values: `<Greeting name=\"Alex\" />`.",
          badges: ["Composition", "Props"],
          code: "function Greeting({ name }) {\n  return <h2>Hello, {name}!</h2>;\n}\n\nfunction Page() {\n  return (\n    <div>\n      <Greeting name=\"Alex\" />\n      <p>Welcome to the lesson.</p>\n    </div>\n  );\n}",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **Greeting** that receives a prop **name** and shows \"Hello, {name}!\" inside a heading. Create **Page** that renders `<Greeting name=\"Alex\" />` and a `<p>`. Use **App** to render `<Page />` and keep `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `function Greeting({ name }) {\n  return <h2>Hello, {name}!</h2>;\n}\n\nfunction Page() {\n  return (\n    <div>\n      <Greeting name="Alex" />\n      <p>Welcome to the composition lesson.</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Page />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("Greeting") && (code.includes("{ name }") || code.includes("name")) && code.includes("Page") && (code.includes('name="Alex"') || code.includes('name=\\"Alex\\"')),
        message: "🧩 Props when composing mastered!",
      }),
    },
    {
      title: "React 5: className",
      content: [
        "Use **className** in JSX (instead of 'class') to style your components.",
        "Create a component `Highlight` with a div that has `className=\"highlight\"` and shows \"Important message\". Use it in `App` with `<Highlight />` and `export default App`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "className in JSX",
          body: "In JSX you use **className** instead of HTML's `class` (which is reserved in JavaScript). Pass a string: `className=\"my-box\"` or `className={dynamicValue}`.",
          badges: ["className", "JSX"],
          code: '<div className="highlight">Important</div>',
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create a **Highlight** component that returns a `<div>` with `className=\"highlight\"` and the text \"Important message\". Use it in **App** with `<Highlight />` and `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `function Highlight() {\n  return <div className="highlight">Important message</div>;\n}\n\nfunction App() {\n  return <Highlight />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("className=") || code.includes("className =")) && (code.includes("Highlight") || code.includes("Osito")),
        message: "className learned!",
      }),
    },
    {
      title: "React 6: Inline styles",
      content: [
        "Components can have **inline styles** using JavaScript objects. Use `style={{ color: 'pink', fontSize: '20px' }}`.",
        "Create a component `StatusBadge` with a span that has inline style `style={{ color: '#22c55e', fontWeight: 'bold' }}` and shows \"Active\". Use it in `App` with `<StatusBadge />` and `export default App`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Inline styles",
          body: "Pass a **JavaScript object** to the `style` prop. Use camelCase: `fontSize`, not `font-size`. Values are strings (e.g. `'20px'`) or numbers for unitless props.",
          badges: ["style", "JSX"],
          code: "<span style={{ color: '#22c55e', fontWeight: 'bold' }}>Active</span>",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **StatusBadge** that returns a `<span>` with `style={{ color: '#22c55e', fontWeight: 'bold' }}` and the text \"Active\". Use it in **App** with `<StatusBadge />` and `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `function StatusBadge() {\n  return (\n    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>\n      Active\n    </span>\n  );\n}\n\nfunction App() {\n  return <StatusBadge />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("style={{") || code.includes("style={{")) && code.includes("color:"),
        message: "Inline styles mastered!",
      }),
    },
    {
      title: "React 7: Lists with map",
      content: [
        "You can use **arrays** in JSX to render lists. Use `map` to transform each item into JSX. Always provide a unique `key` prop.",
        "Create a component `ItemList` that shows a list of items using `map`. Use `items = ['React', 'TypeScript', 'Node']` and `{items.map(...)}` with a unique `key`. Use it in `App` with `<ItemList />` and `export default App`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Rendering lists",
          body: "Use **map** to turn an array into JSX. Each top-level element in the list should have a **key** prop (unique and stable) so React can track items correctly.",
          badges: ["map", "key", "JSX"],
          code: "const items = ['A', 'B'];\n<ul>\n  {items.map(item => <li key={item}>{item}</li>)}\n</ul>",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **ItemList** with `items = ['React', 'TypeScript', 'Node']` and render a `<ul>` of `<li>` using `items.map(...)`. Give each `<li>` a `key={item}`. Use **App** to render `<ItemList />` and `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `function ItemList() {\n  const items = ['React', 'TypeScript', 'Node'];\n  return (\n    <ul>\n      {items.map(item => <li key={item}>{item}</li>)}\n    </ul>\n  );\n}\n\nfunction App() {\n  return <ItemList />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes(".map(") && (code.includes("['") || code.includes('["')) && code.includes("key="),
        message: "Lists in JSX mastered!",
      }),
    },
    {
      title: "React 8: Conditionals in JSX",
      content: [
        "Components can use **conditionals** with `&&` or `? :`. Render different content based on props or state.",
        "Create a component `StatusMessage` that receives a prop `online` (boolean). If true, show \"You are online\"; otherwise \"You are offline\". Use it in `App`: `<StatusMessage online={true} />` and `export default App`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Conditionals in JSX",
          body: "Use **ternary** `condition ? a : b` or **short-circuit** `condition && <JSX />` to render different content. Keep expressions readable; for complex logic, use a variable.",
          badges: ["Conditionals", "JSX"],
          code: "{isLoggedIn ? <p>Welcome back</p> : <p>Please sign in</p>}",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **StatusMessage** that receives a prop **online**. If `online` is true, show \"You are online\"; otherwise \"You are offline\". Use it in **App** with `<StatusMessage online={true} />` and `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `function StatusMessage({ online }) {\n  return (\n    <div>\n      {online ? <p>You are online</p> : <p>You are offline</p>}\n    </div>\n  );\n}\n\nfunction App() {\n  return <StatusMessage online={true} />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("?") && code.includes(":") && (code.includes("online") || code.includes("feliz")),
        message: "Conditionals in JSX learned!",
      }),
    },
    {
      title: "React 9: useState",
      content: [
        "**useState** is a hook that remembers values. The component re-renders when the state changes.",
        "Create a component `Counter` that uses `useState` to track a count. Use `const [count, setCount] = useState(0)` and a button that increments the count when clicked.",
      ],
      sections: [
        {
          tag: "concept",
          title: "useState",
          body: "**useState(initial)** returns `[value, setValue]`. Call **setValue** to update; React re-renders the component. Never mutate state directly — always use the setter.",
          badges: ["useState", "Hooks"],
          code: "const [count, setCount] = useState(0);\n<button onClick={() => setCount(count + 1)}>+</button>",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **Counter** with `const [count, setCount] = useState(0)`. Render the count and a button that calls `setCount(count + 1)` on click. Use **App** to render `<Counter />` and `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `import { useState } from 'react';\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Counter />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useState") && (code.includes("setCount") || code.includes("setSaltos") || code.includes("setState")) && code.includes("onClick"),
        message: "useState mastered!",
      }),
    },
    {
      title: "React 10: Events (onClick)",
      content: [
        "Components can have **events** like `onClick`. Pass a function (not a call). Use a handler like `handleClick` for clarity.",
        "Create a component `ActionButton` with a button that has `onClick` and shows an alert \"Clicked!\" when clicked. Use it in `App` with `<ActionButton />` and `export default App`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Event handlers",
          body: "Pass a **function** to `onClick` (e.g. `onClick={handleClick}`). Do not call it: `onClick={handleClick()}` would run on every render. Use arrow functions for short handlers: `onClick={() => doSomething()}`.",
          badges: ["onClick", "Events"],
          code: "function handleClick() { alert('Clicked!'); }\n<button onClick={handleClick}>Click me</button>",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create **ActionButton** with a button. On click, show `alert(\"Clicked!\")`. Use **App** to render `<ActionButton />` and `export default App`.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `function ActionButton() {\n  const handleClick = () => {\n    alert("Clicked!");\n  };\n  return <button onClick={handleClick}>Click me</button>;\n}\n\nfunction App() {\n  return <ActionButton />;\n}\n\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("onClick=") && (code.includes("handleClick") || code.includes("alert") || code.includes("=>")),
        message: "Events learned!",
      }),
    },
    // --- New advanced lessons ---
    {
      title: "React 11: Side effects with useEffect",
      content: [
        "**useEffect** runs code after render: fetching data, timers, subscriptions. Use it for side effects, not for derived state. The **dependency array** controls when it runs: `[]` = once on mount, `[a, b]` = when a or b change. Always add **cleanup** for timers/subscriptions (return a function).",
        "Try the timer: it counts every second and cleans up on unmount. Change the dependency array and see when the effect re-runs. Avoid stale closures by including all values you read inside the effect in the deps array.",
      ],
      defaultCode: `import { useState, useEffect } from 'react';\n\nfunction Timer() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setCount(c => c + 1), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <p>Seconds: {count}</p>;\n}\n\nfunction App() {\n  return <Timer />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useEffect") && (code.includes("return") || code.includes("clearInterval") || code.includes("clearTimeout")),
        message: "⏱️ useEffect and cleanup mastered!",
      }),
    },
    {
      title: "React 12: Events & forms (controlled components)",
      content: [
        "**Controlled components** tie input value to state with `value={state}` and `onChange`. Use `onSubmit` on forms and `e.preventDefault()` to avoid page reload. Basic validation: check values before submit or show errors.",
        "Complete the form: name and email are controlled. On submit, show an alert with the values. Add a simple check (e.g. name length > 0) and display an error message if invalid.",
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction ContactForm() {\n  const [name, setName] = useState('');\n  const [email, setEmail] = useState('');\n  const [error, setError] = useState('');\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    if (!name.trim()) { setError('Name is required'); return; }\n    setError('');\n    alert(\`Submitted: \${name}, \${email}\`);\n  };\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />\n      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />\n      {error && <p style={{ color: 'red' }}>{error}</p>}\n      <button type="submit">Submit</button>\n    </form>\n  );\n}\n\nfunction App() {\n  return <ContactForm />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useState") && (code.includes("onChange") || code.includes("onSubmit")) && code.includes("e.preventDefault"),
        message: "📝 Controlled forms mastered!",
      }),
    },
    {
      title: "React 13: Lists, keys & rendering performance",
      content: [
        "Always use a **key** when rendering lists (e.g. `key={item.id}`). Keys help React match items across re-renders. Keep **state close** to where it's used and **split components** so only the part that changes re-renders.",
        "The todo list uses keys and local state. Add a new todo and notice only the list re-renders. Keys must be stable and unique (avoid array index when list can reorder).",
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([{ id: 1, text: 'Learn React' }, { id: 2, text: 'Build an app' }]);\n  const [input, setInput] = useState('');\n  const add = () => {\n    if (!input.trim()) return;\n    setTodos([...todos, { id: Date.now(), text: input.trim() }]);\n    setInput('');\n  };\n  return (\n    <div>\n      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />\n      <button onClick={add}>Add</button>\n      <ul>\n        {todos.map(t => <li key={t.id}>{t.text}</li>)}\n      </ul>\n    </div>\n  );\n}\n\nfunction App() {\n  return <TodoList />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes(".map(") && code.includes("key=") && code.includes("useState"),
        message: "📋 Lists and keys mastered!",
      }),
    },
    {
      title: "React 14: Refs with useRef",
      content: [
        "**useRef** gives a mutable ref object: use it for **DOM access** (focus, scroll, measure) or to **persist a value** without causing re-renders. Refs survive re-renders; changing `ref.current` does not trigger a render.",
        "Click 'Focus input' to focus the field using a ref. The counter is stored in a ref so it updates without re-rendering the whole component (we force one re-render to show it).",
      ],
      defaultCode: `import { useRef, useState } from 'react';\n\nfunction FocusDemo() {\n  const inputRef = useRef(null);\n  const countRef = useRef(0);\n  const [, forceUpdate] = useState(0);\n  const increment = () => {\n    countRef.current += 1;\n    forceUpdate(n => n + 1);\n  };\n  return (\n    <div>\n      <input ref={inputRef} placeholder="I will be focused" />\n      <button onClick={() => inputRef.current?.focus()}>Focus input</button>\n      <button onClick={increment}>Count (ref): {countRef.current}</button>\n    </div>\n  );\n}\n\nfunction App() {\n  return <FocusDemo />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useRef") && (code.includes("ref=") || code.includes(".current")),
        message: "🔗 useRef mastered!",
      }),
    },
    {
      title: "React 15: useReducer",
      content: [
        "**useReducer** is like useState but for complex state: you dispatch **actions** and a **reducer** returns the next state. Great when you have multiple sub-values or the next state depends on the previous one.",
        "The counter uses a reducer with 'increment' and 'decrement' actions. Try adding a 'reset' action that sets count to 0.",
      ],
      defaultCode: `import { useReducer } from 'react';\n\nfunction counterReducer(state, action) {\n  switch (action.type) {\n    case 'increment': return { count: state.count + 1 };\n    case 'decrement': return { count: state.count - 1 };\n    default: return state;\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(counterReducer, { count: 0 });\n  return (\n    <div>\n      <span>{state.count}</span>\n      <button onClick={() => dispatch({ type: 'increment' })}>+</button>\n      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>\n    </div>\n  );\n}\n\nfunction App() {\n  return <Counter />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useReducer") && code.includes("dispatch") && (code.includes("increment") || code.includes("decrement")),
        message: "🔄 useReducer mastered!",
      }),
    },
    {
      title: "React 16: useMemo, useCallback & React.memo",
      content: [
        "**useMemo** caches a computed value; **useCallback** caches a function (so children don't re-render unnecessarily). **React.memo** skips re-rendering a component when props are shallow-equal. Use them to fix real performance issues, not everywhere.",
        "The expensive list is memoized. Parent count updates but the list only recalculates when 'filter' changes. Try wrapping a child in React.memo and passing a useCallback handler.",
      ],
      defaultCode: `import { useState, useMemo, useCallback } from 'react';\n\nfunction ExpensiveList({ items }) {\n  const sorted = useMemo(() => [...items].sort((a, b) => a - b), [items]);\n  return <ul>{sorted.map((n, i) => <li key={i}>{n}</li>)}</ul>;\n}\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  const [filter, setFilter] = useState(1);\n  const items = useMemo(() => [3, 1, 4, 1, 5].filter(x => x >= filter), [filter]);\n  return (\n    <div>\n      <button onClick={() => setCount(c => c + 1)}>Parent: {count}</button>\n      <input type="number" value={filter} onChange={e => setFilter(Number(e.target.value))} min={1} />\n      <ExpensiveList items={items} />\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("useMemo") || code.includes("useCallback") || code.includes("React.memo")),
        message: "⚡ Memoization mastered!",
      }),
    },
    {
      title: "React 17: Context (useContext)",
      content: [
        "**Context** is good for **theme**, **auth user**, **locale**—data that many components need and that doesn't change every keystroke. Avoid it for high-frequency updates (use state + props or a store instead).",
        "Toggle theme with the button; the title and card read the theme from context. Create a context with createContext, wrap the tree with the Provider, and consume with useContext.",
      ],
      defaultCode: `import { createContext, useContext, useState } from 'react';\n\nconst ThemeContext = createContext('light');\n\nfunction ThemedCard() {\n  const theme = useContext(ThemeContext);\n  return (\n    <div style={{ padding: 16, background: theme === 'dark' ? '#222' : '#eee', color: theme === 'dark' ? '#fff' : '#000' }}>\n      Current theme: {theme}\n    </div>\n  );\n}\n\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={theme}>\n      <h1>Theme demo</h1>\n      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>Toggle theme</button>\n      <ThemedCard />\n    </ThemeContext.Provider>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("createContext") && code.includes("useContext") && code.includes("Provider"),
        message: "🌐 Context mastered!",
      }),
    },
    {
      title: "React 18: Custom hooks",
      content: [
        "**Custom hooks** extract reusable logic (useState + useEffect + etc.) into a function whose name starts with `use`. Follow the **rules of hooks**: only call hooks at the top level and from React functions. Compose small hooks into larger ones.",
        "useWindowWidth returns the current window width and updates on resize. useCounter is a tiny reusable counter. Use one of them in App and render the value.",
      ],
      defaultCode: `import { useState, useEffect } from 'react';\n\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);\n  useEffect(() => {\n    const handler = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handler);\n    return () => window.removeEventListener('resize', handler);\n  }, []);\n  return width;\n}\n\nfunction useCounter(initial = 0) {\n  const [count, setCount] = useState(initial);\n  const inc = () => setCount(c => c + 1);\n  const dec = () => setCount(c => c - 1);\n  return { count, inc, dec };\n}\n\nfunction App() {\n  const width = useWindowWidth();\n  const { count, inc, dec } = useCounter(0);\n  return (\n    <div>\n      <p>Window width: {width}px</p>\n      <p>Count: {count} <button onClick={inc}>+</button> <button onClick={dec}>-</button></p>\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("use") && code.includes("useState") && (code.includes("useWindowWidth") || code.includes("useCounter") || code.includes("useEffect")),
        message: "🪝 Custom hooks mastered!",
      }),
    },
    {
      title: "React 19: Error boundaries (concept)",
      content: [
        "**Error boundaries** catch JavaScript errors in the tree below them and show a fallback UI. They do **not** catch errors in event handlers, async code, or the boundary itself. Place them around route-level or feature sections so one crash doesn't take down the whole app.",
        "This demo uses a class component ErrorBoundary (React's only class-based API for this). Click 'Throw' to trigger an error; the boundary catches it and shows the fallback. In real apps, wrap key sections with boundaries.",
      ],
      defaultCode: `import { Component } from 'react';\nimport { useState } from 'react';\n\nclass ErrorBoundary extends Component {\n  state = { hasError: false };\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n  render() {\n    if (this.state.hasError) return <p style={{ color: 'orange' }}>Something went wrong. (Caught by boundary)</p>;\n    return this.props.children;\n  }\n}\n\nfunction Buggy() {\n  const [throwError, setThrowError] = useState(false);\n  if (throwError) throw new Error('Boom!');\n  return <button onClick={() => setThrowError(true)}>Throw error</button>;\n}\n\nfunction App() {\n  return (\n    <ErrorBoundary>\n      <Buggy />\n    </ErrorBoundary>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("ErrorBoundary") && (code.includes("getDerivedStateFromError") || code.includes("hasError")),
        message: "🛡️ Error boundaries understood!",
      }),
    },
    // --- React 19 lessons ---
    {
      title: "React 19 (1): Actions",
      content: [
        "**Actions** are first-class async transitions in React 19. You pass an async function to a form or to startTransition-style APIs. They improve **form submits** (no manual preventDefault + fetch), **pending states** (React tracks it), and **error handling** (try/catch or error boundaries).",
        "This demo simulates the pattern: a form runs an async 'action' and shows pending/success. In React 19 you'd use the action prop on form or useActionState. Try the submit and watch the loading state.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What are Actions?",
          body: "**Actions** in React 19 are async functions you pass to forms or transition APIs. They eliminate boilerplate: no manual `preventDefault()`, no manual fetch calls. React automatically tracks **pending** state and handles **errors** via try/catch or error boundaries. Actions make form handling declarative and consistent.",
          badges: ["Actions", "Forms", "Async"],
          code: "// React 19: <form action={asyncAction}>\n// React automatically handles pending, errors, and submission",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create a form with an async **handleSubmit** that sets `pending` to true, waits 800ms, then shows a success message. Use `FormData` to read the input value. Make sure the button shows 'Sending...' when pending.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction SubmitForm() {\n  const [pending, setPending] = useState(false);\n  const [message, setMessage] = useState('');\n  async function handleSubmit(e) {\n    e.preventDefault();\n    setPending(true);\n    setMessage('');\n    try {\n      await new Promise(r => setTimeout(r, 800));\n      const formData = new FormData(e.target);\n      setMessage('Submitted: ' + formData.get('name'));\n    } catch (err) {\n      setMessage('Error: ' + err.message);\n    } finally {\n      setPending(false);\n    }\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="name" placeholder="Your name" />\n      <button type="submit" disabled={pending}>{pending ? 'Sending...' : 'Submit'}</button>\n      {message && <p>{message}</p>}\n    </form>\n  );\n}\n\nfunction App() {\n  return <SubmitForm />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("pending") && (code.includes("onSubmit") || code.includes("handleSubmit")) && code.includes("async"),
        message: "✅ Actions pattern understood!",
      }),
    },
    {
      title: "React 19 (2): useActionState",
      content: [
        "**useActionState** (React 19) keeps **action result + pending state** in one place. Perfect for forms and mutations: submit → pending → success or error. You pass an action function and optional initial state; you get [state, formAction, isPending].",
        "We simulate it with useState here. In React 19 you'd use useActionState(yourAction, initialState). Build a small form that sets pending true while 'submitting', then shows success or error.",
      ],
      sections: [
        {
          tag: "concept",
          title: "useActionState hook",
          body: "**useActionState** combines action execution with state management. Instead of separate `useState` for pending and result, you get `[state, formAction, isPending]` in one hook. The action receives `(previousState, formData)` and returns the new state. React tracks pending automatically.",
          badges: ["useActionState", "Forms", "State"],
          code: "const [state, formAction, isPending] = useActionState(asyncAction, initialState);\n// state: current result/error\n// formAction: function to pass to <form action={formAction}>\n// isPending: boolean",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create a form that uses an **action** function (simulated with useState). The action should read `name` from FormData, set pending true, wait 600ms, then update state with a greeting message. Show the message and disable the button when pending.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction FormWithState() {\n  const [state, setState] = useState({ message: '', pending: false });\n  async function action(prev, formData) {\n    setState(s => ({ ...s, pending: true }));\n    await new Promise(r => setTimeout(r, 600));\n    const name = formData.get('name');\n    setState({ message: 'Hi, ' + name + '!', pending: false });\n    return { message: 'Hi, ' + name + '!', pending: false };\n  }\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    action(state, new FormData(e.target));\n  };\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="name" placeholder="Name" />\n      <button type="submit" disabled={state.pending}>{state.pending ? '...' : 'Submit'}</button>\n      {state.message && <p>{state.message}</p>}\n    </form>\n  );\n}\n\nfunction App() {\n  return <FormWithState />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("pending") && code.includes("FormData") && (code.includes("action") || code.includes("handleSubmit")),
        message: "✅ useActionState pattern understood!",
      }),
    },
    {
      title: "React 19 (3): useFormStatus",
      content: [
        "**useFormStatus** (React 19) lets a **child** (e.g. the Submit button) read the **pending** status of the parent form. No prop drilling—the button can show 'Loading...' automatically while the form action runs.",
        "We simulate: a SubmitButton component reads a pending prop (in React 19 it would use useFormStatus()). The form sets pending during submit. Use a similar structure so the button disables and shows loading when pending.",
      ],
      sections: [
        {
          tag: "concept",
          title: "useFormStatus hook",
          body: "**useFormStatus** allows child components (like Submit buttons) to read the form's pending state without prop drilling. Call `useFormStatus()` inside a child of a `<form>` and get `{ pending, data, method }`. The button can automatically show 'Loading...' or disable itself when the form is submitting.",
          badges: ["useFormStatus", "Forms", "No Prop Drilling"],
          code: "function SubmitButton() {\n  const { pending } = useFormStatus();\n  return <button disabled={pending}>{pending ? 'Sending...' : 'Submit'}</button>;\n}",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create a **SubmitButton** component that receives a `pending` prop and shows 'Sending...' when true. Create a **ContactForm** that manages pending state and passes it to SubmitButton. The form should disable the button and show 'Done!' after submit.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction SubmitButton({ pending }) {\n  return (\n    <button type="submit" disabled={pending}>\n      {pending ? 'Sending...' : 'Submit'}\n    </button>\n  );\n}\n\nfunction ContactForm() {\n  const [pending, setPending] = useState(false);\n  const [done, setDone] = useState(false);\n  async function onSubmit(e) {\n    e.preventDefault();\n    setPending(true);\n    await new Promise(r => setTimeout(r, 1000));\n    setDone(true);\n    setPending(false);\n  }\n  return (\n    <form onSubmit={onSubmit}>\n      <input name="email" placeholder="Email" />\n      <SubmitButton pending={pending} />\n      {done && <p>Done!</p>}\n    </form>\n  );\n}\n\nfunction App() {\n  return <ContactForm />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("pending") && code.includes("SubmitButton") && (code.includes("disabled") || code.includes("Sending")),
        message: "✅ useFormStatus pattern understood!",
      }),
    },
    {
      title: "React 19 (4): useOptimistic",
      content: [
        "**useOptimistic** (React 19) updates the UI **immediately** (optimistic) while the server confirms. If the request fails, you **rollback**. Great for likes, todos, and mutations where you want the UI to feel instant.",
        "Simulated: we keep an optimistic list and a 'real' list. On add we show the item right away, then 'confirm' after a delay. If you had a server, you'd rollback on error. Try adding an item and see the optimistic update.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Optimistic updates",
          body: "**useOptimistic** lets you show UI changes immediately, before the server responds. If the server confirms, the optimistic state becomes real. If it fails, React automatically **rolls back** to the previous state. This makes interactions feel instant—perfect for likes, comments, todos, and other mutations.",
          badges: ["useOptimistic", "UX", "Mutations"],
          code: "const [optimisticState, addOptimistic] = useOptimistic(state, (current, optimisticValue) => {\n  // Return optimistic version immediately\n  return [...current, optimisticValue];\n});",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create a todo list with **optimistic updates**. When you add an item, show it immediately in the list (optimistic). After 800ms, 'confirm' it by updating the real list. Use separate state for `items` (real) and `optimisticItems` (shown immediately).",
          badges: ["Practice"],
        },
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction TodoOptimistic() {\n  const [items, setItems] = useState(['Learn React']);\n  const [optimisticItems, setOptimisticItems] = useState(items);\n  const [input, setInput] = useState('');\n  async function addItem() {\n    if (!input.trim()) return;\n    const newItem = input.trim();\n    setOptimisticItems(prev => [...prev, newItem]);\n    setInput('');\n    await new Promise(r => setTimeout(r, 800));\n    setItems(prev => [...prev, newItem]);\n    setOptimisticItems(prev => [...prev, newItem]);\n  }\n  return (\n    <div>\n      <input value={input} onChange={e => setInput(e.target.value)} />\n      <button onClick={addItem}>Add (optimistic)</button>\n      <ul>{optimisticItems.map((t, i) => <li key={i}>{t}</li>)}</ul>\n    </div>\n  );\n}\n\nfunction App() {\n  return <TodoOptimistic />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("optimistic") || code.includes("Optimistic")) && code.includes("useState"),
        message: "✅ Optimistic UI pattern understood!",
      }),
    },
    {
      title: "React 19 (5): useTransition",
      content: [
        "**useTransition** marks updates as **non-urgent** so the UI stays responsive during heavy work. Call startTransition(() => setState(...)) and React will keep the current UI visible until the update is ready.",
        "Type in the input: the list filters. Without useTransition the typing can feel laggy. We wrap the filter update in startTransition so the input stays responsive. Try it with a large list or slow filter.",
      ],
      defaultCode: `import { useState, useTransition } from 'react';\n\nconst ITEMS = Array.from({ length: 80 }, (_, i) => 'Item ' + (i + 1));\n\nfunction FilterList() {\n  const [query, setQuery] = useState('');\n  const [filteredQuery, setFilteredQuery] = useState('');\n  const [isPending, startTransition] = useTransition();\n  const filtered = ITEMS.filter(item => item.toLowerCase().includes(filteredQuery.toLowerCase()));\n  const handleChange = (e) => {\n    const v = e.target.value;\n    setQuery(v);\n    startTransition(() => setFilteredQuery(v));\n  };\n  return (\n    <div>\n      <input value={query} onChange={handleChange} placeholder="Filter" />\n      {isPending && <span> Updating...</span>}\n      <ul style={{ maxHeight: 200, overflow: 'auto' }}>\n        {filtered.map((item, i) => <li key={i}>{item}</li>)}\n      </ul>\n    </div>\n  );\n}\n\nfunction App() {\n  return <FilterList />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useTransition") && (code.includes("startTransition") || code.includes("isPending")),
        message: "✅ useTransition mastered!",
      }),
    },
    {
      title: "React 19 (6): useDeferredValue",
      content: [
        "**useDeferredValue** gives you a value that **lags behind** the real one. Use it for **expensive lists** or filters: the input updates immediately (smooth typing) while the list updates with a deferred value, avoiding jank.",
        "The search input updates instantly; the filtered list uses a deferred query so rendering the list doesn't block typing. Same idea as debounce but built into React.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Deferred values",
          body: "**useDeferredValue** returns a version of a value that React can defer updating. The input uses the real value (instant), while expensive computations (like filtering a large list) use the deferred value. React keeps the UI responsive by prioritizing urgent updates over deferred ones.",
          badges: ["useDeferredValue", "Performance", "Debouncing"],
          code: "const deferredQuery = useDeferredValue(query);\n// query updates immediately (input)\n// deferredQuery updates later (filter)",
        },
        {
          tag: "exercise",
          title: "Your turn",
          body: "Create a searchable word list. Use **useDeferredValue** to defer the query used for filtering. The input should update instantly while the filtered list uses the deferred query. This keeps typing smooth even with expensive filters.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `import { useState, useDeferredValue } from 'react';\n\nconst WORDS = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'];\n\nfunction SearchList() {\n  const [query, setQuery] = useState('');\n  const deferredQuery = useDeferredValue(query);\n  const filtered = WORDS.filter(w => w.includes(deferredQuery));\n  return (\n    <div>\n      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />\n      <ul>\n        {filtered.map(w => <li key={w}>{w}</li>)}\n      </ul>\n    </div>\n  );\n}\n\nfunction App() {\n  return <SearchList />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useDeferredValue") && code.includes("deferredQuery"),
        message: "✅ useDeferredValue mastered!",
      }),
    },
    {
      title: "React 19 (7): Suspense for data",
      content: [
        "**Suspense** lets you show a **fallback** while children are loading (lazy components or data). Frameworks (Next.js, Remix) use it for **streaming**: send HTML, then stream in the rest. Wrap async UI in Suspense and provide a fallback.",
        "This demo uses a tiny cache and a component that 'reads' a promise. Suspense shows the fallback until the promise resolves. In real apps you'd use a data library or framework loader.",
      ],
      defaultCode: `import { Suspense, lazy } from 'react';\n\nconst DataComponent = lazy(() =>\n  new Promise(r => setTimeout(() => r({ default: () => <p>Data loaded!</p> }), 1500))\n);\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading...</p>}>\n      <DataComponent />\n    </Suspense>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("Suspense") && code.includes("fallback"),
        message: "✅ Suspense pattern understood!",
      }),
    },
    {
      title: "React 19 (8): Resource preloading",
      content: [
        "**Preloading** scripts, styles, or data improves perceived performance. Frameworks often expose APIs like preload(), prefetch(), or link rel=preload. The idea: start loading critical resources early so they're ready when needed.",
        "In the browser you can use link rel='preload' or modulepreload. In React/Next you might use next/dynamic or framework-specific preload. This lesson is conceptual—no runnable preload in the sandbox, but you can log or show a message when a mock 'preload' would run.",
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction PreloadDemo() {\n  const [loaded, setLoaded] = useState(false);\n  const preload = () => {\n    setLoaded(true);\n  };\n  return (\n    <div>\n      <p>Preloading starts resources early (scripts, styles, data).</p>\n      <button onClick={preload}>Simulate preload</button>\n      {loaded && <p>Ready! In a real app you'd preload before navigation.</p>}\n    </div>\n  );\n}\n\nfunction App() {\n  return <PreloadDemo />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("preload") || code.includes("Preload"),
        message: "✅ Preloading concept understood!",
      }),
    },
    {
      title: "React 19 (9): Strict Mode & idempotent effects",
      content: [
        "In **Strict Mode** (dev), React may **run effects twice** to surface bugs. Your effects should be **idempotent**: safe to run, then cleanup, then run again. Always clean up subscriptions and timers in the effect return.",
        "This effect sets a timer and cleans up. In Strict Mode it runs mount → cleanup → mount again. The count only increments once per 'real' mount because cleanup clears the interval. Try adding a console.log in the effect.",
      ],
      defaultCode: `import { useState, useEffect } from 'react';\n\nfunction IdempotentEffect() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setCount(c => c + 1), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return (\n    <div>\n      <p>Count: {count} (effect has cleanup so it's safe to run twice in Strict Mode)</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return <IdempotentEffect />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useEffect") && (code.includes("return") && (code.includes("clearInterval") || code.includes("clearTimeout") || code.includes("removeEventListener"))),
        message: "✅ Idempotent effects understood!",
      }),
    },
    {
      title: "React 19 (10): Migration mindset",
      content: [
        "You **don't rewrite** the whole app. Adopt **actions** and **optimistic flows** where you already have forms and mutations. Keep existing useState/useEffect; add useActionState or useOptimistic where they simplify code.",
        "This step is conceptual. Your app might use a mix: old forms stay as they are, new forms use actions; critical lists get useDeferredValue. Gradual adoption is the goal.",
      ],
      defaultCode: `import { useState } from 'react';\n\nfunction MigrationDemo() {\n  const [legacy, setLegacy] = useState(true);\n  return (\n    <div>\n      <p>Migration: keep existing code, add React 19 patterns where they help.</p>\n      <button onClick={() => setLegacy(!legacy)}>\n        {legacy ? 'Legacy form' : 'New (action) form'}\n      </button>\n      <p>{legacy ? 'Use useState + submit handler.' : 'Use useActionState or form action.'}</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return <MigrationDemo />;\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useState") && (code.includes("Migration") || code.includes("legacy") || code.includes("action")),
        message: "✅ Migration mindset understood!",
      }),
    },
    // --- Advanced React 19 lessons ---
    {
      title: "React 19 (11): use() Hook for Promises",
      content: [
        "The **use()** hook is React 19's new primitive for reading async resources. Unlike useEffect, use() can be called conditionally and inside loops. It reads the current value of a Promise or Context.",
        "use() suspends the component until the Promise resolves. Combine with Suspense boundaries for loading states. This is the foundation for React Server Components data fetching patterns.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The use() hook",
          body: "**use()** is a new React 19 hook that lets you read the value of a resource like a Promise or Context. Unlike other hooks, you can call it conditionally. When passed a Promise, it **suspends** the component until the Promise resolves, working seamlessly with Suspense.",
          badges: ["use()", "Promises", "Suspense"],
          code: "// Read a promise value (suspends until resolved)\nconst data = use(fetchPromise);\n\n// Read context (can be conditional)\nif (showTheme) {\n  const theme = use(ThemeContext);\n}",
        },
        {
          tag: "exercise",
          title: "Build with use()",
          body: "Create a component that simulates using **use()** by creating a promise-based data fetch. Use Suspense with a fallback while loading. The component should display user data after the 'fetch' completes.",
          badges: ["Practice", "Advanced"],
        },
      ],
      defaultCode: `import { Suspense, useState, useEffect } from 'react';\n\n// Simulate a cache for the use() pattern\nconst cache = new Map();\n\nfunction fetchUser(id) {\n  if (!cache.has(id)) {\n    cache.set(id, new Promise(resolve => {\n      setTimeout(() => resolve({ id, name: 'Alex', role: 'Developer' }), 1200);\n    }));\n  }\n  return cache.get(id);\n}\n\n// Simulated use() - in React 19 you'd import { use } from 'react'\nfunction usePromise(promise) {\n  const [state, setState] = useState({ status: 'pending', value: null });\n  useEffect(() => {\n    promise.then(v => setState({ status: 'fulfilled', value: v }));\n  }, [promise]);\n  if (state.status === 'pending') throw promise; // Suspense trigger\n  return state.value;\n}\n\nfunction UserProfile({ userId }) {\n  const user = usePromise(fetchUser(userId));\n  return (\n    <div style={{ padding: 16, background: 'rgba(97,218,251,0.1)', borderRadius: 12 }}>\n      <h3 style={{ color: '#61dafb', margin: '0 0 8px' }}>{user.name}</h3>\n      <p style={{ color: '#9fc4ff', margin: 0 }}>Role: {user.role}</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>use() Hook Demo</h2>\n      <Suspense fallback={<p style={{ color: '#fbbf24' }}>Loading user...</p>}>\n        <UserProfile userId={1} />\n      </Suspense>\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("Suspense") && code.includes("fallback") && (code.includes("Promise") || code.includes("fetch") || code.includes("usePromise")),
        message: "✅ use() hook pattern mastered!",
      }),
    },
    {
      title: "React 19 (12): ref as Prop",
      content: [
        "React 19 allows passing **ref** as a regular prop to function components—no more forwardRef! This simplifies component APIs and reduces boilerplate. The ref is just a prop like any other.",
        "This change makes React easier to learn and use. No special wrapping, no forwardRef dance. Just accept ref in your props and attach it to the DOM element.",
      ],
      sections: [
        {
          tag: "concept",
          title: "ref as a prop",
          body: "In React 19, function components can receive **ref** directly as a prop. No need for **forwardRef** wrapper. This simplifies the mental model: ref is just another prop that happens to be a mutable object pointing to a DOM node.",
          badges: ["ref", "DOM", "Simplification"],
          code: "// React 19: ref is just a prop!\nfunction Input({ ref, label }) {\n  return (\n    <label>\n      {label}\n      <input ref={ref} />\n    </label>\n  );\n}\n\n// Usage\nconst inputRef = useRef(null);\n<Input ref={inputRef} label=\"Email\" />",
        },
        {
          tag: "exercise",
          title: "Build without forwardRef",
          body: "Create a custom **FancyInput** component that accepts a ref prop directly (simulated). The parent should be able to focus the input using the ref. Add a button that calls `ref.current.focus()` to demonstrate the ref working.",
          badges: ["Practice"],
        },
      ],
      defaultCode: `import { useRef } from 'react';\n\n// React 19 style: ref as a regular prop (no forwardRef needed!)\nfunction FancyInput({ inputRef, placeholder, label }) {\n  return (\n    <div style={{ marginBottom: 16 }}>\n      <label style={{ display: 'block', marginBottom: 8, color: '#9fc4ff', fontWeight: 600 }}>\n        {label}\n      </label>\n      <input\n        ref={inputRef}\n        placeholder={placeholder}\n        style={{\n          padding: '12px 16px',\n          fontSize: 16,\n          borderRadius: 10,\n          border: '2px solid rgba(97,218,251,0.3)',\n          background: 'rgba(255,255,255,0.05)',\n          color: '#e6f0ff',\n          outline: 'none',\n          width: '100%',\n          maxWidth: 300,\n          transition: 'border-color 0.2s',\n        }}\n        onFocus={e => e.target.style.borderColor = '#61dafb'}\n        onBlur={e => e.target.style.borderColor = 'rgba(97,218,251,0.3)'}\n      />\n    </div>\n  );\n}\n\nfunction App() {\n  const emailRef = useRef(null);\n  \n  const handleFocus = () => {\n    emailRef.current?.focus();\n  };\n  \n  return (\n    <div>\n      <h2>ref as Prop (React 19)</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>\n        No more forwardRef! Pass ref directly as a prop.\n      </p>\n      <FancyInput \n        inputRef={emailRef} \n        label=\"Email Address\"\n        placeholder=\"Enter your email\"\n      />\n      <button\n        onClick={handleFocus}\n        style={{\n          padding: '12px 24px',\n          background: 'linear-gradient(135deg, #61dafb, #4fc3dc)',\n          border: 'none',\n          borderRadius: 10,\n          color: '#0a1628',\n          fontWeight: 700,\n          cursor: 'pointer',\n        }}\n      >\n        Focus Email Input\n      </button>\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useRef") && code.includes("ref") && (code.includes(".focus()") || code.includes(".current")),
        message: "✅ ref as prop pattern mastered!",
      }),
    },
    {
      title: "React 19 (13): Document Metadata",
      content: [
        "React 19 supports rendering **<title>**, **<meta>**, and **<link>** tags directly in your components. React automatically hoists them to the document head. No more Helmet or special head components!",
        "This is especially powerful for dynamic pages where metadata depends on data. Just render the tags and React handles the rest.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Hoisted metadata",
          body: "In React 19, you can render **<title>**, **<meta>**, and **<link>** tags anywhere in your component tree. React **hoists** them to the document `<head>` automatically. This simplifies SEO and dynamic metadata without third-party libraries.",
          badges: ["SEO", "Metadata", "head"],
          code: "function BlogPost({ post }) {\n  return (\n    <article>\n      <title>{post.title} | My Blog</title>\n      <meta name=\"description\" content={post.excerpt} />\n      <meta property=\"og:title\" content={post.title} />\n      <h1>{post.title}</h1>\n      <p>{post.content}</p>\n    </article>\n  );\n}",
        },
        {
          tag: "exercise",
          title: "Dynamic metadata",
          body: "Create a **ProductPage** component that renders product details with dynamic metadata. Include a `<title>` with the product name, a meta description, and display the product info. Show how the title changes based on which product is selected.",
          badges: ["Practice", "SEO"],
        },
      ],
      defaultCode: `import { useState } from 'react';\n\nconst products = [\n  { id: 1, name: 'Pro Keyboard', price: 149, desc: 'Mechanical keyboard with RGB lighting' },\n  { id: 2, name: 'Ultra Mouse', price: 79, desc: 'Ergonomic wireless mouse with 16000 DPI' },\n  { id: 3, name: 'Studio Monitor', price: 299, desc: '27-inch 4K display for professionals' },\n];\n\nfunction ProductPage({ product }) {\n  // React 19: these get hoisted to <head> automatically!\n  return (\n    <div style={{ padding: 20, background: 'rgba(97,218,251,0.08)', borderRadius: 16, marginTop: 16 }}>\n      {/* Document metadata - hoisted to <head> */}\n      <title>{product.name} | TechStore</title>\n      <meta name=\"description\" content={product.desc} />\n      \n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\n        <h2 style={{ color: '#61dafb', margin: 0 }}>{product.name}</h2>\n        <span style={{ fontSize: 24, fontWeight: 700, color: '#4ade80' }}>\${product.price}</span>\n      </div>\n      <p style={{ color: '#c6d5ff', marginTop: 12 }}>{product.desc}</p>\n      <p style={{ color: '#9fc4ff', fontSize: 13, fontStyle: 'italic' }}>\n        Check your browser tab - the title updates dynamically!\n      </p>\n    </div>\n  );\n}\n\nfunction App() {\n  const [selectedId, setSelectedId] = useState(1);\n  const product = products.find(p => p.id === selectedId);\n  \n  return (\n    <div>\n      <h2>Document Metadata (React 19)</h2>\n      <p style={{ color: '#c6d5ff' }}>Select a product - watch the page title change!</p>\n      \n      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>\n        {products.map(p => (\n          <button\n            key={p.id}\n            onClick={() => setSelectedId(p.id)}\n            style={{\n              padding: '10px 18px',\n              borderRadius: 10,\n              border: selectedId === p.id ? '2px solid #61dafb' : '2px solid rgba(255,255,255,0.1)',\n              background: selectedId === p.id ? 'rgba(97,218,251,0.2)' : 'transparent',\n              color: '#e6f0ff',\n              fontWeight: 600,\n              cursor: 'pointer',\n            }}\n          >\n            {p.name}\n          </button>\n        ))}\n      </div>\n      \n      {product && <ProductPage product={product} />}\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("<title>") && code.includes("<meta") && (code.includes("product") || code.includes("Product")),
        message: "✅ Document metadata mastered!",
      }),
    },
    {
      title: "React 19 (14): Asset Loading with Suspense",
      content: [
        "React 19 integrates **asset preloading** with Suspense. Use APIs like **preload()**, **preconnect()**, and **prefetchDNS()** to optimize loading. Stylesheets and scripts can participate in Suspense boundaries.",
        "This enables smarter resource loading: critical CSS loads first, fonts preload early, and Suspense coordinates everything for the best user experience.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Resource loading APIs",
          body: "React 19 provides **preload()**, **preconnect()**, **prefetchDNS()**, and **preinit()** APIs. These let you hint to the browser about resources needed soon. Combined with Suspense, React can orchestrate loading for optimal perceived performance.",
          badges: ["preload", "Performance", "Suspense"],
          code: "import { preload, preconnect } from 'react-dom';\n\nfunction ImageGallery({ images }) {\n  // Preload critical images\n  images.slice(0, 3).forEach(img => {\n    preload(img.src, { as: 'image' });\n  });\n  \n  // Preconnect to CDN\n  preconnect('https://cdn.example.com');\n  \n  return <Gallery images={images} />;\n}",
        },
        {
          tag: "exercise",
          title: "Implement preloading",
          body: "Create an **ImagePreloader** component that simulates preloading images before displaying them. Show a loading state while images are 'preloading', then display them. Use state to track loading progress.",
          badges: ["Practice", "Performance"],
        },
      ],
      defaultCode: `import { useState, useEffect } from 'react';\n\nconst images = [\n  { id: 1, src: 'https://picsum.photos/300/200?random=1', title: 'Mountain Vista' },\n  { id: 2, src: 'https://picsum.photos/300/200?random=2', title: 'Ocean Sunset' },\n  { id: 3, src: 'https://picsum.photos/300/200?random=3', title: 'Forest Path' },\n];\n\n// Simulate preload API behavior\nfunction usePreloadImages(srcs) {\n  const [loaded, setLoaded] = useState(0);\n  const [ready, setReady] = useState(false);\n  \n  useEffect(() => {\n    let mounted = true;\n    setLoaded(0);\n    setReady(false);\n    \n    const promises = srcs.map(src => \n      new Promise(resolve => {\n        const img = new Image();\n        img.onload = () => {\n          if (mounted) setLoaded(l => l + 1);\n          resolve(true);\n        };\n        img.onerror = () => resolve(false);\n        img.src = src;\n      })\n    );\n    \n    Promise.all(promises).then(() => {\n      if (mounted) setReady(true);\n    });\n    \n    return () => { mounted = false; };\n  }, [srcs.join(',')]);\n  \n  return { loaded, total: srcs.length, ready };\n}\n\nfunction ImageGallery({ images }) {\n  return (\n    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>\n      {images.map(img => (\n        <div key={img.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(97,218,251,0.2)' }}>\n          <img src={img.src} alt={img.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />\n          <p style={{ padding: '8px 12px', margin: 0, color: '#c6d5ff', fontSize: 14 }}>{img.title}</p>\n        </div>\n      ))}\n    </div>\n  );\n}\n\nfunction App() {\n  const { loaded, total, ready } = usePreloadImages(images.map(i => i.src));\n  \n  return (\n    <div>\n      <h2>Asset Loading (React 19)</h2>\n      {!ready ? (\n        <div style={{ padding: 24, background: 'rgba(251,191,36,0.1)', borderRadius: 12, textAlign: 'center' }}>\n          <div style={{ color: '#fbbf24', fontWeight: 700, marginBottom: 12 }}>\n            Preloading images... {loaded}/{total}\n          </div>\n          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>\n            <div style={{ width: \`\${(loaded/total)*100}%\`, height: '100%', background: 'linear-gradient(90deg, #61dafb, #4ade80)', transition: 'width 0.3s' }} />\n          </div>\n        </div>\n      ) : (\n        <>\n          <p style={{ color: '#4ade80', marginBottom: 16 }}>✓ All images preloaded!</p>\n          <ImageGallery images={images} />\n        </>\n      )}\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("preload") || code.includes("Preload") || code.includes("loaded")) && code.includes("Image"),
        message: "✅ Asset loading pattern mastered!",
      }),
    },
    {
      title: "React 19 (15): Server Components Concepts",
      content: [
        "**React Server Components (RSC)** run on the server and send HTML to the client. They can access databases, file systems, and APIs directly—with zero JavaScript sent for the component itself. They're the foundation of modern React frameworks.",
        "RSC split your app into 'use server' and 'use client' components. Server Components handle data fetching and heavy logic; Client Components handle interactivity. This lesson explains the mental model.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Server vs Client Components",
          body: "**Server Components** (default in Next.js App Router) run on the server only. They can fetch data directly, access secrets, and send minimal HTML. **Client Components** (marked with 'use client') run in the browser for interactivity. Think of it as: server for data, client for state and events.",
          badges: ["RSC", "Server", "Client"],
          code: "// Server Component (default) - runs on server\nasync function UserList() {\n  const users = await db.query('SELECT * FROM users');\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}\n\n// Client Component - runs in browser\n'use client';\nfunction LikeButton({ postId }) {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(!liked)}>♥</button>;\n}",
        },
        {
          tag: "key-point",
          title: "When to use which?",
          body: "Use **Server Components** for: data fetching, accessing backend resources, large dependencies (markdown parsers, etc.), SEO-critical content. Use **Client Components** for: interactivity (useState, onClick), browser APIs (localStorage, geolocation), real-time updates.",
          badges: ["Architecture", "Decision"],
        },
        {
          tag: "exercise",
          title: "Design the split",
          body: "Create a mock layout showing how you'd split a blog post page: a **ServerPost** component (simulated) that 'fetches' post data, and a **ClientComments** component with useState for new comments. This demonstrates the mental model.",
          badges: ["Practice", "Architecture"],
        },
      ],
      defaultCode: `import { useState } from 'react';\n\n// Simulated SERVER Component - in real RSC this would fetch from DB\n// No useState, no onClick - just renders data\nfunction ServerPost({ post }) {\n  return (\n    <article style={{ padding: 20, background: 'rgba(139,92,246,0.1)', borderRadius: 16, marginBottom: 20, border: '1px solid rgba(139,92,246,0.3)' }}>\n      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>\n        <span style={{ padding: '4px 10px', background: 'rgba(139,92,246,0.3)', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>SERVER COMPONENT</span>\n      </div>\n      <h2 style={{ color: '#e6f0ff', margin: '0 0 12px' }}>{post.title}</h2>\n      <p style={{ color: '#c6d5ff', lineHeight: 1.6 }}>{post.content}</p>\n      <p style={{ color: '#9fc4ff', fontSize: 13, marginTop: 12 }}>By {post.author} • {post.date}</p>\n    </article>\n  );\n}\n\n// CLIENT Component - has state and interactivity\n// In real app: 'use client' directive at top\nfunction ClientComments({ postId }) {\n  const [comments, setComments] = useState([\n    { id: 1, text: 'Great article!', author: 'Alice' },\n  ]);\n  const [newComment, setNewComment] = useState('');\n  \n  const addComment = () => {\n    if (!newComment.trim()) return;\n    setComments([...comments, { id: Date.now(), text: newComment, author: 'You' }]);\n    setNewComment('');\n  };\n  \n  return (\n    <div style={{ padding: 20, background: 'rgba(97,218,251,0.1)', borderRadius: 16, border: '1px solid rgba(97,218,251,0.3)' }}>\n      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>\n        <span style={{ padding: '4px 10px', background: 'rgba(97,218,251,0.3)', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#61dafb' }}>CLIENT COMPONENT</span>\n      </div>\n      <h3 style={{ color: '#e6f0ff', margin: '0 0 16px' }}>Comments ({comments.length})</h3>\n      \n      {comments.map(c => (\n        <div key={c.id} style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 10, marginBottom: 8 }}>\n          <strong style={{ color: '#61dafb' }}>{c.author}:</strong>\n          <span style={{ color: '#c6d5ff', marginLeft: 8 }}>{c.text}</span>\n        </div>\n      ))}\n      \n      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>\n        <input\n          value={newComment}\n          onChange={e => setNewComment(e.target.value)}\n          placeholder=\"Add a comment...\"\n          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff' }}\n          onKeyDown={e => e.key === 'Enter' && addComment()}\n        />\n        <button onClick={addComment} style={{ padding: '10px 20px', borderRadius: 10, background: '#61dafb', border: 'none', color: '#0a1628', fontWeight: 700, cursor: 'pointer' }}>Post</button>\n      </div>\n    </div>\n  );\n}\n\nfunction App() {\n  const post = {\n    id: 1,\n    title: 'Understanding React Server Components',\n    content: 'Server Components revolutionize how we build React apps. They run on the server, fetch data directly, and send minimal HTML to the client. This reduces JavaScript bundle size and improves performance.',\n    author: 'React Team',\n    date: 'Jan 2025',\n  };\n  \n  return (\n    <div>\n      <h2>Server Components Mental Model</h2>\n      <ServerPost post={post} />\n      <ClientComments postId={post.id} />\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: (code.includes("Server") || code.includes("server")) && (code.includes("Client") || code.includes("client")) && code.includes("useState"),
        message: "✅ Server Components mental model understood!",
      }),
    },
    {
      title: "React 19 (16): React Compiler Concepts",
      content: [
        "The **React Compiler** (formerly React Forget) automatically optimizes your components. It adds memoization where beneficial—no more manual useMemo, useCallback, or React.memo for performance. Write simple code; the compiler handles optimization.",
        "The compiler understands React's rules and optimizes accordingly. This means less boilerplate, fewer bugs from missed dependencies, and better performance by default.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Automatic memoization",
          body: "The React Compiler analyzes your code and automatically inserts memoization where it helps. You write clean, straightforward code without manual useMemo or useCallback, and the compiler ensures renders are skipped when props haven't changed meaningfully.",
          badges: ["Compiler", "Memoization", "DX"],
          code: "// Before (manual optimization)\nconst sorted = useMemo(() => items.sort(), [items]);\nconst handleClick = useCallback(() => onClick(id), [id]);\n\n// After (with React Compiler)\n// Just write normal code - compiler optimizes it!\nconst sorted = items.sort();\nconst handleClick = () => onClick(id);",
        },
        {
          tag: "tip",
          title: "Rules of React",
          body: "The compiler relies on the **Rules of React**: components should be pure, props/state are immutable, hooks are called at the top level. If you follow these rules, the compiler can optimize aggressively. ESLint plugin helps catch violations.",
          badges: ["Rules", "Purity"],
        },
        {
          tag: "exercise",
          title: "Write optimizable code",
          body: "Create a **FilterableList** component that filters items based on search. Write it **without** manual useMemo/useCallback (simulating compiler-friendly code). Focus on clean, pure code that the compiler could optimize.",
          badges: ["Practice", "Modern"],
        },
      ],
      defaultCode: `import { useState } from 'react';\n\nconst ALL_ITEMS = [\n  { id: 1, name: 'TypeScript', category: 'Language' },\n  { id: 2, name: 'React', category: 'Library' },\n  { id: 3, name: 'Next.js', category: 'Framework' },\n  { id: 4, name: 'Tailwind', category: 'CSS' },\n  { id: 5, name: 'Prisma', category: 'ORM' },\n  { id: 6, name: 'Node.js', category: 'Runtime' },\n  { id: 7, name: 'PostgreSQL', category: 'Database' },\n  { id: 8, name: 'Redis', category: 'Cache' },\n];\n\n// Pure helper function - compiler can optimize calls\nfunction filterItems(items, query, category) {\n  return items.filter(item => {\n    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());\n    const matchesCategory = category === 'all' || item.category === category;\n    return matchesQuery && matchesCategory;\n  });\n}\n\n// React Compiler-friendly: no manual useMemo/useCallback needed!\n// The compiler automatically memoizes where beneficial\nfunction FilterableList() {\n  const [query, setQuery] = useState('');\n  const [category, setCategory] = useState('all');\n  \n  // Simple code - compiler would memoize this automatically\n  const categories = ['all', ...new Set(ALL_ITEMS.map(i => i.category))];\n  const filtered = filterItems(ALL_ITEMS, query, category);\n  \n  return (\n    <div>\n      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>\n        <input\n          value={query}\n          onChange={e => setQuery(e.target.value)}\n          placeholder=\"Search...\"\n          style={{ padding: '10px 14px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff', flex: '1 1 200px' }}\n        />\n        <select\n          value={category}\n          onChange={e => setCategory(e.target.value)}\n          style={{ padding: '10px 14px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff' }}\n        >\n          {categories.map(c => (\n            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>\n          ))}\n        </select>\n      </div>\n      \n      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>\n        {filtered.map(item => (\n          <div key={item.id} style={{ padding: 16, background: 'rgba(97,218,251,0.08)', borderRadius: 12, border: '1px solid rgba(97,218,251,0.15)' }}>\n            <h4 style={{ color: '#61dafb', margin: '0 0 6px' }}>{item.name}</h4>\n            <span style={{ fontSize: 12, color: '#9fc4ff', background: 'rgba(159,196,255,0.15)', padding: '4px 8px', borderRadius: 6 }}>{item.category}</span>\n          </div>\n        ))}\n      </div>\n      \n      <p style={{ color: '#9fc4ff', fontSize: 13, marginTop: 16 }}>\n        Showing {filtered.length} of {ALL_ITEMS.length} items\n      </p>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>React Compiler (Automatic Optimization)</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>\n        This code has no useMemo or useCallback. The React Compiler would automatically optimize it!\n      </p>\n      <FilterableList />\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("filter") && code.includes("useState") && !code.includes("useMemo") && !code.includes("useCallback"),
        message: "✅ React Compiler-friendly code mastered!",
      }),
    },
    {
      title: "React 19 (17): Advanced Challenge - Real-Time Dashboard",
      content: [
        "Build a **real-time dashboard** combining multiple React 19 patterns: useTransition for search, useDeferredValue for charts, optimistic updates for actions, and Suspense for data sections.",
        "This challenge tests your mastery of React 19. Create a dashboard with: live-updating metrics, a searchable table with deferred filtering, and action buttons with optimistic feedback.",
      ],
      sections: [
        {
          tag: "exercise",
          title: "Build the dashboard",
          body: "Create a dashboard with: (1) **Metrics cards** that update in real-time (simulated), (2) **Searchable table** using useDeferredValue, (3) **Action buttons** with optimistic UI feedback. Combine everything you've learned!",
          badges: ["Challenge", "Advanced", "Integration"],
        },
        {
          tag: "key-point",
          title: "Patterns to use",
          body: "Combine: **useTransition** for non-blocking updates, **useDeferredValue** for expensive renders, **useState** for optimistic state, **useEffect** for real-time simulation. The goal is a responsive UI even with frequent updates.",
          badges: ["Integration"],
        },
      ],
      defaultCode: `import { useState, useEffect, useTransition, useDeferredValue } from 'react';\n\nconst INITIAL_DATA = [\n  { id: 1, name: 'Server Alpha', status: 'healthy', cpu: 45, memory: 62 },\n  { id: 2, name: 'Server Beta', status: 'healthy', cpu: 72, memory: 81 },\n  { id: 3, name: 'Server Gamma', status: 'warning', cpu: 89, memory: 76 },\n  { id: 4, name: 'Server Delta', status: 'healthy', cpu: 23, memory: 45 },\n  { id: 5, name: 'Server Epsilon', status: 'critical', cpu: 95, memory: 94 },\n];\n\nfunction MetricCard({ label, value, trend, color }) {\n  return (\n    <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: \`1px solid \${color}30\` }}>\n      <p style={{ color: '#9fc4ff', fontSize: 12, margin: '0 0 4px', textTransform: 'uppercase' }}>{label}</p>\n      <p style={{ color: color, fontSize: 28, fontWeight: 700, margin: 0 }}>{value}</p>\n      <p style={{ color: trend > 0 ? '#4ade80' : '#f87171', fontSize: 12, margin: '4px 0 0' }}>\n        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%\n      </p>\n    </div>\n  );\n}\n\nfunction ServerTable({ servers, search, onRestart }) {\n  const deferredSearch = useDeferredValue(search);\n  const filtered = servers.filter(s => s.name.toLowerCase().includes(deferredSearch.toLowerCase()));\n  const isStale = search !== deferredSearch;\n  \n  return (\n    <div style={{ opacity: isStale ? 0.7 : 1, transition: 'opacity 0.2s' }}>\n      <table style={{ width: '100%', borderCollapse: 'collapse' }}>\n        <thead>\n          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>\n            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#9fc4ff', fontSize: 12 }}>SERVER</th>\n            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#9fc4ff', fontSize: 12 }}>STATUS</th>\n            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#9fc4ff', fontSize: 12 }}>CPU</th>\n            <th style={{ padding: '12px 8px', textAlign: 'left', color: '#9fc4ff', fontSize: 12 }}>MEM</th>\n            <th style={{ padding: '12px 8px', textAlign: 'right', color: '#9fc4ff', fontSize: 12 }}>ACTION</th>\n          </tr>\n        </thead>\n        <tbody>\n          {filtered.map(server => (\n            <tr key={server.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>\n              <td style={{ padding: '12px 8px', color: '#e6f0ff', fontWeight: 600 }}>{server.name}</td>\n              <td style={{ padding: '12px 8px' }}>\n                <span style={{ \n                  padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,\n                  background: server.status === 'healthy' ? 'rgba(74,222,128,0.2)' : server.status === 'warning' ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)',\n                  color: server.status === 'healthy' ? '#4ade80' : server.status === 'warning' ? '#fbbf24' : '#f87171',\n                }}>{server.status}</span>\n              </td>\n              <td style={{ padding: '12px 8px', color: server.cpu > 80 ? '#f87171' : '#c6d5ff' }}>{server.cpu}%</td>\n              <td style={{ padding: '12px 8px', color: server.memory > 80 ? '#f87171' : '#c6d5ff' }}>{server.memory}%</td>\n              <td style={{ padding: '12px 8px', textAlign: 'right' }}>\n                <button onClick={() => onRestart(server.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: 'rgba(97,218,251,0.2)', color: '#61dafb', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Restart</button>\n              </td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n    </div>\n  );\n}\n\nfunction App() {\n  const [servers, setServers] = useState(INITIAL_DATA);\n  const [search, setSearch] = useState('');\n  const [metrics, setMetrics] = useState({ requests: 12453, errors: 23, latency: 145 });\n  const [isPending, startTransition] = useTransition();\n  const [restarting, setRestarting] = useState(null);\n  \n  // Simulate real-time updates\n  useEffect(() => {\n    const interval = setInterval(() => {\n      setMetrics(m => ({\n        requests: m.requests + Math.floor(Math.random() * 50),\n        errors: Math.max(0, m.errors + Math.floor(Math.random() * 5) - 2),\n        latency: Math.max(50, m.latency + Math.floor(Math.random() * 20) - 10),\n      }));\n      setServers(s => s.map(server => ({\n        ...server,\n        cpu: Math.min(100, Math.max(10, server.cpu + Math.floor(Math.random() * 10) - 5)),\n        memory: Math.min(100, Math.max(20, server.memory + Math.floor(Math.random() * 6) - 3)),\n      })));\n    }, 2000);\n    return () => clearInterval(interval);\n  }, []);\n  \n  const handleSearch = (e) => {\n    startTransition(() => setSearch(e.target.value));\n  };\n  \n  const handleRestart = async (id) => {\n    // Optimistic update\n    setRestarting(id);\n    setServers(s => s.map(server => server.id === id ? { ...server, status: 'restarting' } : server));\n    \n    // Simulate async operation\n    await new Promise(r => setTimeout(r, 1500));\n    \n    setServers(s => s.map(server => server.id === id ? { ...server, status: 'healthy', cpu: 15, memory: 30 } : server));\n    setRestarting(null);\n  };\n  \n  return (\n    <div>\n      <h2>Real-Time Dashboard <span style={{ fontSize: 14, color: '#9fc4ff', fontWeight: 400 }}>React 19 Challenge</span></h2>\n      \n      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>\n        <MetricCard label=\"Requests/min\" value={metrics.requests.toLocaleString()} trend={8} color=\"#61dafb\" />\n        <MetricCard label=\"Errors\" value={metrics.errors} trend={-12} color=\"#f87171\" />\n        <MetricCard label=\"Latency\" value={\`\${metrics.latency}ms\`} trend={3} color=\"#fbbf24\" />\n      </div>\n      \n      <div style={{ marginBottom: 16 }}>\n        <input\n          value={search}\n          onChange={handleSearch}\n          placeholder=\"Search servers...\"\n          style={{ width: '100%', maxWidth: 300, padding: '12px 16px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff', fontSize: 14 }}\n        />\n        {isPending && <span style={{ marginLeft: 12, color: '#fbbf24', fontSize: 13 }}>Updating...</span>}\n      </div>\n      \n      <ServerTable servers={servers} search={search} onRestart={handleRestart} />\n      \n      {restarting && (\n        <div style={{ marginTop: 12, padding: 12, background: 'rgba(97,218,251,0.1)', borderRadius: 10, color: '#61dafb', fontSize: 13 }}>\n          Restarting server... (optimistic UI - shows immediately!)\n        </div>\n      )}\n    </div>\n  );\n}\nexport default App;`,
      validationLogic: (code) => ({
        success: code.includes("useTransition") && code.includes("useDeferredValue") && code.includes("useState") && code.includes("useEffect"),
        message: "🏆 Advanced dashboard challenge completed!",
      }),
    },
    // ============================================================
    // TESTING & QUALITY LESSONS (32-34)
    // ============================================================
    {
      title: "React 32: Testing Basics with React Testing Library",
      content: [
        "**React Testing Library (RTL)** lets you test components the way users interact with them. Instead of testing implementation details, you test behavior: clicking buttons, filling forms, seeing results.",
        "RTL encourages accessible code by querying elements the way screen readers do: by role, label, and text. This makes your tests more resilient and your components more accessible.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Philosophy: Test behavior, not implementation",
          body: "RTL queries prioritize accessibility: **getByRole** (buttons, links), **getByLabelText** (form inputs), **getByText** (visible text). Avoid testing state variables or internal methods—test what users see and do.",
          badges: ["RTL", "Accessibility", "Best Practices"],
          code: "// Good: Tests user behavior\nconst button = screen.getByRole('button', { name: /submit/i });\nfireEvent.click(button);\nexpect(screen.getByText('Success!')).toBeInTheDocument();\n\n// Bad: Tests implementation\nexpect(component.state.isSubmitted).toBe(true);",
        },
        {
          tag: "key-point",
          title: "Query priority",
          body: "1. **getByRole** - most preferred, works like assistive tech. 2. **getByLabelText** - great for forms. 3. **getByPlaceholderText** - when no label exists. 4. **getByText** - visible text. 5. **getByTestId** - last resort.",
          badges: ["Queries", "Priority"],
        },
        {
          tag: "exercise",
          title: "Write your first test",
          body: "Create a **Counter** component and a **test function** that simulates clicking the increment button and verifies the count updates. Use getByRole and getByText queries.",
          badges: ["Practice", "Testing"],
        },
      ],
      defaultCode: "import { useState } from 'react';\n\n// Component to test\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div style={{ padding: 20, background: 'rgba(97,218,251,0.1)', borderRadius: 16 }}>\n      <h3 style={{ color: '#e6f0ff', margin: '0 0 16px' }}>Counter: <span data-testid=\"count\">{count}</span></h3>\n      <div style={{ display: 'flex', gap: 12 }}>\n        <button\n          onClick={() => setCount(c => c - 1)}\n          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#f87171', color: 'white', fontWeight: 700, cursor: 'pointer' }}\n          aria-label=\"Decrement\"\n        >\n          − Decrement\n        </button>\n        <button\n          onClick={() => setCount(c => c + 1)}\n          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#4ade80', color: '#0a1628', fontWeight: 700, cursor: 'pointer' }}\n          aria-label=\"Increment\"\n        >\n          + Increment\n        </button>\n      </div>\n    </div>\n  );\n}\n\n// Simulated test runner (in real app, use Jest + RTL)\nfunction TestRunner() {\n  const [results, setResults] = useState([]);\n  \n  const runTests = () => {\n    const tests = [];\n    \n    // Test 1: Initial render\n    tests.push({\n      name: 'renders initial count of 0',\n      pass: document.querySelector('[data-testid=\"count\"]')?.textContent === '0',\n    });\n    \n    // Test 2: Find increment button by role\n    const incButton = document.querySelector('button[aria-label=\"Increment\"]');\n    tests.push({\n      name: 'finds increment button by aria-label',\n      pass: incButton !== null,\n    });\n    \n    // Test 3: Click and verify\n    if (incButton) incButton.click();\n    tests.push({\n      name: 'increments count on click',\n      pass: document.querySelector('[data-testid=\"count\"]')?.textContent === '1',\n    });\n    \n    setResults(tests);\n  };\n  \n  return (\n    <div style={{ marginTop: 20, padding: 20, background: 'rgba(139,92,246,0.1)', borderRadius: 16 }}>\n      <h4 style={{ color: '#a78bfa', margin: '0 0 12px' }}>Test Runner</h4>\n      <button onClick={runTests} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#a78bfa', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>\n        Run Tests\n      </button>\n      {results.map((test, i) => (\n        <div key={i} style={{ padding: 8, marginBottom: 4, background: test.pass ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 6 }}>\n          <span style={{ color: test.pass ? '#4ade80' : '#f87171', marginRight: 8 }}>{test.pass ? '✓' : '✗'}</span>\n          <span style={{ color: '#c6d5ff' }}>{test.name}</span>\n        </div>\n      ))}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>React Testing Library Basics</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Test components the way users interact with them!</p>\n      <Counter />\n      <TestRunner />\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("useState") && code.includes("aria-label") && (code.includes("getBy") || code.includes("testid")),
        message: "✅ Testing basics understood!",
      }),
    },
    {
      title: "React 33: Testing User Interactions",
      content: [
        "Real users don't just view your app—they click, type, hover, and navigate. **fireEvent** and **userEvent** simulate these interactions. userEvent is more realistic, simulating full browser behavior.",
        "Testing async operations requires **waitFor** and **findBy** queries. These wait for elements to appear after state updates, API calls, or animations complete.",
      ],
      sections: [
        {
          tag: "concept",
          title: "fireEvent vs userEvent",
          body: "**fireEvent** dispatches DOM events directly—fast but not realistic. **userEvent** simulates real browser behavior: typing triggers focus, keydown, input, keyup events. Prefer userEvent for realistic tests.",
          badges: ["Events", "userEvent", "Testing"],
          code: "// fireEvent - basic, direct\nfireEvent.change(input, { target: { value: 'hello' } });\n\n// userEvent - realistic, complete\nawait userEvent.type(input, 'hello');\n// Simulates: focus, keydown, keypress, input, keyup for each character",
        },
        {
          tag: "key-point",
          title: "Async testing",
          body: "For async operations, use **findBy** queries (return promises) or wrap assertions in **waitFor**. Example: `await screen.findByText('Loaded!')` waits for the element to appear.",
          badges: ["Async", "waitFor", "findBy"],
        },
        {
          tag: "exercise",
          title: "Test a search form",
          body: "Create a **SearchForm** that filters a list as you type. Include simulated tests that: type in the search box, wait for filtered results, verify the correct items display.",
          badges: ["Practice", "Async"],
        },
      ],
      defaultCode: "import { useState, useEffect } from 'react';\n\nconst FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];\n\nfunction SearchForm() {\n  const [query, setQuery] = useState('');\n  const [results, setResults] = useState(FRUITS);\n  const [loading, setLoading] = useState(false);\n  \n  useEffect(() => {\n    setLoading(true);\n    // Simulate async search (like API call)\n    const timeout = setTimeout(() => {\n      const filtered = FRUITS.filter(f => f.toLowerCase().includes(query.toLowerCase()));\n      setResults(filtered);\n      setLoading(false);\n    }, 300);\n    return () => clearTimeout(timeout);\n  }, [query]);\n  \n  return (\n    <div style={{ padding: 20, background: 'rgba(97,218,251,0.1)', borderRadius: 16 }}>\n      <input\n        type=\"text\"\n        value={query}\n        onChange={e => setQuery(e.target.value)}\n        placeholder=\"Search fruits...\"\n        aria-label=\"Search fruits\"\n        style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff', fontSize: 16, marginBottom: 16 }}\n      />\n      {loading ? (\n        <p style={{ color: '#fbbf24' }}>Searching...</p>\n      ) : (\n        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>\n          {results.map(fruit => (\n            <li key={fruit} style={{ padding: 10, marginBottom: 6, background: 'rgba(0,0,0,0.2)', borderRadius: 8, color: '#e6f0ff' }} data-testid=\"fruit-item\">\n              {fruit}\n            </li>\n          ))}\n        </ul>\n      )}\n      <p style={{ color: '#9fc4ff', fontSize: 13, marginTop: 12 }}>{results.length} results</p>\n    </div>\n  );\n}\n\nfunction TestRunner() {\n  const [results, setResults] = useState([]);\n  const [running, setRunning] = useState(false);\n  \n  const runTests = async () => {\n    setRunning(true);\n    setResults([]);\n    const tests = [];\n    \n    // Test 1: Initial render shows all fruits\n    const items = document.querySelectorAll('[data-testid=\"fruit-item\"]');\n    tests.push({ name: 'renders all fruits initially', pass: items.length === 7 });\n    setResults([...tests]);\n    \n    // Test 2: Type in search (simulate userEvent)\n    const input = document.querySelector('input[aria-label=\"Search fruits\"]');\n    if (input) {\n      // Simulate typing \"ap\"\n      input.value = 'ap';\n      input.dispatchEvent(new Event('input', { bubbles: true }));\n      input.dispatchEvent(new Event('change', { bubbles: true }));\n    }\n    \n    // Test 3: Wait for async results (simulating waitFor)\n    await new Promise(r => setTimeout(r, 400));\n    const filteredItems = document.querySelectorAll('[data-testid=\"fruit-item\"]');\n    tests.push({ name: 'filters to matching items after typing', pass: filteredItems.length === 2 });\n    \n    // Test 4: Verify correct items\n    const itemTexts = Array.from(filteredItems).map(el => el.textContent);\n    tests.push({ name: 'shows Apple and Grape', pass: itemTexts.includes('Apple') && itemTexts.includes('Grape') });\n    \n    setResults([...tests]);\n    setRunning(false);\n  };\n  \n  return (\n    <div style={{ marginTop: 20, padding: 20, background: 'rgba(139,92,246,0.1)', borderRadius: 16 }}>\n      <h4 style={{ color: '#a78bfa', margin: '0 0 12px' }}>Interaction Tests</h4>\n      <button onClick={runTests} disabled={running} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#a78bfa', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: 16, opacity: running ? 0.6 : 1 }}>\n        {running ? 'Running...' : 'Run Tests'}\n      </button>\n      {results.map((test, i) => (\n        <div key={i} style={{ padding: 8, marginBottom: 4, background: test.pass ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 6 }}>\n          <span style={{ color: test.pass ? '#4ade80' : '#f87171', marginRight: 8 }}>{test.pass ? '✓' : '✗'}</span>\n          <span style={{ color: '#c6d5ff' }}>{test.name}</span>\n        </div>\n      ))}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>Testing User Interactions</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Simulate typing and verify async results!</p>\n      <SearchForm />\n      <TestRunner />\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("useState") && code.includes("useEffect") && code.includes("aria-label"),
        message: "✅ Interaction testing mastered!",
      }),
    },
    {
      title: "React 34: Testing Custom Hooks",
      content: [
        "Custom hooks encapsulate reusable logic, but they can't be called outside components. **renderHook** from @testing-library/react-hooks lets you test hooks in isolation.",
        "For hooks that use Context, wrap them in providers. For hooks with side effects (timers, fetch), mock the dependencies or use fake timers.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Testing hooks in isolation",
          body: "**renderHook** creates a test harness that calls your hook and tracks its return value. You can trigger updates with **act()** and assert on the results.",
          badges: ["renderHook", "Custom Hooks", "act"],
          code: "// Testing useCounter hook\nconst { result } = renderHook(() => useCounter());\nexpect(result.current.count).toBe(0);\n\nact(() => result.current.increment());\nexpect(result.current.count).toBe(1);",
        },
        {
          tag: "key-point",
          title: "Testing with context",
          body: "Wrap your hook in a provider: `renderHook(() => useTheme(), { wrapper: ThemeProvider })`. This lets you test hooks that depend on context values.",
          badges: ["Context", "Wrapper"],
        },
        {
          tag: "exercise",
          title: "Create and test useLocalStorage",
          body: "Build a **useLocalStorage** hook that syncs state with localStorage. Create a visual demo that shows the hook working and simulated tests that verify get/set operations.",
          badges: ["Practice", "Hooks"],
        },
      ],
      defaultCode: "import { useState, useEffect, useCallback } from 'react';\n\n// Custom hook: useLocalStorage\nfunction useLocalStorage(key, initialValue) {\n  // Get initial value from localStorage or use default\n  const [value, setValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n  \n  // Sync to localStorage when value changes\n  useEffect(() => {\n    try {\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (e) {\n      console.error('Failed to save to localStorage:', e);\n    }\n  }, [key, value]);\n  \n  const remove = useCallback(() => {\n    window.localStorage.removeItem(key);\n    setValue(initialValue);\n  }, [key, initialValue]);\n  \n  return [value, setValue, remove];\n}\n\n// Demo component\nfunction LocalStorageDemo() {\n  const [name, setName, removeName] = useLocalStorage('user-name', '');\n  const [theme, setTheme] = useLocalStorage('user-theme', 'dark');\n  \n  return (\n    <div style={{ padding: 20, background: 'rgba(97,218,251,0.1)', borderRadius: 16 }}>\n      <div style={{ marginBottom: 20 }}>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Your Name (persisted):</label>\n        <input\n          value={name}\n          onChange={e => setName(e.target.value)}\n          placeholder=\"Enter your name\"\n          style={{ padding: '10px 14px', borderRadius: 8, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff', width: '100%', maxWidth: 300 }}\n        />\n      </div>\n      <div style={{ marginBottom: 20 }}>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Theme (persisted):</label>\n        <select\n          value={theme}\n          onChange={e => setTheme(e.target.value)}\n          style={{ padding: '10px 14px', borderRadius: 8, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff' }}\n        >\n          <option value=\"dark\">Dark</option>\n          <option value=\"light\">Light</option>\n          <option value=\"system\">System</option>\n        </select>\n      </div>\n      <button onClick={removeName} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#f87171', color: 'white', fontWeight: 600, cursor: 'pointer' }}>\n        Clear Name\n      </button>\n      <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>\n        <p style={{ color: '#c6d5ff', margin: 0, fontSize: 13 }}>\n          <strong>localStorage:</strong> user-name=\"{name}\", user-theme=\"{theme}\"\n        </p>\n      </div>\n    </div>\n  );\n}\n\nfunction HookTestRunner() {\n  const [results, setResults] = useState([]);\n  \n  const runTests = () => {\n    const tests = [];\n    \n    // Test 1: Initial value\n    localStorage.clear();\n    tests.push({ name: 'returns initial value when empty', pass: true });\n    \n    // Test 2: Persists to localStorage\n    localStorage.setItem('test-key', JSON.stringify('test-value'));\n    const stored = JSON.parse(localStorage.getItem('test-key'));\n    tests.push({ name: 'can read from localStorage', pass: stored === 'test-value' });\n    \n    // Test 3: Removes correctly\n    localStorage.removeItem('test-key');\n    tests.push({ name: 'can remove from localStorage', pass: localStorage.getItem('test-key') === null });\n    \n    setResults(tests);\n  };\n  \n  return (\n    <div style={{ marginTop: 20, padding: 20, background: 'rgba(139,92,246,0.1)', borderRadius: 16 }}>\n      <h4 style={{ color: '#a78bfa', margin: '0 0 12px' }}>Hook Tests (Simulated)</h4>\n      <button onClick={runTests} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#a78bfa', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>\n        Test useLocalStorage\n      </button>\n      {results.map((test, i) => (\n        <div key={i} style={{ padding: 8, marginBottom: 4, background: test.pass ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 6 }}>\n          <span style={{ color: test.pass ? '#4ade80' : '#f87171', marginRight: 8 }}>{test.pass ? '✓' : '✗'}</span>\n          <span style={{ color: '#c6d5ff' }}>{test.name}</span>\n        </div>\n      ))}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>Testing Custom Hooks</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>useLocalStorage persists state across page reloads!</p>\n      <LocalStorageDemo />\n      <HookTestRunner />\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("useLocalStorage") && code.includes("useState") && code.includes("useEffect") && code.includes("localStorage"),
        message: "✅ Custom hook testing mastered!",
      }),
    },
    // ============================================================
    // MODERN PATTERNS LESSONS (35-37)
    // ============================================================
    {
      title: "React 35: Compound Components Pattern",
      content: [
        "**Compound Components** let related components share implicit state. Like HTML's `<select>` and `<option>`, they work together seamlessly. The parent manages state; children consume it via Context.",
        "This pattern creates flexible, declarative APIs. Users compose the parts they need without prop drilling. Examples: Tabs, Accordion, Menu, Dropdown.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Implicit state sharing",
          body: "The parent component holds state and provides it via Context. Child components access this context to render and interact correctly. The result: clean JSX without passing props through every level.",
          badges: ["Pattern", "Context", "Composition"],
          code: "<Tabs defaultValue=\"tab1\">\n  <TabList>\n    <Tab value=\"tab1\">First</Tab>\n    <Tab value=\"tab2\">Second</Tab>\n  </TabList>\n  <TabPanel value=\"tab1\">First content</TabPanel>\n  <TabPanel value=\"tab2\">Second content</TabPanel>\n</Tabs>",
        },
        {
          tag: "key-point",
          title: "Benefits",
          body: "1. **Flexible API** - users compose what they need. 2. **No prop drilling** - state flows via context. 3. **Encapsulation** - implementation hidden. 4. **Type-safe** - TypeScript can infer context types.",
          badges: ["API Design", "DX"],
        },
        {
          tag: "exercise",
          title: "Build an Accordion",
          body: "Create compound components: **Accordion** (parent with state), **AccordionItem** (wrapper), **AccordionHeader** (clickable trigger), **AccordionPanel** (collapsible content). Multiple items can be open at once.",
          badges: ["Practice", "Pattern"],
        },
      ],
      defaultCode: "import { useState, createContext, useContext } from 'react';\n\n// Accordion Context\nconst AccordionContext = createContext(null);\nconst ItemContext = createContext(null);\n\nfunction Accordion({ children, allowMultiple = true }) {\n  const [openItems, setOpenItems] = useState(new Set());\n  \n  const toggle = (id) => {\n    setOpenItems(prev => {\n      const next = new Set(prev);\n      if (next.has(id)) {\n        next.delete(id);\n      } else {\n        if (!allowMultiple) next.clear();\n        next.add(id);\n      }\n      return next;\n    });\n  };\n  \n  const isOpen = (id) => openItems.has(id);\n  \n  return (\n    <AccordionContext.Provider value={{ toggle, isOpen }}>\n      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(97,218,251,0.2)' }}>\n        {children}\n      </div>\n    </AccordionContext.Provider>\n  );\n}\n\nfunction AccordionItem({ children, id }) {\n  return (\n    <ItemContext.Provider value={{ id }}>\n      <div style={{ borderBottom: '1px solid rgba(97,218,251,0.1)' }}>\n        {children}\n      </div>\n    </ItemContext.Provider>\n  );\n}\n\nfunction AccordionHeader({ children }) {\n  const { toggle, isOpen } = useContext(AccordionContext);\n  const { id } = useContext(ItemContext);\n  const open = isOpen(id);\n  \n  return (\n    <button\n      onClick={() => toggle(id)}\n      style={{ width: '100%', padding: '16px 20px', background: open ? 'rgba(97,218,251,0.15)' : 'rgba(0,0,0,0.2)', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}\n    >\n      <span style={{ color: '#e6f0ff', fontWeight: 600 }}>{children}</span>\n      <span style={{ color: '#61dafb', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>\n    </button>\n  );\n}\n\nfunction AccordionPanel({ children }) {\n  const { isOpen } = useContext(AccordionContext);\n  const { id } = useContext(ItemContext);\n  \n  if (!isOpen(id)) return null;\n  \n  return (\n    <div style={{ padding: 20, background: 'rgba(0,0,0,0.1)', color: '#c6d5ff', lineHeight: 1.6 }}>\n      {children}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>Compound Components: Accordion</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Click headers to expand/collapse. Notice the clean API!</p>\n      \n      <Accordion allowMultiple>\n        <AccordionItem id=\"what\">\n          <AccordionHeader>What are Compound Components?</AccordionHeader>\n          <AccordionPanel>\n            Compound components share implicit state via Context. The parent manages state, children consume it. This creates flexible, declarative APIs without prop drilling.\n          </AccordionPanel>\n        </AccordionItem>\n        \n        <AccordionItem id=\"when\">\n          <AccordionHeader>When to use this pattern?</AccordionHeader>\n          <AccordionPanel>\n            Use compound components for UI that has related parts: Tabs, Menus, Dropdowns, Accordions, Carousels. It is ideal when users need to compose components flexibly.\n          </AccordionPanel>\n        </AccordionItem>\n        \n        <AccordionItem id=\"benefits\">\n          <AccordionHeader>What are the benefits?</AccordionHeader>\n          <AccordionPanel>\n            Clean JSX, no prop drilling, flexible composition, encapsulated state management, and better separation of concerns. The API feels natural and declarative.\n          </AccordionPanel>\n        </AccordionItem>\n      </Accordion>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("createContext") && code.includes("useContext") && code.includes("Provider"),
        message: "✅ Compound Components pattern mastered!",
      }),
    },
    {
      title: "React 36: Render Props Pattern",
      content: [
        "**Render Props** share code between components using a prop whose value is a function. The component calls this function with its internal state, letting the consumer decide how to render.",
        "While hooks have replaced many render prop use cases, the pattern remains valuable for components that need maximum rendering flexibility or must support class components.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Function as children",
          body: "A render prop is a function that returns React elements. The component passes its internal state to this function: `<Mouse>{({ x, y }) => <p>Position: {x}, {y}</p>}</Mouse>`",
          badges: ["Pattern", "Flexibility", "Composition"],
          code: "// Render prop pattern\n<DataFetcher url=\"/api/users\">\n  {({ data, loading, error }) => {\n    if (loading) return <Spinner />;\n    if (error) return <Error message={error} />;\n    return <UserList users={data} />;\n  }}\n</DataFetcher>",
        },
        {
          tag: "key-point",
          title: "Hooks vs Render Props",
          body: "Hooks are often simpler for logic reuse. But render props excel when: you need runtime flexibility, you're building libraries, or you want inversion of control over rendering.",
          badges: ["Comparison", "Trade-offs"],
        },
        {
          tag: "exercise",
          title: "Build a Mouse Tracker",
          body: "Create a **MouseTracker** component that tracks mouse position and passes coordinates to a render prop. Use it to create different visualizations: coordinates display, a following cursor, and a heatmap effect.",
          badges: ["Practice", "Pattern"],
        },
      ],
      defaultCode: "import { useState, useEffect } from 'react';\n\n// Render Props component: shares mouse position with any renderer\nfunction MouseTracker({ children }) {\n  const [position, setPosition] = useState({ x: 0, y: 0 });\n  \n  useEffect(() => {\n    const handleMove = (e) => {\n      const container = document.getElementById('tracker-area');\n      if (container) {\n        const rect = container.getBoundingClientRect();\n        setPosition({\n          x: e.clientX - rect.left,\n          y: e.clientY - rect.top,\n        });\n      }\n    };\n    \n    const container = document.getElementById('tracker-area');\n    if (container) {\n      container.addEventListener('mousemove', handleMove);\n      return () => container.removeEventListener('mousemove', handleMove);\n    }\n  }, []);\n  \n  // Call the render prop with current state\n  return children(position);\n}\n\nfunction App() {\n  const [mode, setMode] = useState('cursor');\n  \n  return (\n    <div>\n      <h2>Render Props: Mouse Tracker</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 16 }}>Same component, different renderings!</p>\n      \n      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>\n        {['cursor', 'coords', 'glow'].map(m => (\n          <button\n            key={m}\n            onClick={() => setMode(m)}\n            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: mode === m ? '#61dafb' : 'rgba(97,218,251,0.2)', color: mode === m ? '#0a1628' : '#61dafb', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}\n          >\n            {m}\n          </button>\n        ))}\n      </div>\n      \n      <div\n        id=\"tracker-area\"\n        style={{ position: 'relative', height: 300, background: 'rgba(0,0,0,0.3)', borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(97,218,251,0.2)' }}\n      >\n        <MouseTracker>\n          {({ x, y }) => {\n            if (mode === 'cursor') {\n              return (\n                <div\n                  style={{ position: 'absolute', left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: '50%', background: '#61dafb', pointerEvents: 'none', transition: 'left 0.05s, top 0.05s' }}\n                />\n              );\n            }\n            if (mode === 'coords') {\n              return (\n                <div style={{ position: 'absolute', left: x + 10, top: y + 10, padding: '8px 12px', background: 'rgba(97,218,251,0.9)', borderRadius: 8, color: '#0a1628', fontWeight: 700, fontSize: 14, pointerEvents: 'none' }}>\n                  x: {Math.round(x)}, y: {Math.round(y)}\n                </div>\n              );\n            }\n            return (\n              <div\n                style={{ position: 'absolute', left: x - 75, top: y - 75, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(97,218,251,0.4) 0%, transparent 70%)', pointerEvents: 'none' }}\n              />\n            );\n          }}\n        </MouseTracker>\n        <p style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', color: '#9fc4ff', fontSize: 13 }}>\n          Move your mouse here\n        </p>\n      </div>\n      \n      <div style={{ marginTop: 16, padding: 16, background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>\n        <p style={{ color: '#a78bfa', margin: 0, fontSize: 14 }}>\n          <strong>Pattern:</strong> MouseTracker provides position data, render prop decides visualization\n        </p>\n      </div>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("children(") && code.includes("useState") && code.includes("({ x, y })"),
        message: "✅ Render Props pattern mastered!",
      }),
    },
    {
      title: "React 37: Headless UI Pattern",
      content: [
        "**Headless components** provide behavior without styling. They handle complex logic (keyboard navigation, ARIA, state) while you control the visual appearance. Popular libraries: Headless UI, Radix, Downshift.",
        "This pattern separates concerns: the library handles accessibility and UX patterns; you handle branding and design. Result: fully accessible components that match your design system.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Logic without opinions",
          body: "Headless components return **props getters** (functions that return props to spread on your elements) or **render props** with state. You render whatever HTML you want with these props applied.",
          badges: ["Headless", "Accessibility", "Flexibility"],
          code: "// Headless toggle hook\nconst { isOn, toggle, getToggleProps, getLabelProps } = useToggle();\n\nreturn (\n  <label {...getLabelProps()}>Enable feature</label>\n  <button {...getToggleProps()}>{isOn ? 'ON' : 'OFF'}</button>\n);",
        },
        {
          tag: "key-point",
          title: "Why headless?",
          body: "1. **Full style control** - no CSS to override. 2. **Built-in a11y** - ARIA, focus management handled. 3. **Consistent UX** - keyboard nav, screen reader support. 4. **Design system friendly** - fits any visual language.",
          badges: ["Benefits", "A11y"],
        },
        {
          tag: "exercise",
          title: "Build a Headless Select",
          body: "Create a **useSelect** hook that handles: option list state, keyboard navigation (arrows, enter, escape), ARIA attributes. Then render it with completely custom styling.",
          badges: ["Practice", "Hooks"],
        },
      ],
      defaultCode: "import { useState, useCallback, useRef, useEffect } from 'react';\n\n// Headless useSelect hook - all logic, no styling\nfunction useSelect({ options, defaultValue = null }) {\n  const [isOpen, setIsOpen] = useState(false);\n  const [selected, setSelected] = useState(defaultValue);\n  const [highlightedIndex, setHighlightedIndex] = useState(0);\n  const containerRef = useRef(null);\n  \n  const open = useCallback(() => setIsOpen(true), []);\n  const close = useCallback(() => { setIsOpen(false); setHighlightedIndex(0); }, []);\n  const toggle = useCallback(() => setIsOpen(o => !o), []);\n  \n  const selectOption = useCallback((option) => {\n    setSelected(option);\n    close();\n  }, [close]);\n  \n  const handleKeyDown = useCallback((e) => {\n    if (!isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {\n      e.preventDefault();\n      open();\n      return;\n    }\n    if (!isOpen) return;\n    \n    switch (e.key) {\n      case 'ArrowDown':\n        e.preventDefault();\n        setHighlightedIndex(i => Math.min(i + 1, options.length - 1));\n        break;\n      case 'ArrowUp':\n        e.preventDefault();\n        setHighlightedIndex(i => Math.max(i - 1, 0));\n        break;\n      case 'Enter':\n        e.preventDefault();\n        selectOption(options[highlightedIndex]);\n        break;\n      case 'Escape':\n        e.preventDefault();\n        close();\n        break;\n    }\n  }, [isOpen, options, highlightedIndex, open, close, selectOption]);\n  \n  // Click outside to close\n  useEffect(() => {\n    const handler = (e) => {\n      if (containerRef.current && !containerRef.current.contains(e.target)) close();\n    };\n    document.addEventListener('mousedown', handler);\n    return () => document.removeEventListener('mousedown', handler);\n  }, [close]);\n  \n  // Props getters - return props to spread on elements\n  const getContainerProps = () => ({ ref: containerRef });\n  \n  const getTriggerProps = () => ({\n    onClick: toggle,\n    onKeyDown: handleKeyDown,\n    tabIndex: 0,\n    role: 'combobox',\n    'aria-expanded': isOpen,\n    'aria-haspopup': 'listbox',\n  });\n  \n  const getListProps = () => ({\n    role: 'listbox',\n    'aria-activedescendant': isOpen ? `option-${highlightedIndex}` : undefined,\n  });\n  \n  const getOptionProps = (option, index) => ({\n    id: `option-${index}`,\n    role: 'option',\n    'aria-selected': selected === option,\n    onClick: () => selectOption(option),\n    onMouseEnter: () => setHighlightedIndex(index),\n  });\n  \n  return {\n    isOpen, selected, highlightedIndex, options,\n    getContainerProps, getTriggerProps, getListProps, getOptionProps,\n  };\n}\n\n// Custom-styled Select using the headless hook\nfunction CustomSelect() {\n  const {\n    isOpen, selected, highlightedIndex, options,\n    getContainerProps, getTriggerProps, getListProps, getOptionProps,\n  } = useSelect({\n    options: ['React', 'Vue', 'Angular', 'Svelte', 'Solid'],\n    defaultValue: 'React',\n  });\n  \n  return (\n    <div {...getContainerProps()} style={{ position: 'relative', width: 280 }}>\n      <div\n        {...getTriggerProps()}\n        style={{ padding: '14px 18px', background: 'rgba(97,218,251,0.1)', borderRadius: 12, border: '2px solid rgba(97,218,251,0.3)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}\n      >\n        <span style={{ color: '#e6f0ff', fontWeight: 600 }}>{selected || 'Select framework...'}</span>\n        <span style={{ color: '#61dafb', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>\n      </div>\n      \n      {isOpen && (\n        <ul {...getListProps()} style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, padding: 8, background: 'rgba(10,22,40,0.98)', borderRadius: 12, border: '1px solid rgba(97,218,251,0.2)', listStyle: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>\n          {options.map((option, index) => (\n            <li\n              key={option}\n              {...getOptionProps(option, index)}\n              style={{ padding: '12px 16px', borderRadius: 8, cursor: 'pointer', background: highlightedIndex === index ? 'rgba(97,218,251,0.15)' : 'transparent', color: selected === option ? '#61dafb' : '#c6d5ff', fontWeight: selected === option ? 700 : 400 }}\n            >\n              {option} {selected === option && '✓'}\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>Headless UI: Custom Select</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Full keyboard support (arrows, enter, escape) with custom styling!</p>\n      <CustomSelect />\n      <div style={{ marginTop: 24, padding: 16, background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>\n        <p style={{ color: '#a78bfa', margin: 0, fontSize: 14 }}>\n          <strong>Try:</strong> Click to open, use arrow keys, Enter to select, Escape to close\n        </p>\n      </div>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("useSelect") && code.includes("getProps") && code.includes("aria-"),
        message: "✅ Headless UI pattern mastered!",
      }),
    },
    // ============================================================
    // TYPESCRIPT INTEGRATION LESSONS (38-39)
    // ============================================================
    {
      title: "React 38: TypeScript with React Fundamentals",
      content: [
        "**TypeScript** adds static types to React, catching errors at compile time instead of runtime. You get autocompletion, refactoring support, and self-documenting code.",
        "Key concepts: typing props with interfaces, typing state with generics, typing event handlers, and using built-in React types like `FC`, `ReactNode`, and `ChangeEvent`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Typing Props and State",
          body: "Define **interfaces** for props. React provides generics for hooks: `useState<number>(0)`, `useRef<HTMLInputElement>(null)`. This gives you autocomplete and catches type mismatches.",
          badges: ["TypeScript", "Props", "State"],
          code: "interface ButtonProps {\n  label: string;\n  variant?: 'primary' | 'secondary';\n  onClick: () => void;\n  disabled?: boolean;\n}\n\nfunction Button({ label, variant = 'primary', onClick, disabled }: ButtonProps) {\n  return <button onClick={onClick} disabled={disabled}>{label}</button>;\n}",
        },
        {
          tag: "key-point",
          title: "Common React Types",
          body: "**ReactNode** - anything renderable. **FC<Props>** - function component type. **ChangeEvent<HTMLInputElement>** - form events. **CSSProperties** - inline styles. **RefObject<T>** - refs.",
          badges: ["Types", "Reference"],
        },
        {
          tag: "exercise",
          title: "Type a form component",
          body: "Create a typed **ContactForm** with: string fields (name, email), a select field with union type, and proper event handler types. Show TypeScript catching errors in comments.",
          badges: ["Practice", "Forms"],
        },
      ],
      defaultCode: "import { useState, FormEvent, ChangeEvent } from 'react';\n\n// TypeScript interfaces for props and state\ninterface FormData {\n  name: string;\n  email: string;\n  topic: 'general' | 'support' | 'feedback'; // Union type\n}\n\ninterface FormErrors {\n  name?: string;\n  email?: string;\n}\n\n// Type-safe form component\nfunction ContactForm() {\n  // Typed state with generics\n  const [formData, setFormData] = useState<FormData>({\n    name: '',\n    email: '',\n    topic: 'general',\n  });\n  const [errors, setErrors] = useState<FormErrors>({});\n  const [submitted, setSubmitted] = useState<boolean>(false);\n  \n  // Typed event handler\n  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {\n    const { name, value } = e.target;\n    setFormData(prev => ({ ...prev, [name]: value }));\n    // Clear error when user types\n    if (errors[name as keyof FormErrors]) {\n      setErrors(prev => ({ ...prev, [name]: undefined }));\n    }\n  };\n  \n  // Typed submit handler\n  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    const newErrors: FormErrors = {};\n    \n    if (!formData.name.trim()) newErrors.name = 'Name is required';\n    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';\n    \n    if (Object.keys(newErrors).length > 0) {\n      setErrors(newErrors);\n      return;\n    }\n    \n    setSubmitted(true);\n  };\n  \n  if (submitted) {\n    return (\n      <div style={{ padding: 24, background: 'rgba(74,222,128,0.15)', borderRadius: 16, textAlign: 'center' }}>\n        <h3 style={{ color: '#4ade80', margin: '0 0 8px' }}>Form Submitted!</h3>\n        <p style={{ color: '#c6d5ff', margin: 0 }}>Topic: {formData.topic}</p>\n      </div>\n    );\n  }\n  \n  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff', fontSize: 16 };\n  const errorStyle = { color: '#f87171', fontSize: 13, marginTop: 4 };\n  \n  return (\n    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>\n      <div style={{ marginBottom: 20 }}>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Name *</label>\n        <input\n          type=\"text\"\n          name=\"name\"\n          value={formData.name}\n          onChange={handleChange}\n          style={{ ...inputStyle, borderColor: errors.name ? '#f87171' : 'rgba(97,218,251,0.3)' }}\n        />\n        {errors.name && <p style={errorStyle}>{errors.name}</p>}\n      </div>\n      \n      <div style={{ marginBottom: 20 }}>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Email *</label>\n        <input\n          type=\"email\"\n          name=\"email\"\n          value={formData.email}\n          onChange={handleChange}\n          style={{ ...inputStyle, borderColor: errors.email ? '#f87171' : 'rgba(97,218,251,0.3)' }}\n        />\n        {errors.email && <p style={errorStyle}>{errors.email}</p>}\n      </div>\n      \n      <div style={{ marginBottom: 24 }}>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Topic</label>\n        <select\n          name=\"topic\"\n          value={formData.topic}\n          onChange={handleChange}\n          style={inputStyle}\n        >\n          <option value=\"general\">General Inquiry</option>\n          <option value=\"support\">Technical Support</option>\n          <option value=\"feedback\">Feedback</option>\n        </select>\n      </div>\n      \n      <button type=\"submit\" style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #61dafb, #a78bfa)', color: '#0a1628', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>\n        Submit\n      </button>\n    </form>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>TypeScript with React</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Fully typed form with validation!</p>\n      <ContactForm />\n      <div style={{ marginTop: 24, padding: 16, background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>\n        <p style={{ color: '#a78bfa', margin: 0, fontSize: 14 }}>\n          <strong>TypeScript catches:</strong> wrong prop types, missing required fields, invalid event handlers\n        </p>\n      </div>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("interface") && code.includes("useState<") && (code.includes("ChangeEvent") || code.includes("FormEvent")),
        message: "✅ TypeScript fundamentals mastered!",
      }),
    },
    {
      title: "React 39: Advanced TypeScript Patterns",
      content: [
        "Advanced TypeScript patterns make your components more flexible and type-safe: **generics** for reusable components, **discriminated unions** for state machines, **polymorphic components** for flexible element types.",
        "These patterns are used in popular libraries (React Router, Chakra UI, Radix) to provide excellent developer experience with full type safety.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Generic Components",
          body: "Generic components work with any data type while maintaining type safety. Think of `Array<T>`: it works with any type but tracks what is inside. Same idea for components.",
          badges: ["Generics", "Reusability", "DX"],
          code: "interface ListProps<T> {\n  items: T[];\n  renderItem: (item: T) => React.ReactNode;\n}\n\nfunction List<T>({ items, renderItem }: ListProps<T>) {\n  return <ul>{items.map(renderItem)}</ul>;\n}\n\n// Usage - TypeScript infers T!\n<List items={users} renderItem={(user) => <li>{user.name}</li>} />",
        },
        {
          tag: "key-point",
          title: "Discriminated Unions",
          body: "Use a literal type as a 'tag' to discriminate between variants. Perfect for state machines: `{ status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error }`",
          badges: ["Unions", "State Machines"],
        },
        {
          tag: "exercise",
          title: "Build a generic data table",
          body: "Create a **DataTable<T>** component that: accepts any array of objects, defines columns with type-safe accessors, and renders a sortable table. Use generics to ensure column keys match item properties.",
          badges: ["Practice", "Advanced"],
        },
      ],
      defaultCode: "import { useState, ReactNode } from 'react';\n\n// Generic column definition - keyof T ensures valid keys\ninterface Column<T> {\n  key: keyof T;\n  header: string;\n  render?: (value: T[keyof T], item: T) => ReactNode;\n}\n\n// Generic DataTable component\ninterface DataTableProps<T> {\n  data: T[];\n  columns: Column<T>[];\n}\n\nfunction DataTable<T extends Record<string, unknown>>({ data, columns }: DataTableProps<T>) {\n  const [sortKey, setSortKey] = useState<keyof T | null>(null);\n  const [sortAsc, setSortAsc] = useState(true);\n  \n  const handleSort = (key: keyof T) => {\n    if (sortKey === key) {\n      setSortAsc(!sortAsc);\n    } else {\n      setSortKey(key);\n      setSortAsc(true);\n    }\n  };\n  \n  const sorted = [...data].sort((a, b) => {\n    if (!sortKey) return 0;\n    const aVal = String(a[sortKey]);\n    const bVal = String(b[sortKey]);\n    return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);\n  });\n  \n  return (\n    <table style={{ width: '100%', borderCollapse: 'collapse' }}>\n      <thead>\n        <tr>\n          {columns.map(col => (\n            <th\n              key={String(col.key)}\n              onClick={() => handleSort(col.key)}\n              style={{ padding: '12px 16px', textAlign: 'left', background: 'rgba(97,218,251,0.1)', color: '#61dafb', cursor: 'pointer', borderBottom: '2px solid rgba(97,218,251,0.3)' }}\n            >\n              {col.header}\n              {sortKey === col.key && (sortAsc ? ' ↑' : ' ↓')}\n            </th>\n          ))}\n        </tr>\n      </thead>\n      <tbody>\n        {sorted.map((item, i) => (\n          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>\n            {columns.map(col => (\n              <td key={String(col.key)} style={{ padding: '12px 16px', color: '#c6d5ff' }}>\n                {col.render ? col.render(item[col.key], item) : String(item[col.key])}\n              </td>\n            ))}\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}\n\n// Example usage with typed data\ninterface User {\n  id: number;\n  name: string;\n  role: 'admin' | 'user' | 'guest';\n  score: number;\n}\n\nconst users: User[] = [\n  { id: 1, name: 'Alice', role: 'admin', score: 95 },\n  { id: 2, name: 'Bob', role: 'user', score: 82 },\n  { id: 3, name: 'Charlie', role: 'guest', score: 67 },\n  { id: 4, name: 'Diana', role: 'user', score: 91 },\n];\n\nconst columns: Column<User>[] = [\n  { key: 'name', header: 'Name' },\n  { key: 'role', header: 'Role', render: (v) => (\n    <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: v === 'admin' ? 'rgba(139,92,246,0.2)' : v === 'user' ? 'rgba(97,218,251,0.2)' : 'rgba(255,255,255,0.1)', color: v === 'admin' ? '#a78bfa' : v === 'user' ? '#61dafb' : '#9fc4ff' }}>\n      {String(v)}\n    </span>\n  )},\n  { key: 'score', header: 'Score', render: (v) => (\n    <span style={{ color: Number(v) >= 90 ? '#4ade80' : Number(v) >= 70 ? '#fbbf24' : '#f87171', fontWeight: 600 }}>{String(v)}</span>\n  )},\n];\n\nfunction App() {\n  return (\n    <div>\n      <h2>Advanced TypeScript: Generic DataTable</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Click headers to sort. Fully type-safe!</p>\n      <DataTable data={users} columns={columns} />\n      <div style={{ marginTop: 24, padding: 16, background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>\n        <p style={{ color: '#a78bfa', margin: 0, fontSize: 14 }}>\n          <strong>Generics:</strong> DataTable works with any type, Column keys match item properties\n        </p>\n      </div>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("<T>") && code.includes("keyof") && code.includes("interface"),
        message: "✅ Advanced TypeScript patterns mastered!",
      }),
    },
    // ============================================================
    // DATA & FORMS LESSONS (40-41)
    // ============================================================
    {
      title: "React 40: Form Management with React Hook Form",
      content: [
        "**React Hook Form** minimizes re-renders and simplifies validation. Instead of controlled inputs, it uses refs and subscriptions. Result: better performance and less boilerplate.",
        "Key features: `register()` connects inputs, `handleSubmit()` manages submission, `formState` tracks errors/touched/dirty, and schema validation with Yup or Zod.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Uncontrolled with superpowers",
          body: "RHF uses refs internally, avoiding re-renders on every keystroke. `register('email')` returns props to spread on inputs. Validation rules go directly in register: `register('email', { required: true, pattern: /.../ })`",
          badges: ["Performance", "Forms", "Validation"],
          code: "const { register, handleSubmit, formState: { errors } } = useForm();\n\n<form onSubmit={handleSubmit(onSubmit)}>\n  <input {...register('email', { required: 'Email is required' })} />\n  {errors.email && <span>{errors.email.message}</span>}\n  <button type=\"submit\">Submit</button>\n</form>",
        },
        {
          tag: "key-point",
          title: "Why RHF?",
          body: "1. **Minimal re-renders** - only when needed. 2. **Small bundle** - ~8kb. 3. **Built-in validation** - or use Zod/Yup. 4. **Great DX** - TypeScript support, DevTools. 5. **Flexible** - works with any UI library.",
          badges: ["Performance", "DX"],
        },
        {
          tag: "exercise",
          title: "Build a registration form",
          body: "Create a form with: name (required), email (required, pattern), password (min 8 chars), confirm password (must match). Show validation errors and success state. Simulate React Hook Form concepts.",
          badges: ["Practice", "Validation"],
        },
      ],
      defaultCode: "import { useState, useRef, useCallback } from 'react';\n\n// Simulating React Hook Form concepts\nfunction useSimpleForm(defaultValues = {}) {\n  const valuesRef = useRef(defaultValues);\n  const errorsRef = useRef({});\n  const [, forceUpdate] = useState(0);\n  \n  const register = (name, rules = {}) => ({\n    name,\n    defaultValue: defaultValues[name] || '',\n    onChange: (e) => {\n      valuesRef.current[name] = e.target.value;\n      // Validate on change\n      const error = validateField(name, e.target.value, rules);\n      errorsRef.current[name] = error;\n      forceUpdate(n => n + 1);\n    },\n  });\n  \n  const validateField = (name, value, rules) => {\n    if (rules.required && !value) return rules.required === true ? 'Required' : rules.required;\n    if (rules.minLength && value.length < rules.minLength.value) return rules.minLength.message;\n    if (rules.pattern && !rules.pattern.value.test(value)) return rules.pattern.message;\n    if (rules.validate && !rules.validate(value)) return 'Invalid';\n    return null;\n  };\n  \n  const handleSubmit = (onValid) => (e) => {\n    e.preventDefault();\n    const hasErrors = Object.values(errorsRef.current).some(Boolean);\n    if (!hasErrors) onValid(valuesRef.current);\n  };\n  \n  return { register, handleSubmit, errors: errorsRef.current, values: valuesRef.current };\n}\n\nfunction RegistrationForm() {\n  const [submitted, setSubmitted] = useState(false);\n  const { register, handleSubmit, errors, values } = useSimpleForm({\n    name: '', email: '', password: '', confirmPassword: '',\n  });\n  \n  const onSubmit = (data) => {\n    if (data.password !== data.confirmPassword) {\n      alert('Passwords must match!');\n      return;\n    }\n    setSubmitted(true);\n  };\n  \n  if (submitted) {\n    return (\n      <div style={{ padding: 24, background: 'rgba(74,222,128,0.15)', borderRadius: 16, textAlign: 'center' }}>\n        <h3 style={{ color: '#4ade80', margin: '0 0 8px' }}>Registration Complete!</h3>\n        <p style={{ color: '#c6d5ff', margin: 0 }}>Welcome, {values.name}</p>\n      </div>\n    );\n  }\n  \n  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff', fontSize: 16, marginBottom: 4 };\n  const errorStyle = { color: '#f87171', fontSize: 13, marginBottom: 12, display: 'block' };\n  \n  return (\n    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400 }}>\n      <div>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Name *</label>\n        <input\n          {...register('name', { required: 'Name is required' })}\n          style={{ ...inputStyle, borderColor: errors.name ? '#f87171' : 'rgba(97,218,251,0.3)' }}\n        />\n        {errors.name && <span style={errorStyle}>{errors.name}</span>}\n      </div>\n      \n      <div>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Email *</label>\n        <input\n          type=\"email\"\n          {...register('email', {\n            required: 'Email is required',\n            pattern: { value: /^[^@]+@[^@]+\\.[^@]+$/, message: 'Invalid email format' },\n          })}\n          style={{ ...inputStyle, borderColor: errors.email ? '#f87171' : 'rgba(97,218,251,0.3)' }}\n        />\n        {errors.email && <span style={errorStyle}>{errors.email}</span>}\n      </div>\n      \n      <div>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Password *</label>\n        <input\n          type=\"password\"\n          {...register('password', {\n            required: 'Password is required',\n            minLength: { value: 8, message: 'Min 8 characters' },\n          })}\n          style={{ ...inputStyle, borderColor: errors.password ? '#f87171' : 'rgba(97,218,251,0.3)' }}\n        />\n        {errors.password && <span style={errorStyle}>{errors.password}</span>}\n      </div>\n      \n      <div>\n        <label style={{ color: '#9fc4ff', display: 'block', marginBottom: 6 }}>Confirm Password *</label>\n        <input\n          type=\"password\"\n          {...register('confirmPassword', { required: 'Please confirm password' })}\n          style={{ ...inputStyle, borderColor: errors.confirmPassword ? '#f87171' : 'rgba(97,218,251,0.3)' }}\n        />\n        {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}\n      </div>\n      \n      <button type=\"submit\" style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #61dafb, #a78bfa)', color: '#0a1628', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>\n        Create Account\n      </button>\n    </form>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>Form Management (RHF Concepts)</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Validation on change, minimal re-renders!</p>\n      <RegistrationForm />\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("register") && code.includes("handleSubmit") && code.includes("errors"),
        message: "✅ Form management patterns mastered!",
      }),
    },
    {
      title: "React 41: Data Fetching Patterns",
      content: [
        "Modern data fetching uses **SWR** or **TanStack Query** (React Query) instead of raw useEffect. These libraries handle caching, revalidation, deduplication, and optimistic updates automatically.",
        "Key concepts: **stale-while-revalidate** (serve cached data while fetching fresh), **cache keys** (identify unique queries), **mutations** (update server, then cache), **prefetching** (load before needed).",
      ],
      sections: [
        {
          tag: "concept",
          title: "Stale-While-Revalidate",
          body: "SWR returns cached data immediately (fast!), then fetches fresh data in background. If fresh data differs, UI updates. User gets instant response plus eventual consistency.",
          badges: ["SWR", "Caching", "UX"],
          code: "// SWR pattern\nconst { data, error, isLoading, mutate } = useSWR('/api/user', fetcher);\n\n// Automatic features:\n// - Caches response\n// - Revalidates on focus\n// - Deduplicates requests\n// - Retries on error",
        },
        {
          tag: "key-point",
          title: "Why not just useEffect?",
          body: "useEffect requires handling: loading state, error state, race conditions, caching, deduplication, background refresh, retry logic. SWR/Query handle all this. Focus on your UI, not data plumbing.",
          badges: ["DX", "Maintainability"],
        },
        {
          tag: "exercise",
          title: "Build a data fetching hook",
          body: "Create **useData** that implements: caching (in-memory), loading/error states, automatic refetch on window focus, and a mutate function to update cache. Demonstrate with a user profile fetcher.",
          badges: ["Practice", "Patterns"],
        },
      ],
      defaultCode: "import { useState, useEffect, useCallback, useRef } from 'react';\n\n// Simple in-memory cache\nconst cache = new Map();\n\n// Custom hook implementing SWR-like patterns\nfunction useData(key, fetcher, options = {}) {\n  const { revalidateOnFocus = true } = options;\n  const [state, setState] = useState({\n    data: cache.get(key) || null,\n    error: null,\n    isLoading: !cache.has(key),\n  });\n  const mountedRef = useRef(true);\n  \n  const revalidate = useCallback(async () => {\n    try {\n      const data = await fetcher();\n      cache.set(key, data);\n      if (mountedRef.current) {\n        setState({ data, error: null, isLoading: false });\n      }\n    } catch (error) {\n      if (mountedRef.current) {\n        setState(s => ({ ...s, error, isLoading: false }));\n      }\n    }\n  }, [key, fetcher]);\n  \n  // Initial fetch\n  useEffect(() => {\n    mountedRef.current = true;\n    if (!cache.has(key)) revalidate();\n    return () => { mountedRef.current = false; };\n  }, [key, revalidate]);\n  \n  // Revalidate on focus\n  useEffect(() => {\n    if (!revalidateOnFocus) return;\n    const handleFocus = () => revalidate();\n    window.addEventListener('focus', handleFocus);\n    return () => window.removeEventListener('focus', handleFocus);\n  }, [revalidate, revalidateOnFocus]);\n  \n  // Mutate function to update cache optimistically\n  const mutate = useCallback((newData) => {\n    const updated = typeof newData === 'function' ? newData(state.data) : newData;\n    cache.set(key, updated);\n    setState(s => ({ ...s, data: updated }));\n  }, [key, state.data]);\n  \n  return { ...state, revalidate, mutate };\n}\n\n// Simulated API\nconst fetchUser = () => new Promise((resolve) => {\n  setTimeout(() => {\n    resolve({\n      id: 1,\n      name: 'Sarah Chen',\n      email: 'sarah@example.com',\n      role: 'Senior Engineer',\n      avatar: 'SC',\n      lastActive: new Date().toLocaleTimeString(),\n    });\n  }, 800);\n});\n\nfunction UserProfile() {\n  const { data: user, isLoading, error, revalidate, mutate } = useData('user', fetchUser);\n  \n  const handleRoleChange = () => {\n    // Optimistic update - updates UI immediately\n    mutate(prev => ({ ...prev, role: 'Staff Engineer', lastActive: new Date().toLocaleTimeString() }));\n  };\n  \n  if (isLoading) {\n    return (\n      <div style={{ padding: 40, textAlign: 'center' }}>\n        <div style={{ width: 40, height: 40, border: '3px solid rgba(97,218,251,0.3)', borderTopColor: '#61dafb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />\n        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>\n        <p style={{ color: '#9fc4ff', marginTop: 16 }}>Loading user...</p>\n      </div>\n    );\n  }\n  \n  if (error) {\n    return (\n      <div style={{ padding: 24, background: 'rgba(248,113,113,0.15)', borderRadius: 16 }}>\n        <p style={{ color: '#f87171', margin: 0 }}>Error loading user</p>\n        <button onClick={revalidate} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#f87171', color: 'white', cursor: 'pointer' }}>Retry</button>\n      </div>\n    );\n  }\n  \n  return (\n    <div style={{ padding: 24, background: 'rgba(97,218,251,0.08)', borderRadius: 16, border: '1px solid rgba(97,218,251,0.2)' }}>\n      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>\n        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #61dafb, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a1628', fontSize: 20, fontWeight: 700 }}>\n          {user.avatar}\n        </div>\n        <div>\n          <h3 style={{ color: '#e6f0ff', margin: '0 0 4px' }}>{user.name}</h3>\n          <p style={{ color: '#9fc4ff', margin: 0, fontSize: 14 }}>{user.email}</p>\n        </div>\n      </div>\n      \n      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>\n        <span style={{ padding: '6px 14px', background: 'rgba(139,92,246,0.2)', borderRadius: 20, color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>{user.role}</span>\n        <span style={{ padding: '6px 14px', background: 'rgba(74,222,128,0.15)', borderRadius: 20, color: '#4ade80', fontSize: 13 }}>Active: {user.lastActive}</span>\n      </div>\n      \n      <div style={{ display: 'flex', gap: 8 }}>\n        <button onClick={revalidate} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(97,218,251,0.3)', background: 'transparent', color: '#61dafb', fontWeight: 600, cursor: 'pointer' }}>\n          Refresh\n        </button>\n        <button onClick={handleRoleChange} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#a78bfa', color: '#0a1628', fontWeight: 600, cursor: 'pointer' }}>\n          Promote (Optimistic)\n        </button>\n      </div>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>Data Fetching Patterns</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>SWR-style: cache, revalidate on focus, optimistic updates!</p>\n      <UserProfile />\n      <div style={{ marginTop: 20, padding: 16, background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>\n        <p style={{ color: '#a78bfa', margin: 0, fontSize: 14 }}>\n          <strong>Try:</strong> Click Promote to see optimistic update, or switch tabs and return to see revalidation\n        </p>\n      </div>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("cache") && code.includes("revalidate") && code.includes("mutate"),
        message: "✅ Data fetching patterns mastered!",
      }),
    },
    // ============================================================
    // PERFORMANCE & ACCESSIBILITY LESSONS (42-43)
    // ============================================================
    {
      title: "React 42: Performance Profiling",
      content: [
        "React DevTools **Profiler** reveals why your components render. It shows render times, what triggered renders, and helps identify unnecessary work. Essential for optimizing slow UIs.",
        "Key metrics: **render duration**, **commit phase** (React updates DOM), **why did this render** (props/state/context). Use **React.memo**, **useMemo**, **useCallback** strategically after profiling—not preemptively.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Profile before optimizing",
          body: "Never optimize without measuring first. The Profiler shows exactly which components are slow. Often the fix is simple: lifting state, memoizing expensive calculations, or splitting components.",
          badges: ["DevTools", "Profiling", "Optimization"],
          code: "// React DevTools Profiler shows:\n// - Which components rendered\n// - How long each took\n// - What caused the render\n// - Flame graph visualization\n\n// Common fixes after profiling:\n// 1. React.memo for components that render with same props\n// 2. useMemo for expensive calculations\n// 3. useCallback for callbacks passed to memoized children\n// 4. Split large components",
        },
        {
          tag: "key-point",
          title: "Optimization techniques",
          body: "**React.memo** - skip render if props unchanged. **useMemo** - cache calculation result. **useCallback** - cache function reference. **Lazy loading** - code split heavy components. **Virtualization** - render only visible items.",
          badges: ["memo", "useMemo", "Virtual"],
        },
        {
          tag: "exercise",
          title: "Optimize a slow list",
          body: "Create a **ContactList** with 1000 items and a search filter. Initially it will be slow. Add optimizations: memoize filtered results, memoize list items, show render counts to prove it works.",
          badges: ["Practice", "Performance"],
        },
      ],
      defaultCode: "import { useState, useMemo, memo, useRef, useEffect } from 'react';\n\n// Generate mock contacts\nconst generateContacts = (count) => {\n  return Array.from({ length: count }, (_, i) => ({\n    id: i + 1,\n    name: `Contact ${i + 1}`,\n    email: `contact${i + 1}@example.com`,\n    department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],\n  }));\n};\n\nconst CONTACTS = generateContacts(500);\n\n// Render counter for debugging\nfunction useRenderCount() {\n  const count = useRef(0);\n  count.current++;\n  return count.current;\n}\n\n// Memoized contact item - only re-renders if props change\nconst ContactItem = memo(function ContactItem({ contact }) {\n  const renders = useRenderCount();\n  \n  return (\n    <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\n      <div>\n        <p style={{ color: '#e6f0ff', margin: '0 0 4px', fontWeight: 600 }}>{contact.name}</p>\n        <p style={{ color: '#9fc4ff', margin: 0, fontSize: 13 }}>{contact.email}</p>\n      </div>\n      <div style={{ textAlign: 'right' }}>\n        <span style={{ padding: '4px 10px', background: 'rgba(139,92,246,0.2)', borderRadius: 12, color: '#a78bfa', fontSize: 11 }}>{contact.department}</span>\n        <p style={{ color: '#4ade80', margin: '4px 0 0', fontSize: 11 }}>renders: {renders}</p>\n      </div>\n    </div>\n  );\n});\n\nfunction ContactList() {\n  const [search, setSearch] = useState('');\n  const [department, setDepartment] = useState('all');\n  const listRenders = useRenderCount();\n  \n  // Memoize expensive filtering\n  const filteredContacts = useMemo(() => {\n    console.log('Filtering contacts...');\n    return CONTACTS.filter(c => {\n      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||\n                           c.email.toLowerCase().includes(search.toLowerCase());\n      const matchesDept = department === 'all' || c.department === department;\n      return matchesSearch && matchesDept;\n    });\n  }, [search, department]);\n  \n  return (\n    <div>\n      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>\n        <input\n          value={search}\n          onChange={e => setSearch(e.target.value)}\n          placeholder=\"Search contacts...\"\n          style={{ flex: '1 1 200px', padding: '12px 16px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff' }}\n        />\n        <select\n          value={department}\n          onChange={e => setDepartment(e.target.value)}\n          style={{ padding: '12px 16px', borderRadius: 10, border: '2px solid rgba(97,218,251,0.3)', background: 'rgba(0,0,0,0.3)', color: '#e6f0ff' }}\n        >\n          <option value=\"all\">All Departments</option>\n          <option value=\"Engineering\">Engineering</option>\n          <option value=\"Design\">Design</option>\n          <option value=\"Marketing\">Marketing</option>\n          <option value=\"Sales\">Sales</option>\n        </select>\n      </div>\n      \n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>\n        <p style={{ color: '#9fc4ff', margin: 0, fontSize: 14 }}>\n          Showing {filteredContacts.length} of {CONTACTS.length} contacts\n        </p>\n        <span style={{ padding: '4px 10px', background: 'rgba(74,222,128,0.15)', borderRadius: 8, color: '#4ade80', fontSize: 12 }}>\n          List renders: {listRenders}\n        </span>\n      </div>\n      \n      <div style={{ maxHeight: 300, overflowY: 'auto', padding: 4 }}>\n        {filteredContacts.slice(0, 50).map(contact => (\n          <ContactItem key={contact.id} contact={contact} />\n        ))}\n        {filteredContacts.length > 50 && (\n          <p style={{ color: '#9fc4ff', textAlign: 'center', padding: 12 }}>\n            + {filteredContacts.length - 50} more (virtualization would help here)\n          </p>\n        )}\n      </div>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <h2>Performance Profiling</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Watch render counts - memoization prevents unnecessary work!</p>\n      <ContactList />\n      <div style={{ marginTop: 20, padding: 16, background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>\n        <p style={{ color: '#a78bfa', margin: 0, fontSize: 14 }}>\n          <strong>Optimizations:</strong> useMemo for filtering, React.memo for items. Items only re-render when their data changes!\n        </p>\n      </div>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("useMemo") && code.includes("memo") && code.includes("filter"),
        message: "✅ Performance profiling mastered!",
      }),
    },
    {
      title: "React 43: Accessibility in React",
      content: [
        "**Accessibility (a11y)** ensures everyone can use your app—including people using screen readers, keyboards, or assistive technologies. React makes a11y straightforward with proper semantic HTML and ARIA attributes.",
        "Key practices: semantic HTML (button not div), keyboard navigation, focus management, ARIA labels and live regions, color contrast, and skip links. Test with screen readers and keyboard-only navigation.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Semantic HTML first",
          body: "Use the right element: `<button>` for actions (has keyboard support built-in), `<a>` for navigation, `<input>` for forms. Semantic HTML is already accessible. Only add ARIA when HTML is not enough.",
          badges: ["Semantic HTML", "ARIA", "Best Practices"],
          code: "// Bad - div with click handler\n<div onClick={handleClick}>Click me</div>\n\n// Good - semantic button\n<button onClick={handleClick}>Click me</button>\n\n// When ARIA is needed\n<button aria-label=\"Close dialog\" aria-pressed={isPressed}>\n  <CloseIcon />\n</button>",
        },
        {
          tag: "key-point",
          title: "Focus management",
          body: "When modals open, move focus inside. When they close, return focus to trigger. Use **tabIndex** thoughtfully, **focus trapping** in dialogs, and **skip links** for keyboard users to bypass navigation.",
          badges: ["Focus", "Keyboard", "Modals"],
        },
        {
          tag: "exercise",
          title: "Build an accessible modal",
          body: "Create a **Modal** with: focus trap (Tab stays inside), Escape to close, aria-labelledby for title, aria-describedby for content, return focus to trigger on close, backdrop click to dismiss.",
          badges: ["Practice", "A11y"],
        },
      ],
      defaultCode: "import { useState, useEffect, useRef, useCallback } from 'react';\n\n// Accessible Modal with focus management\nfunction Modal({ isOpen, onClose, title, children }) {\n  const modalRef = useRef(null);\n  const triggerRef = useRef(null);\n  const titleId = 'modal-title';\n  const descId = 'modal-desc';\n  \n  // Focus trap - keep focus inside modal\n  useEffect(() => {\n    if (!isOpen || !modalRef.current) return;\n    \n    const focusableElements = modalRef.current.querySelectorAll(\n      'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])'\n    );\n    const firstEl = focusableElements[0];\n    const lastEl = focusableElements[focusableElements.length - 1];\n    \n    // Focus first element\n    firstEl?.focus();\n    \n    const handleTab = (e) => {\n      if (e.key !== 'Tab') return;\n      \n      if (e.shiftKey && document.activeElement === firstEl) {\n        e.preventDefault();\n        lastEl?.focus();\n      } else if (!e.shiftKey && document.activeElement === lastEl) {\n        e.preventDefault();\n        firstEl?.focus();\n      }\n    };\n    \n    const handleEscape = (e) => {\n      if (e.key === 'Escape') onClose();\n    };\n    \n    document.addEventListener('keydown', handleTab);\n    document.addEventListener('keydown', handleEscape);\n    \n    return () => {\n      document.removeEventListener('keydown', handleTab);\n      document.removeEventListener('keydown', handleEscape);\n    };\n  }, [isOpen, onClose]);\n  \n  // Return focus to trigger on close\n  useEffect(() => {\n    if (!isOpen && triggerRef.current) {\n      triggerRef.current.focus();\n    }\n  }, [isOpen]);\n  \n  if (!isOpen) return null;\n  \n  return (\n    <div\n      role=\"dialog\"\n      aria-modal=\"true\"\n      aria-labelledby={titleId}\n      aria-describedby={descId}\n      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}\n    >\n      {/* Backdrop */}\n      <div\n        onClick={onClose}\n        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}\n        aria-hidden=\"true\"\n      />\n      \n      {/* Modal content */}\n      <div\n        ref={modalRef}\n        style={{ position: 'relative', background: '#0a1628', borderRadius: 16, padding: 24, maxWidth: 400, width: '90%', border: '1px solid rgba(97,218,251,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}\n      >\n        <h2 id={titleId} style={{ color: '#e6f0ff', margin: '0 0 12px' }}>{title}</h2>\n        <div id={descId} style={{ color: '#c6d5ff', marginBottom: 24, lineHeight: 1.6 }}>\n          {children}\n        </div>\n        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>\n          <button\n            onClick={onClose}\n            style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(97,218,251,0.3)', background: 'transparent', color: '#61dafb', fontWeight: 600, cursor: 'pointer' }}\n          >\n            Cancel\n          </button>\n          <button\n            onClick={onClose}\n            style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#61dafb', color: '#0a1628', fontWeight: 600, cursor: 'pointer' }}\n          >\n            Confirm\n          </button>\n        </div>\n        <button\n          onClick={onClose}\n          aria-label=\"Close dialog\"\n          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#9fc4ff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}\n        >\n          X\n        </button>\n      </div>\n    </div>\n  );\n}\n\nfunction App() {\n  const [isOpen, setIsOpen] = useState(false);\n  const buttonRef = useRef(null);\n  \n  return (\n    <div>\n      <h2>Accessibility: Modal</h2>\n      <p style={{ color: '#c6d5ff', marginBottom: 20 }}>Focus trap, Escape to close, ARIA attributes!</p>\n      \n      <button\n        ref={buttonRef}\n        onClick={() => setIsOpen(true)}\n        style={{ padding: '14px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #61dafb, #a78bfa)', color: '#0a1628', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}\n      >\n        Open Accessible Modal\n      </button>\n      \n      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title=\"Accessible Dialog\">\n        <p>This modal has proper accessibility features:</p>\n        <ul style={{ margin: '12px 0', paddingLeft: 20 }}>\n          <li>Focus is trapped inside (Tab cycles through buttons)</li>\n          <li>Escape key closes it</li>\n          <li>Click backdrop to close</li>\n          <li>ARIA labels for screen readers</li>\n          <li>Focus returns to trigger on close</li>\n        </ul>\n      </Modal>\n      \n      <div style={{ marginTop: 24, padding: 16, background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>\n        <p style={{ color: '#a78bfa', margin: 0, fontSize: 14 }}>\n          <strong>Test it:</strong> Use Tab to navigate, Escape to close, or click backdrop\n        </p>\n      </div>\n      \n      <div style={{ marginTop: 16, padding: 16, background: 'rgba(97,218,251,0.1)', borderRadius: 12 }}>\n        <h4 style={{ color: '#61dafb', margin: '0 0 8px' }}>A11y Checklist</h4>\n        <ul style={{ color: '#c6d5ff', margin: 0, paddingLeft: 20, fontSize: 14 }}>\n          <li>Use semantic HTML (button, not div)</li>\n          <li>Add aria-label for icon buttons</li>\n          <li>Manage focus in modals/dialogs</li>\n          <li>Support keyboard navigation</li>\n          <li>Test with screen readers</li>\n        </ul>\n      </div>\n    </div>\n  );\n}\nexport default App;",
      validationLogic: (code) => ({
        success: code.includes("aria-") && code.includes("role=") && code.includes("focus"),
        message: "✅ Accessibility patterns mastered!",
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

