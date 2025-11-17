export default function About() {
  return (
    <section id="AboutMe" className="w-full flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-(--accent-text)">About Me</h2>
        <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="max-w-4xl lg:col-span-2 text-(--text-secondary) text-sm md:text-base leading-relaxed space-y-5">
          <p className="bg-(--bg-card)/80 border border-border rounded-xl px-5 py-4">
            I'm a full-stack developer currently studying at Uniwersytet Śląski w Katowicach, with over 5 years of
            programming experience and INF.03, INF.04 certifications. My journey started with a technical programming
            education and grew through self-taught exploration and hands-on projects.
          </p>
          <p className="px-1">
            I enjoy building web applications and bots, primarily working with the Next.js/T3 stack. While I'm
            comfortable across the full stack, I love switching between different technologies - whether it's C++ or
            exploring game development. The potential to create something useful and the satisfaction of seeing it come
            to life is what drives me.
          </p>
          <p className="px-5 py-4 rounded-xl border border-border border-l-4 border-l-(--accent-primary) bg-(--bg-card)/80">
            Currently, I'm focused on deepening my expertise in Next.js and modern web technologies, while staying open
            to diverse opportunities in full-stack development.
          </p>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border h-fit shadow-lg shadow-black/30 space-y-4">
          <h3 className="text-lg md:text-xl font-semibold text-(--text-primary)">Education & Certifications</h3>
          <div className="h-px w-10 bg-(--accent-primary) rounded-full" />

          <ul className="space-y-3 text-(--text-secondary) text-sm">
            <li className="flex items-start gap-2">
              <span className="text-(--accent-primary) mt-1">•</span>
              <span>University of Silesia in Katowice - Computer Science</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-(--accent-primary) mt-1">•</span>
              <span>Technical School - Computer Programming</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-(--accent-primary) mt-1">•</span>
              <span>INF.03 - Web Application Development & DB Admin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-(--accent-primary) mt-1">•</span>
              <span>INF.04 - Software Development & App Design</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
