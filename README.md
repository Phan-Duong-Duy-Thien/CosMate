# CosMate FE

Web frontend for **CosMate** — a React (Vite) app using Tailwind CSS and Ant Design, organized in a **feature-based** architecture.

---

## Requirements

- **Node.js** LTS (recommended: 20.x or newer)
- **npm** (or pnpm/yarn if your team standardizes on them)

---

## Install and run locally

```bash
npm install
npm run dev
```

The dev server is served by Vite (typically `http://localhost:5173`).

### Production build and preview

```bash
npm run build
npm run preview
```

---

## Environment variables

Create `.env` or `.env.local` in the project root. Do not commit secrets.

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (fallback in code: `http://localhost:8080`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for Google sign-in (if unset, Google login is disabled / warned) |
| `VITE_PROVINCES_API_URL` | Vietnam administrative divisions API (defaults to Open Provinces API) |

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (Vite + HMR) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm run i18n:check` | i18n consistency check (`scripts/i18n-check.mjs`) |

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 7**
- **Tailwind CSS 4** (`@tailwindcss/vite`), design tokens in `src/index.css`
- **Ant Design 6** (complex forms/tables and some legacy UI)
- **React Router 7**
- **Axios** — shared instance in `src/services/axiosInstance.ts`
- **STOMP / SockJS** — realtime (e.g. chat)

---

## Directory layout (overview)

```
src/
├── app/           # App shell, routes, layouts
├── features/      # Domain modules (auth, chat, order, …)
├── shared/        # Shared components and hooks
├── services/      # axiosInstance and infra helpers
├── assets/
├── constants/
└── types/
```

Path aliases (see `vite.config.ts`): `@`, `@app`, `@features`, `@shared`, `@services`, `@types`, `@assets`.

Recommended data flow: **Page → Hook → (Service) → API → axiosInstance**. Avoid calling HTTP directly from presentational components.

---

## UI and design system

- Canonical primitives: `src/components/ui/*`
- Color/theme tokens: `src/index.css` (`:root`, `@theme`)
- UI rules, Ant Design policy (legacy vs new surfaces), PR checklist:  
  `.cursor/skills/design-system/SKILL.md` (CosMate Design System).

---

## Contributing

1. Branch from `main` (or follow your team’s branching convention).
2. Run `npm run lint` before opening a PR.
3. Respect feature boundaries and the design system above.

---

## License

Private project — use governed by CosMate team policy.
