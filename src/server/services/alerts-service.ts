import { getMockIncidents } from "@/server/services/incidents-service";
import type { AlertCatalog, AlertSuggestion } from "@/types/alerts";

export async function getAlertCatalog(): Promise<AlertCatalog> {
  const incidents = await getMockIncidents();

  const priorityOne = incidents.filter((incident) => incident.priority === 1);
  const activeInvestigations = incidents.filter(
    (incident) => incident.status === "Investigating",
  );

  const suggestions: AlertSuggestion[] = [
    {
      id: "suggest-priority-surge",
      title: "Watch for repeated priority-one dispatches",
      description: `Detected ${priorityOne.length} high-priority incidents in the latest window. Consider upping SMS and push notifications for on-call leads when the count exceeds four in an hour.`,
    },
    {
      id: "suggest-investigation-review",
      title: "Follow up on outstanding investigations",
      description: `${activeInvestigations.length} incident(s) remain in Investigating. Trigger a checklist reminder if an item stays open more than 45 minutes.`,
    },
  ];

  return {
    rules: [
      {
        id: "rule-hotspot",
        name: "Priority-1 hotspot",
        description:
          "Alert commanders when three priority-one incidents are logged within 30 minutes.",
        condition: "priority",
        threshold: 3,
        channels: ["sms", "push"],
        isActive: true,
        lastTriggered: "2024-01-01T02:20:00Z",
      },
      {
        id: "rule-ems-surge",
        name: "EMS surge",
        description:
          "Notify analytics team if EMS calls exceed five in a rolling hour to rebalance coverage.",
        condition: "type",
        threshold: 5,
        channels: ["email"],
        isActive: true,
        lastTriggered: "2024-01-01T02:06:00Z",
      },
      {
        id: "rule-stale-investigation",
        name: "Investigation timeout",
        description:
          "Escalate when an investigation remains open longer than 45 minutes without status change.",
        condition: "status",
        threshold: 45,
        channels: ["email", "push"],
        isActive: false,
        lastTriggered: null,
      },
    ],
    suggestions,
  };
}
