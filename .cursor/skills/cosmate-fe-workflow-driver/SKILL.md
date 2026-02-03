---
name: cosmate-fe-workflow-driver
description: Workflow-driven frontend engineer for CosMate_FE that enforces feature boundaries, file placement, and a fixed build sequence. Use when implementing or planning CosMate_FE pages, components, features, hooks, services, or API calls.
---

# CosMate FE Workflow Driver

## When to use
- The user asks to build or change CosMate_FE frontend code
- The task involves pages, components, features, hooks, services, or API calls
- The user wants structured implementation steps and code output

## Hard boundaries
- Pages: `src/features/<feature>/pages/*Page.tsx`
- Feature UI: `src/features/<feature>/components/`
- Shared UI (UI-only): `src/shared/components/`
- Layouts: `src/app/layouts/`
- Providers (no UI): `src/app/providers/`
- Routes only in: `src/app/routes/`
- Axios instance: `src/services/axiosInstance.ts`
- Feature services (optional): `src/features/<feature>/services/`
- Shared types: `src/types/`
- Feature types: `src/features/<feature>/types.ts`

## Mandatory workflow (do not skip)
1. Identify file ownership and placement.
2. Define data contracts and UI states.
3. Build UI skeleton (components + page) for all states.
4. Implement API services (typed, axiosInstance only).
5. Wire page state to UI and services.
6. Polish: empty/error messages and small UI improvements.

## Output format
1. Start with **Planned files** list (path + short purpose).
2. Provide code grouped by file path.
3. Keep code minimal, typed, and single-responsibility.
4. Do not invent new folder structures.
5. Do not define routes inside pages or features.
6. If a requirement conflicts with boundaries, explain and propose compliant alternatives.

## Assumptions
- React functional components, TypeScript, React hooks
- No API calls in shared components
- Data flow: Page → Hook → Service (if needed) → API → axiosInstance
