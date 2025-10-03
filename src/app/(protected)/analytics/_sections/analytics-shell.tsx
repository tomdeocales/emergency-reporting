import type { AnalyticsSnapshot } from "@/types/analytics";
import { AnalyticsSummary } from "../_components/analytics-summary";
import { ExportPanel } from "../_components/export-panel";
import { ResponseByTypeTable } from "../_components/response-by-type-table";
import { TimeframeSelector } from "../_components/timeframe-selector";
import { VolumeTrendTable } from "../_components/volume-trend-table";

export function AnalyticsShell({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Historical metrics for command staffing, broken out by incident type
            and hour.
          </p>
        </div>
        <TimeframeSelector
          active={snapshot.activeRange}
          ranges={snapshot.availableRanges}
        />
      </header>

      <AnalyticsSummary metrics={snapshot.metrics} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4">
          <VolumeTrendTable data={snapshot.volumeTrend} />
          <ExportPanel rows={snapshot.exportRows} />
        </div>
        <ResponseByTypeTable rows={snapshot.responseByType} />
      </section>
    </div>
  );
}
