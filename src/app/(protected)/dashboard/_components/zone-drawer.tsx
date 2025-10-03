"use client";

import { useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IncidentRecord } from "@/types/incidents";

export type ZoneDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidents: IncidentRecord[];
  scopeLabel?: string;
};

export function ZoneDrawer({
  open,
  onOpenChange,
  incidents,
  scopeLabel,
}: ZoneDrawerProps) {
  const { statusStats, priorityStats, latestIncidents } = useMemo(() => {
    const statusCounts = new Map<string, number>();
    const priorityCounts = new Map<string, number>();

    for (const incident of incidents) {
      statusCounts.set(
        incident.status,
        (statusCounts.get(incident.status) ?? 0) + 1,
      );
      priorityCounts.set(
        `Priority ${incident.priority}`,
        (priorityCounts.get(`Priority ${incident.priority}`) ?? 0) + 1,
      );
    }

    const statusStats = Array.from(statusCounts.entries()).sort(
      (first, second) => second[1] - first[1],
    );
    const priorityStats = Array.from(priorityCounts.entries()).sort(
      (first, second) => second[1] - first[1],
    );

    const latestIncidents = [...incidents]
      .sort(
        (first, second) =>
          Date.parse(second.reportedAt) - Date.parse(first.reportedAt),
      )
      .slice(0, 8);

    return {
      statusStats,
      priorityStats,
      latestIncidents,
    };
  }, [incidents]);

  const hasData = incidents.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-0 top-0 h-full max-w-xl translate-x-0 translate-y-0 rounded-none border-l border-border bg-background px-6 py-8 shadow-xl sm:max-w-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle>Incident zone details</DialogTitle>
          <DialogDescription>
            {hasData
              ? `Based on ${incidents.length} incident(s) through ${scopeLabel ?? "the selected range"}.`
              : "Select a time range with activity to review incident distribution."}
          </DialogDescription>
        </DialogHeader>

        {hasData ? (
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2">
              <StatBlock title="By status" emptyMessage="No status data">
                {statusStats.map(([status, count]) => (
                  <StatRow key={status} label={status} value={count} />
                ))}
              </StatBlock>
              <StatBlock title="By priority" emptyMessage="No priority data">
                {priorityStats.map(([priority, count]) => (
                  <StatRow key={priority} label={priority} value={count} />
                ))}
              </StatBlock>
            </section>

            <section className="space-y-3">
              <header>
                <h3 className="text-sm font-semibold text-foreground">
                  Latest activity
                </h3>
                <p className="text-xs text-muted-foreground">
                  Incidents ordered by most recent report time within the
                  current scope.
                </p>
              </header>
              <div className="space-y-2 rounded-lg border border-border/70 bg-muted/10 p-3">
                {latestIncidents.map((incident) => (
                  <article
                    key={incident.id}
                    className="rounded-md border border-transparent bg-background px-3 py-2 transition hover:border-border/80"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {incident.id}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{formatDateTime(incident.reportedAt)}</span>
                      <span>•</span>
                      <span>{incident.type}</span>
                      <span>•</span>
                      <span>Status: {incident.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border/70 bg-muted/10 p-6 text-sm text-muted-foreground">
            Once incident activity is available for the selected timeframe, this
            drawer will highlight status mix, priority breakdown, and a quick
            log of the latest events to triage.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatBlock({
  title,
  emptyMessage,
  children,
}: {
  title: string;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  return (
    <section className="space-y-2 rounded-lg border border-border/70 bg-muted/10 p-4">
      <header className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </header>
      {hasChildren ? (
        <ul className="space-y-2 text-sm">{children}</ul>
      ) : (
        <p className="text-xs text-muted-foreground">{emptyMessage}</p>
      )}
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between rounded-md bg-background px-3 py-2">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}

function formatDateTime(input: string) {
  const timestamp = Date.parse(input);
  if (Number.isNaN(timestamp)) {
    return input;
  }

  return Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
