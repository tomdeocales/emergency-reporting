import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "Live Situation Awareness",
    description:
      "Monitor simulated incident volume, responder availability, and system health from a single command view.",
  },
  {
    title: "Rapid Intake Workflows",
    description:
      "Verify uploads, enrich with location context, and push ready-to-use datasets directly to operations teams.",
  },
  {
    title: "Analytics Ready",
    description:
      "Pull evidence from historical runs, drill into zones, and hand off action plans with guardrails baked in.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-background to-muted/40">
      <header className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 pb-16 pt-24 text-center">
        <span className="rounded-full border border-border bg-background/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Emergency Operations Demo
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Coordinate incident response with confidence—even when you are
            offline.
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            This guided preview mirrors the live environment used by dispatch
            supervisors to review incidents, map hotspots, and configure
            escalation alerts. All data is mocked so you can explore the flows
            without connecting to production systems.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/dashboard">Enter command center</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#capabilities">View capabilities</Link>
          </Button>
        </div>
      </header>

      <main id="capabilities" className="mx-auto w-full max-w-5xl px-6 pb-24">
        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="h-full border-border/80">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Walk through the protected area of the app to see this
                  capability in action using realistic data stories, curated
                  checklists, and configurable parameters.
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
