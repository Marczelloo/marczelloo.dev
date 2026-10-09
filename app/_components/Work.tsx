import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { PROJECTS, projectsByTier, type Project } from "../_data/projects";
import PetsPerch from "./PetsPerch";

const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;

function ProjectLinks({ project, tone }: { project: Project; tone: "dark" | "light" }) {
  const solid = tone === "light" ? "bg-ink text-paper hover:bg-ink/85" : "bg-paper text-ink hover:bg-lime";
  const ghost = tone === "light" ? "border-ink/25 hover:border-ink" : "border-paper/25 hover:border-paper";
  return (
    <div className="flex flex-wrap gap-2.5">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          className={`group inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition active:translate-y-px ${solid}`}
        >
          Open it
          <ArrowUpRight size={16} weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">: {project.name} (opens in a new tab)</span>
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition active:translate-y-px ${ghost}`}
        >
          <GithubLogo size={16} weight="bold" />
          Source
          <span className="sr-only">: {project.name} on GitHub (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

function PosterText({ project, index, tone }: { project: Project; index: string; tone: "dark" | "light" }) {
  const mute = tone === "light" ? "text-ink/70" : "text-paper/75";
  return (
    <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-10 lg:p-12">
      <p className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] ${mute}`}>
        <span>{index}</span>
        <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />
        <span>{project.year}</span>
      </p>
      <div>
        <h3 id={`${project.slug}-title`} className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
          {project.name}
        </h3>
        <p className="mt-4 max-w-[30rem] font-display text-xl font-semibold leading-snug tracking-[-0.01em] sm:text-2xl">
          {project.tagline}
        </p>
      </div>
      <p className={`max-w-[34rem] leading-relaxed ${mute}`}>{project.summary}</p>
      {project.highlights && (
        <ul className={`grid max-w-[36rem] gap-2 text-sm leading-relaxed ${mute}`}>
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full" style={{ background: "currentColor" }} aria-hidden="true" />
              {h}
            </li>
          ))}
        </ul>
      )}
      <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
        {project.stack.map((s) => (
          <li
            key={s}
            className={`rounded-full border px-3 py-1 font-mono text-xs ${tone === "light" ? "border-ink/20" : "border-paper/20"}`}
          >
            {s}
          </li>
        ))}
      </ul>
      <ProjectLinks project={project} tone={tone} />
    </div>
  );
}

/** A flagship poster. Its background is clipped to the rounded frame; `escape` is clipped on three sides only. */
function Poster({
  project,
  index,
  tone,
  background,
  visual,
  escape,
  reverse = false,
  mobileVisual,
}: {
  project: Project;
  index: string;
  tone: "dark" | "light";
  background: string;
  visual: ReactNode;
  escape?: ReactNode;
  reverse?: boolean;
  /** Height of the visual strip under the text on small screens, where text and visual stack. */
  mobileVisual: string;
}) {
  return (
    <article
      data-poster
      aria-labelledby={`${project.slug}-title`}
      className={`relative rounded-[2rem] ${tone === "light" ? "text-ink" : "text-paper"}`}
      style={{ "--visual": mobileVisual } as CSSProperties}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]" style={{ background }} aria-hidden="true">
        {visual}
      </div>
      {escape}
      <div className={`relative grid pb-[var(--visual)] lg:min-h-[38rem] lg:grid-cols-2 lg:pb-0 ${reverse ? "lg:[&>*:first-child]:col-start-2" : ""}`}>
        <PosterText project={project} index={index} tone={tone} />
      </div>
    </article>
  );
}

