"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const TABS = [
  { id: "hero", label: "Home" },
  { id: "journey", label: "Journey" },
  { id: "craft", label: "Craft" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState("hero");
  const reduceMotion = useReducedMotion();
  const isPortfolio = pathname === "/";
  const scrollTargetRef = useRef<string | null>(null);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPortfolio) return;
    const scrollRoot = document.getElementById("page-root");
    const sections = TABS.map((tab) => document.getElementById(tab.id)).filter(Boolean) as HTMLElement[];
    if (!scrollRoot || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;

        const scrollTarget = scrollTargetRef.current;
        if (scrollTarget && visible.target.id !== scrollTarget) return;

        if (scrollTarget === visible.target.id) {
          scrollTargetRef.current = null;
          if (unlockTimerRef.current !== null) {
            window.clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = null;
          }
        }

        setActive(visible.target.id);
      },
      { root: scrollRoot, rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current);
    };
  }, [isPortfolio]);

  if (!isPortfolio) return null;

  const scrollToSection = (id: string) => {
    const scrollRoot = document.getElementById("page-root");
    const section = document.getElementById(id);
    if (!scrollRoot || !section) return;

    if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current);
    scrollTargetRef.current = id;
    setActive(id);

    scrollRoot.scrollTo({
      top: section.offsetTop,
      behavior: reduceMotion ? "auto" : "smooth",
    });

    unlockTimerRef.current = window.setTimeout(() => {
      scrollTargetRef.current = null;
      unlockTimerRef.current = null;
    }, reduceMotion ? 0 : 1400);
  };

  return (
    <motion.nav
      aria-label="Portfolio sections"
      className="portfolio-nav fixed left-1/2 z-40 flex min-h-[3.625rem] -translate-x-1/2 items-center gap-0.5 rounded-[14px] border border-border-strong bg-bg-900/90 p-1.5 backdrop-blur-xl print:hidden sm:gap-1"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => scrollToSection(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className="relative min-h-11 whitespace-nowrap rounded-[9px] px-2.5 text-xs font-semibold text-text-mute transition hover:text-text-base active:translate-y-px sm:px-4 sm:text-sm"
          >
            {isActive && (
              <motion.span
                layoutId="active-section"
                className="absolute inset-0 rounded-[9px] bg-primary-400"
                transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className={`relative ${isActive ? "text-[#15111f]" : ""}`}>{tab.label}</span>
          </button>
        );
      })}
    </motion.nav>
  );
}
