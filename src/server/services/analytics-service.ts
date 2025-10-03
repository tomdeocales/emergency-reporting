import { getMockIncidents } from "@/server/services/incidents-service";
import type {
  AnalyticsExportRow,
  AnalyticsRange,
  AnalyticsResponseByType,
  AnalyticsSnapshot,
  AnalyticsTrendPoint,
} from "@/types/analytics";
import type { IncidentRecord } from "@/types/incidents";

const AVAILABLE_RANGES: AnalyticsRange[] = ["24h", "7d", "30d"];
const DEFAULT_RANGE: AnalyticsRange = "24h";

export async function getAnalyticsSnapshot(
  range: AnalyticsRange = DEFAULT_RANGE,
): Promise<AnalyticsSnapshot> {
  const incidents = await getMockIncidents();

  const metrics = buildMetrics(incidents, range);
  const volumeTrend = buildVolumeTrend(incidents);
  const responseByType = buildResponseByType(incidents);
  const exportRows = buildExportRows(responseByType);

  return {
    availableRanges: AVAILABLE_RANGES,
    activeRange: range,
    metrics,
    volumeTrend,
    responseByType,
    exportRows,
  };
}

function buildMetrics(incidents: IncidentRecord[], range: AnalyticsRange) {
  const totalIncidents = incidents.length;
  const highPriority = incidents.filter(
    (incident) => incident.priority === 1,
  ).length;
  const dispatched = incidents.filter(
    (incident) => incident.status === "Dispatched",
  ).length;

  const highPriorityShare = totalIncidents
    ? Math.round((highPriority / totalIncidents) * 100)
    : 0;

  const averageResponseMinutes = incidents.length
    ? Math.round(
        (incidents.reduce(
          (acc, incident) => acc + estimateResponseMinutes(incident),
          0,
        ) /
          incidents.length) *
          10,
      ) / 10
    : 0;

  return [
    {
      id: "incidents",
      label: `Incidents (${range})`,
      value: totalIncidents.toString(),
      change: "+12% vs previous window",
      trend: "up" as const,
    },
    {
      id: "response",
      label: "Avg response",
      value: `${averageResponseMinutes.toFixed(1)} min`,
      change: "-6% vs last week",
      trend: "down" as const,
    },
    {
      id: "dispatch",
      label: "Teams dispatched",
      value: dispatched.toString(),
      change: "+3 vs prior shift",
      trend: "up" as const,
    },
    {
      id: "priority",
      label: "High priority share",
      value: `${highPriorityShare}%`,
      change: "flat vs baseline",
      trend: "flat" as const,
    },
  ];
}

function buildVolumeTrend(incidents: IncidentRecord[]) {
  const buckets = new Map<string, { incidents: number; dispatched: number }>();

  for (const incident of incidents) {
    const timestamp = Date.parse(incident.reportedAt);
    if (Number.isNaN(timestamp)) {
      continue;
    }
    const label = `${new Date(timestamp).toISOString().slice(11, 13)}:00`;
    const bucket = buckets.get(label) ?? { incidents: 0, dispatched: 0 };
    bucket.incidents += 1;
    if (incident.status === "Dispatched") {
      bucket.dispatched += 1;
    }
    buckets.set(label, bucket);
  }

  return Array.from(buckets.entries())
    .sort(([firstLabel], [secondLabel]) =>
      firstLabel.localeCompare(secondLabel),
    )
    .map(
      ([label, bucket]): AnalyticsTrendPoint => ({
        label,
        incidents: bucket.incidents,
        dispatched: bucket.dispatched,
      }),
    );
}

function buildResponseByType(incidents: IncidentRecord[]) {
  const grouped = new Map<string, { totalMinutes: number; count: number }>();

  for (const incident of incidents) {
    const baseline = grouped.get(incident.type) ?? {
      totalMinutes: 0,
      count: 0,
    };
    baseline.totalMinutes += estimateResponseMinutes(incident);
    baseline.count += 1;
    grouped.set(incident.type, baseline);
  }

  return Array.from(grouped.entries())
    .sort((first, second) => second[1].count - first[1].count)
    .map(
      ([type, info]): AnalyticsResponseByType => ({
        type,
        averageMinutes:
          info.count === 0
            ? 0
            : Math.round((info.totalMinutes / info.count) * 10) / 10,
        incidentCount: info.count,
      }),
    );
}

function buildExportRows(
  responseByType: AnalyticsResponseByType[],
): AnalyticsExportRow[] {
  return responseByType.map((entry) => ({
    label: entry.type,
    incidents: entry.incidentCount,
    averageMinutes: entry.averageMinutes,
  }));
}

function estimateResponseMinutes(incident: IncidentRecord) {
  const base = 7.2;
  const priorityAdjustment = (4 - Number(incident.priority)) * 0.6;
  const statusAdjustment =
    incident.status === "Dispatched"
      ? -0.3
      : incident.status === "Cleared"
        ? -0.6
        : 0.4;
  const idHash =
    incident.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    5;
  const jitter = idHash * 0.05;

  return Math.max(4.5, base - priorityAdjustment + statusAdjustment + jitter);
}
