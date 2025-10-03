import { Bell, ChevronDown, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusTone = "idle" | "validating" | "running" | "completed";

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
  status,
  user,
}: {
  datasetLabel: string;
  status: {
    label: string;
    tone: StatusTone;
  };
  user: {
    name: string;
    role: string;
  };
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Radio className="h-4 w-4 text-primary" aria-hidden />
          Emergency Reporting
        </div>
        <div className="hidden h-4 w-px bg-border md:block" aria-hidden />
        <Button
          variant="outline"
          className="hidden items-center gap-2 px-3 text-sm md:flex"
          aria-label="Switch dataset"
        >
          {datasetLabel}
          <ChevronDown className="h-4 w-4" aria-hidden />
        </Button>
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
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" aria-hidden />
        </Button>
        <div className="flex flex-col text-right">
          <span className="font-medium leading-none">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.role}</span>
        </div>
      </div>
    </header>
  );
}
