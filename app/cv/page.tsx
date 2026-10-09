"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "@phosphor-icons/react";

import { PROJECTS as ALL_PROJECTS } from "../_data/projects";

const PERSONAL = {
  name: "Marcel Moskwa",
  role: "Full-stack developer · praca z agentami AI",
  phone: "730 226 226",
  email: "moskwamarcel@gmail.com",
  location: "Sosnowiec, Polska",
  github: "github.com/Marczelloo",
  linkedin: "linkedin.com/in/marczelloo",
  website: "marczelloo.dev",
};

const PROFILE =
  "Full-stack developer i student informatyki na Uniwersytecie Śląskim. Mam za sobą dwie praktyki, płatny projekt dla klienta i własne, publicznie dostępne produkty: Agent Pets (Rust/Tauri, wydania na GitHubie), bota muzycznego MewBit oraz panel do homelabu na Raspberry Pi. Na co dzień pracuję z agentami AI w nadzorowanym procesie: planuję, deleguję implementację (Claude Code, Codex), robię review i weryfikuję wyniki, a do tego procesu buduję własne narzędzia.";

const SKILLS = [
  ["Frontend", "TypeScript, JavaScript, React, Next.js, Tailwind CSS, HTML, CSS"],
  ["Backend i dane", "Node.js, Fastify, Express, PHP, REST API, SQL, PostgreSQL, MySQL, MongoDB, Oracle SQL"],
  ["Desktop i inne języki", "Rust (Tauri 2), C++, C#, Java (podstawy)"],
  ["Infrastruktura", "Docker, Docker Compose, Git, Linux / Raspberry Pi, Cloudflare Tunnel, Portainer"],
  ["Praca z AI", "Claude Code, Codex, opencode, MCP; planowanie, delegowanie zadań agentom, code review i weryfikacja wyników"],
] as const;

const EXPERIENCE = [
  {
    title: "Full-Stack Developer (umowa zlecenie)",
    company: "RecodeIT / D9 Space",
    period: "08.2024–09.2024",
    bullets: [
      "Współtworzyłem moduł rezerwacji dla strony klienta w oparciu o PHP i WordPress.",
      "Pracowałem nad interfejsem i przebiegiem procesu rezerwacji oraz wspierałem integrację logiki zgłoszeń i wiadomości e-mail.",
      "Korzystałem z Git i realizowałem zadania w małym zespole pod nadzorem opiekuna projektu.",
    ],
  },
  {
    title: "Praktykant Full-Stack",
    company: "RecodeIT",
    period: "05.2024",
    bullets: [
      "Rozwijałem wewnętrzny panel do obsługi pracowników w Next.js, TypeScript i PostgreSQL.",
      "Pracowałem z komponentami UI, bazą danych, zmianami schematu i pull requestami.",
    ],
  },
  {
    title: "Praktykant ds. rozwoju oprogramowania",
    company: "Hurtopony",
    period: "05.2023",
    bullets: [
      "Tworzyłem raporty i kalkulatory w PHP/MySQL na rzeczywistych danych firmowych.",
      "Analizowałem i poprawiałem istniejące skrypty oraz przygotowywałem dokumentację użytkową.",
    ],
  },
] as const;

const CV_PROJECTS = ["agent-pets", "mewbit", "dashboard", "atlashub", "agent-router-mcp"]
  .map((slug) => {
    const project = ALL_PROJECTS.find((p) => p.slug === slug)!;
    const href = project.live ?? project.github!;
    return {
      name: project.name,
      href,
      meta: `${href.replace(/^https:\/\//, "")} | ${project.stack.slice(0, 3).join(", ")}`,
      description: project.summaryPl!,
    };
  })
  .concat({
    name: "NAD STRONĄ",
    href: "https://nadstrona.pl",
    meta: "nadstrona.pl | własne studio stron",
    description:
      "Jednoosobowe studio, które założyłem dla małych i lokalnych firm: proste strony, landing page, redesigny i małe aplikacje webowe. Określiłem ofertę i proces realizacji, a stronę studia i dema zbudowałem z agentami AI, odpowiadając za wymagania i kontrolę jakości.",
  });

const CONSENT =
  "Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w CV na potrzeby obecnego oraz przyszłych procesów rekrutacyjnych zgodnie z obowiązującymi przepisami o ochronie danych osobowych.";

/**
 * The CV as a sheet of paper on the portfolio's dark desk. The sheet is the same on screen and in print,
 * where it becomes a single white A4 page.
 */
