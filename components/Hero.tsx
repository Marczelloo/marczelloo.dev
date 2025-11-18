import Image from "next/image";
import { Button } from "./ui/button";
import { DownloadIcon } from "./ui/icons/akar-icons-download";
import Link from "next/link";
import { GithubFillIcon } from "./ui/icons/akar-icons-github-fill";
import { LinkedinFillIcon } from "./ui/icons/akar-icons-linkedin-fill";

export default function Hero() {
  return (
    <section id="Hero" className="flex flex-col gap-6">
      <article className="flex gap-6">
        <Image
          src="/avatar_nobg.png"
          alt="Marczelloo Avatar"
          width={150}
          height={150}
          className="rounded-full border-border border-2 bg-accent"
        />
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-5xl ">Marczelloo</h1>
          Full-Stack Developer | Next.js & Node.js
        </div>
      </article>
      <article className="flex gap-4">
        <Link href="#Projects">
          <Button
            size="lg"
            className="
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
        </Link>

        <Link href="/lorem-ipsum.pdf" target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="lg"
            className="
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
      <article className="flex items-center gap-4 ml-2">
        <Link href={"https://github.com/Marczelloo"} target="_blank" rel="noopener noreferrer">
          <GithubFillIcon size={36} className="text-(--text-muted) hover:text-(--accent-primary) transition-colors" />
        </Link>
        <Link href={"https://linkedin.com/in/marczelloo"} target="_blank" rel="noopener noreferrer" className="ml-4">
          <LinkedinFillIcon size={36} className="text-(--text-muted) hover:text-(--accent-primary) transition-colors" />
        </Link>
      </article>
    </section>
  );
}
