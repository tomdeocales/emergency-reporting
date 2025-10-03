import { loadStaticJson } from "@/server/fetch/load-static-json";
import type { EmergencyZone, ZoneStatus, ZonesSnapshot } from "@/types/zones";

const ZONES_DATA_PATH = "data/mock-zones.json";

export async function getZonesSnapshot(): Promise<ZonesSnapshot> {
  const zones = await loadStaticJson<EmergencyZone[]>(ZONES_DATA_PATH);
  const byStatus = zones.reduce<Record<ZoneStatus, number>>(
    (accumulator, zone) => {
      accumulator[zone.status] += 1;
      return accumulator;
    },
    { Stable: 0, Watch: 0, Critical: 0 },
  );

  const personnel = zones.reduce((accumulator, zone) => {
    return accumulator + zone.onCallUnits;
  }, 0);

  return {
    zones,
    totals: {
      overall: zones.length,
      byStatus,
      personnel,
    },
  };
}
