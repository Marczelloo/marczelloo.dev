"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowSquareOut,
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

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const reduceMotion = useReducedMotion();

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
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="section-shell relative flex flex-col justify-center pb-32 pt-20 lg:pb-28 lg:pt-24">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-5"
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              id="contact-title"
              className="font-display text-balance text-4xl font-semibold tracking-[-0.05em] text-text-base sm:text-5xl lg:text-6xl"
            >
              Let&apos;s talk about the work.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-text-soft sm:text-lg">
              I am open to junior roles, internships, and selected freelance projects. Send the context and I will reply directly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.name === "Email" ? undefined : "_blank"}
                    rel={social.name === "Email" ? undefined : "noopener noreferrer"}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-border-strong px-3.5 py-2 text-sm font-semibold text-text-soft transition hover:border-primary-500 hover:bg-surface-900 hover:text-text-base active:translate-y-px"
                  >
                    <Icon size={19} weight="duotone" className="text-primary-300" />
                    {social.name}
                    {social.name !== "Email" && (
                      <ArrowSquareOut size={15} weight="bold" className="text-text-mute transition group-hover:text-primary-300" />
                    )}
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="surface p-6 sm:p-8 lg:col-span-7 lg:p-9"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-text-soft">
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
                  className="min-h-12 rounded-[10px] border border-border-strong bg-bg-900 px-4 py-3 text-base text-text-base placeholder:text-text-mute outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/25"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-text-soft">
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
                  className="min-h-12 rounded-[10px] border border-border-strong bg-bg-900 px-4 py-3 text-base text-text-base placeholder:text-text-mute outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/25"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-text-soft">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Tell me about the role or project."
                  className="resize-none rounded-[10px] border border-border-strong bg-bg-900 px-4 py-3 text-base text-text-base placeholder:text-text-mute outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/25"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[10px] bg-primary-400 px-5 py-3 font-semibold text-[#15111f] transition hover:bg-primary-300 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-65"
              >
                {status === "sending" ? (
                  <>
                    <SpinnerGap size={20} weight="bold" className="animate-spin" />
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
                {status === "sent" && <p className="text-primary-300">Thanks. Your message is on its way.</p>}
              </div>
            </form>
          </motion.div>
        </div>

        <footer className="mt-10 flex w-full flex-wrap items-center justify-between gap-3 text-xs text-text-mute lg:absolute lg:inset-x-0 lg:bottom-7 lg:mt-0">
          <span>&copy; {new Date().getFullYear()} Marcel Moskwa</span>
          <a href="/privacy" className="underline decoration-border-strong underline-offset-4 transition hover:text-text-base">
            Privacy
          </a>
        </footer>
      </div>
    </section>
  );
}
