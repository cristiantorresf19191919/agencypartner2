"use client";

import { Stack, Heading, Text, ButtonLink, CodeEditor, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ReactDesignPatternsPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>React Design Patterns 2025</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          React Design Patterns and Best Practices for 2025
        </Heading>
        <Text className={styles.subtitle}>
          Explore modern React patterns, best practices, and ecosystem updates for 2025. Learn about function components, custom hooks, TypeScript integration, React 19 features, modern frameworks, and component libraries that help you build robust and maintainable applications.
        </Text>
      </div>

      {/* Modern Component Patterns */}
      <section id="modern-component-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Modern Component Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Function components have become the de facto standard for React development, replacing class components for practically all use cases. This shift reflects React's move toward a more functional programming paradigm, emphasizing simplicity and composability.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Benefit:</strong> Function components follow a straightforward input-output model, making them easier to understand and test. They also enable using React's hooks system for state management and lifecycle events.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// Function Component with Hooks
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {/* Additional user information */}
    </div>
  );
}`}
              readOnly={true}
              height={400}
            />
          </Stack>
        </Card>
      </section>

      {/* Custom Hooks */}
      <section id="custom-hooks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Custom Hooks for Logic Reusability
              </Heading>
              <Text className={styles.sectionDescription}>
                Custom hooks represent one of the most powerful patterns in modern React development. They enable the extraction of stateful logic into reusable functions, promoting code reuse and separation of concerns.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Why this matters:</strong> Custom hooks can help extract complex logic from components, making them more focused on rendering. The same logic can be shared across multiple components without duplication, and custom hooks can be tested independently.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// Custom hook for handling form input
function useFormInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange,
    reset: () => setValue(initialValue),
  };
}

// Usage in a component
function LoginForm() {
  const email = useFormInput("");
  const password = useFormInput("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Login logic here using email.value and password.value

    // Reset form after submission
    email.reset();
    password.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" {...email} />
      <input type="password" placeholder="Password" {...password} />
      <button type="submit">Login</button>
    </form>
  );
}

// Advanced: Type-safe custom hook with generics
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage with type inference
interface UserPrefs {
  theme: 'light' | 'dark';
  notifications: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

function UserPreferences() {
  // TypeScript infers that preferences is of type UserPrefs
  const [preferences, setPreferences] = useLocalStorage<UserPrefs>('userPrefs', {
    theme: 'light',
    notifications: true,
    fontSize: 'medium'
  });

  return (
    <div>
      <h2>User Preferences</h2>
      <label>
        Theme:
        <select
          value={preferences.theme}
          onChange={(e) => setPreferences({
            ...preferences,
            theme: e.target.value as 'light' | 'dark'
          })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
}`}
              readOnly={true}
              height={650}
            />
          </Stack>
        </Card>
      </section>

      {/* Context API */}
      <section id="context-api" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Context API for Application-Wide State
              </Heading>
              <Text className={styles.sectionDescription}>
                The Context API has matured into a reasonable solution for managing application-wide state, reducing the need for external state management libraries. With React 19, the Context API has become even more powerful by introducing the <code>use</code> function for accessing context values.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Benefit:</strong> The Context API is well-suited for theme management, user authentication, localization, and feature flags across an application. React 19's <code>use()</code> API allows using context in conditional blocks.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { createContext, useState, use } from 'react';

// Creating a context
const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

// Provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Using context with the new 'use' API in React 19
function ThemedButton({ variant }: { variant: "primary" | "secondary" }) {
  // We can use the 'use' function in conditional blocks
  if (variant === "primary") {
    const { theme, toggleTheme } = use(ThemeContext);

    return (
      <button className={\`btn-\${variant} \${theme}\`} onClick={toggleTheme}>
        Toggle Theme
      </button>
    );
  }

  return <button className={\`btn-\${variant}\`}>Regular Button</button>;
}

// App setup
function App() {
  return (
    <ThemeProvider>
      <ThemedButton variant="primary" />
      <ThemedButton variant="secondary" />
    </ThemeProvider>
  );
}`}
              readOnly={true}
              height={500}
            />
          </Stack>
        </Card>
      </section>

      {/* TypeScript Patterns */}
      <section id="typescript-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                TypeScript Integration
              </Heading>
              <Text className={styles.sectionDescription}>
                TypeScript has become an integral part of React development, with many new projects adopting it from the outset. The benefits include type safety, improved developer experience with enhanced IDE support, and self-documenting code.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// Type-Safe Components and Props
interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user" | "guest";
    profileImage?: string;
  };
  onEdit?: (userId: number) => void;
  variant?: "compact" | "detailed";
}

// Type-safe component
function UserCard({ user, onEdit, variant = "detailed" }: UserCardProps) {
  return (
    <div className={\`user-card \${variant}\`}>
      {user.profileImage && (
        <img src={user.profileImage} alt={\`\${user.name}'s profile\`} />
      )}

      <h3>{user.name}</h3>
      {variant === "detailed" && (
        <>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>
        </>
      )}

      {onEdit && <button onClick={() => onEdit(user.id)}>Edit</button>}
    </div>
  );
}

// Generic Components for Maximum Reusability
interface SelectProps<T> {
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T) => void;
  getDisplayText: (item: T) => string;
  getItemKey: (item: T) => string | number;
}

function Select<T>({
  items,
  selectedItem,
  onSelect,
  getDisplayText,
  getItemKey
}: SelectProps<T>) {
  return (
    <div className="select-container">
      <div className="selected-item">
        {selectedItem ? getDisplayText(selectedItem) : 'Select an item'}
      </div>

      <ul className="items-list">
        {items.map(item => (
          <li
            key={getItemKey(item)}
            className={item === selectedItem ? 'selected' : ''}
            onClick={() => onSelect(item)}
          >
            {getDisplayText(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Usage with different data types
interface User {
  id: number;
  name: string;
  email: string;
}

function UserSelector() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  return (
    <Select<User>
      items={users}
      selectedItem={selectedUser}
      onSelect={setSelectedUser}
      getDisplayText={(user) => user.name}
      getItemKey={(user) => user.id}
    />
  );
}`}
              readOnly={true}
              height={650}
            />
          </Stack>
        </Card>
      </section>

      {/* React 19 Features */}
      <section id="react-19-features" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                React 19 and Ecosystem Updates
              </Heading>
              <Text className={styles.sectionDescription}>
                React 19 introduced several new hooks, including <code>useActionState</code>, <code>useFormStatus</code>, <code>useOptimistic</code>, and the new <code>use</code> API. These hooks provide elegant solutions for everyday tasks like form handling and optimistic UI updates.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { useOptimistic } from 'react';

// useOptimistic Hook for Immediate UI Updates
function MessageList({ 
  messages, 
  onSendMessage 
}: { 
  messages: Message[]; 
  onSendMessage: (content: string) => Promise<void>;
}) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  );

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get("message") as string;

    // Create optimistic version of the message
    const optimisticMessage: Message = {
      id: \`temp-\${Date.now()}\`,
      content,
      status: "sending",
    };

    // Update UI immediately
    addOptimisticMessage(optimisticMessage);

    // Send the actual message
    await onSendMessage(content);
  };

  return (
    <form action={handleSubmit}>
      <input name="message" />
      <button type="submit">Send</button>
      <div className="messages">
        {optimisticMessages.map((message) => (
          <div key={message.id} className={\`message \${message.status || ""}\`}>
            {message.content}
          </div>
        ))}
      </div>
    </form>
  );
}

// React Server Components Example
// Server Component (runs on server)
async function ProductPage({ productId }: { productId: string }) {
  // Direct server-side data access
  const product = await db.products.findById(productId);

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <p className="description">{product.description}</p>
      <p className="price">\${product.price.toFixed(2)}</p>

      {/* Client Component for interactivity */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// Client Component (marked with "use client")
"use client";
function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddToCart() {
    setIsAdding(true);
    await addToCart(productId);
    setIsAdding(false);
  }

  return (
    <button onClick={handleAddToCart} disabled={isAdding}>
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}`}
              readOnly={true}
              height={600}
            />
          </Stack>
        </Card>
      </section>

      {/* Modern Frameworks */}
      <section id="modern-frameworks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Modern Frameworks
              </Heading>
              <Text className={styles.sectionDescription}>
                The modern React ecosystem has evolved significantly, with frameworks playing a critical role in elevating developer experience and application performance. In 2025, three solutions often stand out: <strong>Next.js</strong>, <strong>Remix</strong>, and <strong>Vite</strong>.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Next.js:</strong> Comprehensive solution with flexible rendering, API routes, and full-stack capabilities. <strong>Remix:</strong> Emphasizes web fundamentals and progressive enhancement. <strong>Vite:</strong> Lightning-fast build tool with near-instantaneous startup times.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// Next.js App Router Example
// app/products/[id]/page.tsx
export default async function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await fetch(\`https://api.example.com/products/\${params.id}\`).then(r => r.json());

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>\${product.price}</p>
    </div>
  );
}

// Remix Example with Loader
// app/routes/products.\$id.tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  return json({ product });
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}

// Vite + React Setup
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});`}
              readOnly={true}
              height={500}
            />
          </Stack>
        </Card>
      </section>

      {/* Component Libraries */}
      <section id="component-libraries" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Component Libraries and Design Systems
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>Tailwind CSS</strong> has become a popular choice for styling in React applications, providing utility-first CSS classes. For enterprise applications requiring complex components, professional UI libraries like <strong>KendoReact</strong> offer comprehensive component suites.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// Tailwind CSS Utility-First Styling
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden duration-300">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-indigo-600">
            \${product.price.toFixed(2)}
          </span>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// Component Library Integration Example
// Using a professional UI library for complex components
import { DataGrid, DataGridColumn } from '@progress/kendo-react-grid';

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <DataGrid
      data={users}
      style={{ height: '400px' }}
    >
      <DataGridColumn field="name" title="Name" width="200px" />
      <DataGridColumn field="email" title="Email" width="250px" />
      <DataGridColumn field="role" title="Role" width="150px" />
    </DataGrid>
  );
}`}
              readOnly={true}
              height={500}
            />
          </Stack>
        </Card>
      </section>

      {/* Summary Section */}
      <section id="summary" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Wrap-up: React Best Practices for 2025
            </Heading>
            <div className="space-y-4">
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>1. Function Components:</strong> Use function components as the standard. They're simpler, more testable, and enable React's hooks system for state management and lifecycle events.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>2. Custom Hooks:</strong> Extract reusable stateful logic into custom hooks. This promotes code reuse, separation of concerns, and makes components more focused on rendering.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>3. Context API:</strong> Use Context API for application-wide state like themes, authentication, and localization. React 19's <code>use()</code> API makes it even more powerful.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>4. TypeScript:</strong> Adopt TypeScript for type safety, better IDE support, and self-documenting code. Use generics for highly reusable components.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>5. React 19 Features:</strong> Leverage new hooks like <code>useOptimistic</code> for better UX, and use Server Components to reduce bundle sizes and improve performance.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>6. Modern Frameworks:</strong> Choose the right framework for your needs—Next.js for comprehensive solutions, Remix for web fundamentals, or Vite for fast development.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>7. Styling & Components:</strong> Use Tailwind CSS for utility-first styling, and consider professional UI libraries like KendoReact for enterprise-grade components.
                </Text>
              </div>
            </div>
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

