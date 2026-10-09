# marczelloo.dev — Portfolio

Portfolio of Marcel Moskwa, a full-stack developer working with AI agents. It comes in two versions:

- **Case file** (`/`) — a 3D detective board in a dark office on a rainy night, built with three.js and React Three Fiber. Every project, the CV and the contact details are pinned to it as documents and photos you can pick up, flip and read. Each project is a typed report with its photo prints strung underneath. A transcript panel (`T`) shows the same content as plain, accessible text.
- **Classic** (`/classic`) — a regular scrolling portfolio with the same projects, the process and the experience.

Plus a printable CV in Polish (`/cv`), a privacy page and a contact form powered by Resend and a Discord webhook.

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **3D** — three.js, @react-three/fiber, drei, postprocessing
- **Styling** — Tailwind CSS v4, CSS custom properties
- **Animations** — Framer Motion
- **Email** — Resend, Discord webhooks
- **Package Manager** — pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the case board, or [http://localhost:3000/classic](http://localhost:3000/classic) for the classic version.

| Script            | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `pnpm dev`        | Development server                                                   |
| `pnpm build`      | Production build (`standalone` output)                               |
| `pnpm start`      | Serves the production build                                          |
| `pnpm lint`       | ESLint                                                               |
| `pnpm build:pets` | Bundles the Agent Pets renderer into `public/pets/perch.js`          |

## Environment Variables

Create a `.env` file in the root:

```env
RESEND_API_KEY=re_...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

Both are only needed for the contact form.

## Docker

Build and run on port **3200** (bound to `127.0.0.1`):

```bash
docker compose up --build
```

The app uses Next.js `standalone` output for a minimal production image.

## SEO and icons

The two versions are shared separately, so each has its own title, description, canonical URL, share image, favicon set and web manifest. All of it comes from `versionMetadata()` in `app/_data/seo.ts`:

| Version | Share image            | Icons                   | Manifest                     |
| ------- | ---------------------- | ----------------------- | ---------------------------- |
| Case    | `public/og/case.jpg`   | `public/icons/case/`    | `public/case.webmanifest`    |
| Classic | `public/og/classic.jpg`| `public/icons/classic/` | `public/classic.webmanifest` |

The CV and privacy pages use the classic set. `public/favicon.ico` is the case icon, for clients that ask for it without reading the page. `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.

## Project Structure

```text
app/
├── page.tsx            # Case file (the 3D board) — home page
├── case/
│   ├── content.ts      # Every card on the board: faces, backs, transcripts, strings
│   ├── _scene/         # Room, lights, cards, props, post-processing
│   └── _ui/            # Overlay, transcript panel, audio
├── classic/page.tsx    # Classic portfolio
├── _components/        # Classic sections (Hero, Work, Process, Journey, Contact), navbar
├── _data/
│   ├── projects.ts     # Projects shared by the board, the classic page and the CV
│   └── seo.ts          # Per-version metadata: share image, icons, manifest
├── cv/                 # Printable CV
├── privacy/page.tsx    # Privacy policy
├── api/contact/        # POST endpoint (Resend email + Discord webhook)
├── sitemap.ts, robots.ts
└── layout.tsx          # Root layout, shared metadata, fonts, JSON-LD
public/
├── case/               # Board textures, models, audio
├── projects/           # Project screenshots
├── icons/, og/         # Favicons and share images for both versions
└── pets/perch.js       # Built by `pnpm build:pets`
scripts/pets/           # Source of the Agent Pets renderer bundle
```

`DESIGN.md` records the design system and `PRODUCT.md` the content decisions.

## License

Private — all rights reserved.
