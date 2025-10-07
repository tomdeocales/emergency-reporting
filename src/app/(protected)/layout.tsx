import Image from "next/image";
import Link from "next/link";
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
    <SidebarProvider className="protected-theme">
      <a className="skip-nav" href="#main-content">
        Skip to main content
      </a>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="flex flex-col items-center gap-2 px-0">
          <Link
            href="/"
            aria-label="Return to landing page"
            className="flex w-full items-center justify-center px-4 pt-4"
          >
            <Image
              src="/branding/emergencyreporting-1.png"
              alt="Emergency Reporting"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <span className="text-sm font-semibold tracking-wide text-muted-foreground">
            Emergency Reporting
          </span>
          <div className="mx-8 h-px w-full max-w-[160px] border-b border-border/60" />
        </SidebarHeader>
        <SidebarContent className="pt-1">
          <SidebarNav items={navItems} />
        </SidebarContent>
        <SidebarFooter className="pt-4">
          <SidebarUserPanel
            user={{ name: user.name, role: user.role }}
            notifications={notifications}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="pro-inset">
        {/* Decorative background */}
        <div aria-hidden className="pro-bg fixed inset-0" />
        <div className="relative z-10 flex min-h-screen flex-1 flex-col gap-8 px-4 pb-12 pt-8 md:px-10">
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
              className="pro-surface flex-1 overflow-y-auto rounded-2xl border border-border/60 bg-[#f9f9f9] p-6 shadow-xl ring-1 ring-border/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur md:p-8"
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
