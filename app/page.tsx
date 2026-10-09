import type { Metadata } from "next";
import { Caveat, Courier_Prime, Special_Elite } from "next/font/google";
import CaseClient from "./case/CaseClient";
import { versionMetadata } from "./_data/seo";

const typewriter = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-typewriter", display: "swap" });
const hand = Caveat({ weight: ["500", "700"], subsets: ["latin", "latin-ext"], variable: "--font-hand", display: "swap" });
const mono = Courier_Prime({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--font-mono-body", display: "swap" });

export const metadata: Metadata = versionMetadata("case", {
  title: "Case File: Marcel Moskwa | Marczelloo",
  description:
    "An interactive 3D detective board. The projects, CV and contact details of Marcel Moskwa, a full-stack developer working with AI agents, are pinned up as evidence you can pick up, flip and read.",
  path: "/",
});

/** The entry page is the interactive case board; its intro offers the classic portfolio at /classic. */
export default function Home() {
  return (
    <main className={`${typewriter.variable} ${hand.variable} ${mono.variable} case-root fixed inset-0 overflow-hidden bg-black`}>
      <CaseClient />
    </main>
  );
}
