import Image from "next/image";
import { Button } from "./ui/button";
import { DownloadIcon } from "./ui/icons/akar-icons-download";
import Link from "next/link";
import { GithubFillIcon } from "./ui/icons/akar-icons-github-fill";
import { LinkedinFillIcon } from "./ui/icons/akar-icons-linkedin-fill";
import ScrollLink from "./ScrollLink";

export default function Hero() {
  return (
    <section id="Hero" className="flex flex-col gap-6 pt-12">
      <article className="flex flex-col items-center sm:flex-row sm:items-center gap-6 text-center sm:text-left">
        <Image
          src="/avatar_nobg.png"
          alt="Marczelloo Avatar"
          width={150}
          height={150}
          className="rounded-full border-border border-2 bg-accent"
        />

        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl">Marczelloo</h1>
          <p className="text-sm sm:text-base text-(--text-secondary)">Full-Stack Developer | Next.js &amp; Node.js</p>
        </div>
      </article>

      <article className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center sm:justify-start">
        <ScrollLink targetId="Projects">
          <Button
            size="lg"
            className="
                w-full sm:w-auto
                cursor-pointer
                bg-(--accent-primary)
                hover:bg-(--accent-hover)
                color-(--text-primary)
                shadow-lg shadow-(--accent-primary)/35
                border-0
              "
          >
            See My Projects
          </Button>
        </ScrollLink>

        <Link href="/lorem-ipsum.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="
              w-full sm:w-auto
              cursor-pointer
              border border-(--accent-primary)/85
              text-(--accent-primary)
              bg-transparent
              hover:bg-(--accent-primary)/10
              hover:color-(--text-primary)
            "
          >
            <DownloadIcon className="mr-2" />
            Download CV
          </Button>
        </Link>
      </article>

      <article className="flex items-center gap-4 justify-center sm:justify-start mt-1">
        <Link href="https://github.com/Marczelloo" target="_blank" rel="noopener noreferrer">
          <GithubFillIcon size={36} className="text-(--text-muted) hover:text-(--accent-primary) transition-colors" />
        </Link>
        <Link href="https://linkedin.com/in/marczelloo" target="_blank" rel="noopener noreferrer" className="ml-2">
          <LinkedinFillIcon size={36} className="text-(--text-muted) hover:text-(--accent-primary) transition-colors" />
        </Link>
      </article>
    </section>
  );
}
