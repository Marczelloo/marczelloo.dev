"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
  SpinnerGap,
} from "@phosphor-icons/react";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/Marczelloo",
    icon: GithubLogo,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/marczelloo",
    icon: LinkedinLogo,
  },
  {
    name: "Email",
    href: "mailto:moskwamarcel@gmail.com",
    icon: EnvelopeSimple,
  },
] as const;

const FIELD =
  "min-h-12 rounded-xl border border-paper/15 bg-ink-2 px-4 py-3 text-base text-paper placeholder:text-paper-mute/70 outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/40";
const LABEL = "font-mono text-xs uppercase tracking-[0.16em] text-paper-mute";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data?.error ?? "The message could not be sent. Please try email instead.");
        throw new Error("Request failed");
      }

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-ink pb-24 pt-24 text-paper sm:pt-32">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-hot">05 / Contact</p>
            <h2 id="contact-title" className="mt-4 font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.045em]">
              Let&apos;s build
              <br />
              <span className="text-violet">something.</span>
            </h2>
            <p className="mt-8 max-w-[32rem] text-lg leading-relaxed text-paper-mute">
              Open to full-stack roles, internships and freelance projects. Send the context and I will reply directly.
            </p>

            <ul className="mt-10 flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                const external = social.name !== "Email";
                return (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/25 px-5 text-sm font-semibold transition hover:border-paper active:translate-y-px"
                    >
                      <Icon size={18} weight="bold" aria-hidden="true" />
                      {social.name}
                      {external && (
                        <>
                          <ArrowUpRight size={14} weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid content-start gap-6 rounded-[1.5rem] border border-paper/10 bg-ink-2/60 p-6 sm:p-8 lg:col-span-6"
          >
            <div className="grid gap-2">
              <label htmlFor="name" className={LABEL}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Your name"
                className={FIELD}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className={LABEL}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@example.com"
                className={FIELD}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="message" className={LABEL}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Tell me about the role or project."
                className={`${FIELD} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-paper px-6 py-3 font-semibold text-ink transition hover:bg-lime active:translate-y-px disabled:cursor-not-allowed disabled:opacity-65"
            >
              {status === "sending" ? (
                <>
                  <SpinnerGap size={20} weight="bold" className="animate-spin motion-reduce:animate-none" />
                  Sending
                </>
              ) : status === "sent" ? (
                <>
                  <CheckCircle size={20} weight="fill" />
                  Message sent
                </>
              ) : (
                <>
                  Send message
                  <PaperPlaneTilt size={20} weight="bold" />
                </>
              )}
            </button>

            <div aria-live="polite" className="min-h-5 text-sm">
              {status === "error" && (
                <p className="text-[#ff9a9a]">{errorMsg || "The message could not be sent. Please try email instead."}</p>
              )}
              {status === "sent" && <p className="text-lime">Thanks. Your message is on its way.</p>}
            </div>
          </form>
        </div>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-paper/10 pb-24 pt-6 font-mono text-xs uppercase tracking-[0.16em] text-paper-mute">
          <span>&copy; {new Date().getFullYear()} Marcel Moskwa</span>
          <nav aria-label="Footer" className="flex gap-6">
            <a href="/privacy" className="inline-flex min-h-11 items-center underline decoration-paper/30 underline-offset-4 transition hover:text-paper hover:decoration-lime">
              Privacy
            </a>
            <a href="/cv" className="inline-flex min-h-11 items-center underline decoration-paper/30 underline-offset-4 transition hover:text-paper hover:decoration-lime">
              CV
            </a>
            <Link href="/" className="inline-flex min-h-11 items-center underline decoration-paper/30 underline-offset-4 transition hover:text-paper hover:decoration-lime">
              Case file
            </Link>
          </nav>
        </footer>
      </div>
    </section>
  );
}
