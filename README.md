# Game Hosting Panel — Concept Demo

A frontend prototype of a game-server hosting customer dashboard. No backend — all data is mocked for UI/UX demonstration.

## Live Demo

🌎 **[game-hosting-panel-demo.pages.dev](https://game-hosting-panel-demo.pages.dev)**

Login with any email + password (mock auth).

## Stack

- **Vue 3** + **TypeScript** + **Vite**
- **Vue Router** + **Pinia**
- **shadcn-vue** + **Tailwind CSS** + **motion-v**
- **Chart.js** + **Lucide** icons

## Features

- Server grid with live stats, filters, search
- Server detail: Overview, Console, Files, Plugins
- Subscription & billing management
- Activity log, backups, API reference
- Dark mode, responsive layout

## Local Development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Deploy

Auto-deploys to Cloudflare Pages on every push to `main`.

## License

MIT
