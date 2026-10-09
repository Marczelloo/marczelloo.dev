import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar";
import PrivacyBanner from "./_components/PrivacyBanner";
import { OriginTracker } from "./_components/BackLink";
import { SITE, versionMetadata } from "./_data/seo";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sora",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  axes: ["wdth", "opsz"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

/**
 * Shared defaults. The case board (/) and the classic portfolio (/classic) set their own
 * title, share image, icons and manifest; the CV and privacy pages follow the classic look.
 */
export const metadata: Metadata = {
  ...versionMetadata("classic", {
    description:
      "Portfolio of Marcel Moskwa, a full-stack developer who builds with AI agents and builds tools for them: Agent Pets, MewBit, a self-hosted homelab and more.",
  }),
  metadataBase: new URL(SITE),
  title: {
    default: "Marczelloo - Full-Stack Developer",
    template: "%s | Marczelloo",
  },
  keywords: [
    "Marczelloo",
    "Marcel Moskwa",
    "Portfolio",
    "Full-Stack Developer",
    "AI agents",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "Web Developer",
  ],
  applicationName: "marczelloo.dev",
  authors: [{ name: "Marcel Moskwa", url: SITE }],
  creator: "Marcel Moskwa",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090912",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Marcel Moskwa",
              alternateName: "Marczelloo",
              url: SITE,
              sameAs: [
                "https://github.com/Marczelloo",
                "https://linkedin.com/in/marczelloo",
              ],
              jobTitle: "Full-Stack Developer",
            }),
          }}
        />
      </head>
      <body className={`${manrope.variable} ${sora.variable} ${bricolage.variable} ${mono.variable}`}>
        {children}
        <Navbar />
        <PrivacyBanner />
        <OriginTracker />
      </body>
    </html>
  );
}
