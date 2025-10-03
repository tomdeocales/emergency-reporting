import { Button } from "@/components/ui/button";
import type { AnalyticsRange } from "@/types/analytics";

export function TimeframeSelector({
  active,
  ranges,
}: {
  active: AnalyticsRange;
  ranges: AnalyticsRange[];
}) {
  return (
    <form className="flex flex-wrap items-end gap-3" method="get">
      <label className="flex flex-col text-sm" htmlFor="analytics-range">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Timeframe
        </span>
        <select
          id="analytics-range"
          name="range"
          defaultValue={active}
          className="mt-1 w-48 rounded-md border border-border bg-background px-3 py-2"
        >
          {ranges.map((range) => (
            <option key={range} value={range}>
              {formatRangeLabel(range)}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" variant="outline" size="sm">
        Apply range
      </Button>
    </form>
  );
}

function formatRangeLabel(range: AnalyticsRange) {
  if (range === "24h") return "Last 24 hours";
  if (range === "7d") return "Last 7 days";
  return "Last 30 days";
}
