"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap } from "@phosphor-icons/react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeItem = TIMELINE[activeIndex];

  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="section-shell grid content-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <motion.h2
            id="journey-title"
            className="font-display max-w-lg text-4xl font-semibold tracking-[-0.045em] text-text-base sm:text-5xl"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            From technical school to shipped software.
          </motion.h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-soft">
            A path built through formal education, real company data, team delivery, and independent products.
          </p>

          <div className="mt-9 grid gap-1" aria-label="Experience timeline">
            {TIMELINE.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`group grid min-h-14 grid-cols-[7.5rem_1fr] items-center gap-4 rounded-[10px] px-3 text-left transition active:translate-y-px sm:grid-cols-[9rem_1fr] ${
                    isActive
                      ? "bg-surface-800 text-text-base"
                      : "text-text-mute hover:bg-surface-900 hover:text-text-soft"
                  }`}
                >
                  <span className={`text-xs font-semibold ${isActive ? "text-primary-300" : "text-text-mute"}`}>
                    {item.period}
                  </span>
                  <span className="truncate text-sm font-semibold sm:text-base">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative self-center lg:col-span-7">
          <div className="absolute inset-x-5 -bottom-4 top-4 rounded-[18px] border border-border-subtle bg-surface-900/40" />
          <div className="absolute inset-x-2.5 -bottom-2 top-2 rounded-[18px] border border-border-subtle bg-surface-900/70" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              id="journey-panel"
              aria-live="polite"
              key={activeItem.id}
              className="surface relative min-h-[29rem] p-6 sm:p-8 lg:p-10"
              initial={reduceMotion ? false : { opacity: 0, y: 22, rotate: 0.6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, rotate: -0.5 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-primary-300">
                    {activeItem.type === "Education" ? (
                      <GraduationCap size={19} weight="duotone" />
                    ) : (
                      <Briefcase size={19} weight="duotone" />
                    )}
                    {activeItem.type}
                  </p>
                  <h3 className="font-display mt-5 text-3xl font-semibold tracking-[-0.035em] text-text-base sm:text-4xl">
                    {activeItem.title}
                  </h3>
                  <p className="mt-2 text-base font-medium text-text-soft">{activeItem.place}</p>
                </div>
                <span className="shrink-0 text-right text-xs font-semibold text-text-mute sm:text-sm">
                  {activeItem.period}
                </span>
              </div>

              <p className="mt-7 max-w-2xl text-base leading-relaxed text-text-soft">{activeItem.summary}</p>

              <ul className="mt-7 grid gap-3 border-t border-border-subtle pt-6">
                {activeItem.details.map((detail) => (
                  <li key={detail} className="grid grid-cols-[1.25rem_1fr] gap-2 text-sm leading-relaxed text-text-soft">
                    <span aria-hidden="true" className="font-semibold text-primary-400">+</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {activeItem.stack.map((item) => (
                  <span key={item} className="text-xs font-semibold text-text-mute">
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
