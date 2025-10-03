"use client";

import {
  Database,
  FileText,
  Layers,
  Map as MapIcon,
  Radar,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ICONS = {
  operations: Radar,
  incidents: Upload,
  zones: MapIcon,
  alerts: FileText,
  analytics: Layers,
  data: Database,
} as const;

export type NavIconKey = keyof typeof NAV_ICONS;

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconKey;
};

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex flex-col gap-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        const Icon = NAV_ICONS[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/40"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:ring-1 hover:ring-border/50",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon ? (
              <Icon
                className="h-4 w-4 transition-transform group-hover:scale-110"
                aria-hidden
              />
            ) : null}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
