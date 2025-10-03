"use client";

import type { FormEventHandler } from "react";
import { useState } from "react";

import { useMockNotification } from "@/hooks/use-mock-notification";
import type { AlertCatalog, AlertChannel, AlertRule } from "@/types/alerts";

import {
  AlertRuleForm,
  type AlertRuleFormState,
} from "../_components/alert-rule-form";
import { AlertRulesTable } from "../_components/alert-rules-table";
import { AlertSuggestions } from "../_components/alert-suggestions";
import { NotificationPreview } from "../_components/notification-preview";

export function AlertsShell({ catalog }: { catalog: AlertCatalog }) {
  const [rules, setRules] = useState<AlertRule[]>(catalog.rules);
  const [formState, setFormState] = useState<AlertRuleFormState>({
    ...DEFAULT_FORM,
  });
  const [feedback, setFeedback] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const { permission, requestPermission, sendPreview, lastNotification } =
    useMockNotification();

  const handleFieldChange: AlertFieldChange = (key, value) => {
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const handleChannelToggle = (channel: AlertChannel) => {
    setFormState((previous) => {
      const channels = previous.channels.includes(channel)
        ? previous.channels.filter((value) => value !== channel)
        : [...previous.channels, channel];
      return { ...previous, channels };
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      setFeedback({ status: "error", message: "Add a rule name to continue." });
      return;
    }

    if (formState.channels.length === 0) {
      setFeedback({
        status: "error",
        message: "Select at least one channel for delivery.",
      });
      return;
    }

    const newRule: AlertRule = {
      id: generateRuleId(),
      name: formState.name.trim(),
      description: formState.description.trim(),
      condition: formState.condition,
      threshold: formState.threshold,
      channels: formState.channels,
      isActive: true,
      lastTriggered: null,
    };

    setRules((previous) => [...previous, newRule]);
    setFormState({ ...DEFAULT_FORM });
    setFeedback({
      status: "success",
      message: "Rule saved locally – wire up persistence for production.",
    });

    if (permission !== "granted") {
      await requestPermission();
    }

    sendPreview(buildNotificationMessage(newRule));
  };

  const toggleRule = (id: string) => {
    setRules((previous) =>
      previous.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <p className="text-sm text-muted-foreground">
          Automate notifications for priority spikes, incident surges, and
          lingering investigations.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <AlertRuleForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onChannelToggle={handleChannelToggle}
          onSubmit={handleSubmit}
          feedback={feedback}
          permission={permission}
          onRequestPermission={requestPermission}
        />
        <NotificationPreview
          permission={permission}
          lastMessage={lastNotification}
        />
      </section>

      <AlertRulesTable rules={rules} onToggle={toggleRule} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Suggested actions</h2>
        <AlertSuggestions suggestions={catalog.suggestions} />
      </div>
    </div>
  );
}

type AlertFieldChange = <K extends keyof AlertRuleFormState>(
  key: K,
  value: AlertRuleFormState[K],
) => void;

function generateRuleId() {
  return `rule-${Date.now().toString(36)}`;
}

function buildNotificationMessage(rule: AlertRule) {
  const channelList = rule.channels.join(", ");
  const conditionLabel =
    rule.condition === "priority"
      ? `priority >= ${rule.threshold}`
      : rule.condition === "type"
        ? `${rule.threshold}+ matching incidents by type`
        : `status open > ${rule.threshold} minutes`;

  return `${rule.name} · ${conditionLabel} · channels: ${channelList}`;
}

const DEFAULT_FORM: AlertRuleFormState = {
  name: "",
  description: "",
  condition: "priority",
  threshold: 3,
  channels: ["sms"],
};
