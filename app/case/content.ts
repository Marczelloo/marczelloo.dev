// Single source of truth for the case board. The 3D scene renders card faces
// from this data and the transcript overlay renders the same data as HTML.

import { PROJECTS } from "../_data/projects";

export type CardKind = "dossier" | "sheet" | "polaroid" | "index" | "manila" | "note" | "cv";

export type TranscriptSection = {
  label?: string;
  body?: string;
  items?: readonly string[];
};

export type CaseLink = { label: string; href: string };

export type CaseCard = {
  id: string;
  kind: CardKind;
  /** Short label used for the HUD / aria and the transcript heading. */
  title: string;
  /** Board placement in metres, relative to the board centre (x right, y up). */
  position: readonly [number, number];
  /** Rotation around the board normal, degrees. */
  tilt: number;
  /** Face content drawn on the 3D paper. */
  face: {
    stamp?: string;
    heading: string;
    subheading?: string;
    lines?: readonly string[];
    image?: string;
    caption?: string;
  };
  /** Back of the card, shown when the card is turned over in inspect mode. */
  back?: {
    heading: string;
    lines: readonly string[];
  };
  transcript: {
    heading: string;
    intro?: string;
    sections: readonly TranscriptSection[];
    links?: readonly CaseLink[];
  };
};

export const CASE_NUMBER = "CASE Nº 0425-MM";

export const LINKS = {
  cv: "/cv",
  classic: "/classic",
  github: "https://github.com/Marczelloo",
  linkedin: "https://linkedin.com/in/marczelloo",
  email: "mailto:moskwamarcel@gmail.com",
} as const;

/** Transcript for a project exhibit, built from the same data the classic portfolio uses. */
function exhibitTranscript(slug: string, letter: string): CaseCard["transcript"] {
  const p = PROJECTS.find((project) => project.slug === slug)!;
  return {
    heading: `Exhibit ${letter} — ${p.name}`,
    intro: `${p.tagline} ${p.summary}`,
    sections: [...(p.highlights ? [{ label: "Evidence", items: p.highlights }] : []), { label: "Stack", items: p.stack }],
    links: [...(p.live ? [{ label: "Open it", href: p.live }] : []), ...(p.github ? [{ label: "GitHub", href: p.github }] : [])],
  };
}

