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
          return childDef && parentDef && childDef.index! < parentDef.index!;
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
];

/** Get a React challenge by id. */
export function getReactChallengeById(id: string): ReactChallenge | undefined {
  return REACT_CHALLENGES.find((c) => c.id === id);
}

/** Get all React challenge ids for static paths. */
export function getAllReactChallengeIds(): string[] {
  return REACT_CHALLENGES.map((c) => c.id);
}
