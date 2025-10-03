import type { Metadata } from "next";

import { getDataWorkspaceSnapshot } from "@/server/services/data-service";

import { DataShell } from "./_sections/data-shell";

export const metadata: Metadata = {
  title: "Data Workspace",
};

export default async function DataPage() {
  const snapshot = await getDataWorkspaceSnapshot();
  return <DataShell snapshot={snapshot} />;
}
