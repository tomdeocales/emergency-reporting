import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

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
    <SidebarProvider className="bg-muted/15">
      <a className="skip-nav" href="#main-content">
        Skip to main content
      </a>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-base font-semibold uppercase text-primary">
              A
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-foreground">
                Acme Response
              </span>
              <span className="text-xs text-muted-foreground">
                Operations Console
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="pt-4">
          <SidebarNav items={navItems} />
        </SidebarContent>
        <SidebarFooter className="pt-4">
          <SidebarUserPanel
            user={{ name: user.name, role: user.role }}
            notifications={notifications}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/15">
        <div className="flex min-h-screen flex-1 flex-col gap-8 px-4 pb-12 pt-8 md:px-10">
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
              className="flex-1 overflow-y-auto rounded-xl border border-border/70 bg-background p-6 shadow-md ring-1 ring-border/30 md:p-8"
              tabIndex={-1}
            >
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                {children}
              </div>
            </main>
          </div>
          <ChatWidget />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
