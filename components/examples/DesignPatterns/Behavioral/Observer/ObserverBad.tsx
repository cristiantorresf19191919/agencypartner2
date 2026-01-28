// ❌ The Bad Way (Props Drilling / Manual Updates)
// Components manually pass callbacks and update state
// Problem: Tight coupling and manual state management

import React, { useState } from "react";

// ❌ Problem: Store component directly manages each customer type
const Store = ({ 
  onProductUpdate, 
  onEmailUpdate, 
  onSMSUpdate 
}: { 
  onProductUpdate: (product: string) => void;
  onEmailUpdate: (product: string) => void;
  onSMSUpdate: (product: string) => void;
}) => {
  const [product, setProduct] = useState("");

  const addProduct = () => {
    // ❌ Have to manually call each subscriber
    onProductUpdate(product);
    onEmailUpdate(product);
    onSMSUpdate(product);
    // ❌ What if we want to add a new subscriber type?
    // We have to modify this component!
    setProduct("");
  };

  return (
    <div>
      <input
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Enter product name"
      />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
};

// ❌ Each subscriber component needs to be manually updated
const Customer = ({ product }: { product: string }) => {
  return <div>Customer checking: {product || "No product yet"}</div>;
};

const EmailSubscriber = ({ product }: { product: string }) => {
  return <div>Email notification: {product || "No product yet"}</div>;
};

const SMSSubscriber = ({ product }: { product: string }) => {
  return <div>SMS notification: {product || "No product yet"}</div>;
};

// ❌ App has to manage all state and pass it down
// ❌ Tight coupling: Store knows about all subscriber types
const App = () => {
  const [currentProduct, setCurrentProduct] = useState("");
  const [emailProduct, setEmailProduct] = useState("");
  const [smsProduct, setSmsProduct] = useState("");

  return (
    <div>
      <Store 
        onProductUpdate={setCurrentProduct}
        onEmailUpdate={setEmailProduct}
        onSMSUpdate={setSmsProduct}
      />
      <Customer product={currentProduct} />
      <EmailSubscriber product={emailProduct} />
      <SMSSubscriber product={smsProduct} />
      {/* ❌ Problems:
          - What if we want to add more subscribers? More state management!
          - Store is tightly coupled to all subscriber types
          - Can't dynamically add/remove subscribers
          - Violates Open/Closed Principle
          - Manual notification management is error-prone */}
    </div>
  );
};






