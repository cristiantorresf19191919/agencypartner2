"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function TypeScriptAdvancedPage() {
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
          <li className={styles.breadcrumbCurrent}>Advanced TypeScript</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Advanced TypeScript Patterns for React
        </Heading>
        <Text className={styles.subtitle}>
          Master advanced TypeScript patterns that make your React code type-safe, maintainable, and scalable. Learn generic components, utility types, discriminated unions, type inference, and advanced patterns used by senior engineers.
        </Text>
      </div>

      {/* Generic Components */}
      <section id="generic-components" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Generic Components
              </Heading>
              <Text className={styles.sectionDescription}>
                Create reusable components that work with any data type while maintaining type safety.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Generic List Component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({ 
  items, 
  renderItem, 
  keyExtractor,
  emptyMessage = "No items" 
}: ListProps<T>) {
  if (items.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage with different types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

function UserList({ users }: { users: User[] }) {
  return (
    <List
      items={users}
      keyExtractor={user => user.id}
      renderItem={user => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
    />
  );
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <List
      items={products}
      keyExtractor={product => product.id}
      renderItem={product => (
        <div>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      )}
    />
  );
}

// ✅ Generic Form Component
interface FormField<T> {
  name: keyof T;
  label: string;
  type?: 'text' | 'email' | 'number';
  required?: boolean;
}

interface FormProps<T extends Record<string, any>> {
  fields: FormField<T>[];
  initialValues: T;
  onSubmit: (values: T) => void;
}

function Form<T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={String(field.name)}>
          <label>
            {field.label}
            {field.required && <span>*</span>}
          </label>
          <input
            type={field.type || 'text'}
            value={String(values[field.name] || '')}
            onChange={e => setValues({
              ...values,
              [field.name]: e.target.value
            })}
            required={field.required}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Utility Types & Mapped Types */}
      <section id="utility-types" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Utility Types & Mapped Types
              </Heading>
              <Text className={styles.sectionDescription}>
                Leverage TypeScript's built-in utility types and create custom mapped types for powerful type transformations.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Built-in Utility Types
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Partial - all properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; ... }

// Required - all properties required
type RequiredUser = Required<PartialUser>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string; }

// Omit - exclude specific properties
type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; age: number; isActive: boolean; }

// Record - create object type
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest' }

// ✅ Custom Utility Types
// Make all properties nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Make all properties readonly
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P];
};

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// ✅ Mapped Types for Component Props
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// Usage
function MyComponent({ name, age }: { name: string; age: number }) {
  return <div>{name} is {age}</div>;
}

type MyComponentProps = ComponentProps<typeof MyComponent>;
// { name: string; age: number; }

// ✅ Conditional Types
type NonNullable<T> = T extends null | undefined ? never : T;

type ArrayElement<T> = T extends (infer U)[] ? U : never;

type PromiseType<T> = T extends Promise<infer U> ? U : never;

// ✅ Template Literal Types
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<'click'>; // 'onClick'
type ChangeEvent = EventName<'change'>; // 'onChange'

// ✅ Branded Types (Nominal Typing)
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

// TypeScript prevents mixing them
const userId = createUserId('123');
const productId = createProductId('456');
// userId === productId // Type error!`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Discriminated Unions */}
      <section id="discriminated-unions" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Discriminated Unions
              </Heading>
              <Text className={styles.sectionDescription}>
                Use discriminated unions for type-safe state machines, API responses, and component variants.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ API Response Pattern
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function useApi<T>(url: string): ApiResponse<T> {
  const [response, setResponse] = useState<ApiResponse<T>>({ status: 'loading' });

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setResponse({ status: 'success', data }))
      .catch(error => setResponse({ status: 'error', error: error.message }));
  }, [url]);

  return response;
}

// Usage - TypeScript knows the shape based on status
function UserProfile({ userId }: { userId: string }) {
  const response = useApi<User>(`/api/users/${userId}`);

  if (response.status === 'loading') {
    return <Spinner />;
  }

  if (response.status === 'error') {
    return <Error message={response.error} />;
  }

  // TypeScript knows response.data exists here
  return <div>{response.data.name}</div>;
}

