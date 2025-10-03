export type AlertChannel = "email" | "sms" | "push";

export type AlertRule = {
  id: string;
  name: string;
  description: string;
  condition: "priority" | "type" | "status";
  threshold: number;
  channels: AlertChannel[];
  isActive: boolean;
  lastTriggered: string | null;
};

export type AlertSuggestion = {
  id: string;
  title: string;
  description: string;
};

export type AlertCatalog = {
  rules: AlertRule[];
  suggestions: AlertSuggestion[];
};
