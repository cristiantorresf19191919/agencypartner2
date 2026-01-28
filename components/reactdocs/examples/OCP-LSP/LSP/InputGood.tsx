// ✅ The Good Way (LSP Applied)
// Both components adhere to the same "Contract" (Prop structure).
// The Form doesn't care which one it is rendering - they're interchangeable.

import React, { useState } from "react";

// ✅ Both components accept the same standard props.
// The Form doesn't care which one it is rendering.

const StandardInput = ({ value, onChange, ...props }) => (
  <input value={value} onChange={onChange} {...props} />
);

// ✅ DateInput follows the same contract as StandardInput
// It accepts 'value' and 'onChange' just like StandardInput
const DateInput = ({ value, onChange, ...props }) => (
  <input type="date" value={value} onChange={onChange} {...props} />
);

// ✅ PasswordInput also follows the same contract
const PasswordInput = ({ value, onChange, ...props }) => (
  <input type="password" value={value} onChange={onChange} {...props} />
);

// ✅ Now I can swap them easily:
// This works for ALL input types because they follow LSP
const FormField = ({ Component, label }) => {
  const [val, setVal] = useState("");
  
  return (
    <div>
      <label>{label}</label>
      {/* ✅ This works for ALL components because they follow LSP */}
      <Component value={val} onChange={e => setVal(e.target.value)} />
    </div>
  );
};

// Usage - all work interchangeably!
const App = () => {
  return (
    <div>
      {/* ✅ All of these work because they follow the same contract */}
      <FormField Component={StandardInput} label="Name" />
      <FormField Component={DateInput} label="Birth Date" />
      <FormField Component={PasswordInput} label="Password" />
      
      {/* ✅ We can even swap them dynamically */}
      {[StandardInput, DateInput, PasswordInput].map((InputComponent, idx) => (
        <FormField key={idx} Component={InputComponent} label={`Field ${idx + 1}`} />
      ))}
    </div>
  );
};

export default App;

