"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function TestingStrategiesPage() {
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
          <li className={styles.breadcrumbCurrent}>Testing Strategies</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Testing Strategies & Patterns
        </Heading>
        <Text className={styles.subtitle}>
          Comprehensive testing guide for senior React developers. Learn production-grade testing patterns with React Testing Library, Jest, Vitest, and Playwright. Master testing hooks, context, async operations, and accessibility.
        </Text>
      </div>

      {/* React Testing Library Best Practices */}
      <section id="rtl-best-practices" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🧪"} 1. React Testing Library Best Practices
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Stop testing implementation details — test what your USERS see and do! 👆 The junior dev tests state variables and CSS classes. The senior dev tests button clicks and screen content. Level up your testing game by thinking like a user, not like a compiler! 🎮"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"Testing the right way means tests that survive refactors — fragile tests are worse than no tests at all"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Semantic Queries • User Event Simulation • Accessible Testing Patterns • Anti-Patterns to Avoid
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Testing Philosophy:</strong> React Testing Library encourages testing from the user{"'"}s perspective. Query by role, label, text, and other accessible attributes. Avoid testing implementation details like state variables or internal methods.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Testing implementation details
import { render, screen } from '@testing-library/react';
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button data-testid="increment" onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <span data-testid="count">{count}</span>
    </div>
  );
};

// Bad: Testing internal state
test('counter state updates', () => {
  const { container } = render(<Counter />);
  const button = container.querySelector('[data-testid="increment"]');
  button?.click();
  // Testing implementation, not user behavior
  expect(container.querySelector('[data-testid="count"]')?.textContent).toBe('1');
});`}
              good={`// ✅ CORRECT: Testing user behavior
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <span aria-label="count">{count}</span>
    </div>
  );
};

