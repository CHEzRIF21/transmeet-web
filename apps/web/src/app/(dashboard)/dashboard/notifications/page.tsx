"use client";

import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

export default function NotificationsPage() {
  const { accessToken } = useProfile();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications(accessToken);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} non lue(s)` : "Toutes lues"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllAsRead()}
            style={{ borderColor: NAVY, color: NAVY }}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <Card style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune notification</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className="transition-colors hover:bg-muted/50"
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
                backgroundColor: n.readAt ? undefined : "rgba(27,43,94,0.04)",
              }}
            >
              <CardContent className="p-4">
                <Link
                  href={n.linkUrl ?? "#"}
                  className="block"
                  onClick={() => !n.readAt && markAsRead(n.id)}
                >
                  <p className="font-medium" style={{ color: NAVY }}>
                    {n.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {n.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(n.sentAt).toLocaleString("fr-FR")}
                  </p>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
