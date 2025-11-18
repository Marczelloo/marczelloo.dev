"use client";

import Link from "next/link";
import { PersonIcon } from "./ui/icons/akar-icons-person";
import { EnvelopeIcon } from "./ui/icons/akar-icons-envelope";
import { FolderIcon } from "./ui/icons/akar-icons-folder";
import { HomeAlt1Icon } from "./ui/icons/akar-icons-home-alt1";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<"Hero" | "AboutMe" | "Projects" | "Contact">("Hero");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as "Hero" | "AboutMe" | "Projects" | "Contact");
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-100px 0px -50% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const navItems = [
    { href: "#Hero", icon: HomeAlt1Icon, section: "Hero" },
    { href: "#AboutMe", icon: PersonIcon, section: "AboutMe" },
    { href: "#Projects", icon: FolderIcon, section: "Projects" },
    { href: "#Contact", icon: EnvelopeIcon, section: "Contact" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", location.pathname);
  };

  return (
    <nav className="h-full bg-background flex flex-col gap-10 border-r-2 border-border px-6 py-8">
      {navItems.map(({ href, icon: Icon, section }) => (
        <Link
          key={section}
          href={href}
          className={`transition-colors ${
            activeSection === section ? "text-(--accent-primary)" : "text-(--text-muted)"
          } hover:text-(--text-primary)`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.button === 1) return;
            e.preventDefault();
            scrollTo(section);
          }}
        >
          <Icon size={28} />
        </Link>
      ))}
    </nav>
  );
}
