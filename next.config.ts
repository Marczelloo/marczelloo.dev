import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Screenshots of UI text show artefacts at the default quality, so they ask for 90.
  images: { qualities: [75, 90] },
};

export default nextConfig;
