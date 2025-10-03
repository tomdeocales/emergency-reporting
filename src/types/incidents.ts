export type IncidentPriority = 1 | 2 | 3;

export type IncidentRecord = {
  id: string;
  reportedAt: string;
  latitude: number | null;
  longitude: number | null;
  type: string;
  priority: IncidentPriority;
  status: "Logged" | "Dispatched" | "Cleared" | "Investigating";
};

export type IncidentQualityIssue = {
  id: string;
  message: string;
  severity: "low" | "medium" | "high";
  context?: string;
};

export type IncidentQualitySummary = {
  totalRecords: number;
  timeRange: {
    start: string;
    end: string;
  } | null;
  invalidLocations: number;
  missingCoordinates: number;
  averagePriority: number | null;
  invalidRecords: number;
  issues: IncidentQualityIssue[];
};
