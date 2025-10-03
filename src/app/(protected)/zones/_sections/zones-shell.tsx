"use client";

import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import type { ZoneStatus, ZonesSnapshot } from "@/types/zones";

import { MapPanel } from "../../dashboard/_components/map-panel";
import { ZoneDetailPanel } from "../_components/zone-detail-panel";
import { ZoneList } from "../_components/zone-list";
import { ZonesSummary } from "../_components/zones-summary";

const STATUS_FILTERS: (ZoneStatus | "all")[] = [
  "all",
  "Stable",
  "Watch",
  "Critical",
];

export function ZonesShell({ snapshot }: { snapshot: ZonesSnapshot }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("all");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(
    snapshot.zones[0]?.id ?? null,
  );

  const filteredZones = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return snapshot.zones.filter((zone) => {
      const matchesStatus =
        statusFilter === "all" ? true : zone.status === statusFilter;
      const matchesSearch = normalized
        ? zone.name.toLowerCase().includes(normalized) ||
          zone.commander.toLowerCase().includes(normalized) ||
          zone.coverageArea.toLowerCase().includes(normalized)
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [snapshot.zones, search, statusFilter]);

  useEffect(() => {
    if (!filteredZones.length) {
      setSelectedZoneId(null);
      return;
    }

    const stillVisible = filteredZones.some(
      (zone) => zone.id === selectedZoneId,
    );
    if (!stillVisible) {
      setSelectedZoneId(filteredZones[0]?.id ?? null);
    }
  }, [filteredZones, selectedZoneId]);

  const selectedZone = useMemo(
    () => filteredZones.find((zone) => zone.id === selectedZoneId) ?? null,
    [filteredZones, selectedZoneId],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Zone readiness</h1>
        <p className="text-sm text-muted-foreground">
          Monitor command zones, readiness scores, and hotspots driving
          escalated posture.
        </p>
      </header>

      <ZonesSummary
        overall={snapshot.totals.overall}
        byStatus={snapshot.totals.byStatus}
        personnel={snapshot.totals.personnel}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,2.2fr)]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
            <label className="flex flex-col gap-2" htmlFor="zones-search">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Search zones
              </span>
              <Input
                id="zones-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by zone, commander, or coverage"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    statusFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {filter === "all" ? "All statuses" : filter}
                </button>
              ))}
            </div>
          </div>

          <ZoneList
            zones={filteredZones}
            activeZoneId={selectedZoneId}
            onSelect={setSelectedZoneId}
          />
        </div>

        <div className="space-y-4">
          {selectedZone ? (
            <>
              <MapPanel
                incidents={selectedZone.hotspots}
                className="shadow-sm"
              />
              <ZoneDetailPanel zone={selectedZone} />
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
              No zones match the current filters. Adjust search criteria to see
              zone readiness details.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
