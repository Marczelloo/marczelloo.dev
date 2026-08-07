"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowSquareOut, GithubLogo } from "@phosphor-icons/react";

const PROJECTS = [
  {
    id: "dashboard",
    title: "Marczelloo Dashboard",
    summary:
      "A control center for projects, services, deployments, GitHub activity, and Raspberry Pi infrastructure.",
    contribution:
      "Designed and built the responsive product interface, integrations, deployment flow, and monitoring views.",
    image: "/projects/marczelloo_dashboard.png",
    stack: ["Next.js", "GitHub API", "Docker"],
    github: "https://github.com/Marczelloo/Marczelloo-dashboard",
    demo: "https://demo-dashboard.marczelloo.dev/projects",
  },
  {
    id: "atlashub",
    title: "AtlasHub",
    summary:
      "A central workspace for organizing projects and resources through clear sections, categories, and navigation.",
    contribution:
      "Built a component-driven frontend and structured the application state around a focused workspace flow.",
    image: "/projects/atlashub.png",
    stack: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    github: "https://github.com/Marczelloo/atlashub",
    demo: "https://admin-atlashub.marczelloo.dev/landing",
  },
  {
    id: "bookhaven",
    title: "BookHaven",
    summary:
      "A deployed bookstore demo with browsing, search, user accounts, wishlists, and a shopping cart.",
    contribution:
      "Created the full-stack application and organized its Node.js, Express, and MongoDB architecture for extension.",
    image: "/projects/bookhaven.png",
    stack: ["Node.js", "Express", "MongoDB"],
    github: "https://github.com/Marczelloo/BookHaven",
    demo: "https://bookhaven.marczelloo.dev/",
  },
  {
    id: "neobeat",
    title: "NeoBeat Buddy",
    summary:
      "A Discord music bot with slash commands, queue management, equalizer presets, and Docker deployment.",
    contribution:
      "Developed the bot workflow, audio controls, deployment configuration, and maintainable command structure.",
    image: "/projects/neobeatbuddy.png",
    stack: ["Node.js", "Discord.js", "Docker"],
    github: "https://github.com/Marczelloo/NeoBeat-Buddy",
    demo: "https://discord.com/invite/szxrjutGBD",
  },
  {
    id: "casino",
    title: "Casino Simulator",
    summary:
      "A desktop game simulator built around object-oriented architecture, game state, and reusable mechanics.",
    contribution:
      "Implemented the game logic and modularized shared behavior across multiple casino-style experiences.",
    image: "/projects/casino_simulator.png",
    stack: ["C#", "OOP", "Game logic"],
    github: "https://github.com/Marczelloo/CasinoSimulator",
    demo: undefined,
  },
] as const;

export default function Craft() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeProject = PROJECTS[activeIndex];

  return (
    <section id="craft" className="section" aria-labelledby="craft-title">
      <div className="section-shell flex flex-col justify-center">
        <div className="mb-7">
          <h2 id="craft-title" className="font-display text-4xl font-semibold tracking-[-0.045em] text-text-base sm:text-5xl">
            Selected work
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-soft">
            Shipped interfaces, full-stack systems, integrations, and tools. Open a project to inspect the work behind it.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
          <nav
            className="project-scroll flex snap-x snap-mandatory gap-2 overflow-x-auto pb-3 lg:grid lg:content-start lg:gap-1 lg:overflow-visible lg:pb-0"
            aria-label="Project selection"
          >
            {PROJECTS.map((project, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`relative min-w-max snap-start rounded-[10px] px-4 py-3 text-left text-sm font-semibold transition active:translate-y-px lg:min-w-0 lg:py-4 ${
                    isActive
                      ? "bg-primary-400 text-[#15111f]"
                      : "border border-transparent text-text-mute hover:border-border-subtle hover:bg-surface-900 hover:text-text-base"
                  }`}
                >
                  {project.title}
                </button>
              );
            })}
          </nav>

          <div className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                id="project-panel"
                aria-live="polite"
                key={activeProject.id}
                className="surface overflow-hidden"
                initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(4% 4% 4% 4% round 18px)" }}
                animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 18px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.8fr)]">
                  <div className="relative min-h-[18rem] overflow-hidden bg-bg-800 sm:min-h-[25rem] lg:min-h-[31rem]">
                    <Image
                      src={activeProject.image}
                      alt={`${activeProject.title} interface screenshot`}
                      fill
                      priority={activeIndex < 2}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain p-4 sm:p-6"
                    />
                  </div>

                  <div className="flex flex-col justify-between border-t border-border-subtle p-6 lg:border-l lg:border-t-0 lg:p-8">
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.035em] text-text-base sm:text-3xl">
                        {activeProject.title}
                      </h3>
                      <p className="mt-5 text-sm leading-relaxed text-text-soft sm:text-base">
                        {activeProject.summary}
                      </p>

                      <div className="mt-6 border-t border-border-subtle pt-5">
                        <p className="text-xs font-semibold text-primary-300">My contribution</p>
                        <p className="mt-2 text-sm leading-relaxed text-text-soft">
                          {activeProject.contribution}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                        {activeProject.stack.map((technology) => (
                          <span key={technology} className="text-xs font-semibold text-text-mute">
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={activeProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-primary-400 px-4 py-2.5 text-sm font-semibold text-[#15111f] transition hover:bg-primary-300 active:translate-y-px"
                      >
                        <GithubLogo size={19} weight="fill" />
                        GitHub
                      </a>
                      {activeProject.demo && (
                        <a
                          href={activeProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-border-strong px-4 py-2.5 text-sm font-semibold text-text-base transition hover:border-primary-500 hover:bg-surface-800 active:translate-y-px"
                        >
                          Live demo
                          <ArrowSquareOut size={18} weight="bold" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
