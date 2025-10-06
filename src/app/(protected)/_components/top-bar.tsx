"use client";

import { ChevronDown, Radio } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type StatusTone = "idle" | "validating" | "running" | "completed";

type DatasetOption = {
  id: string;
  label: string;
  description?: string;
};

export function TopBar({
  datasetLabel,
  datasetOptions,
  status,
}: {
  datasetLabel: string;
  datasetOptions?: DatasetOption[];
  status: {
    label: string;
    tone: StatusTone;
  };
}) {
  const options = useMemo(() => {
    if (datasetOptions?.length) {
      return datasetOptions;
    }
    return [
      {
        id: datasetLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: datasetLabel,
      },
    ];
  }, [datasetOptions, datasetLabel]);

  const [activeId, setActiveId] = useState<string>(options[0]?.id ?? "");

  useEffect(() => {
    const match = options.find(
      (option) => option.label === datasetLabel || option.id === datasetLabel,
    );
    if (match) {
      setActiveId(match.id);
    }
  }, [options, datasetLabel]);

  const active = options.find((option) => option.id === activeId) ?? options[0];

  return (
    <header className="sticky top-2 z-20 flex h-16 items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 shadow-md ring-1 ring-border/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur md:px-8">
      <div className="flex items-center gap-3 md:gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Radio className="h-4 w-4 text-primary" aria-hidden />
          Live Dataset
        </div>
        <div className="hidden h-4 w-px bg-border md:block" aria-hidden />
        <DatasetDropdown
          datasets={options}
          activeId={active.id}
          onSelect={setActiveId}
        />
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm",
            status.tone === "idle" && "border-border/60 bg-muted text-muted-foreground",
            status.tone === "validating" &&
              "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
            status.tone === "running" && "border-primary/30 bg-primary/5 text-primary",
            status.tone === "completed" &&
              "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
          {status.label}
        </span>
      </div>
    </header>
  );
}

function DatasetDropdown({
  datasets,
  activeId,
  onSelect,
}: {
  datasets: DatasetOption[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const active =
    datasets.find((dataset) => dataset.id === activeId) ?? datasets[0];

  if (!active) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          id="dataset-menu-trigger"
          suppressHydrationWarning
          className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm md:flex border-[#EAB308] bg-[#EAB308] text-white transition-colors hover:bg-[#FACC15] hover:border-[#FACC15] focus-visible:ring-[#FACC15]/40"
          aria-label="Switch dataset"
        >
          {active.label}
          <ChevronDown className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Datasets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={active.id}
          onValueChange={onSelect}
          aria-label="Select dataset"
        >
          {datasets.map((dataset) => (
            <DropdownMenuRadioItem key={dataset.id} value={dataset.id}>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-foreground">
                  {dataset.label}
                </span>
                {dataset.description ? (
                  <span className="text-xs text-muted-foreground">
                    {dataset.description}
                  </span>
                ) : null}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
