"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "@phosphor-icons/react";

const PERSONAL = {
  name: "Marcel Moskwa",
  role: "Student informatyki | Junior Web / Software Developer",
  phone: "730 226 226",
  email: "moskwamarcel@gmail.com",
  location: "Sosnowiec, Polska",
  github: "github.com/Marczelloo",
  linkedin: "linkedin.com/in/marczelloo",
  website: "marczelloo.dev",
};

const PROFILE =
  "Student informatyki z wykształceniem technicznym oraz pierwszym doświadczeniem zdobytym podczas dwóch praktyk i płatnego projektu dla klienta. Tworzę aplikacje webowe, pracuję z bazami danych i rozwijam projekty full-stack w JavaScript, TypeScript, PHP i SQL. Interesuję się także Javą, automatyzacją procesów oraz praktycznym wykorzystaniem agentów AI do planowania, implementacji i rozwiązywania problemów.";

const SKILLS = [
  ["Frontend", "HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS"],
  ["Backend i bazy danych", "PHP, Node.js (podstawy), SQL, MySQL, PostgreSQL, MongoDB, Oracle SQL"],
  ["Pozostałe", "Java (podstawy), Git, REST API, WordPress, Docker (podstawy), IntelliJ IDEA, VS Code"],
  ["AI i produktywność", "ChatGPT, Gemini, Perplexity, OpenCode, Codex; planowanie, delegowanie zadań agentom i weryfikacja wyników"],
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

const PROJECTS = [
  {
    name: "Marczelloo Dashboard",
    meta: "demo-dashboard.marczelloo.dev/projects | 2026",
    href: "https://demo-dashboard.marczelloo.dev/projects",
    description:
      "Panel do zarządzania projektami, statusami i usługami, z integracją GitHub, automatycznymi wdrożeniami oraz monitoringiem Raspberry Pi i kontenerów Docker.",
  },
  {
    name: "NAD STRONĄ",
    meta: "nadstrona.pl | 2026",
    href: "https://nadstrona.pl",
    description:
      "Własne studio stron internetowych dla lokalnych firm. Określiłem ofertę, strukturę, kierunek UX i proces realizacji, a stronę oraz dema stworzyłem i wdrożyłem z szerokim wykorzystaniem agentów AI, odpowiadając za wymagania i weryfikację jakości.",
  },
  {
    name: "BookHaven",
    meta: "bookhaven.marczelloo.dev | Node.js, Express, MongoDB",
    href: "https://bookhaven.marczelloo.dev",
    description:
      "Wdrożone demo aplikacji e-commerce z katalogiem książek, wyszukiwaniem, kontami użytkowników, listą życzeń i koszykiem.",
  },
  {
    name: "NeoBeat Buddy",
    meta: "github.com/Marczelloo/NeoBeat-Buddy | Node.js, Discord.js, Docker",
    href: "https://github.com/Marczelloo/NeoBeat-Buddy",
    description:
      "Bot muzyczny na Discorda z komendami slash, kolejką odtwarzania, presetami equalizera i konfiguracją wdrożenia w Dockerze.",
  },
] as const;

const CONSENT =
  "Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w CV na potrzeby obecnego oraz przyszłych procesów rekrutacyjnych zgodnie z obowiązującymi przepisami o ochronie danych osobowych.";

export default function CVPage() {
  return (
    <div className="min-h-[100dvh] bg-bg-900 text-text-base print:bg-white print:text-[#181818]">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border-subtle bg-bg-900/92 px-4 py-3 backdrop-blur-md print:hidden sm:px-8">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-sm font-semibold text-text-soft transition hover:text-primary-300"
        >
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          Wróć do portfolio
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex min-h-11 items-center gap-2 rounded-[10px] bg-primary-400 px-4 py-2 text-sm font-semibold text-[#15111f] transition hover:bg-primary-300 active:translate-y-px"
        >
          <Printer size={18} weight="bold" aria-hidden="true" />
          Drukuj / Zapisz PDF
        </button>
      </div>

      <main className="px-3 py-6 print:p-0 sm:px-6 sm:py-10 lg:py-14">
        <article
          lang="pl"
          className="cv-sheet mx-auto w-full max-w-[1040px] overflow-hidden border border-border-subtle bg-surface-900 px-5 py-7 text-sm leading-[1.48] text-text-soft shadow-[0_30px_90px_-42px_rgba(0,0,0,0.7)] print:h-[297mm] print:w-[210mm] print:max-w-none print:border-0 print:bg-white print:px-[10mm] print:py-[8.5mm] print:text-[7.5pt] print:leading-[1.28] print:text-[#272727] print:shadow-none sm:px-9 sm:py-10 lg:px-12 lg:py-12"
        >
          <header className="border-b border-border-strong pb-7 print:border-[#aeb4bc] print:pb-[3.5mm]">
            <div className="mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-text-mute print:mb-[2mm] print:text-[6.4pt] print:text-[#60666d]">
              <span>Curriculum vitae</span>
              <span>2026 / Polska</span>
            </div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end print:grid-cols-[minmax(0,1fr)_auto] print:items-end print:gap-[4mm]">
              <div>
                <h1 className="font-display text-[clamp(2.7rem,7vw,4.8rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-text-base print:text-[24pt] print:leading-none print:text-black">
                  {PERSONAL.name}
                </h1>
                <p className="mt-3 text-base font-semibold text-primary-300 print:mt-[1.6mm] print:text-[10pt] print:text-[#5b438f]">
                  {PERSONAL.role}
                </p>
              </div>
              <p className="max-w-[24rem] text-sm leading-relaxed text-text-mute md:text-right print:max-w-[58mm] print:text-[7.2pt] print:leading-[1.3] print:text-[#50545a] print:text-right">
                Full-stack development, aplikacje webowe i praktyczne wdrożenia.
              </p>
            </div>
            <div className="mt-7 grid gap-x-5 gap-y-2 border-t border-border-subtle pt-5 text-xs text-text-soft sm:grid-cols-2 lg:grid-cols-3 print:mt-[3mm] print:grid-cols-3 print:gap-x-[3mm] print:gap-y-[0.8mm] print:border-[#d7d9dd] print:pt-[2.4mm] print:text-[6.8pt] print:text-[#303030]">
              <span>{PERSONAL.phone} · {PERSONAL.location}</span>
              <ContactLink href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}</ContactLink>
              <ContactLink href={`https://${PERSONAL.website}`}>{PERSONAL.website}</ContactLink>
              <ContactLink href={`https://${PERSONAL.github}`}>{PERSONAL.github}</ContactLink>
              <ContactLink href={`https://${PERSONAL.linkedin}`}>{PERSONAL.linkedin}</ContactLink>
            </div>
          </header>

          <CVSection number="01" title="Profil" className="mt-8 print:mt-[4mm]">
            <p className="max-w-[58rem] text-base leading-[1.7] text-text-soft print:text-[7.7pt] print:leading-[1.36] print:text-[#2b2b2b]">
              {PROFILE}
            </p>
          </CVSection>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1.62fr)_minmax(15rem,0.88fr)] print:mt-[4.2mm] print:grid-cols-[minmax(0,1.62fr)_minmax(0,0.88fr)] print:gap-[6mm]">
            <div className="space-y-10 print:space-y-[4mm]">
              <CVSection number="02" title="Doświadczenie">
                <div className="divide-y divide-border-subtle print:divide-[#d7d9dd]">
                  {EXPERIENCE.map((job) => (
                    <article key={`${job.company}-${job.period}`} className="py-5 first:pt-0 last:pb-0 print:py-[2.2mm]">
                      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline print:grid-cols-[minmax(0,1fr)_auto] print:items-baseline print:gap-[2mm]">
                        <div>
                          <h3 className="font-display text-base font-semibold leading-snug text-text-base print:text-[8.4pt] print:text-black">
                            {job.title}
                          </h3>
                          <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.08em] text-primary-300 print:mt-[0.3mm] print:text-[6.5pt] print:text-[#5b438f]">
                            {job.company}
                          </p>
                        </div>
                        <time className="text-xs font-semibold text-text-mute print:text-[6.5pt] print:text-[#555]">{job.period}</time>
                      </div>
                      <BulletList items={job.bullets} />
                    </article>
                  ))}
                </div>
              </CVSection>

              <CVSection number="03" title="Wybrane projekty">
                <div className="divide-y divide-border-subtle print:divide-[#d7d9dd]">
                  {PROJECTS.map((project) => (
                    <article key={project.name} className="py-4 first:pt-0 last:pb-0 print:py-[1.8mm]">
                      <h3 className="font-display text-sm font-semibold text-text-base print:text-[8pt] print:text-black">
                        {project.name}
                      </h3>
                      <a
                        href={project.href}
                        className="mt-0.5 block text-xs font-semibold text-primary-300 print:text-[6.1pt] print:text-[#5b438f]"
                      >
                        {project.meta}
                      </a>
                      <p className="mt-2 text-xs leading-[1.55] text-text-soft print:mt-[0.7mm] print:text-[6.7pt] print:leading-[1.3] print:text-[#333]">
                        {project.description}
                      </p>
                    </article>
                  ))}
                </div>
              </CVSection>
            </div>

            <aside className="space-y-10 border-t border-border-strong pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 print:space-y-[4mm] print:border-l print:border-t-0 print:border-[#aeb4bc] print:pl-[4.5mm] print:pt-0">
              <CVSection number="04" title="Umiejętności">
                <div className="space-y-5 print:space-y-[2.2mm]">
                  {SKILLS.map(([label, value]) => (
                    <div key={label}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-text-base print:text-[6.6pt] print:text-black">
                        {label}
                      </h3>
                      <p className="mt-1 text-xs leading-[1.55] text-text-mute print:mt-[0.45mm] print:text-[6.7pt] print:leading-[1.32] print:text-[#3d3d3d]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </CVSection>

              <CVSection number="05" title="Edukacja">
                <div className="space-y-5 print:space-y-[2.3mm]">
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
                <dl className="space-y-3 text-xs print:space-y-[1mm] print:text-[6.8pt]">
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-text-base print:text-black">Polski</dt>
                    <dd className="text-text-mute print:text-[#444]">ojczysty</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-text-base print:text-black">Angielski</dt>
                    <dd className="text-right text-text-mute print:text-[#444]">C1 · UŚ, 2026</dd>
                  </div>
                </dl>
              </CVSection>
            </aside>
          </div>

          <footer className="mt-9 border-t border-border-subtle pt-5 text-xs leading-relaxed text-text-mute print:mt-[3.5mm] print:border-[#d7d9dd] print:pt-[1.8mm] print:text-[5.6pt] print:leading-[1.22] print:text-[#575757]">
            {CONSENT}
          </footer>
        </article>
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
      <div className="mb-5 flex items-center gap-3 print:mb-[2mm] print:gap-[1.8mm]">
        <span className="text-xs font-bold tracking-[0.12em] text-primary-300 print:text-[6pt] print:text-[#5b438f]">{number}</span>
        <h2 className="font-display text-xl font-semibold tracking-[-0.035em] text-text-base print:text-[9.4pt] print:text-black">
          {title}
        </h2>
        <span className="h-px flex-1 bg-border-subtle print:bg-[#d7d9dd]" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-[1.55] text-text-soft marker:text-primary-300 print:mt-[1mm] print:space-y-[0.35mm] print:pl-[3mm] print:text-[6.7pt] print:leading-[1.3] print:text-[#333] print:marker:text-[#5b438f]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function EducationItem({ school, detail, date }: { school: string; detail: string; date: string }) {
  return (
    <div>
      <h3 className="font-display text-[0.9rem] font-semibold leading-snug text-text-base print:text-[7.5pt] print:text-black">{school}</h3>
      <p className="mt-1 text-xs leading-[1.5] text-text-soft print:mt-[0.5mm] print:text-[6.6pt] print:leading-[1.3] print:text-[#333]">{detail}</p>
      <p className="mt-1 text-xs font-semibold text-text-mute print:mt-[0.4mm] print:text-[6.1pt] print:text-[#555]">{date}</p>
    </div>
  );
}

function ContactLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="transition hover:text-primary-300 print:text-[#303030]">
      {children}
    </a>
  );
}
