// ✅ The Good Way (Observer Pattern with React)
// Using React's built-in observer pattern (Context API)
// Defines a subscription mechanism to notify multiple components about events

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// ✅ Step 1: Observer Pattern with Context API
// Publisher maintains subscription list and notifies subscribers
interface StoreContextType {
  product: string;
  eventType: string;
  addProduct: (product: string) => void;
  setPrice: (product: string, price: number) => void;
  subscribe: (callback: (eventType: string, data: string) => void) => () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ✅ Step 2: Publisher Component (Store)
// Contains subscription infrastructure and business logic
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState("");
  const [eventType, setEventType] = useState("");
  const [subscribers, setSubscribers] = useState<Array<(eventType: string, data: string) => void>>([]);

  // ✅ Business logic methods notify subscribers automatically
  const addProduct = useCallback((newProduct: string) => {
    setProduct(newProduct);
    setEventType("product_available");
    // ✅ Notify all subscribers automatically
    subscribers.forEach((callback) => callback("product_available", newProduct));
  }, [subscribers]);

  const setPrice = useCallback((productName: string, price: number) => {
    const data = `${productName} - $${price}`;
    setEventType("price_change");
    // ✅ Notify all subscribers automatically
    subscribers.forEach((callback) => callback("price_change", data));
  }, [subscribers]);

  // ✅ Subscription management
  const subscribe = useCallback((callback: (eventType: string, data: string) => void) => {
    setSubscribers((prev) => [...prev, callback]);
    // Return unsubscribe function
    return () => {
      setSubscribers((prev) => prev.filter((cb) => cb !== callback));
    };
  }, []);

  return (
    <StoreContext.Provider value={{ product, eventType, addProduct, setPrice, subscribe }}>
      {children}
    </StoreContext.Provider>
  );
};

// ✅ Hook to access store context
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};

// ✅ Step 3: Publisher Component (UI)
const Store = () => {
  const { addProduct, setPrice } = useStore();
  const [input, setInput] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const handleAddProduct = () => {
    addProduct(input);
    setInput("");
  };

  const handleSetPrice = () => {
    const [product, price] = priceInput.split(" - $");
    if (product && price) {
      setPrice(product, parseFloat(price));
      setPriceInput("");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", marginBottom: "20px" }}>
      <h3>Store (Publisher)</h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter product name"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div>
        <input
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          placeholder="Product - $Price"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleSetPrice}>Set Price</button>
      </div>
    </div>
  );
};

// ✅ Step 4: Concrete Subscriber Components
// React to notifications issued by the publisher
// All use the same interface so publisher isn't coupled to concrete classes

const Customer = ({ name, interestedProduct }: { name: string; interestedProduct: string }) => {
  const { product, eventType } = useStore();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (eventType === "product_available" && product.includes(interestedProduct)) {
      setNotifications((prev) => [...prev, `${name} notified: ${product} is now available!`]);
    }
  }, [product, eventType, name, interestedProduct]);

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <strong>Customer: {name}</strong>
      {notifications.length > 0 && (
        <ul>
          {notifications.map((notif, idx) => (
            <li key={idx}>{notif}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const EmailSubscriber = () => {
  const { product, eventType } = useStore();
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setEmails((prev) => [...prev, `Email notification: ${product}`]);
    }
  }, [product, eventType]);

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <strong>Email Subscriber</strong>
      {emails.length > 0 && (
        <ul>
          {emails.map((email, idx) => (
            <li key={idx}>{email}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SMSSubscriber = () => {
  const { product, eventType } = useStore();
  const [sms, setSms] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setSms((prev) => [...prev, `SMS notification: ${product}`]);
    }
  }, [product, eventType]);

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <strong>SMS Subscriber</strong>
      {sms.length > 0 && (
        <ul>
          {sms.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ✅ Easy to add new subscriber types without modifying publisher
const PushNotificationSubscriber = () => {
  const { product, eventType } = useStore();
  const [pushes, setPushes] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setPushes((prev) => [...prev, `Push notification: ${product}`]);
    }
  }, [product, eventType]);

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <strong>Push Notification Subscriber</strong>
      {pushes.length > 0 && (
        <ul>
          {pushes.map((push, idx) => (
            <li key={idx}>{push}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ✅ Step 5: Usage - all subscribers automatically update
// Client creates publisher and subscriber components separately
// and they communicate through the context (observer pattern)
const App = () => {
  return (
    <StoreProvider>
      <div style={{ padding: "20px" }}>
        <h2>Observer Pattern Example</h2>
        <Store />
        <div>
          <h3>Subscribers:</h3>
          <Customer name="Alice" interestedProduct="iPhone" />
          <Customer name="Bob" interestedProduct="MacBook" />
          <EmailSubscriber />
          <SMSSubscriber />
          <PushNotificationSubscriber />
          {/* ✅ Easy to add more subscribers without modifying existing code */}
        </div>
        {/* ✅ Benefits:
            - Open/Closed Principle: add new subscribers without changing publisher
            - Loose coupling: publisher doesn't know concrete subscriber classes
            - Dynamic relationships: subscribe/unsubscribe at runtime
            - Single Responsibility: each component has one job */}
      </div>
    </StoreProvider>
  );
};

export default App;






