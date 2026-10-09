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
    // Letter centres as a fraction of the row width, measured once at rest. Measuring every frame would
    // feed the animation its own layout changes and make the letters jitter.
    let rest: number[] = [];
    const measure = () => {
      const rootBox = root.getBoundingClientRect();
      rest = letters.map((el) => {
        const box = el.getBoundingClientRect();
        return (box.left + box.width / 2 - rootBox.left) / (rootBox.width || 1);
      });
    };
    measure();
    // The display font may arrive after mount and change the letter widths.
    document.fonts?.ready.then(measure);
    const current = letters.map(() => 0);
    let targetX: number | null = null;
    let pointerX: number | null = null;
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const box = root.getBoundingClientRect();
      targetX = (e.clientX - box.left) / (box.width || 1);
      if (pointerX === null) pointerX = targetX;
    };
    const onLeave = () => {
      targetX = null;
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(t - last, 64);
      last = t;
      if (!visible) return;
      // Frame-rate independent easing: the pointer glides, the letters follow a little behind it.
      const glide = 1 - Math.exp(-dt / 90);
      const follow = 1 - Math.exp(-dt / 140);
      if (targetX !== null && pointerX !== null) pointerX += (targetX - pointerX) * glide;
      else if (targetX === null) pointerX = null;

      letters.forEach((el, i) => {
        let target: number;
        if (pointerX === null) {
          target = Math.max(0, 0.5 + 0.5 * Math.sin(t / 900 - i * 0.55) - 0.55);
        } else {
          // Cosine falloff: no sharp peak under the cursor, no hard edge at the end of its reach.
          const d = Math.min(1, Math.abs(rest[i] - pointerX) / 0.2);
          target = 0.5 + 0.5 * Math.cos(Math.PI * d);
        }
        current[i] += (target - current[i]) * follow;
        const k = current[i];
        el.style.fontVariationSettings = `"wght" ${(800 - k * 560).toFixed(1)}, "wdth" ${(75 + k * 25).toFixed(2)}`;
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
