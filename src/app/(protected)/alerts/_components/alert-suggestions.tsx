import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlertSuggestion } from "@/types/alerts";

export function AlertSuggestions({
  suggestions,
}: {
  suggestions: AlertSuggestion[];
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id}>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {suggestion.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {suggestion.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
