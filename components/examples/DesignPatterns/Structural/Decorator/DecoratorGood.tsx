// ✅ The Good Way (Decorator Pattern / Higher-Order Components in React)
// Dynamically add features through composition

import React, { ReactNode } from "react";

// Base component
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({ children, onClick, disabled, className = "" }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${className}`}
  >
    {children}
  </button>
);

// ✅ Decorator components (Higher-Order Components)
const withIcon = (Component: React.ComponentType<ButtonProps>) => {
  return (props: ButtonProps) => (
    <Component {...props} className={`${props.className || ""} flex items-center gap-2`}>
      🔘 {props.children}
    </Component>
  );
};

const withLoading = (Component: React.ComponentType<ButtonProps>) => {
  return (props: ButtonProps & { isLoading?: boolean }) => (
    <Component {...props} disabled={props.isLoading || props.disabled}>
      {props.isLoading ? "⏳" : ""} {props.children}
    </Component>
  );
};

// ✅ Better: Composition with wrapper components
const IconButton = ({ children, ...props }: ButtonProps) => (
  <Button {...props} className={`${props.className || ""} flex items-center gap-2`}>
    🔘 {children}
  </Button>
);

const LoadingButton = ({ children, isLoading, ...props }: ButtonProps & { isLoading?: boolean }) => (
  <Button {...props} disabled={isLoading || props.disabled}>
    {isLoading && "⏳"} {children}
  </Button>
);

// ✅ Best: Use composition with props (most React-idiomatic)
interface EnhancedButtonProps extends ButtonProps {
  icon?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const EnhancedButton = ({
  children,
  icon = false,
  loading = false,
  variant = "primary",
  ...props
}: EnhancedButtonProps) => {
  const variantClasses = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    danger: "bg-red-500 text-white",
  };

  return (
    <Button
      {...props}
      disabled={loading || props.disabled}
      className={`${variantClasses[variant]} ${props.className || ""} ${icon ? "flex items-center gap-2" : ""}`}
    >
      {loading && "⏳"} {icon && "🔘"} {children}
    </Button>
  );
};

// Usage
const App = () => {
  return (
    <div className="space-x-2">
      {/* ✅ Base button */}
      <Button>Click me</Button>

      {/* ✅ Decorated buttons */}
      <IconButton>Icon Button</IconButton>
      <LoadingButton isLoading={true}>Loading Button</LoadingButton>

      {/* ✅ Combined features */}
      <EnhancedButton icon loading variant="primary">
        Complex Button
      </EnhancedButton>

      {/* ✅ Any combination */}
      <EnhancedButton icon variant="danger">
        Danger with Icon
      </EnhancedButton>
    </div>
  );
};

export default App;