export const CARDS: readonly CaseCard[] = [
  {
    id: "subject",
    kind: "dossier",
    title: "Subject profile",
    position: [-0.12, 0.12],
    tilt: -1.5,
    face: {
      stamp: "CONFIDENTIAL",
      heading: "SUBJECT: MARCEL MOSKWA",
      subheading: "a.k.a. MARCZELLOO",
      image: "/case/subject-mugshot.jpg",
      lines: [
        "Occupation: Full-stack developer",
        "Status: CS student, Univ. of Silesia",
        "Known for: building with AI agents",
        "Also: the tools those agents run on",
        "Languages: Polish, English (C1)",
        "Location: Sosnowiec, Poland",
      ],
    },
    back: {
      heading: "FIELD NOTES",
      lines: [
        "Plans the work, writes every task down.",
        "Hands the building to agents: Claude",
        "Code subagents, Codex via his own MCP.",
        "Review agents check the changes,",
        "then he runs and tests it himself.",
        "Ships to a Raspberry Pi at home.",
      ],
    },
    transcript: {
      heading: "Subject profile — Marcel Moskwa",
      intro:
        "Full-stack developer and Computer Science student from Sosnowiec, Poland. Builds with AI agents, and builds the tools they run on: two internships, a paid client project and self-hosted products shipped end to end.",
      sections: [
        { label: "Occupation", body: "Full-stack developer: web products, desktop tools and the infrastructure they run on." },
        {
          label: "Known work",
          items: [
            "Agent Pets: animated pets on the Windows taskbar that show what coding agents are doing",
            "MewBit: a self-hosted Discord music bot with a shared player inside the voice channel",
            "Marczelloo Dashboard: the control panel for a Raspberry Pi homelab",
            "Agent Router MCP: the server that hands work from Claude to Codex, with guardrails",
          ],
        },
        { label: "Record", items: ["2 software internships", "1 paid client project", "C1 English (University of Silesia exam, 2026)"] },
      ],
      links: [
        { label: "Open CV", href: LINKS.cv },
        { label: "GitHub", href: LINKS.github },
      ],
    },
  },
  {
    id: "history",
    kind: "sheet",
    title: "Known history",
    position: [-0.98, 0.22],
    tilt: 2.2,
    face: {
      heading: "KNOWN HISTORY",
      lines: [
        "2025 -     Univ. of Silesia - Computer Science",
        "AUG 2024   RecodeIT / D9 Space - paid project",
        "           PHP + WordPress booking module",
        "MAY 2024   RecodeIT - full-stack intern",
        "           Next.js, TypeScript, PostgreSQL",
        "MAY 2023   Hurtopony - dev intern",
        "           PHP + MySQL reporting tools",
        "2020-2025  ZSEiI Sosnowiec - prog. technician",
        "           INF.03 (2023)  INF.04 (2024)",
      ],
    },
    transcript: {
      heading: "Known history",
      intro: "A path built through formal education, real company data, team delivery, and independent products.",
      sections: [
        {
          label: "Oct 2025 – present · Computer Science student · University of Silesia",
          items: ["Algorithmic thinking and computer science fundamentals", "Planned graduation in 2029", "C1 English proficiency exam completed in 2026"],
        },
        {
          label: "Aug – Sep 2024 · Full-Stack Developer · RecodeIT / D9 Space (paid project)",
          items: [
            "Contributed to a client booking module built with PHP and WordPress",
            "Worked on the booking interface and user flow",
            "Supported form logic and email-message integration",
          ],
        },
        {
          label: "May 2024 · Full-Stack Intern · RecodeIT",
          items: [
            "Developed an internal employee panel with Next.js and TypeScript",
            "Worked with PostgreSQL data and schema changes",
            "Collaborated through pull requests and code review",
          ],
        },
        {
          label: "May 2023 · Software Development Intern · Hurtopony",
          items: [
            "Created reports and calculators with PHP and MySQL on real company data",
            "Analyzed and corrected existing scripts",
            "Prepared practical user documentation",
          ],
        },
        {
          label: "2020 – 2025 · Programming Technician · ZSEiI, Sosnowiec",
          items: ["INF.03 web application certification in 2023", "INF.04 software application certification in 2024"],
        },
      ],
    },
  },
  {
    id: "agent-pets",
    kind: "polaroid",
    title: "Exhibit A — Agent Pets",
    position: [0.72, 0.42],
    tilt: 4,
    face: { heading: "EXHIBIT A", image: "/projects/agent-pets-panel.webp", caption: "Agent Pets" },
    back: {
      heading: "EXHIBIT A - AGENT PETS",
      lines: [
        "Every coding-agent session gets a pet",
        "on the Windows 11 taskbar. It codes,",
        "reads, waves when the agent needs you",
        "and naps when it is idle.",
        "",
        "Stack: Rust, Tauri 2, TypeScript",
      ],
    },
    transcript: exhibitTranscript("agent-pets", "A"),
  },
  {
    id: "mewbit",
    kind: "polaroid",
    title: "Exhibit B — MewBit",
    position: [1.12, 0.02],
    tilt: -5,
    face: { heading: "EXHIBIT B", image: "/projects/mewbit-character.webp", caption: "MewBit" },
    back: {
      heading: "EXHIBIT B - MEWBIT",
      lines: [
        "Self-hosted Discord music bot with a",
        "shared player inside the voice channel,",
        "a 15-band EQ, synced lyrics and an",
        "AI DJ checked against real tracks.",
        "",
        "Stack: Node.js, Lavalink, React",
      ],
    },
    transcript: exhibitTranscript("mewbit", "B"),
  },
  {
    id: "dashboard",
    kind: "polaroid",
    title: "Exhibit C — Marczelloo Dashboard",
    position: [0.62, -0.38],
    tilt: -2,
    face: { heading: "EXHIBIT C", image: "/projects/marczelloo_dashboard.webp", caption: "Dashboard" },
    back: {
      heading: "EXHIBIT C - DASHBOARD",
      lines: [
        "Control panel for a Raspberry Pi",
        "homelab: deploys from GitHub, Docker",
        "containers via Portainer, uptime",
        "checks with Discord alerts.",
        "",
        "Stack: Next.js, Docker, Portainer",
      ],
    },
    transcript: exhibitTranscript("dashboard", "C"),
  },
  {
    id: "atlashub",
    kind: "polaroid",
    title: "Exhibit D — AtlasHub",
    position: [1.15, -0.5],
    tilt: 6,
    face: { heading: "EXHIBIT D", image: "/projects/atlashub.webp", caption: "AtlasHub" },
    back: {
      heading: "EXHIBIT D - ATLASHUB",
      lines: [
        "Self-hosted Supabase alternative:",
        "a PostgreSQL database and S3 storage",
        "for every project, behind a Fastify",
        "gateway and a Next.js admin panel.",
        "",
        "Stack: Fastify, Next.js, PostgreSQL",
      ],
    },
    transcript: exhibitTranscript("atlashub", "D"),
  },
  {
    id: "method",
    kind: "index",
    title: "Method of operation",
    position: [-0.92, -0.48],
    tilt: -3,
    face: {
      heading: "METHOD OF OPERATION",
      lines: [
        "1 PLAN:     task, files, definition",
        "2 DELEGATE: subagents, Codex via MCP",
        "3 REVIEW:   review agents, notes back",
        "4 TEST:     runs and clicks it himself",
        "5 SHIP:     Docker Compose on a Pi,",
        "            Cloudflare Tunnel",
      ],
    },
    transcript: {
      heading: "Method of operation",
      intro: "Agents write a lot of the code. The subject decides what gets built and checks what ships.",
      sections: [
        {
          label: "Plan",
          body: "Works out what to build with Claude Code, makes the architecture calls and writes each task down with a goal, the files it touches and how to tell it's done.",
        },
        {
          label: "Delegate",
          body: "Implementation goes to Sonnet subagents or to Codex through Agent Router MCP, his own server that checks quota, picks the model and isolates risky work in git worktrees.",
        },
        {
          label: "Review",
          body: "Separate review agents go through the changes. He reads their findings and each agent's summary, and anything that looks off goes back with notes.",
        },
        {
          label: "Test & ship",
          body: "Runs it and clicks through it himself, then deploys with Docker Compose to a Raspberry Pi at home, served through Cloudflare Tunnel.",
        },
      ],
      links: [{ label: "Agent Router MCP on GitHub", href: "https://github.com/Marczelloo/agent-router-mcp" }],
    },
  },
  {
    id: "contact",
    kind: "manila",
    title: "Contact",
    position: [-0.1, -0.56],
    tilt: 1.5,
    face: {
      heading: "IF FOUND, CONTACT:",
      lines: ["moskwamarcel@gmail.com", "github.com/Marczelloo", "linkedin.com/in/marczelloo", "", "Open to full-stack roles,", "internships & freelance."],
    },
    transcript: {
      heading: "Contact",
      intro: "Open to full-stack roles, internships and freelance projects. Send the context and I will reply directly.",
      sections: [],
      links: [
        { label: "moskwamarcel@gmail.com", href: LINKS.email },
        { label: "GitHub", href: LINKS.github },
        { label: "LinkedIn", href: LINKS.linkedin },
      ],
    },
  },
  {
    id: "note",
    kind: "note",
    title: "Note",
    position: [0.2, 0.6],
    tilt: -7,
    face: { heading: "Hiring?", lines: ["-> the CV is", "pinned below"] },
    transcript: {
      heading: "A note on the board",
      intro: "Hiring? The CV is pinned right below this note, and the full version is one click away.",
      sections: [],
      links: [{ label: "Open CV", href: LINKS.cv }],
    },
  },
  {
    id: "cv",
    kind: "cv",
    title: "Curriculum vitae",
    position: [0.33, 0.03],
    tilt: 2.5,
    face: {
      stamp: "ON FILE",
      heading: "MARCEL MOSKWA",
      subheading: "Full-stack developer - works with AI agents",
      caption: "Sosnowiec, PL - moskwamarcel@gmail.com - marczelloo.dev",
      lines: [
        "# PROFILE",
        "Full-stack developer and CS student.",
        "2 internships, 1 paid client project.",
        "# EXPERIENCE",
        "2024     RecodeIT / D9 Space - Full-Stack Dev",
        "2024     RecodeIT - Full-Stack Intern",
        "2023     Hurtopony - Software Dev Intern",
        "# PROJECTS",
        "Agent Pets, MewBit, Dashboard, AtlasHub",
        "# SKILLS",
        "TypeScript, React, Next.js, Node.js, SQL",
        "Docker, Linux / Raspberry Pi, Cloudflare",
        "Claude Code, Codex, MCP: plan, review",
        "# LANGUAGES",
        "Polish (native), English (C1)",
      ],
    },
    back: {
      heading: "FOR THE RECRUITER",
      lines: ["Full CV with contact details:", "marczelloo.dev/cv", "", "Projects: see exhibits A-D.", "Code: github.com/Marczelloo"],
    },
    transcript: {
      heading: "Curriculum vitae",
      intro:
        "Full-stack developer and Computer Science student from Sosnowiec, Poland: two internships, a paid client project and self-hosted products built and shipped end to end, with AI agents in a supervised workflow.",
      sections: [
        {
          label: "Experience",
          items: [
            "Aug – Sep 2024 · Full-Stack Developer · RecodeIT / D9 Space (paid client project)",
            "May 2024 · Full-Stack Intern · RecodeIT",
            "May 2023 · Software Development Intern · Hurtopony",
          ],
        },
        {
          label: "Education",
          items: [
            "Oct 2025 – present · Computer Science (engineering) · University of Silesia",
            "2020 – 2025 · Programming Technician · ZSEiI Sosnowiec · INF.03 (2023), INF.04 (2024)",
          ],
        },
        {
          label: "Skills",
          items: [
            "Core: TypeScript, JavaScript, React, Next.js, Node.js, SQL / PostgreSQL, Git",
            "Used in projects: Tailwind CSS, Fastify, Express, PHP, MySQL, MongoDB, Rust (Tauri 2), REST APIs",
            "Infrastructure: Docker, Docker Compose, Linux / Raspberry Pi, Cloudflare Tunnel, Portainer",
            "Working with AI: Claude Code, Codex, opencode, MCP; planning, delegating, agent review and testing",
          ],
        },
        { label: "Languages", items: ["Polish: native", "English: C1 (University of Silesia exam, 2026)"] },
      ],
      links: [
        { label: "Open full CV", href: LINKS.cv },
        { label: "GitHub", href: LINKS.github },
        { label: "LinkedIn", href: LINKS.linkedin },
      ],
    },
  },
] as const;

