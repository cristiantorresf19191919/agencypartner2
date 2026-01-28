// ❌ The Bad Way (Violating OCP)
// The Button component is full of if/else logic.
// If you want a "Green" button, you have to open this file and edit the code.

import React from "react";

// ❌ Closed for extension, Open for modification (Bad)
const Button = ({ type, label }) => {
  if (type === 'primary') {
    return <button className="blue-btn">{label}</button>;
  } else if (type === 'danger') {
    // ❌ WE HAVE TO EDIT THIS FILE TO ADD DANGER
    return <button className="red-btn">{label}</button>;
  } else if (type === 'success') {
    // ❌ WE HAVE TO EDIT THIS FILE AGAIN TO ADD SUCCESS
    return <button className="green-btn">{label}</button>;
  }
  return <button>{label}</button>;
};

// Usage
const App = () => {
  return (
    <div>
      <Button type="primary" label="Click me" />
      <Button type="danger" label="Delete" />
      {/* ❌ To add a new button style, we must modify Button.tsx */}
    </div>
  );
};

export default Button;

