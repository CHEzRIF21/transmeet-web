"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/api/client";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type?: string;
  linkUrl?: string | null;
  readAt: string | null;
  sentAt: string;
}

export function useNotifications(accessToken: string | undefined) {
  const qc = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      apiRequest<{ notifications: Notification[]; unreadCount: number }>(
        "notifications",
        { accessToken }
      ).then((r) =>
        r.success
          ? (r.data ?? { notifications: [], unreadCount: 0 })
          : { notifications: [], unreadCount: 0 }
      ),
    enabled: !!accessToken,
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`notifications/${id}/read`, {
        method: "PATCH",
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllAsRead = useMutation({
    mutationFn: () =>
      apiRequest("notifications/mark-all-read", {
        method: "POST",
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  useEffect(() => {
    if (!accessToken) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      channel = supabase
        .channel(`notifs-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `userId=eq.${user.id}`,
          },
          () => qc.invalidateQueries({ queryKey: ["notifications"] })
        )
        .subscribe();
    });
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [accessToken, qc, supabase]);

  return {
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    loading: query.isLoading,
    markAsRead: (id: string) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
  };
}
