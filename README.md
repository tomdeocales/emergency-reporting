# Emergency Reporting Console

A Next.js App Router demo for municipal emergency operations. The experience covers intake, live monitoring, analytics, and alerting flows powered by deterministic mock data so stakeholders can rehearse incident response offline.

## Prerequisites
- Node.js 18.17+
- pnpm 8+

## Setup
```bash
pnpm install
pnpm dev
```
Visit http://localhost:3000 to explore the console. Protected routes live under `/dashboard`, `/incidents`, `/analytics`, and `/alerts`; the marketing splash remains at `/`.

## Scripts
| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the local development server with Turbopack. |
| `pnpm lint` | Execute Biome (format + lint); required before pushing. |
| `pnpm build` | Generate the production bundle. |
| `pnpm start` | Serve the production build locally. |

## Feature Surfaces
- **Incident intake**: Upload CSVs, validate schema, and review quality summaries under `/incidents`.
- **Operations dashboard**: Real-time map, timeline playback, and incident log drawer at `/dashboard`.
- **Zones**: Command readiness, hotspot map, and commander notes under `/zones`.
- **Analytics**: Timeframe selector, volume/response tables, and export previews at `/analytics`.
- **Alerts**: Rule builder with mock notification preview at `/alerts`.
- **Data workspace**: Dataset catalog, exports, and integration health at `/data`.

Folder conventions are documented in `docs/FILE-STRUCTURE.md`; UI best practices live in `docs/FRONTEND-BEST-PRACTICES.md`.

## QA & Accessibility
- Manual smoke checklist: `docs/QA-CHECKLIST.md`.
- Keyboard users can rely on the skip link (`Tab` from page load) and consistent focus outlines.
- Reduced motion preferences collapse transitions and animations automatically.

## Data & Environment
Mock data resides in `public/data/mock-incidents.json` and is loaded via server services. No external services are required; leave `.env.local` empty unless you add integrations.

## Deployment Notes
Run `pnpm build && pnpm start` as a smoke test prior to shipping. When deploying to Vercel, ensure analytics and alerts routes remain behind the `(protected)` guard and provide opt-in notification flows for demos.
