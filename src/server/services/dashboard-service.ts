import { getMockIncidents } from "@/server/services/incidents-service";
import type { OperationsSnapshot } from "@/types/dashboard";
import type { IncidentRecord } from "@/types/incidents";

export async function getOperationsSnapshot(): Promise<OperationsSnapshot> {
  const incidents = await getMockIncidents();
  const summary = buildOperationsSummary(incidents);
  const incidentTypes = Array.from(
    new Set(
      incidents
        .map((incident) => incident.type)
        .filter((type): type is string => Boolean(type?.length)),
    ),
  ).sort();

  return {
    summary,
    incidents,
    incidentTypes,
  };
}

function buildOperationsSummary(incidents: IncidentRecord[]) {
  const activeStatuses = new Set(["Dispatched", "Investigating"]);
  const activeIncidents = incidents.filter((incident) =>
    activeStatuses.has(incident.status),
  ).length;

  const dispatchedTeams = incidents.filter(
    (incident) => incident.status === "Dispatched",
  ).length;

  const averageResponseMinutes = computeAverageResponseMinutes(incidents);
  const averageResponse = `${Math.floor(averageResponseMinutes)}m ${Math.round((averageResponseMinutes % 1) * 60)}s`;

  const changeVsLastHour = deriveTrend(activeIncidents);

  return {
    activeIncidents,
    dispatchedTeams,
    averageResponse,
    changeVsLastHour,
  } satisfies OperationsSnapshot["summary"];
}

function computeAverageResponseMinutes(incidents: IncidentRecord[]) {
  const baseline = 6.5;
  const adjustment = incidents.reduce((acc, incident) => {
    if (incident.priority === 1) return acc - 0.05;
    if (incident.priority === 3) return acc + 0.05;
    return acc;
  }, 0);

  return Math.max(4.5, baseline + adjustment / incidents.length);
}

function deriveTrend(activeIncidents: number) {
  if (activeIncidents >= 10) return "+3 vs last hour";
  if (activeIncidents >= 5) return "+1 vs last hour";
  return "flat vs last hour";
}
