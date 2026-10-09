import type { MetadataRoute } from "next";

const SITE = "https://marczelloo.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/classic`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/cv`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
