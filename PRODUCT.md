# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and technical hiring managers reviewing Marcel for full-stack roles and internships, usually after seeing his CV, LinkedIn, or GitHub profile.

Secondary: freelance clients looking for a developer who can scope, build, deploy, and maintain a practical website or web application.

## Product Purpose

The portfolio should quickly establish Marcel Moskwa as a full-stack developer who ships real products and runs AI agents as a supervised part of his engineering workflow. It should make his work, process, background, and contact paths easy to verify.

Success means a recruiter remembers the site, understands his fit within a few minutes, and continues to the CV, GitHub, LinkedIn, a live project, or the contact form. Freelance visitors should also see enough proof to start a conversation.

## Positioning

"Full-stack developer · AI-agent orchestration." Marcel plans the work, makes the architecture calls, delegates well-specified implementation to Claude and Codex agents (through his own Agent Router MCP), has other agents review the changes, reads their findings and tests the result, and self-hosts what he ships on a Raspberry Pi behind Cloudflare Tunnel. This is backed by a computer science degree in progress, a technician diploma, internships, and one paid client project.

## Operating Context

Visitors commonly arrive from a CV application, LinkedIn, or GitHub. They scan on desktop or mobile, look at the flagship projects first, then follow a live link or the source, or make contact.

## Information Architecture

Single page, natural scroll: Hero → Work (02) → Process (03) → Journey (04) → Contact (05). A fixed bottom pill nav appears after the hero. `/cv` is the printable CV; `/case` is a separate experimental 3D case board.

Project tiers on the Work section:
- **Flagship posters:** Agent Pets, MewBit, Marczelloo Dashboard.
- **Notable cards:** AtlasHub, Agent Router MCP.
- **On the bench:** Marczelloo Tools (in progress), Szafa (private, no links).
- **Archive:** BookHeaven, Casino Simulator, Shipsgame, Simple snake game, SystemZarzadzaniaKolekcjonerstwem.
- **Never shown:** Marczelloo Drive (private, must not be exposed).

## Capabilities and Constraints

- Stack: Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, Resend, and Discord webhooks.
- The Agent Pets perch uses the Agent Pets renderer bundled into `public/pets/perch.js` with `pnpm build:pets` (GPL, from the Agent Pets repo).
- Preserve working CV, project, social, and contact flows.
- Do not invent employers, responsibilities, metrics, clients, testimonials, or project results.

## Brand Commitments

- Keep the Marczelloo name and avatar.
- Dark ink and paper type with a violet brand voice; lime is a small signal accent only.
- Creative and experimental but always readable. Borrow the playfulness of Agent Pets without copying its style.
- Pets and the MewBit character appear only on their own project posters, "peeking out of the frame".
- Voice is direct, technical, and grounded. Recruitment first, freelance second.

## Evidence on Hand

- Project screenshots under `public/projects/` (webp).
- Avatar under `public/avatar.png` (the original illustration, upscaled 4x, unchanged).
- Confirmed paid client work: RecodeIT / D9 Space, August-September 2024.
- Confirmed internships: RecodeIT in May 2024 and Hurtopony in May 2023.
- Confirmed education: University of Silesia computer science degree from October 2025, planned completion in 2029; programming technician education completed in 2025 with INF.03 and INF.04 certifications.
- Confirmed English level: C1, University of Silesia proficiency exam, 2026.

## Product Principles

- Lead with work that runs: live links and source beat adjectives.
- Show the AI workflow as a process with human review, not as a buzzword.
- Make recruitment fit scannable without flattening the site's personality.
- Use motion to add character, never to delay access to content.

## Accessibility & Inclusion

Maintain keyboard navigation, visible focus states, readable contrast, reduced-motion behavior, responsive layouts, semantic headings, and descriptive image alternatives. Decorative canvases (pets, wordmark animation) are `aria-hidden`.
