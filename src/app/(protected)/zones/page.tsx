import type { Metadata } from "next";

import { getZonesSnapshot } from "@/server/services/zones-service";

import { ZonesShell } from "./_sections/zones-shell";

export const metadata: Metadata = {
  title: "Zones",
};

export default async function ZonesPage() {
  const snapshot = await getZonesSnapshot();
  return <ZonesShell snapshot={snapshot} />;
}
