import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AnalyticsTrendPoint } from "@/types/analytics";

export function VolumeTrendTable({ data }: { data: AnalyticsTrendPoint[] }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Incident volume</h2>
          <p className="text-sm text-muted-foreground">
            Buckets by reported hour with dispatched counts highlighted.
          </p>
        </div>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hour</TableHead>
            <TableHead>Incidents</TableHead>
            <TableHead>Teams dispatched</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((point) => (
            <TableRow key={point.label}>
              <TableCell className="font-medium">{point.label}</TableCell>
              <TableCell>{point.incidents}</TableCell>
              <TableCell>{point.dispatched}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          Heatmap integration is pending; tabular view remains available for
          export.
        </TableCaption>
      </Table>
    </div>
  );
}
