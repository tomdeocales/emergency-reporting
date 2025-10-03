import type { IncidentRecord } from "@/types/incidents";

export type OperationsSummary = {
  activeIncidents: number;
  dispatchedTeams: number;
  averageResponse: string;
  changeVsLastHour: string;
};

export type OperationsSnapshot = {
  summary: OperationsSummary;
  incidents: IncidentRecord[];
  incidentTypes: string[];
};
