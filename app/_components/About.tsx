"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BracketsCurly, Database, GitBranch, Robot } from "@phosphor-icons/react";

const CAPABILITIES = [
  {
    icon: BracketsCurly,
    title: "Frontend",
    items: "HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS",
  },
  {
    icon: Database,
    title: "Backend and data",
    items: "PHP, Node.js fundamentals, SQL, MySQL, PostgreSQL, MongoDB, Oracle SQL",
  },
  {
    icon: GitBranch,
    title: "Delivery",
    items: "Git, REST APIs, WordPress, Docker fundamentals, pull requests, deployment",
  },
] as const;

const WORKFLOW = [
  "Start from the user flow and data model, then choose the smallest reliable implementation.",
  "Work across UI, backend logic, databases, and deployment instead of treating them as separate worlds.",
  "Use AI agents for planning, implementation support, delegation, and verification while retaining engineering judgment.",
  "Document decisions and improve existing code before adding unnecessary complexity.",
] as const;

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="section-shell flex flex-col justify-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            id="about-title"
            className="font-display text-balance max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-text-base sm:text-5xl lg:text-6xl"
          >
            I bridge technical foundations and practical delivery.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-soft sm:text-lg">
            I am a computer science student and programming technician with two internships, a paid client project,
            and a growing set of independently shipped full-stack products.
          </p>
        </motion.div>

        <div className="mt-9 grid border-y border-border-subtle sm:grid-cols-3">
          {[
            ["2", "software internships"],
            ["1", "paid client project"],
            ["C1", "English proficiency"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`py-5 sm:px-6 ${index > 0 ? "border-t border-border-subtle sm:border-l sm:border-t-0" : ""}`}
            >
              <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-primary-300">{value}</p>
              <p className="mt-1 text-sm text-text-mute">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface px-6 sm:px-8">
            {CAPABILITIES.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={capability.title}
                  className={`grid gap-4 py-5 sm:grid-cols-[11rem_1fr] sm:items-center ${
                    index < CAPABILITIES.length - 1 ? "border-b border-border-subtle" : ""
                  }`}
                  initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                >
                  <h3 className="flex items-center gap-3 font-semibold text-text-base">
                    <Icon size={22} weight="duotone" className="text-primary-300" />
                    {capability.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-soft">{capability.items}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.aside
            className="relative overflow-hidden rounded-[18px] border border-primary-600/50 bg-primary-700/25 p-6 sm:p-8"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.58, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 text-primary-300">
              <Robot size={24} weight="duotone" />
              <h3 className="font-display text-xl font-semibold text-text-base">How I work</h3>
            </div>
            <ol className="mt-6 grid gap-4">
              {WORKFLOW.map((item, index) => (
                <li key={item} className="grid grid-cols-[1.5rem_1fr] gap-3 text-sm leading-relaxed text-text-soft">
                  <span className="font-semibold tabular-nums text-primary-300">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
