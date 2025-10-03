# Incident Hotspot Predictor — Working Demo App (mock data)

**Goal**
Build a fully navigable demo web app that implements the UI, flows, and interactions with mock data only. No live feeds. Use WebGL map. Professional, function first.

**Hard rules**

* Use pnpm.
* Use Next.js App Router, TypeScript, Tailwind, Radix, shadcn/ui.
* When adding shadcn components always run: `pnpm dlx shadcn@latest add <component>`.
* After each successful task always commit: `git add -A && git commit -m "<concise message>"`.

---

## Tech stack and setup

1. Scaffold (Done)

```bash
pnpm create next-app@latest incident-hotspot-predictor --ts --app --tailwind --eslint --src-dir --import-alias "@/*"
cd incident-hotspot-predictor
git init
git add -A && git commit -m "chore: scaffold Next.js app with Tailwind"
```

2. Init shadcn (Done)

```bash
pnpm dlx shadcn@latest init
git add -A && git commit -m "chore: init shadcn"
```

3. Install libs

```bash
pnpm add zod date-fns zustand papaparse recharts maplibre-gl @tanstack/react-table
git add -A && git commit -m "chore: add core libs (zod, zustand, papaparse, recharts, maplibre, tanstack table)"
```

4. Add shadcn components (each via the required command)

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add slider
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add breadcrumb
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add alert
pnpm dlx shadcn@latest add alert-dialog
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add progress
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add sheet
pnpm dlx shadcn@latest add drawer
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add navigation-menu
pnpm dlx shadcn@latest add scroll-area
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add command
git add -A && git commit -m "feat(ui): add shadcn components"
```

5. Base theme and tokens

* Colors: primary #1F2937, accent #2563EB, success #059669, warning #D97706, danger #DC2626, surface #FFFFFF, surface-alt #F3F4F6, border #E5E7EB.
* Heatmap ramp: low #ECFDF5, mid #F59E0B, high #B91C1C.
* Type: Inter or system UI.
* 12 column grid, 24 px gutters, 8 px spacing scale.
  Commit after applying tokens in Tailwind config and CSS.

```bash
git add -A && git commit -m "chore(ui): apply tokens and base theme"
```

---

## App structure

* App Router paths:

  * `/upload`
  * `/settings`
  * `/predictions`
  * `/zone/[id]` (drawer or page view)
  * `/alerts`
  * `/accuracy`
  * `/data`
* Global layout:

  * Top nav 56 px: app name, dataset switcher, status pill, user menu.
  * Left nav 240 px with routes in this order: Upload and Mapping, Settings, Predictions Map, Zone Detail, Alerts and Simulation, Accuracy and Backtest, Data Manager.
  * Right drawer 420 px for Zone Detail.
  * Footer: build hash, privacy, audit log.

```bash
git add -A && git commit -m "feat(app): layout shell and routes"
```

---

## Mock data

Place in `public/data` and load client side.

* `sample_incidents.csv` first 8 rows:

```
reported_at,lat,lon,type,priority
2024-01-01 00:15:00,40.7142,-74.0031,Fire,2
2024-01-01 00:28:00,40.7198,-74.0112,EMS,1
2024-01-01 00:41:00,40.7061,-74.0099,Hazmat,3
2024-01-01 01:05:00,40.7333,-74.0044,Fire,2
2024-01-01 01:22:00,40.7351,-74.0027,Other,3
2024-01-01 01:37:00,40.7299,-74.0121,EMS,1
2024-01-01 01:51:00,40.7215,-74.0068,Fire,2
2024-01-01 02:06:00,40.7129,-74.0015,EMS,2
```

* `top_zones_preview.json`

```json
[
  {"zone_id":"Z-1184","probability":0.91,"expected_incidents":3.2,"confidence":"High","trend":"up","centroid_lat":40.7167,"centroid_lon":-74.0059},
  {"zone_id":"Z-0421","probability":0.88,"expected_incidents":2.7,"confidence":"High","trend":"up","centroid_lat":40.7210,"centroid_lon":-74.0102},
  {"zone_id":"Z-3307","probability":0.81,"expected_incidents":1.9,"confidence":"Med","trend":"flat","centroid_lat":40.7099,"centroid_lon":-74.0077},
  {"zone_id":"Z-2210","probability":0.79,"expected_incidents":1.8,"confidence":"Med","trend":"down","centroid_lat":40.7356,"centroid_lon":-74.0011}
]
```

```bash
git add -A && git commit -m "chore(data): add mock CSV and JSON"
```

---

## Global utilities

* Filter bar with chips: incident type, priority, time of day, day of week, date range.
* Export menu: CSV, JSON, PNG with `{dataset}_{view}_{yyyymmddHHMM}`.
* Help side panel.
* Keyboard: g u, g s, g p, slash for search, question for help.
* Toasts for success and errors.
  Commit after implementing header, sidebar, filter bar, toasts.

```bash
git add -A && git commit -m "feat(ui): header, sidebar, filter bar, toasts"
```

---

## Screens and acceptance criteria

### 1) Upload and Mapping (`/upload`)

Purpose: bring data in cleanly.

* Left 60 percent: file panel and mapping wizard. Right 40 percent: quality report.
* File panel: drag and drop, choose file, sample 100 rows, clear. Table of uploaded files with status.
* Mapping: auto schema guess with confidence bars. Map fields: timestamp, lat, lon, type, priority. Timezone select. Save profile. Validate button with progress.
* Quality report: tiles for rows, time range, nulls, invalid geos, time gaps. Issues table with severities. Download report. Proceed button gated by valid mapping.
* Errors: blocking modal for parse failures with first 3 examples and fix.
* Use `papaparse` and `zod` for checks.
  Commit.

```bash
git add -A && git commit -m "feat(upload): file ingest, mapping wizard, quality report"
```

### 2) Settings (`/settings`)

Purpose: define modeling run.

* Two column form. Sticky action bar.
* Controls: grid size slider 150 to 2000 m, horizon select (4, 8, 12, 24, 72 h), time bucket select (15, 30, 60 min), filters, threshold slider 0.50 to 0.95 with live false alarm preview, evaluation split fields, advanced accordion (drift window, max rows, seed).
* Runtime estimate badge. Info callouts for AUROC and false alarm target.
* Run prediction routes to Predictions with spinner.
  Commit.

```bash
git add -A && git commit -m "feat(settings): modeling controls and validations"
```

### 3) Predictions Map (`/predictions`)

Purpose: visualize risk.

* MapLibre GL with style `https://demotiles.maplibre.org/style.json`. City boundary outline. Optional grid overlay.
* Heatmap with legend. Toggle heatmap or choropleth by grid. Normalize by area checkbox.
* Left overlay: Top zones table with rank, id, probability, expected incidents, confidence, 7 day trend, actions.
* Bottom time scrubber for buckets across the horizon with play.
* Click zone opens Zone Detail drawer. Hover tooltip shows zone stats.
  Commit.

