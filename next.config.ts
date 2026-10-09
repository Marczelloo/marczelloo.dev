import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Screenshots of UI text show artefacts at the default quality, so they ask for 90.
  images: { qualities: [75, 90] },
  // The case board used to live at /case; it is the home page now.
  async redirects() {
    return [{ source: "/case", destination: "/", permanent: true }];
  },
};

export default nextConfig;