// Good: Testing what user sees and does
test('increments counter when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  // Query by accessible role/label
  const button = screen.getByRole('button', { name: /increment/i });
  const countDisplay = screen.getByLabelText('count');
  
  expect(countDisplay).toHaveTextContent('0');
  
  // Simulate user interaction
  await user.click(button);
  
  expect(countDisplay).toHaveTextContent('1');
});`}
            />
          </Stack>
        </Card>
      </section>

      {/* Testing Custom Hooks */}
      <section id="testing-hooks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🪝"} 2. Testing Custom Hooks
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Hooks are tricky little creatures — they can't live outside components! 🐛 But with renderHook, you can test them in isolation like a proper scientist in a lab. Master fake timers, rerender triggers, and async hook testing to bulletproof your custom logic! 💪"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Custom hooks are the backbone of reusable logic — testing them properly prevents bugs from spreading everywhere"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> renderHook API • Fake Timers • Rerender Testing • Debounce Hook Example
              </Text>
            </div>

            <CodeEditor
              code={`// Custom Hook: useDebounce
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ✅ Testing with renderHook
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });
    
    // Should still be initial (not debounced yet)
    expect(result.current).toBe('initial');

    // Fast-forward time
    jest.advanceTimersByTime(500);

    // Now should be updated
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    rerender({ value: 'second', delay: 500 });
    rerender({ value: 'third', delay: 500 });

    jest.advanceTimersByTime(500);

    // Should only have the last value
    expect(result.current).toBe('third');
  });
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Testing Context & Providers */}
      <section id="testing-context" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🎭"} 3. Testing Context & Providers
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Context is everywhere in React apps, but testing it can feel like untangling Christmas lights! 🎄 Learn the secret sauce: custom render functions that wrap your components with the right providers. Once you nail this pattern, testing contextified components becomes a breeze! 🌬️"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> — {"A reusable test render wrapper saves you from writing provider boilerplate in every single test file"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Custom Render Functions • Provider Wrappers • Mock Context Values • Theme Toggle Testing
              </Text>
            </div>

            <CodeEditor
              code={`// Theme Context
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Component using context
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} aria-label={\`Switch to \${theme === 'light' ? 'dark' : 'light'} theme\`}>
      Current: {theme}
    </button>
  );
}

// ✅ Testing with custom render
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, ThemeToggle } from './Theme';

// Custom render function
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

test('toggles theme', async () => {
  const user = userEvent.setup();
  renderWithTheme(<ThemeToggle />);

  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('Current: light');

  await user.click(button);
  expect(button).toHaveTextContent('Current: dark');
});

// ✅ Testing with custom provider values
function renderWithCustomTheme(ui: React.ReactElement, theme: Theme = 'light') {
  const Wrapper = ({ children }: { children: React.ReactElement }) => (
    <ThemeContext.Provider value={{ theme, toggleTheme: jest.fn() }}>
      {children}
    </ThemeContext.Provider>
  );

  return render(ui, { wrapper: Wrapper });
}

test('renders with custom theme', () => {
  renderWithCustomTheme(<ThemeToggle />, 'dark');
  expect(screen.getByRole('button')).toHaveTextContent('Current: dark');
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Mocking Strategies */}
      <section id="mocking-strategies" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🎪"} 4. Mocking Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Mocking is an art form! 🎨 From intercepting network requests with MSW to jest.fn() wizardry, this section covers every trick in the mocking playbook. Stop hitting real APIs in tests and start controlling your test environment like a puppeteer! 🧵"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Proper mocking makes tests fast, reliable, and deterministic — no more flaky tests ruining your CI pipeline"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> MSW (Mock Service Worker) • Module Mocks • Function Mocks • Window API Mocking • Partial Mocks
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Mocking API calls with MSW (Mock Service Worker)
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

// Setup MSW server
const server = setupServer(
  rest.get('/api/user/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays user profile', async () => {
  render(<UserProfile userId="123" />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// ✅ Mocking modules
// utils/api.ts
export const fetchUser = async (id: string) => {
  const response = await fetch(\`/api/user/\${id}\`);
  return response.json();
};

// Component
import { fetchUser } from './utils/api';

// Test file
jest.mock('./utils/api');

import { fetchUser } from './utils/api';
const mockFetchUser = fetchUser as jest.MockedFunction<typeof fetchUser>;

test('handles API error', async () => {
  mockFetchUser.mockRejectedValueOnce(new Error('Network error'));
  
  render(<UserProfile userId="123" />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});

// ✅ Mocking window methods
test('handles geolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn((success) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      });
    }),
  };

  global.navigator.geolocation = mockGeolocation as any;
  
  render(<LocationComponent />);
  // Test location-based behavior
});

// ✅ Partial mocks
jest.mock('./api', () => ({
  ...jest.requireActual('./api'),
  fetchUser: jest.fn(),
}));`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Integration Testing */}
      <section id="integration-testing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🔗"} 5. Integration Testing Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Unit tests check the bricks, but integration tests check the building! 🏗️ Test real user flows — filling forms, clicking buttons, waiting for data. When components work together in tests, they'll work together in production. It's like a dress rehearsal before opening night! 🎬"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"Integration tests catch the bugs that unit tests miss — they test the REAL user experience end to end"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Complete User Flows • Provider Wrappers • Search & Filter Testing • Login Flow Testing
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Integration test: Complete user flow
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './LoginForm';
import { Dashboard } from './Dashboard';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

test('complete login flow', async () => {
  const user = userEvent.setup();
  
  renderWithProviders(<LoginForm />);

  // Fill form
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  await user.type(emailInput, 'user@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  // Wait for navigation/state change
  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  // Verify dashboard renders
  expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
});

// ✅ Testing component interactions
test('search and filter integration', async () => {
  const user = userEvent.setup();
  renderWithProviders(<ProductList />);

  // Search
  const searchInput = screen.getByPlaceholderText(/search/i);
  await user.type(searchInput, 'laptop');

  // Apply filter
  const filterButton = screen.getByRole('button', { name: /filter/i });
  await user.click(filterButton);
  
  const categoryCheckbox = screen.getByLabelText('Electronics');
  await user.click(categoryCheckbox);

  // Verify results
  await waitFor(() => {
    const results = screen.getAllByTestId('product-item');
    expect(results).toHaveLength(5);
    results.forEach(item => {
      expect(item).toHaveTextContent(/laptop/i);
    });
  });
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* E2E Testing with Playwright */}
      <section id="e2e-testing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🎭"} 6. E2E Testing with Playwright
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Playwright is the final boss of testing! 🎮 It launches real browsers, clicks real buttons, and tests your ENTIRE app from start to finish. Login flows, checkout processes, visual regressions — if a user can break it, Playwright can catch it. Cross-browser testing? It's got Chrome, Firefox, AND Safari covered! 🌐"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"E2E tests are your last line of defense — they catch the bugs that slip through unit and integration tests"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Playwright Setup • Auth Flows • Checkout Testing • Visual Regression • Cross-Browser
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Playwright E2E Test
import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('user can login and access dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');

    // Fill login form
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL('**/dashboard');

    // Verify dashboard content
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('user can complete checkout flow', async ({ page }) => {
    await page.goto('http://localhost:3000/products');

    // Add product to cart
    await page.click('[data-testid="product-1"] button');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await page.waitForURL('**/cart');

    // Proceed to checkout
    await page.click('button:has-text("Checkout")');
    await page.waitForURL('**/checkout');

    // Fill shipping info
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'New York');
    await page.selectOption('[name="country"]', 'US');

    // Complete order
    await page.click('button:has-text("Place Order")');
    
    // Verify success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
  });
});

