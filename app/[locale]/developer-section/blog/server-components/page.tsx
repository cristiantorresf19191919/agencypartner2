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
                1. Server vs Client Components
              </Heading>
              <Text className={styles.sectionDescription}>
                Understand when to use Server Components (default) vs Client Components ('use client').
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
                2. Data Fetching Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Fetch data directly in Server Components without useEffect or useState.
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
        <li key={p.id}>{p.name} – ${p.price}</li>
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
                3. Server Actions
              </Heading>
              <Text className={styles.sectionDescription}>
                Use Server Actions for form submissions and mutations without API routes.
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

