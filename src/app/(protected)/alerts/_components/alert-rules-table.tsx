import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AlertRule } from "@/types/alerts";

export function AlertRulesTable({
  rules,
  onToggle,
}: {
  rules: AlertRule[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-4 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Active rules</h2>
          <p className="text-sm text-muted-foreground">
            Toggle alert coverage or drill into notification routing at any
            time.
          </p>
        </div>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rule</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Channels</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last triggered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell className="capitalize">{rule.condition}</TableCell>
              <TableCell>{rule.threshold}</TableCell>
              <TableCell className="capitalize">
                {rule.channels.join(", ")}
              </TableCell>
              <TableCell>
                <span
                  className={
                    rule.isActive
                      ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600"
                      : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                  }
                >
                  {rule.isActive ? "Active" : "Paused"}
                </span>
              </TableCell>
              <TableCell>
                {rule.lastTriggered
                  ? new Date(rule.lastTriggered).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onToggle(rule.id)}
                >
                  {rule.isActive ? "Pause" : "Resume"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
