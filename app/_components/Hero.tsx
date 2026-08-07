"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, FileArrowDown } from "@phosphor-icons/react";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const scrollToCraft = () => {
    document.getElementById("craft")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section id="hero" className="section" aria-labelledby="hero-title">
      <div className="section-shell flex items-center justify-center pb-28 pt-20 lg:pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <motion.div
            className="relative mb-9 size-32 sm:size-36 lg:size-40"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-[-10px] rounded-full border border-primary-400/20" />
            <div className="absolute inset-[-4px] rounded-full bg-primary-400/10 blur-xl" />
            <div className="relative size-full overflow-hidden rounded-full border border-primary-300/50 bg-surface-900 shadow-[0_22px_70px_-34px_rgba(171,139,255,0.9)]">
              <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(167,139,250,0.28),rgba(18,17,30,0.9)_72%)]" />
              <Image
                src="/avatar_nobg.png"
                alt="Illustrated portrait of Marcel Moskwa"
                fill
                priority
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 160px"
                className="relative z-10 object-contain object-bottom p-2"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, delay: reduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">
              Junior full-stack developer
            </p>
            <h1
              id="hero-title"
              className="max-w-5xl text-balance text-[clamp(4rem,10vw,8.25rem)] font-extrabold leading-[0.84] tracking-[-0.04em] text-text-base"
            >
              MARCZELLOO
            </h1>

            <p className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-text-soft sm:text-lg lg:text-xl">
              Junior full-stack developer turning practical ideas into reliable web products.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={scrollToCraft}
                className="group inline-flex min-h-12 items-center gap-2.5 rounded-[10px] bg-primary-400 px-5 py-3 font-semibold text-[#13101d] transition hover:bg-primary-300 active:translate-y-px"
              >
                View projects
                <ArrowDownRight
                  size={19}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </button>
              <Link
                href="/cv"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-[10px] border border-border-strong bg-surface-900 px-5 py-3 font-semibold text-text-base transition hover:border-primary-500 hover:bg-surface-800 active:translate-y-px"
              >
                <FileArrowDown size={19} weight="bold" />
                View CV
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
