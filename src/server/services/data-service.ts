import { loadStaticJson } from "@/server/fetch/load-static-json";
import type { DataWorkspaceSnapshot } from "@/types/data";

const DATA_WORKSPACE_PATH = "data/mock-datasets.json";

export async function getDataWorkspaceSnapshot() {
  return loadStaticJson<DataWorkspaceSnapshot>(DATA_WORKSPACE_PATH);
}
