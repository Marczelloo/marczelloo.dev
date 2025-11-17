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
          <p className="text-xl mt-2 text-(--text-secondary)">Junior Web Developer, Node.js & AI</p>
        </div>
      </article>
      <article className="flex gap-4">
        <Button size="lg" className="cursor-pointer">
          See My Projects
        </Button>
        <Button variant="outline" size="lg" className="cursor-pointer">
          <DownloadIcon className="mr-2" />
          Download CV
        </Button>
      </article>
      <article className="flex items-center gap-4 ml-2">
        <Link href={"https://github.com/Marczelloo"}>
          <GithubFillIcon size={36} className="text-(--text-muted) hover:text-(--accent-primary) transition-colors" />
        </Link>
        <Link href={"https://linkedin.com/in/marczelloo"} className="ml-4">
          <LinkedinFillIcon size={36} className="text-(--text-muted) hover:text-(--accent-primary) transition-colors" />
        </Link>
      </article>
    </section>
  );
}
