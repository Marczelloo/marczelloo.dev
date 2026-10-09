import type { Metadata } from "next";

export const SITE = "https://marczelloo.dev";

/** The two versions of the portfolio. Each has its own share image, icons and web manifest. */
export type Version = "case" | "classic";

const SHARE_ALT: Record<Version, string> = {
  case: "A manila case tag pinned to a detective board: Marcel Moskwa, full-stack developer working with AI agents",
  classic: "Marczelloo: Marcel Moskwa's avatar next to the line 'Full-stack developer working with AI agents'",
};

/**
 * Metadata for a page of one version: title, description, Open Graph and Twitter cards,
 * favicons and manifest. `path` sets the canonical URL; leave it out for shared defaults.
 */
export function versionMetadata(
  version: Version,
  { title, description, path }: { title?: string; description: string; path?: string },
): Metadata {
  const url = path === undefined ? undefined : `${SITE}${path === "/" ? "" : path}`;
  const image = { url: `/og/${version}.jpg`, width: 1200, height: 630, alt: SHARE_ALT[version] };
  return {
    ...(title ? { title: { absolute: title } } : {}),
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: "website",
      siteName: "marczelloo.dev",
      locale: "en_US",
      ...(url ? { url } : {}),
      ...(title ? { title } : {}),
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      description,
      images: [image.url],
    },
    icons: {
      icon: [
        { url: `/icons/${version}/favicon.ico`, sizes: "16x16 32x32 48x48" },
        // Only the case icon is drawn as a vector; the classic one is the avatar.
        ...(version === "case" ? [{ url: "/icons/case/icon.svg", type: "image/svg+xml" }] : []),
        { url: `/icons/${version}/icon-192.png`, sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: `/icons/${version}/apple-touch-icon.png`, sizes: "180x180" }],
    },
    manifest: `/${version}.webmanifest`,
  };
}
