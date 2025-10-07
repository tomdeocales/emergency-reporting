import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsMetric } from "@/types/analytics";

export function AnalyticsSummary({ metrics }: { metrics: AnalyticsMetric[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-base font-semibold tracking-tight text-muted-foreground">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold text-foreground">
              {metric.value}
            </p>
            <p className="text-sm text-muted-foreground">
              {metric.change} · {formatTrend(metric.trend)}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function formatTrend(trend: AnalyticsMetric["trend"]) {
  if (trend === "up") return "Trending up";
  if (trend === "down") return "Trending down";
  return "Holding steady";
}
