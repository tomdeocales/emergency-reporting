import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DataIntegration } from "@/types/data";

const STATUS_BADGES: Record<DataIntegration["status"], string> = {
  connected: "bg-emerald-500/10 text-emerald-600",
  syncing: "bg-amber-500/10 text-amber-600",
  error: "bg-red-500/10 text-red-600",
};

export function DataIntegrations({
  integrations,
}: {
  integrations: DataIntegration[];
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {integrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                {integration.name}
              </CardTitle>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGES[integration.status]}`}
              >
                {integration.status === "connected"
                  ? "Connected"
                  : integration.status === "syncing"
                    ? "Syncing"
                    : "Error"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Last synced {formatTimestamp(integration.lastSynced)}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {integration.notes ?? "No notes recorded yet."}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function formatTimestamp(input: string) {
  const timestamp = Date.parse(input);
  if (Number.isNaN(timestamp)) {
    return input;
  }

  return Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
