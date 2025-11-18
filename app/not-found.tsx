import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full mx-auto rounded-2xl border border-border bg-(--bg-card)/95 p-8 md:p-10 shadow-xl shadow-black/40 text-center space-y-6">
        <div className="inline-flex items-center justify-center rounded-full bg-(--accent-primary)/10 border border-(--accent-primary)/40 px-4 py-1 text-xs font-medium tracking-wide text-(--accent-primary) mb-2">
          404 · Page Not Found
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold">Looks like you took a wrong turn.</h1>

        <p className="text-(--text-secondary)] text-sm md:text-base leading-relaxed">
          The page you’re looking for doesn’t exist or has been moved. You can go back home or jump straight to my
          projects.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/">
            <Button
              size="lg"
              className="cursor-pointer bg-(--accent-primary) hover:bg-(--accent-hover) color-(--text-primary) shadow-lg shadow-(--accent-primary)/35"
            >
              Back to Home
            </Button>
          </Link>

          <Link href="/#Projects">
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer border border-(--accent-primary)/80 text-(--accent-primary) bg-transparent hover:bg-(--accent-primary)/10 hover:color-(--text-primary)"
            >
              See My Projects
            </Button>
          </Link>
        </div>

        <p className="text-xs text-(--text-muted) pt-2">
          If you think this is a mistake, feel free to contact me via email or Discord.
        </p>
      </div>
    </main>
  );
}
