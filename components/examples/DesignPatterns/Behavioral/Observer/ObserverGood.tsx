// ✅ The Good Way (Observer Pattern with React Context / Custom Hooks)
// Using React's built-in observer pattern (Context API)

import React, { createContext, useContext, useState, ReactNode } from "react";

// ✅ Observer pattern with Context API
interface NewsContextType {
  news: string;
  publishNews: (news: string) => void;
  subscribe: (callback: (news: string) => void) => () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [news, setNews] = useState("");
  const [subscribers, setSubscribers] = useState<Array<(news: string) => void>>([]);

  const publishNews = (newNews: string) => {
    setNews(newNews);
    // ✅ Notify all subscribers automatically
    subscribers.forEach((callback) => callback(newNews));
  };

  const subscribe = (callback: (news: string) => void) => {
    setSubscribers((prev) => [...prev, callback]);
    // Return unsubscribe function
    return () => {
      setSubscribers((prev) => prev.filter((cb) => cb !== callback));
    };
  };

  return (
    <NewsContext.Provider value={{ news, publishNews, subscribe }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within NewsProvider");
  }
  return context;
};

// ✅ Publisher component
const NewsPublisher = () => {
  const { publishNews } = useNews();
  const [input, setInput] = useState("");

  const handlePublish = () => {
    publishNews(input);
    setInput("");
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter news"
      />
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
};

// ✅ Subscriber components (automatically receive updates)
const EmailSubscriber = () => {
  const { news } = useNews();
  return <div>Email: {news || "No news yet"}</div>;
};

const SMSSubscriber = () => {
  const { news } = useNews();
  return <div>SMS: {news || "No news yet"}</div>;
};

const PushNotificationSubscriber = () => {
  const { news } = useNews();
  return <div>Push: {news || "No news yet"}</div>;
};

// ✅ Usage - all subscribers automatically update
const App = () => {
  return (
    <NewsProvider>
      <NewsPublisher />
      <EmailSubscriber />
      <SMSSubscriber />
      <PushNotificationSubscriber />
      {/* ✅ Easy to add more subscribers without modifying existing code */}
    </NewsProvider>
  );
};

// ✅ Alternative: Using React's useState with useEffect (simpler observer)
const useNewsState = () => {
  const [news, setNews] = useState("");
  return { news, setNews };
};

export default App;






