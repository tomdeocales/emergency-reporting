import { loadStaticJson } from "@/server/fetch/load-static-json";
import type {
  IncidentQualityIssue,
  IncidentQualitySummary,
  IncidentRecord,
} from "@/types/incidents";

const INCIDENT_DATA_PATH = "data/mock-incidents.json";

export async function getMockIncidents(): Promise<IncidentRecord[]> {
  return loadStaticJson<IncidentRecord[]>(INCIDENT_DATA_PATH);
}

export async function getIncidentQualitySummary(): Promise<IncidentQualitySummary> {
  const incidents = await getMockIncidents();
  return summarizeIncidents(incidents);
}

export async function getMockIncidentsWithQuality(): Promise<{
  incidents: IncidentRecord[];
  quality: IncidentQualitySummary;
}> {
  const incidents = await getMockIncidents();
  const quality = summarizeIncidents(incidents);
  return { incidents, quality };
}

function summarizeIncidents(
  incidents: IncidentRecord[],
): IncidentQualitySummary {
  if (incidents.length === 0) {
    return {
      totalRecords: 0,
      timeRange: null,
      invalidLocations: 0,
      missingCoordinates: 0,
      averagePriority: null,
      invalidRecords: 0,
      issues: [],
    };
  }

  const timestamps = incidents
    .map((incident) => new Date(incident.reportedAt).getTime())
    .filter((value) => Number.isFinite(value));
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  const invalidLocations = incidents.filter((incident) => {
    const { latitude, longitude } = incident;
    if (latitude === null || longitude === null) {
      return false;
    }
    return (
      latitude > 90 || latitude < -90 || longitude > 180 || longitude < -180
    );
  }).length;

  const missingCoordinates = incidents.filter(
    (incident) => incident.latitude === null || incident.longitude === null,
  ).length;

  const invalidRecords = incidents.filter(
    (incident) => !incident.id || !incident.reportedAt,
  ).length;

  const averagePriority =
    Math.round(
      (incidents.reduce((acc, curr) => acc + Number(curr.priority ?? 0), 0) /
        incidents.length || 0) * 100,
    ) / 100;

  const issues: IncidentQualityIssue[] = [];

  if (invalidLocations > 0) {
    issues.push({
      id: "invalid-lat-lon",
      message: `${invalidLocations} record(s) contain out-of-bounds coordinates`,
      severity: "high",
      context: "Review latitude/longitude fields before proceeding.",
    });
  }

  if (missingCoordinates > 0) {
    issues.push({
      id: "missing-coordinates",
      message: `${missingCoordinates} record(s) missing coordinates`,
      severity: missingCoordinates > 2 ? "medium" : "low",
      context: "Upload corrections or apply manual overrides in mapping step.",
    });
  }

  if (invalidRecords > 0) {
    issues.push({
      id: "missing-identifiers",
      message: `${invalidRecords} record(s) missing identifiers or timestamps`,
      severity: "medium",
      context: "Ensure each row has a unique id and reported_at timestamp.",
    });
  }

  if (averagePriority < 1 || averagePriority > 3) {
    issues.push({
      id: "priority-outlier",
      message: "Priority field outside expected bounds",
      severity: "low",
      context:
        "Valid priorities should be between 1 (highest) and 3 (monitor).",
    });
  }

  return {
    totalRecords: incidents.length,
    timeRange:
      Number.isFinite(minTime) && Number.isFinite(maxTime)
        ? {
            start: new Date(minTime).toISOString(),
            end: new Date(maxTime).toISOString(),
          }
        : null,
    invalidLocations,
    missingCoordinates,
    averagePriority: Number.isFinite(averagePriority) ? averagePriority : null,
    invalidRecords,
    issues,
  };
}