/** Red string connections between pinned cards (by id). */
export const STRINGS: readonly (readonly [string, string])[] = [
  ["subject", "history"],
  ["subject", "agent-pets"],
  ["subject", "dashboard"],
  ["agent-pets", "mewbit"],
  ["dashboard", "atlashub"],
  ["subject", "method"],
  ["subject", "contact"],
  ["subject", "cv"],
  ["note", "cv"],
];

/**
 * Loose evidence pinned around the cards. It can be zoomed in on like a card,
 * but not picked up and has no transcript, just a line in the hint bar.
 */
export type Exhibit = { id: string; title: string; caption: string };

export const EXHIBITS: readonly Exhibit[] = [
  { id: "newspaper", title: "Newspaper clipping", caption: "Front page. The deploy went fine, apparently." },
  { id: "map", title: "City map", caption: "Sosnowiec, marked up. Every route ends at the desk." },
  { id: "fingerprints", title: "Fingerprint record", caption: "Four prints on file. No match." },
  { id: "receipt", title: "Diner receipt", caption: "Four coffees, one bug, zero arrests." },
  { id: "stickyFriday", title: "Sticky note", caption: "Someone pushed to main on a Friday." },
  { id: "stickyDns", title: "Sticky note", caption: "It's always DNS." },
  { id: "matchbook", title: "Matchbook", caption: "The Black Cat. Open late, like the subject." },
  { id: "floppy", title: "Floppy disk", caption: "The backup of the backup. Do not format." },
  { id: "key", title: "Evidence item 07", caption: "A brass key. Possibly to prod." },
];
