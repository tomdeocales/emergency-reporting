import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperationsSummary } from "@/types/dashboard";

const items: Array<keyof OperationsSummary> = [
  "activeIncidents",
  "dispatchedTeams",
  "averageResponse",
  "changeVsLastHour",
];

const labels: Record<keyof OperationsSummary, string> = {
  activeIncidents: "Active incidents",
  dispatchedTeams: "Teams dispatched",
  averageResponse: "Average response",
  changeVsLastHour: "Change vs last hour",
};

export function SummaryCards({ summary }: { summary: OperationsSummary }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((key) => (
        <Card key={key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {labels[key]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight tabular-nums">
              {summary[key]}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
