# Repository Guidelines

## Project Structure & Module Organization
This Next.js App Router project keeps feature surfaces under `src/app`, split into `(public)` and `(protected)` route groups. Each feature page should colocate UI leaves in `_components`, compositions in `_sections`, optional providers in `_providers`, and UI state in `_redux`. Shared primitives live in `src/components` (Shadcn/Radix under `ui`), reusable hooks in `src/hooks`, and server-only logic in `src/server` (`actions`, `services`, `fetch`). Global styles land in `src/app/globals.css`; assets belong in `public/`. Reference `docs/file-structure.md` and `docs/frontend-best-practices.md` before adding new folders.

## Build, Test, and Development Commands
Use pnpm (lockfile is checked in). Typical flow:
- `pnpm install` – restore dependencies.
- `pnpm dev` – run the local dev server at http://localhost:3000.
- `pnpm lint` – execute `next lint`; resolve or justify all warnings.
- `pnpm build` followed by `pnpm start` – production build smoke-test prior to merging or tagging.
If you need to inspect the deployed state, Vercel preview links are auto-created for PRs.

## Coding Style & Naming Conventions
TypeScript is required. Follow the lint rules emitted by `next lint`; the codebase prefers two-space indentation, kebab-case filenames (`users-table.tsx`), PascalCase React components, `*.actions.ts` for server actions, and `*-service.ts` for service clients. Keep components server-first; add `'use client'` only for interactive leaves. Tailwind CSS v4 tokens live in `globals.css`; compose classes with `clsx`/`tailwind-merge` instead of manual string concatenation.

## Testing Guidelines
Automated tests are not wired up yet, so linting and manual verification are the current gates. When contributing new surface area, document manual QA steps in the PR and, where feasible, add colocated `*.test.ts(x)` files using React Testing Library or Playwright. Place experiments under `src/__tests__` or adjacent to the module, and include instructions on how to run them (e.g., `pnpm vitest`) if you introduce tooling; aim for meaningful coverage of happy path and failure states.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits (`feat:`, `refactor:`, `style:`). Keep PRs scoped, describe the user-facing outcome, list manual test steps, and attach relevant screenshots or Looms for UI changes. Link to tracking issues or v0.app chats when applicable, and ensure CI (lint/build) is green before requesting review.

## Environment & Security Notes
Store configuration in `.env.local`; never commit secrets. Server actions should source credentials via environment variables and avoid shipping secrets to the client bundle. Before merging, verify that new endpoints respect the `(protected)` route guard strategy and that analytics scripts remain opt-in.
