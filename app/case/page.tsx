import type { Metadata } from "next";
import { Caveat, Courier_Prime, Special_Elite } from "next/font/google";
import CaseClient from "./CaseClient";

const typewriter = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-typewriter", display: "swap" });
const hand = Caveat({ weight: ["500", "700"], subsets: ["latin", "latin-ext"], variable: "--font-hand", display: "swap" });
const mono = Courier_Prime({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--font-mono-body", display: "swap" });

export const metadata: Metadata = {
  title: "The Case File",
  description: "An interactive case board: the work, history and contact details of Marcel Moskwa, full-stack developer.",
  alternates: { canonical: "https://marczelloo.dev/case" },
};

export default function CasePage() {
  return (
    <main className={`${typewriter.variable} ${hand.variable} ${mono.variable} case-root fixed inset-0 overflow-hidden bg-black`}>
      <CaseClient />
    </main>
  );
}
