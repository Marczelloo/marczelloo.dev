/**
 * Every project the portfolio and the CV mention, in one place.
 *
 * Facts here come from the repositories themselves (READMEs, package manifests,
 * GitHub metadata). Do not add metrics, users or results that cannot be checked.
 */

export type ProjectTier = "flagship" | "notable" | "in-progress" | "archive";

export type Project = {
  slug: string;
  name: string;
  tier: ProjectTier;
  year: string;
  /** One line, used as the poster headline. */
  tagline: string;
  /** Two or three sentences for the portfolio. */
  summary: string;
  /** Polish one-liner for the CV. */
  summaryPl?: string;
  highlights?: string[];
  stack: string[];
  github?: string;
  live?: string;
  image?: string;
  imageAlt?: string;
  /** Poster colour world, independent from the site's own palette. */
  accent?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "agent-pets",
    name: "Agent Pets",
    tier: "flagship",
    year: "2026",
    tagline: "Your coding agents, alive on the Windows 11 taskbar.",
    summary:
      "Every session of Claude Code, Codex, opencode, GitHub Copilot, Antigravity, Cursor, Grok Build or ZCode gets its own animated pet. It codes at a desk, runs commands, reads files, waves when the agent needs you and naps when it is idle, with rate limits and progress right next to it.",
    summaryPl:
      "Animowane zwierzaki na pasku zadań Windows 11 pokazujące, co robią agenci AI (Claude Code, Codex, opencode, Copilot i inni). Rust/Tauri 2, renderer canvas w TypeScript, publiczne wydania z auto-aktualizacją.",
    highlights: [
      "Nine pets, twelve states and seven looks, drawn by a dependency-free canvas renderer",
      "Rust and Tauri 2 shell embedded in the Windows taskbar through Win32",
      "Reads agent activity from local hooks and files, nothing leaves the machine",
      "A Claude Code plugin with live limits and a /pets pane, released through GitHub with an auto-updater",
    ],
    stack: ["Rust", "Tauri 2", "TypeScript", "Canvas 2D", "Win32"],
    github: "https://github.com/Marczelloo/agent-pets",
    live: "https://agent-pets.marczelloo.dev",
    image: "/projects/agent-pets.png",
    imageAlt: "Agent Pets banner with nine pets perched on the wordmark above a Windows 11 taskbar",
    accent: "#d97757",
  },
  {
    slug: "mewbit",
    name: "MewBit",
    tier: "flagship",
    year: "2025–2026",
    tagline: "A self-hosted Discord music bot with a player inside the voice channel.",
    summary:
      "Deezer, Spotify, SoundCloud and YouTube searched together, FLAC playback, a fifteen-band equalizer, synced lyrics and an AI DJ whose picks are verified against real tracks. Three surfaces share one state: a Discord Activity, a player embed and a web dashboard for server admins.",
    summaryPl:
      "Self-hostowany bot muzyczny na Discorda: Lavalink v4, wspólny odtwarzacz jako Discord Activity, dashboard webowy, 15-pasmowy EQ, synchronizowane teksty i AI DJ. Następca NeoBeat Buddy.",
    highlights: [
      "Lavalink v4 playback with cross-provider loudness compensation and recovery snapshots",
      "Shared Discord Activity built with React and the Embedded App SDK",
      "AI DJ plans transitions; every proposal is checked against a playable provider entry",
      "78 slash commands, DJ roles, vote-to-skip, moderation and listening statistics",
    ],
    stack: ["Node.js", "discord.js", "Lavalink", "React", "Docker"],
    github: "https://github.com/Marczelloo/MewBit",
    live: "https://mewbit.marczelloo.dev",
    image: "/projects/mewbit.png",
    imageAlt: "MewBit cover art with the bot's character",
    accent: "#f472b6",
  },
  {
    slug: "dashboard",
    name: "Marczelloo Dashboard",
    tier: "flagship",
    year: "2026",
    tagline: "The control panel for my Raspberry Pi homelab.",
    summary:
      "A private, self-hosted panel that deploys my projects from GitHub, controls Docker containers through Portainer and watches every site with uptime checks and Discord alerts. It runs behind Cloudflare Access on the same Pi it manages.",
    summaryPl:
      "Self-hostowany panel do homelabu na Raspberry Pi: wdrożenia z GitHuba przez Docker Compose, sterowanie kontenerami przez Portainer API, monitoring uptime z alertami na Discordzie, Cloudflare Access.",
    highlights: [
      "Managed deploys from GitHub with Docker Compose preflight and durable job logs",
      "Container start, stop, restart and live logs through the Portainer API",
      "Uptime monitoring with Discord and e-mail alerts",
      "Import projects straight from GitHub, with commits, PRs and releases per project",
    ],
    stack: ["Next.js", "TypeScript", "Docker", "Portainer API", "Cloudflare Tunnel"],
    github: "https://github.com/Marczelloo/Marczelloo-dashboard",
    live: "https://demo-dashboard.marczelloo.dev/projects",
    image: "/projects/marczelloo_dashboard.png",
    imageAlt: "Marczelloo Dashboard project list with deploy and uptime status",
    accent: "#4ade80",
  },
  {
    slug: "atlashub",
    name: "AtlasHub",
    tier: "notable",
    year: "2026",
    tagline: "A lightweight, self-hosted Supabase alternative.",
    summary:
      "A Backend-as-a-Service platform that gives every project its own PostgreSQL database and S3-compatible storage, behind a Fastify gateway and a Next.js admin dashboard.",
    summaryPl:
      "Self-hostowana platforma Backend-as-a-Service: osobna baza PostgreSQL i magazyn S3 (MinIO) dla każdego projektu, gateway w Fastify, panel administracyjny w Next.js.",
    stack: ["Fastify", "Next.js", "PostgreSQL", "MinIO", "Docker"],
    github: "https://github.com/Marczelloo/atlashub",
    live: "https://admin-atlashub.marczelloo.dev/landing",
    image: "/projects/atlashub.png",
    imageAlt: "AtlasHub admin dashboard",
    accent: "#60a5fa",
  },
  {
    slug: "agent-router-mcp",
    name: "Agent Router MCP",
    tier: "notable",
    year: "2026",
    tagline: "Guardrails for handing work from Claude to Codex.",
    summary:
      "An MCP server I use every day: Claude plans, Codex executes. It checks quota before delegating, isolates risky work in git worktrees, snapshots the tree before every turn and runs read-only cross-reviews.",
    summaryPl:
      "Serwer MCP do nadzorowanego delegowania zadań do Codexa: sprawdzanie limitów, izolacja w git worktree, checkpointy z możliwością cofnięcia, cross-review i generowanie obrazów.",
    stack: ["TypeScript", "MCP", "Node.js", "Git"],
    github: "https://github.com/Marczelloo/agent-router-mcp",
    accent: "#fbbf24",
  },
  {
    slug: "tools",
    name: "Marczelloo Tools",
    tier: "in-progress",
    year: "2026",
    tagline: "A modular toolbox for media, images, PDFs and developers.",
    summary:
      "Conversion, compression, OCR, a URL downloader and developer utilities, built to run in Docker on a Raspberry Pi. Some tools are still being finished.",
    stack: ["Next.js", "TypeScript", "FFmpeg", "yt-dlp"],
    github: "https://github.com/Marczelloo/Marczelloo-Tools",
    live: "https://tools.marczelloo.dev",
  },
  {
    slug: "szafa",
    name: "Szafa",
    tier: "in-progress",
    year: "2026",
    tagline: "A wardrobe catalogue that picks today's outfit.",
    summary:
      "A private PWA: photograph clothes, cut out the background, tag them with a model and get an outfit for the day. Not public yet.",
    stack: ["Next.js", "TypeScript", "PWA", "rembg", "OpenAI API"],
  },
  {
    slug: "bookhaven",
    name: "BookHaven",
    tier: "archive",
    year: "2025",
    tagline: "Full-stack bookstore with cart, reviews and PDF invoices.",
    summary: "Node.js, Express and MongoDB e-commerce with accounts, wishlist, daily promotions and order tracking.",
    summaryPl: "Księgarnia e-commerce w Node.js, Express i MongoDB: konta, koszyk, recenzje, promocje, faktury PDF.",
    stack: ["Node.js", "Express", "MongoDB"],
    github: "https://github.com/Marczelloo/BookHaven",
    live: "https://bookhaven.marczelloo.dev",
    image: "/projects/bookhaven.png",
  },
  {
    slug: "casino-simulator",
    name: "Casino Simulator",
    tier: "archive",
    year: "2025",
    tagline: "Terminal casino with roulette, blackjack and slots.",
    summary: "C++ terminal game with a persistent leaderboard, player management and animated gameplay.",
    stack: ["C++"],
    github: "https://github.com/Marczelloo/CasinoSimulator",
  },
  {
    slug: "ships-game",
    name: "Ships Game",
    tier: "archive",
    year: "2025",
    tagline: "Battleships against the computer, in the terminal.",
    summary: "Board rendering, coordinate input and a computer opponent in plain C++.",
    stack: ["C++"],
    github: "https://github.com/Marczelloo/ShipsGame",
  },
  {
    slug: "collection-manager",
    name: "Collection Manager",
    tier: "archive",
    year: "2024",
    tagline: "A .NET MAUI app for cataloguing collections.",
    summary: "Create collections and add items to them, across the platforms MAUI targets.",
    stack: ["C#", ".NET MAUI", "XAML"],
    github: "https://github.com/Marczelloo/SystemZarzadzaniaKolekcjonerstwem",
  },
  {
    slug: "snake",
    name: "Snake",
    tier: "archive",
    year: "2023",
    tagline: "The classic, in C++ with raylib.",
    summary: "A small game loop, input handling and rendering with raylib.",
    stack: ["C++", "raylib"],
    github: "https://github.com/Marczelloo/Simple-Snake-Game",
  },
];

export const projectsByTier = (tier: ProjectTier) => PROJECTS.filter((p) => p.tier === tier);
