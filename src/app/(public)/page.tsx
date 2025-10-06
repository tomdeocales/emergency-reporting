import { Activity, TrendingUp, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Highlight = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
};

const highlights: Highlight[] = [
  {
    title: "Live Situation Awareness",
    description:
      "Monitor simulated incident volume, responder availability, and system health from a single command view.",
    Icon: Activity,
    bg: "/branding/LiveSituationalAwareness-Background.png",
  },
  {
    title: "Rapid Intake Workflows",
    description:
      "Verify uploads, enrich with location context, and push ready-to-use datasets directly to operations teams.",
    Icon: Upload,
    bg: "/branding/RapidIntakeWorkflows-Background.png",
  },
  {
    title: "Analytics Ready",
    description:
      "Pull evidence from historical runs, drill into zones, and hand off action plans with guardrails baked in.",
    Icon: TrendingUp,
    bg: "/branding/AnalyticsReady-Background.png",
  },
];

export default function LandingPage() {
  return (
    <div className="relative isolate bg-gradient-to-b from-background to-muted/40">
      {/* background brand accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-8rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(220,38,38,0.08),transparent_70%)] blur-2xl" />
      </div>

      <header className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center gap-8 px-6 pb-16 pt-24 text-center sm:gap-10">
        <Image
          src="/branding/emergency-reporting-logo.png"
          alt="Emergency Reporting"
          width={200}
          height={42}
          priority
        />
        <span className="rounded-full border border-border bg-background/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
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
          <Button
            size="lg"
            asChild
            className="bg-red-600 text-white hover:bg-red-700 border-transparent"
          >
            <Link href="/dashboard">Enter command center</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/60 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            <Link href="#capabilities">View capabilities</Link>
          </Button>
        </div>
      </header>

      <main id="capabilities" className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ title, description, Icon, bg }) => (
            <Card
              key={title}
              className="group relative isolate h-full overflow-hidden border-border/80 shadow-xs transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-sm"
            >
              {/* Hover background image */}
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Image
                  src={bg}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/45" />

              <CardHeader className="space-y-3 transition-colors duration-300">
                <div className="inline-flex size-9 items-center justify-center rounded-md border border-red-200 bg-red-50/80 text-red-600 ring-0 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white dark:border-white/20">
                  <Icon className="size-4" />
                </div>
                <CardTitle className="text-lg font-semibold transition-colors duration-300 group-hover:text-white">
                  {title}
                </CardTitle>
                <CardDescription className="transition-colors duration-300 group-hover:text-white/90">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="transition-all duration-300 group-hover:translate-y-0.5 group-hover:opacity-0">
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
