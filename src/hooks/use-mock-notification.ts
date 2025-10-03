"use client";

import { useCallback, useState } from "react";

type NotificationSnapshot = {
  message: string;
  timestamp: string;
};

export function useMockNotification() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );
  const [lastNotification, setLastNotification] =
    useState<NotificationSnapshot | null>(null);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("granted");
      return "granted" as const;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.warn("Notification permission request failed", error);
      setPermission("denied");
      return "denied" as const;
    }
  }, []);

  const sendPreview = useCallback((message: string) => {
    setLastNotification({ message, timestamp: new Date().toISOString() });
  }, []);

  return {
    permission,
    requestPermission,
    sendPreview,
    lastNotification,
  };
}
