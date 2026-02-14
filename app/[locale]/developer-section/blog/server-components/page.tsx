"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ServerComponentsPage() {
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
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Server Components</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Server Components & React Server Components
        </Heading>
        <Text className={styles.subtitle}>
          Next.js 13+ Server Components: When to use Server vs Client components, data fetching patterns, streaming, Server Actions, hybrid architecture, performance benefits, and migration strategies.
        </Text>
      </div>

      {/* Server vs Client Components */}
      <section id="server-vs-client" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🖥️"} 1. Server vs Client Components
              </Heading>
              <Text className={styles.sectionDescription}>
                {"The million-dollar question: Server or Client? 🤔 Server Components run on the server (surprise!), ship zero JS to the browser, and can talk directly to your database. Client Components handle interactivity. Knowing when to use each is what separates the pros from the beginners!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"Getting the Server vs Client split right can cut your bundle size by 50%+ and massively boost performance! 🏋️"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Server Components (Default) • {"'use client' Directive"} • Hybrid Architecture • When to Use Which
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Using client component for static data
'use client';

import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers);
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}`}
              good={`// ✅ CORRECT: Server Component (default)
// app/users/page.tsx - No 'use client' directive
async function UserList() {
  // This runs on the server
  const users = await fetchUsers();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// ✅ Client Component only when needed
'use client';

import { useState } from 'react';

function InteractiveCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

// ✅ Hybrid: Server Component with Client Component
// app/dashboard/page.tsx (Server Component)
async function Dashboard() {
  const data = await fetchDashboardData();

  return (
    <div>
      <ServerDataDisplay data={data} />
      <InteractiveChart data={data} /> {/* Client Component */}
    </div>
  );
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* Data Fetching Patterns */}
      <section id="data-fetching" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"📡"} 2. Data Fetching Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Remember the useEffect + useState + loading + error dance? 💃 With Server Components, you just... await your data. That's it. No loading states to manage, no race conditions to worry about, no waterfall requests. It's so simple it almost feels like cheating!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Server-side data fetching eliminates entire categories of bugs and makes your code 10x simpler! 🧹"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Async Server Components • Direct DB Access • No useEffect Needed • Automatic Caching
              </Text>
            </div>

            <CodeEditor
              code={`// Server Component pattern (client demo with mock data)
const MOCK_PRODUCTS = [
  { id: '1', name: 'React Guide', price: 29.99 },
  { id: '2', name: 'TypeScript Book', price: 34.99 },
];

function ProductList({ products }: { products: typeof MOCK_PRODUCTS }) {
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} – \${p.price}</li>
      ))}
    </ul>
  );
}

function ProductsPage() {
  const products = MOCK_PRODUCTS;
  return (
    <div>
      <h1>Products</h1>
      <ProductList products={products} />
    </div>
  );
}

function App() { return <ProductsPage />; }
export default App;`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>

      {/* Server Actions */}
      <section id="server-actions" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🎬"} 3. Server Actions
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Server Actions are like magic wands for your forms! 🪄 Write a function, slap 'use server' on it, and boom — it runs on the server when your form submits. No API routes, no fetch calls, no boilerplate. Just pure, beautiful simplicity. This is the future of form handling!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"Server Actions replace entire API layers for mutations — this is a paradigm shift in how we handle forms! 🔄"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Form Submissions • useTransition with Forms • Optimistic Updates • Progressive Enhancement
              </Text>
            </div>

            <CodeEditor
              code={`// Client demo: form + useTransition (mock server action)
async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  await new Promise((r) => setTimeout(r, 500));
  return { name, email };
}

function UserForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const user = await createUser(formData);
      setResult(\`Created: \${user.name} (\${user.email})\`);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create User'}
        </button>
      </form>
      {result && <p style={{ marginTop: 8 }}>{result}</p>}
    </div>
  );
}

function App() { return <UserForm />; }
export default App;`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