function AgentPetsPoster() {
  const p = bySlug("agent-pets");
  return (
    <Poster
      project={p}
      index="01"
      tone="light"
      mobileVisual="22rem"
      background="radial-gradient(120% 90% at 85% 10%, #f7d9c2 0%, #fbf1e8 55%, #f4e6d8 100%)"
      visual={
        <div className="absolute inset-x-0 bottom-0 h-[var(--visual)] lg:inset-y-0 lg:h-auto lg:left-1/2 lg:right-0">
          <Image
            src="/projects/agent-pets-settings.webp"
            alt=""
            width={1400}
            height={933}
            sizes="(min-width: 1024px) 34rem, 80vw"
            className="absolute left-[8%] top-[14%] w-[78%] rotate-[4deg] rounded-2xl shadow-[0_30px_60px_-20px_rgba(43,38,34,0.45)] lg:left-[18%] lg:top-[16%]"
          />
          <Image
            src="/projects/agent-pets-panel.webp"
            alt="The Agent Pets panel listing three coding sessions with their pets, tasks and status"
            width={800}
            height={1000}
            sizes="(min-width: 1024px) 18rem, 50vw"
            className="absolute bottom-[-12%] left-[6%] w-[46%] -rotate-[3deg] rounded-2xl shadow-[0_30px_60px_-15px_rgba(43,38,34,0.55)] lg:bottom-[8%] lg:left-[4%] lg:w-[44%]"
          />
          <Image
            src="/projects/agent-pets-taskbar.webp"
            alt=""
            width={900}
            height={104}
            sizes="(min-width: 1024px) 30rem, 70vw"
            className="absolute bottom-[6%] right-[-6%] w-[70%] rounded-xl shadow-[0_20px_40px_-15px_rgba(43,38,34,0.5)] max-lg:hidden"
          />
        </div>
      }
      escape={<PetsPerch className="right-[4%] w-[min(30rem,88%)] lg:right-[6%]" />}
    />
  );
}

function MewBitPoster() {
  const p = bySlug("mewbit");
  return (
    <Poster
      project={p}
      index="02"
      tone="dark"
      reverse
      mobileVisual="21rem"
      background="#07060f"
      visual={
        <>
          <Image
            src="/projects/mewbit-stage.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#07060f] via-[#07060f]/85 to-transparent max-lg:bg-gradient-to-b" />
        </>
      }
      escape={
        // The character leans out over the poster's top edge; the clip keeps her inside it everywhere else.
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[var(--visual)] w-full lg:h-[120%] lg:w-1/2"
          style={{ clipPath: "inset(-30% 0 0 0 round 0 0 2rem 2rem)" }}
          aria-hidden="true"
        >
          <Image
            src="/projects/mewbit-character.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 40rem, 90vw"
            className="object-contain object-bottom"
          />
        </div>
      }
    />
  );
}

function DashboardPoster() {
  const p = bySlug("dashboard");
  return (
    <Poster
      project={p}
      index="03"
      tone="dark"
      mobileVisual="15rem"
      background="radial-gradient(90% 80% at 90% 0%, #163d24 0%, #0b1a10 60%, #08120b 100%)"
      visual={
        <div className="absolute inset-x-0 bottom-0 h-[var(--visual)] lg:inset-y-0 lg:h-auto lg:left-1/2 lg:right-0">
          <div className="absolute left-[6%] top-[12%] w-[150%] overflow-hidden rounded-2xl border border-[#4ade80]/30 bg-[#111] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] lg:top-[20%] lg:w-[135%]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-[#4ade80]" />
              <span className="ml-3 font-mono text-xs text-white/50">demo-dashboard.marczelloo.dev</span>
            </div>
            <Image
              src="/projects/marczelloo_dashboard.webp"
              alt="Marczelloo Dashboard overview with project, service and uptime counts, recent deployments and quick actions"
              width={1600}
              height={761}
              sizes="(min-width: 1024px) 50rem, 120vw"
            />
          </div>
        </div>
      }
    />
  );
}

