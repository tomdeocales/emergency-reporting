"use client";

import Papa from "papaparse";
import type { ChangeEvent, DragEventHandler } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IncidentQualitySummary, IncidentRecord } from "@/types/incidents";
import { MapPanel } from "../../dashboard/_components/map-panel";

const incidentRowSchema = z.object({
  reportedAt: z
    .string()
    .min(1, "Timestamp required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid timestamp"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  type: z.string().min(1),
  priority: z.coerce.number().int().min(1).max(3),
});

const REQUIRED_FIELDS = [
  { key: "reportedAt", label: "Reported at" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
  { key: "type", label: "Incident type" },
  { key: "priority", label: "Priority" },
] as const;

const DEFAULT_MAPPING: Record<(typeof REQUIRED_FIELDS)[number]["key"], string> =
  {
    reportedAt: "reported_at",
    latitude: "lat",
    longitude: "lon",
    type: "type",
    priority: "priority",
  };

type ToastState = {
  id: string;
  title: string;
  description?: string;
  tone: "success" | "error" | "info";
};

type SampleRow = Record<string, string>;

type UploadWorkspaceProps = {
  incidents: IncidentRecord[];
  quality: IncidentQualitySummary;
};

export function UploadWorkspace({ incidents, quality }: UploadWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<SampleRow[]>([]);
  const [mapping, setMapping] = useState(DEFAULT_MAPPING);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const recentIncidents = useMemo(() => incidents.slice(0, 5), [incidents]);

  const qualityIssues = quality.issues.slice(0, 4);

  const coordinateSummary = useMemo(() => {
    const valid = incidents.filter((incident) => {
      if (
        typeof incident.latitude !== "number" ||
        typeof incident.longitude !== "number"
      ) {
        return false;
      }

      return (
        Number.isFinite(incident.latitude) &&
        Number.isFinite(incident.longitude) &&
        incident.latitude >= -90 &&
        incident.latitude <= 90 &&
        incident.longitude >= -180 &&
        incident.longitude <= 180
      );
    });
    if (!valid.length) {
      return null;
    }

    const latitudes = valid.map((incident) => incident.latitude as number);
    const longitudes = valid.map((incident) => incident.longitude as number);

    const centerLat =
      latitudes.reduce((sum, value) => sum + value, 0) / valid.length;
    const centerLon =
      longitudes.reduce((sum, value) => sum + value, 0) / valid.length;

    return {
      count: valid.length,
      center: {
        lat: centerLat,
        lon: centerLon,
      },
      bounds: {
        north: Math.max(...latitudes),
        south: Math.min(...latitudes),
        east: Math.max(...longitudes),
        west: Math.min(...longitudes),
      },
    };
  }, [incidents]);

  const handleFileSelection = async (file: File) => {
    setFileName(file.name);
    setValidationErrors([]);
    setValidationState("idle");

    const text = await file.text();
    const result = (Papa as unknown as {
      parse: (input: string, config: unknown) => {
        data: SampleRow[];
        meta: { fields?: string[] };
        errors: { message: string }[];
      };
    }).parse(text, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim(),
    });

    if (result.errors?.length) {
      setToast({
        id: "parse-error",
        title: "We hit an issue parsing the file",
        description: result.errors[0]?.message,
        tone: "error",
      });
      setSampleRows([]);
      setColumns([]);
      return;
    }

    const rows = result.data.slice(0, 10);
    setSampleRows(rows);

    if (result.meta?.fields?.length) {
      const availableColumns = result.meta.fields;
      setColumns(availableColumns);
      setMapping((prev) => {
        const next = { ...prev };
        for (const field of REQUIRED_FIELDS) {
          if (!availableColumns.includes(next[field.key])) {
            next[field.key] = availableColumns[0] ?? next[field.key];
          }
        }
        return next;
      });
    }

    setToast({
      id: "file-loaded",
      title: "File ready for mapping",
      description: `${rows.length} sample rows captured for validation`,
      tone: "info",
    });
  };

  const onFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileSelection(file);
    }
  };

  const handleDrop: DragEventHandler<HTMLLabelElement> = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await handleFileSelection(file);
    }
  };

  const validateMapping = async () => {
    if (!sampleRows.length) {
      setToast({
        id: "no-sample",
        title: "Add a file before validating",
        tone: "error",
      });
      return;
    }

    setIsValidating(true);
    const errors: string[] = [];

    for (const field of REQUIRED_FIELDS) {
      if (!columns.includes(mapping[field.key])) {
        errors.push(
          `Column "${mapping[field.key]}" missing for ${field.label}`,
        );
      }
    }

    if (!errors.length) {
      for (const [index, row] of sampleRows.entries()) {
        const mappedRow = {
          reportedAt: row[mapping.reportedAt] ?? "",
          latitude: row[mapping.latitude] ?? "",
          longitude: row[mapping.longitude] ?? "",
          type: row[mapping.type] ?? "",
          priority: row[mapping.priority] ?? "",
        };
        const parsed = incidentRowSchema.safeParse(mappedRow);
        if (!parsed.success) {
          parsed.error.issues.forEach((issue) => {
            errors.push(`Row ${index + 1}: ${issue.message}`);
          });
        }
      }
    }

    if (errors.length) {
      setValidationErrors(errors);
      setValidationState("error");
      setToast({
        id: "validation-failed",
        title: "Mapping needs attention",
        description: `${errors.length} check(s) failed. Review the list below before continuing.`,
        tone: "error",
      });
    } else {
      setValidationErrors([]);
      setValidationState("success");
      setToast({
        id: "validation-success",
        title: "Mapping looks good",
        description:
          "You can proceed to save this profile or upload another file.",
        tone: "success",
      });
    }

    setIsValidating(false);
  };

  const resetUpload = () => {
    setFileName(null);
    setColumns([]);
    setSampleRows([]);
    setMapping(DEFAULT_MAPPING);
    setValidationErrors([]);
    setValidationState("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section className="space-y-6">
        <Card>
          <CardHeader className="gap-2">
            <CardTitle>Upload new incident data</CardTitle>
            <CardDescription>
              Drag in a CSV export or choose a file. We will validate the core
              fields and surface mapping guidance before this dataset is staged
              for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-10 text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,text/csv"
                onChange={onFileInputChange}
              />
              <span className="text-sm font-medium text-foreground">
                {fileName ?? "Drop a CSV here or browse for one"}
              </span>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse files
              </Button>
            </label>
            {sampleRows.length > 0 ? (
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {REQUIRED_FIELDS.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label
                        className="text-sm font-medium text-muted-foreground"
                        htmlFor={`mapping-${field.key}`}
                      >
                        {field.label}
                      </label>
                      <select
                        id={`mapping-${field.key}`}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                        value={mapping[field.key]}
                        onChange={(event) =>
                          setMapping((prev) => ({
                            ...prev,
                            [field.key]: event.target.value,
                          }))
                        }
                      >
                        {columns.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleRows.map((row) => {
                        const rowKey = columns
                          .map((column) => row[column])
                          .join("|");
                        return (
                          <TableRow key={rowKey || row[columns[0]]}>
                            {columns.map((column) => (
                              <TableCell key={column}>{row[column]}</TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-muted-foreground">
                    {validationState === "success" &&
                      "Mapping validated against sample rows."}
                    {validationState === "error" &&
                      `${validationErrors.length} validation error(s) detected.`}
                    {validationState === "idle" &&
                      "Review the column matching, then run validation."}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetUpload}
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      onClick={validateMapping}
                      disabled={isValidating}
                    >
                      {isValidating ? "Validating..." : "Validate mapping"}
                    </Button>
                  </div>
                </div>
                {validationErrors.length > 0 && (
                  <ul className="list-disc space-y-1 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {validationErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-md border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                Mapping controls unlock after a sample file is loaded. Expect
                columns `reported_at`, `lat`, `lon`, `type`, and `priority` with
                UTC timestamps.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing staged files</CardTitle>
            <CardDescription>
              Preview the latest ingested records before promoting them to the
              operational dataset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>
                      {new Date(incident.reportedAt).toLocaleString(undefined, {
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell>{incident.type}</TableCell>
                    <TableCell className="text-right">
                      {incident.priority}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality summary</CardTitle>
            <CardDescription>
              Automated checks from the previous upload cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Metric label="Rows" value={quality.totalRecords.toString()} />
              <Metric
                label="Time span"
                value={
                  quality.timeRange
                    ? `${new Date(quality.timeRange.start).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )} - ${new Date(quality.timeRange.end).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )}`
                    : "n/a"
                }
              />
              <Metric
                label="Invalid coords"
                value={quality.invalidLocations.toString()}
              />
              <Metric
                label="Missing coords"
                value={quality.missingCoordinates.toString()}
              />
              <Metric
                label="Avg priority"
                value={quality.averagePriority?.toFixed(2) ?? "n/a"}
              />
              <Metric
                label="Records flagged"
                value={quality.invalidRecords.toString()}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Issues</h3>
              {qualityIssues.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No outstanding issues for this batch. Run validation after
                  uploading a new file.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {qualityIssues.map((issue) => (
                    <li
                      key={issue.id}
                      className="rounded-md border border-border/60 bg-muted/30 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{issue.message}</span>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          {issue.severity}
                        </span>
                      </div>
                      {issue.context ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {issue.context}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Map preview</CardTitle>
            <CardDescription>
              Quick look at where this batch of incidents will land once
              ingested.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 flex-col justify-between rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                City overlay (mock)
              </div>
              {coordinateSummary ? (
                <div className="space-y-2 text-sm text-foreground">
                  <p>
                    <span className="font-medium">Center:</span>{" "}
                    {formatCoordinate(coordinateSummary.center.lat, "lat")},{" "}
                    {formatCoordinate(coordinateSummary.center.lon, "lon")}
                  </p>
                  <p>
                    <span className="font-medium">Bounds:</span>{" "}
                    {formatCoordinate(coordinateSummary.bounds.north, "lat")} /{" "}
                    {formatCoordinate(coordinateSummary.bounds.south, "lat")},{" "}
                    {formatCoordinate(coordinateSummary.bounds.east, "lon")} /{" "}
                    {formatCoordinate(coordinateSummary.bounds.west, "lon")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {coordinateSummary.count} incident(s) contain valid
                    coordinates.
                  </p>
                </div>
              ) : (
                <p className="text-sm">
                  Upload a dataset with latitude and longitude to preview
                  location coverage.
                </p>
              )}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMapOpen(true)}
                >
                  Open full map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>
              Keep the dataset clean by running validation on each import and
              resolving blockers before proceeding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Validate mapping and resolve any column mismatches.</p>
            <p>
              2. Download the quality report as CSV once all issues are
              reviewed.
            </p>
            <p>
              3. Promote the staged dataset into the operations environment.
            </p>
          </CardContent>
        </Card>
      </aside>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Incident map preview</DialogTitle>
            <DialogDescription>
              Explore the current batch of incidents on the full-screen map
              before promoting the dataset into operations.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[520px] w-full overflow-hidden rounded-xl">
            <MapPanel incidents={incidents} className="h-full" />
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-background p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-foreground">
        {value}
      </div>
    </div>
  );
}

function ToastContainer({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  const toneClasses: Record<ToastState["tone"], string> = {
    success: "border-emerald-200 bg-emerald-100 text-emerald-900",
    error: "border-destructive/60 bg-destructive/10 text-destructive",
    info: "border-primary/40 bg-primary/10 text-primary",
  };

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-50 flex max-w-sm flex-col gap-2">
      <div
        className={`pointer-events-auto rounded-md border px-4 py-3 shadow-lg ${toneClasses[toast.tone]}`}
        aria-live="assertive"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-sm text-current/90">
                {toast.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm font-medium text-current/60 transition hover:text-current"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function formatCoordinate(value: number, type: "lat" | "lon") {
  const direction =
    value >= 0 ? (type === "lat" ? "N" : "E") : type === "lat" ? "S" : "W";
  return `${Math.abs(value).toFixed(4)}°${direction}`;
}
