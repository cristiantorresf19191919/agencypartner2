"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ContainerPresentationalPatternPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-zinc-400">
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/5 !text-zinc-300 hover:!bg-white/10">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/5 !text-zinc-300 hover:!bg-white/10">
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/5 !text-zinc-300 hover:!bg-white/10">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li>/</li>
          <li className="text-zinc-100 font-medium">Container/Presentational Pattern</li>
        </ol>
      </nav>

      {/* Header */}
      <Stack direction="col" gap="lg" className="mb-16">
        <div>
          <Heading className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Container/Presentational Pattern with Render Props
          </Heading>
          <Text size="lg" className="text-zinc-400 max-w-3xl">
            The "Secret Sauce" for scalable React apps. Learn how to separate logic from UI, 
            build reusable data sources, and create maintainable components that scale with your application.
          </Text>
        </div>
      </Stack>

      {/* Core Concept */}
      <section id="core-concept" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-white/3 !border-white/10">
          <Stack direction="col" gap="lg">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-4">
                Core Concept
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                Separation of Concerns
              </Heading>
              <Text className="text-zinc-300 mb-4">
                This pattern solves the biggest problem in large codebases: <strong className="text-purple-300">Tightly coupled Logic and UI.</strong>
              </Text>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <Heading level={3} className="text-xl font-bold mb-3 text-purple-200">
                  The Container (Logic)
                </Heading>
                <Text className="text-zinc-300">
                  Handles fetching data, loading states, and errors. It doesn't care <em>what</em> the data looks like on screen.
                </Text>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <Heading level={3} className="text-xl font-bold mb-3 text-blue-200">
                  The Presentational Component (UI)
                </Heading>
                <Text className="text-zinc-300">
                  Just renders props. It doesn't care <em>where</em> the data comes from.
                </Text>
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Lesson 1: The Junior Way */}
      <section id="lesson-1" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-white/3 !border-white/10">
          <Stack direction="col" gap="lg">
            <div>
              <div className="inline-block px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full mb-4">
                Lesson 1
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                The "Junior" Way (Hard to Scale) ❌
              </Heading>
              <Text className="text-zinc-300 mb-4">
                This is what we want to avoid. The fetching logic is trapped inside the component. 
                If you need this same user data in a different view, you have to copy-paste this logic.
              </Text>
            </div>

            <CodeEditor
              code={`// UserProfile.js
const UserProfile = () => {
  const [user, setUser] = useState(null);

  // ❌ Business logic mixed with UI
  useEffect(() => {
    fetch('/api/current-user').then(d => setUser(d));
  }, []);

  if (!user) return <div>Loading...</div>;
  return <h1>{user.name}</h1>;
};`}
              language="tsx"
              readOnly={true}
              height={200}
            />

            <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-lg mt-8">
              <Heading level={3} className="text-xl font-bold mb-2 text-red-200">
                Problems with this approach:
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Logic is tightly coupled to the UI component</li>
                <li>Can't reuse the data fetching logic elsewhere</li>
                <li>Hard to test - need to mock fetch for UI tests</li>
                <li>Loading states duplicated across components</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Lesson 2: The Senior Way */}
      <section id="lesson-2" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-white/3 !border-white/10">
          <Stack direction="col" gap="lg">
            <div>
              <div className="inline-block px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full mb-4">
                Lesson 2
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                The "Senior" Way: The Generic DataSource ✅
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Instead of writing a loader for every single data type (<code className="text-purple-400">UserLoader</code>, <code className="text-purple-400">ProductLoader</code>, etc.), 
                we build <strong className="text-green-300">one</strong> reusable <code className="text-purple-400">DataSource</code> component.
              </Text>
              <Text className="text-zinc-300 mb-4">
                This covers <strong className="text-purple-300">DataSource</strong> and <strong className="text-purple-300">Render Props</strong> patterns.
              </Text>
            </div>

            <div className="mt-8">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                The Container (Logic Layer)
              </Heading>
              <Text className="text-zinc-300 mb-4">
                It takes a "getData" function and passes the result to "children" using Render Props:
              </Text>
              
              <CodeEditor
                code={`import { useState, useEffect } from 'react';

// 🏗️ The Container (Logic Layer)
// It takes a "getData" function and passes the result to "children"
export const DataSource = ({ getDataFunc, resourceName, children }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getDataFunc();
      setState(data);
    })();
  }, [getDataFunc]);

  // ⚠️ Render Prop Magic:
  // We don't render HTML. We call the 'children' function with the data.
  // We dynamically name the prop using [resourceName]
  if (!state) return <p>Loading...</p>;
  
  return children({ [resourceName]: state });
};`}
                language="tsx"
                readOnly={true}
                height={300}
              />
            </div>

            <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-lg mt-8">
              <Heading level={3} className="text-xl font-bold mb-2 text-green-200">
                Key Points:
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Render Props:</strong> <code className="text-green-300">children</code> is a function that receives data</li>
                <li><strong>Dynamic Prop Naming:</strong> Uses <code className="text-green-300">[resourceName]</code> to create flexible prop names</li>
                <li><strong>Reusable Logic:</strong> One component handles all data fetching patterns</li>
                <li><strong>Separation:</strong> Logic is completely separate from UI</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Lesson 3: Presentational Components */}
      <section id="lesson-3" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-white/3 !border-white/10">
          <Stack direction="col" gap="lg">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-4">
                Lesson 3
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                The "Dumb" UI Components
              </Heading>
              <Text className="text-zinc-300 mb-4">
                These components are pure. They are incredibly easy to test and style because they have zero side effects.
              </Text>
            </div>

            <CodeEditor
              code={`// 🎨 The Presentational Layer (UI Layer)
export const UserInfo = ({ user }) => (
  <div className="border p-4">
    <h1 className="text-xl font-bold">{user.name}</h1>
    <p>Email: {user.email}</p>
  </div>
);

export const ProductInfo = ({ product }) => (
  <div className="bg-gray-100 p-4">
    <h2>{product.title}</h2>
    <p>Price: \${product.price}</p>
  </div>
);`}
              language="tsx"
              readOnly={true}
              height={250}
            />

            <div className="bg-purple-500/10 border-l-4 border-purple-500 p-6 rounded-lg mt-8">
              <Heading level={3} className="text-xl font-bold mb-2 text-purple-200">
                Benefits of Pure Components:
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Easy to Test:</strong> Just pass props, no mocking needed</li>
                <li><strong>Easy to Style:</strong> No side effects to worry about</li>
                <li><strong>Reusable:</strong> Can be used with any data source</li>
                <li><strong>Predictable:</strong> Same props = same output, always</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Lesson 4: Putting It Together */}
      <section id="lesson-4" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-white/3 !border-white/10">
          <Stack direction="col" gap="lg">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full mb-4">
                Lesson 4
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                Putting It Together (The Scalability Win) 🚀
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Now, look at how clean your main App becomes. You can mix and match any Data Source with any UI component.
              </Text>
            </div>

            <CodeEditor
              code={`import { DataSource } from './DataSource';
import { UserInfo, ProductInfo } from './components';
import { api } from './api'; // assume this has fetch functions

const App = () => {
  return (
    <>
      {/* Scenario 1: Fetching a User */}
      <DataSource 
        getDataFunc={api.getCurrentUser} 
        resourceName="user"
      >
        {({ user }) => <UserInfo user={user} />}
      </DataSource>

      {/* Scenario 2: Fetching a Product (Reusing the SAME logic!) */}
      <DataSource 
        getDataFunc={() => api.getProduct(123)} 
        resourceName="product"
      >
        {({ product }) => <ProductInfo product={product} />}
      </DataSource>
    </>
  );
};`}
              language="tsx"
              readOnly={true}
              height={350}
            />

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 rounded-lg mt-8">
              <Heading level={3} className="text-xl font-bold mb-2 text-blue-200">
                The Power of This Pattern:
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>One Logic Component:</strong> Write loading/error logic once, use everywhere</li>
                <li><strong>Mix & Match:</strong> Any data source with any UI component</li>
                <li><strong>Clean App:</strong> Your main App component stays readable and maintainable</li>
                <li><strong>Type Safety:</strong> Easy to add TypeScript for better DX</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Lesson 5: LocalStorage Example */}
      <section id="lesson-5" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-white/3 !border-white/10">
          <Stack direction="col" gap="lg">
            <div>
              <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded-full mb-4">
                Lesson 5
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                Applying it to LocalStorage 💾
              </Heading>
              <Text className="text-zinc-300 mb-4">
                This pattern is so flexible that the "Source" doesn't even have to be an API. 
                It can be LocalStorage, and the UI component <strong className="text-orange-300">doesn't even know the difference</strong>.
              </Text>
            </div>

            <CodeEditor
              code={`// 🏗️ LocalStorage Loader
export const LocalStorageLoader = ({ keyName, children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem(keyName);
    setData(JSON.parse(savedData));
  }, [keyName]);

  return children({ data });
};

// Usage
<LocalStorageLoader keyName="theme-preferences">
  {({ data }) => (
    <div>Current Theme: {data?.color || 'Default'}</div>
  )}
</LocalStorageLoader>`}
              language="tsx"
              readOnly={true}
              height={300}
            />

            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-lg mt-8">
              <Heading level={3} className="text-xl font-bold mb-2 text-orange-200">
                Why This Is Powerful:
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Abstraction:</strong> UI doesn't care if data comes from API, LocalStorage, or Context</li>
                <li><strong>Swappable:</strong> Change data source without touching UI components</li>
                <li><strong>Testable:</strong> Easy to mock different data sources in tests</li>
                <li><strong>Consistent:</strong> Same pattern works for all data sources</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Why This Makes You Senior */}
      <section id="senior-benefits" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-gradient-to-br !from-purple-500/15 !to-blue-500/15 !border-purple-500/30">
          <Stack direction="col" gap="md">
            <div>
              <div className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full mb-4">
                Senior Level
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                🏆 Why This Makes You a Senior Dev
              </Heading>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <Heading level={3} className="text-xl font-bold mb-3 text-purple-200">
                  1. Decoupling
                </Heading>
                <Text className="text-zinc-300">
                  If the backend API changes from REST to GraphQL, you only update the <code className="text-purple-400">DataSource</code>. 
                  You don't touch the <code className="text-purple-400">UserInfo</code> UI.
                </Text>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <Heading level={3} className="text-xl font-bold mb-3 text-blue-200">
                  2. Reusability
                </Heading>
                <Text className="text-zinc-300">
                  You wrote the "Loading..." logic once. You don't need to write <code className="text-blue-400">if (!user) return &lt;Spinner /&gt;</code> 
                  in 50 different components.
                </Text>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <Heading level={3} className="text-xl font-bold mb-3 text-green-200">
                  3. Testing
                </Heading>
                <Text className="text-zinc-300">
                  You can test <code className="text-green-400">UserInfo</code> by just passing <code className="text-green-400">{'{ name: "Test" }'}</code>. 
                  You don't need to mock <code className="text-green-400">fetch</code> or set up a fake server just to test if the name renders bold.
                </Text>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/3 rounded-lg border border-white/10">
              <Text className="text-zinc-200 text-lg font-medium">
                This pattern scales with your application. As you add more features, you reuse the same patterns instead of 
                writing new logic for each component. That's the mark of senior-level architecture.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Summary */}
      <section id="summary" className="mb-20 scroll-mt-24">
        <Card variant="elevated" className="p-10 !bg-gradient-to-br !from-purple-500/15 !to-blue-500/15 !border-purple-500/30">
          <Stack direction="col" gap="md">
            <Heading level={2} className="text-3xl font-bold mb-3 text-white">
              Key Takeaways
            </Heading>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Heading level={3} className="text-xl font-bold mb-3 text-purple-200">
                  When to Use This Pattern
                </Heading>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>When you have data fetching logic that's repeated across components</li>
                  <li>When you want to separate business logic from presentation</li>
                  <li>When you need flexible, reusable data sources</li>
                  <li>When building large-scale applications that need to scale</li>
                </ul>
              </div>
              <div>
                <Heading level={3} className="text-xl font-bold mb-3 text-blue-200">
                  Best Practices
                </Heading>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>Keep containers focused on data/logic only</li>
                  <li>Keep presentational components pure (no side effects)</li>
                  <li>Use TypeScript for better type safety with render props</li>
                  <li>Handle loading and error states in the container</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-6 bg-white/3 rounded-lg border border-white/10">
              <Text className="text-zinc-200 text-lg font-medium">
                Remember: The Container/Presentational Pattern with Render Props is your secret weapon for building 
                scalable React applications. It separates concerns, promotes reusability, and makes your codebase maintainable as it grows.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Navigation */}
      <div className={styles.navigation}>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="flex flex-col items-start">
              <span className="text-xs opacity-70 font-normal">Previous</span>
              <span className="font-semibold">Back to Blog</span>
            </span>
          </span>
        </ButtonLink>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
          <span className="flex items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="text-xs opacity-70 font-normal">Next</span>
              <span className="font-semibold">More Articles</span>
            </span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </ButtonLink>
      </div>
    </BlogContentLayout>
  );
}

