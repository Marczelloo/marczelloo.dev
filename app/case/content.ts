// Single source of truth for the case board. The 3D scene renders card faces
// from this data and the transcript overlay renders the same data as HTML.

import { PROJECTS } from "../_data/projects";

export type CardKind = "dossier" | "sheet" | "report" | "photo" | "index" | "manila" | "note" | "cv";

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
  /** Size in metres when it differs from the kind's default; photos follow their print's aspect. */
  size?: readonly [number, number];
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
    /** A picture shown whole at the top of the transcript. */
    figure?: { src: string; alt: string; width: number; height: number };
  };
};

/** White border of a photo print in metres: the top holds the pin, the bottom the caption. */
export const PHOTO_BORDER = { side: 0.013, top: 0.03, bottom: 0.052 } as const;

/** Card size for a print whose picture is `width` metres wide, so the picture is never cropped. */
function photoSize(width: number, image: { width: number; height: number }): readonly [number, number] {
  const h = (width * image.height) / image.width;
  return [width + PHOTO_BORDER.side * 2, h + PHOTO_BORDER.top + PHOTO_BORDER.bottom];
}

const IMAGES = {
  petsPanel: { src: "/projects/agent-pets-panel.webp", width: 800, height: 1000 },
  petsSettings: { src: "/projects/agent-pets-settings.webp", width: 1800, height: 1200 },
  mewbitCharacter: { src: "/projects/mewbit-character.webp", width: 1024, height: 1024 },
  mewbitStage: { src: "/projects/mewbit-stage.webp", width: 1500, height: 600 },
  dashboard: { src: "/projects/marczelloo_dashboard.webp", width: 2400, height: 1383 },
} as const;

export const CASE_NUMBER = "CASE Nº 0425-MM";

export const LINKS = {
  cv: "/cv",
  classic: "/classic",
  privacy: "/privacy",
  github: "https://github.com/Marczelloo",
  linkedin: "https://linkedin.com/in/marczelloo",
  email: "mailto:moskwamarcel@gmail.com",
} as const;

const project = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;

/** Live site and repository of a project, as transcript links. */
function projectLinks(slug: string): CaseLink[] {
  const p = project(slug);
  return [...(p.live ? [{ label: "Open it", href: p.live }] : []), ...(p.github ? [{ label: "GitHub", href: p.github }] : [])];
}

/**
 * The typed report that opens each exhibit, built from the same data the classic
 * portfolio uses: tagline, the highlights as findings and the stack.
 */
