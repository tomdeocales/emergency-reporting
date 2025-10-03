import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataAsset } from "@/types/data";

export function DataAssetsTable({ assets }: { assets: DataAsset[] }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Datasets</h2>
          <p className="text-sm text-muted-foreground">
            Source-of-truth tables powering dashboards and alerting flows.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {assets.length} tracked
        </span>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Records</TableHead>
            <TableHead>Last updated</TableHead>
            <TableHead>Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell className="max-w-[320px] text-sm text-muted-foreground">
                {asset.description}
              </TableCell>
              <TableCell className="uppercase">{asset.format}</TableCell>
              <TableCell>{asset.recordCount.toLocaleString()}</TableCell>
              <TableCell>{formatTimestamp(asset.lastUpdated)}</TableCell>
              <TableCell>{asset.owner}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-3 text-xs text-muted-foreground">
        Retention policies:{" "}
        {assets.map((asset) => `${asset.name} ${asset.retention}`).join(" • ")}
      </p>
    </div>
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
