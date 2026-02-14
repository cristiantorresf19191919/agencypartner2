"use client";

import { Stack, Heading, Text, ButtonLink, CodeEditor, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function AdvancedPatternsPage() {
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
          <li className={styles.breadcrumbCurrent}>Advanced Patterns</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Advanced React Patterns: Design System Foundations
        </Heading>
        <Text className={styles.subtitle}>
          These concepts—<strong>Render Props</strong>, <strong>Wrapper Components</strong>, and <strong>Polymorphic Components</strong>—are the building blocks of <strong>Design Systems</strong> and <strong>Headless UI</strong> libraries. If you work on a team building a reusable component library, these are mandatory skills.
        </Text>
      </div>

      {/* Module 1: Render Props */}
      <section id="render-props" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🎭"} Module 1: Render Props (The "Headless" Pattern)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Ready to unlock ultimate component flexibility? 🔓 Render Props let YOU decide what gets rendered while the component handles all the messy logic. It's like hiring a chef who preps all the ingredients but lets you plate the dish however you want. This is the secret sauce behind Radix UI, React Aria, and every serious headless library!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Render Props are the backbone of headless UI libraries — master this and you can build anything! 🏗️"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Inversion of Control • SortableList Pattern • Toggle Component • Children as Function
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// A Sortable List that handles complex logic but lets YOU draw the rows
type SortableListProps<T> = {
  items: T[];
  // 🔑 The Render Prop: We give you the item, you give us JSX.
  renderItem: (item: T) => React.ReactNode; 
};

// This component handles logic (mapping) but enforces ZERO style.
export const SortableList = <T extends { id: string | number }>({ 
  items, 
  renderItem 
}: SortableListProps<T>) => {
  return (
    <ul className="divide-y divide-gray-200">
      {items.map((item) => (
        <li key={item.id} className="p-4 hover:bg-gray-50">
          {/* We invoke the render prop here */}
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
};

// Usage Example 1: Users List
type User = { id: string; name: string; role: string };

const UsersList = ({ users }: { users: User[] }) => {
  return (
    <SortableList 
      items={users} 
      renderItem={(user) => (
        <div className="flex justify-between">
          <b>{user.name}</b>
          <span className="text-gray-500">{user.role}</span>
        </div>
      )} 
    />
  );
};

// Usage Example 2: Products List (Same component, different rendering!)
type Product = { id: number; name: string; price: number };

const ProductsList = ({ products }: { products: Product[] }) => {
  return (
    <SortableList 
      items={products} 
      renderItem={(product) => (
        <div className="flex items-center gap-4">
          <img src={product.image} alt={product.name} className="w-12 h-12" />
          <div className="flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">\${product.price}</p>
          </div>
        </div>
      )} 
    />
  );
};

// Advanced: Render Props with State
type ToggleProps = {
  children: (props: { isOn: boolean; toggle: () => void }) => React.ReactNode;
};

export const Toggle = ({ children }: ToggleProps) => {
  const [isOn, setIsOn] = React.useState(false);
  const toggle = () => setIsOn(prev => !prev);

  return <>{children({ isOn, toggle })}</>;
};

// Usage: Complete control over rendering
<Toggle>
  {({ isOn, toggle }) => (
    <button onClick={toggle} className={isOn ? 'bg-green-500' : 'bg-gray-300'}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>`}
              readOnly={true}
              height={600}
            />
          </Stack>
        </Card>
      </section>

      {/* Module 2: Wrapper Components */}
      <section id="wrapper-components" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🛡️"} Module 2: Wrapper Components (The "Guard" Pattern)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Stop copy-pasting if (isAdmin) checks everywhere! 🛑 Wrapper Components are your app's bouncers — they decide who gets in and what gets shown. Stack them like building blocks: AuthGuard > FeatureGuard > Layout > Page. Clean, composable, and SO satisfying to use."}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Wrapper components prevent security holes and eliminate hundreds of lines of repetitive conditional logic! 🔐"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> FeatureGuard Pattern • AuthGuard Pattern • Composable Wrappers • Error Boundary Wrapper
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// A Feature Guard Wrapper that handles permissions, loading, and redirects
type FeatureGuardProps = {
  featureFlag: string;
  fallback?: React.ReactNode; // What to show if access denied
  children: React.ReactNode;
};

export const FeatureGuard = ({ 
  featureFlag, 
  fallback = <AccessDenied />, 
  children 
}: FeatureGuardProps) => {
  const { user, isLoading } = useUser();
  const { flags } = useFeatureFlags();

  if (isLoading) return <FullPageSpinner />;

  // 1. Check if the feature is enabled globally
  if (!flags[featureFlag]) return null;

  // 2. Check if user has permission
  if (!user?.permissions.includes(featureFlag)) {
    return <>{fallback}</>;
  }

  // 3. If all checks pass, render the protected content
  return <>{children}</>;
};

// Usage: This entire section is protected. No 'if' statements needed inside Dashboard.
<FeatureGuard featureFlag="beta_dashboard">
  <NewBetaDashboard />
</FeatureGuard>

// Advanced: Composable Wrappers
type AuthGuardProps = {
  requiredRole?: string;
  redirectTo?: string;
  children: React.ReactNode;
};

export const AuthGuard = ({ 
  requiredRole, 
  redirectTo = '/login',
  children 
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return null;

  if (requiredRole && user.role !== requiredRole) {
    return <AccessDenied message="You don't have the required role" />;
  }

  return <>{children}</>;
};

// Usage: Stack multiple wrappers for complex requirements
<AuthGuard requiredRole="admin">
  <FeatureGuard featureFlag="advanced_analytics">
    <Layout>
      <AdvancedAnalyticsDashboard />
    </Layout>
  </FeatureGuard>
</AuthGuard>

// Another Example: Error Boundary Wrapper
type ErrorBoundaryWrapperProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export const ErrorBoundaryWrapper = ({ 
  fallback = <ErrorFallback />,
  children 
}: ErrorBoundaryWrapperProps) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};`}
              readOnly={true}
              height={650}
            />
          </Stack>
        </Card>
      </section>

      {/* Module 3: Polymorphic Components */}
      <section id="polymorphic-components" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🦎"} Module 3: Polymorphic Components (The "Design System" Pattern)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Shapeshifting components! 🦸 Imagine a Button that can be a <button>, an <a>, or even a <div> — all with the same styles and full TypeScript support. The 'as' prop pattern is how Material UI, Chakra, and Mantine build their magic. Once you learn this, you'll see it EVERYWHERE."}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"This is THE pattern behind every major design system — learn it to build truly reusable component libraries! 📚"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> {"The 'as' Prop"} • ComponentPropsWithoutRef • Polymorphic Text • Polymorphic Button • Polymorphic Card
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { ComponentPropsWithoutRef, ElementType } from "react";

// 1. Define props, allowing an 'as' prop (defaulting to 'span')
type TextProps<T extends ElementType> = {
  as?: T;
  variant?: 'h1' | 'body' | 'caption';
  children: React.ReactNode;
} & ComponentPropsWithoutRef<T>; // 🔑 Inherit valid props for that tag (e.g., href for <a>)

export const Text = <T extends ElementType = 'span'>({ 
  as, 
  variant = 'body', 
  children, 
  ...props 
}: TextProps<T>) => {
  // If 'as' is not provided, default to 'span'
  const Component = as || 'span';

  // Dynamic Tailwind classes based on variant
  const styles = {
    h1: "text-4xl font-bold tracking-tight",
    body: "text-base text-gray-700",
    caption: "text-xs text-gray-500 uppercase"
  };

  return (
    <Component className={styles[variant]} {...props}>
      {children}
    </Component>
  );
};

// Usage Examples:

// 1. Renders as an <h1>
<Text as="h1" variant="h1">Page Title</Text>

// 2. Renders as a <p>
<Text as="p" variant="body">Some description...</Text>

// 3. Renders as an <label> (TS knows 'htmlFor' is valid here!)
<Text as="label" htmlFor="email" variant="caption">Email Address</Text>

// Advanced: Polymorphic Button Component
type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
} & ComponentPropsWithoutRef<T>;

export const Button = <T extends ElementType = 'button'>({ 
  as, 
  variant = 'primary', 
  size = 'md',
  children, 
  ...props 
}: ButtonProps<T>) => {
  const Component = as || 'button';

  const baseStyles = "font-semibold rounded-lg transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <Component 
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]}\`}
      {...props}
    >
      {children}
    </Component>
  );
};

// Usage: Same component, different HTML elements

// As a button
<Button onClick={() => console.log('clicked')}>Click Me</Button>

// As a link (TypeScript knows 'href' is valid!)
<Button as="a" href="/dashboard">Go to Dashboard</Button>

// As a div (for custom click handlers)
<Button as="div" role="button" tabIndex={0}>Custom Element</Button>

// Advanced: Polymorphic Card Component
type CardProps<T extends ElementType> = {
  as?: T;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<T>;

export const Card = <T extends ElementType = 'div'>({ 
  as, 
  children, 
  ...props 
}: CardProps<T>) => {
  const Component = as || 'div';
  
  return (
    <Component 
      className="bg-white rounded-lg shadow-md p-6"
      {...props}
    >
      {children}
    </Component>
  );
};

// Usage:
// As a div
<Card>Regular card content</Card>

// As an article (semantic HTML)
<Card as="article">
  <h2>Article Title</h2>
  <p>Article content...</p>
</Card>

// As a link (clickable card)
<Card as="a" href="/post/123">
  <h3>Post Title</h3>
  <p>Post excerpt...</p>
</Card>`}
              readOnly={true}
              height={700}
            />
          </Stack>
        </Card>
      </section>

      {/* Summary Section */}
      <section id="summary" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🏆"} Summary of Senior Practices Used
            </Heading>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟢"} <strong>Impact: LOW</strong> — {"A handy recap of the power moves you just learned — bookmark this for your next code review! 📖"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Generics Recap • Composition Patterns • Prop Spreading • Inversion of Control
              </Text>
            </div>
            <div className="space-y-4">
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>1. Generics (`&lt;T&gt;`):</strong> Used in Render Props and Polymorphic components to ensure type safety, no matter what data or tag is passed. This allows components to be truly reusable while maintaining full TypeScript support.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>2. Composition:</strong> Used in Wrapper Components to separate "Access Logic" from "UI Logic". This pattern enables building complex permission systems and feature flags without cluttering your components with conditional logic.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>3. Prop Spreading (`...props`):</strong> Used in Polymorphic components to pass native attributes (like <code>onClick</code> or <code>href</code>) down to the underlying DOM node without manually defining them. This ensures full compatibility with native HTML element props.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>4. Inversion of Control:</strong> Render Props pattern gives consumers complete control over rendering while the component handles the logic. This is the foundation of headless UI libraries.
                </Text>
              </div>
            </div>
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

