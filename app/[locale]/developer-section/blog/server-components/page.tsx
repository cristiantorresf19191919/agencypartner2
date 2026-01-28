"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor , FullscreenSection } from "@/components/ui";
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
      <FullscreenSection id="server-vs-client" title="Server Vs Client" sectionClassName={styles.section}>
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
      </FullscreenSection>

      {/* Data Fetching Patterns */}
      <FullscreenSection id="data-fetching" title="Data Fetching" sectionClassName={styles.section}>
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
              code={`// ✅ Server Component data fetching
// app/products/page.tsx
async function ProductsPage() {
  // This runs on the server
  const products = await fetch('https://api.example.com/products', {
    cache: 'no-store' // Always fetch fresh
  }).then(res => res.json());

  return (
    <div>
      <h1>Products</h1>
      <ProductList products={products} />
    </div>
  );
}

// ✅ Caching strategies
async function getProduct(id: string) {
  const res = await fetch(\`https://api.example.com/products/\${id}\`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  return res.json();
}

// ✅ Parallel data fetching
async function ProductPage({ params }: { params: { id: string } }) {
  // These fetch in parallel
  const [product, reviews, related] = await Promise.all([
    fetchProduct(params.id),
    fetchReviews(params.id),
    fetchRelated(params.id)
  ]);

  return (
    <div>
      <ProductDetails product={product} />
      <Reviews reviews={reviews} />
      <RelatedProducts products={related} />
    </div>
  );
}

// ✅ Sequential data fetching
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  // This waits for user to complete
  const posts = await fetchUserPosts(user.id);

  return (
    <div>
      <UserInfo user={user} />
      <UserPosts posts={posts} />
    </div>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Server Actions */}
      <FullscreenSection id="server-actions" title="Server Actions" sectionClassName={styles.section}>
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
              code={`// ✅ Server Action
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // This runs on the server
  const user = await db.user.create({
    data: { name, email }
  });

  return user;
}

// ✅ Using Server Action in form
// app/users/page.tsx
import { createUser } from './actions';

function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}

// ✅ Server Action with useTransition
'use client';

import { useTransition } from 'react';
import { createUser } from './actions';

function UserForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await createUser(formData);
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>
    </BlogContentLayout>
  );
}

