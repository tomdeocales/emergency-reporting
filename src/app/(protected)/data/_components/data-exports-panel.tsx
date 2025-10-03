"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildPngPlaceholder,
  type ExportColumn,
  exportToCsv,
  exportToJson,
} from "@/lib/export-utils";
import type { DataAsset } from "@/types/data";

const EXPORT_COLUMNS: ExportColumn<DataAsset>[] = [
  { key: "name", label: "Name" },
  { key: "recordCount", label: "Records" },
  { key: "format", label: "Format" },
  { key: "owner", label: "Owner" },
  { key: "retention", label: "Retention" },
];

type PreviewState =
  | { type: "csv" | "json"; content: string }
  | { type: "png"; content: string; filename: string; note: string }
  | null;

export function DataExportsPanel({ assets }: { assets: DataAsset[] }) {
  const [selectedAssetId, setSelectedAssetId] = useState(
    assets[0]?.id ?? "__all",
  );
  const [preview, setPreview] = useState<PreviewState>(null);

  const selectedAsset = useMemo(
    () =>
      selectedAssetId === "__all"
        ? null
        : (assets.find((asset) => asset.id === selectedAssetId) ?? null),
    [assets, selectedAssetId],
  );

  const payloadForExport = selectedAsset ? [selectedAsset] : assets;

  const runCsv = () => {
    setPreview({
      type: "csv",
      content: exportToCsv(payloadForExport, EXPORT_COLUMNS),
    });
  };

  const runJson = () => {
    setPreview({
      type: "json",
      content: exportToJson(selectedAsset ?? assets),
    });
  };

  const runPng = () => {
    const placeholder = buildPngPlaceholder("data-sync");
    setPreview({
      type: "png",
      content: placeholder.dataUrl,
      filename: placeholder.filename,
      note: placeholder.note,
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4 shadow-sm">
      <header className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">Exports</h2>
        <p className="text-sm text-muted-foreground">
          Package datasets for partners or capture snapshots for compliance.
        </p>
      </header>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm" htmlFor="data-export-select">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Dataset
          </span>
          <select
            id="data-export-select"
            className="mt-1 w-64 rounded-md border border-border bg-background px-3 py-2"
            value={selectedAssetId}
            onChange={(event) => setSelectedAssetId(event.target.value)}
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
            <option value="__all">All datasets</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={runCsv}>
            Export CSV
          </Button>
          <Button type="button" variant="outline" onClick={runJson}>
            Export JSON
          </Button>
          <Button type="button" variant="outline" onClick={runPng}>
            Capture PNG summary
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="space-y-3 rounded-lg border border-dashed border-border/70 bg-muted/10 p-4 text-sm">
          {preview.type === "png" ? (
            <div className="space-y-2">
              <p className="font-medium">{preview.filename}</p>
              <Image
                src={preview.content}
                alt="Data export placeholder"
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
          Choose a dataset and trigger an export to preview content before
          delivering files downstream.
        </p>
      )}
    </div>
  );
}
