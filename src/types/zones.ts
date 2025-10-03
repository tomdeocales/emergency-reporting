import type { IncidentRecord } from "@/types/incidents";

export type ZoneStatus = "Stable" | "Watch" | "Critical";

export type EmergencyZone = {
  id: string;
  name: string;
  status: ZoneStatus;
  commander: string;
  coverageArea: string;
  onCallUnits: number;
  activeIncidents: number;
  lastDrill: string;
  readinessScore: number;
  notes?: string;
  responseTimeTrend: string;
  incidentTrend: string;
  hotspots: IncidentRecord[];
};

export type ZonesSnapshot = {
  zones: EmergencyZone[];
  totals: {
    overall: number;
    byStatus: Record<ZoneStatus, number>;
    personnel: number;
  };
};