```bash
git add -A && git commit -m "feat(predictions): heatmap, legend, top zones, time scrubber"
```

### 4) Zone Detail (`/zone/[id]` as drawer over current page)

Purpose: inspect a zone.

* Header: zone id, neighborhood, bounding box. Export zone series. Add to staging plan.
* Tabs:

  * Risk over time: line chart with confidence band. Mock series `[0.62,0.65,0.73,0.91,0.84,0.70,0.61,0.55]`.
  * Incident mix: donut chart. Table by type and priority.
  * Explainability: feature importance list with bars and a small partial dependence preview.
  * Staging summary: recommendation text with travel time delta.
* Footer: last updated, dataset, alert status.
  Commit.

```bash
git add -A && git commit -m "feat(zone): drawer with charts, explainability, staging summary"
```

### 5) Alerts and Simulation (`/alerts`)

Purpose: plan and notify.

* What‑if panel: scenario name, seasonal and event multipliers, apply. Delta cards. Preview table of recalculated top zones.
* Alerts panel: rule builder. Recipients list. Frequency control. Quiet hours toggle. Test alert uses the Notifications API. Browser preview card and email preview mock.
  Commit.

```bash
git add -A && git commit -m "feat(alerts): what-if simulation and rule builder with test alert"
```

### 6) Accuracy and Backtest (`/accuracy`)

