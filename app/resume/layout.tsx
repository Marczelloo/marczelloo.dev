// app/cv/layout.tsx  (or inside your CV page)
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#2b2a63_0,#03040b_70%,#02020a_100%)] text-(--text-primary)">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-baseline gap-3">
            <span className="text-sm text-(--accent-primary)/80 font-semibold tracking-wide uppercase">Resume</span>
            <span className="text-base text-(--text-secondary)">Marcel Moskwa</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-(--text-secondary) hover:text-(--accent-primary)">
              ← Back to portfolio
            </Link>
            <a href="/Marcel_Moskwa_CV.pdf" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="cursor-pointer">
                Download PDF
              </Button>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </main>
  );
}
