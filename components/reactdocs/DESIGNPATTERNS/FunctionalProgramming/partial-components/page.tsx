"use client";

import React, { useState, useCallback } from "react";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Repetitive Component Creation
// Creating similar components with duplicated logic and props

import { useState } from "react";

// ❌ BAD: Duplicated component logic
export function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      {children}
    </button>
  );
}

export function DangerButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      {children}
    </button>
  );
}

// ❌ BAD: Repetitive form field components
export function TextInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 border rounded"
    />
  );
}

export function EmailInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 border rounded"
    />
  );
}

export function PasswordInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 border rounded"
    />
  );
}

// ❌ BAD: Hard-coded validation logic
export function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateName = (value: string) => {
    if (value.length < 3) {
      return "Name must be at least 3 characters";
    }
    return null;
  };

  const validateEmail = (value: string) => {
    if (!value.includes("@")) {
      return "Email must contain @";
    }
    return null;
  };

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    return null;
  };

  return (
    <form>
      <TextInput value={name} onChange={setName} placeholder="Name" />
      <EmailInput value={email} onChange={setEmail} placeholder="Email" />
      <PasswordInput value={password} onChange={setPassword} placeholder="Password" />
    </form>
  );
}

// Problems:
// 1. Code duplication - same logic repeated
// 2. Hard to maintain - changes require updates in multiple places
// 3. Not reusable - can't easily create variations
// 4. Tightly coupled - components know too much about their use`;

const goodExample = `// ✅ GOOD EXAMPLE: Partial Application and Currying
// Creating reusable, configurable components using functional programming

import { useState, useCallback } from "react";

// ============================================
// Step 1: Curried Functions
// ============================================
// ✅ GOOD: Curried function - returns a function
export const createButton = (variant: "primary" | "secondary" | "danger") => {
  const styles = {
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    danger: "bg-red-500 hover:bg-red-600",
  };

  return ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
    return (
      <button
        onClick={onClick}
        className={\`px-4 py-2 \${styles[variant]} text-white rounded\`}
      >
        {children}
      </button>
    );
  };
};

// ✅ GOOD: Partially applied button components
export const PrimaryButton = createButton("primary");
export const SecondaryButton = createButton("secondary");
export const DangerButton = createButton("danger");

// ============================================
// Step 2: Higher-Order Components with Partial Application
// ============================================
// ✅ GOOD: Curried input component creator
export const createInput = (type: string) => {
  return ({ value, onChange, placeholder, className = "" }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
  }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={\`px-3 py-2 border rounded \${className}\`}
      />
    );
  };
};

// ✅ GOOD: Partially applied input components
export const TextInput = createInput("text");
export const EmailInput = createInput("email");
export const PasswordInput = createInput("password");

// ============================================
// Step 3: Curried Validation Functions
// ============================================
// ✅ GOOD: Curried validator creator
export const createValidator = (rule: (value: string) => boolean) => {
  return (message: string) => {
    return (value: string): string | null => {
      if (!rule(value)) {
        return message;
      }
      return null;
    };
  };
};

// ✅ GOOD: Reusable validation rules
export const minLength = (length: number) => (value: string) => value.length >= length;
export const contains = (substring: string) => (value: string) => value.includes(substring);

// ✅ GOOD: Partially applied validators
export const validateMinLength = (length: number, message: string) =>
  createValidator(minLength(length))(message);

export const validateEmail = createValidator(contains("@"))("Email must contain @");
export const validateName = validateMinLength(3, "Name must be at least 3 characters");
export const validatePassword = validateMinLength(8, "Password must be at least 8 characters");

// ============================================
// Step 4: Composing Validated Inputs
// ============================================
// ✅ GOOD: Higher-order component with validation
export const createValidatedInput = (InputComponent: ReturnType<typeof createInput>) => {
  return (validator: (value: string) => string | null) => {
    return ({ value, onChange, placeholder, ...props }: {
      value: string;
      onChange: (value: string) => void;
      placeholder: string;
      [key: string]: any;
    }) => {
      const [error, setError] = useState<string | null>(null);

      const handleChange = (newValue: string) => {
        const validationError = validator(newValue);
        setError(validationError);
        if (!validationError) {
          onChange(newValue);
        }
      };

      return (
        <div>
          <InputComponent
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            {...props}
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      );
    };
  };
};

// ✅ GOOD: Partially applied validated inputs
export const ValidatedTextInput = createValidatedInput(TextInput);
export const ValidatedEmailInput = createValidatedInput(EmailInput);
export const ValidatedPasswordInput = createValidatedInput(PasswordInput);

// ============================================
// Step 5: Using Partial Components
// ============================================
export function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ GOOD: Using partially applied components
  const NameInput = ValidatedTextInput(validateName);
  const EmailInputComponent = ValidatedEmailInput(validateEmail);
  const PasswordInputComponent = ValidatedPasswordInput(validatePassword);

  return (
    <form className="space-y-4">
      <NameInput value={name} onChange={setName} placeholder="Name" />
      <EmailInputComponent value={email} onChange={setEmail} placeholder="Email" />
      <PasswordInputComponent value={password} onChange={setPassword} placeholder="Password" />
    </form>
  );
}

// ============================================
// Step 6: Advanced Partial Application
// ============================================
// ✅ GOOD: Partial application for configuration
export const createFormField = (
  InputComponent: ReturnType<typeof createInput>,
  validator: (value: string) => string | null
) => {
  return ({ label, value, onChange, ...props }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    [key: string]: any;
  }) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (newValue: string) => {
      const validationError = validator(newValue);
      setError(validationError);
      if (!validationError) {
        onChange(newValue);
      }
    };

    return (
      <div>
        <label className="block mb-1">{label}</label>
        <InputComponent
          value={value}
          onChange={handleChange}
          {...props}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  };
};

// ✅ GOOD: Reusable form field configurations
export const NameField = createFormField(TextInput, validateName);
export const EmailField = createFormField(EmailInput, validateEmail);
export const PasswordField = createFormField(PasswordInput, validatePassword);

// ✅ Benefits:
// 1. Reusable: Create variations easily with partial application
// 2. Composable: Combine functions to build complex components
// 3. DRY: No code duplication - logic defined once
// 4. Flexible: Easy to create new variations
// 5. Testable: Each function can be tested independently
// 6. Maintainable: Changes in one place affect all variations`;

export default function PartialComponentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS/FunctionalProgramming" className="mb-4 inline-block">
              ← Back to Functional Programming
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Partial Components
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Partial application and currying allow you to create reusable, configurable components
              by fixing some arguments of a function and returning a new function with fewer parameters.
              This pattern enables powerful component composition and reduces code duplication.
            </Text>
          </div>
        </Stack>

        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Currying and Partial Application
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  <strong>Currying</strong> is the technique of converting a function that takes multiple arguments
                  into a sequence of functions that each take a single argument. <strong>Partial application</strong> is
                  fixing some arguments of a function to create a new function with fewer parameters. Both techniques
                  enable you to create specialized components from generic ones, reducing duplication and increasing
                  reusability.
                </Text>
              </div>

              <CodeComparison wrong={badExample} good={goodExample} language="tsx" />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/DESIGNPATTERNS/FunctionalProgramming">
            ← Back to Functional Programming
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

