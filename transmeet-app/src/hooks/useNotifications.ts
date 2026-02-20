"use client";

import { useEffect, useState } from "react";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export function useNotifications(initial: NotificationItem[] = []) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial);
  const [loading, setLoading] = useState(false);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) setNotifications(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchNotifications();
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length;
  return { notifications, loading, unreadCount, markRead, refetch: fetchNotifications };
}
