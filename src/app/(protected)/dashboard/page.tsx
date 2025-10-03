import type { Metadata } from "next";

import { OperationsOverview } from "./pages/operations-overview";

export const metadata: Metadata = {
  title: "Operations Dashboard",
};

export default function DashboardPage() {
  return <OperationsOverview />;
}
