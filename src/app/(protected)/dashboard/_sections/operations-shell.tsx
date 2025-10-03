"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OperationsSnapshot } from "@/types/dashboard";

import { IncidentsTable } from "../_components/incidents-table";
import { MapPanel } from "../_components/map-panel";
import { SummaryCards } from "../_components/summary-cards";
import { TimelineScrubber } from "../_components/timeline-scrubber";
import { ZoneDrawer } from "../_components/zone-drawer";

export function OperationsShell({
  snapshot,
}: {
  snapshot: OperationsSnapshot;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const timelineTicks = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    const sorted = snapshot.incidents
      .map((incident) => {
        const timestamp = Date.parse(incident.reportedAt);
        if (Number.isNaN(timestamp)) {
          return null;
        }
        return {
          value: timestamp,
          label: formatter.format(new Date(timestamp)),
        };
      })
      .filter(
        (entry): entry is { value: number; label: string } => entry !== null,
      )
      .sort((first, second) => first.value - second.value);

    const deduped: { value: number; label: string }[] = [];
    let lastValue: number | null = null;

    for (const entry of sorted) {
      if (lastValue === entry.value) {
        continue;
      }
      deduped.push(entry);
      lastValue = entry.value;
    }

    return deduped;
  }, [snapshot.incidents]);

  const [timelineIndex, setTimelineIndex] = useState(() =>
    timelineTicks.length ? Math.max(timelineTicks.length - 1, 0) : 0,
  );

  useEffect(() => {
    if (!timelineTicks.length) {
      setTimelineIndex(0);
      setIsPlaying(false);
      return;
    }

    setTimelineIndex((current) => {
      if (current >= timelineTicks.length) {
        return timelineTicks.length - 1;
      }
      return current;
    });
  }, [timelineTicks.length]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (timelineTicks.length < 2) {
      setIsPlaying(false);
      return;
    }

    const totalTicks = timelineTicks.length;
    const interval = window.setInterval(() => {
      setTimelineIndex((current) => (current + 1) % totalTicks);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isPlaying, timelineTicks.length]);

  useEffect(() => {
    if (timelineTicks.length < 2 && isPlaying) {
      setIsPlaying(false);
    }
  }, [timelineTicks.length, isPlaying]);

  const activeTimelineValue =
    timelineTicks[timelineIndex]?.value ?? Number.POSITIVE_INFINITY;
  const activeTimelineLabel = timelineTicks[timelineIndex]?.label ?? "";

  const filteredIncidents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return snapshot.incidents.filter((incident) => {
      const matchesType =
        typeFilter === "all" || incident.type?.toLowerCase() === typeFilter;
      const matchesSearch = normalizedSearch
        ? incident.id.toLowerCase().includes(normalizedSearch) ||
          incident.type.toLowerCase().includes(normalizedSearch)
        : true;
      const reportedTime = Date.parse(incident.reportedAt);
      const matchesTimeline = Number.isNaN(reportedTime)
        ? true
        : reportedTime <= activeTimelineValue;

      return matchesType && matchesSearch && matchesTimeline;
    });
  }, [snapshot.incidents, search, typeFilter, activeTimelineValue]);

  const totalActive = filteredIncidents.length;

  const handleTimelineChange = (index: number) => {
    setTimelineIndex(index);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-8">
      <SummaryCards summary={snapshot.summary} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Live map</h2>
              <p className="text-sm text-muted-foreground">
                Heatmap of the latest incidents by priority. Select a filter to
                focus the view.
              </p>
              {activeTimelineLabel ? (
                <p className="text-xs text-muted-foreground">
                  Timeline set through {activeTimelineLabel}.
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {totalActive} showing
              </span>
              <Button type="button" variant="outline" size="sm">
                Export view
              </Button>
            </div>
          </header>
          <TimelineScrubber
            ticks={timelineTicks}
            activeIndex={timelineIndex}
            onIndexChange={handleTimelineChange}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying((previous) => !previous)}
          />
          <MapPanel
            incidents={filteredIncidents}
            className="shadow-sm"
            shouldFitToData={!isPlaying}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
            <label className="flex flex-col gap-1" htmlFor="operations-search">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Search
              </span>
              <Input
                id="operations-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by id or type"
              />
            </label>
            <label
              className="flex flex-col gap-1"
              htmlFor="operations-type-filter"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Incident type
              </span>
              <select
                id="operations-type-filter"
                className="w-full rounded-md border border-border bg-background px-3 py-2"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                <option value="all">All types</option>
                {snapshot.incidentTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Recent incidents</h2>
            <p className="text-sm text-muted-foreground">
              Sorted by latest report time. Use filters above to refine the
              dataset.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
          >
            View full log
          </Button>
        </header>
        <IncidentsTable incidents={filteredIncidents} />
      </section>

      <ZoneDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        incidents={filteredIncidents}
        scopeLabel={activeTimelineLabel || undefined}
      />
    </div>
  );
}
