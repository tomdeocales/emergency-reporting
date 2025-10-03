"use client";

import { Bell, ChevronDown, Radio } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type StatusTone = "idle" | "validating" | "running" | "completed";

type DatasetOption = {
  id: string;
  label: string;
  description?: string;
};

type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  isNew?: boolean;
};

const toneClasses: Record<StatusTone, string> = {
  idle: "bg-muted text-muted-foreground",
  validating:
    "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  running: "bg-primary/10 text-primary",
  completed:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
};

export function TopBar({
  datasetLabel,
  datasetOptions,
  status,
  user,
  notifications,
  onSignOut,
}: {
  datasetLabel: string;
  datasetOptions?: DatasetOption[];
  status: {
    label: string;
    tone: StatusTone;
  };
  user: {
    name: string;
    role: string;
  };
  notifications?: NotificationItem[];
  onSignOut?: () => void;
}) {
  const availableDatasets = useMemo(() => {
    if (datasetOptions?.length) {
      return datasetOptions;
    }
    return [
      {
        id: datasetLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: datasetLabel,
      },
    ];
  }, [datasetOptions, datasetLabel]);

  const [activeDatasetId, setActiveDatasetId] = useState(
    () => availableDatasets[0]?.id ?? "",
  );

  useEffect(() => {
    const match = availableDatasets.find(
      (option) => option.label === datasetLabel || option.id === datasetLabel,
    );
    if (match) {
      setActiveDatasetId(match.id);
    }
  }, [availableDatasets, datasetLabel]);

  const activeDataset = availableDatasets.find(
    (option) => option.id === activeDatasetId,
  );

  const [unread, setUnread] = useState<number>(
    () => notifications?.filter((item) => item.isNew).length ?? 0,
  );

  useEffect(() => {
    setUnread(notifications?.filter((item) => item.isNew).length ?? 0);
  }, [notifications]);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
      return;
    }
    window.location.href = "/";
  };

  const notificationItems = notifications ?? [];

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Radio className="h-4 w-4 text-primary" aria-hidden />
          Emergency Reporting
        </div>
        <div className="hidden h-4 w-px bg-border md:block" aria-hidden />
        <DatasetDropdown
          datasets={availableDatasets}
          activeId={activeDatasetId}
          onSelect={setActiveDatasetId}
          label={activeDataset?.label ?? datasetLabel}
        />
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
            toneClasses[status.tone],
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
          {status.label}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <NotificationsDropdown
          notifications={notificationItems}
          unread={unread}
          onMarkAll={() => setUnread(0)}
        />
        <UserDropdown user={user} onSignOut={handleSignOut} />
      </div>
    </header>
  );
}

function DatasetDropdown({
  datasets,
  activeId,
  onSelect,
  label,
}: {
  datasets: DatasetOption[];
  activeId: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hidden items-center gap-2 px-3 text-sm md:flex"
          aria-label="Switch dataset"
        >
          {label}
          <ChevronDown className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Datasets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeId}
          onValueChange={onSelect}
          aria-label="Select dataset"
        >
          {datasets.map((dataset) => (
            <DropdownMenuRadioItem key={dataset.id} value={dataset.id}>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-foreground">
                  {dataset.label}
                </span>
                {dataset.description ? (
                  <span className="text-xs text-muted-foreground">
                    {dataset.description}
                  </span>
                ) : null}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsDropdown({
  notifications,
  unread,
  onMarkAll,
}: {
  notifications: NotificationItem[];
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
          className="relative rounded-full"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1 text-[0.625rem] font-semibold text-destructive-foreground">
              {unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasNotifications ? (
          <DropdownMenuGroup>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col gap-1 text-left text-sm"
              >
                <span className="font-medium text-foreground">
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
        <DropdownMenuItem onSelect={onMarkAll}>
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserDropdown({
  user,
  onSignOut,
}: {
  user: {
    name: string;
    role: string;
  };
  onSignOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 text-sm"
          aria-label="Open user menu"
        >
          <div className="flex flex-col text-right">
            <span className="font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.role}</span>
          </div>
          <ChevronDown className="h-3 w-3" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
        <DropdownMenuItem onSelect={onSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
