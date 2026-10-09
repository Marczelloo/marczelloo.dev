import type { Metadata } from "next";

import Hero from "../_components/Hero";
import Work from "../_components/Work";
import Process from "../_components/Process";
import Journey from "../_components/Journey";
import Contact from "../_components/Contact";

export const metadata: Metadata = {
  title: "Classic portfolio",
  alternates: { canonical: "https://marczelloo.dev/classic" },
};

export default function ClassicPage() {
  return (
    <main className="grain" id="page-root">
      <Hero />
      <Work />
      <Process />
      <Journey />
      <Contact />
    </main>
  );
}
