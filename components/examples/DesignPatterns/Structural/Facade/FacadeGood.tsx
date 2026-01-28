// ✅ The Good Way (Facade Pattern in React)
// Custom hook or service provides simple interface to complex operations

import React, { useState, useEffect } from "react";

// Complex services (could be in separate files)
const userService = {
  getUser: (id: number) => fetch(`/api/users/${id}`).then((res) => res.json()),
  getOrders: (id: number) => fetch(`/api/users/${id}/orders`).then((res) => res.json()),
  getNotifications: (id: number) => fetch(`/api/users/${id}/notifications`).then((res) => res.json()),
  getPreferences: (id: number) => fetch(`/api/users/${id}/preferences`).then((res) => res.json()),
};

// ✅ Facade hook: Provides simple interface to complex data fetching
interface DashboardData {
  user: any;
  orders: any[];
  notifications: any[];
  preferences: any;
  loading: boolean;
  error: Error | null;
}

const useDashboardData = (userId: number): DashboardData => {
  const [data, setData] = useState<DashboardData>({
    user: null,
    orders: [],
    notifications: [],
    preferences: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // ✅ Facade handles all complexity
        const [user, orders, notifications, preferences] = await Promise.all([
          userService.getUser(userId),
          userService.getOrders(userId),
          userService.getNotifications(userId),
          userService.getPreferences(userId),
        ]);

        setData({
          user,
          orders,
          notifications,
          preferences,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
      }
    };

    loadDashboardData();
  }, [userId]);

  return data;
};

// ✅ Component uses simple facade interface
const UserDashboard = ({ userId }: { userId: number }) => {
  const { user, orders, notifications, loading, error } = useDashboardData(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Orders: {orders.length}</p>
      <p>Notifications: {notifications.length}</p>
    </div>
  );
};

// ✅ Alternative: Service facade class
class DashboardService {
  async loadDashboardData(userId: number): Promise<DashboardData> {
    const [user, orders, notifications, preferences] = await Promise.all([
      userService.getUser(userId),
      userService.getOrders(userId),
      userService.getNotifications(userId),
      userService.getPreferences(userId),
    ]);

    return {
      user,
      orders,
      notifications,
      preferences,
      loading: false,
      error: null,
    };
  }
}

export { UserDashboard, useDashboardData };






