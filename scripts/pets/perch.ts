// A few Agent Pets sitting on the top edge of the Agent Pets poster.
// Built into public/pets/perch.js by build.mjs; the page imports it lazily and owns the canvas.
import { SCENES, setScene, type Pet, type Scene } from "@pets/renderer";
import { PetPainter } from "@pets/renderer/painter";
import { petFor, type SceneKey } from "@pets/stage/sceneFor";
import type { Agent, Look } from "@pets/types";

const HIP_L = { ikL: 1, hxL: -47, hyL: -25 };
/** Seconds between hearts in the love pose; also one full sway. */
const LOVE_BEAT = 0.9;
const hold = (base: Record<string, unknown>, onStart?: (c: Pet) => void): Scene => ({
  base,
  acts: [["poses for the portfolio", 99, () => ({}), onStart]],
});

// Poses that exist only for the portfolio, added next to the app's own scenes.
Object.assign(SCENES, {
  pf_perch: hold({ sit: 1, swing: 1, look: 0.15 }),
  pf_perchL: hold({ sit: 1, swing: 1, look: -0.2, th: -0.25 }),
  pf_hi: hold({ armR: 2.3, oscR: 0.55, _f: 11, ...HIP_L, look: 0, ex: -0.2, happy: 0.6 }),
  pf_cheer: hold({ armL: 2.6, armR: 2.6, oscL: 0.2, oscR: 0.2, _f: 7, happy: 1, look: -0.3 }),
  // Hands at the chest, a gentle sway, and a new heart floating up every beat.
  pf_love: {
    base: { happy: 1, look: -0.4, ikL: 1, hxL: -14, hyL: -40, ikR: 1, hxR: 14, hyR: -40 },
    acts: [
      [
        "sends hearts",
        LOVE_BEAT,
        (a: number) => {
          const s = Math.sin((a / LOVE_BEAT) * Math.PI * 2);
          return { tilt: 0.07 * s, hyL: -40 - 3 * s, hyR: -40 + 3 * s };
        },
        (c) =>
          c.parts.push({
            t: "♥",
            x: -8 + Math.random() * 16,
            y: -92,
            vx: (Math.random() - 0.5) * 24,
            vy: -34,
            life: 0,
            max: 1.6,
            s: 10 + Math.random() * 5,
            col: "clay",
          }),
      ],
    ],
  },
} satisfies Record<string, Scene>);

export type PerchSpot = {
  agent: Agent;
  /** Blobs take their colour and letter from this name. */
  name?: string;
  rest: string;
  react: string;
  /** Horizontal position as a fraction of the canvas width. */
  at: number;
};

export type PerchOptions = {
  /** Approximate pet height in CSS pixels. */
  size: number;
  /** Distance from the canvas bottom to the edge the pets sit on, in CSS pixels. */
  ledge: number;
};

const LOOK: Look = { style: "clean", motion: "calm" };

export function mountPerch(canvas: HTMLCanvasElement, spots: PerchSpot[], opts: PerchOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { react() {}, destroy() {} };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // One pet per spot: switching scenes on the same pet lets its springs carry it from one pose to the next.
  const painters = spots.map((s) => new PetPainter(petFor({ agent: s.agent, agent_name: s.name ?? null }, s.rest as SceneKey)));

  let excited = false;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  };

  const draw = (now: number) => {
    // The renderer's clock runs in seconds.
    const dt = Math.min(now - last, 100) / 1000;
    last = now;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // A standing pet is roughly 80 renderer units tall.
    const u = opts.size / 80;
    painters.forEach((p, i) =>
      p.frame(ctx, {
        dt,
        t0: now / 1000,
        X: spots[i].at * width,
        Y: height - opts.ledge,
        u,
        look: LOOK,
        animate: !reduced,
        saving: false,
        reduced,
        dpr,
      }),
    );
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (visible) draw(now);
  };

  const ro = new ResizeObserver(() => {
    resize();
    if (reduced) draw(performance.now());
  });
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    last = performance.now();
  });
  io.observe(canvas);

  resize();
  if (reduced) draw(performance.now());
  else raf = requestAnimationFrame(loop);

  return {
    react(on: boolean) {
      if (on === excited) return;
      excited = on;
      painters.forEach((p, i) => {
        // Hearts from the love pose float off instead of staying behind on the sitting pet.
        if (!on) p.pet.parts.forEach((q: { t?: string; life: number; max: number; vy?: number }) => {
          if (q.t === "♥") {
            q.vy = -40;
            q.life = 0;
            q.max = 0.7;
          }
        });
        setScene(p.pet, on ? spots[i].react : spots[i].rest);
      });
      if (reduced) draw(performance.now());
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    },
  };
}
