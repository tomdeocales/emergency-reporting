export type AnalyticsRange = "24h" | "7d" | "30d";

export type AnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
};

export type AnalyticsTrendPoint = {
  label: string;
  incidents: number;
  dispatched: number;
};

export type AnalyticsResponseByType = {
  type: string;
  averageMinutes: number;
  incidentCount: number;
};

export type AnalyticsExportRow = {
  label: string;
  incidents: number;
  averageMinutes: number;
};

export type AnalyticsSnapshot = {
  availableRanges: AnalyticsRange[];
  activeRange: AnalyticsRange;
  metrics: AnalyticsMetric[];
  volumeTrend: AnalyticsTrendPoint[];
  responseByType: AnalyticsResponseByType[];
  exportRows: AnalyticsExportRow[];
};
