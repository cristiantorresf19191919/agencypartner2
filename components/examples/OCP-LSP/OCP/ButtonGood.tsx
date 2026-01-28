// ✅ The Good Way (OCP Applied)
// We allow the user to pass in the style or class.
// The Button logic is closed, but you can extend it endlessly by passing different props.

import React from "react";

// ✅ Open for extension (via props), Closed for modification
const Button = ({ className = "", children, ...props }) => {
  // We don't care what style you want. We just apply it.
  return (
    <button className={`base-btn ${className}`} {...props}>
      {children}
    </button>
  );
};

// Usage
const App = () => {
  // ✅ We extend behavior without touching the Button file
  return (
    <div>
      <Button className="bg-blue-500 text-white px-4 py-2">Primary</Button>
      <Button className="bg-red-500 text-white px-4 py-2">Danger</Button>
      <Button className="bg-green-500 text-white px-4 py-2">Success</Button>
      {/* ✅ Add infinite new styles without modifying Button.tsx */}
      <Button className="bg-purple-500 text-white px-4 py-2">Custom</Button>
    </div>
  );
};

export default Button;

