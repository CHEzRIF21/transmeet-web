"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBell() {
  const { accessToken } = useProfile();
  const { notifications, unreadCount, markAsRead } = useNotifications(accessToken);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 border-b">
          <Link
            href="/dashboard/notifications"
            className="text-sm font-medium hover:underline"
          >
            Voir toutes
          </Link>
        </div>
        {notifications.slice(0, 10).map((n) => (
          <DropdownMenuItem
            key={n.id}
            asChild
            className="cursor-pointer"
            onSelect={() => markAsRead(n.id)}
          >
            <Link
              href={n.linkUrl ?? "/dashboard/notifications"}
              className="block p-3"
            >
              <p className="font-medium text-sm">{n.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {n.body}
              </p>
            </Link>
          </DropdownMenuItem>
        ))}
        {notifications.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
