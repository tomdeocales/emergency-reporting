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
    <div className="flex min-h-screen bg-muted/30">
      <a className="skip-nav" href="#main-content">
        Skip to main content
      </a>
      <aside className="hidden w-64 flex-col border-r border-border bg-background/90 px-4 py-6 md:flex">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Navigation
        </span>
        <SidebarNav items={navItems} />
      </aside>
      <div className="flex flex-1 flex-col">
        <TopBar
          datasetLabel="MetroFire Mock · Q1"
          status={{ label: "Idle", tone: "idle" }}
          user={{ name: user.name, role: user.role }}
        />
        <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-6 md:px-8">
          <div className="md:hidden">
            <SidebarNav items={navItems} />
          </div>
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
