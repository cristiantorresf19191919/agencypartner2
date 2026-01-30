/**
 * React/TSX challenges for the Developer Section.
 * These test deep knowledge of React hooks, rendering, TypeScript, and performance.
 * After 10 failed attempts, the solution is automatically revealed.
 */

export interface ReactChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  problemCode: string;
  explanation: string;
  solution: string;
  hints: string[];
  testCases: {
    description: string;
    validate: (code: string) => boolean;
  }[];
}

export const REACT_CHALLENGES: ReactChallenge[] = [
  {
    id: "stale-closure-trap",
    title: "The Stale Closure Trap",
    difficulty: "Medium",
    description: `Why does the alert show the initial count (0) even after clicking the button multiple times? Fix it without adding \`count\` to the dependency array.

The closure captures \`count\` from the first render. Use a Ref to track the current value.`,
    problemCode: `const StaleCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleAlert = () => {
      alert(count); // Always alerts 0
    };

    const timer = setTimeout(handleAlert, 3000);
    return () => clearTimeout(timer);
  }, []); // Intentionally empty

  return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
};`,
    explanation: `The closure captures \`count\` from the first render (0). Even though state updates, the effect closure still references the old value. Use \`useRef\` to store the current count and access it in the closure.`,
    solution: `import { useState, useEffect, useRef } from 'react';

const StaleCounter = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  
  countRef.current = count; // Updates on every render

  useEffect(() => {
    const handleAlert = () => {
      alert(countRef.current); // Always shows current value
    };

    const timer = setTimeout(handleAlert, 3000);
    return () => clearTimeout(timer);
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
};`,
    hints: [
      "The issue is that closures capture values at the time of definition.",
      "useRef allows you to store a mutable value that persists across renders.",
      "Update the ref value on every render, then use ref.current in the effect.",
    ],
    testCases: [
      {
        description: "Uses useRef to store count",
        validate: (code: string) => /useRef/.test(code) && /countRef/.test(code),
      },
      {
        description: "Updates ref on every render",
        validate: (code: string) => /countRef\.current\s*=\s*count/.test(code),
      },
      {
        description: "Uses ref.current in the alert",
        validate: (code: string) => /countRef\.current/.test(code) && /alert\(/.test(code),
      },
    ],
  },
  {
    id: "synchronous-state-updates",
    title: "Synchronous State Updates?",
    difficulty: "Easy",
    description: `What gets logged to the console when the button is clicked? Fix the code so both state updates are applied.

State updates are asynchronous and batched. Since \`val\` is constant within the closure, both calls set state to \`0 + 1\`.`,
    problemCode: `const DoubleClick = () => {
  const [val, setVal] = useState(0);

  const handleClick = () => {
    setVal(val + 1);
    setVal(val + 1);
    console.log(val); 
  };

  return <button onClick={handleClick}>Click</button>;
};`,
    explanation: `Console: \`0\`. State updates are batched and asynchronous. Rendered value: \`1\`. Since \`val\` is constant within the closure, both calls set state to \`0 + 1\`. Use the functional update form: \`setVal(prev => prev + 1)\`.`,
    solution: `import { useState } from 'react';

const DoubleClick = () => {
  const [val, setVal] = useState(0);

  const handleClick = () => {
    setVal(prev => prev + 1);
    setVal(prev => prev + 1);
    console.log(val); // Still 0 (state updates are async)
  };

  return <button onClick={handleClick}>Click</button>;
};`,
    hints: [
      "State updates are asynchronous and React batches them.",
      "Use the functional update form: setVal(prev => prev + 1).",
      "The console.log will still show 0, but the rendered value will be 2.",
    ],
    testCases: [
      {
        description: "Uses functional update form",
        validate: (code: string) => /setVal\s*\(\s*\w+\s*=>/.test(code),
      },
      {
        description: "Both updates use functional form",
        validate: (code: string) => (code.match(/setVal\s*\(\s*\w+\s*=>/g) || []).length >= 2,
      },
    ],
  },
  {
    id: "context-unnecessary-rerenders",
    title: "Context & Unnecessary Re-renders",
    difficulty: "Medium",
    description: `<Child /> is wrapped in \`React.memo\`, yet it re-renders every time <Parent /> updates. Why? Fix it.

The \`value\` object is recreated (new reference) on every render, causing all consumers to re-render.`,
    problemCode: `const Context = createContext<any>(null);

const Parent = () => {
  const [count, setCount] = useState(0);
  
  // The Trap
  const value = { count, log: () => console.log('hi') };

  return (
    <Context.Provider value={value}>
      <Child /> 
    </Context.Provider>
  );
};`,
    explanation: `The \`value\` object is recreated on every render, creating a new reference. Even if \`React.memo\` checks props, Context consumers always re-render when context value reference changes. Wrap the value in \`useMemo\` and functions in \`useCallback\`.`,
    solution: `import { createContext, useState, useMemo, useCallback } from 'react';

const Context = createContext<any>(null);

const Parent = () => {
  const [count, setCount] = useState(0);
  
  const log = useCallback(() => console.log('hi'), []);
  
  const value = useMemo(() => ({ count, log }), [count, log]);

  return (
    <Context.Provider value={value}>
      <Child /> 
    </Context.Provider>
  );
};`,
    hints: [
      "The problem is object reference equality - a new object is created each render.",
      "Use useMemo to memoize the context value object.",
      "Also memoize functions with useCallback.",
    ],
    testCases: [
      {
        description: "Uses useMemo for context value",
        validate: (code: string) => /useMemo/.test(code) && /value\s*=/.test(code),
      },
      {
        description: "Uses useCallback for functions",
        validate: (code: string) => /useCallback/.test(code) || /const\s+log\s*=\s*useCallback/.test(code),
      },
    ],
  },
  {
    id: "dependency-array-lying",
    title: "Dependency Array Lying",
    difficulty: "Medium",
    description: `The user fetches successfully, but the component enters an infinite loop of network requests. Why?

\`fetchUser\` is defined inside the component body, so it's a new function reference on every render, triggering the effect.`,
    problemCode: `const Profile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const res = await fetch(\`/api/\${userId}\`);
    return res.json();
  };

  useEffect(() => {
    fetchUser().then(setUser);
  }, [fetchUser]); 

  return <div>{user}</div>;
};`,
    explanation: `\`fetchUser\` is a new function reference on every render, so the dependency array sees it as changed, triggering the effect, which updates state, which triggers a render... infinite loop! Wrap \`fetchUser\` in \`useCallback\` or move it inside \`useEffect\`.`,
    solution: `import { useState, useEffect, useCallback } from 'react';

const Profile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    const res = await fetch(\`/api/\${userId}\`);
    return res.json();
  }, [userId]);

  useEffect(() => {
    fetchUser().then(setUser);
  }, [fetchUser]); 

  return <div>{user}</div>;
};

// OR move fetchUser inside useEffect:

// useEffect(() => {
//   const fetchUser = async () => {
//     const res = await fetch(\`/api/\${userId}\`);
//     setUser(await res.json());
//   };
//   fetchUser();
// }, [userId]);`,
    hints: [
      "Functions defined in component body are new on every render.",
      "Use useCallback with proper dependencies, or move the function inside useEffect.",
      "The real dependency is userId, not fetchUser.",
    ],
    testCases: [
      {
        description: "Uses useCallback or moves function inside useEffect",
        validate: (code: string) => /useCallback/.test(code) || /useEffect\s*\(\(\)\s*=>\s*\{[\s\S]*const\s+fetchUser/.test(code),
      },
      {
        description: "Includes userId in dependencies",
        validate: (code: string) => /\[.*userId.*\]/.test(code),
      },
    ],
  },
  {
    id: "polymorphic-components",
    title: "Polymorphic Components with TS",
    difficulty: "Hard",
    description: `Create a \`Text\` component that accepts an \`as\` prop (e.g., 'h1', 'span', 'a') and correctly inherits the HTML attributes for that tag (e.g., \`href\` should only be valid if \`as="a"\`).`,
    problemCode: `// Implement the Text component with proper TypeScript typing
export const Text = ({ as, children, ...props }) => {
  const Component = as || 'span';
  return <Component {...props}>{children}</Component>;
};`,
    explanation: `Use generic types with \`React.ElementType\` and \`React.ComponentPropsWithoutRef\` to properly type polymorphic components. The component type must extend a valid HTML element or React component.`,
    solution: `import React from 'react';

type TextProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

export const Text = <C extends React.ElementType = 'span'>({ 
  as, 
  children, 
  ...props 
}: TextProps<C>) => {
  const Component = as || 'span';
  return <Component {...props}>{children}</Component>;
};

// Usage:
// <Text as="h1">Heading</Text>
// <Text as="a" href="/link">Link</Text>`,
    hints: [
      "Use generic types with React.ElementType constraint.",
      "Use React.ComponentPropsWithoutRef to get the correct props for each element type.",
      "The generic C extends React.ElementType ensures type safety.",
    ],
    testCases: [
      {
        description: "Defines generic type with ElementType constraint",
        validate: (code: string) => /<C\s+extends\s+React\.ElementType/.test(code),
      },
      {
        description: "Uses ComponentPropsWithoutRef",
        validate: (code: string) => /ComponentPropsWithoutRef/.test(code),
      },
      {
        description: "Properly spreads props to Component",
        validate: (code: string) => /<Component\s+\.\.\.props/.test(code),
      },
    ],
  },
  {
    id: "uselayout-effect-vs-effect",
    title: "useLayoutEffect vs useEffect",
    difficulty: "Medium",
    description: `You see a flickering UI where an element appears at the top and instantly jumps to the bottom. Which hook fixes this and why?

\`useLayoutEffect\` runs synchronously after DOM mutations but before the browser paints, preventing visual flicker.`,
    problemCode: `const Component = () => {
  const [pos, setPos] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Calculate position based on some condition
      const newPos = calculatePosition();
      setPos(newPos);
    }
  }, []);

  return <div ref={ref} style={{ position: 'absolute', top: pos }}>Content</div>;
};`,
    explanation: `\`useEffect\` runs after the browser paints, so you see the element at position 0 first, then it jumps. \`useLayoutEffect\` runs synchronously before paint, so the position is set before the user sees anything.`,
    solution: `import { useState, useRef, useLayoutEffect } from 'react';

const Component = () => {
  const [pos, setPos] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      // Calculate position based on some condition
      const newPos = calculatePosition();
      setPos(newPos);
    }
  }, []);

  return <div ref={ref} style={{ position: 'absolute', top: pos }}>Content</div>;
};`,
    hints: [
      "useLayoutEffect runs synchronously before the browser paints.",
      "Use it when you need to measure DOM or prevent visual flicker.",
      "Replace useEffect with useLayoutEffect.",
    ],
    testCases: [
      {
        description: "Uses useLayoutEffect instead of useEffect",
        validate: (code: string) => /useLayoutEffect/.test(code),
      },
    ],
  },
  {
    id: "conditional-hook",
    title: "The Conditional Hook (The Illegal Move)",
    difficulty: "Easy",
    description: `Why does React throw an error here if \`isLoading\` changes from true to false?

Hooks depend on call order. Conditional returns before hooks disrupt the linked list of hooks React maintains internally.`,
    problemCode: `const BadComponent = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) return <Loader />;
  
  const [data, setData] = useState(null); // Error!
  return <div>{data}</div>;
};`,
    explanation: `React hooks must be called in the same order on every render. When \`isLoading\` changes, the number of hooks called changes, breaking React's internal hook linked list. Always call hooks at the top level.`,
    solution: `import { useState } from 'react';

const BadComponent = ({ isLoading }: { isLoading: boolean }) => {
  const [data, setData] = useState(null); // Always call hooks first
  
  if (isLoading) return <Loader />;
  
  return <div>{data}</div>;
};`,
    hints: [
      "Hooks must always be called in the same order on every render.",
      "Never call hooks conditionally or after early returns.",
      "Call all hooks at the top of the component, before any conditional logic.",
    ],
    testCases: [
      {
        description: "Hook is called before any conditional returns",
        validate: (code: string) => {
          const hookIndex = code.indexOf('useState');
          const returnIndex = code.indexOf('if (isLoading)');
          return hookIndex !== -1 && (returnIndex === -1 || hookIndex < returnIndex);
        },
      },
    ],
  },
  {
    id: "object-dependency-pitfall",
    title: "Object Dependency Pitfall",
    difficulty: "Easy",
    description: `Why does this effect run on every render?

\`config\` is a new object reference every render, so React sees it as changed.`,
    problemCode: `const Component = () => {
  const config = { theme: 'dark' };

  useEffect(() => {
    applyTheme(config);
  }, [config]);
};`,
    explanation: `Objects are compared by reference, not value. Even though the object contents are the same, it's a new object each render, so the dependency array triggers the effect every time. Use \`useMemo\` or move the object outside the component.`,
    solution: `import { useEffect, useMemo } from 'react';

// Option 1: useMemo
const Component = () => {
  const config = useMemo(() => ({ theme: 'dark' }), []);

  useEffect(() => {
    applyTheme(config);
  }, [config]);
};

// Option 2: Move outside component
const CONFIG = { theme: 'dark' };
const Component = () => {
  useEffect(() => {
    applyTheme(CONFIG);
  }, []);
};`,
    hints: [
      "Objects are compared by reference, not by value.",
      "Use useMemo to memoize the object, or move it outside the component.",
      "If the object never changes, move it to module scope.",
    ],
    testCases: [
      {
        description: "Uses useMemo or moves object outside component",
        validate: (code: string) => /useMemo/.test(code) || /const\s+\w+\s*=\s*\{[\s\S]*\}\s*;[\s\S]*const\s+Component/.test(code),
      },
    ],
  },
  {
    id: "use-previous",
    title: "Implementing usePrevious",
    difficulty: "Medium",
    description: `Write a custom hook \`usePrevious<T>(value: T)\` that returns the value from the previous render.`,
    problemCode: `// Implement usePrevious hook
function usePrevious<T>(value: T): T | undefined {
  // Your implementation here
}`,
    explanation: `Use \`useRef\` to store the previous value. Update it in \`useEffect\`, which runs after render. Return the ref's current value, which still holds the previous render's value.`,
    solution: `import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value; // Updates AFTER render
  }, [value]);
  
  return ref.current; // Returns value captured BEFORE update
}`,
    hints: [
      "Use useRef to store a mutable value that persists across renders.",
      "Update the ref in useEffect (which runs after render).",
      "Return ref.current, which still contains the previous value.",
    ],
    testCases: [
      {
        description: "Uses useRef to store previous value",
        validate: (code: string) => /useRef/.test(code),
      },
      {
        description: "Updates ref in useEffect",
        validate: (code: string) => /useEffect\s*\([\s\S]*ref\.current\s*=/.test(code),
      },
      {
        description: "Returns ref.current",
        validate: (code: string) => /return\s+ref\.current/.test(code),
      },
    ],
  },
  {
    id: "react-memo-callback",
    title: "React.memo & Callback Props",
    difficulty: "Medium",
    description: `\`MemoizedButton\` still re-renders when Parent updates. Fix it.

\`handleClick\` is a new function reference every time, so \`React.memo\` sees it as changed.`,
    problemCode: `const MemoizedButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>Click</button>
));

const Parent = () => {
  const [text, setText] = useState('');
  const handleClick = () => console.log('Clicked'); // Problem here

  return <MemoizedButton onClick={handleClick} />;
};`,
    explanation: `\`handleClick\` is recreated on every render, so \`React.memo\`'s shallow comparison sees a new function reference and re-renders. Wrap \`handleClick\` in \`useCallback\` to maintain the same function reference.`,
    solution: `import { useState, useCallback, memo } from 'react';

const MemoizedButton = memo(({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>Click</button>
));

const Parent = () => {
  const [text, setText] = useState('');
  const handleClick = useCallback(() => console.log('Clicked'), []);

  return <MemoizedButton onClick={handleClick} />;
};`,
    hints: [
      "Functions are recreated on every render unless memoized.",
      "Use useCallback to maintain the same function reference.",
      "If the callback depends on values, include them in the dependency array.",
    ],
    testCases: [
      {
        description: "Uses useCallback for the handler",
        validate: (code: string) => /useCallback/.test(code) && /handleClick/.test(code),
      },
    ],
  },
  {
    id: "ref-vs-state",
    title: "Ref vs State",
    difficulty: "Easy",
    description: `You need to count how many times a component renders without causing an additional re-render. How?

Use \`useRef\`. Updating \`ref.current\` does not trigger a re-render.`,
    problemCode: `const Component = () => {
  const [renderCount, setRenderCount] = useState(0); // Causes re-render

  useEffect(() => {
    setRenderCount(c => c + 1);
  });

  return <div>Rendered {renderCount} times</div>;
};`,
    explanation: `Using \`useState\` for render counting causes an infinite loop because each state update triggers a re-render. Use \`useRef\` instead - updating \`ref.current\` doesn't trigger re-renders.`,
    solution: `import { useRef, useEffect } from 'react';

const Component = () => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1; // Doesn't trigger re-render
  });

  return <div>Rendered {renderCount.current} times</div>;
};`,
    hints: [
      "useState triggers re-renders, which would cause an infinite loop here.",
      "useRef allows you to store a mutable value without triggering re-renders.",
      "Update ref.current directly, and read it when rendering.",
    ],
    testCases: [
      {
        description: "Uses useRef instead of useState",
        validate: (code: string) => /useRef/.test(code) && !/useState/.test(code),
      },
      {
        description: "Increments ref.current",
        validate: (code: string) => /renderCount\.current\s*\+=\s*1/.test(code),
      },
    ],
  },
  {
    id: "synthetic-events",
    title: "Synthetic Events vs Native",
    difficulty: "Hard",
    description: `If you \`e.stopPropagation()\` on a React \`onClick\`, does it stop a \`document.addEventListener('click')\` handler attached in a \`useEffect\`?

In React 17+, events are attached to the root container, not document. \`stopPropagation\` on synthetic events may not prevent native document listeners.`,
    problemCode: `const Component = () => {
  useEffect(() => {
    const handleDocClick = () => console.log('Document clicked');
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Button clicked');
  };

  return <button onClick={handleClick}>Click</button>;
};`,
    explanation: `React 17+ attaches events to the root container. \`stopPropagation\` on synthetic events stops React's event system, but native document listeners may still fire. To prevent document listeners, use \`e.nativeEvent.stopImmediatePropagation()\` or attach the listener to the root container.`,
    solution: `import { useEffect } from 'react';

const Component = () => {
  useEffect(() => {
    const root = document.getElementById('root');
    const handleDocClick = () => console.log('Root clicked');
    root?.addEventListener('click', handleDocClick);
    return () => root?.removeEventListener('click', handleDocClick);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stops React event system
    e.nativeEvent.stopImmediatePropagation(); // Stops native propagation
    console.log('Button clicked');
  };

  return <button onClick={handleClick}>Click</button>;
};`,
    hints: [
      "React 17+ attaches events to the root container, not document.",
      "stopPropagation on synthetic events may not stop native document listeners.",
      "Use nativeEvent.stopImmediatePropagation() or attach listener to root container.",
    ],
    testCases: [
      {
        description: "Uses nativeEvent.stopImmediatePropagation or attaches to root",
        validate: (code: string) => /nativeEvent\.stopImmediatePropagation/.test(code) || /getElementById\(['"]root['"]\)/.test(code),
      },
    ],
  },
  {
    id: "component-definition-inside-render",
    title: "Component Definition inside Render",
    difficulty: "Easy",
    description: `Why is this extremely bad for performance and UX (focus loss)?

\`Child\` is a new component type every render. React unmounts the old instance and mounts a new one, losing focus and state.`,
    problemCode: `const Parent = () => {
  const Child = () => <input />; // Defined inside
  return <Child />;
};`,
    explanation: `Defining a component inside another component creates a new component type on every render. React treats it as a completely different component, unmounting the old one and mounting a new one, causing focus loss and state reset.`,
    solution: `// Move component definition outside
const Child = () => <input />;

const Parent = () => {
  return <Child />;
};`,
    hints: [
      "Components defined inside render are new types each time.",
      "React unmounts and remounts, losing state and focus.",
      "Always define components at module scope or use useMemo for component creation.",
    ],
    testCases: [
      {
        description: "Component is defined outside Parent",
        validate: (code: string) => {
          const childDef = /const\s+Child\s*=/.exec(code);
          const parentDef = /const\s+Parent\s*=/.exec(code);
          return !!(childDef && parentDef && childDef.index! < parentDef.index!);
        },
      },
    ],
  },
  {
    id: "typing-forward-ref",
    title: "Typing forwardRef",
    difficulty: "Medium",
    description: `Correctly type a component that forwards a ref to an \`HTMLInputElement\` and accepts a \`label\` prop.`,
    problemCode: `// Fix the typing
const Input = forwardRef((props, ref) => (
  <input ref={ref} placeholder={props.label} />
));`,
    explanation: `The ref type is the first generic argument to \`forwardRef\`, and the props type is the second. Use \`HTMLInputElement\` for the ref type.`,
    solution: `import { forwardRef } from 'react';

type Props = { label: string };

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input ref={ref} placeholder={props.label} />
));`,
    hints: [
      "forwardRef takes two generic parameters: ref type and props type.",
      "The ref type comes first: forwardRef<RefType, PropsType>.",
      "Use HTMLInputElement for input refs.",
    ],
    testCases: [
      {
        description: "Uses forwardRef with correct generic types",
        validate: (code: string) => /forwardRef<HTMLInputElement/.test(code),
      },
      {
        description: "Defines Props type",
        validate: (code: string) => /type\s+Props/.test(code) || /interface\s+Props/.test(code),
      },
    ],
  },
  {
    id: "reducing-rerenders-composition",
    title: "Reducing Re-renders via Composition",
    difficulty: "Medium",
    description: `\`SlowComponent\` re-renders when \`color\` changes. Optimize it without \`React.memo\`.

Use composition - pass \`SlowComponent\` as \`children\`. The parent's state changes won't cause children to re-render if they're passed as props.`,
    problemCode: `const Parent = () => {
  const [color, setColor] = useState('red');
  return (
    <div style={{ color }}>
      <input onChange={e => setColor(e.target.value)} />
      <SlowComponent /> 
    </div>
  );
};`,
    explanation: `When state in Parent changes, all children re-render. By passing \`SlowComponent\` as \`children\` prop, React can optimize because \`children\` prop reference doesn't change even when Parent re-renders (if passed from outside).`,
    solution: `import { useState } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [color, setColor] = useState('red');
  return (
    <div style={{ color }}>
      <input onChange={e => setColor(e.target.value)} />
      {children}
    </div>
  );
};

// Usage:
// <Layout><SlowComponent /></Layout>`,
    hints: [
      "Components re-render when parent state changes.",
      "Children passed as props are often optimized better.",
      "Compose by extracting stateful logic into a wrapper component.",
    ],
    testCases: [
      {
        description: "Uses children prop pattern",
        validate: (code: string) => /children/.test(code) && /\{children\}/.test(code),
      },
      {
        description: "Extracts stateful wrapper component",
        validate: (code: string) => /const\s+\w+\s*=\s*\([^)]*children/.test(code),
      },
    ],
  },
  {
    id: "key-prop-index",
    title: "The key Prop: Index as Key",
    difficulty: "Easy",
    description: `Why is using \`index\` as a key bad for a list where items can be reordered or deleted?

React uses keys to match tree diffs. If item 0 is deleted, item 1 becomes index 0. React reuses the DOM and state of the previous item 0 for the new data, causing bugs.`,
    problemCode: `const List = ({ items }: { items: string[] }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};`,
    explanation: `When using index as key, React can't distinguish between items after reordering/deletion. It reuses DOM nodes incorrectly, causing state bugs (like input focus/value) and performance issues. Use stable, unique IDs.`,
    solution: `const List = ({ items }: { items: { id: string; text: string }[] }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};`,
    hints: [
      "Keys help React identify which items changed, were added, or removed.",
      "Index keys break when list order changes.",
      "Use stable, unique identifiers as keys (like IDs from data).",
    ],
    testCases: [
      {
        description: "Uses item property instead of index",
        validate: (code: string) => !/key=\{index\}/.test(code) && /key=\{/.test(code),
      },
    ],
  },
  {
    id: "automatic-batching",
    title: "Automatic Batching (React 18)",
    difficulty: "Easy",
    description: `In React 18, if you have two state updates inside a \`setTimeout\`, how many times does the component render?

Once. React 18 introduced Automatic Batching for promises, timeouts, and native event handlers.`,
    problemCode: `const Component = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      setA(1);
      setB(2);
      // How many renders?
    }, 0);
  };

  return <button onClick={handleClick}>Click</button>;
};`,
    explanation: `React 18 batches state updates in timeouts, promises, and native event handlers. Both updates are batched together, causing only one render. In React 17, this would cause two renders.`,
    solution: `// React 18 automatically batches these updates
// Result: 1 render (both updates batched)

// If you need to force separate renders (rare):
// flushSync(() => { setA(1); });
// flushSync(() => { setB(2); });`,
    hints: [
      "React 18 batches updates in more scenarios than React 17.",
      "Timeouts, promises, and native handlers all batch updates.",
      "Only one render happens for multiple batched updates.",
    ],
    testCases: [
      {
        description: "Code acknowledges batching or uses flushSync for separation",
        validate: (code: string) => code.length > 10, // Any reasonable answer
      },
    ],
  },
  {
    id: "use-reducer-complex-state",
    title: "useReducer for Complex State",
    difficulty: "Medium",
    description: `Why might \`useReducer\` be preferred over \`useState\` for passing callbacks deeply?

The \`dispatch\` function from \`useReducer\` is stable (identity doesn't change). You can pass it down through Context without triggering re-renders of consumers.`,
    problemCode: `// Using useState requires passing callbacks
const Parent = () => {
  const [state, setState] = useState({ count: 0 });
  const increment = () => setState(s => ({ ...s, count: s.count + 1 }));
  
  return <Context.Provider value={{ state, increment }}>...</Context.Provider>;
};`,
    explanation: `With \`useState\`, callbacks like \`increment\` typically need \`useCallback\` and dependencies. With \`useReducer\`, \`dispatch\` is always stable, so you can pass it through Context without memoization, avoiding re-renders.`,
    solution: `import { useReducer, createContext } from 'react';

const Context = createContext<any>(null);

const reducer = (state: { count: number }, action: { type: string }) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
};

const Parent = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  // dispatch is stable - no useCallback needed!
  return <Context.Provider value={{ state, dispatch }}>...</Context.Provider>;
};`,
    hints: [
      "dispatch from useReducer has a stable identity.",
      "No need for useCallback when passing dispatch.",
      "Better for complex state updates and deep prop drilling.",
    ],
    testCases: [
      {
        description: "Uses useReducer instead of useState",
        validate: (code: string) => /useReducer/.test(code),
      },
      {
        description: "Uses dispatch instead of callbacks",
        validate: (code: string) => /dispatch/.test(code),
      },
    ],
  },
  {
    id: "strict-mode-double-invoke",
    title: "StrictMode Double Invoke",
    difficulty: "Easy",
    description: `Why does \`console.log\` inside \`useEffect\` run twice in development?

React StrictMode intentionally mounts -> unmounts -> mounts components to stress-test effect cleanup logic and ensure components are resilient to re-mounting.`,
    problemCode: `const Component = () => {
  useEffect(() => {
    console.log('Effect ran'); // Logs twice in dev
  }, []);
  
  return <div>Content</div>;
};`,
    explanation: `StrictMode double-invokes effects in development to help find bugs. It ensures your cleanup functions work correctly and components can handle being mounted/unmounted. This doesn't happen in production.`,
    solution: `// This is expected behavior in development with StrictMode
// To test if it's StrictMode, wrap your app:

// Remove StrictMode:
// root.render(<App />);

// Or accept it - your effects should be idempotent anyway!`,
    hints: [
      "StrictMode is a development-only feature.",
      "It double-invokes effects to test cleanup logic.",
      "This doesn't happen in production builds.",
    ],
    testCases: [
      {
        description: "Acknowledges StrictMode behavior or makes effects idempotent",
        validate: (code: string) => code.length > 10,
      },
    ],
  },
  {
    id: "race-conditions-use-effect",
    title: "Race Conditions in useEffect",
    difficulty: "Hard",
    description: `A user clicks "User 1" then quickly "User 2". The network for User 1 is slow and arrives after User 2. The UI shows User 1's data for User 2. Fix it.

Use a cleanup function flag to ignore stale responses.`,
    problemCode: `const Profile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData(userId).then(data => setUser(data));
  }, [userId]);

  return <div>{user?.name}</div>;
};`,
    explanation: `When \`userId\` changes quickly, multiple fetches are in flight. The slow response from the first fetch can overwrite the faster response from the second. Use a cleanup function to cancel or ignore stale responses.`,
    solution: `import { useState, useEffect } from 'react';

const Profile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    
    fetchData(userId).then(data => {
      if (active) setUser(data); // Only update if still relevant
    });
    
    return () => { 
      active = false; // Cancel on unmount or dependency change
    };
  }, [userId]);

  return <div>{user?.name}</div>;
};`,
    hints: [
      "Multiple async operations can complete out of order.",
      "Use a flag in the cleanup function to ignore stale responses.",
      "Set the flag to false when the effect re-runs or component unmounts.",
    ],
    testCases: [
      {
        description: "Uses cleanup function with flag",
        validate: (code: string) => /return\s+\(\)\s*=>/.test(code) || /cleanup/.test(code),
      },
      {
        description: "Checks flag before setting state",
        validate: (code: string) => /if\s*\(.*active/.test(code) || /if\s*\(.*isActive/.test(code),
      },
    ],
  },
  {
    id: "stale-closure-counter",
    title: "The Stale Closure Counter Trap",
    difficulty: "Easy",
    description: `The counter starts at 0. The user clicks "Start", but the counter gets stuck at 1 and keeps blinking 1 indefinitely.

**The Problem:** The \`useEffect\` closure captures the initial \`count\` value (0). Even though state updates, the interval callback still references the old value.

**The Task:**
1. Fix the counter so it actually increments past 1.
2. **Constraint:** You cannot add \`count\` to the dependency array (adding it would reset the interval every second, which is bad performance).
3. **Solution Expectations:** Must use the functional update form \`setCount(prev => prev + 1)\`.`,
    problemCode: `import React, { useState, useEffect } from 'react';

export default function BrokenCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Interval ticking...");
      // 🚩 PROBLEM HERE
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array is intentional for the trap

  return <h1>Count: {count}</h1>;
}`,
    explanation: `The closure captures \`count\` from the first render (0). When \`setCount(count + 1)\` runs, it always uses the captured value (0), so it sets state to 1. The interval keeps setting it to 1 every second. Use the functional update form \`setCount(prev => prev + 1)\` to access the current state value instead of the captured closure value.`,
    solution: `import React, { useState, useEffect } from 'react';

export default function BrokenCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Interval ticking...");
      // ✅ FIX: Use functional update to access current state
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array is fine now

  return <h1>Count: {count}</h1>;
}`,
    hints: [
      "The closure captures the initial count value (0) from the first render.",
      "Using count directly in setCount always uses the captured value, not the current state.",
      "Use the functional update form: setCount(prev => prev + 1) to access the current state value.",
    ],
    testCases: [
      {
        description: "Uses functional update form setCount(prev => ...)",
        validate: (code: string) => /setCount\s*\(\s*\w+\s*=>/.test(code),
      },
      {
        description: "Does not add count to dependency array",
        validate: (code: string) => !/\[\s*count\s*\]/.test(code) || /\[\s*\]/.test(code),
      },
      {
        description: "Increments using prev parameter",
        validate: (code: string) => /setCount\s*\(\s*\w+\s*=>\s*\w+\s*\+\s*1/.test(code),
      },
    ],
  },
  {
    id: "race-condition-fetcher",
    title: "The Race Condition Fetcher",
    difficulty: "Medium",
    description: `We have a search bar. If you type "React" quickly, the API calls for "R", "Re", "Rea", etc., fire. If the "R" response arrives *after* the "React" response, the UI shows the wrong data.

**The Challenge:** Select "Alice", then immediately select "Bob". Observe that after Bob loads, Alice's data overwrites it 2 seconds later.

**The Task:**
1. Select "Alice", then immediately select "Bob".
2. Observe that after Bob loads, Alice's data overwrites it 2 seconds later.
3. **Fix it:** Use a cleanup flag or \`AbortController\` to ignore the stale response.`,
    problemCode: `import React, { useState, useEffect } from "react";

// Mock API
const fetchBio = async (person) => {
  const delay = person === "Alice" ? 2000 : 200; // Alice is slow!
  return new Promise((resolve) =>
    setTimeout(() => resolve(\`Bio for \${person}\`), delay)
  );
};

export default function RaceCondition() {
  const [person, setPerson] = useState("Bob");
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then((result) => {
      // 🚩 PROBLEM: This runs even if 'person' has changed since the request started
      setBio(result);
    });
  }, [person]);

  return (
    <div>
      <select value={person} onChange={(e) => setPerson(e.target.value)}>
        <option value="Alice">Alice (Slow)</option>
        <option value="Bob">Bob (Fast)</option>
        <option value="Charlie">Charlie</option>
      </select>
      <p>{bio ?? "Loading..."}</p>
    </div>
  );
}`,
    explanation: `When \`person\` changes quickly, multiple async requests are in flight. The slow response from "Alice" (2 seconds) can arrive after the fast response from "Bob" (200ms), overwriting the correct data. Use a cleanup function with a flag to track if the effect is still relevant, or use \`AbortController\` to cancel the request.`,
    solution: `import React, { useState, useEffect } from "react";

// Mock API
const fetchBio = async (person) => {
  const delay = person === "Alice" ? 2000 : 200; // Alice is slow!
  return new Promise((resolve) =>
    setTimeout(() => resolve(\`Bio for \${person}\`), delay)
  );
};

export default function RaceCondition() {
  const [person, setPerson] = useState("Bob");
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    let isActive = true; // ✅ Flag to track if this effect is still relevant
    
    fetchBio(person).then((result) => {
      // ✅ Only update if this effect is still active
      if (isActive) {
        setBio(result);
      }
    });
    
    // ✅ Cleanup: mark as inactive when person changes or component unmounts
    return () => {
      isActive = false;
    };
  }, [person]);

  return (
    <div>
      <select value={person} onChange={(e) => setPerson(e.target.value)}>
        <option value="Alice">Alice (Slow)</option>
        <option value="Bob">Bob (Fast)</option>
        <option value="Charlie">Charlie</option>
      </select>
      <p>{bio ?? "Loading..."}</p>
    </div>
  );
}`,
    hints: [
      "Multiple async requests can complete out of order.",
      "Use a cleanup function to track if the effect is still relevant.",
      "Set a flag to false in the cleanup, and check it before updating state.",
    ],
    testCases: [
      {
        description: "Uses cleanup function in useEffect",
        validate: (code: string) => /return\s+\(\)\s*=>/.test(code) || /return\s+\(/.test(code),
      },
      {
        description: "Uses a flag to track active state",
        validate: (code: string) => /(isActive|active|mounted|cancelled)\s*=/.test(code),
      },
      {
        description: "Checks flag before setting state",
        validate: (code: string) => /if\s*\(.*(isActive|active|mounted)/.test(code) && /setBio/.test(code),
      },
    ],
  },
  {
    id: "useless-memo",
    title: "The Useless Memo",
    difficulty: "Medium",
    description: `The \`HeavyComponent\` is wrapped in \`React.memo\`, but it re-renders every time the user types in the input, causing massive lag.

**The Challenge:** Type in the input box. Notice the lag and the console logs.

**The Task:**
1. Type in the input box. Notice the lag and the console logs.
2. **Fix it:** Use \`useCallback\` to stabilize the function reference.
3. **Follow up:** What if \`handleClick\` needed to access \`text\`? How do you update it without breaking the memoization? (Answer: Ref pattern or functional updates).`,
    problemCode: `import React, { useState, memo } from "react";

// 1. A component that is expensive to render
const HeavyComponent = memo(({ onAction }) => {
  console.log("HeavyComponent Rendered!"); // This should NOT show on typing
  const start = performance.now();
  while (performance.now() - start < 100) {} // Artificial lag
  return <button onClick={onAction}>Click Me</button>;
});

export default function UselessMemo() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);

  // 🚩 PROBLEM: This function is recreated on every render
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Type here..." 
      />
      <HeavyComponent onAction={handleClick} />
      <p>Clicks: {count}</p>
    </div>
  );
}`,
    explanation: `\`handleClick\` is recreated on every render because it's defined in the component body. Even though \`HeavyComponent\` is wrapped in \`React.memo\`, the new function reference on every render causes \`React.memo\`'s shallow comparison to fail, triggering a re-render. Use \`useCallback\` to memoize the function and maintain the same reference across renders.`,
    solution: `import React, { useState, memo, useCallback } from "react";

// 1. A component that is expensive to render
const HeavyComponent = memo(({ onAction }) => {
  console.log("HeavyComponent Rendered!"); // This should NOT show on typing
  const start = performance.now();
  while (performance.now() - start < 100) {} // Artificial lag
  return <button onClick={onAction}>Click Me</button>;
});

export default function UselessMemo() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);

  // ✅ FIX: Memoize the function to maintain stable reference
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1); // Also use functional update for best practice
  }, []); // Empty deps since we don't need any external values

  return (
    <div>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Type here..." 
      />
      <HeavyComponent onAction={handleClick} />
      <p>Clicks: {count}</p>
    </div>
  );
}`,
    hints: [
      "Functions defined in component body are recreated on every render.",
      "React.memo does shallow comparison - new function reference = re-render.",
      "Use useCallback to memoize the function and maintain stable reference.",
      "If handleClick needed text, use useRef to store text or use functional updates for count.",
    ],
    testCases: [
      {
        description: "Uses useCallback to memoize handleClick",
        validate: (code: string) => /useCallback/.test(code) && /handleClick/.test(code),
      },
      {
        description: "handleClick is wrapped in useCallback",
        validate: (code: string) => /const\s+handleClick\s*=\s*useCallback/.test(code),
      },
      {
        description: "HeavyComponent is wrapped in memo",
        validate: (code: string) => /memo\s*\(/.test(code) && /HeavyComponent/.test(code),
      },
    ],
  },
  {
    id: "effect-loop-death",
    title: "The Effect Loop of Death",
    difficulty: "Medium",
    description: `The app crashes or freezes immediately upon loading due to an infinite render loop.

**The Challenge:** The app crashes or freezes immediately upon loading.

**The Task:**
1. Identify why the loop is happening.
2. **Fix it:** Move \`config\` inside the effect, use \`useMemo\`, or move it outside the component.`,
    problemCode: `import React, { useState, useEffect } from "react";

export default function EffectLoop() {
  const [user, setUser] = useState({ name: "John", age: 30 });
  
  // 🚩 PROBLEM: This object is created fresh on every render
  const config = { theme: "dark", showAge: true };

  useEffect(() => {
    console.log("Effect triggered");
    // Some logic that updates state...
    if (user.age < 50) {
      setUser({ ...user, age: user.age + 1 });
    }
  }, [config, user]); // 'config' is the culprit

  return <div>Age: {user.age}</div>;
}`,
    explanation: `The \`config\` object is recreated on every render, creating a new reference each time. Since \`config\` is in the dependency array, React sees it as changed on every render, triggering the effect. The effect updates state, which triggers a render, which recreates \`config\`, which triggers the effect again... infinite loop! Move \`config\` inside the effect, use \`useMemo\` to memoize it, or move it outside the component if it never changes.`,
    solution: `import React, { useState, useEffect, useMemo } from "react";

export default function EffectLoop() {
  const [user, setUser] = useState({ name: "John", age: 30 });
  
  // ✅ OPTION 1: Use useMemo to memoize the object
  const config = useMemo(() => ({ theme: "dark", showAge: true }), []);

  useEffect(() => {
    console.log("Effect triggered");
    // Some logic that updates state...
    if (user.age < 50) {
      setUser(prev => ({ ...prev, age: prev.age + 1 }));
    }
  }, [config, user]); // Now config reference is stable

  return <div>Age: {user.age}</div>;
}

// ✅ OPTION 2: Move config inside the effect
// useEffect(() => {
//   const config = { theme: "dark", showAge: true };
//   // ... use config here
// }, [user]); // Only user in deps

// ✅ OPTION 3: Move config outside component (if it never changes)
// const config = { theme: "dark", showAge: true };
// export default function EffectLoop() { ... }`,
    hints: [
      "Objects are compared by reference, not by value.",
      "A new object is created on every render, so React sees it as changed.",
      "Use useMemo to memoize the object, move it inside the effect, or move it outside the component.",
    ],
    testCases: [
      {
        description: "Uses useMemo for config or moves it inside effect or outside component",
        validate: (code: string) => /useMemo/.test(code) || /const\s+config\s*=\s*\{[\s\S]*\}\s*;[\s\S]*export\s+default/.test(code) || /useEffect\s*\([\s\S]*const\s+config/.test(code),
      },
      {
        description: "Effect dependency array doesn't cause infinite loop",
        validate: (code: string) => {
          // Check that config is either memoized, inside effect, or outside component
          const hasUseMemo = /useMemo.*config/.test(code);
          const configInsideEffect = /useEffect\s*\([\s\S]*const\s+config/.test(code);
          const configOutside = /const\s+config\s*=\s*\{[\s\S]*\}\s*;[\s\S]*export\s+default/.test(code);
          return hasUseMemo || configInsideEffect || configOutside;
        },
      },
    ],
  },
  {
    id: "master-refactor",
    title: "The Master Refactor",
    difficulty: "Hard",
    description: `This is a "God Component." It mixes fetch logic, filtering logic, and UI. It also re-calculates the filter on every single re-render (even unrelated ones).

**The Challenge:** This component has multiple performance issues:
1. Expensive filtering runs even when toggling Dark Mode (unrelated state change)
2. FilterControls could be its own component to avoid re-rendering the list while typing
3. No separation of concerns - everything is in one component

**The Task:**
1. Extract the logic into a custom hook: \`useProductSearch(products)\`.
2. Optimize the filtering using \`useMemo\`.
3. Prevent the \`FilterControls\` from re-rendering when the list changes.`,
    problemCode: `import React, { useState, useEffect } from "react";

// Mock Data
const generateProducts = () => Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: \`Product \${i}\`,
  price: Math.floor(Math.random() * 1000)
}));

const allProducts = generateProducts();

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Unrelated state

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => setProducts(allProducts), 500);
  }, []);

  // 🚩 PROBLEM 1: Expensive calculation runs even when toggling Dark Mode
  console.log("Filtering products...");
  const visibleProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ background: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}>
      <button onClick={() => setDarkMode(!darkMode)}>Toggle Theme</button>
      
      {/* 🚩 PROBLEM 2: This input could be its own component to avoid re-rendering the list while typing */}
      <input 
        type="text" 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter products..." 
      />

      <ul>
        {visibleProducts.map(p => (
          <li key={p.id}>{p.name} - $\${p.price}</li>
        ))}
      </ul>
    </div>
  );
}`,
    explanation: `The component has multiple performance issues: (1) The expensive filter operation runs on every render, even when only \`darkMode\` changes. (2) The entire component re-renders when typing in the filter input. (3) No separation of concerns. Extract filtering logic into a custom hook with \`useMemo\`, separate the filter input into its own component, and use \`React.memo\` to prevent unnecessary re-renders.`,
    solution: `import React, { useState, useEffect, useMemo, memo } from "react";

// Mock Data
const generateProducts = () => Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: \`Product \${i}\`,
  price: Math.floor(Math.random() * 1000)
}));

const allProducts = generateProducts();

// ✅ Custom hook for product search logic
function useProductSearch(products, filter) {
  return useMemo(() => {
    console.log("Filtering products...");
    return products.filter(p => 
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]); // Only recalculates when products or filter change
}

// ✅ Separate component for filter input (prevents re-rendering list)
const FilterControls = memo(({ filter, onFilterChange }) => {
  return (
    <input 
      type="text" 
      value={filter} 
      onChange={(e) => onFilterChange(e.target.value)} 
      placeholder="Filter products..." 
    />
  );
});

// ✅ Separate component for product list
const ProductList = memo(({ products }) => {
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name} - $\${p.price}</li>
      ))}
    </ul>
  );
});

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => setProducts(allProducts), 500);
  }, []);

  // ✅ Use custom hook with memoized filtering
  const visibleProducts = useProductSearch(products, filter);

  return (
    <div style={{ background: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}>
      <button onClick={() => setDarkMode(!darkMode)}>Toggle Theme</button>
      
      <FilterControls filter={filter} onFilterChange={setFilter} />
      <ProductList products={visibleProducts} />
    </div>
  );
}`,
    hints: [
      "Extract filtering logic into a custom hook that uses useMemo.",
      "Separate the filter input into its own component wrapped in React.memo.",
      "Separate the product list into its own component wrapped in React.memo.",
      "The custom hook should only recalculate when products or filter changes.",
    ],
    testCases: [
      {
        description: "Uses useMemo for filtering products",
        validate: (code: string) => /useMemo/.test(code) && /filter/.test(code),
      },
      {
        description: "Extracts filtering into custom hook or function",
        validate: (code: string) => /function\s+useProductSearch/.test(code) || /const\s+useProductSearch/.test(code),
      },
      {
        description: "Separates components (FilterControls or ProductList)",
        validate: (code: string) => /(FilterControls|ProductList|FilterInput|ProductList)/.test(code),
      },
      {
        description: "Uses memo for separated components",
        validate: (code: string) => /memo\s*\(/.test(code),
      },
    ],
  },
  {
    id: "concurrent-rendering-transition",
    title: "Concurrent Rendering with useTransition",
    difficulty: "Hard",
    description: `The UI freezes when filtering a large list because the state update blocks the render. Users can't type in the input while filtering is happening.

**The Challenge:** When you type in the search box, the input becomes unresponsive because the expensive list filtering blocks the render.

**The Task:**
1. Use \`useTransition\` to mark the filtering as a non-urgent update.
2. Show a loading indicator while the transition is pending.
3. Keep the input responsive during filtering.`,
    problemCode: `import React, { useState, useMemo } from "react";

const LARGE_LIST = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
  category: i % 2 === 0 ? 'A' : 'B'
}));

export default function SearchList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  // 🚩 PROBLEM: This expensive computation blocks rendering
  const filtered = useMemo(() => {
    console.log("Filtering...");
    const start = performance.now();
    let result = LARGE_LIST.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    if (category !== "all") {
      result = result.filter(item => item.category === category);
    }
    // Simulate expensive computation
    while (performance.now() - start < 100) {}
    return result;
  }, [query, category]);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="A">Category A</option>
        <option value="B">Category B</option>
      </select>
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
    explanation: `Without \`useTransition\`, React treats all state updates as urgent, blocking the render. When filtering happens, the input becomes unresponsive. \`useTransition\` marks updates as non-urgent, allowing React to keep the UI responsive. Use \`startTransition\` to wrap the state update and \`isPending\` to show loading state.`,
    solution: `import React, { useState, useMemo, useTransition } from "react";

const LARGE_LIST = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
  category: i % 2 === 0 ? 'A' : 'B'
}));

export default function SearchList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isPending, startTransition] = useTransition();

  // ✅ Separate urgent (input) from non-urgent (filter) updates
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleQueryChange = (e) => {
    setQuery(e.target.value); // Urgent - keep input responsive
    startTransition(() => {
      setFilterQuery(e.target.value); // Non-urgent - can be deferred
    });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    startTransition(() => {
      setFilterCategory(e.target.value);
    });
  };

  // ✅ Filter uses deferred values
  const filtered = useMemo(() => {
    console.log("Filtering...");
    const start = performance.now();
    let result = LARGE_LIST.filter(item => 
      item.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
    if (filterCategory !== "all") {
      result = result.filter(item => item.category === filterCategory);
    }
    while (performance.now() - start < 100) {}
    return result;
  }, [filterQuery, filterCategory]);

  return (
    <div>
      <input 
        value={query} 
        onChange={handleQueryChange} 
        placeholder="Search..."
      />
      {isPending && <span>Filtering...</span>}
      <select value={category} onChange={handleCategoryChange}>
        <option value="all">All</option>
        <option value="A">Category A</option>
        <option value="B">Category B</option>
      </select>
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
    hints: [
      "useTransition marks updates as non-urgent, keeping the UI responsive.",
      "Separate the input value (urgent) from the filter value (non-urgent).",
      "Use startTransition to wrap non-urgent state updates.",
      "Use isPending to show loading state during transitions.",
    ],
    testCases: [
      {
        description: "Uses useTransition hook",
        validate: (code: string) => /useTransition/.test(code),
      },
      {
        description: "Uses startTransition for non-urgent updates",
        validate: (code: string) => /startTransition\s*\(/.test(code),
      },
      {
        description: "Shows pending state or separates urgent/non-urgent updates",
        validate: (code: string) => /isPending/.test(code) || /setFilterQuery/.test(code),
      },
    ],
  },
  {
    id: "error-boundary-implementation",
    title: "Error Boundary Implementation",
    difficulty: "Hard",
    description: `When a component throws an error, the entire app crashes with a white screen. Implement an Error Boundary to catch errors and display a fallback UI.

**The Challenge:** Errors in child components crash the entire application.

**The Task:**
1. Create a class component Error Boundary (hooks can't be used for error boundaries).
2. Catch errors in the component tree.
3. Display a fallback UI with error information.
4. Provide a way to reset the error state.`,
    problemCode: `import React, { useState } from "react";

// This component sometimes throws errors
const BuggyComponent = ({ shouldError }) => {
  if (shouldError) {
    throw new Error("Something went wrong!");
  }
  return <div>Everything is fine!</div>;
};

export default function App() {
  const [shouldError, setShouldError] = useState(false);

  return (
    <div>
      <button onClick={() => setShouldError(true)}>Trigger Error</button>
      {/* 🚩 PROBLEM: No error boundary - app crashes */}
      <BuggyComponent shouldError={shouldError} />
    </div>
  );
}`,
    explanation: `Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree. They must be class components because hooks don't support error boundaries yet. Implement \`componentDidCatch\` and \`getDerivedStateFromError\` to catch errors and update state to show a fallback UI.`,
    solution: `import React, { Component, useState } from "react";

// ✅ Error Boundary must be a class component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", border: "1px solid red" }}>
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const BuggyComponent = ({ shouldError }) => {
  if (shouldError) {
    throw new Error("Something went wrong!");
  }
  return <div>Everything is fine!</div>;
};

export default function App() {
  const [shouldError, setShouldError] = useState(false);

  return (
    <div>
      <button onClick={() => setShouldError(true)}>Trigger Error</button>
      {/* ✅ Wrap in Error Boundary */}
      <ErrorBoundary>
        <BuggyComponent shouldError={shouldError} />
      </ErrorBoundary>
    </div>
  );
}`,
    hints: [
      "Error Boundaries must be class components (hooks don't support them yet).",
      "Use getDerivedStateFromError to update state when an error occurs.",
      "Use componentDidCatch to log errors to error reporting services.",
      "Render fallback UI when hasError is true.",
    ],
    testCases: [
      {
        description: "Creates a class component Error Boundary",
        validate: (code: string) => /class\s+ErrorBoundary\s+extends\s+Component/.test(code),
      },
      {
        description: "Implements getDerivedStateFromError",
        validate: (code: string) => /getDerivedStateFromError/.test(code),
      },
      {
        description: "Implements componentDidCatch",
        validate: (code: string) => /componentDidCatch/.test(code),
      },
      {
        description: "Renders fallback UI when error occurs",
        validate: (code: string) => /hasError/.test(code) && /render/.test(code),
      },
    ],
  },
  {
    id: "compound-components",
    title: "Compound Component Pattern",
    difficulty: "Hard",
    description: `Create a flexible \`Tabs\` component using the Compound Component pattern. The component should allow users to compose Tab and TabPanel components freely.

**The Challenge:** Create a reusable Tabs component where Tab and TabPanel work together but can be composed flexibly.

**The Task:**
1. Create a \`Tabs\` component that manages active tab state.
2. Create \`Tab\` and \`TabPanel\` components that work together.
3. Use Context to share state between components.
4. Allow flexible composition of tabs and panels.`,
    problemCode: `// Implement Tabs, Tab, and TabPanel using Compound Component pattern
// Usage should be:
// <Tabs>
//   <Tab id="1">Tab 1</Tab>
//   <Tab id="2">Tab 2</Tab>
//   <TabPanel id="1">Content 1</TabPanel>
//   <TabPanel id="2">Content 2</TabPanel>
// </Tabs>

export const Tabs = ({ children }) => {
  // Your implementation
};

export const Tab = ({ id, children }) => {
  // Your implementation
};

export const TabPanel = ({ id, children }) => {
  // Your implementation
};`,
    explanation: `Compound Components allow you to create components that work together while maintaining flexibility. Use Context to share state (active tab) between Tabs, Tab, and TabPanel. Tabs manages the state, Tab triggers tab changes, and TabPanel conditionally renders based on active tab.`,
    solution: `import React, { createContext, useContext, useState } from "react";

// ✅ Create context to share state
const TabsContext = createContext({
  activeTab: null,
  setActiveTab: () => {},
});

export const Tabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || null);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

export const Tab = ({ id, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={activeTab === id ? "active" : ""}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({ id, children }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== id) {
    return null;
  }

  return <div className="tab-panel">{children}</div>;
};

// Usage:
// <Tabs defaultTab="1">
//   <Tab id="1">Tab 1</Tab>
//   <Tab id="2">Tab 2</Tab>
//   <TabPanel id="1">Content 1</TabPanel>
//   <TabPanel id="2">Content 2</TabPanel>
// </Tabs>`,
    hints: [
      "Use Context to share state between Tabs, Tab, and TabPanel.",
      "Tabs component manages the active tab state.",
      "Tab component uses context to get/set active tab.",
      "TabPanel conditionally renders based on active tab.",
    ],
    testCases: [
      {
        description: "Creates TabsContext using createContext",
        validate: (code: string) => /createContext/.test(code) && /TabsContext/.test(code),
      },
      {
        description: "Tabs component provides context with activeTab state",
        validate: (code: string) => /TabsContext\.Provider/.test(code) && /activeTab/.test(code),
      },
      {
        description: "Tab component uses context and sets active tab on click",
        validate: (code: string) => /useContext\s*\(TabsContext\)/.test(code) && /setActiveTab/.test(code),
      },
      {
        description: "TabPanel conditionally renders based on activeTab",
        validate: (code: string) => /activeTab\s*===?\s*id/.test(code) || /activeTab\s*!==?\s*id/.test(code),
      },
    ],
  },
  {
    id: "context-splitting-performance",
    title: "Context Splitting for Performance",
    difficulty: "Hard",
    description: `A single Context provides both user data and theme, causing unnecessary re-renders. When theme changes, components that only need user data also re-render.

**The Challenge:** Split the context to prevent unnecessary re-renders.

**The Task:**
1. Split the single context into separate UserContext and ThemeContext.
2. Ensure components only re-render when their specific context changes.
3. Use React.memo to optimize consumers.`,
    problemCode: `import React, { createContext, useContext, useState } from "react";

// 🚩 PROBLEM: Single context causes all consumers to re-render
const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "John", id: 1 });
  const [theme, setTheme] = useState("dark");

  const value = { user, setUser, theme, setTheme };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Component that only needs user data
const UserDisplay = () => {
  const { user } = useContext(AppContext);
  console.log("UserDisplay rendered"); // Logs when theme changes too!
  return <div>User: {user.name}</div>;
};

// Component that only needs theme
const ThemeToggle = () => {
  const { theme, setTheme } = useContext(AppContext);
  console.log("ThemeToggle rendered");
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Theme: {theme}
    </button>
  );
};

export default function App() {
  return (
    <AppProvider>
      <UserDisplay />
      <ThemeToggle />
    </AppProvider>
  );
}`,
    explanation: `When a single context contains multiple values, any change causes all consumers to re-render, even if they don't use the changed value. Split contexts by concern (user vs theme) so components only re-render when their specific context changes. Use \`useMemo\` to memoize context values and \`React.memo\` to optimize consumers.`,
    solution: `import React, { createContext, useContext, useState, useMemo, memo } from "react";

// ✅ Split into separate contexts
const UserContext = createContext(null);
const ThemeContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "John", id: 1 });
  
  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ✅ Memoized component that only uses user context
const UserDisplay = memo(() => {
  const { user } = useContext(UserContext);
  console.log("UserDisplay rendered");
  return <div>User: {user.name}</div>;
});

// ✅ Memoized component that only uses theme context
const ThemeToggle = memo(() => {
  const { theme, setTheme } = useContext(ThemeContext);
  console.log("ThemeToggle rendered");
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Theme: {theme}
    </button>
  );
});

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <UserDisplay />
        <ThemeToggle />
      </ThemeProvider>
    </UserProvider>
  );
}`,
    hints: [
      "Split contexts by concern - separate user and theme contexts.",
      "Use useMemo to memoize context values.",
      "Wrap consumers in React.memo to prevent unnecessary re-renders.",
      "Components will only re-render when their specific context changes.",
    ],
    testCases: [
      {
        description: "Creates separate contexts (UserContext and ThemeContext)",
        validate: (code: string) => /createContext/.test(code) && (/(UserContext|ThemeContext)/.test(code) || (/createContext/g.test(code) && (code.match(/createContext/g)?.length ?? 0) >= 2)),
      },
      {
        description: "Uses useMemo to memoize context values",
        validate: (code: string) => /useMemo/.test(code) && /value/.test(code),
      },
      {
        description: "Components use specific contexts (not a single combined context)",
        validate: (code: string) => /useContext\s*\(UserContext\)/.test(code) || /useContext\s*\(ThemeContext\)/.test(code),
      },
      {
        description: "Uses memo for consumer components",
        validate: (code: string) => /memo\s*\(/.test(code),
      },
    ],
  },
  {
    id: "custom-hook-dependencies",
    title: "Custom Hook with Complex Dependencies",
    difficulty: "Hard",
    description: `Create a \`useDebounce\` hook that debounces a value. The hook should accept a value and delay, and return the debounced value.

**The Challenge:** Implement a custom hook that properly handles cleanup and dependencies.

**The Task:**
1. Create \`useDebounce(value, delay)\` hook.
2. Return the debounced value.
3. Clean up the timeout on unmount or when dependencies change.
4. Handle edge cases (null/undefined values, changing delay).`,
    problemCode: `// Implement useDebounce hook
// Usage: const debouncedValue = useDebounce(value, 500);

function useDebounce(value, delay) {
  // Your implementation
}`,
    explanation: `A debounce hook delays updating the returned value until after a specified delay. Use \`useState\` to store the debounced value, \`useEffect\` to set up the timeout, and return a cleanup function to clear the timeout when the component unmounts or dependencies change.`,
    solution: `import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // ✅ Cleanup: cancel timeout if value or delay changes before timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}

// Usage:
// const [searchTerm, setSearchTerm] = useState("");
// const debouncedSearch = useDebounce(searchTerm, 500);
// useEffect(() => {
//   // Make API call with debouncedSearch
// }, [debouncedSearch]);`,
    hints: [
      "Use useState to store the debounced value.",
      "Use useEffect with value and delay in dependencies.",
      "Set up setTimeout to update the debounced value after delay.",
      "Return cleanup function to clearTimeout when effect re-runs or unmounts.",
    ],
    testCases: [
      {
        description: "Uses useState to store debounced value",
        validate: (code: string) => /useState/.test(code) && /debouncedValue/.test(code),
      },
      {
        description: "Uses useEffect with value and delay dependencies",
        validate: (code: string) => /useEffect/.test(code) && /\[.*value.*delay.*\]/.test(code) || /\[.*delay.*value.*\]/.test(code),
      },
      {
        description: "Uses setTimeout to delay value update",
        validate: (code: string) => /setTimeout/.test(code),
      },
      {
        description: "Returns cleanup function with clearTimeout",
        validate: (code: string) => /return\s+\(\)\s*=>/.test(code) && /clearTimeout/.test(code),
      },
    ],
  },
  {
    id: "portal-event-handling",
    title: "Portal with Event Handling",
    difficulty: "Hard",
    description: `A modal rendered via Portal doesn't close when clicking outside because the click event doesn't bubble through the portal boundary.

**The Challenge:** Handle click events that originate from a Portal to close a modal.

**The Task:**
1. Create a modal component using \`createPortal\`.
2. Detect clicks outside the modal (on the overlay).
3. Close the modal when clicking outside.
4. Prevent the modal from closing when clicking inside it.`,
    problemCode: `import React, { useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {/* 🚩 PROBLEM: Click events might not work as expected through portal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Content</h2>
        <p>Click outside to close</p>
      </Modal>
    </div>
  );
}`,
    explanation: `Portals render children into a DOM node outside the parent component hierarchy. Event bubbling works normally through portals in React, but you need to handle the overlay click correctly. The current implementation should work, but you might need to add proper event handling for edge cases. Use \`stopPropagation\` on the modal content to prevent clicks inside from closing the modal.`,
    solution: `import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // ✅ Handle escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // ✅ Handle click outside using ref
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="overlay" style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div 
        ref={modalRef}
        className="modal" 
        style={{ background: "white", padding: "20px", borderRadius: "8px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Content</h2>
        <p>Click outside or press Escape to close</p>
      </Modal>
    </div>
  );
}`,
    hints: [
      "Portals render to document.body, so event handling works normally.",
      "Use useRef to track the modal element for click-outside detection.",
      "Use useEffect to add/remove event listeners for escape key and outside clicks.",
      "Use stopPropagation on modal content to prevent closing when clicking inside.",
    ],
    testCases: [
      {
        description: "Uses createPortal to render modal",
        validate: (code: string) => /createPortal/.test(code),
      },
      {
        description: "Uses useRef to track modal element",
        validate: (code: string) => /useRef/.test(code) && /modalRef/.test(code),
      },
      {
        description: "Handles click outside or escape key",
        validate: (code: string) => /addEventListener/.test(code) && (/"mousedown"/.test(code) || /"keydown"/.test(code) || /Escape/.test(code)),
      },
      {
        description: "Cleans up event listeners in useEffect",
        validate: (code: string) => /removeEventListener/.test(code) || /return\s+\(\)\s*=>/.test(code),
      },
    ],
  },
  {
    id: "suspense-error-boundary",
    title: "Suspense with Error Boundaries",
    difficulty: "Hard",
    description: `A component using Suspense for data fetching needs proper error handling. When the fetch fails, Suspense doesn't catch errors - you need an Error Boundary.

**The Challenge:** Combine Suspense for loading states with Error Boundaries for error handling.

**The Task:**
1. Create an Error Boundary component.
2. Wrap Suspense with the Error Boundary.
3. Handle both loading and error states properly.
4. Provide a way to retry after an error.`,
    problemCode: `import React, { Suspense, useState } from "react";

// Simulated data fetching that can throw
const fetchData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() > 0.5) {
    throw new Error("Failed to fetch data");
  }
  return { message: "Data loaded!" };
};

// Component that uses the data
const DataComponent = () => {
  // This would use a library like React Query or SWR in real app
  throw fetchData(); // Suspense will catch this promise
};

export default function App() {
  return (
    <div>
      {/* 🚩 PROBLEM: No error boundary - errors crash the app */}
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent />
      </Suspense>
    </div>
  );
}`,
    explanation: `Suspense handles loading states by catching thrown promises, but it doesn't handle errors. You need an Error Boundary to catch errors. Wrap Suspense with an Error Boundary to handle both loading and error states. The Error Boundary catches errors, and Suspense handles the loading promise.`,
    solution: `import React, { Suspense, Component, useState } from "react";

// ✅ Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", border: "1px solid red" }}>
          <h2>Error loading data</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Retry</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simulated data fetching
const fetchData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() > 0.5) {
    throw new Error("Failed to fetch data");
  }
  return { message: "Data loaded!" };
};

// Component that uses the data
const DataComponent = () => {
  const [data, setData] = useState(null);
  
  if (!data) {
    throw fetchData().then(setData);
  }
  
  return <div>{data.message}</div>;
};

export default function App() {
  return (
    <div>
      {/* ✅ Wrap Suspense with Error Boundary */}
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <DataComponent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}`,
    hints: [
      "Suspense handles loading (promises), Error Boundaries handle errors.",
      "Wrap Suspense with an Error Boundary to handle both cases.",
      "Error Boundary catches errors, Suspense handles thrown promises.",
      "Provide a retry mechanism in the Error Boundary fallback.",
    ],
    testCases: [
      {
        description: "Creates Error Boundary class component",
        validate: (code: string) => /class\s+ErrorBoundary\s+extends\s+Component/.test(code),
      },
      {
        description: "Wraps Suspense with Error Boundary",
        validate: (code: string) => /<ErrorBoundary>[\s\S]*<Suspense/.test(code) || /ErrorBoundary.*Suspense/.test(code),
      },
      {
        description: "Implements getDerivedStateFromError",
        validate: (code: string) => /getDerivedStateFromError/.test(code),
      },
      {
        description: "Provides retry/reset functionality",
        validate: (code: string) => /(retry|reset|handleReset)/i.test(code),
      },
    ],
  },
  {
    id: "ref-forwarding-chain",
    title: "Ref Forwarding Chain",
    difficulty: "Hard",
    description: `You need to forward a ref through multiple levels of components to access a DOM element deep in the tree.

**The Challenge:** Forward a ref from Parent -> Child -> Grandchild -> DOM element.

**The Task:**
1. Create a chain of components: Parent, Child, Grandchild.
2. Forward ref from Parent to the input element in Grandchild.
3. Use \`forwardRef\` and \`useImperativeHandle\` if needed.
4. Access the input element from Parent component.`,
    problemCode: `// Implement ref forwarding chain
// Parent should be able to focus the input in Grandchild

const Grandchild = () => {
  return <input type="text" />;
};

const Child = () => {
  return <Grandchild />;
};

const Parent = () => {
  // Should be able to focus input via ref
  return <Child />;
};`,
    explanation: `Use \`forwardRef\` to forward refs through component boundaries. Each component in the chain must forward the ref to the next level. Use \`useImperativeHandle\` if you need to customize what's exposed via the ref. The ref eventually reaches the DOM element.`,
    solution: `import React, { forwardRef, useRef, useImperativeHandle } from "react";

// ✅ Grandchild forwards ref to input
const Grandchild = forwardRef((props, ref) => {
  return <input ref={ref} type="text" placeholder="Type here..." />;
});

// ✅ Child forwards ref to Grandchild
const Child = forwardRef((props, ref) => {
  return (
    <div>
      <p>Child Component</p>
      <Grandchild ref={ref} />
    </div>
  );
});

// ✅ Parent can now access the input via ref
const Parent = () => {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <button onClick={handleFocus}>Focus Input</button>
      <Child ref={inputRef} />
    </div>
  );
};

export default Parent;`,
    hints: [
      "Use forwardRef to forward refs through component boundaries.",
      "Each component in the chain must forward the ref using forwardRef.",
      "The ref eventually reaches the DOM element (input).",
      "Use useImperativeHandle if you need to customize the ref API.",
    ],
    testCases: [
      {
        description: "Uses forwardRef for Grandchild component",
        validate: (code: string) => /forwardRef/.test(code) && /Grandchild/.test(code),
      },
      {
        description: "Uses forwardRef for Child component",
        validate: (code: string) => /forwardRef/.test(code) && /Child/.test(code) && (code.match(/forwardRef/g)?.length ?? 0) >= 2,
      },
      {
        description: "Ref is forwarded through the chain (Child -> Grandchild -> input)",
        validate: (code: string) => /<Grandchild\s+ref=\{ref\}/.test(code) || /<Child\s+ref=\{.*\}/.test(code),
      },
      {
        description: "Input element receives the ref",
        validate: (code: string) => /<input\s+ref=\{ref\}/.test(code),
      },
    ],
  },
  {
    id: "use-deferred-value",
    title: "useDeferredValue for Search",
    difficulty: "Hard",
    description: `A search input with expensive filtering causes the input to lag. Use \`useDeferredValue\` to defer the expensive computation while keeping the input responsive.

**The Challenge:** The input becomes unresponsive during expensive filtering.

**The Task:**
1. Use \`useDeferredValue\` to defer the search query.
2. Keep the input value immediate (responsive).
3. Use the deferred value for expensive filtering.
4. Show a loading indicator when values differ.`,
    problemCode: `import React, { useState, useMemo } from "react";

const LARGE_LIST = Array.from({ length: 50000 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
  description: \`Description for item \${i}\`
}));

export default function SearchApp() {
  const [query, setQuery] = useState("");

  // 🚩 PROBLEM: Expensive filtering blocks input
  const filtered = useMemo(() => {
    console.log("Filtering...");
    const start = performance.now();
    const result = LARGE_LIST.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    while (performance.now() - start < 50) {} // Simulate expensive work
    return result;
  }, [query]);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search..."
      />
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
    explanation: `\`useDeferredValue\` lets you defer updating a value, keeping the UI responsive. The input value updates immediately, but the deferred value (used for filtering) updates after React finishes urgent work. Compare the immediate and deferred values to show a loading state when they differ.`,
    solution: `import React, { useState, useMemo, useDeferredValue } from "react";

const LARGE_LIST = Array.from({ length: 50000 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
  description: \`Description for item \${i}\`
}));

export default function SearchApp() {
  const [query, setQuery] = useState("");
  
  // ✅ Defer the query value used for filtering
  const deferredQuery = useDeferredValue(query);
  
  // ✅ Check if query is still being deferred
  const isPending = query !== deferredQuery;

  // ✅ Use deferred value for expensive filtering
  const filtered = useMemo(() => {
    console.log("Filtering with deferred query:", deferredQuery);
    const start = performance.now();
    const result = LARGE_LIST.filter(item =>
      item.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(deferredQuery.toLowerCase())
    );
    while (performance.now() - start < 50) {}
    return result;
  }, [deferredQuery]);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search..."
      />
      {isPending && <div>Updating results...</div>}
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
    hints: [
      "useDeferredValue defers a value update, keeping the UI responsive.",
      "Keep the input value immediate, defer the value used for filtering.",
      "Compare original and deferred values to detect pending state.",
      "Use the deferred value in useMemo for expensive computations.",
    ],
    testCases: [
      {
        description: "Uses useDeferredValue hook",
        validate: (code: string) => /useDeferredValue/.test(code),
      },
      {
        description: "Input value updates immediately (not deferred)",
        validate: (code: string) => /value=\{query\}/.test(code) && /onChange=\{.*setQuery/.test(code),
      },
      {
        description: "Filtering uses deferred value",
        validate: (code: string) => /deferredQuery/.test(code) && /filter/.test(code),
      },
      {
        description: "Shows pending state when values differ",
        validate: (code: string) => /isPending/.test(code) || /query\s*!==?\s*deferredQuery/.test(code),
      },
    ],
  },
  {
    id: "use-imperative-handle",
    title: "useImperativeHandle for Custom Ref API",
    difficulty: "Hard",
    description: `You need to expose a custom API through a ref instead of the default DOM element. Use \`useImperativeHandle\` to customize what methods/properties are accessible via the ref.

**The Challenge:** Create a component that exposes custom methods (focus, reset, getValue) through a ref instead of the raw DOM element.

**The Task:**
1. Use \`forwardRef\` and \`useImperativeHandle\` together.
2. Expose custom methods: \`focus()\`, \`reset()\`, and \`getValue()\`.
3. Hide the internal implementation details.`,
    problemCode: `// Implement Input component with custom ref API
// Parent should be able to call: ref.current.focus(), ref.current.reset(), ref.current.getValue()

const Input = forwardRef((props, ref) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  // Your implementation here

  return <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} />;
});

const Parent = () => {
  const inputRef = useRef(null);

  return (
    <div>
      <Input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.reset()}>Reset</button>
      <button onClick={() => console.log(inputRef.current?.getValue())}>Get Value</button>
    </div>
  );
};`,
    explanation: `\`useImperativeHandle\` customizes the instance value that is exposed when using refs. It's used with \`forwardRef\` to expose a custom API instead of the default DOM element. This is useful when you want to hide implementation details and provide a cleaner API.`,
    solution: `import React, { forwardRef, useRef, useState, useImperativeHandle } from "react";

const Input = forwardRef((props, ref) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  // ✅ Expose custom API through ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    reset: () => {
      setValue("");
      inputRef.current?.focus();
    },
    getValue: () => {
      return value;
    },
  }), [value]);

  return <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} />;
});

const Parent = () => {
  const inputRef = useRef(null);

  return (
    <div>
      <Input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.reset()}>Reset</button>
      <button onClick={() => console.log(inputRef.current?.getValue())}>Get Value</button>
    </div>
  );
};`,
    hints: [
      "useImperativeHandle is used with forwardRef to customize the ref API.",
      "The first argument is the ref, the second is a function that returns the exposed API.",
      "Include dependencies in the third argument array if the exposed API depends on state.",
      "Use an internal ref to access the actual DOM element.",
    ],
    testCases: [
      {
        description: "Uses forwardRef for the component",
        validate: (code: string) => /forwardRef/.test(code) && /Input/.test(code),
      },
      {
        description: "Uses useImperativeHandle to expose custom API",
        validate: (code: string) => /useImperativeHandle/.test(code),
      },
      {
        description: "Exposes focus, reset, and getValue methods",
        validate: (code: string) => /focus:\s*\(\)/.test(code) && /reset:\s*\(\)/.test(code) && /getValue:\s*\(\)/.test(code),
      },
      {
        description: "Uses internal ref for DOM element",
        validate: (code: string) => /inputRef/.test(code) && /useRef/.test(code),
      },
    ],
  },
  {
    id: "render-props-pattern",
    title: "Render Props Pattern",
    difficulty: "Hard",
    description: `Create a \`MouseTracker\` component using the Render Props pattern. The component should track mouse position and allow consumers to render custom UI based on the position.

**The Challenge:** Implement a reusable component that provides mouse tracking functionality through render props.

**The Task:**
1. Create a \`MouseTracker\` component that tracks mouse position.
2. Use render props pattern: \`children\` as a function.
3. Pass mouse coordinates (x, y) to the render function.
4. Handle mouse move events and cleanup.`,
    problemCode: `// Implement MouseTracker using Render Props pattern
// Usage: <MouseTracker>{(x, y) => <div>Mouse at {x}, {y}</div>}</MouseTracker>

const MouseTracker = ({ children }) => {
  // Your implementation
};

export default function App() {
  return (
    <MouseTracker>
      {(x, y) => (
        <div style={{ position: "absolute", left: x, top: y }}>
          Mouse Position: {x}, {y}
        </div>
      )}
    </MouseTracker>
  );
}`,
    explanation: `Render Props is a pattern where a component's \`children\` (or a prop) is a function that receives state/data and returns JSX. This allows for flexible composition and code reuse. The component manages the state/logic, and the consumer decides how to render it.`,
    solution: `import React, { useState, useEffect } from "react";

const MouseTracker = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ✅ Call children as a function with the position
  return children(position.x, position.y);
};

export default function App() {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <MouseTracker>
        {(x, y) => (
          <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
            Mouse Position: {x}, {y}
          </div>
        )}
      </MouseTracker>
    </div>
  );
}`,
    hints: [
      "Render Props pattern uses children (or a prop) as a function.",
      "The component manages state and passes it to the render function.",
      "Call children as a function: children(data) or children?.(data).",
      "Handle cleanup for event listeners in useEffect.",
    ],
    testCases: [
      {
        description: "Uses useState to track mouse position",
        validate: (code: string) => /useState/.test(code) && /position/.test(code),
      },
      {
        description: "Uses useEffect to add mousemove event listener",
        validate: (code: string) => /useEffect/.test(code) && /mousemove/.test(code),
      },
      {
        description: "Calls children as a function with position",
        validate: (code: string) => /children\s*\(/.test(code) || /children\?\.\s*\(/.test(code),
      },
      {
        description: "Cleans up event listener",
        validate: (code: string) => /removeEventListener/.test(code) || /return\s+\(\)\s*=>/.test(code),
      },
    ],
  },
  {
    id: "higher-order-component",
    title: "Higher-Order Component (HOC)",
    difficulty: "Hard",
    description: `Create a Higher-Order Component that adds authentication checking to any component. The HOC should redirect to login if the user is not authenticated.

**The Challenge:** Implement a reusable HOC pattern for authentication.

**The Task:**
1. Create \`withAuth\` HOC that wraps components.
2. Check authentication status.
3. Show loading state while checking.
4. Redirect to login if not authenticated, otherwise render the wrapped component.`,
    problemCode: `// Implement withAuth HOC
// Usage: const ProtectedComponent = withAuth(MyComponent);

function withAuth(WrappedComponent) {
  // Your implementation
}

const Dashboard = () => <div>Protected Content</div>;
const ProtectedDashboard = withAuth(Dashboard);

export default function App() {
  return <ProtectedDashboard />;
}`,
    explanation: `Higher-Order Components (HOCs) are functions that take a component and return a new component with additional functionality. They're useful for cross-cutting concerns like authentication, logging, or data fetching. The HOC wraps the original component and adds the extra behavior.`,
    solution: `import React, { useState, useEffect } from "react";

// Simulated auth check
const checkAuth = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return localStorage.getItem("isAuthenticated") === "true";
};

function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const verifyAuth = async () => {
        const auth = await checkAuth();
        setIsAuthenticated(auth);
        setIsLoading(false);
      };
      verifyAuth();
    }, []);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    // ✅ Render the wrapped component with its props
    return <WrappedComponent {...props} />;
  };
}

const Dashboard = () => <div>Protected Content</div>;
const ProtectedDashboard = withAuth(Dashboard);

export default function App() {
  return <ProtectedDashboard />;
}`,
    hints: [
      "HOC is a function that takes a component and returns a new component.",
      "The returned component wraps the original and adds extra functionality.",
      "Spread props to the wrapped component: <WrappedComponent {...props} />.",
      "Handle loading and authentication states before rendering.",
    ],
    testCases: [
      {
        description: "Creates HOC function that takes a component",
        validate: (code: string) => /function\s+withAuth\s*\(/.test(code) || /const\s+withAuth\s*=/.test(code),
      },
      {
        description: "Returns a new component that wraps the original",
        validate: (code: string) => /return\s+function/.test(code) || /return\s+\(/.test(code),
      },
      {
        description: "Renders WrappedComponent with spread props",
        validate: (code: string) => /<WrappedComponent\s+\.\.\.props/.test(code),
      },
      {
        description: "Handles authentication check and loading state",
        validate: (code: string) => /isAuthenticated/.test(code) || /isLoading/.test(code),
      },
    ],
  },
  {
    id: "use-id-hook",
    title: "useId for Unique Identifiers",
    difficulty: "Medium",
    description: `When rendering the same component multiple times, using hardcoded IDs causes duplicate IDs in the DOM. Use \`useId\` to generate unique IDs that work with SSR.

**The Challenge:** Generate unique IDs for form labels and inputs that work across server and client renders.

**The Task:**
1. Use \`useId\` to generate a base ID.
2. Create unique IDs for label and input using the base ID.
3. Ensure IDs are unique even when component is rendered multiple times.
4. Works correctly with Server-Side Rendering.`,
    problemCode: `// Fix the duplicate ID issue
const FormField = ({ label }) => {
  // 🚩 PROBLEM: Hardcoded ID causes duplicates
  const id = "email-input";
  
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
};

export default function App() {
  return (
    <div>
      <FormField label="Email" />
      <FormField label="Confirm Email" /> {/* Duplicate ID! */}
    </div>
  );
}`,
    explanation: `\`useId\` generates unique IDs that are stable across server and client renders. It's perfect for generating IDs for form elements, ARIA attributes, and other cases where you need unique identifiers. The ID is unique per component instance and works with SSR hydration.`,
    solution: `import React, { useId } from "react";

const FormField = ({ label }) => {
  // ✅ Generate unique ID per component instance
  const id = useId();
  
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
};

export default function App() {
  return (
    <div>
      <FormField label="Email" />
      <FormField label="Confirm Email" /> {/* Each has unique ID */}
    </div>
  );
}

// For multiple related elements, append suffixes:
// const inputId = useId();
// const labelId = \`\${inputId}-label\`;
// const errorId = \`\${inputId}-error\`;`,
    hints: [
      "useId generates unique IDs that work with SSR.",
      "Each component instance gets a unique ID automatically.",
      "For multiple related elements, append suffixes to the base ID.",
      "Don't use useId for keys in lists - use stable IDs from data.",
    ],
    testCases: [
      {
        description: "Uses useId hook",
        validate: (code: string) => /useId/.test(code),
      },
      {
        description: "Uses the generated ID for both label and input",
        validate: (code: string) => /htmlFor=\{.*id/.test(code) && /id=\{.*id/.test(code),
      },
      {
        description: "Does not use hardcoded string IDs",
        validate: (code: string) => !/id\s*=\s*["']email-input["']/.test(code),
      },
    ],
  },
  {
    id: "controlled-uncontrolled",
    title: "Controlled vs Uncontrolled Components",
    difficulty: "Medium",
    description: `The form input doesn't reset when clicking the reset button. Fix it by converting to a controlled component or using a ref for uncontrolled access.

**The Challenge:** Make the reset button work properly.

**The Task:**
1. Convert to controlled component (recommended) OR
2. Use ref to access uncontrolled component value.
3. Implement reset functionality that clears the input.`,
    problemCode: `// Fix the reset functionality
const Form = () => {
  const handleReset = () => {
    // 🚩 PROBLEM: How to reset the input?
  };

  return (
    <form>
      <input type="text" placeholder="Enter text..." />
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
};`,
    explanation: `Controlled components have their value controlled by React state. Uncontrolled components store their state in the DOM and use refs to access it. For reset functionality, controlled components are easier - just reset the state. For uncontrolled, use a ref to access the input and set its value.`,
    solution: `import React, { useState, useRef } from "react";

// ✅ Option 1: Controlled Component (Recommended)
const FormControlled = () => {
  const [value, setValue] = useState("");

  const handleReset = () => {
    setValue(""); // Simply reset state
  };

  return (
    <form>
      <input 
        type="text" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text..." 
      />
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
};

// ✅ Option 2: Uncontrolled Component with Ref
const FormUncontrolled = () => {
  const inputRef = useRef(null);

  const handleReset = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset via ref
      inputRef.current.focus();
    }
  };

  return (
    <form>
      <input 
        ref={inputRef}
        type="text" 
        placeholder="Enter text..." 
      />
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
};`,
    hints: [
      "Controlled components: value is controlled by React state, onChange updates state.",
      "Uncontrolled components: value stored in DOM, use ref to access/set value.",
      "For reset, controlled is easier - just reset state.",
      "For uncontrolled, use ref.current.value = '' to reset.",
    ],
    testCases: [
      {
        description: "Uses controlled component pattern (value + onChange) OR uses ref for uncontrolled",
        validate: (code: string) => (/value=\{/.test(code) && /onChange/.test(code)) || /useRef/.test(code),
      },
      {
        description: "Reset function clears the input value",
        validate: (code: string) => /setValue\s*\(\s*["']\s*["']\s*\)/.test(code) || /\.value\s*=\s*["']\s*["']/.test(code),
      },
    ],
  },
  {
    id: "react-lazy-suspense",
    title: "Code Splitting with React.lazy",
    difficulty: "Medium",
    description: `The app bundle is too large. Split the heavy \`Chart\` component into a separate chunk that loads only when needed.

**The Challenge:** Implement code splitting using \`React.lazy\` and \`Suspense\`.

**The Task:**
1. Use \`React.lazy\` to dynamically import the Chart component.
2. Wrap it in \`Suspense\` with a loading fallback.
3. Load the component only when the tab is active.
4. Handle loading and error states.`,
    problemCode: `import React, { useState } from "react";
import Chart from "./Chart"; // 🚩 PROBLEM: Heavy component loaded upfront

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <button onClick={() => setActiveTab("overview")}>Overview</button>
      <button onClick={() => setActiveTab("analytics")}>Analytics</button>
      
      {activeTab === "overview" && <div>Overview Content</div>}
      {activeTab === "analytics" && <Chart />} {/* Only needed when analytics tab is active */}
    </div>
  );
};`,
    explanation: `\`React.lazy\` enables code splitting by dynamically importing components. It returns a component that loads the module on demand. Wrap it in \`Suspense\` to show a fallback while loading. This reduces the initial bundle size and improves load time.`,
    solution: `import React, { useState, lazy, Suspense } from "react";

// ✅ Lazy load the Chart component
const Chart = lazy(() => import("./Chart"));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <button onClick={() => setActiveTab("overview")}>Overview</button>
      <button onClick={() => setActiveTab("analytics")}>Analytics</button>
      
      {activeTab === "overview" && <div>Overview Content</div>}
      {activeTab === "analytics" && (
        // ✅ Wrap lazy component in Suspense
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart />
        </Suspense>
      )}
    </div>
  );
};

// For error handling, wrap in Error Boundary:
// <ErrorBoundary>
//   <Suspense fallback={<div>Loading...</div>}>
//     <Chart />
//   </Suspense>
// </ErrorBoundary>`,
    hints: [
      "React.lazy takes a function that returns a dynamic import: () => import('./Component').",
      "Wrap lazy components in Suspense with a fallback UI.",
      "The component only loads when it's rendered for the first time.",
      "Use Error Boundaries to handle loading errors.",
    ],
    testCases: [
      {
        description: "Uses React.lazy to import component",
        validate: (code: string) => /lazy\s*\(/.test(code) && /import\s*\(/.test(code),
      },
      {
        description: "Wraps lazy component in Suspense",
        validate: (code: string) => /Suspense/.test(code) && /fallback/.test(code),
      },
      {
        description: "Provides fallback UI for loading state",
        validate: (code: string) => /fallback=\{/.test(code),
      },
    ],
  },
  {
    id: "use-memo-vs-callback",
    title: "useMemo vs useCallback - When to Use Which",
    difficulty: "Medium",
    description: `The component re-renders unnecessarily. Determine whether to use \`useMemo\` or \`useCallback\` and fix the performance issue.

**The Challenge:** Optimize the component by memoizing the right values.

**The Task:**
1. Identify what needs memoization (value vs function).
2. Use \`useMemo\` for expensive computations or object/array values.
3. Use \`useCallback\` for function references passed as props.
4. Prevent unnecessary re-renders.`,
    problemCode: `import React, { useState, memo } from "react";

const ExpensiveComponent = memo(({ data, onAction }) => {
  console.log("ExpensiveComponent rendered");
  // Expensive computation
  const processed = data.map(item => item * 2).filter(x => x > 10);
  return <div>{processed.length} items</div>;
});

const Parent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 2, 3, 4, 5]);

  // 🚩 PROBLEM: These are recreated every render
  const data = items.map(x => x * count);
  const handleAction = () => console.log("Action");

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveComponent data={data} onAction={handleAction} />
    </div>
  );
};`,
    explanation: `\`useMemo\` memoizes computed values (objects, arrays, primitives). \`useCallback\` memoizes function references. Use \`useMemo\` when you want to avoid recalculating expensive computations or when passing objects/arrays as props. Use \`useCallback\` when passing functions as props to memoized components.`,
    solution: `import React, { useState, memo, useMemo, useCallback } from "react";

const ExpensiveComponent = memo(({ data, onAction }) => {
  console.log("ExpensiveComponent rendered");
  // Expensive computation
  const processed = data.map(item => item * 2).filter(x => x > 10);
  return <div>{processed.length} items</div>;
});

const Parent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 2, 3, 4, 5]);

  // ✅ useMemo for computed value (array)
  const data = useMemo(() => {
    return items.map(x => x * count);
  }, [items, count]);

  // ✅ useCallback for function reference
  const handleAction = useCallback(() => {
    console.log("Action");
  }, []); // Empty deps since it doesn't depend on any values

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveComponent data={data} onAction={handleAction} />
    </div>
  );
};`,
    hints: [
      "useMemo: memoize computed values (objects, arrays, primitives).",
      "useCallback: memoize function references.",
      "Use useMemo when passing objects/arrays to memoized components.",
      "Use useCallback when passing functions to memoized components.",
    ],
    testCases: [
      {
        description: "Uses useMemo for the data array",
        validate: (code: string) => /useMemo/.test(code) && /data/.test(code),
      },
      {
        description: "Uses useCallback for the handleAction function",
        validate: (code: string) => /useCallback/.test(code) && /handleAction/.test(code),
      },
      {
        description: "Includes proper dependencies in useMemo",
        validate: (code: string) => /\[.*items.*count.*\]/.test(code) || /\[.*count.*items.*\]/.test(code),
      },
    ],
  },
  {
    id: "custom-hook-composition",
    title: "Composing Custom Hooks",
    difficulty: "Hard",
    description: `Create a complex \`useForm\` hook by composing simpler hooks: \`useInput\`, \`useValidation\`, and \`useSubmit\`.

**The Challenge:** Build a reusable form hook by composing smaller hooks.

**The Task:**
1. Create \`useInput\` hook for individual field management.
2. Create \`useValidation\` hook for field validation.
3. Create \`useSubmit\` hook for form submission.
4. Compose them into \`useForm\` hook.`,
    problemCode: `// Implement useForm by composing useInput, useValidation, and useSubmit
// Usage:
// const { values, errors, handleChange, handleSubmit } = useForm({
//   initialValues: { email: '', password: '' },
//   validate: (values) => { /* validation logic */ },
//   onSubmit: (values) => { /* submit logic */ }
// });

function useInput(initialValue) {
  // Your implementation
}

function useValidation(values, validate) {
  // Your implementation
}

function useSubmit(onSubmit) {
  // Your implementation
}

function useForm({ initialValues, validate, onSubmit }) {
  // Compose the hooks
}`,
    explanation: `Custom hooks can be composed together to build more complex functionality. Each hook handles a specific concern (input management, validation, submission), and they're composed together in a higher-level hook. This follows the single responsibility principle and makes hooks reusable.`,
    solution: `import { useState, useCallback } from "react";

// ✅ Hook for managing individual input
function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return { value, setValue, handleChange };
}

// ✅ Hook for validation
function useValidation(values, validate) {
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors || {});
      return Object.keys(newErrors || {}).length === 0;
    }
    return true;
  }, [values, validate]);

  return { errors, validateForm };
}

// ✅ Hook for form submission
function useSubmit(onSubmit) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e, values, isValid) => {
    e?.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  return { isSubmitting, handleSubmit };
}

// ✅ Compose hooks into useForm
function useForm({ initialValues = {}, validate, onSubmit }) {
  // Manage all form values
  const [values, setValues] = useState(initialValues);
  
  // Use validation hook
  const { errors, validateForm } = useValidation(values, validate);
  
  // Use submit hook
  const { isSubmitting, handleSubmit: submitHandler } = useSubmit(onSubmit);

  const handleChange = useCallback((name) => (e) => {
    setValues(prev => ({ ...prev, [name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    const isValid = validateForm();
    submitHandler(e, values, isValid);
  }, [values, validateForm, submitHandler]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  };
}

// Usage:
// const { values, errors, handleChange, handleSubmit } = useForm({
//   initialValues: { email: '', password: '' },
//   validate: (vals) => {
//     const errs = {};
//     if (!vals.email) errs.email = 'Required';
//     return errs;
//   },
//   onSubmit: async (vals) => { console.log(vals); }
// });`,
    hints: [
      "Break down complex functionality into smaller, focused hooks.",
      "Each hook should handle one concern (input, validation, submission).",
      "Compose hooks in a higher-level hook that combines their functionality.",
      "Use useCallback to memoize handlers and prevent unnecessary re-renders.",
    ],
    testCases: [
      {
        description: "Creates useInput hook for field management",
        validate: (code: string) => /function\s+useInput/.test(code) || /const\s+useInput/.test(code),
      },
      {
        description: "Creates useValidation hook",
        validate: (code: string) => /function\s+useValidation/.test(code) || /const\s+useValidation/.test(code),
      },
      {
        description: "Creates useSubmit hook",
        validate: (code: string) => /function\s+useSubmit/.test(code) || /const\s+useSubmit/.test(code),
      },
      {
        description: "Composes hooks in useForm",
        validate: (code: string) => /function\s+useForm/.test(code) && (/useValidation/.test(code) || /useSubmit/.test(code)),
      },
    ],
  },
  {
    id: "use-sync-external-store",
    title: "useSyncExternalStore for External State",
    difficulty: "Hard",
    description: `Create a hook that subscribes to an external store (like a global state manager) using \`useSyncExternalStore\`.

**The Challenge:** Subscribe to external state and handle updates correctly.

**The Task:**
1. Create a custom hook \`useStore\` that uses \`useSyncExternalStore\`.
2. Subscribe to store changes.
3. Return the current store value.
4. Handle server-side rendering (getServerSnapshot).`,
    problemCode: `// Implement useStore hook using useSyncExternalStore
// The store has: store.getState(), store.subscribe(callback), store.dispatch(action)

let store = {
  state: { count: 0 },
  listeners: new Set(),
  getState: () => store.state,
  subscribe: (listener) => {
    store.listeners.add(listener);
    return () => store.listeners.delete(listener);
  },
  dispatch: (action) => {
    store.state = { count: store.state.count + 1 };
    store.listeners.forEach(l => l());
  }
};

function useStore() {
  // Your implementation using useSyncExternalStore
}`,
    explanation: `\`useSyncExternalStore\` is a React 18 hook for subscribing to external stores. It ensures components stay in sync with external state and handles SSR correctly. It requires a subscribe function, a getSnapshot function, and optionally getServerSnapshot for SSR.`,
    solution: `import { useSyncExternalStore } from "react";

let store = {
  state: { count: 0 },
  listeners: new Set(),
  getState: () => store.state,
  subscribe: (listener) => {
    store.listeners.add(listener);
    return () => store.listeners.delete(listener);
  },
  dispatch: (action) => {
    store.state = { count: store.state.count + 1 };
    store.listeners.forEach(l => l());
  }
};

function useStore() {
  // ✅ Use useSyncExternalStore to subscribe to external store
  const state = useSyncExternalStore(
    // subscribe: function that subscribes to store changes
    store.subscribe,
    // getSnapshot: function that returns current store value
    store.getState,
    // getServerSnapshot: for SSR (optional, but recommended)
    store.getState
  );

  return state;
}

// Usage:
// const Component = () => {
//   const state = useStore();
//   return <div>Count: {state.count}</div>;
// };`,
    hints: [
      "useSyncExternalStore takes three arguments: subscribe, getSnapshot, getServerSnapshot.",
      "subscribe: function that subscribes to store and returns unsubscribe function.",
      "getSnapshot: function that returns current store value.",
      "getServerSnapshot: same as getSnapshot, used for SSR hydration.",
    ],
    testCases: [
      {
        description: "Uses useSyncExternalStore hook",
        validate: (code: string) => /useSyncExternalStore/.test(code),
      },
      {
        description: "Provides subscribe function",
        validate: (code: string) => /subscribe/.test(code) && /useSyncExternalStore/.test(code),
      },
      {
        description: "Provides getSnapshot function",
        validate: (code: string) => /getSnapshot/.test(code) || /getState/.test(code),
      },
      {
        description: "Returns store state",
        validate: (code: string) => /return\s+state/.test(code) || /return\s+snapshot/.test(code),
      },
    ],
  },
  {
    id: "hydration-mismatch",
    title: "Hydration Mismatch Fix",
    difficulty: "Hard",
    description: `The app shows a hydration mismatch error because server-rendered HTML doesn't match client render. Fix it by ensuring server and client render the same content.

**The Challenge:** Fix hydration mismatches caused by client-only code (localStorage, Date, Math.random).

**The Task:**
1. Identify what causes the mismatch (client-only APIs).
2. Use \`useState\` with \`useEffect\` to defer client-only rendering.
3. Show a placeholder during SSR that matches client initial state.
4. Ensure server and client HTML match.`,
    problemCode: `import React from "react";

const Component = () => {
  // 🚩 PROBLEM: localStorage is not available during SSR
  const theme = localStorage.getItem("theme") || "light";
  
  // 🚩 PROBLEM: Date.now() will be different on server vs client
  const timestamp = Date.now();
  
  return (
    <div>
      <p>Theme: {theme}</p>
      <p>Timestamp: {timestamp}</p>
    </div>
  );
};`,
    explanation: `Hydration mismatches occur when server-rendered HTML doesn't match what React renders on the client. This happens with client-only APIs (localStorage, window, Date, Math.random). Fix by using \`useState\` + \`useEffect\` to defer client-only code until after hydration, or use \`useLayoutEffect\` for synchronous updates.`,
    solution: `import React, { useState, useEffect } from "react";

const Component = () => {
  // ✅ Use useState with default that matches SSR
  const [theme, setTheme] = useState("light"); // Default matches SSR
  const [timestamp, setTimestamp] = useState(null); // null during SSR
  
  // ✅ Use useEffect to read client-only values after hydration
  useEffect(() => {
    // This only runs on client after hydration
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    setTimestamp(Date.now());
  }, []);

  return (
    <div>
      <p>Theme: {theme}</p>
      {timestamp ? <p>Timestamp: {timestamp}</p> : <p>Loading...</p>}
    </div>
  );
};

// Alternative: Use a mounted flag
// const [mounted, setMounted] = useState(false);
// useEffect(() => setMounted(true), []);
// if (!mounted) return <div>Loading...</div>;`,
    hints: [
      "Hydration mismatches occur when server and client HTML differ.",
      "Use useState with a default that matches SSR output.",
      "Use useEffect to read client-only values (localStorage, window) after hydration.",
      "Show a placeholder during SSR that matches initial client state.",
    ],
    testCases: [
      {
        description: "Uses useState instead of direct client API access",
        validate: (code: string) => /useState/.test(code) && !/localStorage\.getItem/.test(code.split('useState')[0] || ''),
      },
      {
        description: "Uses useEffect to read client-only values",
        validate: (code: string) => /useEffect/.test(code) && (/localStorage/.test(code) || /Date\.now/.test(code)),
      },
      {
        description: "Provides default values that match SSR",
        validate: (code: string) => /useState\s*\(["']light["']\)/.test(code) || /useState\s*\(null\)/.test(code),
      },
    ],
  },
];

/** Get a React challenge by id. */
export function getReactChallengeById(id: string): ReactChallenge | undefined {
  return REACT_CHALLENGES.find((c) => c.id === id);
}

/** Get all React challenge ids for static paths. */
export function getAllReactChallengeIds(): string[] {
  return REACT_CHALLENGES.map((c) => c.id);
}
