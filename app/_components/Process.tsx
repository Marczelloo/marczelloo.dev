const STEPS = [
  {
    n: "01",
    name: "Plan",
    text: "I work out what to build with Claude Code, make the architecture calls and write each task down with a goal, the files it touches and how to tell it's done.",
  },
  {
    n: "02",
    name: "Delegate",
    text: "Implementation goes to Sonnet subagents or to Codex through Agent Router MCP, my own server that checks quota, picks the model and isolates risky work in git worktrees.",
  },
  {
    n: "03",
    name: "Review",
    text: "Separate review agents go through the changes. I read their findings and each agent's summary, and anything that looks off goes back with notes.",
  },
  {
    n: "04",
    name: "Test & ship",
    text: "I run it and click through it myself, then deploy with Docker Compose to a Raspberry Pi at home, served through Cloudflare Tunnel.",
  },
] as const;

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-8">
        <header className="mb-20 grid gap-6 lg:mb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-hot">03 / Process</p>
            <h2 id="process-title" className="mt-4 font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.045em]">
              I plan. Agents build.
              <br />
              <span className="text-violet">I check what ships.</span>
            </h2>
          </div>
          <p className="leading-relaxed text-paper-mute">
            I don&apos;t read every line an agent writes. I set the task, read the agents&apos; summaries and what the review agents
            found, test the result myself and decide what ships.
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
      </div>
    </section>
  );
}
