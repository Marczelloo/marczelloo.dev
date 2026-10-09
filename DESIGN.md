---
name: Marczelloo Portfolio
description: "Out of frame" — an editorial, poster-like developer portfolio on dark ink, where each flagship project gets its own colour world and its characters break out of the frame.
colors:
  ink: "#0b0a10"
  ink-2: "#13121a"
  paper: "#f3efe6"
  paper-mute: "#a7a2b4"
  violet: "#9b7bff"
  violet-hot: "#b49cff"
  lime: "#d7ff5f"
  error: "#ff9a9a"
  # Per-project colour worlds (only inside that project's poster or card)
  agent-pets-cream: "#fbf1e8"
  agent-pets-peach: "#f7d9c2"
  agent-pets-sand: "#f4e6d8"
  agent-pets-clay: "#d97757"
  mewbit-night: "#07060f"
  mewbit-pink: "#f472b6"
  dashboard-forest: "#163d24"
  dashboard-deep: "#0b1a10"
  dashboard-black: "#08120b"
  dashboard-green: "#4ade80"
  atlashub-blue: "#60a5fa"
  router-amber: "#fbbf24"
  # Legacy tokens, still used by /cv, /privacy and /case
  bg-900: "#090912"
  surface-900: "#10101c"
  primary-400: "#b49cff"
  text-base: "#f3f1fa"
  text-soft: "#c6c2d4"
  text-mute: "#898498"
  border-subtle: "#272638"
  border-strong: "#3d3953"
typography:
  wordmark:
    fontFamily: "Bricolage Grotesque"
    fontSize: "clamp(3.25rem, 15vw, 20rem)"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.02em"
  display:
    fontFamily: "Bricolage Grotesque"
    fontSize: "clamp(3rem, 9vw, 8.5rem)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.045em"
  poster-title:
    fontFamily: "Bricolage Grotesque"
    fontSize: "clamp(2.6rem, 6vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  meta:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.16em"
    textTransform: uppercase
rounded:
  poster: "2rem"
  card: "1.5rem"
  pill: "999px"
spacing:
  gutter-mobile: "1rem"
  gutter-desktop: "2rem"
  container: "96rem"
  section-block: "6rem–8rem"
components:
  pill-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    hoverBackgroundColor: "{colors.lime}"
    rounded: "{rounded.pill}"
    height: "44px"
  pill-secondary:
    backgroundColor: transparent
    textColor: "{colors.paper}"
    border: "1px solid paper/25"
    hoverBorder: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "44px"
  nav-pill:
    backgroundColor: "ink/85"
    textColor: "{colors.paper-mute}"
    activeBackgroundColor: "{colors.lime}"
    activeTextColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
---

# Design System: Marczelloo Portfolio

## Overview

**Creative North Star: "Out of frame"**

The page reads like a stack of printed posters laid on a dark desk. Type is huge and confident, metadata is set in small mono caps, and each flagship project is a poster in its own colour world. The characters that belong to a project — the Agent Pets and the MewBit girl — sit on or climb out of the edge of their own poster. Nothing else on the page carries mascots.

It should feel creative, a little experimental and memorable, while every sentence stays readable and every claim links to proof.

**Key characteristics:**
- Dark ink canvas with a subtle film-grain overlay (`.grain`).
- Paper-white type; violet is the brand voice; lime is a tiny signal (dots, the active nav item, hover on primary pills).
- Bricolage Grotesque for display (variable weight and width), Manrope for reading, JetBrains Mono for meta.
- Rounded posters (2rem) and pills; no small-radius "card UI".
- Natural document scroll, no scroll snapping.

## Colors

### Base
- **Ink** (#0b0a10) — page background. **Ink 2** (#13121a) — inputs, quiet panels.
- **Paper** (#f3efe6) — headings and body on dark; also the primary pill fill.
- **Paper mute** (#a7a2b4) — secondary copy and meta labels.
- **Violet** (#9b7bff) — second lines of display headings, brand emphasis. **Violet hot** (#b49cff) — eyebrows ("02 / Work"), focus rings.
- **Lime** (#d7ff5f) — signal only: live dots, the active nav item, primary-pill hover. Never large fills.

### Project colour worlds
Each flagship or notable project may use its own palette **inside its own poster or card only**:
- **Agent Pets** — warm cream/peach paper (#fbf1e8, #f7d9c2, #f4e6d8) with clay (#d97757); the only light poster, ink text.
- **MewBit** — near-black night (#07060f) over the stage art, pink accent (#f472b6).
- **Marczelloo Dashboard** — forest greens (#163d24 → #0b1a10 → #08120b) with terminal green (#4ade80).
- **AtlasHub** — blue (#60a5fa) media well. **Agent Router MCP** — amber (#fbbf24) media well.

These colours are intentional and documented here; they must not leak into shared UI.

### Named rules
**One signal.** Lime marks at most one thing per view.
**Worlds stay home.** A project colour never appears outside its project.

## Typography

- **Wordmark** — Bricolage 800 at `clamp(3.25rem, 15vw, 20rem)`, width 75; letters thin and widen around the pointer (`KineticWordmark`).
- **Display** — section headings, Bricolage 800, `clamp(3rem, 9vw, 8.5rem)`, leading 0.85, tracking −0.045em; second line in violet.
- **Poster title** — `clamp(2.6rem, 6vw, 5.5rem)`.
- **Body** — Manrope 1rem–1.25rem, max ~40rem line length.
- **Meta** — JetBrains Mono, text-xs, uppercase, tracking 0.16em: eyebrows like "02 / Work", years, chips, nav.

Use Tailwind steps or a clamp() for sizes; avoid one-off rem values.

## Layout

Container `max-w-[96rem]` with 1rem/2rem gutters. Sections use `py-24 sm:py-32`. Each section opens with a mono eyebrow and a two-line display heading, optionally with a short paragraph on the right on large screens. Flagship posters alternate image side on desktop and stack on mobile. The bottom nav pill appears only after the hero leaves the viewport.

## Signature components

- **Poster** (`Work.tsx`) — `article[data-poster]`, rounded 2rem background layer that clips the visuals, plus an unclipped `escape` slot where characters break the frame.
- **Pets perch** (`PetsPerch.tsx`) — a canvas drawn by the real Agent Pets renderer; three pets sit on the poster's top edge and stand up to wave, cheer or send hearts while the poster is hovered or focused. Loaded lazily, paused off-screen, static under reduced motion.
- **MewBit escape** — the cut-out character overflows the top of her poster via `clip-path: inset(-30% 0 0 0 …)`.
- **Pills** — primary (paper → lime on hover) and secondary (outline); min height 44px.

## Motion

Easing `cubic-bezier(0.16, 1, 0.3, 1)`. Entrances are short (300–650ms) and never block content. Every animation has a reduced-motion fallback.

## Do / Don't

- **Do** let screenshots and live links carry the proof.
- **Do** keep copy plain and specific; mono for metadata, never for paragraphs.
- **Don't** put mascots anywhere except on their own project.
- **Don't** use lime or project colours for large fills in shared UI.
- **Don't** copy the Agent Pets app UI style for the whole site; only its characters appear, on its own poster.
