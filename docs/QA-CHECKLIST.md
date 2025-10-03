# QA & Performance Checklist

Use this checklist to manually verify the demo before handing it off or recording a walkthrough.

## Global
- [ ] Load `/` and `/dashboard` over a throttled network (Fast 3G) to confirm first paint < 3s.
- [ ] Navigate via keyboard only; skip link lands on main content and focus outlines remain visible.
- [ ] Toggle reduced motion in OS settings — animations collapse to instant transitions.
- [ ] Resize viewport from 360px to 1440px to ensure responsive layout and no horizontal scrolling.

## Incident Intake
- [ ] Upload the fixture located at `public/data/mock-incidents.json` and verify validation toasts.
- [ ] Confirm quality summary surfaces coordinate warnings and missing data notices.
- [ ] Attempt to upload malformed CSV and observe error handling (toast + inline messaging).

## Operations Dashboard
- [ ] Timeline scrubber keyboard accessible (use arrow keys) and playback loops without dropping filters.
- [ ] Zone drawer opens from "View full log", reports counts, and closes via Escape.
- [ ] Map heatmap filters respond to search/type filters with matching counts in header badge.

## Analytics
- [ ] Switch timeframe selector and ensure summary cards refresh with new copy and data.
- [ ] Trigger CSV/JSON/PNG exports; preview renders in export panel without layout shift.
- [ ] Confirm tables announce headers to screen readers (use VoiceOver / NVDA quick table nav).

## Alerts
- [ ] Create a rule with SMS + Push, submit form, and observe confirmation banner and preview payload.
- [ ] Toggle rules between Active and Paused; status pill updates instantly.
- [ ] Request notification permission; denied state surfaces in preview panel.

## Regression Smoke
- [ ] Verify `/analytics`, `/alerts`, `/dashboard`, and `/incidents` render without console errors in latest Chrome and Firefox.
- [ ] Run `pnpm lint` to ensure Biome passes cleanly.
