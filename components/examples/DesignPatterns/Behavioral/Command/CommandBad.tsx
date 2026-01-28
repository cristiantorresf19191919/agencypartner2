// ❌ The Bad Way (Direct Function Calls)
// Components directly call functions, no undo/redo capability

import React, { useState } from "react";

// ❌ Problem: Direct function calls, no history, no undo
const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1); // ❌ Direct state update
  };

  const decrement = () => {
    setCount(count - 1); // ❌ Direct state update
  };

  // ❌ No way to undo or redo actions
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};






