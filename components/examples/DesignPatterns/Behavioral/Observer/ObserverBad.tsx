// ❌ The Bad Way (Props Drilling / Manual Updates)
// Components manually pass callbacks and update state

import React, { useState } from "react";

// ❌ Problem: Manual state management and prop drilling
const NewsPublisher = ({ onNewsUpdate }: { onNewsUpdate: (news: string) => void }) => {
  const [news, setNews] = useState("");

  const publishNews = () => {
    // ❌ Have to manually call each subscriber
    onNewsUpdate(news);
    setNews("");
  };

  return (
    <div>
      <input
        value={news}
        onChange={(e) => setNews(e.target.value)}
        placeholder="Enter news"
      />
      <button onClick={publishNews}>Publish</button>
    </div>
  );
};

// ❌ Each subscriber component needs to be manually updated
const EmailSubscriber = ({ news }: { news: string }) => {
  return <div>Email: {news}</div>;
};

const SMSSubscriber = ({ news }: { news: string }) => {
  return <div>SMS: {news}</div>;
};

// ❌ App has to manage all state and pass it down
const App = () => {
  const [currentNews, setCurrentNews] = useState("");

  return (
    <div>
      <NewsPublisher onNewsUpdate={setCurrentNews} />
      <EmailSubscriber news={currentNews} />
      <SMSSubscriber news={currentNews} />
      {/* ❌ What if we want to add more subscribers? More state management! */}
    </div>
  );
};




