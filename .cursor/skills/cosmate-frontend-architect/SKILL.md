---
name: cosmate-frontend-architect
description: Enforces CosMate FE architecture: feature-based structure, strict Page/Shared UI/Feature UI/Layout/Provider boundaries, and route/API rules. Use when generating or modifying CosMate frontend code, adding features, or when the user asks about architecture, pages, components, or routes.
---

# CosMate Frontend Architect

You are a Frontend Architect for the CosMate project. Before generating any code, classify the file and its location; if uncertain, ask for clarification.

## Always Follow COSMATE_FE Global Context

- **Feature-based architecture + App Shell**: Features under `src/features/<feature>/`; app shell and routes in `src/app/`.
- **Strict boundaries** between: Page | Shared UI | Feature UI | Layout | Provider.
- **Pages**: Only in `src/features/<feature>/pages`, filename must end with `Page.tsx`.
- **Shared UI**: UI-only, no API calls, no business logic; lives outside features (e.g. `src/components/` or as agreed).
- **Feature components**: Scoped to one domain; live in `src/features/<feature>/components/`.
- **Routes**: Defined only in `src/app/routes` (or the single routes file used by the app).
- **API calls**: Must go through `axiosInstance` or feature services (never from Shared UI or from components that should stay UI-only).

## Before Generating Any Code

Decide and state (or ask):

1. **What type of file is this?**  
   One of: **Page** | **Shared UI** | **Feature UI** | **Layout** | **Provider**
2. **Which folder does it belong to?**  
   e.g. `src/features/auth/pages/`, `src/features/auth/components/`, `src/app/layouts/`, etc.
3. **Is this file allowed to call APIs?**  
   - Pages: no direct axios; use hooks → services/API.  
   - Shared UI & Feature UI components: no API calls.  
   - Layouts/Providers: only if they are the designated place for data/context (document which).

If any of these is unclear, **ask for clarification before writing code**.

## Quick Reference

| File type     | Location example                    | May call API? |
|--------------|--------------------------------------|---------------|
| Page         | `src/features/<feature>/pages/*Page.tsx` | No (use hooks) |
| Feature UI   | `src/features/<feature>/components/`     | No            |
| Shared UI    | Shared components folder (e.g. `src/components/`) | No |
| Layout       | `src/features/<feature>/layout/` or `src/app/layouts/` | Only if designated |
| Provider     | Where app/feature providers live        | Only if designated |
| Routes       | `src/app/routes` (or project’s route file) | N/A   |

## When Uncertain

- Do not guess folder or file type.
- Ask: “Is this a Page, Shared UI, Feature UI, Layout, or Provider, and where should it live?”
- Or: “Is this component allowed to call the API, or should it receive data via props/hooks?”
