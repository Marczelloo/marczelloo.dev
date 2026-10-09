const STEPS = [
  {
    n: "01",
    name: "Plan",
    text: "I read the problem with Claude Code, make the architecture calls and write the task down so an agent can't misread it.",
  },
  {
    n: "02",
    name: "Delegate",
    text: "Well-specified work goes to Sonnet subagents or to Codex through Agent Router MCP, my own server that checks quota and isolates risky work in git worktrees.",
  },
  {
    n: "03",
    name: "Review",
    text: "Every diff gets read before it lands. A second model reviews the critical parts, tests run, and anything off goes back with notes.",
  },
  {
    n: "04",
    name: "Ship",
    text: "Docker Compose on a Raspberry Pi at home, deployed from my own dashboard and served through Cloudflare Tunnel.",
  },
] as const;

const TOOLBOX = [
  ["Frontend", ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "HTML", "CSS"]],
  ["Backend & data", ["Node.js", "Fastify", "Express", "PHP", "REST API", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Oracle SQL"]],
  ["Desktop & other languages", ["Rust (Tauri 2)", "C++", "C#", "Java (basics)"]],
  ["Infrastructure", ["Docker", "Docker Compose", "Git", "Linux / Raspberry Pi", "Cloudflare Tunnel", "Portainer"]],
  ["AI workflow", ["Claude Code", "Codex", "opencode", "MCP", "Planning", "Delegating tasks to agents", "Code review", "Verifying results"]],
] as const;

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-8">
        <header className="mb-20 grid gap-6 lg:mb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-hot">03 / Process</p>
            <h2 id="process-title" className="mt-4 font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.045em]">
              I plan. Agents type.
              <br />
              <span className="text-violet">I review every line.</span>
            </h2>
          </div>
          <p className="leading-relaxed text-paper-mute">
            I work with AI agents in a supervised loop, and I build the tools that loop runs on. Here is how a piece of work
            moves from idea to a running service.
          </p>
        </header>

        <ol className="grid border-t border-paper/15 lg:grid-cols-4 lg:border-l">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="group relative flex flex-col gap-6 border-b border-paper/15 py-10 transition-colors hover:bg-paper/[0.03] lg:border-b-0 lg:border-r lg:p-8 lg:pb-12"
            >
              <span
                aria-hidden="true"
                className="font-display text-[clamp(5rem,12vw,9rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-paper/15 transition-colors group-hover:text-violet"
              >
                {step.n}
              </span>
              <div>
                <h3 className="font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                  <span className="sr-only">Step {step.n}: </span>
                  {step.name}
                </h3>
                <p className="mt-4 max-w-[34rem] leading-relaxed text-paper-mute">{step.text}</p>
              </div>
              <span className="absolute right-0 top-10 size-2 rounded-full bg-lime opacity-0 transition-opacity group-hover:opacity-100 lg:right-6 lg:top-8" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="mt-24 grid gap-8 lg:mt-32 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-paper-mute">Toolbox</h3>
          <dl className="border-t border-paper/10">
            {TOOLBOX.map(([group, items]) => (
              <div key={group} className="grid gap-3 border-b border-paper/10 py-6 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-6">
                <dt className="font-display text-xl font-bold tracking-[-0.02em]">{group}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <li key={item} className="rounded-full border border-paper/15 px-3 py-1 font-mono text-xs text-paper/80">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
