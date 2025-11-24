"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { HomeAlt1Icon } from "./ui/icons/akar-icons-home-alt1";
import { PersonIcon } from "./ui/icons/akar-icons-person";
import { FolderIcon } from "./ui/icons/akar-icons-folder";
import { EnvelopeIcon } from "./ui/icons/akar-icons-envelope";
import ScrollLink from "./ScrollLink";

const navItems: {
  icon: React.ComponentType<{ size: number }>;
  section: "Hero" | "AboutMe" | "Projects" | "Contact";
}[] = [
  { icon: HomeAlt1Icon, section: "Hero" },
  { icon: PersonIcon, section: "AboutMe" },
  { icon: FolderIcon, section: "Projects" },
  { icon: EnvelopeIcon, section: "Contact" },
];

export function MobileNavbar() {
  const [open, setOpen] = useState(false);

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
              {navItems.map(({ icon: Icon, section }) => (
                <ScrollLink
                  key={section}
                  targetId={section}
                  className={
                    "flex items-center gap-3 rounded-lg px-2 py-2.5 text-base font-medium text-(--text-secondary) hover:text-(--accent-primary) hover:bg-card/70 transition-colors"
                  }
                >
                  <span className="text-(--accent-primary) shrink-0">
                    <Icon size={20} />
                  </span>
                  <span>{section}</span>
                </ScrollLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
