export default function About() {
  return (
    <section id="AboutMe" className="w-full flex flex-col gap-8 scroll-mt-16 md:scroll-mt-8">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-(--accent-text)">About Me</h2>
        <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)] gap-10 items-start">
        <div className="space-y-5 text-(--text-secondary) text-sm md:text-base leading-relaxed lg:row-start-1 lg:col-start-1">
          <p className="bg-card/80 border border-border rounded-xl px-5 py-4">
            I'm a full-stack developer currently studying at University of Silesia in Katowice, with over 5 years of
            programming experience and INF.03, INF.04 certifications. My journey started with a technical programming
            education and grew through self-taught exploration and hands-on projects.
          </p>
          <p className="px-1">
            I enjoy building web applications and bots, primarily working with the Next.js/T3 stack. While I'm
            comfortable across the full stack, I love switching between different technologies - whether it's C++ or
            exploring game development. The potential to create something useful and the satisfaction of seeing it come
            to life is what drives me.
          </p>
          <p className="px-5 py-4 rounded-xl border border-border border-l-4 border-l-(--accent-primary) bg-card/80">
            Currently, I'm focused on deepening my expertise in Next.js and modern web technologies, while staying open
            to diverse opportunities in full-stack development.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border border-l-4 border-l-(--accent-primary) h-fit shadow-lg shadow-black/30 space-y-4 lg:row-start-1 lg:row-span-2 lg:col-start-2">
          <h3 className="text-lg md:text-xl font-semibold text-(--text-primary)">Work Experience</h3>
          <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />

          <ul className="space-y-3 text-(--text-secondary) text-sm max-w-[650px]">
            <li className="flex flex-col items-start gap-2">
              <h1 className="font-semibold text-xl tracking-tight">Software Development Intern — Hurtopony</h1>
              <span className="text-sm">May 2023 • Sosnowiec, Poland</span>
              <span className="text-sm italic">Tech: PHP, HTML/CSS, MySQL</span>
              <ul className="list-disc list-inside space-y-1">
                <li>Developed and maintained a PHP-based reporting system for logistics and reporting departments.</li>
                <li>Built internal tools such as PDF report generation and data calculation modules.</li>
                <li>Improved existing scripts for better maintainability and reliability.</li>
                <li>Worked with real company data and adapted tools to daily business needs.</li>
              </ul>
            </li>

            <div className="h-px w-full bg-white/10 my-4" />

            <li className="flex flex-col items-start gap-2">
              <h1 className="font-semibold text-xl tracking-tight">Full-Stack Intern — RecodeIT</h1>
              <span className="text-sm">May 2024 • Katowice, Poland</span>
              <span className="text-sm italic">Tech: Next.js, TypeScript, T3 Stack, Tailwind</span>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Worked on an internal staff-management platform, extending features and improving the UX in a large
                  T3-stack codebase.
                </li>
                <li>Added and improved features in the internal employee management system.</li>
                <li>Implemented UI improvements and handled complex form logic.</li>
                <li>Fixed bugs and refined user flow across multiple sections.</li>
                <li>Collaborated closely with senior developers and participated in code reviews.</li>
                <li>Strengthened modern full-stack skills and learned to work efficiently inside a team codebase.</li>
              </ul>
            </li>

            <div className="h-px w-full bg-white/10 my-4" />

            <li className="flex flex-col items-start gap-2">
              <h1 className="font-semibold text-xl tracking-tight">Contract Developer — D9 Space (RecodeIT)</h1>
              <span className="text-sm">2024 • Katowice, Poland</span>
              <span className="text-sm italic">Tech: PHP, WordPress (Custom Plugins & Backend Logic)</span>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Built a multi-step reservation system for d9space.com, allowing clients to book event and office
                  spaces seamlessly.
                </li>
                <li>
                  Designed and developed the entire reservation workflow, including date selection, space selection,
                  layouts, features and final form submission.
                </li>
                <li>Implemented backend logic integrated with WordPress to handle bookings and availability.</li>
                <li>Ensured a smooth user experience across all steps of the reservation process.</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border h-fit shadow-lg shadow-black/30 space-y-4 lg:row-start-2 lg:col-start-1">
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
