import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar";
import PrivacyBanner from "./_components/PrivacyBanner";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://marczelloo.dev"),
  title: {
    default: "Marczelloo - Full-Stack Developer",
    template: "%s | Marczelloo",
  },
  description:
    "Portfolio of Marcel Moskwa, a full-stack developer who builds with AI agents and builds tools for them: Agent Pets, MewBit, a self-hosted homelab and more.",
  keywords: [
    "Marczelloo",
    "Marcel Moskwa",
    "Portfolio",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "Web Developer",
  ],
  applicationName: "marczelloo.dev",
  authors: [{ name: "Marcel Moskwa", url: "https://marczelloo.dev" }],
  creator: "Marcel Moskwa",
  alternates: { canonical: "https://marczelloo.dev" },
  openGraph: {
    type: "website",
    url: "https://marczelloo.dev",
    title: "Marczelloo - Full-Stack Developer",
    siteName: "marczelloo.dev",
    description:
      "Selected work of Marcel Moskwa, a full-stack developer working with AI agents.",
    images: [
      {
        url: "/og-image_.jpg",
        width: 1200,
        height: 630,
        alt: "Marczelloo portfolio",
      },
    ],
    locale: "en_US",
    alternateLocale: ["pl_PL"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marczelloo - Full-Stack Developer",
    description: "Selected work and experience of Marcel Moskwa.",
    images: ["/og-image_.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
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
              url: "https://marczelloo.dev",
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
      </body>
    </html>
  );
}
