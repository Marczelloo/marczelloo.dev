"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react";

const STORAGE_KEY = "privacy-acknowledged";

export default function PrivacyBanner() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  // The case board is a full-screen scene with its own HUD; the notice waits for the regular pages.
  const immersive = usePathname() === "/";

  useEffect(() => {
    if (immersive || localStorage.getItem(STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, [immersive]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && !immersive && (
        <motion.aside
          aria-label="Privacy notice"
          initial={reduceMotion ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[60] max-w-sm print:hidden sm:right-auto"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-paper/15 bg-ink-2/95 p-4 text-paper shadow-2xl backdrop-blur-xl">
            <ShieldCheck size={20} weight="duotone" className="mt-0.5 shrink-0 text-lime" />
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-paper-mute">
              No tracking cookies. The contact form only keeps your name, e-mail and message.{" "}
              <Link href="/privacy" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-lime">
                Privacy policy
              </Link>
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="min-h-11 shrink-0 rounded-full bg-paper px-4 text-sm font-semibold text-ink transition hover:bg-lime active:translate-y-px"
            >
              OK
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
