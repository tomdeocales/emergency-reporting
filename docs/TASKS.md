# Task Tracker

Status values: `Done`, `In Progress`, `Todo`, `Blocked`.

| ID | Task | Area | Status | Notes |
| -- | -- | -- | -- | -- |
| T0 | Project scaffolding (pnpm, Next.js App Router) | Foundation | Done | Completed via create-next-app baseline. |
| T1 | Document file structure & best practices | Foundation | Done | `docs/FILE-STRUCTURE.md` and `docs/FRONTEND-BEST-PRACTICES.md` live in repo. |
| T2 | Replace default landing screen with emergency ops placeholder | Foundation | Done | Public landing now highlights demo narrative and links into the console. |
| T3 | Install shadcn/ui generator, seed base components | Foundation | Done | Added shared `button`, `card`, `dialog`, and `table` primitives with utility helpers. |
| T4 | Implement global shell with navigation & layout providers | Layout | Done | Protected layout delivers top bar, sidebar, and mock user guard. |
| T5 | Split routes into `(public)` landing and `(protected)` app | Layout | Done | Added route groups and dashboard stub under `(protected)`. |
| T6 | Build incident intake workflow under `(protected)/incidents` | Incidents | Done | Upload workspace now handles CSV mapping, validation, and toasts. |
| T7 | Seed mock incident datasets & server fetch helpers | Incidents | Done | Added mock dataset with service layer loaders and quality summary helpers. |
| T8 | Create operations dashboard with heatmap and incident table | Dashboard | Done | Heatmap, filters, timeline playback, and zone drawer are live on `/dashboard`. |
| T9 | Deliver analytics & alerts features | Analytics | Done | `/analytics` dashboards and `/alerts` rule builder now live with export helpers. |
| T10 | Run accessibility/performance pass and document QA | QA | Done | Skip link & reduced-motion polish shipped; manual runbook lives in `docs/QA-CHECKLIST.md`. |
| T11 | Update README with project-specific instructions | Docs | Done | README now documents setup, feature surfaces, scripts, and QA checklist. |
| T12 | Deliver zone readiness workspace | Operations | Done | `/zones` provides commander summary, hotspots, and map context. |
| T13 | Launch data workspace for dataset oversight | Data | Done | `/data` lists assets, integrations, and export tooling. |

