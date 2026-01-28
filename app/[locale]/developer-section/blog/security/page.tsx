"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor , FullscreenSection } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function SecurityPage() {
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
          <li className={styles.breadcrumbCurrent}>Security</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          React Security Best Practices
        </Heading>
        <Text className={styles.subtitle}>
          Secure your React applications: XSS prevention, CSRF protection, authentication patterns, authorization strategies, secure data handling, Content Security Policy, and security auditing. Learn production-grade security practices.
        </Text>
      </div>

      {/* XSS Prevention */}
      <FullscreenSection id="xss-prevention" title="Xss Prevention" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. XSS Prevention
              </Heading>
              <Text className={styles.sectionDescription}>
                Prevent Cross-Site Scripting attacks by properly sanitizing user input and using React's built-in protections.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Dangerous innerHTML
function UserComment({ comment }: { comment: string }) {
  // DANGEROUS: Allows XSS attacks
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
}

// ❌ WRONG: Unsanitized user input
function SearchResults({ query }: { query: string }) {
  return <div>Results for: {query}</div>; // If query contains <script>
}`}
              good={`// ✅ CORRECT: React auto-escapes by default
function UserComment({ comment }: { comment: string }) {
  // Safe: React escapes HTML automatically
  return <div>{comment}</div>;
}

// ✅ CORRECT: Sanitize if you need HTML
import DOMPurify from 'dompurify';

function RichComment({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ✅ CORRECT: Use libraries for rich text
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function MarkdownContent({ markdown }: { markdown: string }) {
  const html = marked(markdown);
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ✅ CORRECT: Validate and sanitize URLs
function SafeLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  if (!isValidUrl(href)) {
    return <span>{children}</span>;
  }

  return (
    <a 
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}`}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* CSRF Protection */}
      <FullscreenSection id="csrf-protection" title="Csrf Protection" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. CSRF Protection
              </Heading>
              <Text className={styles.sectionDescription}>
                Protect against Cross-Site Request Forgery attacks using tokens and SameSite cookies.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ CSRF Token Implementation
async function getCsrfToken(): Promise<string> {
  const response = await fetch('/api/csrf-token', {
    credentials: 'include'
  });
  const { token } = await response.json();
  return token;
}

async function secureApiCall(data: any) {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  return response.json();
}

// ✅ Custom hook for CSRF
function useCsrfToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getCsrfToken().then(setToken);
  }, []);

  return token;
}

// ✅ Secure fetch wrapper
function useSecureFetch() {
  const csrfToken = useCsrfToken();

  const secureFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': csrfToken
      },
      credentials: 'include'
    });
  }, [csrfToken]);

  return secureFetch;
}

// ✅ Next.js API Route (Server-side)
// pages/api/csrf-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = uuidv4();
    // Store in httpOnly cookie
    res.setHeader(
      'Set-Cookie',
      \`csrf-token=\${token}; HttpOnly; SameSite=Strict; Secure; Path=/\`
    );
    res.json({ token });
  }
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Authentication Patterns */}
      <FullscreenSection id="authentication" title="Authentication" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Authentication Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Secure authentication with JWT, httpOnly cookies, and proper token management.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Secure authentication context
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Include httpOnly cookies
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const userData = await response.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// ✅ Role-based access
function RoleProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Content Security Policy */}
      <FullscreenSection id="csp" title="Csp" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Content Security Policy
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement CSP headers to prevent XSS and other injection attacks.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Next.js CSP Configuration
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Adjust for your needs
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.example.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};

// ✅ Meta tags for CSP
function SecurityMetaTags() {
  return (
    <>
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
    </>
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

