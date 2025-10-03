import type { Metadata } from "next";

import { IntakeHub } from "./pages/intake-hub";

export const metadata: Metadata = {
  title: "Incident Intake",
};

export default function IncidentsPage() {
  return <IntakeHub />;
}
