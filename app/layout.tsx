import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { LayoutShell } from "./LayoutShell";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marczelloo.dev"),
  title: {
    default: "Marczelloo — Full-Stack Developer",
    template: "%s | Marczelloo",
  },
  description:
    "Portfolio of Marczelloo — full-stack developer specializing in Next.js, React, Node.js and TypeScript. Explore projects, tech stack, and ways to get in touch.",
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
    "JavaScript",
  ],
  applicationName: "marczelloo.dev",
  authors: [{ name: "Marczelloo", url: "https://marczelloo.dev" }],
  creator: "Marczelloo",
  publisher: "Marczelloo",
  category: "technology",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "https://marczelloo.dev",
  },
  openGraph: {
    type: "website",
    url: "https://marczelloo.dev",
    title: "Marczelloo — Full-Stack Developer",
    siteName: "marczelloo.dev",
    description: "Portfolio of Marczelloo — full-stack developer specializing in Next.js, React, and Node.js.",
    images: [
      {
        url: "/og-image_.jpg",
        width: 1200,
        height: 630,
        alt: "Marczelloo.dev — Portfolio",
      },
    ],
    locale: "en_US",
    alternateLocale: ["pl_PL"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marczelloo — Full-Stack Developer",
    description: "Portfolio of Marczelloo — full-stack developer specializing in Next.js, React, and Node.js.",
    images: ["/og-image_.jpg"],
    site: "@marczelloo_", // optional
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8ff" },
    { media: "(prefers-color-scheme: dark)", color: "#03040b" },
  ],
};

// TODOLIST:
// - add live demo links to projects where applicable
// - implement language switcher (PL/EN)
// - test open graph and structured data when deployed on domain
// - when domain is ready verify in resend and add to dns (additionaly discord webhook that sends messages to my discord)
// - improve cv file

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Marczelloo",
              url: "https://marczelloo.dev",
              sameAs: [
                "https://github.com/Marczelloo",
                "https://linkedin.com/in/Marczelloo",
                "https://twitter.com/Marczelloo_",
              ],
              jobTitle: "Full-Stack Developer",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutShell>{children}</LayoutShell>
          <Toaster position="top-center" expand toastOptions={{ duration: 3500 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
