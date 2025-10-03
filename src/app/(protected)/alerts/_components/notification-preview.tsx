import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type NotificationPreviewProps = {
  permission: NotificationPermission;
  lastMessage: { message: string; timestamp: string } | null;
};

export function NotificationPreview({
  permission,
  lastMessage,
}: NotificationPreviewProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Notification preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Permission status: <span className="font-medium">{permission}</span>
        </p>
        {lastMessage ? (
          <div
            className="space-y-2 rounded-lg border border-border/70 bg-muted/10 p-4"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-foreground">
              Latest preview
            </p>
            <p className="text-sm text-muted-foreground">
              {lastMessage.message}
            </p>
            <p className="text-xs text-muted-foreground">
              Sent{" "}
              {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ) : (
          <p
            className="rounded-lg border border-dashed border-border/60 bg-background p-4 text-xs text-muted-foreground"
            aria-live="polite"
          >
            Submit the form to generate a mock notification payload. Replace
            this preview with a production delivery handler when ready.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
