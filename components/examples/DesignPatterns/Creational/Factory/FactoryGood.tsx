// ✅ The Good Way (Factory Pattern in React)
// Components use a factory to create instances, reducing coupling

import React, { ReactElement } from "react";

// Base component types
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

// Concrete button components
const Button = ({ children, onClick }: ButtonProps) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white">
    {children}
  </button>
);

const IconButton = ({ children, onClick }: ButtonProps) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white">
    🔘 {children}
  </button>
);

const LinkButton = ({ children, onClick }: ButtonProps) => (
  <a onClick={onClick} className="px-4 py-2 text-blue-500 underline">
    {children}
  </a>
);

// ✅ Factory function
type ButtonType = "button" | "icon" | "link";

const createButton = (
  type: ButtonType,
  props: ButtonProps
): ReactElement => {
  switch (type) {
    case "button":
      return <Button {...props} />;
    case "icon":
      return <IconButton {...props} />;
    case "link":
      return <LinkButton {...props} />;
    default:
      return <Button {...props} />;
  }
};

// ✅ Factory component (alternative approach)
interface ButtonFactoryProps extends ButtonProps {
  type: ButtonType;
}

const ButtonFactory = ({ type, ...props }: ButtonFactoryProps) => {
  return createButton(type, props);
};

// Usage
const App = () => {
  return (
    <div>
      {/* ✅ Using factory function */}
      {createButton("button", { children: "Click me" })}
      {createButton("icon", { children: "Icon button" })}
      {createButton("link", { children: "Link button" })}

      {/* ✅ Using factory component */}
      <ButtonFactory type="button" onClick={() => alert("Clicked!")}>
        Factory Button
      </ButtonFactory>
      <ButtonFactory type="icon">Factory Icon</ButtonFactory>
      <ButtonFactory type="link">Factory Link</ButtonFactory>
    </div>
  );
};

export default App;




