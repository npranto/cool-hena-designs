# Cool Henna Designs

Marketing site for **Shakhi & Akhi’s Henna**—natural henna art for weddings, events, and celebrations. Built with Next.js and Tailwind CSS.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Purpose              |
| --------------- | -------------------- |
| `npm run dev`   | Local dev server     |
| `npm run build` | Production build     |
| `npm run start` | Run production build |
| `npm run lint`  | ESLint               |
| `npm run test`  | Vitest (unit / UI)   |

## Recently viewed services

Service detail pages record the last few visits in the browser and show a **Recently Viewed** strip. See [docs/recently-viewed-products.md](docs/recently-viewed-products.md) for the `localStorage` key, limits, and how to clear data while testing.

## Structure (brief)

- `app/` — routes, layout, global styles
- `components/` — page sections and layout
- `components/ui/` — shared UI primitives
- `content/` — copy and data used on the site
