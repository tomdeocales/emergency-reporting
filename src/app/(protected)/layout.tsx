import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { ChatWidget } from "./_components/chat-widget";
import { type NavItem, SidebarNav } from "./_components/sidebar-nav";
import { SidebarUserPanel } from "./_components/sidebar-user-panel";
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
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col gap-6 border-r border-border/60 bg-sidebar/95 px-6 py-8 shadow-lg ring-1 ring-border/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur md:flex">
        <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>Navigation</span>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <SidebarNav items={navItems} />
        </div>
        <SidebarUserPanel
          user={{ name: user.name, role: user.role }}
          notifications={notifications}
        />
      </aside>
      <div className="md:pl-[18rem] flex min-h-screen flex-1 flex-col gap-6 px-4 pb-10 pt-6 md:pl-[20rem] md:px-12">
        <TopBar
          datasetLabel="MetroFire Mock · Q1"
          datasetOptions={datasetOptions}
          status={{ label: "Idle", tone: "idle" }}
        />
        <div className="flex flex-1 flex-col gap-6">
          <div className="md:hidden">
            <SidebarNav items={navItems} />
          </div>
          <main
            id="main-content"
            className="flex-1 overflow-y-auto rounded-3xl border border-border/70 bg-background/95 p-6 shadow-md ring-1 ring-border/40 backdrop-blur md:p-10"
            tabIndex={-1}
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
              {children}
            </div>
          </main>
        </div>
        <ChatWidget />
      </div>
    </div>
  );
}
