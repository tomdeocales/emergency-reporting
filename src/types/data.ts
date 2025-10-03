export type DataAssetFormat = "csv" | "json" | "geojson" | "parquet";

export type DataAsset = {
  id: string;
  name: string;
  description: string;
  recordCount: number;
  format: DataAssetFormat;
  lastUpdated: string;
  owner: string;
  tags: string[];
  retention: string;
};

export type DataIntegration = {
  id: string;
  name: string;
  status: "connected" | "syncing" | "error";
  lastSynced: string;
  notes?: string;
};

export type DataWorkspaceSnapshot = {
  assets: DataAsset[];
  integrations: DataIntegration[];
};
