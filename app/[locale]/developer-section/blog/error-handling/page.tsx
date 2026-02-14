"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ErrorHandlingPage() {
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
          <li className={styles.breadcrumbCurrent}>Error Handling</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Error Boundaries & Error Handling Patterns
        </Heading>
        <Text className={styles.subtitle}>
          Master production-grade error handling in React. Learn Error Boundaries, error recovery strategies, error reporting with Sentry/LogRocket, graceful degradation, and how to build resilient applications that handle failures gracefully.
        </Text>
      </div>

      {/* Error Boundary Pattern */}
      <section id="error-boundary" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🛡️"} 1. Error Boundary Pattern
              </Heading>
              <Text className={styles.sectionDescription}>
                {"💥"} One uncaught error and BOOM {"—"} your entire React app goes white screen of death! {"😱"} Error Boundaries are your {"app's"} safety net, catching errors in the component tree and showing a friendly fallback instead of chaos.
                <br /><br />
                {"🔧"} <strong>The fix:</strong> Wrap risky components in class-based Error Boundaries (or use <code>react-error-boundary</code>) and {"you'll"} sleep better at night! {"😴"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> {"—"} Without Error Boundaries, a single bug in one component can nuke your entire application!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Error Boundary class component {"•"} getDerivedStateFromError {"•"} componentDidCatch logging {"•"} Fallback UI patterns
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                {"💡"} <strong>Important:</strong> Error Boundaries only catch errors in:
                <br />{"•"} Component rendering
                <br />{"•"} Lifecycle methods
                <br />{"•"} Constructors
                <br />
                <br />They do NOT catch errors in:
                <br />{"•"} Event handlers
                <br />{"•"} Async code (setTimeout, promises)
                <br />{"•"} Server-side rendering
                <br />{"•"} Errors thrown in the Error Boundary itself
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: No error handling
const UserProfile = ({ userId }: { userId: string }) => {
  const user = getUserById(userId); // Throws if user not found
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

// If getUserById throws, entire app crashes`}
              good={`// ✅ CORRECT: Error Boundary catches errors
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    this.props.onError?.(error, errorInfo);
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    // Send to error reporting service
    errorReportingService.captureException(error, { extra: errorInfo });
  }}
>
  <UserProfile userId={userId} />
</ErrorBoundary>`}
            />
          </Stack>
        </Card>
      </section>

      {/* Modern Error Boundary with Hooks */}
      <section id="error-boundary-hooks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🪝"} 2. Modern Error Boundary (Using react-error-boundary)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"🎉"} Writing class components in 2026? No thanks! The <code>react-error-boundary</code> library gives you all the error-catching goodness with a hooks-friendly API. {"It's"} like Error Boundaries got a modern makeover! {"💅"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> {"—"} The go-to library for error boundaries in modern React {"—"} granular, composable, and hook-compatible!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> react-error-boundary setup {"•"} FallbackComponent pattern {"•"} Granular boundaries {"•"} resetKeys for auto-recovery
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Using react-error-boundary
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong:</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Usage with fallback
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={(error, errorInfo) => {
    // Log to error reporting service
    logErrorToService(error, errorInfo);
  }}
  onReset={() => {
    // Reset app state if needed
    clearAppState();
  }}
>
  <App />
</ErrorBoundary>

// ✅ Granular error boundaries
function App() {
  return (
    <ErrorBoundary FallbackComponent={PageErrorFallback}>
      <Header />
      
      <ErrorBoundary FallbackComponent={SidebarErrorFallback}>
        <Sidebar />
      </ErrorBoundary>
      
      <ErrorBoundary FallbackComponent={ContentErrorFallback}>
        <MainContent />
      </ErrorBoundary>
      
      <Footer />
    </ErrorBoundary>
  );
}

// ✅ Error boundary with retry logic
function UserProfileWithRetry({ userId }: { userId: string }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onResetKeys={[userId]} // Reset when userId changes
      resetKeys={[userId]}
    >
      <UserProfile userId={userId} />
    </ErrorBoundary>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Async Error Handling */}
      <section id="async-error-handling" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🌊"} 3. Async Error Handling
              </Heading>
              <Text className={styles.sectionDescription}>
                {"🚨"} Plot twist: Error Boundaries {"don't"} catch async errors! {"😤"} That <code>useEffect</code> fetch that fails? That event handler that throws? {"They're"} on their own. Time to handle them explicitly with custom hooks and proper try/catch patterns! {"🎣"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> {"—"} Most real-world errors are async {"—"} ignore them and your users see blank screens with zero feedback!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> useAsync custom hook {"•"} Cancellation with cleanup {"•"} Error state management {"•"} Error reporting integration
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Unhandled async errors
const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This error is NOT caught by Error Boundary
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
};`}
              good={`// ✅ CORRECT: Handle async errors
import { useState, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function execute() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await asyncFn();
        
        if (!cancelled) {
          setState({ data, error: null, loading: false });
        }
      } catch (error) {
        if (!cancelled) {
          const err = error instanceof Error ? error : new Error(String(error));
          setState({ data: null, error: err, loading: false });
          
          // Log to error reporting service
          errorReportingService.captureException(err);
        }
      }
    }

    execute();

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}

