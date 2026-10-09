import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Detective, FileText } from "@phosphor-icons/react/dist/ssr";
import KineticWordmark from "./KineticWordmark";

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink text-paper">
      <div className="pt-8 sm:pt-10">
        <KineticWordmark text="MARCZELLOO" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[96rem] flex-1 items-end gap-10 px-4 pb-10 pt-8 sm:px-8 lg:-mt-[9vw] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:pt-0">
        <div className="order-2 max-w-[44rem] lg:order-1 lg:pb-2">
          <p className="mb-5 text-lg leading-relaxed text-paper-mute sm:text-xl">
            Hi, I&apos;m <span className="font-semibold text-paper">Marcel Moskwa</span>, a full-stack developer from Sosnowiec, Poland.
          </p>
          <h1 id="hero-title" className="font-display text-[clamp(2.4rem,5.4vw,4.9rem)] font-bold leading-[0.95] tracking-[-0.035em]">
            <span className="sr-only">Marczelloo. </span>
            I build with AI agents, and build the tools they run on.
          </h1>
          <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-paper-mute sm:text-lg">
            Web apps, a desktop app in Rust, a Discord bot and a homelab I deploy to myself. I plan the work and hand
            the implementation to agents, other agents review it, and I test the result before it ships.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-paper px-6 font-semibold text-ink transition hover:bg-lime active:translate-y-px"
            >
              See the work
              <ArrowDownRight size={18} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <Link
              href="/cv"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-paper/25 px-6 font-semibold transition hover:border-paper active:translate-y-px"
            >
              <FileText size={18} weight="bold" />
              CV
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-paper/25 px-6 font-semibold transition hover:border-paper active:translate-y-px"
            >
              <Detective size={18} weight="bold" />
              Case file version
            </Link>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:order-2 lg:mr-0 lg:max-w-[28rem]">
          {/* The frame clips the portrait on three sides only, so the head and the duck climb out of the top. */}
          <div className="relative mt-[38%] aspect-[5/4] lg:mt-0 rounded-[1.75rem] bg-violet">
            <div
              className="absolute inset-x-0 bottom-0 h-[150%]"
              style={{ clipPath: "inset(-50% 0 0 0 round 0 0 1.75rem 1.75rem)" }}
            >
              <Image
                src="/avatar.png"
                alt="Illustrated avatar of Marcel: curly brown hair, a black hoodie with a heart and a small white duck on his head"
                fill
                priority
                sizes="(max-width: 640px) 19rem, (max-width: 1024px) 23rem, 28rem"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
