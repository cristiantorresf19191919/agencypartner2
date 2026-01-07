"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function AccessibilityPage() {
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
          <li className={styles.breadcrumbCurrent}>Accessibility</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Accessibility Patterns & Best Practices
        </Heading>
        <Text className={styles.subtitle}>
          Build accessible React applications following WCAG 2.1 guidelines. Learn ARIA patterns, keyboard navigation, focus management, screen reader optimization, and inclusive design practices that make your apps usable by everyone.
        </Text>
      </div>

      {/* ARIA Patterns */}
      <section id="aria-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. ARIA Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Use ARIA attributes to enhance semantic HTML and provide additional context to assistive technologies.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Missing ARIA attributes
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <button onClick={onClose}>×</button>
      {children}
    </div>
  );
};`}
              good={`// ✅ CORRECT: Proper ARIA attributes
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus modal when opened
      modalRef.current?.focus();
    } else {
      // Restore focus when closed
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
      className="modal"
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>
      </div>
      <div id="modal-description" className="modal-content">
        {children}
      </div>
    </div>
  );
};`}
            />
          </Stack>
        </Card>
      </section>

      {/* Keyboard Navigation */}
      <section id="keyboard-navigation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Keyboard Navigation
              </Heading>
              <Text className={styles.sectionDescription}>
                Ensure all interactive elements are keyboard accessible. Implement proper tab order, keyboard shortcuts, and escape handlers.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Keyboard-accessible dropdown
import { useState, useRef, useEffect } from 'react';

function Dropdown({ options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          onSelect(options[focusedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="dropdown">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
      >
        Select option
      </button>
      
      {isOpen && (
        <ul
          ref={listRef}
          id="dropdown-list"
          role="listbox"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="dropdown-list"
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={index === focusedIndex}
              className={index === focusedIndex ? 'focused' : ''}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ✅ Keyboard shortcuts
function useKeyboardShortcut(
  key: string,
  callback: () => void,
  ctrl = false,
  shift = false
) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key === key &&
        e.ctrlKey === ctrl &&
        e.shiftKey === shift
      ) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, ctrl, shift]);
}

// Usage
function Editor() {
  const handleSave = () => {
    // Save logic
  };

  useKeyboardShortcut('s', handleSave, true); // Ctrl+S

  return <textarea />;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Focus Management */}
      <section id="focus-management" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Focus Management
              </Heading>
              <Text className={styles.sectionDescription}>
                Manage focus properly: trap focus in modals, restore focus after actions, and provide visible focus indicators.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Focus trap for modal
import { useEffect, useRef } from 'react';

function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    firstElement?.focus();
    container.addEventListener('keydown', handleTab);

    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [isActive]);

  return containerRef;
}

// Usage
function Modal({ isOpen, onClose }: ModalProps) {
  const containerRef = useFocusTrap(isOpen);

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  );
}

// ✅ Restore focus
function useRestoreFocus() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    previousFocusRef.current?.focus();
  };

  return { saveFocus, restoreFocus };
}

// ✅ Skip to content link
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: '#000',
        color: '#fff',
        padding: '8px',
        textDecoration: 'none',
        zIndex: 100,
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      Skip to main content
    </a>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Screen Reader Optimization */}
      <section id="screen-reader" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Screen Reader Optimization
              </Heading>
              <Text className={styles.sectionDescription}>
                Use live regions, proper labels, and semantic HTML to provide clear information to screen readers.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Live regions for dynamic content
function Toast({ message, type }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={\`toast toast-\${type}\`}
    >
      {message}
    </div>
  );
}

// ✅ Status updates
function StatusMessage({ status }: { status: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="status-message"
    >
      {status}
    </div>
  );
}

// ✅ Loading states
function LoadingButton({ isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={isLoading}
      aria-disabled={isLoading}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Loading</span>
          <Spinner aria-hidden="true" />
        </>
      ) : (
        children
      )}
    </button>
  );
}

// ✅ Screen reader only text
const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
} as const;

function IconButton({ icon, label, ...props }: IconButtonProps) {
  return (
    <button {...props} aria-label={label}>
      <Icon aria-hidden="true">{icon}</Icon>
      <span style={srOnly}>{label}</span>
    </button>
  );
}

// ✅ Form labels
function FormField({ id, label, error, required, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && (
          <span aria-label="required">*</span>
        )}
      </label>
      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? \`\${id}-error\` : undefined}
        {...props}
      />
      {error && (
        <div id={\`\${id}-error\`} role="alert" className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Semantic HTML */}
      <section id="semantic-html" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Semantic HTML
              </Heading>
              <Text className={styles.sectionDescription}>
                Use proper HTML elements that convey meaning. Avoid div soup and use semantic elements like nav, main, article, section, etc.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Div soup
function App() {
  return (
    <div>
      <div className="header">
        <div className="logo">Logo</div>
        <div className="nav">
          <div onClick={goHome}>Home</div>
          <div onClick={goAbout}>About</div>
        </div>
      </div>
      <div className="main">
        <div className="article">
          <div className="title">Article Title</div>
          <div className="content">Content</div>
        </div>
      </div>
    </div>
  );
}`}
              good={`// ✅ CORRECT: Semantic HTML
function App() {
  return (
    <>
      <header>
        <img src="/logo.png" alt="Company Logo" />
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <article>
          <h1>Article Title</h1>
          <p>Content</p>
        </article>
      </main>
      <footer>
        <p>&copy; 2024 Company</p>
      </footer>
    </>
  );
}

// ✅ Landmark regions
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header role="banner">
        <SkipToContent />
        <Navigation />
      </header>
      <main role="main" id="main-content">
        {children}
      </main>
      <aside role="complementary" aria-label="Related articles">
        <RelatedArticles />
      </aside>
      <footer role="contentinfo">
        <FooterContent />
      </footer>
    </>
  );
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* Form Accessibility */}
      <section id="form-accessibility" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Form Accessibility
              </Heading>
              <Text className={styles.sectionDescription}>
                Create accessible forms with proper labels, error messages, fieldset grouping, and validation feedback.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Accessible form
function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="User registration form"
    >
      <fieldset>
        <legend>Personal Information</legend>
        
        <div>
          <label htmlFor="firstName">
            First Name <span aria-label="required">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && (
            <div id="firstName-error" role="alert" className="error">
              {errors.firstName}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="email">
            Email <span aria-label="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error email-hint' : 'email-hint'}
          />
          <div id="email-hint" className="hint">
            We'll never share your email
          </div>
          {errors.email && (
            <div id="email-error" role="alert" className="error">
              {errors.email}
            </div>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>Preferences</legend>
        
        <div role="group" aria-labelledby="newsletter-label">
          <div id="newsletter-label">Newsletter</div>
          <label>
            <input type="checkbox" name="newsletter" />
            Subscribe to newsletter
          </label>
        </div>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
}

// ✅ Error summary
function FormWithErrorSummary({ errors }: { errors: Record<string, string> }) {
  const errorEntries = Object.entries(errors);

  return (
    <form>
      {errorEntries.length > 0 && (
        <div role="alert" className="error-summary" aria-labelledby="error-summary-title">
          <h2 id="error-summary-title">Please fix the following errors:</h2>
          <ul>
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={\`#\${field}\`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Form fields */}
    </form>
  );
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