export default function CVPage() {
  return (
    <div className="grain min-h-[100dvh] bg-ink text-paper print:bg-white">
      <div className="mx-auto flex w-full max-w-[62rem] items-center justify-between gap-4 px-4 pb-6 pt-5 print:hidden sm:px-6 sm:pt-8">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-paper-mute transition hover:text-paper"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden="true" />
          Portfolio
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition hover:bg-lime active:translate-y-px"
        >
          <Printer size={18} weight="bold" aria-hidden="true" />
          Drukuj / PDF
        </button>
      </div>

      <main className="px-3 pb-16 print:p-0 sm:px-6">
        <article
          lang="pl"
          className="cv-sheet mx-auto w-full print:flex print:flex-col max-w-[62rem] rounded-[1.5rem] bg-paper px-5 py-8 text-sm leading-[1.5] text-ink shadow-[0_40px_120px_-50px_rgba(0,0,0,0.95)] print:max-w-none print:rounded-none print:bg-white print:text-[7.4pt] print:leading-[1.3] print:shadow-none sm:px-10 sm:py-11 lg:px-14 lg:py-14"
        >
          <header>
            <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink/60 print:pb-[1.6mm] print:text-[6.3pt]">
              <span>Curriculum vitae</span>
              <span>2026 · {PERSONAL.location}</span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end print:mt-[3.4mm] print:grid-cols-[minmax(0,1fr)_auto] print:items-end print:gap-[4mm]">
              <div>
                <h1
                  className="font-display text-[clamp(3rem,9vw,5.75rem)] font-extrabold leading-[0.84] tracking-[-0.02em] print:text-[30pt]"
                  style={{ fontVariationSettings: '"wght" 800, "wdth" 75' }}
                >
                  Marcel <span className="text-violet-ink">Moskwa</span>
                </h1>
                <p className="mt-4 font-display text-lg font-bold tracking-[-0.01em] print:mt-[2.2mm] print:text-[10.5pt]">
                  {/* A highlighter stroke under the role; it simply disappears if a printer drops backgrounds. */}
                  <span
                    className="box-decoration-clone px-1"
                    style={{ background: "linear-gradient(transparent 55%, var(--lime) 55%)" }}
                  >
                    {PERSONAL.role}
                  </span>
                </p>
              </div>
              <p className="max-w-[17rem] text-ink/70 md:text-right print:max-w-[56mm] print:text-[7.2pt]">
                Aplikacje webowe, narzędzia dla agentów AI i self-hosting na własnym sprzęcie.
              </p>
            </div>

            <div className="mt-6 grid gap-x-6 gap-y-1.5 border-y border-ink/15 py-3 font-mono text-xs text-ink/80 sm:grid-cols-2 lg:grid-cols-3 print:mt-[3.4mm] print:grid-cols-3 print:gap-x-[3mm] print:gap-y-[0.6mm] print:py-[1.8mm] print:text-[6.4pt]">
              <span>{PERSONAL.phone}</span>
              <ContactLink href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}</ContactLink>
              <ContactLink href={`https://${PERSONAL.website}`}>{PERSONAL.website}</ContactLink>
              <ContactLink href={`https://${PERSONAL.github}`}>{PERSONAL.github}</ContactLink>
              <ContactLink href={`https://${PERSONAL.linkedin}`}>{PERSONAL.linkedin}</ContactLink>
            </div>
          </header>

          <CVSection number="01" title="Profil" className="mt-8 print:mt-[4mm]">
            <p className="max-w-[54rem] text-base leading-[1.65] print:text-[8pt] print:leading-[1.38]">{PROFILE}</p>
          </CVSection>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(15rem,0.85fr)] print:mt-[4.2mm] print:grid-cols-[minmax(0,1.65fr)_minmax(0,0.85fr)] print:gap-[6mm]">
            <div className="space-y-10 print:space-y-[4mm]">
              <CVSection number="02" title="Doświadczenie">
                <div className="divide-y divide-ink/10">
                  {EXPERIENCE.map((job) => (
                    <article key={`${job.company}-${job.period}`} className="py-5 first:pt-0 last:pb-0 print:py-[2mm]">
                      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-4 print:grid-cols-[minmax(0,1fr)_auto] print:items-baseline print:gap-[2mm]">
                        <div>
                          <h3 className="font-display text-base font-bold leading-snug print:text-[8.6pt]">{job.title}</h3>
                          <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.12em] text-violet-ink print:mt-[0.3mm] print:text-[6.2pt]">
                            {job.company}
                          </p>
                        </div>
                        <time className="font-mono text-xs text-ink/60 print:text-[6.3pt]">{job.period}</time>
                      </div>
                      <BulletList items={job.bullets} />
                    </article>
                  ))}
                </div>
              </CVSection>

              <CVSection number="03" title="Wybrane projekty">
                <div className="divide-y divide-ink/10">
                  {CV_PROJECTS.map((project) => (
                    <article key={project.name} className="py-4 first:pt-0 last:pb-0 print:py-[1.6mm]">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <h3 className="font-display text-base font-bold print:text-[8.2pt]">{project.name}</h3>
                        <a
                          href={project.href}
                          className="font-mono text-xs text-violet-ink underline-offset-2 hover:underline print:text-[6.3pt]"
                        >
                          {project.meta}
                        </a>
                      </div>
                      <p className="mt-1.5 text-ink/80 print:mt-[0.6mm] print:text-[7.2pt] print:leading-[1.3]">{project.description}</p>
                    </article>
                  ))}
                </div>
              </CVSection>
            </div>

            <aside className="space-y-10 border-t border-ink/15 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 print:space-y-[4mm] print:border-l print:border-t-0 print:pl-[4.5mm] print:pt-0">
              <CVSection number="04" title="Umiejętności">
                <div className="space-y-4 print:space-y-[2mm]">
                  {SKILLS.map(([label, value]) => (
                    <div key={label}>
                      <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink/60 print:text-[6.3pt]">{label}</h3>
                      <p className="mt-1 leading-[1.5] print:mt-[0.4mm] print:text-[7.2pt] print:leading-[1.32]">{value}</p>
                    </div>
                  ))}
                </div>
              </CVSection>

              <CVSection number="05" title="Edukacja">
                <div className="space-y-5 print:space-y-[2.2mm]">
                  <EducationItem
                    school="Uniwersytet Śląski w Katowicach"
                    detail="Informatyka, studia inżynierskie"
                    date="10.2025–obecnie · planowane ukończenie: 2029"
                  />
                  <EducationItem
                    school="Zespół Szkół Elektronicznych i Informatycznych w Sosnowcu"
                    detail="Technik programista · INF.03 (2023), INF.04 (2024)"
                    date="2020–2025"
                  />
                </div>
              </CVSection>

              <CVSection number="06" title="Języki">
                <dl className="space-y-2 print:space-y-[1mm] print:text-[7.2pt]">
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold">Polski</dt>
                    <dd className="text-ink/70">ojczysty</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold">Angielski</dt>
                    <dd className="text-right text-ink/70">C1 · UŚ, 2026</dd>
                  </div>
                </dl>
              </CVSection>
            </aside>
          </div>

          <footer className="mt-10 border-t border-ink/15 pt-4 text-xs leading-relaxed text-ink/60 print:mt-auto print:pt-[1.6mm] print:text-[5.6pt] print:leading-[1.22]">
            {CONSENT}
          </footer>
        </article>

        <p className="mx-auto mt-5 max-w-[62rem] px-1 font-mono text-xs uppercase tracking-[0.16em] text-paper-mute print:hidden">
          A4 · jedna strona · ten sam układ na ekranie i w druku
        </p>
      </main>
    </div>
  );
}

function CVSection({
  number,
  title,
  children,
  className = "",
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-4 flex items-baseline gap-3 print:mb-[1.8mm] print:gap-[1.8mm]">
        <span className="font-mono text-xs text-violet-ink print:text-[6.3pt]">{number}</span>
        <h2 className="font-display text-xl font-extrabold tracking-[-0.03em] print:text-[10pt]">{title}</h2>
        <span className="h-px flex-1 self-center bg-ink/15" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2.5 space-y-1 text-ink/80 print:mt-[0.9mm] print:space-y-[0.3mm] print:text-[7.2pt] print:leading-[1.3]">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-[0.7em] h-px w-3 shrink-0 bg-violet-ink" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function EducationItem({ school, detail, date }: { school: string; detail: string; date: string }) {
  return (
    <div>
      <h3 className="font-display text-base font-bold leading-snug print:text-[7.8pt]">{school}</h3>
      <p className="mt-1 print:mt-[0.4mm] print:text-[7.2pt]">{detail}</p>
      <p className="mt-1 font-mono text-xs text-ink/60 print:mt-[0.4mm] print:text-[6.3pt]">{date}</p>
    </div>
  );
}

function ContactLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="transition hover:text-violet-ink">
      {children}
    </a>
  );
}
