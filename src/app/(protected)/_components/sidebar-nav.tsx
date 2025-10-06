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
              "group relative flex items-center gap-4 rounded-xl px-3 py-2 text-sm font-medium transition-all border",
              isActive
                ? "bg-primary/10 text-primary border-primary/30 ring-1 ring-primary/25 shadow-[inset_0_0_0_1px_hsl(var(--border))]"
                : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:ring-1 hover:ring-border/40",
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
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-all",
                isActive ? "bg-primary" : "bg-transparent group-hover:bg-muted-foreground/40",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
