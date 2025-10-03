import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AlertChannel } from "@/types/alerts";

export type AlertRuleFormState = {
  name: string;
  description: string;
  condition: "priority" | "type" | "status";
  threshold: number;
  channels: AlertChannel[];
};

export function AlertRuleForm({
  formState,
  onFieldChange,
  onChannelToggle,
  onSubmit,
  feedback,
  permission,
  onRequestPermission,
}: {
  formState: AlertRuleFormState;
  onFieldChange: <K extends keyof AlertRuleFormState>(
    key: K,
    value: AlertRuleFormState[K],
  ) => void;
  onChannelToggle: (channel: AlertChannel) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  feedback: { status: "success" | "error"; message: string } | null;
  permission: NotificationPermission;
  onRequestPermission: () => void | Promise<void>;
}) {
  const channels: AlertChannel[] = ["sms", "email", "push"];

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-border bg-background p-5 shadow-sm"
    >
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Create alert rule</h2>
        <p className="text-sm text-muted-foreground">
          Configure threshold-driven notifications for emerging incident trends.
        </p>
      </header>
      <div className="grid gap-3">
        <label className="space-y-1 text-sm" htmlFor="alert-name">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Rule name
          </span>
          <Input
            id="alert-name"
            value={formState.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            placeholder="High-priority surge"
            required
          />
        </label>
        <label className="space-y-1 text-sm" htmlFor="alert-description">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </span>
          <textarea
            id="alert-description"
            className="h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={formState.description}
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
            placeholder="Alert command staff after three priority-one incidents in an hour."
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm" htmlFor="alert-condition">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Condition
            </span>
            <select
              id="alert-condition"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
              value={formState.condition}
              onChange={(event) =>
                onFieldChange(
                  "condition",
                  event.target.value as AlertRuleFormState["condition"],
                )
              }
            >
              <option value="priority">Priority threshold</option>
              <option value="type">Specific incident type</option>
              <option value="status">Status duration</option>
            </select>
          </label>
          <label className="space-y-1 text-sm" htmlFor="alert-threshold">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Threshold
            </span>
            <Input
              id="alert-threshold"
              type="number"
              min={1}
              value={formState.threshold}
              onChange={(event) =>
                onFieldChange("threshold", Number(event.target.value))
              }
            />
          </label>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Channels
          </legend>
          <div className="flex flex-wrap gap-3">
            {channels.map((channel) => {
              const checked = formState.channels.includes(channel);

              return (
                <label
                  key={channel}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChannelToggle(channel)}
                    className="h-4 w-4 rounded border border-border"
                  />
                  <span className="capitalize">{channel}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Save rule &amp; preview notification</Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRequestPermission}
        >
          {permission === "granted"
            ? "Notification enabled"
            : "Request permission"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Permission: {permission}
        </span>
      </div>

      {feedback ? (
        <p className={buildFeedbackClasses(feedback.status)}>
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}

function buildFeedbackClasses(status: "success" | "error") {
  if (status === "success") {
    return "rounded-md border border-emerald-500 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700";
  }

  return "rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive";
}
