// ❌ The Bad Way (Violating LSP)
// In React, LSP is about Component Interchangeability.
// If you have two components that serve a similar purpose (e.g., InputText and InputPassword),
// they should accept the same basic props so they can be swapped.

import React, { useState } from "react";

// Base Input
const StandardInput = ({ value, onChange }) => (
  <input value={value} onChange={onChange} />
);

// Special Input
// ❌ VIOLATION: DateInput changed the prop names (value -> date, onChange -> setDate).
// If we try to swap them dynamically, the app breaks.
const DateInput = ({ date, setDate }) => (
  <input type="date" value={date} onChange={setDate} />
);

// ❌ This Form component cannot substitute StandardInput with DateInput
// because they have different prop interfaces
const FormField = ({ Component, label }) => {
  const [val, setVal] = useState("");
  
  return (
    <div>
      <label>{label}</label>
      {/* ❌ This breaks if Component is DateInput because prop names don't match */}
      <Component value={val} onChange={e => setVal(e.target.value)} />
    </div>
  );
};

// Usage - this will break!
const App = () => {
  return (
    <div>
      {/* ✅ This works */}
      <FormField Component={StandardInput} label="Name" />
      
      {/* ❌ This breaks! DateInput expects 'date' and 'setDate', not 'value' and 'onChange' */}
      <FormField Component={DateInput} label="Birth Date" />
    </div>
  );
};

export default App;

