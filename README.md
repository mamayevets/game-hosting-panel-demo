# Game Hosting Panel — Concept Demo

> Frontend prototype of a customer-facing dashboard for a game-server hosting company. Built as a portfolio piece alongside [book-library-basic](https://github.com/mamayevets/book-library-basic) — same kind of SaaS panel a hosting platform's customers would actually use, just without a backend.

## Live demo

After deploying to Cloudflare Pages: **https://game-hosting-panel-demo.pages.dev**

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript**
- **Vite** for build tooling
- **Vue Router** for client-side routing
- **Pinia** for state management
- **Tailwind CSS** for styling
- **Chart.js** + **vue-chartjs** for live resource graphs
- **Lucide** icons

No backend — all data is mocked in `src/data/*.ts` to keep the demo focused on UI/UX.

## Pages

| Route | Description |
|---|---|
| `/login` | Mock authentication (any email + password works) |
| `/servers` | Grid of game servers with stats, filters, and search |
| `/servers/:id` | Server detail with 4 tabs (Overview, Console, Files, Plugins) |
| `/billing` | Subscription, payment method, invoices, available plans |
| `/account` | Profile, security (2FA), API keys, notification preferences |

## Highlights

- **Live-streaming resource charts** — CPU / RAM / players update every 2.5 s
- **Animated console** — log lines stream in like a real game server
- **File tree** with persistent expand/collapse state
- **Plugin marketplace** with search and install/uninstall toggles
- **Dark mode** — system-preference aware, persisted in localStorage
- **Persisted auth** via localStorage (mock session survives reload)
- **Six game types** with per-game color theming (Minecraft, RUST, ARK, Palworld, Valheim, CS2)

## Local development

Requirements: Node 20+, npm 10+.

```bash
git clone https://github.com/mamayevets/game-hosting-panel-demo.git
cd game-hosting-panel-demo
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build      # production bundle into dist/
npm run preview    # serve dist/ locally to smoke-test
```

## Project structure

```
src/
├── App.vue                  ← layout (sidebar + auth-aware routing)
├── main.ts                  ← Pinia + Router bootstrap
├── router/
│   └── index.ts             ← route definitions + auth guard
├── stores/
│   ├── auth.ts              ← mock login persisted in localStorage
│   └── theme.ts             ← light / dark with system preference
├── components/
│   ├── Sidebar.vue          ← left navigation, logout, theme toggle
│   ├── StatusBadge.vue      ← coloured pill for server status
│   ├── GameIcon.vue         ← per-game emoji + color
│   └── ResourceChart.vue    ← Chart.js wrapper for CPU/RAM/players
├── pages/
│   ├── Login.vue
│   ├── ServerList.vue
│   ├── ServerDetail.vue     ← tabs: Overview, Console, Files, Plugins
│   ├── Billing.vue
│   └── Account.vue
├── data/
│   ├── servers.ts           ← 6 mock servers across 6 games
│   ├── invoices.ts
│   ├── plans.ts
│   └── console.ts           ← log lines, players, plugins, file tree
└── types.ts                 ← shared TS interfaces
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Sign in to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages
3. **Connect to Git** → select this repo
4. Build settings:
   - **Framework preset:** Vue
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Save and Deploy** — first build takes ~2 min; subsequent ones ~30 s

Cloudflare auto-rebuilds on every push to `main`. Each PR gets its own preview URL.

## What this demo deliberately does NOT do

- No real authentication — `auth` is a `localStorage.email` flag
- No real server actions — Start / Stop / Restart show an `alert()`
- No real file editing — file tree is static
- No real plugin install — toggle just flips a `Set` in memory

In production, every data source above maps cleanly to a Laravel API endpoint (server CRUD, console socket, plugins from CurseForge / Modrinth, billing via Stripe).

## License

MIT.
