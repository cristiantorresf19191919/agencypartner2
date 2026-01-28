// ❌ The Bad Way (If/Else Hell)
// Using conditional statements for different algorithms

import React, { useState } from "react";

// ❌ Problem: Lots of if/else logic in component
const PaymentForm = () => {
  const [paymentType, setPaymentType] = useState("credit");
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    
    // ❌ Complex conditional logic
    if (paymentType === "credit") {
      console.log("Processing credit card payment:", paymentAmount);
      // Credit card processing logic
    } else if (paymentType === "paypal") {
      console.log("Processing PayPal payment:", paymentAmount);
      // PayPal processing logic
    } else if (paymentType === "bitcoin") {
      console.log("Processing Bitcoin payment:", paymentAmount);
      // Bitcoin processing logic
    }
    // ❌ What if we want to add a new payment method?
    // We have to modify this component!
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

