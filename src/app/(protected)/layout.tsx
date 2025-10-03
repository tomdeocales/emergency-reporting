import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { type NavItem, SidebarNav } from "./_components/sidebar-nav";
import { TopBar } from "./_components/top-bar";

async function getCurrentUser() {
  return {
    id: "demo-user-1",
    name: "Avery Parker",
    role: "Incident Commander",
  } as const;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Operations", icon: "operations" },
  { href: "/incidents", label: "Incident Intake", icon: "incidents" },
  { href: "/zones", label: "Zones", icon: "zones" },
  { href: "/alerts", label: "Alerts", icon: "alerts" },
  { href: "/analytics", label: "Analytics", icon: "analytics" },
  { href: "/data", label: "Data", icon: "data" },
];

const datasetOptions = [
  {
    id: "metrofire-q1",
    label: "MetroFire Mock · Q1",
    description: "Current demo dataset",
  },
  {
    id: "metrofire-q2",
    label: "MetroFire Mock · Q2",
    description: "Upcoming scenario refresh",
  },
  {
    id: "northbay",
    label: "North Bay Mutual Aid",
    description: "Regional drill incident feed",
  },
];

const notifications = [
  {
    id: "notif-1",
    title: "Priority-one surge",
    description: "Three incidents logged within Midtown coverage zone.",
    timestamp: "2 min ago",
    isNew: true,
  },
  {
    id: "notif-2",
    title: "Weather advisory",
    description: "Heat index expected to surpass 100°F at 15:00.",
    timestamp: "20 min ago",
  },
  {
    id: "notif-3",
    title: "Data sync",
    description: "Hospital capacity feed recovered after credential refresh.",
    timestamp: "1 hr ago",
  },
];

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <a className="skip-nav" href="#main-content">
        Skip to main content
      </a>
      <aside className="hidden w-72 flex-col gap-6 border-r border-border/80 bg-sidebar px-6 py-8 shadow-sm md:flex">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Navigation
        </span>
        <div className="flex-1 overflow-y-auto pr-2">
          <SidebarNav items={navItems} />
        </div>
      </aside>
      <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-6 md:px-12">
        <TopBar
          datasetLabel="MetroFire Mock · Q1"
          datasetOptions={datasetOptions}
          notifications={notifications}
          status={{ label: "Idle", tone: "idle" }}
          user={{ name: user.name, role: user.role }}
        />
        <div className="flex flex-1 flex-col gap-6">
          <div className="md:hidden">
            <SidebarNav items={navItems} />
          </div>
          <main
            id="main-content"
            className="flex-1 rounded-3xl border border-border/70 bg-background/95 p-6 shadow-md ring-1 ring-border/40 backdrop-blur md:p-10"
            tabIndex={-1}
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
