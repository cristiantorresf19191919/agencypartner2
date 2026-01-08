// ✅ The Good Way (State Pattern in React)
// Using state machine or reducer pattern

import React, { useReducer } from "react";

// ✅ Define states and actions
type State = "idle" | "hasMoney" | "dispensing";

type Action =
  | { type: "INSERT_MONEY"; amount: number }
  | { type: "SELECT_PRODUCT"; product: string }
  | { type: "CANCEL" }
  | { type: "DISPENSE_COMPLETE" };

interface MachineState {
  state: State;
  money: number;
}

// ✅ State machine reducer
const vendingMachineReducer = (state: MachineState, action: Action): MachineState => {
  switch (state.state) {
    case "idle":
      if (action.type === "INSERT_MONEY") {
        return { state: "hasMoney", money: action.amount };
      }
      return state;

    case "hasMoney":
      if (action.type === "INSERT_MONEY") {
        console.log("Money already inserted");
        return state;
      }
      if (action.type === "SELECT_PRODUCT") {
        if (state.money >= 10) {
          console.log("Dispensing " + action.product);
          return { state: "dispensing", money: 0 };
        } else {
          console.log("Insufficient funds");
          return state;
        }
      }
      if (action.type === "CANCEL") {
        console.log("Returning $" + state.money);
        return { state: "idle", money: 0 };
      }
      return state;

    case "dispensing":
      if (action.type === "DISPENSE_COMPLETE") {
        return { state: "idle", money: 0 };
      }
      return state;

    default:
      return state;
  }
};

// ✅ Component using state machine
const VendingMachine = () => {
  const [machineState, dispatch] = useReducer(vendingMachineReducer, {
    state: "idle",
    money: 0,
  });

  const insertMoney = (amount: number) => {
    dispatch({ type: "INSERT_MONEY", amount });
  };

  const selectProduct = (product: string) => {
    dispatch({ type: "SELECT_PRODUCT", product });
    // Simulate dispensing completion
    setTimeout(() => {
      dispatch({ type: "DISPENSE_COMPLETE" });
    }, 1000);
  };

  const cancel = () => {
    dispatch({ type: "CANCEL" });
  };

  return (
    <div>
      <p>State: {machineState.state}</p>
      <p>Money: ${machineState.money}</p>
      <button onClick={() => insertMoney(10)}>Insert $10</button>
      <button onClick={() => selectProduct("Coke")}>Select Coke</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
};

// ✅ Alternative: Using custom hook with state pattern
const useVendingMachine = () => {
  const [state, dispatch] = useReducer(vendingMachineReducer, {
    state: "idle",
    money: 0,
  });

  return {
    state: state.state,
    money: state.money,
    insertMoney: (amount: number) => dispatch({ type: "INSERT_MONEY", amount }),
    selectProduct: (product: string) => {
      dispatch({ type: "SELECT_PRODUCT", product });
      setTimeout(() => dispatch({ type: "DISPENSE_COMPLETE" }), 1000);
    },
    cancel: () => dispatch({ type: "CANCEL" }),
  };
};

export { VendingMachine, useVendingMachine };






