# marczelloo.dev — Portfolio

Dark-themed, single-page portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**. Features full-page scroll snapping on desktop, floating geometric shapes, a printable CV page, and a contact form powered by Resend + Discord webhooks.

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **Styling** — Tailwind CSS v4, CSS custom properties
- **Animations** — Framer Motion
- **Font** — Poppins (via `next/font/google`)
- **Email** — Resend
- **Notifications** — Discord Webhooks
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
├── layout.tsx          # Root layout, SEO metadata, Poppins font
├── page.tsx            # Home — fullpage scroll sections
├── globals.css         # Design tokens, section backgrounds, print styles
├── cv/page.tsx         # Printable CV page
├── api/contact/        # POST endpoint (Resend email + Discord webhook)
└── _components/
    ├── Hero.tsx        # Landing section
    ├── Journey.tsx     # Timeline / experience
    ├── Craft.tsx       # Projects carousel
    ├── About.tsx       # Bio cards
    ├── Contact.tsx     # Contact form + footer
    └── navbar.tsx      # Floating pill navbar
components/
└── useFullpageScroll.ts  # Desktop scroll-snap hook
```

## License

Private — all rights reserved.
