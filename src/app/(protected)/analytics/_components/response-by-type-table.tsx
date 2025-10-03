import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AnalyticsResponseByType } from "@/types/analytics";

export function ResponseByTypeTable({
  rows,
}: {
  rows: AnalyticsResponseByType[];
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Response by incident type</h2>
          <p className="text-sm text-muted-foreground">
            Average minutes from dispatch acknowledgment to clear per incident
            classification.
          </p>
        </div>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Average response (min)</TableHead>
            <TableHead>Incidents</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.type}>
              <TableCell className="font-medium">{row.type}</TableCell>
              <TableCell>{row.averageMinutes.toFixed(1)}</TableCell>
              <TableCell>{row.incidentCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
