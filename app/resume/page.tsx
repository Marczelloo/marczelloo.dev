// app/cv/page.tsx
import Link from "next/link";
import { GithubFillIcon } from "@/components/ui/icons/akar-icons-github-fill";
import { LinkedinFillIcon } from "@/components/ui/icons/akar-icons-linkedin-fill";
import { Button } from "@/components/ui/button";
import { experiences } from "@/data/experience";
import WorkExperienceCard from "@/components/WorkExperienceCard";

export default function CvPage() {
  return (
    <main className="min-h-screen bg-background text-(--text-primary)">
      <div className="cv-print-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10">
        <header className="flex flex-col gap-6 border-b border-border pb-8 cv-no-break">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Marcel Moskwa</h1>
              <p className="mt-1 text-(--accent-text) font-medium">Full-Stack Developer · Next.js &amp; Node.js</p>
              <p className="mt-1 text-(--text-secondary)">
                Sosnowiec, Poland · Open to internships &amp; junior opportunities
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-(--text-secondary)">
                <a href="mailto:moskwamarcel@gmail.com" className="hover:text-(--accent-primary) transition-colors">
                  moskwamarcel@gmail.com
                </a>
                <Link
                  href="https://github.com/Marczelloo"
                  target="_blank"
                  className="inline-flex items-center gap-1 hover:text-(--accent-primary) transition-colors"
                >
                  <GithubFillIcon size={20} /> GitHub
                </Link>
                <Link
                  href="https://linkedin.com/in/marczelloo"
                  target="_blank"
                  className="inline-flex items-center gap-1 hover:text-(--accent-primary) transition-colors"
                >
                  <LinkedinFillIcon size={20} /> LinkedIn
                </Link>
              </div>

              <Button
                asChild
                className="cv-no-print cursor-pointer bg-(--accent-primary) hover:bg-(--accent-hover) 
                           color-(--text-primary) border-0 shadow-lg shadow-(--accent-primary)/30"
              >
                <Link href="/Marcel_Moskwa_CV.pdf" target="_blank">
                  Download PDF
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-[1.3fr_minmax(0,1fr)] gap-6 cv-no-break">
          <div className="bg-card/80 border border-border rounded-xl p-5 space-y-3 cv-no-break">
            <h2 className="text-lg font-semibold mb-1 text-(--text-primary)">Profile</h2>
            <p className="text-sm md:text-base text-(--text-secondary)">
              I’m a full-stack developer currently studying Computer Science at the University of Silesia in Katowice,
              with over 5 years of programming experience and INF.03 / INF.04 certifications. My journey started with a
              technical programming education and grew through self-taught exploration and hands-on projects.
            </p>
            <p className="text-sm md:text-base text-(--text-secondary)">
              I enjoy building web applications and bots, primarily working with the Next.js/T3 stack. I’m comfortable
              across the full stack, from backend logic to frontend UX, and I like experimenting with technologies such
              as C++ and game development.
            </p>
            <p className="text-sm md:text-base text-(--text-secondary)">
              Currently, I’m focused on deepening my expertise in modern web technologies while staying open to diverse
              opportunities in full-stack development.
            </p>
          </div>

          <div className="bg-card/80 border border-border rounded-xl p-5 space-y-3 cv-no-break">
            <h2 className="text-lg font-semibold text-(--text-primary)">Skills</h2>
            <div className="h-px w-10 bg-(--accent-primary) rounded-full mb-2" />
            <dl className="space-y-3 text-sm text-(--text-secondary)">
              <div>
                <dt className="font-semibold text-(--text-primary)">Languages</dt>
                <dd>TypeScript, JavaScript, PHP, C++, SQL</dd>
              </div>
              <div>
                <dt className="font-semibold text-(--text-primary)">Web &amp; Frameworks</dt>
                <dd>Next.js, React, Node.js, Express, T3 Stack, Tailwind CSS</dd>
              </div>
              <div>
                <dt className="font-semibold text-(--text-primary)">Databases</dt>
                <dd>MySQL, MongoDB, PostgreSQL, Drizzle ORM</dd>
              </div>
              <div>
                <dt className="font-semibold text-(--text-primary)">Other</dt>
                <dd>Git, REST APIs, WordPress (custom plugins &amp; backend logic)</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="space-y-4 cv-page-break-before">
          <h2 className="text-xl font-semibold text-(--text-primary)">Work Experience</h2>

          <div className="space-y-4 text-sm text-(--text-secondary)">
            {experiences.map((experience) => (
              <div key={experience.id} className="cv-no-break">
                <WorkExperienceCard experience={experience} />
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_minmax(0,1fr)] gap-6">
          <div className="bg-card/80 border border-border rounded-xl p-5 space-y-4 cv-no-break">
            <h2 className="text-lg md:text-xl font-semibold text-(--text-primary)">Selected Projects</h2>
            <div className="h-px w-10 bg-(--accent-primary) rounded-full" />
            <div className="space-y-4 text-sm text-(--text-secondary)">
              <div>
                <h3 className="font-semibold text-(--text-primary)">NeoBeat Buddy</h3>
                <p>
                  High-performance Discord music bot built with Node.js, Discord.js, Lavalink and Poru. Features
                  slash-only controls, live equaliser presets, queue management, adaptive autoplay and a Docker-ready
                  production stack.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-(--text-primary)">BookHaven</h3>
                <p>
                  Full-stack online bookstore built with Node.js, Express and MongoDB. Includes book browsing,
                  multi-volume management, secure checkout logic and a clean MVC-style backend designed for easy
                  expansion.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 border border-border rounded-xl p-5 space-y-3 cv-no-break">
            <h2 className="text-lg md:text-xl font-semibold text-(--text-primary)">Education &amp; Certifications</h2>
            <div className="h-px w-10 bg-(--accent-primary) rounded-full" />
            <ul className="space-y-3 text-sm text-(--text-secondary)">
              <li className="flex items-start gap-2">
                <span className="text-(--accent-primary) mt-1">•</span>
                <span>University of Silesia in Katowice — Computer Science (ongoing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--accent-primary) mt-1">•</span>
                <span>Technical School — Computer Programming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--accent-primary) mt-1">•</span>
                <span>INF.03 — Web Application Development &amp; DB Admin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--accent-primary) mt-1">•</span>
                <span>INF.04 — Software Development &amp; App Design</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
