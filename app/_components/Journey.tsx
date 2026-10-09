"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";

const TIMELINE = [
  {
    id: "university",
    period: "Oct 2025 - present",
    title: "Computer Science student",
    place: "University of Silesia, Katowice",
    type: "Education",
    summary:
      "Engineering degree focused on strengthening the computer science foundations behind my practical development experience.",
    details: [
      "Algorithmic thinking and computer science fundamentals",
      "Planned graduation in 2029",
      "C1 English proficiency exam completed in 2026",
    ],
    stack: ["Computer Science", "Algorithms", "C1 English"],
  },
  {
    id: "d9space",
    period: "Aug - Sep 2024",
    title: "Full-Stack Developer",
    place: "RecodeIT / D9 Space",
    type: "Paid project",
    summary:
      "Contributed to a client booking module built with PHP and WordPress in a small supervised team.",
    details: [
      "Worked on the booking interface and user flow",
      "Supported form logic and email-message integration",
      "Delivered assigned work through Git-based collaboration",
    ],
    stack: ["PHP", "WordPress", "Git"],
  },
  {
    id: "recodeit",
    period: "May 2024",
    title: "Full-Stack Intern",
    place: "RecodeIT",
    type: "Internship",
    summary:
      "Developed an internal employee panel while working across the interface, database, schema changes, and pull requests.",
    details: [
      "Built features with Next.js and TypeScript",
      "Worked with PostgreSQL data and schema changes",
      "Collaborated through pull requests and code review",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    id: "hurtopony",
    period: "May 2023",
    title: "Software Development Intern",
    place: "Hurtopony",
    type: "Internship",
    summary:
      "Built operational reports and calculators using real company data, then improved existing scripts and documentation.",
    details: [
      "Created reporting tools with PHP and MySQL",
      "Analyzed and corrected existing scripts",
      "Prepared practical user documentation",
    ],
    stack: ["PHP", "MySQL", "Reporting"],
  },
  {
    id: "technical-school",
    period: "2020 - 2025",
    title: "Programming Technician",
    place: "ZSEiI, Sosnowiec",
    type: "Education",
    summary:
      "Completed a five-year technical programming education and earned both Polish professional programming qualifications.",
    details: [
      "INF.03 web application certification in 2023",
      "INF.04 software application certification in 2024",
      "Foundation for later full-stack project work",
    ],
    stack: ["INF.03", "INF.04", "Programming"],
  },
] as const;

export default function Journey() {
  const [activeId, setActiveId] = useState<string | null>(TIMELINE[0].id);

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-8">
        <header className="mb-20 grid gap-6 lg:mb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-hot">04 / Journey</p>
            <h2 id="journey-title" className="mt-4 font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.045em]">
              From technical school
              <br />
              <span className="text-violet">to shipped software.</span>
            </h2>
          </div>
          <p className="leading-relaxed text-paper-mute">
            A path built through formal education, real company data, team delivery, and independent products.
          </p>
        </header>

        <ol className="border-t border-paper/15">
          {TIMELINE.map((item) => {
            const open = item.id === activeId;
            return (
              <li key={item.id} className="border-b border-paper/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`journey-${item.id}`}
                    onClick={() => setActiveId(open ? null : item.id)}
                    className="group relative grid w-full gap-x-8 gap-y-2 py-7 pr-14 text-left lg:pr-0 transition-colors hover:bg-paper/[0.03] focus-visible:outline-violet-hot lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] lg:items-baseline lg:py-9"
                  >
                    <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-paper-mute">
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full transition-colors ${open ? "bg-lime" : "bg-paper/25 group-hover:bg-paper/60"}`}
                      />
                      {item.period}
                    </span>
                    <span>
                      <span className="block font-display text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
                        {item.title}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-paper-mute">
                        {item.place}
                        <span className="rounded-full border border-paper/20 px-3 py-0.5 font-mono text-xs uppercase tracking-[0.12em] text-paper/80">
                          {item.type}
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-7 flex size-11 items-center justify-center rounded-full border border-paper/25 transition-colors group-hover:border-paper lg:static lg:self-center"
                    >
                      <Plus size={18} weight="bold" className={`transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-45" : ""}`} />
                    </span>
                  </button>
                </h3>

                <div
                  id={`journey-${item.id}`}
                  role="region"
                  aria-label={`${item.title}, details`}
                  inert={!open}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-x-8 lg:pb-12">
                      <div className="hidden lg:block" aria-hidden="true" />
                      <div className="grid gap-8 lg:grid-cols-2">
                        <p className="max-w-[34rem] text-lg leading-relaxed">{item.summary}</p>
                        <div>
                          <ul className="grid gap-3 text-paper-mute">
                            {item.details.map((detail) => (
                              <li key={detail} className="flex gap-3 leading-relaxed">
                                <span className="mt-[0.7em] h-px w-4 shrink-0 bg-violet" aria-hidden="true" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Keywords">
                            {item.stack.map((s) => (
                              <li key={s} className="rounded-full border border-paper/15 px-3 py-1 font-mono text-xs text-paper/80">
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