// Usage
const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, error, loading } = useAsync(
    () => fetchUser(userId),
    [userId]
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
};`}
            />
          </Stack>
        </Card>
      </section>

      {/* Error Reporting */}
      <section id="error-reporting" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"📊"} 4. Error Reporting (Sentry, LogRocket)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"🔍"} An error happened in production and nobody knows about it? {"That's"} the real nightmare! {"👻"} Plug in Sentry or LogRocket and {"you'll"} know about bugs before your users even finish complaining. Track, analyze, and squash those production bugs like a pro! {"🐛🔨"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> {"—"} Flying blind in production without error reporting is a recipe for disaster!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Sentry initialization {"•"} User context & breadcrumbs {"•"} LogRocket session replay {"•"} Error filtering
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Sentry Integration
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Filter out known errors
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof ChunkLoadError) {
        // Ignore chunk load errors (network issues)
        return null;
      }
    }
    return event;
  },
});

// Wrap app with Sentry Error Boundary
import { ErrorBoundary } from '@sentry/react';

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
      showDialog
    >
      <YourApp />
    </ErrorBoundary>
  );
}

// ✅ Manual error reporting
function handleAsyncError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    tags: {
      section: 'user-profile',
    },
    extra: context,
    level: 'error',
  });
}

// ✅ User context
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

// ✅ Breadcrumbs for debugging
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'User navigated to profile',
  level: 'info',
});

// ✅ LogRocket Integration
import LogRocket from 'logrocket';

LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID);

// Identify user
LogRocket.identify(user.id, {
  name: user.name,
  email: user.email,
});

// Capture exceptions
LogRocket.captureException(error, {
  tags: {
    userId: user.id,
    feature: 'checkout',
  },
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Error Recovery Strategies */}
      <section id="error-recovery" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🔄"} 5. Error Recovery Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                {"💪"} Errors will happen {"—"} {"it's"} how you bounce back that matters! Retry with exponential backoff, fall back to cached data, go offline gracefully, and degrade features instead of crashing. Your app should be a phoenix, not a house of cards! {"🏗️🔥"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> {"—"} Resilient apps keep users happy even when things go wrong behind the scenes!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Exponential backoff retry {"•"} Fallback cached data {"•"} Offline mode with localStorage {"•"} Graceful degradation
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Retry logic with exponential backoff
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new Error('Failed to fetch');
}

// ✅ Fallback data
function useUserWithFallback(userId: string) {
  const { data, error, loading } = useAsync(() => fetchUser(userId), [userId]);

  // Fallback to cached data if fetch fails
  const cachedUser = useCachedUser(userId);
  const user = data || cachedUser;

  return { user, error, loading };
}

// ✅ Offline mode
function useOfflineData<T>(fetchFn: () => Promise<T>, cacheKey: string) {
  const [data, setData] = useState<T | null>(() => {
    // Try to load from cache first
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchFn();
        setData(result);
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch (error) {
        // If offline, use cached data
        if (!navigator.onLine && data) {
          console.warn('Using cached data (offline)');
          return;
        }
        throw error;
      }
    }

    fetchData();
  }, []);

  return data;
}

// ✅ Graceful degradation
function FeatureWithFallback() {
  const { data, error } = useAsync(() => fetchFeatureData());

  if (error) {
    // Show simplified version instead of crashing
    return <SimplifiedFeature />;
  }

  return <FullFeature data={data} />;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Error State Management */}
      <section id="error-state-management" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🗄️"} 6. Error State Management
              </Heading>
              <Text className={styles.sectionDescription}>
                {"🎯"} Scattered try/catch blocks everywhere? {"That's"} chaos! {"🌪️"} Centralize your error handling with a dedicated ErrorContext and custom hooks. One place to rule all errors, one place to toast them, one place to report them! {"💍"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> {"—"} Centralized error management keeps your codebase clean and your error UX consistent!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> ErrorContext provider {"•"} useError hook {"•"} Toast notifications {"•"} Global error collection
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Global error context
import { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorContextType {
  errors: Error[];
  addError: (error: Error) => void;
  removeError: (index: number) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<Error[]>([]);

  const addError = (error: Error) => {
    setErrors(prev => [...prev, error]);
    // Also report to error service
    errorReportingService.captureException(error);
  };

  const removeError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
}

// ✅ Error toast notifications
function ErrorNotification() {
  const { errors, removeError } = useError();

  return (
    <div className="error-notifications">
      {errors.map((error, index) => (
        <div key={index} role="alert" className="error-toast">
          <span>{error.message}</span>
          <button onClick={() => removeError(index)}>×</button>
        </div>
      ))}
    </div>
  );
}

// ✅ Usage in components
function MyComponent() {
  const { addError } = useError();

  const handleAction = async () => {
    try {
      await performAction();
    } catch (error) {
      addError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return <button onClick={handleAction}>Perform Action</button>;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* User-Friendly Error Messages */}
      <section id="user-friendly-errors" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"💬"} 7. User-Friendly Error Messages
              </Heading>
              <Text className={styles.sectionDescription}>
                {"😱"} {"\""}TypeError: Cannot read properties of undefined{"\""} {"—"} your users should NEVER see that! Transform scary technical gibberish into friendly, actionable messages. {"\""}Oops, something went wrong. Try refreshing!{"\""} is way better than a raw stack trace! {"🤗"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> {"—"} Friendly error messages turn frustrated users into patient ones who actually retry!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Error message mapping {"•"} HTTP status translation {"•"} Contextual messages {"•"} Technical detail toggles
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Error message mapping
const ERROR_MESSAGES: Record<string, string> = {
  'NETWORK_ERROR': 'Unable to connect. Please check your internet connection.',
  'UNAUTHORIZED': 'Your session has expired. Please log in again.',
  'NOT_FOUND': 'The requested resource could not be found.',
  'RATE_LIMIT': 'Too many requests. Please try again in a moment.',
  'SERVER_ERROR': 'Something went wrong on our end. We\'re working on it!',
  'VALIDATION_ERROR': 'Please check your input and try again.',
};

function getUserFriendlyMessage(error: Error): string {
  // Check for known error codes
  if (error.message in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.message];
  }

  // Check for HTTP status codes
  const statusMatch = error.message.match(/HTTP (\\d+)/);
  if (statusMatch) {
    const status = statusMatch[1];
    switch (status) {
      case '404':
        return ERROR_MESSAGES.NOT_FOUND;
      case '401':
      case '403':
        return ERROR_MESSAGES.UNAUTHORIZED;
      case '429':
        return ERROR_MESSAGES.RATE_LIMIT;
      case '500':
      case '502':
      case '503':
        return ERROR_MESSAGES.SERVER_ERROR;
    }
  }

  // Default message
  return 'Something unexpected happened. Please try again.';
}

// ✅ Error display component
function ErrorDisplay({ error }: { error: Error }) {
  const userMessage = getUserFriendlyMessage(error);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div role="alert" className="error-display">
      <div className="error-message">
        <p>{userMessage}</p>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide' : 'Show'} technical details
        </button>
      </div>
      
      {showDetails && (
        <details className="error-details">
          <summary>Technical Details</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
}

// ✅ Contextual error messages
function getContextualErrorMessage(error: Error, context: string): string {
  const baseMessage = getUserFriendlyMessage(error);

  switch (context) {
    case 'checkout':
      return 'Unable to process your order. Please verify your payment information.';
    case 'profile':
      return 'Unable to load your profile. Please refresh the page.';
    case 'search':
      return 'Search is temporarily unavailable. Please try again later.';
    default:
      return baseMessage;
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

