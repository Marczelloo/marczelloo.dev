# marczelloo.dev — Portfolio

Portfolio of Marcel Moskwa, a full-stack developer working with AI agents. It comes in two versions:

- **Case file** (`/`) — a 3D detective board in a dark office on a rainy night, built with three.js and React Three Fiber. Every project, the CV and the contact details are pinned to it as documents and photos you can pick up, flip and read.
- **Classic** (`/classic`) — a regular scrolling portfolio with the same projects, the process and the experience.

Plus a printable CV (`/cv`), a privacy page and a contact form powered by Resend and a Discord webhook.

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack), React 19
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

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the root:

```env
RESEND_API_KEY=re_...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

## Docker

Build and run on port **3200**:

```bash
docker compose up --build
```

The app uses Next.js `standalone` output for a minimal production image.

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
├── _data/projects.ts   # Projects shared by the board, the classic page and the CV
├── cv/page.tsx         # Printable CV
├── privacy/page.tsx    # Privacy policy
├── api/contact/        # POST endpoint (Resend email + Discord webhook)
├── sitemap.ts, robots.ts
└── layout.tsx          # Root layout, SEO metadata, fonts
scripts/pets/           # Bundles the Agent Pets renderer into public/pets/perch.js
```

`DESIGN.md` records the design system and `PRODUCT.md` the content decisions.

## License

Private — all rights reserved.
