import { Caveat, Courier_Prime, Special_Elite } from "next/font/google";
import CaseClient from "./case/CaseClient";

const typewriter = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-typewriter", display: "swap" });
const hand = Caveat({ weight: ["500", "700"], subsets: ["latin", "latin-ext"], variable: "--font-hand", display: "swap" });
const mono = Courier_Prime({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--font-mono-body", display: "swap" });

/** The entry page is the interactive case board; its intro offers the classic portfolio at /classic. */
export default function Home() {
  return (
    <main className={`${typewriter.variable} ${hand.variable} ${mono.variable} case-root fixed inset-0 overflow-hidden bg-black`}>
      <CaseClient />
    </main>
  );
}
