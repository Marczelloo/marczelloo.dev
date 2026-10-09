"use client";

import { useEffect, useRef } from "react";

/**
 * A full-width wordmark whose letters thin out and widen around the pointer.
 * With no pointer (touch, or the cursor elsewhere) a slow wave runs through it instead.
 */
export default function KineticWordmark({ text }: { text: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    const current = letters.map(() => 0);
    let pointerX: number | null = null;
    let raf = 0;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pointerX = e.clientX;
    };
    const onLeave = () => {
      pointerX = null;
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const width = root.clientWidth || 1;
      // Read every position before writing any style, so the browser lays out once per frame.
      const centers = letters.map((el) => {
        const box = el.getBoundingClientRect();
        return box.left + box.width / 2;
      });
      letters.forEach((el, i) => {
        const center = centers[i];
        // 0 = resting heavy letter, 1 = fully thinned and widened
        const target =
          pointerX === null
            ? 0.5 + 0.5 * Math.sin(t / 900 - i * 0.55) - 0.55
            : Math.max(0, 1 - Math.abs(center - pointerX) / (width * 0.16));
        current[i] += (Math.max(0, target) - current[i]) * 0.12;
        const k = current[i];
        el.style.fontVariationSettings = `"wght" ${Math.round(800 - k * 560)}, "wdth" ${Math.round(75 + k * 25)}`;
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);
    const hero = root.closest("section") ?? root;
    hero.addEventListener("pointermove", onMove as EventListener);
    hero.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      hero.removeEventListener("pointermove", onMove as EventListener);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative w-full select-none overflow-hidden px-2 sm:px-4">
      <div
        className="flex justify-between whitespace-nowrap font-display font-extrabold leading-[0.78] tracking-[-0.02em] text-paper"
        style={{ fontSize: "clamp(3.25rem, 15vw, 20rem)", fontVariationSettings: '"wght" 800, "wdth" 75' }}
      >
        {text.split("").map((ch, i) => (
          <span key={i} data-letter className={i >= text.length - 2 ? "text-violet" : undefined}>
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
