"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OperationsSnapshot } from "@/types/dashboard";

import { IncidentsTable } from "../_components/incidents-table";
import { MapPanel } from "../_components/map-panel";
import { SummaryCards } from "../_components/summary-cards";

export function OperationsShell({
  snapshot,
}: {
  snapshot: OperationsSnapshot;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredIncidents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return snapshot.incidents.filter((incident) => {
      const matchesType =
        typeFilter === "all" || incident.type?.toLowerCase() === typeFilter;
      const matchesSearch = normalizedSearch
        ? incident.id.toLowerCase().includes(normalizedSearch) ||
          incident.type.toLowerCase().includes(normalizedSearch)
        : true;
      return matchesType && matchesSearch;
    });
  }, [snapshot.incidents, search, typeFilter]);

  const totalActive = filteredIncidents.length;

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
          <MapPanel incidents={filteredIncidents} className="shadow-sm" />
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
          <Button type="button" variant="ghost" size="sm">
            View full log
          </Button>
        </header>
        <IncidentsTable incidents={filteredIncidents} />
      </section>
    </div>
  );
}
