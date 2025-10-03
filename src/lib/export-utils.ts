export type ExportColumn<T> = {
  key: keyof T;
  label: string;
};

export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: ExportColumn<T>[],
) {
  if (!rows.length || !columns.length) {
    return "";
  }

  const header = columns.map((column) => column.label).join(",");
  const serializedRows = rows.map((row) =>
    columns.map((column) => formatCsvValue(row[column.key])).join(","),
  );

  return [header, ...serializedRows].join("\n");
}

export function exportToJson<T>(payload: T) {
  return JSON.stringify(payload, null, 2);
}

const PLACEHOLDER_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

export function buildPngPlaceholder(filename: string) {
  const safeName = filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return {
    filename: safeName ? `${safeName}.png` : "export.png",
    dataUrl: PLACEHOLDER_PIXEL,
    note: "PNG export placeholder — swap with chart capture implementation.",
  } as const;
}

function formatCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value).replace(/"/g, '""');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue}"`;
  }
  return stringValue;
}
