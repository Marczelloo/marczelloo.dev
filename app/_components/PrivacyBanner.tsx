"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react";

const STORAGE_KEY = "privacy-acknowledged";

export default function PrivacyBanner() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Privacy notice"
          initial={reduceMotion ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 left-4 right-4 z-[60] mx-auto max-w-lg print:hidden"
        >
          <div className="surface bg-surface-900 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck size={22} weight="duotone" className="mt-0.5 shrink-0 text-primary-300" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text-base">Your privacy matters</p>
                <p className="mt-1 text-sm leading-relaxed text-text-soft">
                  This site uses no tracking cookies. The contact form collects your name, email, and message. Read the{" "}
                  <Link
                    href="/privacy"
                    className="text-primary-300 underline decoration-primary-700 underline-offset-4 hover:text-primary-400"
                  >
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={dismiss}
                className="min-h-11 rounded-[10px] bg-primary-400 px-4 py-2 text-sm font-semibold text-[#15111f] transition hover:bg-primary-300 active:translate-y-px"
              >
                Got it
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
