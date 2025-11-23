import { experiences } from "@/data/experience";
import React from "react";

export default function About() {
  return (
    <section id="AboutMe" className="w-full flex flex-col gap-8 scroll-mt-16 md:scroll-mt-8">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-(--accent-text)">About Me</h2>
        <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-5 text-(--text-secondary) text-sm md:text-base leading-relaxed">
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

          <div className="mt-4 p-6 bg-card rounded-xl border border-border h-fit shadow-lg shadow-black/30 space-y-4">
            <h3 className="text-lg md:text-xl font-semibold text-(--text-primary)">Education &amp; Certifications</h3>
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
                <span>INF.03 - Web Application Development &amp; DB Admin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--accent-primary) mt-1">•</span>
                <span>INF.04 - Software Development &amp; App Design</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:flex-[1.4] p-6 rounded-xl border border-border border-l-4 border-l-(--accent-primary) h-fit shadow-lg shadow-black/30 space-y-4">
          <h3 className="text-lg md:text-xl font-semibold text-(--text-primary)">Work Experience</h3>
          <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />

          <ul className="space-y-3 text-(--text-secondary) text-sm max-w-[650px]">
            {experiences.map((experience, index) => (
              <React.Fragment key={experience.id}>
                <li className="flex flex-col items-start gap-2">
                  <h1 className="font-semibold text-xl tracking-tight">
                    {experience.position} — {experience.company}
                  </h1>
                  <span className="text-sm">
                    {experience.dateRange} • {experience.location}
                  </span>
                  <span className="text-sm italic">Tech: {experience.technologies.join(", ")}</span>

                  <ul className="list-disc list-inside space-y-1">
                    {experience.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </li>

                {experience.liveDemo && (
                  <a
                    href={experience.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-(--accent-primary) hover:underline"
                  >
                    {experience.liveDemoText || "Live Demo"}
                    <span aria-hidden>↗</span>
                  </a>
                )}

                {index < experiences.length - 1 && <div className="h-px w-full bg-white/10 my-4" />}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
