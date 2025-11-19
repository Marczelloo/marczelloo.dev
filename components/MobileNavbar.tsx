"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { HomeAlt1Icon } from "./ui/icons/akar-icons-home-alt1";
import { PersonIcon } from "./ui/icons/akar-icons-person";
import { FolderIcon } from "./ui/icons/akar-icons-folder";
import { EnvelopeIcon } from "./ui/icons/akar-icons-envelope";

const navItems = [
  { href: "/#Hero", label: "Home", icon: HomeAlt1Icon },
  { href: "/#AboutMe", label: "About", icon: PersonIcon },
  { href: "/#Projects", label: "Projects", icon: FolderIcon },
  { href: "/#Contact", label: "Contact", icon: EnvelopeIcon },
];

export function MobileNavbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", location.pathname);
  };

  return (
    <header className="md:hidden sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold tracking-tight">Marczelloo</span>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg border border-border bg-card/80" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="bg-background border-border px-4 pt-6 w-[55vw] max-w-[260px]
"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">Main navigation</SheetTitle>
            </SheetHeader>

            <nav className="mt-4 flex flex-col gap-1 pl-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-base font-medium text-(--text-secondary) hover:text-(--accent-primary) hover:bg-card/70 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    scrollTo(href.replace("/#", ""));
                  }}
                >
                  <Icon size={20} className="text-(--accent-primary) shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
