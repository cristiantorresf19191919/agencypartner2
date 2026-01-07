// ✅ The Good Way (Strategy Pattern in React)
// Encapsulate algorithms in separate functions/components

import React, { useState } from "react";

// ✅ Strategy interface
interface PaymentStrategy {
  pay: (amount: number) => void;
}

// ✅ Concrete strategies
const creditCardStrategy: PaymentStrategy = {
  pay: (amount: number) => {
    console.log("Processing credit card payment:", amount);
    // Credit card processing logic
  },
};

const paypalStrategy: PaymentStrategy = {
  pay: (amount: number) => {
    console.log("Processing PayPal payment:", amount);
    // PayPal processing logic
  },
};

const bitcoinStrategy: PaymentStrategy = {
  pay: (amount: number) => {
    console.log("Processing Bitcoin payment:", amount);
    // Bitcoin processing logic
  },
};

// ✅ Strategy map
const paymentStrategies: Record<string, PaymentStrategy> = {
  credit: creditCardStrategy,
  paypal: paypalStrategy,
  bitcoin: bitcoinStrategy,
};

// ✅ Component using strategy pattern
const PaymentForm = () => {
  const [paymentType, setPaymentType] = useState("credit");
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    const strategy = paymentStrategies[paymentType];
    
    if (strategy) {
      strategy.pay(paymentAmount);
    } else {
      console.error("Unknown payment type");
    }
  };

  return (
    <div>
      <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
        <option value="credit">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bitcoin">Bitcoin</option>
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

// ✅ Alternative: Using React hooks for strategy
const usePaymentStrategy = (type: string) => {
  const strategy = paymentStrategies[type] || creditCardStrategy;
  return strategy;
};

const PaymentFormWithHook = () => {
  const [paymentType, setPaymentType] = useState("credit");
  const [amount, setAmount] = useState("");
  const strategy = usePaymentStrategy(paymentType);

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    strategy.pay(paymentAmount);
  };

  return (
    <div>
      <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
        <option value="credit">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bitcoin">Bitcoin</option>
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

export { PaymentForm, PaymentFormWithHook };





