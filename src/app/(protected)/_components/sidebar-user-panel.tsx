"use client";

import { Bell, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setUnread(notifications.filter((item) => item.isNew).length);
  }, [notifications]);

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      }),
    [notifications],
  );

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
      return;
    }
    window.location.href = "/";
  };

  const handleMarkAll = () => {
    setUnread(0);
    setIsModalOpen(false);
  };

  const hasNotifications = sortedNotifications.length > 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-sm ring-1 ring-border/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {user.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.role}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "relative rounded-full border border-border/70 bg-background/90 text-muted-foreground transition hover:border-primary/40 hover:text-primary",
            unread > 0 && "text-primary",
          )}
          aria-label="Open notifications"
          onClick={() => setIsModalOpen(true)}
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground">
              {unread}
            </span>
          ) : null}
        </Button>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              Recent automation and status updates from across the console.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {hasNotifications ? (
              sortedNotifications.map((notification) => (
                <article
                  key={notification.id}
                  className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {notification.title}
                    </h3>
                    {notification.isNew ? (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[0.65rem] font-medium text-primary">
                        New
                      </span>
                    ) : null}
                  </div>
                  {notification.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  ) : null}
                  {notification.timestamp ? (
                    <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
                All quiet — no notifications right now.
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMarkAll}
              disabled={!hasNotifications || unread === 0}
            >
              Mark all as read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