function report(slug: string, letter: string, position: readonly [number, number], tilt: number): CaseCard {
  const p = project(slug);
  return {
    id: slug,
    kind: "report",
    title: `Exhibit ${letter} — ${p.name}`,
    position,
    tilt,
    face: {
      stamp: `EXHIBIT ${letter}`,
      heading: p.name.toUpperCase(),
      subheading: p.tagline,
      lines: [...(p.highlights ?? []), `STACK: ${p.stack.join(", ")}`],
      caption: p.live ? p.live.replace(/^https:\/\//, "").replace(/\/.*$/, "") : undefined,
    },
    back: {
      heading: `EXHIBIT ${letter}`,
      lines: ["Photos pinned below.", "Live site and code:", "open the transcript (T)."],
    },
    transcript: {
      heading: `Exhibit ${letter} — ${p.name}`,
      intro: `${p.tagline} ${p.summary}`,
      sections: [...(p.highlights ? [{ label: "Findings", items: p.highlights }] : []), { label: "Stack", items: p.stack }],
      links: projectLinks(slug),
    },
  };
}

type Photo = {
  id: string;
  /** Exhibit number written on the print, e.g. "A-1". */
  label: string;
  image: { src: string; width: number; height: number };
  alt: string;
  /** Handwritten under the picture. */
  caption: string;
  /** Typed on the sticker on the back. */
  back: readonly string[];
  /** What the transcript says about the picture. */
  about: string;
  /** Picture width on the board, metres. */
  width: number;
  position: readonly [number, number];
  tilt: number;
};

/** A photo print of a project, sized to the picture so nothing is cut off. */
function photo(slug: string, p: Photo): CaseCard {
  const name = project(slug).name;
  return {
    id: p.id,
    kind: "photo",
    title: `Exhibit ${p.label} — ${name}`,
    position: p.position,
    tilt: p.tilt,
    size: photoSize(p.width, p.image),
    face: { heading: `EXHIBIT ${p.label}`, image: p.image.src, caption: p.caption },
    back: { heading: `EXHIBIT ${p.label}`, lines: p.back },
    transcript: {
      heading: `Exhibit ${p.label} — ${name}`,
      figure: { ...p.image, alt: p.alt },
      intro: p.about,
      sections: [],
      links: projectLinks(slug),
    },
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
  // Exhibit A: Agent Pets. Report on top, the panel and the settings window below.
  report("agent-pets", "A", [0.38, 0.47], 1.5),
  photo("agent-pets", {
    id: "agent-pets-panel",
    label: "A-1",
    image: IMAGES.petsPanel,
    alt: "Agent Pets panel listing coding-agent sessions, each with its pet and what it is doing right now",
    caption: "every session, live",
    back: ["The panel: one row per", "agent session, its pet,", "task and progress."],
    about:
      "The Agent Pets panel. Every running session of Claude Code, Codex, opencode and the other supported agents gets a row with its pet, the current task, progress and how long ago it last did something. Subagents and stalled work show up under their parent session.",
    width: 0.22,
    position: [0.37, 0.05],
    tilt: -2,
  }),
  photo("agent-pets", {
    id: "agent-pets-settings",
    label: "A-2",
    image: IMAGES.petsSettings,
    alt: "Agent Pets settings window on the Look page, previewing a pet at its desk and the states it can show",
    caption: "nine pets, twelve states",
    back: ["Settings, Look page:", "pick a pet per agent and", "preview every state."],
    about:
      "The settings window on its Look page: a pet for each agent, a live preview at the desk, and every work state, status and reaction the renderer can draw. Taskbar, notifications and limits are set up on the pages next to it.",
    width: 0.3,
    position: [0.39, -0.46],
    tilt: 1.5,
  }),

  // Exhibit B: MewBit.
  report("mewbit", "B", [0.76, 0.46], -1.5),
  photo("mewbit", {
    id: "mewbit-character",
    label: "B-1",
    image: IMAGES.mewbitCharacter,
    alt: "MewBit, the bot's character: a girl with cat ears and headphones",
    caption: "the face of the bot",
    back: ["MewBit's character,", "used on the player", "and the website."],
    about:
      "MewBit's character. She fronts the bot on its website, in the Discord Activity and on the player embed, the three surfaces that share one playback state.",
    width: 0.24,
    position: [0.76, 0.05],
    tilt: 2.5,
  }),
  photo("mewbit", {
    id: "mewbit-stage",
    label: "B-2",
    image: IMAGES.mewbitStage,
    alt: "MewBit stage art: a pink and blue audio waveform on a dark background",
    caption: "FLAC, 15-band EQ",
    back: ["Stage art from the", "MewBit website."],
    about:
      "The stage art from MewBit's website. Behind it: Lavalink v4 playback with FLAC, a fifteen-band equalizer, loudness matched across providers and synced lyrics.",
    width: 0.31,
    position: [0.77, -0.42],
    tilt: -1.5,
  }),

  // Exhibit C: Marczelloo Dashboard.
  report("dashboard", "C", [1.12, 0.47], 2),
  photo("dashboard", {
    id: "dashboard-overview",
    label: "C-1",
    image: IMAGES.dashboard,
    alt: "Marczelloo Dashboard overview: domains, incidents, deploys, host stats and the project list with container health",
    caption: "the homelab, one screen",
    back: ["Overview page: projects,", "containers, deploys and", "the Pi's own health."],
    about:
      "The dashboard's overview: domains, incidents and deploys this week, the Raspberry Pi's CPU, memory and temperature, and every project with its containers, uptime history and last deploy. A failing container can be restarted from the same row.",
    width: 0.31,
    position: [1.11, 0.07],
    tilt: -1.5,
  }),
  {
    id: "dashboard-runbook",
    kind: "index",
    title: "Exhibit C-2 — How the dashboard runs",
    position: [1.12, -0.38],
    tilt: 2.5,
    size: [0.33, 0.21],
    face: {
      heading: "C-2  HOW IT RUNS",
      lines: [
        "HOST:    Raspberry Pi at home",
        "DEPLOY:  GitHub -> Docker Compose",
        "         with preflight + job logs",
        "CONTROL: Portainer API, live logs",
        "WATCH:   uptime -> Discord, e-mail",
        "ACCESS:  Cloudflare Tunnel + Access",
      ],
    },
    transcript: {
      heading: "Exhibit C-2 — How the dashboard runs",
      intro: "The dashboard runs on the same Raspberry Pi it manages, and only its owner can open it.",
      sections: [
        {
          items: [
            "Deploys pull a project from GitHub and run Docker Compose, with a preflight check and job logs that survive restarts",
            "Containers are started, stopped and restarted through the Portainer API, with live logs",
            "Uptime checks on every site, alerts on Discord and by e-mail",
            "Served through Cloudflare Tunnel behind Cloudflare Access; a public demo shows the interface with sample data",
          ],
        },
      ],
      links: projectLinks("dashboard"),
    },
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
    position: [-0.52, 0.6],
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
    position: [-0.555, 0.27],
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
        "Agent Pets, MewBit, Marczelloo Dashboard",
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
      lines: ["Full CV with contact details:", "marczelloo.dev/cv", "", "Projects: see exhibits A-C.", "Code: github.com/Marczelloo"],
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
          label: "Projects",
          items: ["agent-pets", "mewbit", "dashboard", "atlashub", "agent-router-mcp"].map((slug) => `${project(slug).name}: ${project(slug).tagline}`),
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

/** Suffix for a string end tied to a second pin at the bottom of a card instead of the top one. */
export const BOTTOM_PIN = ":bottom";
const bottom = (id: string) => `${id}${BOTTOM_PIN}`;

/** Red string connections between pinned cards: a card id, or `bottom(id)` for its bottom pin. */
export const STRINGS: readonly (readonly [string, string])[] = [
  ["subject", "history"],
  // The three reports hang on one line from the subject; each report runs down to its own photos.
  ["subject", "agent-pets"],
  ["agent-pets", "mewbit"],
  ["mewbit", "dashboard"],
  // From the bottom of a card down to the next, so the string never runs across a page.
  [bottom("agent-pets"), "agent-pets-panel"],
  [bottom("agent-pets-panel"), "agent-pets-settings"],
  [bottom("mewbit"), "mewbit-character"],
  [bottom("mewbit-character"), "mewbit-stage"],
  [bottom("dashboard"), "dashboard-overview"],
  [bottom("dashboard-overview"), "dashboard-runbook"],
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
