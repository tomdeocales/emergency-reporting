"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildPngPlaceholder,
  type ExportColumn,
  exportToCsv,
  exportToJson,
} from "@/lib/export-utils";
import type { AnalyticsExportRow } from "@/types/analytics";

type ExportPreview =
  | { type: "csv" | "json"; content: string }
  | { type: "png"; content: string; filename: string; note: string };

const EXPORT_COLUMNS: ExportColumn<AnalyticsExportRow>[] = [
  { key: "label", label: "Label" },
  { key: "incidents", label: "Incidents" },
  { key: "averageMinutes", label: "Avg minutes" },
];

export function ExportPanel({ rows }: { rows: AnalyticsExportRow[] }) {
  const [preview, setPreview] = useState<ExportPreview | null>(null);

  const runCsvExport = () => {
    setPreview({ type: "csv", content: exportToCsv(rows, EXPORT_COLUMNS) });
  };

  const runJsonExport = () => {
    setPreview({ type: "json", content: exportToJson(rows) });
  };

  const runPngExport = () => {
    const placeholder = buildPngPlaceholder("analytics-trend");
    setPreview({
      type: "png",
      content: placeholder.dataUrl,
      filename: placeholder.filename,
      note: placeholder.note,
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4 shadow-sm">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Exports</h2>
        <p className="text-sm text-muted-foreground">
          Generate CSV, JSON, or preview chart snapshots straight from the trend
          datasets.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={runCsvExport}>
          Download CSV
        </Button>
        <Button type="button" variant="outline" onClick={runJsonExport}>
          Download JSON
        </Button>
        <Button type="button" variant="outline" onClick={runPngExport}>
          Capture PNG
        </Button>
      </div>

      {preview ? (
        <div className="space-y-3 rounded-lg border border-dashed border-border/70 bg-muted/10 p-4 text-sm">
          {preview.type === "png" ? (
            <div className="space-y-2">
              <p className="font-medium">{preview.filename}</p>
              <Image
                src={preview.content}
                alt="Analytics export placeholder"
                width={80}
                height={80}
                className="h-20 w-20 rounded border border-border"
                loading="lazy"
              />
              <p className="text-xs text-muted-foreground">{preview.note}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">
                {preview.type === "csv" ? "CSV preview" : "JSON preview"}
              </p>
              <textarea
                className="h-40 w-full rounded-md border border-border bg-background p-3 font-mono text-xs"
                value={preview.content}
                readOnly
              />
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-xs text-muted-foreground">
          Trigger an export to preview file contents. Integrate with a download
          handler before production rollout.
        </p>
      )}
    </div>
  );
}
