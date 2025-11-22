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
    const sections = document.querySelectorAll<HTMLElement>("section[id]");

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;

          visibilityRef.current[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        const visibleEntries = Object.entries(visibilityRef.current).filter(([, ratio]) => ratio > 0.15);

        if (!visibleEntries.length) {
          if (window.scrollY < 200) {
            setActiveSection("Hero");
          }
          return;
        }

        const [mostVisibleId] = visibleEntries.reduce(
          (max, current) => (current[1] > max[1] ? current : max),
          visibleEntries[0]
        );

        if (mostVisibleId) {
          setActiveSection(mostVisibleId as "Hero" | "AboutMe" | "Projects" | "Contact");
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-80px 0px -40% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
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
