// ❌ The Bad Way (Component Explosion)
// Creating a new component for every combination of features

import React from "react";

// Base component
const Button = ({ children }: { children: React.ReactNode }) => (
  <button>{children}</button>
);

// ❌ Problem: We need a component for every combination
const ButtonWithIcon = ({ children }: { children: React.ReactNode }) => (
  <button>
    🔘 {children}
  </button>
);

const ButtonWithLoading = ({ children }: { children: React.ReactNode }) => (
  <button disabled>
    ⏳ {children}
  </button>
);

const ButtonWithIconAndLoading = ({ children }: { children: React.ReactNode }) => (
  <button disabled>
    🔘 ⏳ {children}
  </button>
);

// ❌ What if we want Button with Icon, Loading, and Disabled?
// We need another component! This leads to component explosion.

const App = () => {
  return (
    <div>
      <Button>Click me</Button>
      <ButtonWithIcon>Icon Button</ButtonWithIcon>
      <ButtonWithLoading>Loading Button</ButtonWithLoading>
      <ButtonWithIconAndLoading>Complex Button</ButtonWithIconAndLoading>
    </div>
  );
};






