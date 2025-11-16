import Image from "next/image";
import { Button } from "./ui/button";
import { DownloadIcon } from "./ui/icons/akar-icons-download";

export default function Hero() {
  return (
    <section id="Hero" className="flex flex-col gap-10">
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
      <article></article>
    </section>
  );
}
