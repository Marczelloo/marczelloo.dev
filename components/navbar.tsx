"use client";

import { PersonIcon } from "./ui/icons/akar-icons-person";
import { EnvelopeIcon } from "./ui/icons/akar-icons-envelope";
import { FolderIcon } from "./ui/icons/akar-icons-folder";
import { HomeAlt1Icon } from "./ui/icons/akar-icons-home-alt1";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import ScrollLink from "./ScrollLink";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<"Hero" | "AboutMe" | "Projects" | "Contact">("Hero");

  const visibilityRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const scrollRoot = document.getElementById("scroll-root");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));

    if (!scrollRoot || !sections.length) return;

    const visibility: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;

          visibility[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        // --- simple, predictable rules ---

        const heroRatio = visibility["Hero"] ?? 0;
        const contactRatio = visibility["Contact"] ?? 0;

        // 1) While Hero is clearly visible in the scroll-root, keep Hero active
        if (heroRatio > 0.75) {
          setActiveSection((prev) => (prev === "Hero" ? prev : "Hero"));
          return;
        }

        // 2) If Contact is visible at all, prefer Contact
        //    This makes the bottom of the page always highlight Contact
        if (contactRatio > 0.75) {
          setActiveSection((prev) => (prev === "Contact" ? prev : "Contact"));
          return;
        }

        // 3) Otherwise pick the section with the highest intersectionRatio
        let bestId: "Hero" | "AboutMe" | "Projects" | "Contact" = "Hero";
        let bestRatio = 0;

        (["Hero", "AboutMe", "Projects"] as const).forEach((id) => {
          const ratio = visibility[id] ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        setActiveSection((prev) => (prev === bestId ? prev : bestId));
      },
      {
        root: scrollRoot, // ← THIS is the key change
        threshold: [0.1, 0.25, 0.5, 0.75], // a few useful steps
        rootMargin: "0px 0px -10% 0px", // don't require full height
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      sections.forEach((s) => observer.unobserve(s));
      observer.disconnect();
    };
  }, []);

  const navItems: {
    icon: React.ComponentType<{ size: number }>;
    section: "Hero" | "AboutMe" | "Projects" | "Contact";
  }[] = [
    { icon: HomeAlt1Icon, section: "Hero" },
    { icon: PersonIcon, section: "AboutMe" },
    { icon: FolderIcon, section: "Projects" },
    { icon: EnvelopeIcon, section: "Contact" },
  ];

  return (
    <nav className="hidden md:flex h-full bg-background flex-col gap-10 border-r-2 border-border px-6 py-8">
      {navItems.map(({ icon: Icon, section }) => (
        <ScrollLink
          key={section}
          targetId={section}
          className={`transition-colors ${
            activeSection === section ? "text-(--accent-primary)" : "text-(--text-muted)"
          } hover:text-(--text-primary)`}
        >
          <Icon size={28} />
        </ScrollLink>
      ))}
      <ThemeToggle className="mt-auto" />
    </nav>
  );
}
