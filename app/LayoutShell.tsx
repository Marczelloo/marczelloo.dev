"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import BlurBackground from "@/components/blurBackground";
import Footer from "@/components/Footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (!isHome) {
    // 404 page and non-home layouts
    return <main className="min-h-screen bg-card text-(--text-primary)">{children}</main>;
  }

  // Normal home layout with sidebar + blur + footer
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <Navbar />
      <main className="overflow-y-auto relative min-h-screen scroll-smooth">
        {/* This wrapper grows with content */}
        <div className="relative min-h-full pt-12">
          <BlurBackground />
          {children}
          <Footer />
        </div>
      </main>
    </div>
  );
}
