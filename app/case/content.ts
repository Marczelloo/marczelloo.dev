// Single source of truth for the case board. The 3D scene renders card faces
// from this data and the transcript overlay renders the same data as HTML.

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
  classic: "/",
  github: "https://github.com/Marczelloo",
  linkedin: "https://linkedin.com/in/marczelloo",
  email: "mailto:moskwamarcel@gmail.com",
} as const;

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
        "Known for: shipping web products",
        "Method: supervised AI-agent workflow",
        "Languages: Polish, English (C1)",
        "Location: Silesia, Poland",
      ],
    },
    back: {
      heading: "FIELD NOTES",
      lines: [
        "Starts from the user flow and data model.",
        "Works across UI, backend, DB and deploy.",
        "Uses AI agents to plan, build, delegate",
        "and verify - keeps the engineering call.",
        "Prefers improving code over adding",
        "complexity. Documents decisions.",
      ],
    },
    transcript: {
      heading: "Subject profile — Marcel Moskwa",
      intro:
        "Computer science student and programming technician with two internships, a paid client project, and a growing set of independently shipped full-stack products.",
      sections: [
        { label: "Occupation", body: "Junior full-stack developer — web products from interface to deployment." },
        {
          label: "Method",
          items: [
            "Start from the user flow and data model, then choose the smallest reliable implementation.",
            "Work across UI, backend logic, databases, and deployment instead of treating them as separate worlds.",
            "Use AI agents for planning, implementation support, delegation, and verification while retaining engineering judgment.",
            "Document decisions and improve existing code before adding unnecessary complexity.",
          ],
        },
        { label: "Record", items: ["2 software internships", "1 paid client project", "C1 English proficiency"] },
      ],
      links: [
        { label: "Download CV", href: "/cv" },
        { label: "GitHub", href: "https://github.com/Marczelloo" },
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
          items: ["Worked on the booking interface and user flow", "Supported form logic and email-message integration", "Delivered assigned work through Git-based collaboration"],
        },
        {
          label: "May 2024 · Full-Stack Intern · RecodeIT",
          items: ["Built features with Next.js and TypeScript", "Worked with PostgreSQL data and schema changes", "Collaborated through pull requests and code review"],
        },
        {
          label: "May 2023 · Software Development Intern · Hurtopony",
          items: ["Created reporting tools with PHP and MySQL", "Analyzed and corrected existing scripts", "Prepared practical user documentation"],
        },
        {
          label: "2020 – 2025 · Programming Technician · ZSEiI, Sosnowiec",
          items: ["INF.03 web application certification in 2023", "INF.04 software application certification in 2024"],
        },
      ],
    },
  },
  {
    id: "dashboard",
    kind: "polaroid",
    title: "Exhibit A — Marczelloo Dashboard",
    position: [0.72, 0.42],
    tilt: 4,
    face: { heading: "EXHIBIT A", image: "/projects/marczelloo_dashboard.png", caption: "Marczelloo Dashboard" },
    back: {
      heading: "EXHIBIT A - DASHBOARD",
      lines: [
        "Control center for projects, services,",
        "deployments, GitHub activity and",
        "Raspberry Pi infrastructure.",
        "",
        "Stack: Next.js, GitHub API, Docker",
      ],
    },
    transcript: {
      heading: "Exhibit A — Marczelloo Dashboard",
      intro: "A control center for projects, services, deployments, GitHub activity, and Raspberry Pi infrastructure.",
      sections: [
        { label: "Contribution", body: "Designed and built the responsive product interface, integrations, deployment flow, and monitoring views." },
        { label: "Stack", items: ["Next.js", "GitHub API", "Docker"] },
      ],
      links: [
        { label: "Live demo", href: "https://demo-dashboard.marczelloo.dev/projects" },
        { label: "GitHub", href: "https://github.com/Marczelloo/Marczelloo-dashboard" },
      ],
    },
  },
  {
    id: "atlashub",
    kind: "polaroid",
    title: "Exhibit B — AtlasHub",
    position: [1.12, 0.02],
    tilt: -5,
    face: { heading: "EXHIBIT B", image: "/projects/atlashub.png", caption: "AtlasHub" },
    back: {
      heading: "EXHIBIT B - ATLASHUB",
      lines: [
        "Central workspace for organizing",
        "projects and resources through clear",
        "sections, categories and navigation.",
        "",
        "Stack: Next.js, PostgreSQL, Tailwind",
      ],
    },
    transcript: {
      heading: "Exhibit B — AtlasHub",
      intro: "A central workspace for organizing projects and resources through clear sections, categories, and navigation.",
      sections: [
        { label: "Contribution", body: "Built a component-driven frontend and structured the application state around a focused workspace flow." },
        { label: "Stack", items: ["Next.js", "PostgreSQL", "Tailwind CSS"] },
      ],
      links: [
        { label: "Live demo", href: "https://admin-atlashub.marczelloo.dev/landing" },
        { label: "GitHub", href: "https://github.com/Marczelloo/atlashub" },
      ],
    },
  },
  {
    id: "bookhaven",
    kind: "polaroid",
    title: "Exhibit C — BookHaven",
    position: [0.62, -0.38],
    tilt: -2,
    face: { heading: "EXHIBIT C", image: "/projects/bookhaven.png", caption: "BookHaven" },
    back: {
      heading: "EXHIBIT C - BOOKHAVEN",
      lines: [
        "Deployed bookstore demo: browsing,",
        "search, accounts, wishlists, cart.",
        "",
        "Stack: Node.js, Express, MongoDB",
      ],
    },
    transcript: {
      heading: "Exhibit C — BookHaven",
      intro: "A deployed bookstore demo with browsing, search, user accounts, wishlists, and a shopping cart.",
      sections: [
        { label: "Contribution", body: "Created the full-stack application and organized its Node.js, Express, and MongoDB architecture for extension." },
        { label: "Stack", items: ["Node.js", "Express", "MongoDB"] },
      ],
      links: [
        { label: "Live demo", href: "https://bookhaven.marczelloo.dev/" },
        { label: "GitHub", href: "https://github.com/Marczelloo/BookHaven" },
      ],
    },
  },
  {
    id: "neobeat",
    kind: "polaroid",
    title: "Exhibit D — NeoBeat Buddy",
    position: [1.15, -0.5],
    tilt: 6,
    face: { heading: "EXHIBIT D", image: "/projects/neobeatbuddy.png", caption: "NeoBeat Buddy" },
    back: {
      heading: "EXHIBIT D - NEOBEAT BUDDY",
      lines: [
        "Discord music bot: slash commands,",
        "queue management, EQ presets,",
        "Docker deployment.",
        "",
        "Stack: Node.js, Discord.js, Docker",
      ],
    },
    transcript: {
      heading: "Exhibit D — NeoBeat Buddy",
      intro: "A Discord music bot with slash commands, queue management, equalizer presets, and Docker deployment.",
      sections: [
        { label: "Contribution", body: "Developed the bot workflow, audio controls, deployment configuration, and maintainable command structure." },
        { label: "Stack", items: ["Node.js", "Discord.js", "Docker"] },
      ],
      links: [
        { label: "Discord", href: "https://discord.com/invite/szxrjutGBD" },
        { label: "GitHub", href: "https://github.com/Marczelloo/NeoBeat-Buddy" },
      ],
    },
  },
  {
    id: "tools",
    kind: "index",
    title: "Tools of the trade",
    position: [-0.92, -0.48],
    tilt: -3,
    face: {
      heading: "TOOLS OF THE TRADE",
      lines: [
        "FRONT: TS, React, Next.js, Tailwind",
        "BACK:  PHP, Node.js, SQL, REST APIs",
        "DATA:  PostgreSQL, MySQL, MongoDB",
        "SHIP:  Git, Docker, PRs, deployment",
        "EDGE:  AI agents - plan, delegate,",
        "       review, verify",
      ],
    },
    transcript: {
      heading: "Tools of the trade",
      sections: [
        { label: "Frontend", body: "HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS" },
        { label: "Backend and data", body: "PHP, Node.js fundamentals, SQL, MySQL, PostgreSQL, MongoDB, Oracle SQL" },
        { label: "Delivery", body: "Git, REST APIs, WordPress, Docker fundamentals, pull requests, deployment" },
        { label: "Workflow", body: "AI agents for planning, implementation support, delegation and verification — with engineering judgment kept in the loop." },
      ],
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
      lines: ["moskwamarcel@gmail.com", "github.com/Marczelloo", "linkedin.com/in/marczelloo", "", "Open to junior roles,", "internships & freelance."],
    },
    transcript: {
      heading: "Contact",
      intro: "Open to junior roles, internships, and selected freelance projects. Send the context and I will reply directly.",
      sections: [],
      links: [
        { label: "moskwamarcel@gmail.com", href: "mailto:moskwamarcel@gmail.com" },
        { label: "GitHub", href: "https://github.com/Marczelloo" },
        { label: "LinkedIn", href: "https://linkedin.com/in/marczelloo" },
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
      links: [{ label: "Open CV", href: "/cv" }],
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
      subheading: "Junior Web / Software Developer - CS student",
      caption: "Sosnowiec, PL - moskwamarcel@gmail.com - marczelloo.dev",
      lines: [
        "# PROFILE",
        "CS student, junior full-stack developer.",
        "2 internships, 1 paid client project.",
        "# EXPERIENCE",
        "2024     RecodeIT / D9 Space - Full-Stack Dev",
        "2024     RecodeIT - Full-Stack Intern",
        "2023     Hurtopony - Software Dev Intern",
        "# EDUCATION",
        "2025-    Univ. of Silesia - Computer Science",
        "2020-25  ZSEiI Sosnowiec - Prog. Technician",
        "# SKILLS",
        "TypeScript, React, Next.js, Tailwind",
        "PHP, Node, MySQL, PostgreSQL, MongoDB",
        "Git, REST, Docker, WordPress, Java",
        "# LANGUAGES",
        "Polish (native), English (C1)",
      ],
    },
    back: {
      heading: "FOR THE RECRUITER",
      lines: [
        "Full CV with contact details:",
        "marczelloo.dev/cv",
        "",
        "Projects: see exhibits A-D.",
        "Code: github.com/Marczelloo",
      ],
    },
    transcript: {
      heading: "Curriculum vitae",
      intro:
        "Computer Science student and junior full-stack developer from Sosnowiec, Poland: two internships, a paid client project and a handful of products built and shipped end to end.",
      sections: [
        {
          label: "Profile",
          body: "Technical education in programming, hands-on work in JavaScript, TypeScript, PHP and SQL, and a growing interest in Java, automation and supervised AI-agent workflows.",
        },
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
            "Frontend: HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS",
            "Backend & data: PHP, Node.js basics, SQL, MySQL, PostgreSQL, MongoDB, Oracle SQL",
            "Tooling: Git, REST APIs, Docker basics, WordPress, Java basics",
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
  ["subject", "dashboard"],
  ["subject", "bookhaven"],
  ["dashboard", "atlashub"],
  ["bookhaven", "neobeat"],
  ["subject", "tools"],
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
