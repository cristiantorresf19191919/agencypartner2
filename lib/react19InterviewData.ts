/**
 * React 19 Interview Lessons
 * Comprehensive guide to React 19 features with interactive code examples
 */

export interface React19Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  concept: string;
  description: string;
  oldWayCode: string;
  newWayCode: string;
  previewDescription: string;
  starterCode: string;
  explanation: string;
}

export const REACT19_LESSONS: React19Lesson[] = [
  {
    id: "lesson-1-use-api",
    lessonNumber: 1,
    title: "The Death of useEffect for Fetching",
    concept: "The new use API",
    description: `The Shift: We no longer need useEffect + useState + loading flags for simple data fetching. We can "unwrap" promises directly in render.`,
    oldWayCode: `// ❌ LegacyFetch.jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <h1>{user.name}</h1>;
}`,
    newWayCode: `// ✅ ModernFetch.jsx
import { use, Suspense } from 'react';

// 1. Create the promise outside or pass it in.
const userPromise = fetchUser(1);

function UserProfile({ userPromise }) {
  // 2. "use" unwraps the promise. It halts rendering until resolved.
  const user = use(userPromise); 
  return <h1>{user.name}</h1>;
}

export default function App() {
  return (
    // 3. Suspense handles the "loading" state automatically
    <Suspense fallback={<div>Loading Profile...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}`,
    previewDescription: `The screen shows "Loading Profile..."....network request finishes...Instantly snaps to "Cristian" without a single useEffect.`,
    starterCode: `import { use, Suspense } from 'react';

// Simulate a fetch function
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'Cristian' });
    }, 1000);
  });
}

const userPromise = fetchUser(1);

function UserProfile({ userPromise }) {
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading Profile...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}`,
    explanation: `React 19's \`use\` hook allows you to unwrap promises directly in render. Combined with Suspense, this eliminates the need for manual loading state management. The component automatically suspends until the promise resolves.`,
  },
  {
    id: "lesson-2-use-action-state",
    lessonNumber: 2,
    title: "Forms Without Tears (useActionState)",
    concept: "Server Actions & State",
    description: `The Shift: Forget onSubmit, e.preventDefault(), and creating generic isSubmitting states. React 19 handles the form lifecycle for you.`,
    oldWayCode: `// ❌ LegacyForm.jsx
const [error, setError] = useState(null);
const [isPending, setIsPending] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsPending(true);
  try {
    await updateName(e.target.name.value);
  } catch (err) {
    setError(err.message);
  }
  setIsPending(false);
};`,
    newWayCode: `// ✅ ModernForm.jsx
import { useActionState } from 'react';

// The "Action" function (could be on the server!)
async function updateName(prevState, formData) {
  const name = formData.get("name");
  await new Promise(r => setTimeout(r, 1000)); // Fake delay
  if (!name) return { error: "Name is required" };
  return { success: "Updated to " + name };
}

export default function ProfileForm() {
  // 1. Hook manages: [current state, submit function, isPending boolean]
  const [state, submitAction, isPending] = useActionState(updateName, null);

  return (
    <form action={submitAction}>
      <input name="name" placeholder="New Name" />
      
      {/* 2. Automatically disabled during submit! */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update"}
      </button>

      {/* 3. Show error/success from the action return value */}
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.success && <p className="text-green-500">{state.success}</p>}
    </form>
  );
}`,
    previewDescription: `User types "React 19" and hits enter. Button instantly changes to "Updating..." and disables. After 1s, it reverts, and the text "Updated to React 19" appears below.`,
    starterCode: `import { useActionState } from 'react';

async function updateName(prevState, formData) {
  const name = formData.get("name");
  await new Promise(r => setTimeout(r, 1000));
  if (!name) return { error: "Name is required" };
  return { success: "Updated to " + name };
}

export default function ProfileForm() {
  const [state, submitAction, isPending] = useActionState(updateName, null);

  return (
    <form action={submitAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
      <input name="name" placeholder="New Name" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
      <button 
        type="submit" 
        disabled={isPending}
        style={{ 
          padding: '8px 16px', 
          background: isPending ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: isPending ? 'not-allowed' : 'pointer'
        }}
      >
        {isPending ? "Updating..." : "Update"}
      </button>
      {state?.error && <p style={{ color: '#ef4444', margin: 0 }}>{state.error}</p>}
      {state?.success && <p style={{ color: '#10b981', margin: 0 }}>{state.success}</p>}
    </form>
  );
}`,
    explanation: `\`useActionState\` manages form submission state automatically. It provides the current state, a submit action function, and a pending boolean. The form automatically disables during submission, and you can return state from the action function to show errors or success messages.`,
  },
  {
    id: "lesson-3-use-form-status",
    lessonNumber: 3,
    title: "Component Communication (useFormStatus)",
    concept: "Deep State Access",
    description: `The Shift: You have a SubmitButton nested deep in a form. In React 18, you had to pass loading props down 5 levels. In React 19, the child can "ask" the parent form if it's busy.`,
    oldWayCode: `// ❌ Old way - prop drilling
function Form() {
  const [isPending, setIsPending] = useState(false);
  return (
    <form onSubmit={handleSubmit}>
      <Input />
      <SubmitButton isPending={isPending} /> {/* Prop drilling! */}
    </form>
  );
}`,
    newWayCode: `// ✅ SubmitButton.jsx
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  // Hooks into the PARENT form's state automatically
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className={pending ? "opacity-50" : "opacity-100"}>
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

// ✅ App.jsx
export default function App() {
  return (
    <form action={someServerAction}>
      <input name="data" />
      {/* No props needed! It "knows" the form status. */}
      <SubmitButton /> 
    </form>
  );
}`,
    previewDescription: `The SubmitButton automatically knows when the form is submitting, without any props being passed down.`,
    starterCode: `import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      disabled={pending} 
      style={{ 
        padding: '8px 16px',
        background: pending ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.5 : 1
      }}
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

async function someServerAction(formData) {
  await new Promise(r => setTimeout(r, 2000));
  return { success: true };
}

export default function App() {
  return (
    <form action={someServerAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
      <input name="data" placeholder="Enter data" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
      <SubmitButton />
    </form>
  );
}`,
    explanation: `\`useFormStatus\` allows child components to access the pending state of their parent form without prop drilling. The hook automatically connects to the nearest form ancestor and provides the pending status.`,
  },
  {
    id: "lesson-4-use-optimistic",
    lessonNumber: 4,
    title: "The Optimistic UI (useOptimistic)",
    concept: "Instant Gratification",
    description: `The Shift: Users hate waiting. Even if the server takes 2 seconds, show the change instantly.`,
    oldWayCode: `// ❌ Old way - wait for server
function Chat({ sendMessage }) {
  const [messages, setMessages] = useState([]);

  async function formAction(formData) {
    const text = formData.get("message");
    await sendMessage(text); // Wait 2 seconds...
    setMessages([...messages, { text }]); // Then update
  }
}`,
    newWayCode: `// ✅ ChatApp.jsx
import { useOptimistic, useState, useRef } from 'react';

export default function Chat({ sendMessage }) {
  const [messages, setMessages] = useState([]);
  
  // 1. Setup Optimistic State
  // [currentMessages, addOptimisticMessage]
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  );

  async function formAction(formData) {
    const text = formData.get("message");
    
    // 2. Update UI INSTANTLY (before server responds)
    addOptimisticMessage(text);
    
    // 3. Perform actual request
    await sendMessage(text); 
  }

  return (
    <div>
      {optimisticMessages.map((msg, i) => (
        <div key={i} style={{ opacity: msg.sending ? 0.5 : 1 }}>
          {msg.text} {msg.sending && "(Sending...)"}
        </div>
      ))}
      
      <form action={formAction}>
        <input name="message" />
        <button>Send</button>
      </form>
    </div>
  );
}`,
    previewDescription: `User types "Hello" and hits Send. Instantly: "Hello (Sending...)" appears in the list (greyed out). 2 Seconds Later: The "(Sending...)" tag vanishes as the real server data arrives.`,
    starterCode: `import { useOptimistic, useState } from 'react';

function sendMessage(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ text, id: Date.now() });
    }, 2000);
  });
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  );

  async function formAction(formData) {
    const text = formData.get("message");
    addOptimisticMessage(text);
    
    const result = await sendMessage(text);
    setMessages([...messages, { text: result.text, sending: false }]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '12px', minHeight: '200px' }}>
        {optimisticMessages.map((msg, i) => (
          <div key={i} style={{ opacity: msg.sending ? 0.5 : 1, marginBottom: '8px' }}>
            {msg.text} {msg.sending && <span style={{ color: '#666' }}>(Sending...)</span>}
          </div>
        ))}
      </div>
      
      <form action={formAction} style={{ display: 'flex', gap: '8px' }}>
        <input 
          name="message" 
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit"
          style={{ 
            padding: '8px 16px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}`,
    explanation: `\`useOptimistic\` allows you to show optimistic updates immediately while the actual server request is in progress. If the server fails, React automatically rolls back the optimistic update. This provides instant feedback to users.`,
  },
  {
    id: "lesson-5-react-compiler",
    lessonNumber: 5,
    title: "The React Compiler (No More useMemo)",
    concept: "Automatic Optimization",
    description: `The Shift: React 19 introduces the React Compiler (optional build tool). It automatically memoizes your components and values.`,
    oldWayCode: `// ❌ LegacyOptimization.jsx
const filteredList = useMemo(() => {
  return items.filter(i => i.active);
}, [items]);

const handleChange = useCallback(() => {
  console.log("Changed");
}, []);`,
    newWayCode: `// ✅ React 19 (With Compiler)
const filteredList = items.filter(i => i.active); // Automatically memoized!

const handleChange = () => { // Automatically stable reference!
  console.log("Changed");
};`,
    previewDescription: `The compiler automatically optimizes your code at build time, so you can write natural JavaScript without manual memoization.`,
    starterCode: `// React 19 with Compiler - No manual optimization needed!

function ItemList({ items }) {
  // No useMemo needed - compiler handles it
  const filteredList = items.filter(i => i.active);
  
  // No useCallback needed - compiler handles it
  const handleClick = (id) => {
    console.log("Clicked item:", id);
  };

  return (
    <div>
      <h2>Active Items ({filteredList.length})</h2>
      <ul>
        {filteredList.map(item => (
          <li key={item.id} onClick={() => handleClick(item.id)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const items = [
    { id: 1, name: 'Item 1', active: true },
    { id: 2, name: 'Item 2', active: false },
    { id: 3, name: 'Item 3', active: true },
  ];

  return <ItemList items={items} />;
}`,
    explanation: `The React Compiler automatically optimizes your code at build time. It memoizes values and stabilizes function references, eliminating the need for manual \`useMemo\` and \`useCallback\` in most cases. You can write natural JavaScript and let the compiler handle performance.`,
  },
  {
    id: "lesson-6-forward-ref",
    lessonNumber: 6,
    title: "The Death of forwardRef",
    concept: "ref as a Prop",
    description: `The Shift: For years, passing a ref to a child component was a nightmare. You had to wrap the child in forwardRef and separate the arguments. React 19 treats ref just like any other prop.`,
    oldWayCode: `// ❌ LegacyInput.jsx
import { forwardRef } from 'react';

const CustomInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} className="border p-2" />;
});
// Usage: <CustomInput ref={inputRef} />`,
    newWayCode: `// ✅ ModernInput.jsx
export default function CustomInput({ ref, ...props }) {
  return <input {...props} ref={ref} className="border p-2" />;
}
// Usage: <CustomInput ref={inputRef} /> works automatically!`,
    previewDescription: `Refs can now be passed as regular props, eliminating the need for forwardRef wrapper.`,
    starterCode: `// React 19 - ref as a prop (no forwardRef needed!)

function CustomInput({ ref, placeholder, ...props }) {
  return (
    <input 
      {...props} 
      ref={ref} 
      placeholder={placeholder}
      style={{ 
        padding: '8px', 
        borderRadius: '4px', 
        border: '1px solid #ccc',
        width: '100%',
        maxWidth: '300px'
      }} 
    />
  );
}

export default function App() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
      <CustomInput ref={inputRef} placeholder="Type here..." />
      <button 
        onClick={handleFocus}
        style={{ 
          padding: '8px 16px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Focus Input
      </button>
    </div>
  );
}`,
    explanation: `In React 19, \`ref\` is treated as a regular prop. You can destructure it from props just like any other prop, eliminating the need for \`forwardRef\`. This simplifies component APIs and makes refs easier to work with.`,
  },
  {
    id: "lesson-7-native-metadata",
    lessonNumber: 7,
    title: "Native Metadata (RIP react-helmet)",
    concept: "Document Metadata Hoisting",
    description: `The Shift: Changing the <title> or adding <meta> tags used to require 3rd party libraries or messy useEffect hacks. React 19 now natively "hoists" these tags to the <head> of your document, no matter where they are rendered.`,
    oldWayCode: `// ❌ LegacySEO.jsx
useEffect(() => {
  document.title = "User Profile";
  const meta = document.createElement('meta');
  meta.name = "description";
  meta.content = "Profile details";
  document.head.appendChild(meta);
  return () => document.head.removeChild(meta); // Cleanup nightmare
}, []);`,
    newWayCode: `// ✅ ModernSEO.jsx
export default function UserProfile({ name }) {
  return (
    <article>
      {/* These are automatically moved to the <head>! */}
      <title>{name}'s Profile</title>
      <meta name="description" content={\`Check out \${name}'s profile.\`} />
      
      <h1>Welcome, {name}</h1>
    </article>
  );
}`,
    previewDescription: `Title and meta tags are automatically hoisted to the document head, visible in the browser tab and for SEO.`,
    starterCode: `// React 19 - Native metadata hoisting

export default function UserProfile({ name = "Cristian" }) {
  return (
    <article style={{ padding: '20px' }}>
      {/* These are automatically moved to the <head>! */}
      <title>{name}'s Profile</title>
      <meta name="description" content={\`Check out \${name}'s profile.\`} />
      
      <h1>Welcome, {name}</h1>
      <p>Check your browser tab title - it should show "{name}'s Profile"</p>
      <p>And check the page source - the meta description is in the head!</p>
    </article>
  );
}`,
    explanation: `React 19 automatically hoists \`<title>\` and \`<meta>\` tags to the document head, regardless of where they're rendered in your component tree. This eliminates the need for libraries like react-helmet or manual DOM manipulation.`,
  },
  {
    id: "lesson-8-context-provider",
    lessonNumber: 8,
    title: "Clean Context Providers",
    concept: "<Context> as a Provider",
    description: `The Shift: We no longer need to type .Provider. It's a small change, but it removes visual noise.`,
    oldWayCode: `// ❌ LegacyContext.jsx
const ThemeContext = createContext();

export function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}`,
    newWayCode: `// ✅ ModernContext.jsx
const ThemeContext = createContext();

export function App() {
  return (
    // React 19 allows the Context itself to act as the provider
    <ThemeContext value="dark">
      <Child />
    </ThemeContext>
  );
}`,
    previewDescription: `Context can be used directly as a provider without the .Provider suffix.`,
    starterCode: `// React 19 - Context as Provider

const ThemeContext = createContext('light');

function Child() {
  const theme = useContext(ThemeContext);
  return (
    <div style={{ 
      padding: '20px', 
      background: theme === 'dark' ? '#1a1a1a' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      borderRadius: '8px'
    }}>
      <h2>Current Theme: {theme}</h2>
      <p>Context value accessed without .Provider!</p>
    </div>
  );
}

export default function App() {
  return (
    // Context itself acts as provider
    <ThemeContext value="dark">
      <Child />
    </ThemeContext>
  );
}`,
    explanation: `In React 19, you can use the Context directly as a provider without the \`.Provider\` suffix. This reduces visual noise and makes context usage more concise while maintaining the same functionality.`,
  },
  {
    id: "lesson-9-ref-cleanup",
    lessonNumber: 9,
    title: "Ref Callback Cleanup",
    concept: "ref Cleanup Functions",
    description: `The Shift: When using a "Callback Ref" (a function passed to ref instead of a useRef object), you couldn't easily clean up side effects when the element was removed. React 19 allows you to return a cleanup function, exactly like useEffect.`,
    oldWayCode: `// ❌ LegacyRef.jsx
const setRef = (node) => {
  if (node) {
    const observer = new IntersectionObserver(...);
    observer.observe(node);
    // ⚠️ How do we unobserve when 'node' is removed?
    // We had to write complex logic to track the previous node.
  }
};`,
    newWayCode: `// ✅ ModernRef.jsx
const setRef = (node) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) console.log("Visible!");
  });

  if (node) {
    observer.observe(node);
  }

  // React 19 calls this function when the element is removed from DOM!
  return () => {
    observer.disconnect();
  };
};

return <div ref={setRef}>Observe Me</div>;`,
    previewDescription: `When the element is removed, the cleanup function automatically runs, disconnecting the observer.`,
    starterCode: `// React 19 - Ref callback cleanup

function ObserverComponent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(true);

  const setRef = (node) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          console.log("Element is visible!");
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.5 }
    );

    if (node) {
      observer.observe(node);
    }

    // Cleanup function - called when element is removed
    return () => {
      observer.disconnect();
      console.log("Observer cleaned up!");
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      {mounted && (
        <div 
          ref={setRef}
          style={{
            padding: '40px',
            background: visible ? '#10b981' : '#ef4444',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '20px',
            transition: 'background 0.3s'
          }}
        >
          {visible ? 'Visible!' : 'Not visible - scroll to see me'}
        </div>
      )}
      <button 
        onClick={() => setMounted(!mounted)}
        style={{
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {mounted ? 'Unmount' : 'Mount'} Element
      </button>
      <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
        Check console - cleanup runs when element unmounts
      </p>
    </div>
  );
}

export default ObserverComponent;`,
    explanation: `Ref callbacks in React 19 can return a cleanup function, similar to \`useEffect\`. This cleanup function is called when the element is removed from the DOM, making it easy to clean up observers, event listeners, or other side effects.`,
  },
  {
    id: "lesson-10-architecture",
    lessonNumber: 10,
    title: "The Architecture (Client vs Server)",
    concept: "Directives (\"use client\", \"use server\")",
    description: `The Shift: While popularized by Next.js, these are now core React specifications. They define the "boundary" between code that runs on the server (rendering HTML/database access) and code that runs in the browser (interactivity/state).`,
    oldWayCode: `// ❌ Old way - everything runs on client
function Button() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}`,
    newWayCode: `// ----------------------------------------
// 📁 actions.js (SERVER SIDE)
// ----------------------------------------
"use server"; // 👈 This function only runs on the server

export async function submitData(formData) {
  // Safe to access database directly here!
  await db.users.create({ name: formData.get('name') });
}

// ----------------------------------------
// 📁 Button.js (CLIENT SIDE)
// ----------------------------------------
"use client"; // 👈 This component ships JS to the browser

import { useState } from "react";
import { submitData } from "./actions";

export default function Button() {
  // We can use State and Effects here because it's a Client Component
  const [count, setCount] = useState(0); 

  return (
    <button onClick={() => submitData(/*...*/)}>
      Clicked {count} times
    </button>
  );
}`,
    previewDescription: `Directives clearly separate server and client code, enabling better security and performance.`,
    starterCode: `// React 19 - Client/Server Architecture

// In a real app, this would be in a separate file with "use server"
async function submitData(formData) {
  // Simulate server action
  await new Promise(r => setTimeout(r, 1000));
  const name = formData.get('name');
  return { success: true, message: \`Hello, \${name}!\` };
}

// This component would have "use client" at the top in a real app
export default function App() {
  const [count, setCount] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const res = await submitData(formData);
    setResult(res);
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Client State: {count}</h3>
        <button 
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Increment
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          name="name" 
          placeholder="Your name"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: loading ? '#ccc' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit (Server Action)'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#d1fae5', borderRadius: '4px' }}>
          {result.message}
        </div>
      )}
    </div>
  );
}`,
    explanation: `React 19's \`"use client"\` and \`"use server"\` directives clearly separate client and server code. Server actions can safely access databases and APIs, while client components handle interactivity. This architecture improves security and performance.`,
  },
  {
    id: "lesson-11-web-components",
    lessonNumber: 11,
    title: "Web Components Interop",
    concept: "Custom Elements Support",
    description: `The Shift: React 18 and below struggled with Web Components (e.g., <my-slider>), often failing to pass properties correctly or handle custom events. React 19 passes all tests for "Custom Elements Everywhere."`,
    oldWayCode: `// ❌ React 18 - Web Components didn't work well
function DatePicker() {
  return (
    <my-date-picker 
      value={new Date()} 
      onChange={e => console.log(e.detail)} // Often broken
      class="p-4"
    />
  );
}`,
    newWayCode: `// ✅ ModernInterop.jsx
function DatePicker() {
  return (
    // React 19 handles the custom events and object properties correctly
    <my-date-picker 
      value={new Date()} 
      onChange={e => console.log(e.detail)} // Works!
      class="p-4"
    />
  );
}`,
    previewDescription: `Web Components now work seamlessly with React 19, with proper event handling and property passing.`,
    starterCode: `// React 19 - Web Components Interop

// Simulate a custom element (in real app, this would be from a library)
class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = \`
      <style>
        button {
          padding: 12px 24px;
          background: var(--bg-color, #007bff);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          opacity: 0.9;
        }
      </style>
      <button><slot></slot></button>
    \`;
  }

  connectedCallback() {
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('customclick', {
        detail: { message: 'Custom element clicked!' }
      }));
    });
  }
}

// Register the custom element
if (!customElements.get('custom-button')) {
  customElements.define('custom-button', CustomButton);
}

export default function App() {
  const [clicked, setClicked] = useState(false);

  const handleCustomClick = (e) => {
    console.log('Custom event:', e.detail);
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Web Components in React 19</h2>
      <custom-button 
        onCustomClick={handleCustomClick}
        style={{ '--bg-color': '#10b981' }}
      >
        Click Me (Custom Element)
      </custom-button>
      {clicked && (
        <p style={{ marginTop: '12px', color: '#10b981' }}>
          Custom element event received! Check console.
        </p>
      )}
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        React 19 properly handles custom events and properties for Web Components
      </p>
    </div>
  );
}`,
    explanation: `React 19 has full support for Web Components, properly handling custom events (with the \`on\` prefix), object properties, and class attributes. This allows seamless integration with Web Component libraries like Lit or Shoelace.`,
  },
  {
    id: "lesson-12-asset-loading",
    lessonNumber: 12,
    title: "Native Asset Loading (Styles & Scripts)",
    concept: "Resource Hoisting & Deduplication",
    description: `The Shift: In React 18, if you wanted to lazy-load a stylesheet or a script for a specific component, you had to use external libraries or messy hacks. React 19 now natively handles loading resources, ensuring they only load once, even if the component renders multiple times.`,
    oldWayCode: `// ❌ React 18 - Manual resource loading
useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'dashboard-analytics.css';
  document.head.appendChild(link);
  return () => document.head.removeChild(link);
}, []);`,
    newWayCode: `// ✅ Dashboard.jsx
export default function Dashboard() {
  return (
    <div>
      {/* React 19 hoists this to the <head> and ensures it loads only ONCE */}
      <link rel="stylesheet" href="dashboard-analytics.css" precedence="default" />
      
      {/* Scripts can be loaded asynchronously with built-in support */}
      <script async src="https://analytics.example.com/tracker.js" />
      
      <h1>Analytics Dashboard</h1>
    </div>
  );
}`,
    previewDescription: `Stylesheets and scripts are automatically hoisted to the head and deduplicated, even if the component renders multiple times.`,
    starterCode: `// React 19 - Native Asset Loading

export default function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      {/* React 19 hoists these to <head> and ensures they load only once */}
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" 
        precedence="default" 
      />
      
      <script 
        async 
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
      />
      
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
        Analytics Dashboard
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif' }}>
        Check the page source - the link and script tags are in the head!
      </p>
      <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
        React 19 automatically deduplicates these resources, so they only load once
        even if this component renders multiple times.
      </p>
    </div>
  );
}`,
    explanation: `React 19 natively handles loading stylesheets and scripts. The \`<link>\` and \`<script>\` tags are automatically hoisted to the document head, and React ensures they only load once through deduplication. The \`precedence\` prop controls loading order.`,
  },
  {
    id: "lesson-13-hydration-errors",
    lessonNumber: 13,
    title: "The \"Hydration Error\" Fix",
    concept: "Debugging Sanity",
    description: `The Shift: Everyone who has used Next.js or SSR knows the dreaded error: Text content does not match server-rendered HTML. In React 18, this error was a wall of useless text. React 19 acts like git diff.`,
    oldWayCode: `// ❌ React 18 Error
Error: Text content does not match server-rendered HTML.
warning: Text content did not match.
Server: "Hello"
Client: "Hello World"
(Logs generic error stacks)`,
    newWayCode: `// ✅ React 19 Error (Automatic - no code changes needed)
Uncaught Error: Hydration failed because the initial UI does not match what was rendered on the server.

  <App>
    <div>
-     Time: 10:00:00 AM
+     Time: 10:00:01 AM
    </div>
  </App>
It points exactly to the component and the discrepancy.`,
    previewDescription: `Hydration errors now show a clear diff view pointing to the exact mismatch, making debugging much easier.`,
    starterCode: `// React 19 - Better Hydration Error Messages

// In a real SSR app, hydration errors would show helpful diffs
// This is a client-side demo showing the concept

export default function TimeDisplay() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Current Time</h2>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#007bff',
        marginTop: '12px'
      }}>
        {time}
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        In React 19, if there's a hydration mismatch (e.g., server rendered 
        "10:00:00" but client rendered "10:00:01"), you'll see a clear diff 
        pointing to the exact component and value that differs.
      </p>
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#f3f4f6', 
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <div>React 19 Error Format:</div>
        <div style={{ marginTop: '8px' }}>
          <div>- Server: "10:00:00 AM"</div>
          <div>+ Client: "10:00:01 AM"</div>
        </div>
      </div>
    </div>
  );
}`,
    explanation: `React 19 provides much better hydration error messages with a diff-like view that shows exactly what differs between server and client rendering. This makes debugging SSR issues significantly easier without requiring any code changes.`,
  },
  {
    id: "lesson-14-use-deferred-value",
    lessonNumber: 14,
    title: "useDeferredValue Initial Config",
    concept: "Hiding the \"Stale\" State",
    description: `The Shift: useDeferredValue is used to keep the UI responsive during heavy updates. Previously, you couldn't set an initial value, so the first render might show undefined or flash.`,
    oldWayCode: `// ❌ React 18 - No initial value
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query); // Might be undefined initially
  // ...
}`,
    newWayCode: `// ✅ ModernSearch.jsx
function SearchResults({ query }) {
  // If 'query' updates, 'deferredQuery' lags behind to keep UI smooth.
  // Now we can set a default for the very first render!
  const deferredQuery = useDeferredValue(query, ""); 
  
  if (deferredQuery !== query) {
    return <div className="opacity-50">Refreshing...</div>; 
  }

  return <List items={search(deferredQuery)} />;
}`,
    previewDescription: `useDeferredValue can now accept an initial value, preventing undefined flashes on first render.`,
    starterCode: `// React 19 - useDeferredValue with initial value

function search(query) {
  // Simulate search
  if (!query) return [];
  return Array.from({ length: 10 }, (_, i) => \`Result \${i + 1} for "\${query}"\`);
}

function SearchResults({ query }) {
  // Initial value prevents undefined flash
  const deferredQuery = useDeferredValue(query, "");
  const isStale = deferredQuery !== query;

  const results = search(deferredQuery);

  return (
    <div style={{ marginTop: '16px' }}>
      {isStale && (
        <div style={{ 
          padding: '8px', 
          background: '#fef3c7', 
          borderRadius: '4px',
          marginBottom: '12px',
          fontSize: '14px',
          color: '#92400e'
        }}>
          ⏳ Refreshing...
        </div>
      )}
      <div style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {results.length === 0 ? (
          <p style={{ color: '#666' }}>No results</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((result, i) => (
              <li 
                key={i}
                style={{ 
                  padding: '8px', 
                  marginBottom: '4px', 
                  background: '#f3f4f6',
                  borderRadius: '4px'
                }}
              >
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Search Demo</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />
      <SearchResults query={query} />
      <p style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        useDeferredValue now accepts an initial value (empty string) to prevent undefined
      </p>
    </div>
  );
}`,
    explanation: `\`useDeferredValue\` in React 19 accepts an optional second parameter for the initial value. This prevents undefined or flashy initial states, making the transition smoother and more predictable.`,
  },
  {
    id: "lesson-15-preloading",
    lessonNumber: 15,
    title: "Preloading APIs (preload, preinit)",
    concept: "Browser Hints",
    description: `The Shift: Instead of manually adding <link rel="preload"> tags in your index.html and hoping they match your components, you can imperatively tell the browser to start loading fonts or scripts before the component even renders.`,
    oldWayCode: `// ❌ React 18 - Manual preload in HTML
// index.html
<link rel="preload" href="https://fonts.example.com/my-font.woff2" as="font" />`,
    newWayCode: `// ✅ App.jsx
import { preinit, preload } from 'react-dom';

export default function App() {
  // Start downloading this font IMMEDIATELY, before the component paints
  preload('https://fonts.example.com/my-font.woff2', { as: 'font' });
  
  // Start downloading AND executing this script immediately
  preinit('https://example.com/heavy-script.js', { as: 'script' });

  return <div>Welcome</div>;
}`,
    previewDescription: `Resources can be preloaded imperatively, improving performance by starting downloads before they're needed.`,
    starterCode: `// React 19 - Preloading APIs

// In a real app, these would be imported from 'react-dom'
// For demo purposes, we'll simulate the concept

function App() {
  const [preloaded, setPreloaded] = useState(false);

  // Simulate preload/preinit
  const handlePreload = () => {
    console.log('Preloading font...');
    console.log('Preinitializing script...');
    setPreloaded(true);
    
    // In real app:
    // preload('https://fonts.example.com/font.woff2', { as: 'font' });
    // preinit('https://example.com/script.js', { as: 'script' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Preloading APIs</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        React 19 provides <code>preload</code> and <code>preinit</code> functions
        to imperatively start loading resources before components render.
      </p>
      
      <button
        onClick={handlePreload}
        style={{
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        Simulate Preload
      </button>

      {preloaded && (
        <div style={{
          padding: '12px',
          background: '#d1fae5',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          ✓ Resources preloaded! Check console.
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        background: '#f3f4f6', 
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div>// Example usage:</div>
        <div style={{ marginTop: '8px' }}>
          <div>preload('font.woff2', {'{'} as: 'font' {'}'});</div>
          <div>preinit('script.js', {'{'} as: 'script' {'}'});</div>
        </div>
      </div>
    </div>
  );
}

export default App;`,
    explanation: `React 19 provides \`preload\` and \`preinit\` functions from \`react-dom\` to imperatively start loading resources. \`preload\` starts downloading resources, while \`preinit\` starts downloading and executing scripts. This gives you fine-grained control over resource loading timing.`,
  },
];

export function getReact19LessonById(id: string): React19Lesson | undefined {
  return REACT19_LESSONS.find((lesson) => lesson.id === id);
}

export function getAllReact19LessonIds(): string[] {
  return REACT19_LESSONS.map((lesson) => lesson.id);
}