// ✅ Visual regression testing
test('dashboard visual regression', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('dashboard.png');
});

// ✅ Testing across browsers
test.describe('Cross-browser testing', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(\`works on \${browserName}\`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      await page.goto('http://localhost:3000');
      await expect(page.locator('h1')).toBeVisible();
      
      await context.close();
    });
  });
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Accessibility Testing */}
      <section id="accessibility-testing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"♿"} 7. Accessibility Testing
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Building for everyone isn't optional — it's a superpower! 💪 Accessibility testing ensures your app works for keyboard users, screen reader users, and everyone in between. jest-axe catches violations automatically, and you'll learn to test focus traps, ARIA attributes, and keyboard navigation like a pro! 🌟"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Accessible apps serve ALL users — and automated a11y tests catch issues before they reach production"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> jest-axe Setup • Keyboard Navigation • ARIA Attributes • Focus Management Testing
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Accessibility testing with jest-axe
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

test('button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// ✅ Testing keyboard navigation
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('modal can be closed with Escape key', async () => {
  const user = userEvent.setup();
  render(<Modal isOpen={true} onClose={jest.fn()} />);

  const modal = screen.getByRole('dialog');
  expect(modal).toBeVisible();

  await user.keyboard('{Escape}');
  expect(modal).not.toBeVisible();
});

// ✅ Testing ARIA attributes
test('accordion has correct ARIA attributes', () => {
  render(<Accordion />);

  const button = screen.getByRole('button', { expanded: false });
  expect(button).toHaveAttribute('aria-controls');
  expect(button).toHaveAttribute('aria-expanded', 'false');

  // After clicking
  userEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});

// ✅ Testing focus management
test('focus is trapped in modal', async () => {
  const user = userEvent.setup();
  render(<Modal isOpen={true} />);

  const firstFocusable = screen.getByRole('button', { name: /close/i });
  const lastFocusable = screen.getByRole('button', { name: /submit/i });

  // Tab should cycle through focusable elements
  await user.tab();
  expect(firstFocusable).toHaveFocus();

  await user.tab();
  // Should not escape modal
  expect(document.body).not.toHaveFocus();
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* TDD Example */}
      <section id="tdd" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🔴"} 8. Test-Driven Development (TDD)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Red. Green. Refactor. Repeat! 🔄 TDD flips development on its head — write the test FIRST, watch it fail (red), make it pass (green), then clean it up (refactor). It feels weird at first, but once you get the flow, you'll write better code faster and with way more confidence! 🎯"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> — {"TDD produces better-designed code with built-in test coverage — it's a discipline that pays dividends over time"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Red-Green-Refactor Cycle • useLocalStorage TDD Example • Step-by-Step Implementation
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ TDD Example: Building a useLocalStorage hook

// Step 1: RED - Write failing test
describe('useLocalStorage', () => {
  it('should return initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should save and retrieve value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe('"new-value"');
  });
});

// Step 2: GREEN - Write minimal implementation
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
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

  return [storedValue, setValue] as const;
}

// Step 3: REFACTOR - Improve implementation
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
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
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(\`Error saving to localStorage: \${error}\`);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
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