function NotableCard({ project, visual }: { project: Project; visual: ReactNode }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-paper/10 bg-ink-2">
      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: project.accent }}>
        {visual}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-paper-mute">{project.year}</p>
        <h3 className="font-display text-4xl font-extrabold tracking-[-0.03em]">{project.name}</h3>
        <p className="font-display text-lg font-semibold leading-snug">{project.tagline}</p>
        <p className="leading-relaxed text-paper-mute">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
          {project.stack.map((s) => (
            <li key={s} className="rounded-full border border-paper/15 px-3 py-1 font-mono text-xs text-paper/80">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <ProjectLinks project={project} tone="dark" />
        </div>
      </div>
    </article>
  );
}

const ROUTER_STEPS = [
  ["plan", "Claude reads the repo and writes the task"],
  ["check", "Quota and model picked before anything runs"],
  ["isolate", "Risky work goes to its own git worktree"],
  ["snapshot", "The tree is saved before and after each turn"],
  ["review", "A second model reviews the diff, read-only"],
];

export default function Work() {
  const inProgress = projectsByTier("in-progress");
  const archive = projectsByTier("archive");

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-8">
        <header className="mb-24 grid gap-6 lg:mb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-hot">02 / Work</p>
            <h2 id="work-title" className="mt-4 font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.045em]">
              Things I made
              <br />
              <span className="text-violet">and still use.</span>
            </h2>
          </div>
          <p className="leading-relaxed text-paper-mute">
            Three projects I would show first, two I lean on every day, and the rest of the shelf. Everything here runs,
            and most of it runs on my own hardware.
          </p>
        </header>

        <div className="grid gap-28 lg:gap-36">
          <AgentPetsPoster />
          <MewBitPoster />
          <DashboardPoster />
        </div>

        <div className="mt-28 grid gap-6 lg:mt-36 lg:grid-cols-2">
          <NotableCard
            project={bySlug("atlashub")}
            visual={
              <Image
                src="/projects/atlashub.webp"
                alt="AtlasHub landing page: Your own Supabase-like backend"
                width={1600}
                height={763}
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="absolute left-[8%] top-[12%] w-[100%] rounded-tl-xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:-translate-y-1.5"
              />
            }
          />
          <NotableCard
            project={bySlug("agent-router-mcp")}
            visual={
              <ol className="absolute inset-0 flex flex-col justify-center gap-1.5 px-[8%] font-mono text-xs text-ink sm:gap-2.5 sm:text-sm">
                {ROUTER_STEPS.map(([step, text], i) => (
                  <li key={step} className="flex items-baseline gap-3">
                    <span className="w-6 shrink-0 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                    <span className="w-20 shrink-0 font-bold uppercase">{step}</span>
                    <span className="truncate opacity-75">{text}</span>
                  </li>
                ))}
              </ol>
            }
          />
        </div>

        <div className="mt-24 grid gap-4 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-paper-mute">On the bench</h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {inProgress.map((p) => (
              <li key={p.slug} className="flex flex-col gap-3 rounded-[1.25rem] border border-dashed border-paper/20 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-2xl font-bold tracking-[-0.02em]">{p.name}</span>
                  <span className="rounded-full bg-lime/15 px-2.5 py-1 font-mono text-xs text-lime">
                    {p.live || p.github ? "In progress" : "Private"}
                  </span>
                </div>
                <p className="leading-relaxed text-paper-mute">{p.summary}</p>
                {(p.live || p.github) && (
                  <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm font-semibold">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 underline decoration-paper/30 underline-offset-4 hover:decoration-lime">
                        Open it <ArrowUpRight size={14} weight="bold" />
                      </a>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 underline decoration-paper/30 underline-offset-4 hover:decoration-lime">
                        Source <GithubLogo size={14} weight="bold" />
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-paper-mute">Archive</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper-mute">Earlier projects, self-taught and from university.</p>
          </div>
          <ul className="border-t border-paper/10">
            {archive.map((p) => (
              <li key={p.slug}>
                <a
                  href={p.live ?? p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid min-h-14 grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-paper/10 py-3 transition hover:bg-paper/[0.03] sm:grid-cols-[4rem_minmax(0,14rem)_minmax(0,1fr)_auto]"
                >
                  <span className="font-mono text-xs text-paper-mute">{p.year}</span>
                  <span className="font-display text-lg font-bold tracking-[-0.01em]">{p.name}</span>
                  <span className="hidden truncate text-sm text-paper-mute sm:block">{p.tagline}</span>
                  <span className="flex items-center gap-3 font-mono text-xs text-paper-mute">
                    <span className="hidden md:inline">{p.stack.join(" · ")}</span>
                    <ArrowUpRight size={16} weight="bold" className="text-paper transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
