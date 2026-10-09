"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TABS = [
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const reduceMotion = useReducedMotion();
  const isPortfolio = pathname === "/";

  useEffect(() => {
    if (!isPortfolio) return;
    const hero = document.getElementById("hero");
    const sections = TABS.map((tab) => document.getElementById(tab.id)).filter(Boolean) as HTMLElement[];

    // The hero already shows the name and the calls to action, so the nav waits until it scrolls away.
    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: "0px 0px -35% 0px",
    });
    if (hero) heroObserver.observe(hero);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      heroObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [isPortfolio]);

  if (!isPortfolio) return null;

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.nav
          aria-label="Portfolio sections"
          className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-paper/15 bg-ink/85 p-1 font-mono text-xs uppercase tracking-[0.12em] backdrop-blur-xl print:hidden sm:bottom-6"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`relative flex min-h-11 items-center whitespace-nowrap rounded-full px-3 transition sm:px-4 ${
                  isActive ? "text-ink" : "text-paper-mute hover:text-paper"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-section"
                    className="absolute inset-0 rounded-full bg-lime"
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </a>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
