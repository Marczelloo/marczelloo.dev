"use client";

import { useEffect, useRef } from "react";

type Perch = {
  mountPerch: (
    canvas: HTMLCanvasElement,
    spots: { agent: string; name?: string; rest: string; react: string; at: number }[],
    opts: { size: number; ledge: number },
  ) => { react(on: boolean): void; destroy(): void };
};

// Served as a static file, outside the app bundle.
const PERCH_URL = "/pets/perch.js";

const SPOTS = [
  { agent: "codex", rest: "pf_perch", react: "pf_hi", at: 0.18 },
  { agent: "claude", rest: "pf_perchL", react: "pf_love", at: 0.5 },
  { agent: "opencode", rest: "pf_perch", react: "pf_cheer", at: 0.82 },
];

/**
 * Three Agent Pets sitting on the poster's top edge, drawn by the app's own renderer
 * (bundled into /pets/perch.js). They stand up and wave while the poster is hovered.
 */
export default function PetsPerch({
  size = 84,
  ledge = 14,
  className = "",
}: {
  size?: number;
  ledge?: number;
  /** Horizontal placement and width of the perch, relative to the poster. */
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const poster = canvas?.closest<HTMLElement>("[data-poster]");
    if (!canvas || !poster) return;

    let handle: ReturnType<Perch["mountPerch"]> | null = null;
    let cancelled = false;
    const on = () => handle?.react(true);
    const off = () => handle?.react(false);

    // Load the renderer only when the poster is close to the viewport.
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ PERCH_URL)) as Perch;
        if (cancelled) return;
        // Three pets need room to sit apart; on a phone-wide perch they get a bit smaller.
        const fit = canvas.clientWidth < 400 ? 0.8 : 1;
        handle = mod.mountPerch(canvas, SPOTS, { size: size * fit, ledge });
        poster.addEventListener("pointerenter", on);
        poster.addEventListener("pointerleave", off);
        poster.addEventListener("focusin", on);
        poster.addEventListener("focusout", off);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(poster);

    return () => {
      cancelled = true;
      io.disconnect();
      handle?.destroy();
      poster.removeEventListener("pointerenter", on);
      poster.removeEventListener("pointerleave", off);
      poster.removeEventListener("focusin", on);
      poster.removeEventListener("focusout", off);
    };
  }, [size, ledge]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ height: size * 2, bottom: `calc(100% - ${ledge}px)` }}
    />
  );
}