// ✅ Component Variants
type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps =
  | { variant: 'primary'; icon?: React.ReactNode }
  | { variant: 'secondary'; outline?: boolean }
  | { variant: 'danger'; confirm?: boolean };

function Button(props: ButtonProps & { children: React.ReactNode }) {
  switch (props.variant) {
    case 'primary':
      return (
        <button className="btn-primary">
          {props.icon}
          {props.children}
        </button>
      );
    case 'secondary':
      return (
        <button className={props.outline ? 'btn-outline' : 'btn-secondary'}>
          {props.children}
        </button>
      );
    case 'danger':
      return (
        <button 
          className="btn-danger"
          onClick={props.confirm ? handleConfirm : undefined}
        >
          {props.children}
        </button>
      );
  }
}

// ✅ State Machine Pattern
type AsyncState<T> =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: Error };

function useAsyncState<T>() {
  const [state, setState] = useState<AsyncState<T>>({ type: 'idle' });

  const execute = useCallback(async (fn: () => Promise<T>) => {
    setState({ type: 'loading' });
    try {
      const data = await fn();
      setState({ type: 'success', data });
    } catch (error) {
      setState({ type: 'error', error: error as Error });
    }
  }, []);

  return { state, execute };
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Advanced Hooks Typing */}
      <section id="hooks-typing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Advanced Hooks Typing
              </Heading>
              <Text className={styles.sectionDescription}>
                Type custom hooks properly, handle overloads, and create type-safe hook factories.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Typed Custom Hook
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ✅ Hook with Overloads
function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function useFetch<T>(url: string, options: { immediate: false }): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
};

function useFetch<T>(
  url: string,
  options?: { immediate?: boolean }
): any {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options?.immediate !== false) {
      execute();
    }
  }, [execute, options?.immediate]);

  return options?.immediate === false
    ? { data, loading, error, execute }
    : { data, loading, error };
}

// ✅ Type-safe Hook Factory
function createUseApi<TData, TError = Error>(
  endpoint: string
) {
  return function useApi() {
    const [data, setData] = useState<TData | null>(null);
    const [error, setError] = useState<TError | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
      setLoading(true);
      try {
        const response = await fetch(endpoint);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as TError);
      } finally {
        setLoading(false);
      }
    }, [endpoint]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    return { data, error, loading, refetch: fetchData };
  };
}

// Usage
interface User {
  id: string;
  name: string;
}

const useUser = createUseApi<User>('/api/user');
// useUser returns { data: User | null, error: Error | null, ... }`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Type Guards & Assertions */}
      <section id="type-guards" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Type Guards & Assertions
              </Heading>
              <Text className={styles.sectionDescription}>
                Create type guards to narrow types safely and assert types when you know more than TypeScript.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Type Guards
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof (value as any).id === 'string' &&
    typeof (value as any).name === 'string'
  );
}

// Usage
function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  }

  if (isUser(value)) {
    // TypeScript knows value is User here
    console.log(value.name);
  }
}

// ✅ Discriminated Union Type Guard
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function isSuccess<T>(result: Result<T>): result is { success: true; data: T } {
  return result.success === true;
}

function handleResult<T>(result: Result<T>) {
  if (isSuccess(result)) {
    // TypeScript knows result.data exists
    console.log(result.data);
  } else {
    // TypeScript knows result.error exists
    console.error(result.error);
  }
}

// ✅ Assertion Functions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Expected string');
  }
}

function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Expected User');
  }
}

// Usage
function processUser(data: unknown) {
  assertIsUser(data);
  // TypeScript knows data is User after assertion
  console.log(data.name);
}

// ✅ Custom Error with Type Guard
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function handleError(error: unknown) {
  if (isValidationError(error)) {
    console.error(\`Validation failed for \${error.field}: \${error.message}\`);
  } else {
    console.error('Unknown error:', error);
  }
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

