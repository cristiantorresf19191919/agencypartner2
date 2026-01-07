"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function DesignSystemsComponentLibrariesPage() {
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
          <li className={styles.breadcrumbCurrent}>Design Systems & Component Libraries</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Design Systems & Component Libraries
        </Heading>
        <Text className={styles.subtitle}>
          Build production-grade design systems from scratch. Learn Storybook patterns, component documentation, token system architecture, accessibility in design systems, and versioning component libraries used by senior engineers.
        </Text>
      </div>

      {/* Building a Design System from Scratch */}
      <section id="building-design-system" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Building a Design System from Scratch
              </Heading>
              <Text className={styles.sectionDescription}>
                Create a scalable, maintainable design system with proper architecture, organization, and best practices.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Design System Layers:</strong>
                <br />• <strong>Tokens:</strong> Colors, spacing, typography, shadows
                <br />• <strong>Components:</strong> Buttons, inputs, cards, etc.
                <br />• <strong>Patterns:</strong> Compositions of components
                <br />• <strong>Documentation:</strong> Usage guidelines and examples
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Design System Architecture

// 1. Design Tokens (Foundation)
// tokens/colors.ts
export const colors = {
  // Semantic colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
};

// tokens/spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

// tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// tokens/shadows.ts
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// ✅ Component Structure
// components/Button/Button.tsx
import React from 'react';
import { colors, spacing, typography } from '../../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    className,
    ...props 
  }, ref) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: typography.fontWeight.medium,
      borderRadius: '0.375rem',
      transition: 'all 0.2s',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
    };
    
    const variantStyles = {
      primary: {
        backgroundColor: colors.primary[600],
        color: 'white',
        '&:hover': { backgroundColor: colors.primary[700] },
      },
      secondary: {
        backgroundColor: colors.neutral[200],
        color: colors.neutral[900],
        '&:hover': { backgroundColor: colors.neutral[300] },
      },
      outline: {
        border: \`1px solid \${colors.neutral[300]}\`,
        backgroundColor: 'transparent',
        color: colors.neutral[700],
        '&:hover': { backgroundColor: colors.neutral[50] },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.neutral[700],
        '&:hover': { backgroundColor: colors.neutral[100] },
      },
    };
    
    const sizeStyles = {
      sm: {
        padding: \`\${spacing[2]} \${spacing[3]}\`,
        fontSize: typography.fontSize.sm,
      },
      md: {
        padding: \`\${spacing[2]} \${spacing[4]}\`,
        fontSize: typography.fontSize.base,
      },
      lg: {
        padding: \`\${spacing[3]} \${spacing[6]}\`,
        fontSize: typography.fontSize.lg,
      },
    };
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={className}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...sizeStyles[size],
        }}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <>
            {leftIcon && <span style={{ marginRight: spacing[2] }}>{leftIcon}</span>}
            {children}
            {rightIcon && <span style={{ marginLeft: spacing[2] }}>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ✅ Design System Index
// index.ts
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Card } from './components/Card';
export * from './tokens';

// ✅ TypeScript Theme Provider
import React, { createContext, useContext } from 'react';

interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
}

const defaultTheme: Theme = {
  colors,
  spacing,
  typography,
  shadows,
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider: React.FC<{ theme?: Partial<Theme>; children: React.ReactNode }> = ({
  theme,
  children,
}) => {
  const mergedTheme = { ...defaultTheme, ...theme };
  return <ThemeContext.Provider value={mergedTheme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Storybook Patterns */}
      <section id="storybook-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Storybook Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Set up Storybook for component development, testing, and documentation with best practices.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Storybook Configuration
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y', // Accessibility
    '@storybook/addon-viewport', // Responsive testing
    '@storybook/addon-docs', // Documentation
  ],
  framework: '@storybook/react',
  features: {
    buildStoriesJson: true,
  },
};

// ✅ Component Story (Button.stories.tsx)
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component with multiple variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ✅ Default Story
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

// ✅ Variant Stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

// ✅ Size Stories
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

// ✅ State Stories
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

// ✅ Composition Story
export const WithIcons: Story = {
  args: {
    children: 'Button with Icon',
    leftIcon: <Icon name="plus" />,
  },
};

// ✅ All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

// ✅ Responsive Story
export const Responsive: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1920px', height: '1080px' } },
      },
    },
  },
  render: () => (
    <div>
      <Button size="sm">Small on Mobile</Button>
      <Button size="md">Medium on Tablet</Button>
      <Button size="lg">Large on Desktop</Button>
    </div>
  ),
};

// ✅ Accessibility Story
export const Accessibility: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  render: () => (
    <div>
      <Button>Accessible Button</Button>
      <Button aria-label="Close dialog">×</Button>
    </div>
  ),
};

// ✅ Interactive Story
export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!'),
  },
};

// ✅ Storybook Decorators
// .storybook/decorators.tsx
import React from 'react';
import { ThemeProvider } from '../src/theme';

export const withTheme = (Story) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
);

// ✅ Storybook Parameters
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#1a1a1a' },
    ],
  },
};

// ✅ Storybook Addons
// Accessibility testing
import { withA11y } from '@storybook/addon-a11y';

// Viewport testing
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// Documentation
import { DocsContainer } from '@storybook/addon-docs';

// ✅ Component Documentation (MDX)
// Button.mdx
import { Meta, Story, Canvas, Controls } from '@storybook/blocks';
import { Button } from './Button';

<Meta title="Components/Button" component={Button} />

# Button

The Button component is used to trigger actions.

## Usage

\`\`\`tsx
import { Button } from '@design-system/components';

<Button variant="primary">Click me</Button>
\`\`\`

## Variants

<Canvas>
  <Story name="All Variants" />
</Canvas>

## API

<Controls of={Button} />`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Component Documentation */}
      <section id="component-documentation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Component Documentation
              </Heading>
              <Text className={styles.sectionDescription}>
                Create comprehensive component documentation with usage examples, API references, and best practices.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Component Documentation Template

/**
 * Button Component
 * 
 * @description
 * A versatile button component with multiple variants, sizes, and states.
 * Use buttons to trigger actions in your application.
 * 
 * @example
 * ```tsx
 * import { Button } from '@design-system/components';
 * 
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 * 
 * @see {@link https://design-system.example.com/components/button | Full Documentation}
 */

// ✅ JSDoc Documentation
interface ButtonProps {
  /**
   * Button variant style
   * @default 'primary'
   * @example
   * <Button variant="primary">Primary</Button>
   * <Button variant="secondary">Secondary</Button>
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show loading state
   * @default false
   * @example
   * <Button isLoading>Loading...</Button>
   */
  isLoading?: boolean;
  
  /**
   * Disable button
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Icon to display on the left
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display on the right
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Button content
   */
  children: React.ReactNode;
  
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// ✅ Usage Examples Documentation
const usageExamples = {
  basic: {
    title: 'Basic Usage',
    code: \`
      <Button>Click me</Button>
    \`,
    description: 'Simple button with default props'
  },
  
  variants: {
    title: 'Variants',
    code: \`
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    \`,
    description: 'Different button styles for different use cases'
  },
  
  sizes: {
    title: 'Sizes',
    code: \`
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    \`,
    description: 'Button sizes for different contexts'
  },
  
  withIcons: {
    title: 'With Icons',
    code: \`
      <Button leftIcon={<Icon name="plus" />}>
        Add Item
      </Button>
      <Button rightIcon={<Icon name="arrow-right" />}>
        Continue
      </Button>
    \`,
    description: 'Buttons with icons for better UX'
  },
  
  loading: {
    title: 'Loading State',
    code: \`
      <Button isLoading>
        Processing...
      </Button>
    \`,
    description: 'Show loading state during async operations'
  },
  
  disabled: {
    title: 'Disabled State',
    code: \`
      <Button disabled>
        Cannot Click
      </Button>
    \`,
    description: 'Disable button when action is not available'
  }
};

// ✅ Best Practices Documentation
const bestPractices = {
  do: [
    'Use primary variant for main actions',
    'Use secondary for secondary actions',
    'Use outline for less important actions',
    'Show loading state during async operations',
    'Disable button when action is not available',
    'Use appropriate size for context',
    'Include icons for better UX when helpful'
  ],
  dont: [
    'Don\'t use too many button variants on one page',
    'Don\'t use buttons for navigation (use links)',
    'Don\'t disable buttons without explanation',
    'Don\'t use loading state for instant actions',
    'Don\'t nest buttons inside buttons'
  ]
};

// ✅ Accessibility Documentation
const accessibility = {
  keyboard: [
    'Button is focusable with Tab key',
    'Activate with Enter or Space',
    'Focus indicator is visible'
  ],
  screenReader: [
    'Button text is read by screen readers',
    'Loading state is announced',
    'Disabled state is announced'
  ],
  aria: [
    'Use aria-label for icon-only buttons',
    'Use aria-busy for loading state',
    'Use aria-disabled for disabled state'
  ]
};

// ✅ Component README Template
// components/Button/README.md
\`\`\`markdown
# Button

A versatile button component with multiple variants, sizes, and states.

## Installation

\`\`\`bash
npm install @design-system/components
\`\`\`

## Usage

\`\`\`tsx
import { Button } from '@design-system/components';

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | 'primary' | Button variant style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| isLoading | boolean | false | Show loading state |
| disabled | boolean | false | Disable button |
| leftIcon | ReactNode | - | Icon on the left |
| rightIcon | ReactNode | - | Icon on the right |

## Examples

### Variants

\`\`\`tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
\`\`\`

### Sizes

\`\`\`tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
\`\`\`

## Accessibility

- Keyboard navigable (Tab, Enter, Space)
- Screen reader friendly
- Focus indicator visible
- Loading and disabled states announced

## Related Components

- [Link](./Link.md) - For navigation
- [IconButton](./IconButton.md) - Icon-only button
\`\`\`

// ✅ Auto-generated API Docs
// Using TypeDoc or similar
/**
 * @component
 * @name Button
 * @category Components
 * @description Versatile button component
 * @example
 * <Button variant="primary">Click me</Button>
 */
export const Button = ...`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Token System Architecture */}
      <section id="token-system" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Token System Architecture
              </Heading>
              <Text className={styles.sectionDescription}>
                Design a scalable token system that works across platforms and tools.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Design Token Structure

// tokens/index.ts
export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';
export * from './borders';
export * from './zIndex';

// ✅ Token Format (Style Dictionary compatible)
// tokens/colors.json
{
  "color": {
    "primary": {
      "50": { "value": "#f0f9ff" },
      "100": { "value": "#e0f2fe" },
      "500": { "value": "#0ea5e9" },
      "600": { "value": "#0284c7" },
      "900": { "value": "#0c4a6e" }
    },
    "semantic": {
      "success": { "value": "{color.primary.500}" },
      "error": { "value": "#ef4444" }
    }
  }
}

// ✅ Token Transformers
// Convert tokens to different formats

// CSS Variables
const cssVariables = {
  '--color-primary-500': '#0ea5e9',
  '--spacing-4': '1rem',
  '--font-size-base': '1rem',
};

// SCSS Variables
\$color-primary-500: #0ea5e9;
\$spacing-4: 1rem;

// JavaScript/TypeScript
export const tokens = {
  color: {
    primary: {
      500: '#0ea5e9',
    },
  },
  spacing: {
    4: '1rem',
  },
};

// ✅ Token Categories
const tokenCategories = {
  // Primitives (Raw values)
  primitives: {
    colors: ['#0ea5e9', '#ef4444'],
    spacing: ['4px', '8px', '16px'],
  },
  
  // Semantic (Meaningful names)
  semantic: {
    colors: {
      primary: 'color.primary.500',
      error: 'color.semantic.error',
    },
    spacing: {
      small: 'spacing.2',
      medium: 'spacing.4',
      large: 'spacing.8',
    },
  },
  
  // Component-specific
  components: {
    button: {
      padding: 'spacing.2 spacing.4',
      borderRadius: 'borderRadius.md',
      backgroundColor: 'color.primary.500',
    },
  },
};

// ✅ Token Aliases (References)
const tokenAliases = {
  // Alias to another token
  'color.text.primary': '{color.neutral.900}',
  'color.text.secondary': '{color.neutral.600}',
  'color.background': '{color.neutral.50}',
  
  // Computed values
  'spacing.button.padding.x': '{spacing.4}',
  'spacing.button.padding.y': '{spacing.2}',
};

// ✅ Multi-platform Tokens
// tokens/web.ts
export const webTokens = {
  colors: {
    primary: '#0ea5e9',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
  },
};

// tokens/ios.ts
export const iosTokens = {
  colors: {
    primary: UIColor(red: 0.055, green: 0.647, blue: 0.914, alpha: 1.0),
  },
  spacing: {
    sm: 8.0,
    md: 16.0,
  },
};

// tokens/android.xml
<resources>
  <color name="primary">#0ea5e9</color>
  <dimen name="spacing_sm">8dp</dimen>
  <dimen name="spacing_md">16dp</dimen>
</resources>

// ✅ Token Versioning
// tokens/v1/colors.json
{
  "version": "1.0.0",
  "tokens": { ... }
}

// tokens/v2/colors.json
{
  "version": "2.0.0",
  "tokens": { ... },
  "migrations": {
    "color.primary": "color.brand.primary"
  }
}

// ✅ Token Validation
function validateTokens(tokens: TokenSet) {
  // Check required tokens exist
  const required = ['color.primary.500', 'spacing.4'];
  required.forEach(token => {
    if (!getTokenValue(tokens, token)) {
      throw new Error(\`Missing required token: \${token}\`);
    }
  });
  
  // Validate color formats
  Object.values(tokens.color).forEach(color => {
    if (!isValidColor(color)) {
      throw new Error(\`Invalid color: \${color}\`);
    }
  });
  
  // Check token references
  validateTokenReferences(tokens);
}

// ✅ Token Generation from Design Files
// Figma Plugin or Sketch Plugin
// Extract tokens from design files automatically

interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography';
  description?: string;
}

function extractTokensFromFigma(): DesignToken[] {
  // Extract colors, spacing, typography from Figma
  return [
    { name: 'color.primary.500', value: '#0ea5e9', type: 'color' },
    { name: 'spacing.4', value: '16px', type: 'spacing' },
  ];
}

// ✅ Token Documentation
// Auto-generate token documentation
const tokenDocs = {
  'color.primary.500': {
    value: '#0ea5e9',
    description: 'Primary brand color',
    usage: 'Use for primary actions and brand elements',
    examples: ['Button background', 'Link color'],
  },
};

// ✅ Theme Switching with Tokens
const lightTheme = {
  'color.background': '#ffffff',
  'color.text': '#000000',
};

const darkTheme = {
  'color.background': '#000000',
  'color.text': '#ffffff',
};

function applyTheme(theme: Theme) {
  Object.entries(theme).forEach(([token, value]) => {
    document.documentElement.style.setProperty(
      \`--\${token.replace('.', '-')}\`,
      value
    );
  });
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Accessibility in Design Systems */}
      <section id="accessibility-design-systems" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Accessibility in Design Systems
              </Heading>
              <Text className={styles.sectionDescription}>
                Build accessible components that meet WCAG guidelines and work for all users.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Accessibility Requirements

// 1. Color Contrast (WCAG AA minimum)
const colorContrast = {
  // Text on background
  'text-on-primary': {
    foreground: '#ffffff',
    background: '#0ea5e9',
    ratio: 4.5, // WCAG AA
    passes: true,
  },
  
  // Large text (18pt+ or 14pt+ bold)
  'large-text-on-primary': {
    foreground: '#ffffff',
    background: '#0ea5e9',
    ratio: 3.0, // WCAG AA for large text
    passes: true,
  },
};

// ✅ Accessible Button Component
interface AccessibleButtonProps {
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-busy'?: boolean;
  'aria-disabled'?: boolean;
  'aria-describedby'?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  'aria-label': ariaLabel,
  'aria-busy': ariaBusy,
  'aria-disabled': ariaDisabled,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  return (
    <button
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      aria-disabled={ariaDisabled}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ Focus Management
function useFocusManagement() {
  const ref = useRef<HTMLButtonElement>(null);
  
  const focus = () => {
    ref.current?.focus();
  };
  
  const blur = () => {
    ref.current?.blur();
  };
  
  return { ref, focus, blur };
}

// ✅ Keyboard Navigation
function handleKeyDown(event: React.KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handleClick();
      break;
    case 'Escape':
      handleClose();
      break;
    case 'ArrowDown':
      event.preventDefault();
      focusNext();
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusPrevious();
      break;
  }
}

// ✅ Screen Reader Support
function Announcement({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// ✅ Accessible Form Components
interface AccessibleInputProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  error,
  required,
  helperText,
  id,
  ...props
}) => {
  const inputId = id || \`input-\${useId()}\`;
  const errorId = \`\${inputId}-error\`;
  const helperId = \`\${inputId}-helper\`;
  
  return (
    <div>
      <label htmlFor={inputId}>
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperId}
        aria-required={required}
        {...props}
      />
      
      {error && (
        <div id={errorId} role="alert" aria-live="polite">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={helperId}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// ✅ Accessible Modal/Dialog
export const AccessibleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  
  useEffect(() => {
    if (isOpen) {
      // Trap focus inside modal
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <h2 id={titleId}>{title}</h2>
      <div id={descriptionId}>{children}</div>
      <button onClick={onClose} aria-label="Close dialog">
        ×
      </button>
    </div>
  );
};

// ✅ Skip Links
function SkipLinks() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}

// ✅ Accessible Color System
const accessibleColors = {
  // Ensure sufficient contrast
  text: {
    onLight: '#000000', // 21:1 contrast
    onDark: '#ffffff',  // 21:1 contrast
    onPrimary: '#ffffff', // 4.5:1 contrast
  },
  // Don't rely on color alone
  status: {
    success: { color: '#10b981', icon: '✓' },
    error: { color: '#ef4444', icon: '✕' },
    warning: { color: '#f59e0b', icon: '!' },
  },
};

// ✅ Accessibility Testing
// Using @axe-core/react
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// ✅ ARIA Patterns
const ariaPatterns = {
  button: {
    role: 'button',
    keyboard: ['Enter', 'Space'],
    aria: ['aria-label', 'aria-pressed', 'aria-expanded'],
  },
  dialog: {
    role: 'dialog',
    keyboard: ['Escape'],
    aria: ['aria-modal', 'aria-labelledby', 'aria-describedby'],
  },
  menu: {
    role: 'menu',
    keyboard: ['Arrow keys', 'Enter', 'Escape'],
    aria: ['aria-orientation', 'aria-activedescendant'],
  },
};

// ✅ Accessibility Checklist
const accessibilityChecklist = {
  keyboard: [
    'All interactive elements are keyboard accessible',
    'Focus order is logical',
    'Focus indicators are visible',
    'No keyboard traps',
  ],
  screenReader: [
    'Semantic HTML used',
    'ARIA labels provided where needed',
    'Live regions for dynamic content',
    'Form labels associated',
  ],
  visual: [
    'Color contrast meets WCAG AA',
    'Text is resizable',
    'Content works without color',
    'Focus indicators visible',
  ],
  cognitive: [
    'Clear error messages',
    'Instructions provided',
    'Consistent navigation',
    'Simple language used',
  ],
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Versioning Component Libraries */}
      <section id="versioning" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Versioning Component Libraries
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement semantic versioning, changelogs, and migration guides for component libraries.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Semantic Versioning (SemVer)
// MAJOR.MINOR.PATCH
// 1.0.0 → 1.0.1 (Patch: Bug fixes)
// 1.0.1 → 1.1.0 (Minor: New features, backward compatible)
// 1.1.0 → 2.0.0 (Major: Breaking changes)

// package.json
{
  "name": "@design-system/components",
  "version": "2.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    }
  }
}

// ✅ Versioning Strategy
const versioningStrategy = {
  major: {
    when: 'Breaking changes',
    examples: [
      'Removed props',
      'Changed component API',
      'Removed components',
      'Changed token names'
    ],
    migration: 'Required migration guide'
  },
  
  minor: {
    when: 'New features, backward compatible',
    examples: [
      'New components',
      'New props',
      'New variants',
      'New tokens'
    ],
    migration: 'Optional, recommended'
  },
  
  patch: {
    when: 'Bug fixes, no API changes',
    examples: [
      'Fixed styling bugs',
      'Fixed accessibility issues',
      'Performance improvements',
      'Documentation updates'
    ],
    migration: 'Not required'
  }
};

// ✅ CHANGELOG.md
\`\`\`markdown
# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-01-15

### Breaking Changes
- **Button**: Removed \`size\` prop, use \`variant\` instead
- **Input**: Changed \`onChange\` signature
- **Tokens**: Renamed \`color.primary\` to \`color.brand.primary\`

### Migration Guide
See [MIGRATION.md](./MIGRATION.md#v2.0.0) for detailed migration instructions.

## [1.2.0] - 2024-01-01

### Added
- New \`Card\` component
- \`Button\` now supports \`leftIcon\` and \`rightIcon\` props
- New color tokens: \`color.success\`, \`color.warning\`

### Fixed
- Fixed \`Input\` focus state styling
- Fixed accessibility issue in \`Modal\` component

## [1.1.0] - 2023-12-15

### Added
- \`Button\` component
- \`Input\` component
- Initial token system

\`\`\`

// ✅ Migration Guide
// MIGRATION.md
\`\`\`markdown
# Migration Guide

## Migrating from v1.x to v2.0

### Button Component

#### Before (v1.x)
\`\`\`tsx
<Button size="md" variant="primary">
  Click me
</Button>
\`\`\`

#### After (v2.0)
\`\`\`tsx
<Button variant="primary">
  Click me
</Button>
\`\`\`

The \`size\` prop has been removed. Use CSS to control size if needed.

### Color Tokens

#### Before (v1.x)
\`\`\`tsx
import { colors } from '@design-system/tokens';
colors.primary[500]
\`\`\`

#### After (v2.0)
\`\`\`tsx
import { colors } from '@design-system/tokens';
colors.brand.primary[500]
\`\`\`

\`\`\`

// ✅ Automated Versioning
// Using semantic-release or changesets

// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@2.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}

// ✅ Changeset Workflow
// 1. Create changeset
// npx changeset

// 2. Commit changeset
// git add .changeset && git commit -m "Add changeset"

// 3. Version packages
// npx changeset version

// 4. Publish
// npx changeset publish

// ✅ Deprecation Strategy
function deprecated(component: string, version: string, replacement?: string) {
  console.warn(
    \`\${component} is deprecated since v\${version}. \` +
    (replacement ? \`Use \${replacement} instead.\` : '')
  );
}

// Usage
export const OldButton = deprecated('OldButton', '2.0.0', 'Button')(
  (props) => {
    deprecated('OldButton', '2.0.0', 'Button');
    return <Button {...props} />;
  }
);

// ✅ TypeScript Breaking Changes
// Use type aliases for gradual migration
export type OldButtonProps = ButtonProps; // Deprecated
export type ButtonProps = NewButtonProps; // New

// ✅ Version Compatibility Matrix
const compatibilityMatrix = {
  '2.0.0': {
    react: '>=18.0.0',
    'react-dom': '>=18.0.0',
    typescript: '>=5.0.0',
  },
  '1.2.0': {
    react: '>=17.0.0',
    'react-dom': '>=17.0.0',
    typescript: '>=4.5.0',
  },
};

// ✅ Release Process
const releaseProcess = {
  1: 'Update version in package.json',
  2: 'Update CHANGELOG.md',
  3: 'Create migration guide if major version',
  4: 'Run tests',
  5: 'Build package',
  6: 'Tag release',
  7: 'Publish to npm',
  8: 'Create GitHub release',
  9: 'Announce in team channels',
};

// ✅ Pre-release Checklist
const preReleaseChecklist = [
  'All tests passing',
  'Documentation updated',
  'CHANGELOG.md updated',
  'Migration guide created (if major)',
  'Version number updated',
  'Build succeeds',
  'Type definitions generated',
  'Examples work correctly',
  'Accessibility tested',
  'Browser compatibility tested',
];`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

