import type { Metadata } from "next";
import { versionMetadata } from "../_data/seo";

import Hero from "../_components/Hero";
import Work from "../_components/Work";
import Process from "../_components/Process";
import Journey from "../_components/Journey";
import Contact from "../_components/Contact";

export const metadata: Metadata = versionMetadata("classic", {
  title: "Marcel Moskwa - Full-Stack Developer | Marczelloo",
  description:
    "Portfolio of Marcel Moskwa, a full-stack developer working with AI agents: Agent Pets, MewBit, a self-hosted homelab dashboard, the process behind them and the experience so far.",
  path: "/classic",
});

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
