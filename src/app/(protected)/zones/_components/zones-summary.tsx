import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ZoneStatus } from "@/types/zones";

const STATUS_COPY: Record<ZoneStatus, { label: string; tone: string }> = {
  Stable: { label: "Stable", tone: "text-emerald-600" },
  Watch: { label: "Elevated", tone: "text-amber-600" },
  Critical: { label: "Critical", tone: "text-red-600" },
};

export function ZonesSummary({
  overall,
  byStatus,
  personnel,
}: {
  overall: number;
  byStatus: Record<ZoneStatus, number>;
  personnel: number;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Active zones
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold text-foreground">
          {overall}
        </CardContent>
      </Card>
      {(Object.keys(STATUS_COPY) as ZoneStatus[]).map((status) => (
        <Card key={status}>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-muted-foreground">
              {STATUS_COPY[status].label}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`text-3xl font-semibold ${STATUS_COPY[status].tone}`}
          >
            {byStatus[status] ?? 0}
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Personnel on call
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold text-foreground">
          {personnel}
        </CardContent>
      </Card>
    </section>
  );
}
