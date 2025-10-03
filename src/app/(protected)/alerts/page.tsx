import type { Metadata } from "next";

import { getAlertCatalog } from "@/server/services/alerts-service";

import { AlertsShell } from "./_sections/alerts-shell";

export const metadata: Metadata = {
  title: "Alerts",
};

export default async function AlertsPage() {
  const catalog = await getAlertCatalog();
  return <AlertsShell catalog={catalog} />;
}
