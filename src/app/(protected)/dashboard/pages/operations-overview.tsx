import { getOperationsSnapshot } from "@/server/services/dashboard-service";

import { OperationsShell } from "../_sections/operations-shell";

export async function OperationsOverview() {
  const snapshot = await getOperationsSnapshot();
  return <OperationsShell snapshot={snapshot} />;
}
