"use client";

import { Bell, ChevronDown, Radio } from "lucide-react";
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
import { cn } from "@/lib/utils";

type StatusTone = "idle" | "validating" | "running" | "completed";

type DatasetOption = {
  id: string;
  label: string;
  description?: string;
};

const toneClasses: Record<StatusTone, string> = {
  idle: "bg-muted text-muted-foreground",
  validating:
    "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  running: "bg-primary/10 text-primary",
  completed:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
};

export function TopBar({
  datasetLabel,
  datasetOptions,
  status,
  user,
}: {
  datasetLabel: string;
  datasetOptions?: DatasetOption[];
  status: {
    label: string;
    tone: StatusTone;
  };
  user: {
    name: string;
    role: string;
  };
}) {
  const availableDatasets = useMemo(() => {
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

  const [activeDatasetId, setActiveDatasetId] = useState(
    () => availableDatasets[0]?.id ?? "",
  );

  useEffect(() => {
    const match = availableDatasets.find(
      (option) => option.label === datasetLabel || option.id === datasetLabel,
    );
    if (match) {
      setActiveDatasetId(match.id);
    }
  }, [availableDatasets, datasetLabel]);

  const activeDataset = availableDatasets.find(
    (option) => option.id === activeDatasetId,
  );

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Radio className="h-4 w-4 text-primary" aria-hidden />
          Emergency Reporting
        </div>
        <div className="hidden h-4 w-px bg-border md:block" aria-hidden />
        <DatasetDropdown
          datasets={availableDatasets}
          activeId={activeDatasetId}
          onSelect={setActiveDatasetId}
          label={activeDataset?.label ?? datasetLabel}
        />
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
            toneClasses[status.tone],
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
          {status.label}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" aria-hidden />
        </Button>
        <div className="flex flex-col text-right">
          <span className="font-medium leading-none">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.role}</span>
        </div>
      </div>
    </header>
  );
}

function DatasetDropdown({
  datasets,
  activeId,
  onSelect,
  label,
}: {
  datasets: DatasetOption[];
  activeId: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hidden items-center gap-2 px-3 text-sm md:flex"
          aria-label="Switch dataset"
        >
          {label}
          <ChevronDown className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Datasets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeId}
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
