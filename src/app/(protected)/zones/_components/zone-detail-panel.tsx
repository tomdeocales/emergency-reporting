import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmergencyZone } from "@/types/zones";

import { ZoneStatusBadge } from "./zone-status-badge";

export function ZoneDetailPanel({ zone }: { zone: EmergencyZone }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl font-semibold text-foreground">
              {zone.name}
            </CardTitle>
            <ZoneStatusBadge status={zone.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Commander {zone.commander} • Coverage: {zone.coverageArea}
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="On-call units" value={zone.onCallUnits.toString()} />
          <InfoRow
            label="Active incidents"
            value={zone.activeIncidents.toString()}
          />
          <InfoRow label="Readiness score" value={`${zone.readinessScore}%`} />
          <InfoRow label="Last drill" value={formatTimestamp(zone.lastDrill)} />
          <InfoRow label="Response time" value={zone.responseTimeTrend} />
          <InfoRow label="Incident trend" value={zone.incidentTrend} />
        </CardContent>
      </Card>

      {zone.notes ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Command notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{zone.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
        <header className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Hotspots
            </h2>
            <p className="text-sm text-muted-foreground">
              Incidents within zone boundary contributing to current status.
            </p>
          </div>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zone.hotspots.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">{incident.id}</TableCell>
                <TableCell>{incident.type}</TableCell>
                <TableCell>{incident.priority}</TableCell>
                <TableCell>{incident.status}</TableCell>
                <TableCell>{formatTimestamp(incident.reportedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </p>
  );
}

function formatTimestamp(value: string) {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return value;
  }

  return Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
