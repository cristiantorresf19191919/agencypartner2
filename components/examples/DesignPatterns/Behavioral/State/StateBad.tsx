// ❌ The Bad Way (If/Else State Management)
// Using conditional statements to manage state behavior

import React, { useState } from "react";

// ❌ Problem: Lots of if/else logic in component
const VendingMachine = () => {
  const [state, setState] = useState<"idle" | "hasMoney" | "dispensing">("idle");
  const [money, setMoney] = useState(0);

  const insertMoney = (amount: number) => {
    // ❌ Complex conditional logic
    if (state === "idle") {
      setMoney(amount);
      setState("hasMoney");
    } else if (state === "hasMoney") {
      console.log("Money already inserted");
    } else if (state === "dispensing") {
      console.log("Please wait, dispensing...");
    }
  };

  const selectProduct = (product: string) => {
    // ❌ More conditional logic
    if (state === "idle") {
      console.log("Please insert money first");
    } else if (state === "hasMoney") {
      if (money >= 10) {
        console.log("Dispensing " + product);
        setMoney(0);
        setState("idle");
      } else {
        console.log("Insufficient funds");
      }
    } else if (state === "dispensing") {
      console.log("Please wait, dispensing...");
    }
  };

  const cancel = () => {
    // ❌ Even more conditional logic
    if (state === "hasMoney") {
      console.log("Returning $" + money);
      setMoney(0);
      setState("idle");
    } else {
      console.log("No transaction to cancel");
    }
  };

  return (
    <div>
      <p>State: {state}</p>
      <p>Money: ${money}</p>
      <button onClick={() => insertMoney(10)}>Insert $10</button>
      <button onClick={() => selectProduct("Coke")}>Select Coke</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
};






