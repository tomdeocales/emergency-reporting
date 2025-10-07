import type { DataWorkspaceSnapshot } from "@/types/data";

import { DataAssetsTable } from "../_components/data-assets-table";
import { DataExportsPanel } from "../_components/data-exports-panel";
import { DataIntegrations } from "../_components/data-integrations";

export function DataShell({ snapshot }: { snapshot: DataWorkspaceSnapshot }) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold leading-tight">Data workspace</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Track ingestion health, manage datasets, and share exports with
          partner systems.
        </p>
      </header>

      <DataAssetsTable assets={snapshot.assets} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <DataExportsPanel assets={snapshot.assets} />
        <div className="space-y-3 rounded-xl border border-border bg-background p-4 shadow-sm">
          <header className="space-y-1">
            <h2 className="text-lg font-semibold leading-tight text-foreground">
              Integrations
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Sync status for upstream systems feeding the console.
            </p>
          </header>
          <DataIntegrations integrations={snapshot.integrations} />
        </div>
      </section>
    </div>
  );
}
