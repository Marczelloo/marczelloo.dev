import type { Metadata } from "next";
import { versionMetadata } from "../_data/seo";

// The CV page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  ...versionMetadata("classic", {
    description: "CV of Marcel Moskwa, a full-stack developer working with AI agents. Printable, in Polish.",
    path: "/cv",
  }),
  title: "CV",
};

export default function CvLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
