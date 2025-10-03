# Emergency Reporting — Delivery Plan

## Purpose
Provide a production-quality demo for emergency operations teams. The app should let analysts capture incidents, review live activity, and surface trends so response leaders can act quickly even when the data is mocked.

## Success Criteria
- Navigable end-to-end experience covering intake, monitoring, analytics, and administration.
- Server-first Next.js App Router implementation consistent with `docs/FILE-STRUCTURE.md`.
- Mock data sources and deterministic seeds so demos are reproducible offline.
- Interaction flows instrumented with accessible, keyboard-friendly UI primitives.

## Guiding Principles
- Keep routes organized under `(public)` and `(protected)` groups; colocate feature UI per the structure doc.
- Default to server components and leverage shadcn/ui + Radix primitives from `src/components/ui`.
- Reuse shared utilities (hooks, services) instead of duplicating logic inside features.
- Treat URL search params as source of truth for filters, mirroring the patterns in `docs/FRONTEND-BEST-PRACTICES.md`.

## Milestones

### M0. Baseline & Tooling *(Status: In Progress)*
Focus: make the repository runnable and align core tooling with project conventions.
Key deliverables:
- [x] Scaffold Next.js App Router project with pnpm, TypeScript, Tailwind, and eslint.
- [x] Replace the default landing view with a placeholder Emergency Operations screen.
- [ ] Configure Tailwind tokens, typography, and theme primitives that match the design brief.
- [x] Stand up shadcn/ui generator config and add base components (button, card, table, dialog).

### M1. Core Layout & Navigation *(Status: In Progress)*
Focus: establish the shared shell and routing scaffolding the rest of the features rely on.
Key deliverables:
- [x] Implement global layout with top status banner, left navigation, and authenticated wrapper.
- [x] Separate `(public)` marketing/landing routes from `(protected)` in-app surfaces.
- [ ] Add skeleton states and route-level loading/fallback boundaries.

### M2. Incident Intake & Reporting *(Status: In Progress)*
Focus: allow field teams to capture and review incoming incident reports.
Key deliverables:
- [x] Create `(protected)/incidents` feature folder with upload form, map preview, and validation pipeline.
- [x] Model mock incident data under `public/data` and associated `src/server` fetch helpers.
- [x] Build quality summary panels and toast flows that confirm submissions.

### M3. Operations Dashboards *(Status: In Progress)*
Focus: provide command-center visibility into active incidents and resources.
Key deliverables:
- [ ] Deliver `/dashboard` view with key metrics, heatmap, and timeline slider (mock data). *(Heatmap + filters live; timeline scrubber pending).* 
- [x] Add searchable incident table with filters synced to URL + Redux UI slice.
- [ ] Implement zone detail drawer with charts using recharts or equivalent primitives.

### M4. Analytics & Alerts *(Status: Todo)*
Focus: expose trend analysis and alert configuration for leadership.
Key deliverables:
- [ ] `/analytics` route for historical metrics, comparisons, and export controls.
- [ ] `/alerts` route with alert rule builder, notification previews, and mock Notification API hook.
- [ ] Shared export utilities for CSV/JSON/PNG outputs.

### M5. QA, Polish & Handoff *(Status: Todo)*
Focus: finalize usability, documentation, and deployment readiness.
Key deliverables:
- [ ] Accessibility pass (keyboard, focus states, contrast) and performance smoke tests.
- [ ] Manual QA checklist covering all routes and critical flows.
- [ ] Update README with setup, scripts, and demo instructions; attach screenshots or Loom.

## Enablers & Dependencies
- Mock geospatial layers (GeoJSON or grid tiles) required before heatmap work begins.
- Incident taxonomy and severity scales must be locked to finalize filters and validation.
- Confirm license stance for map tiles (MapLibre demo tiles vs. custom style).

## Risks & Open Questions
- Maplibre bundle size may need dynamic import strategy; monitor during dashboard build.
- Alert notification UX depends on browser permission flow—decide fallback for denied state.
- Determine if offline demo mode requires service worker for cached assets.
