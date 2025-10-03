"use client";

import { Button } from "@/components/ui/button";

export type TimelineTick = {
  value: number;
  label: string;
};

export type TimelineScrubberProps = {
  ticks: TimelineTick[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
};

export function TimelineScrubber({
  ticks,
  activeIndex,
  onIndexChange,
  isPlaying,
  onTogglePlay,
}: TimelineScrubberProps) {
  const hasTicks = ticks.length > 0;
  const maxIndex = Math.max(ticks.length - 1, 0);
  const startLabel = hasTicks ? ticks[0]?.label : "Start";
  const endLabel = hasTicks ? ticks[maxIndex]?.label : "End";
  const activeLabel = hasTicks ? ticks[activeIndex]?.label : "";
  const disablePlayback = ticks.length < 2;

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-muted/10 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Timeline scrubber
          </p>
          <p className="text-sm text-muted-foreground">
            {hasTicks
              ? `Showing incidents through ${activeLabel}.`
              : "Upload incident data to view timeline playback."}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onTogglePlay}
          disabled={disablePlayback}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="shrink-0 text-xs text-muted-foreground">
          {startLabel}
        </span>
        <input
          type="range"
          min={0}
          max={maxIndex}
          step={1}
          value={hasTicks ? activeIndex : 0}
          onChange={(event) => onIndexChange(Number(event.target.value))}
          aria-label="Incident timeline scrubber"
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
        />
        <span className="shrink-0 text-xs text-muted-foreground">
          {endLabel}
        </span>
      </div>
    </div>
  );
}
