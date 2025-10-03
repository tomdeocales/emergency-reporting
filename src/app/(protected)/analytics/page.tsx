import type { Metadata } from "next";

import { getAnalyticsSnapshot } from "@/server/services/analytics-service";
import type { AnalyticsRange } from "@/types/analytics";

import { AnalyticsShell } from "./_sections/analytics-shell";

export const metadata: Metadata = {
  title: "Analytics Overview",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: { range?: string };
}) {
  const candidate = searchParams?.range as AnalyticsRange | undefined;
  const range: AnalyticsRange =
    candidate && isValidRange(candidate) ? candidate : "24h";
  const snapshot = await getAnalyticsSnapshot(range);
  return <AnalyticsShell snapshot={snapshot} />;
}

function isValidRange(range: string): range is AnalyticsRange {
  return range === "24h" || range === "7d" || range === "30d";
}
