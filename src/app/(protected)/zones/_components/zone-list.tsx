"use client";

import type { EmergencyZone } from "@/types/zones";
import { ZoneStatusBadge } from "./zone-status-badge";

export function ZoneList({
  zones,
  activeZoneId,
  onSelect,
}: {
  zones: EmergencyZone[];
  activeZoneId: string | null;
  onSelect: (zoneId: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {zones.map((zone) => {
        const isActive = zone.id === activeZoneId;
        return (
          <li key={zone.id}>
            <button
              type="button"
              onClick={() => onSelect(zone.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left shadow-sm transition ${isActive ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/60"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {zone.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Commander {zone.commander}
                  </p>
                </div>
                <ZoneStatusBadge status={zone.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>{zone.coverageArea}</span>
                <span>•</span>
                <span>{zone.activeIncidents} active incidents</span>
                <span>•</span>
                <span>{zone.onCallUnits} on-call units</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