Purpose: measure trust.

* Metric tiles: AUROC, AUPRC, calibration slope, zone FPR.
* Charts: ROC, calibration, confusion matrix at threshold, error by zone bars.
* Backtest controls: select window, predicted vs actual daily counts line chart. Drift alerts list.
* Export metrics CSV and PDF.
  Commit.

```bash
git add -A && git commit -m "feat(accuracy): metrics, charts, backtest controls and exports"
```

### 7) Data Manager (`/data`)

Purpose: manage files.

* Dataset table: name, rows, date range, size, profiles, created, status, actions.
* Actions: set active, rename, replace, append incremental, download, delete.
* Incremental upload flow updates merged range.
* Audit log modal with chronological entries.
  Commit.

```bash
git add -A && git commit -m "feat(data): dataset manager with audit log"
```

---

## UI kit specifics

* Top nav: app name, dataset switcher (shadcn Command), status pill with states Idle, Validating, Running, Completed, user menu.
* Left nav: shadcn NavigationMenu or custom list with icons from lucide-react.
* Cards, tables, forms use shadcn primitives. Tables use TanStack with sticky header and sorting.
  Commit after kit wiring.

```bash
git add -A && git commit -m "feat(ui): nav, menus, tables wired to shadcn and TanStack"
```

---

## Accessibility and performance

* WCAG AA contrast and focus rings 3 px. Keyboard reachability for all actions. Keyboard zone cycling on map.
* P95 scoring banner after runs: “50,000 rows scored in 8.4 s P95” (mock).
* No network calls except loading static files and map tiles.
  Commit.

```bash
git add -A && git commit -m "chore(a11y+perf): WCAG and perf banners"
```

---

## Exports and notifications

* Exports: CSV or JSON for zone risk and predictions. Include metadata header lines. PNG snapshot for map via canvas export.
* Browser notifications for test alerts with permission request flow.
  Commit.

```bash
git add -A && git commit -m "feat(exports+notify): CSV, JSON, PNG and browser notifications"
```

---

## Visual system

* Color tokens and heatmap ramp from above.
* Typography: 14 px base, 12 px caption, 20 px section headers.
* Light and dark themes. Desktop 1440 px and tablet 1024 px breakpoints.
  Commit.

```bash
git add -A && git commit -m "feat(theme): light and dark, breakpoints"
```

---

## Acceptance checklist

* All routes render and are navigable.
* Map renders with heatmap and grid choropleth.
* Top zones list updates when filters change.
* Zone drawer opens from map or table and shows charts and explainability.
* What‑if sliders update preview values.
* Test alert triggers Notification API preview.
* Backtest view shows all charts from mock series.
* Data Manager supports append and logs actions.
* All shadcn components were installed using `pnpm dlx shadcn@latest add <component>`.
* A git commit followed every successful task.

Commit the final pass.

```bash
git add -A && git commit -m "chore: finalize demo app per spec"
```

---

## Mock email and browser notification text

* Email subject: `Hotspot alert · Zone Z-1184 · 18:00-19:00`
* Email body: `Probability 0.91. Expected 3.2 incidents. Dataset MetroFire_Incidents_Q1_2024. Open Predictions Map to review.`
* Browser notification: title `Hotspot alert`, body `Z-1184 18:00-19:00 probability 0.91`, action `Open map`.

