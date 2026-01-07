// ❌ The Bad Way (Complex API Exposure)
// Component directly uses multiple complex services

import React, { useState, useEffect } from "react";

// ❌ Problem: Component has to know about all service details
const UserDashboard = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    // ❌ Complex initialization with multiple API calls
    // Component has to orchestrate everything
    
    // Fetch user
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    // Fetch orders
    fetch(`/api/users/${userId}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data));

    // Fetch notifications
    fetch(`/api/users/${userId}/notifications`)
      .then((res) => res.json())
      .then((data) => setNotifications(data));

    // Fetch preferences
    fetch(`/api/users/${userId}/preferences`)
      .then((res) => res.json())
      .then((data) => setPreferences(data));
  }, [userId]);

  // ❌ Component is responsible for too much
  if (!user || !orders || !notifications || !preferences) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Orders: {orders.length}</p>
      <p>Notifications: {notifications.length}</p>
    </div>
  );
};




