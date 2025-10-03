"use client";

import { Bell, LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SidebarNotification = {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  isNew?: boolean;
};

export function SidebarUserPanel({
  user,
  notifications,
  onSignOut,
}: {
  user: {
    name: string;
    role: string;
  };
  notifications: SidebarNotification[];
  onSignOut?: () => void;
}) {
  const [unread, setUnread] = useState(
    notifications.filter((item) => item.isNew).length,
  );

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-sm ring-1 ring-border/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {user.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.role}</p>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsDropdown
          notifications={notifications}
          unread={unread}
          onMarkAll={() => setUnread(0)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full border border-border/70 bg-background/90 text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
          aria-label="Sign out"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

function NotificationsDropdown({
  notifications,
  unread,
  onMarkAll,
}: {
  notifications: SidebarNotification[];
  unread: number;
  onMarkAll: () => void;
}) {
  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full border border-border/70 bg-background/90 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground">
              {unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs uppercase tracking-wide">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasNotifications ? (
          <DropdownMenuGroup className="max-h-64 space-y-1 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 whitespace-normal"
              >
                <span className="text-sm font-medium text-foreground">
                  {notification.title}
                </span>
                {notification.description ? (
                  <span className="text-xs text-muted-foreground">
                    {notification.description}
                  </span>
                ) : null}
                {notification.timestamp ? (
                  <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                    {notification.timestamp}
                  </span>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuItem disabled>
            All quiet — no notifications at this time.
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onMarkAll} disabled={!hasNotifications}>
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
