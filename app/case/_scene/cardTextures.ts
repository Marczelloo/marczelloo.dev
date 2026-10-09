import * as THREE from "three";
import { CARDS, CASE_NUMBER, PHOTO_BORDER, type CaseCard } from "../content";
import { cardSize } from "./layout";

// Card faces are painted on 2D canvases: scanned paper as the base, then ink
// laid down character by character (typewriter strike jitter, uneven ribbon),
// handwriting, a worn rubber stamp, clipped photos and photo prints.

export type CardFace = {
  map: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
  roughness?: THREE.CanvasTexture;
};

export type Ctx = CanvasRenderingContext2D;
export type Rng = () => number;

export const INK = "#1c1a18";
export const STAMP_RED = "#a3231d";

export function seeded(seed: string): Rng {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(w);
  c.height = Math.round(h);
  const ctx = c.getContext("2d")!;
  return { c, ctx };
}

export type Fonts = { type: string; hand: string; mono: string };

export async function loadFonts(): Promise<Fonts> {
  const style = getComputedStyle(document.querySelector("main") ?? document.body);
  const read = (v: string, fallback: string) => style.getPropertyValue(v).trim() || fallback;
  const fonts = {
    type: read("--font-typewriter", "'Courier New', monospace"),
    hand: read("--font-hand", "cursive"),
    mono: read("--font-mono-body", "'Courier New', monospace"),
  };
  await Promise.all([
    document.fonts.load(`40px ${fonts.type}`),
    document.fonts.load(`500 40px ${fonts.hand}`),
    document.fonts.load(`700 40px ${fonts.hand}`),
    document.fonts.load(`40px ${fonts.mono}`),
    document.fonts.load(`700 40px ${fonts.mono}`),
  ]).catch(() => undefined);
  return fonts;
}

// --- paper ------------------------------------------------------------------

/** Scanned paper cropped at a random offset, tinted and aged. */
export function paper(ctx: Ctx, w: number, h: number, scan: HTMLImageElement, tint: string, r: Rng, age = 1) {
  const s = Math.max(w / scan.width, h / scan.height) * (1.05 + r() * 0.35);
  ctx.drawImage(scan, -r() * (scan.width * s - w), -r() * (scan.height * s - h), scan.width * s, scan.height * s);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, w, h);

  // Foxing and grime: soft brown blotches, denser near the edges.
  for (let i = 0; i < 26 * age; i++) {
    const edge = r() < 0.6;
    const x = edge ? (r() < 0.5 ? r() * w * 0.12 : w - r() * w * 0.12) : r() * w;
    const y = r() * h;
    const rad = (0.006 + r() * r() * 0.05) * w;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, `rgba(120, 82, 40, ${0.05 + r() * 0.12})`);
    g.addColorStop(1, "rgba(120, 82, 40, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  // Edges darkened by handling.
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) * 0.56);
  v.addColorStop(0, "rgba(255,255,255,0)");
  v.addColorStop(1, `rgba(110, 80, 50, ${0.38 * age})`);
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
  const band = Math.min(w, h) * 0.025;
  for (const [x, y, bw, bh, gx0, gy0, gx1, gy1] of [
    [0, 0, w, band, 0, 0, 0, band],
    [0, h - band, w, band, 0, h, 0, h - band],
    [0, 0, band, h, 0, 0, band, 0],
    [w - band, 0, band, h, w, 0, w - band, 0],
  ]) {
    const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
    g.addColorStop(0, `rgba(90, 64, 40, ${0.35 * age})`);
    g.addColorStop(1, "rgba(90, 64, 40, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, bw, bh);
  }
  ctx.restore();
}

/** A fold crease: a dark valley line with a lit ridge beside it. */
export function crease(ctx: Ctx, w: number, y: number, r: Rng) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.strokeStyle = "rgba(95, 75, 55, 0.35)";
  ctx.lineWidth = w * 0.002;
  ctx.beginPath();
  ctx.moveTo(0, y + (r() - 0.5) * 4);
  ctx.lineTo(w, y + (r() - 0.5) * 4);
  ctx.stroke();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(255, 245, 225, 0.25)";
  ctx.lineWidth = w * 0.004;
  ctx.beginPath();
  ctx.moveTo(0, y + w * 0.004);
  ctx.lineTo(w, y + w * 0.004);
  ctx.stroke();
  ctx.restore();
}

export function coffeeRing(ctx: Ctx, x: number, y: number, rad: number, r: Rng) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `rgba(130, 85, 45, ${0.1 + r() * 0.12})`;
    ctx.lineWidth = rad * (0.03 + r() * 0.05);
    ctx.beginPath();
    const start = r() * Math.PI * 2;
    ctx.ellipse(x + (r() - 0.5) * rad * 0.06, y, rad * (1 + r() * 0.03), rad * (0.97 + r() * 0.04), 0, start, start + Math.PI * (1.2 + r() * 0.8));
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(x, y, rad * 0.2, x, y, rad);
  g.addColorStop(0, "rgba(150, 100, 55, 0.0)");
  g.addColorStop(0.85, "rgba(150, 100, 55, 0.05)");
  g.addColorStop(1, "rgba(150, 100, 55, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// --- ink ----------------------------------------------------------------------

/**
 * Monospaced typewriter text: every strike lands a little off the baseline,
 * with uneven ink and the odd double strike. Returns the advance width.
 */
export function typeLine(ctx: Ctx, text: string, x: number, y: number, size: number, font: string, r: Rng, color = INK, weight = "400") {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textBaseline = "alphabetic";
  const adv = ctx.measureText("M").width;
  let cx = x;
  for (const ch of text) {
    if (ch !== " ") {
      const dx = (r() - 0.5) * size * 0.05;
      const dy = (r() - 0.5) * size * 0.07;
      const rot = (r() - 0.5) * 0.035;
      ctx.save();
      ctx.globalAlpha = 0.72 + r() * 0.28;
      ctx.fillStyle = color;
      ctx.translate(cx + dx, y + dy);
      ctx.rotate(rot);
      ctx.fillText(ch, 0, 0);
      if (r() < 0.12) {
        ctx.globalAlpha *= 0.35;
        ctx.fillText(ch, size * 0.03, size * 0.02);
      }
      ctx.restore();
    }
    cx += adv;
  }
  ctx.restore();
  return cx - x;
}

/** Proportional typewriter face for headings, each glyph struck separately. */
export function typeHeading(ctx: Ctx, text: string, x: number, y: number, size: number, font: string, r: Rng, color = INK, align: "left" | "center" = "left") {
  ctx.save();
  ctx.font = `${size}px ${font}`;
  const total = ctx.measureText(text).width + text.length * size * 0.04;
  let cx = align === "center" ? x - total / 2 : x;
  for (const ch of text) {
    const w = ctx.measureText(ch).width + size * 0.04;
    if (ch !== " ") {
      ctx.save();
      ctx.globalAlpha = 0.78 + r() * 0.22;
      ctx.fillStyle = color;
      ctx.translate(cx + (r() - 0.5) * size * 0.03, y + (r() - 0.5) * size * 0.06);
      ctx.rotate((r() - 0.5) * 0.03);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    }
    cx += w;
  }
  ctx.restore();
  return total;
}

/** Monospace block sized so the longest line fits `maxW`. */
function typeBlock(ctx: Ctx, lines: readonly string[], x: number, y: number, maxW: number, baseSize: number, lineH: number, fonts: Fonts, r: Rng) {
  const longest = Math.max(1, ...lines.map((l) => l.length));
  ctx.font = `${baseSize}px ${fonts.mono}`;
  const advRatio = ctx.measureText("M").width / baseSize;
  const size = Math.min(baseSize, maxW / (longest * advRatio));
  lines.forEach((line, i) => typeLine(ctx, line, x, y + i * size * lineH, size, fonts.mono, r));
  return size;
}

/** Handwriting with a slight slope and pressure variation per word. */
export function handLine(ctx: Ctx, text: string, x: number, y: number, size: number, font: string, r: Rng, color: string, slope = -0.02, align: "left" | "center" = "left", weight = "700") {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textBaseline = "alphabetic";
  const width = ctx.measureText(text).width;
  ctx.translate(align === "center" ? x - width / 2 : x, y);
  ctx.rotate(slope);
  let cx = 0;
  for (const word of text.split(/(\s+)/)) {
    const w = ctx.measureText(word).width;
    if (word.trim()) {
      ctx.globalAlpha = 0.82 + r() * 0.18;
      ctx.fillStyle = color;
      ctx.fillText(word, cx, (r() - 0.5) * size * 0.06);
    }
    cx += w;
  }
  ctx.restore();
  return width;
}

/** Rubber stamp with a double border, ink pooling and worn-out gaps. */
export function stamp(ctx: Ctx, text: string, cx: number, cy: number, size: number, angle: number, font: string, r: Rng) {
  ctx.font = `${size}px ${font}`;
  const tw = ctx.measureText(text).width + text.length * size * 0.06;
  const pad = size * 0.35;
  const { c, ctx: s } = canvas(tw + pad * 2 + size * 0.4, size * 1.9);
  const w = c.width;
  const h = c.height;
  s.strokeStyle = STAMP_RED;
  s.fillStyle = STAMP_RED;
  s.lineWidth = size * 0.09;
  s.strokeRect(size * 0.12, size * 0.12, w - size * 0.24, h - size * 0.24);
  s.lineWidth = size * 0.035;
  s.strokeRect(size * 0.26, size * 0.26, w - size * 0.52, h - size * 0.52);
  s.font = `${size}px ${font}`;
  s.textBaseline = "middle";
  let x = (w - tw) / 2;
  for (const ch of text) {
    s.fillText(ch, x, h / 2 + size * 0.06);
    s.fillText(ch, x + size * 0.015, h / 2 + size * 0.07);
    x += s.measureText(ch).width + size * 0.06;
  }
  // Wear: speckled gaps where the rubber didn't touch, plus a dry band.
  s.globalCompositeOperation = "destination-out";
  for (let i = 0; i < w * h * 0.004; i++) {
    s.globalAlpha = 0.3 + r() * 0.7;
    s.beginPath();
    s.arc(r() * w, r() * h, size * (0.006 + r() * r() * 0.05), 0, Math.PI * 2);
    s.fill();
  }
  const dry = s.createLinearGradient(0, 0, w, h * 0.4);
  dry.addColorStop(0, "rgba(0,0,0,0)");
  dry.addColorStop(0.6 + r() * 0.2, "rgba(0,0,0,0.0)");
  dry.addColorStop(1, "rgba(0,0,0,0.55)");
  s.globalAlpha = 1;
  s.fillStyle = dry;
  s.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.86;
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.drawImage(c, -w / 2, -h / 2);
  ctx.restore();
}

export function grain(ctx: Ctx, x: number, y: number, w: number, h: number, amount: number, r: Rng) {
  const { c, ctx: g } = canvas(256, 256);
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (r() - 0.5) * 255 * amount;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = ctx.createPattern(c, "repeat")!;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/** A Gem clip: one steel wire bent into three nested loops. */
export function paperclip(ctx: Ctx, x: number, y: number, len: number, angle: number) {
  const a = len * 0.14;
  const b = a * 0.58;
  const R = (a + b) / 2;
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-b, len * 0.42);
    ctx.lineTo(-b, b);
    ctx.arc(0, b, b, Math.PI, 0);
    ctx.lineTo(b, len - R);
    ctx.arc((b - a) / 2, len - R, R, 0, Math.PI);
    ctx.lineTo(-a, a);
    ctx.arc(0, a, a, Math.PI, 0);
    ctx.lineTo(a, len * 0.72);
  };
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // Contact shadow, the steel wire, then a specular streak along it.
  ctx.save();
  ctx.translate(len * 0.02, len * 0.03);
  ctx.strokeStyle = "rgba(20,12,5,0.3)";
  ctx.lineWidth = len * 0.05;
  ctx.filter = `blur(${len * 0.012}px)`;
  path();
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = "#7c8086";
  ctx.lineWidth = len * 0.032;
  path();
  ctx.stroke();
  ctx.translate(-len * 0.005, -len * 0.004);
  ctx.strokeStyle = "rgba(235,238,242,0.7)";
  ctx.lineWidth = len * 0.01;
  path();
  ctx.stroke();
  ctx.restore();
}

// --- card faces -----------------------------------------------------------------

type Assets = {
  paper: HTMLImageElement;
  manila: HTMLImageElement;
  images: Map<string, HTMLImageElement>;
  fonts: Fonts;
};

function size(card: CaseCard) {
  const [w, h] = cardSize(card);
  // Prints carry screenshots, so they get the sharpest texture.
  const long = card.kind === "photo" ? 1600 : card.kind === "note" ? 1024 : 1280;
  const k = long / Math.max(w, h);
  return [Math.round(w * k), Math.round(h * k)] as const;
}

function drawDossier(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#efe3c9", r, 1.1);
  crease(ctx, w, h * 0.34, r);
  coffeeRing(ctx, w * 0.8, h * 0.86, w * 0.13, r);

  const m = w * 0.08;
  typeHeading(ctx, CASE_NUMBER, m, m * 0.9, w * 0.032, fonts.type, r, "#4a3f35");
  typeHeading(ctx, "DEPT. OF WEB INVESTIGATIONS", w - m - w * 0.42, m * 0.9, w * 0.026, fonts.type, r, "#4a3f35");
  ctx.fillStyle = "rgba(40,30,25,0.6)";
  ctx.fillRect(m, m * 1.15, w - m * 2, w * 0.0025);

  // Photo, clipped on at the top left.
  const px = m;
  const py = h * 0.12;
  const pw = w * 0.34;
  const ph = pw * 1.25;
  const img = card.face.image ? a.images.get(card.face.image) : undefined;
  ctx.save();
  ctx.translate(px + pw / 2, py + ph / 2);
  ctx.rotate(-0.035);
  ctx.shadowColor = "rgba(30,20,10,0.45)";
  ctx.shadowBlur = w * 0.012;
  ctx.shadowOffsetY = w * 0.004;
  ctx.fillStyle = "#e9e5dc";
  ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
  ctx.shadowColor = "transparent";
  const b = pw * 0.05;
  const bg = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2);
  bg.addColorStop(0, "#8d8a85");
  bg.addColorStop(1, "#4c4a47");
  ctx.fillStyle = bg;
  ctx.fillRect(-pw / 2 + b, -ph / 2 + b, pw - b * 2, ph - b * 2);
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(-pw / 2 + b, -ph / 2 + b, pw - b * 2, ph - b * 2);
    ctx.clip();
    ctx.filter = "grayscale(1) contrast(1.1) brightness(0.95)";
    // Cover-fit into the frame, anchored to the bottom so the shoulders stay in shot.
    const fw = pw - b * 2;
    const fh = ph - b * 2;
    const k = Math.max(fw / img.width, fh / img.height);
    const iw = img.width * k;
    const ih = img.height * k;
    ctx.drawImage(img, -iw / 2, fh / 2 - ih, iw, ih);
    ctx.filter = "none";
    ctx.restore();
  }
  grain(ctx, -pw / 2 + b, -ph / 2 + b, pw - b * 2, ph - b * 2, 0.35, r);
  // Height chart ticks on the mugshot border.
  ctx.fillStyle = "rgba(20,20,20,0.5)";
  for (let i = 0; i < 9; i++) ctx.fillRect(-pw / 2 + b, -ph / 2 + b + (i + 1) * (ph - b * 2) / 10, pw * (i % 2 ? 0.04 : 0.07), w * 0.002);
  ctx.restore();
  paperclip(ctx, px + pw * 0.62, py - h * 0.03, h * 0.11, 0.08);

  // Header fields to the right of the photo.
  const fx = px + pw + w * 0.05;
  const fw = w - fx - m;
  const [name, ...rest] = card.face.heading.split(": ");
  typeHeading(ctx, rest.length ? `${name}:` : "", fx, py + h * 0.04, w * 0.034, fonts.type, r, "#3d342c");
  const nameText = rest.join(": ") || name;
  const nameSize = Math.min(w * 0.058, fw / (nameText.length * 0.55));
  typeHeading(ctx, nameText, fx, py + h * 0.04 + nameSize * 1.25, nameSize, fonts.type, r);
  if (card.face.subheading) typeHeading(ctx, card.face.subheading, fx, py + h * 0.04 + nameSize * 2.3, w * 0.034, fonts.type, r, "#3d342c");
  handLine(ctx, "the one we want", fx + fw * 0.08, py + ph * 0.86, w * 0.05, fonts.hand, r, "#26335a", -0.06);
  // Underline it like an investigator would.
  ctx.save();
  ctx.strokeStyle = "rgba(38,51,90,0.85)";
  ctx.lineWidth = w * 0.004;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(fx + fw * 0.06, py + ph * 0.9);
  ctx.quadraticCurveTo(fx + fw * 0.5, py + ph * 0.86, fx + fw * 0.92, py + ph * 0.83);
  ctx.stroke();
  ctx.restore();

  // Body: typed record lines on ruled fields.
  const by = py + ph + h * 0.07;
  const lines = card.face.lines ?? [];
  const lh = (h * 0.88 - by) / Math.max(lines.length, 1);
  const size = typeBlock(ctx, lines, m, by, w - m * 2, w * 0.034, lh / (w * 0.034), fonts, r);
  ctx.fillStyle = "rgba(60,50,40,0.22)";
  lines.forEach((_, i) => ctx.fillRect(m, by + i * lh + size * 0.35, w - m * 2, w * 0.0018));

  if (card.face.stamp) stamp(ctx, card.face.stamp, w * 0.62, h * 0.47, w * 0.075, -0.16, fonts.type, r);
}

function drawSheet(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f1e7d0", r, 0.9);
  crease(ctx, w, h * 0.66, r);
  // Punch holes on the left margin.
  for (const y of [0.18, 0.5, 0.82]) {
    const g = ctx.createRadialGradient(w * 0.045, h * y, 0, w * 0.045, h * y, w * 0.022);
    g.addColorStop(0, "rgba(25,18,12,0.95)");
    g.addColorStop(0.8, "rgba(25,18,12,0.85)");
    g.addColorStop(1, "rgba(25,18,12,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(w * 0.045, h * y, w * 0.022, 0, Math.PI * 2);
    ctx.fill();
  }
  const m = w * 0.11;
  typeHeading(ctx, CASE_NUMBER, w - m - w * 0.3, h * 0.06, w * 0.026, fonts.type, r, "#4a3f35");
  typeHeading(ctx, card.face.heading, m, h * 0.14, w * 0.062, fonts.type, r);
  ctx.fillStyle = "rgba(30,25,20,0.65)";
  ctx.fillRect(m, h * 0.165, w - m * 1.6, w * 0.003);
  const lines = card.face.lines ?? [];
  typeBlock(ctx, lines, m, h * 0.24, w - m * 1.6, w * 0.032, 2.05, fonts, r);
  handLine(ctx, "solid track record", w * 0.42, h * 0.86, w * 0.055, fonts.hand, r, "#26335a", -0.04);
  // Margin tick marks next to the internships.
  ctx.save();
  ctx.strokeStyle = "rgba(150,30,25,0.7)";
  ctx.lineWidth = w * 0.004;
  ctx.lineCap = "round";
  for (const i of [1, 3, 5]) {
    const y = h * 0.24 + i * w * 0.032 * 2.05 - w * 0.012;
    ctx.beginPath();
    ctx.moveTo(m * 0.62, y);
    ctx.lineTo(m * 0.7, y + w * 0.012);
    ctx.lineTo(m * 0.86, y - w * 0.016);
    ctx.stroke();
  }
  ctx.restore();
}

/** Greedy word wrap to a fixed number of monospace characters. */
function wrap(text: string, chars: number) {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && line.length + 1 + word.length > chars) {
      out.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  return out;
}

/** A typed project report: name, tagline, findings as bullets, the stack and the live address. */
function drawReport(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f2e9d6", r, 0.8);
  crease(ctx, w, h * 0.5, r);
  const m = w * 0.09;
  typeHeading(ctx, CASE_NUMBER, m, h * 0.06, w * 0.03, fonts.type, r, "#4a3f35");
  typeHeading(ctx, "PROJECT REPORT", m, h * 0.095, w * 0.03, fonts.type, r, "#4a3f35");
  const heading = card.face.heading;
  const hs = Math.min(w * 0.085, (w - m * 2) / (heading.length * 0.62));
  typeHeading(ctx, heading, m, h * 0.17, hs, fonts.type, r);
  ctx.fillStyle = "rgba(30,25,20,0.7)";
  ctx.fillRect(m, h * 0.17 + hs * 0.35, w - m * 2, w * 0.004);

  // Findings first, the stack as a last typed line; shrink the type until it all fits.
  const all = card.face.lines ?? [];
  const findings = all.filter((l) => !l.startsWith("STACK:"));
  const stack = all.find((l) => l.startsWith("STACK:"));
  ctx.font = `100px ${fonts.mono}`;
  const adv = ctx.measureText("M").width / 100;
  const top = h * 0.25;
  const bottom = h * 0.86;
  let fs = w * 0.034;
  let rows: { text: string; indent: boolean; gap: number; tone?: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const chars = Math.floor((w - m * 2) / (fs * adv));
    rows = [];
    if (card.face.subheading) wrap(card.face.subheading, chars).forEach((t) => rows.push({ text: t, indent: false, gap: 0, tone: "#3a332c" }));
    rows.push({ text: "FINDINGS:", indent: false, gap: 0.7 });
    for (const f of findings) wrap(f, chars - 2).forEach((t, j) => rows.push({ text: t, indent: true, gap: j ? 0 : 0.35 }));
    if (stack) wrap(stack, chars).forEach((t, j) => rows.push({ text: t, indent: false, gap: j ? 0 : 0.7, tone: "#3a332c" }));
    const height = rows.reduce((acc, row) => acc + fs * (1.45 + row.gap), 0);
    if (height <= bottom - top) break;
    fs *= 0.94;
  }
  let y = top;
  for (const row of rows) {
    y += fs * (1.45 + row.gap);
    // A dash opens each finding; its wrapped lines hang under the text.
    if (row.indent && row.gap > 0) typeLine(ctx, "-", m, y, fs, fonts.mono, r);
    typeLine(ctx, row.text, row.indent ? m + fs * adv * 2 : m, y, fs, fonts.mono, r, row.tone ?? INK);
  }

  paperclip(ctx, w * 0.52, -h * 0.015, h * 0.12, -0.1);
  if (card.face.stamp) stamp(ctx, card.face.stamp, w * 0.73, h * 0.085, w * 0.055, 0.12, fonts.type, r);
  if (card.face.caption) {
    const text = `live: ${card.face.caption}`;
    const cs = Math.min(w * 0.058, (w - m * 2) / (text.length * 0.42));
    const tw = handLine(ctx, text, m, h * 0.935, cs, fonts.hand, r, "#26335a", -0.025);
    ctx.save();
    ctx.strokeStyle = "rgba(38,51,90,0.8)";
    ctx.lineWidth = w * 0.0035;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(m, h * 0.955);
    ctx.quadraticCurveTo(m + tw * 0.5, h * 0.948, m + tw, h * 0.94);
    ctx.stroke();
    ctx.restore();
  }
}

/** Pixel rectangle of the picture on a print: inside the white border, never cropped. */
function photoRect(card: CaseCard, w: number, h: number) {
  const [cw] = cardSize(card);
  const k = w / cw;
  const x = PHOTO_BORDER.side * k;
  const y = PHOTO_BORDER.top * k;
  return { x, y, w: w - x * 2, h: h - y - PHOTO_BORDER.bottom * k, k };
}

/** A photo print: the whole picture inside a white border, captioned in pen underneath. */
function drawPhoto(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f4f0e6", r, 0.35);
  const p = photoRect(card, w, h);
  // Night backdrop for cut-outs like the MewBit character.
  const bg = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
  bg.addColorStop(0, "#1b1730");
  bg.addColorStop(1, "#07060f");
  ctx.fillStyle = bg;
  ctx.fillRect(p.x, p.y, p.w, p.h);
  const img = card.face.image ? a.images.get(card.face.image) : undefined;
  if (img) {
    // Contain-fit: the print is sized to the picture, so this fills it without cutting anything off.
    const s = Math.min(p.w / img.width, p.h / img.height);
    const iw = img.width * s;
    const ih = img.height * s;
    ctx.save();
    ctx.filter = "saturate(0.92) contrast(1.03)";
    ctx.drawImage(img, p.x + (p.w - iw) / 2, p.y + (p.h - ih) / 2, iw, ih);
    ctx.restore();
  }
  // A faint warm cast and grain, light enough to keep screenshots legible.
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "rgb(252, 244, 230)";
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.restore();
  grain(ctx, p.x, p.y, p.w, p.h, 0.12, r);
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = w * 0.002;
  ctx.strokeRect(p.x, p.y, p.w, p.h);

  // Bottom margin: exhibit number typed on the right, the caption in pen on the left.
  const band = h - p.y - p.h;
  const base = p.y + p.h + band * 0.64;
  const ls = band * 0.24;
  ctx.font = `${ls}px ${fonts.type}`;
  const lw = ctx.measureText(card.face.heading).width + card.face.heading.length * ls * 0.04;
  typeHeading(ctx, card.face.heading, w - p.x - lw, base, ls, fonts.type, r, "#4a3f35");
  if (card.face.caption) {
    const room = w - p.x * 2 - lw - band * 0.4;
    ctx.font = `700 100px ${fonts.hand}`;
    const cs = Math.min(band * 0.5, (room / ctx.measureText(card.face.caption).width) * 100);
    handLine(ctx, card.face.caption, p.x * 1.4, base, cs, fonts.hand, r, "#1b1f2e", -0.015);
  }
}

function drawIndex(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f6f1e4", r, 0.7);
  const top = h * 0.22;
  const step = (h - top) / 7.2;
  ctx.fillStyle = "rgba(70, 110, 170, 0.45)";
  for (let y = top + step; y < h - step * 0.3; y += step) ctx.fillRect(0, y, w, h * 0.004);
  ctx.fillStyle = "rgba(190, 50, 50, 0.6)";
  ctx.fillRect(0, top, w, h * 0.006);
  const m = w * 0.06;
  typeHeading(ctx, card.face.heading, m, top - h * 0.06, h * 0.085, fonts.type, r);
  const lines = card.face.lines ?? [];
  typeBlock(ctx, lines, m, top + step * 0.82, w - m * 2, h * 0.06, step / (h * 0.06), fonts, r);
  // Underline the differentiator in red pencil.
  ctx.save();
  ctx.strokeStyle = "rgba(170, 35, 30, 0.75)";
  ctx.lineWidth = h * 0.007;
  ctx.lineCap = "round";
  const y = top + step * 0.82 + step * 4 + h * 0.015;
  ctx.beginPath();
  ctx.moveTo(m, y);
  ctx.bezierCurveTo(w * 0.3, y + h * 0.008, w * 0.6, y - h * 0.006, w * 0.82, y + h * 0.004);
  ctx.stroke();
  ctx.restore();
}

function drawManila(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.manila, "#e3c48c", r, 1);
  const m = w * 0.08;
  // Printed form box.
  ctx.strokeStyle = "rgba(70, 45, 20, 0.55)";
  ctx.lineWidth = w * 0.004;
  ctx.strokeRect(m * 0.6, m * 0.6, w - m * 1.2, h - m * 1.2);
  typeHeading(ctx, card.face.heading, m, h * 0.2, h * 0.085, fonts.type, r);
  const lines = card.face.lines ?? [];
  const contact = lines.slice(0, lines.indexOf(""));
  const tail = lines.slice(lines.indexOf("") + 1);
  typeBlock(ctx, contact, m, h * 0.37, w - m * 2, h * 0.072, 1.6, fonts, r);
  tail.forEach((line, i) => handLine(ctx, line, m * 1.1, h * 0.76 + i * h * 0.1, h * 0.085, fonts.hand, r, "#26335a", -0.025));
}

function drawNote(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#efe0a4", r, 0.6);
  // Torn top edge: everything above a ragged line becomes transparent.
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  let y = h * 0.045;
  for (let x = 0; x <= w; x += w / 90) {
    y = Math.max(h * 0.012, Math.min(h * 0.075, y + (r() - 0.5) * h * 0.02));
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "rgba(120, 140, 170, 0.35)";
  for (let ly = h * 0.28; ly < h * 0.95; ly += h * 0.13) ctx.fillRect(0, ly, w, h * 0.004);
  handLine(ctx, card.face.heading, w * 0.1, h * 0.24, h * 0.19, fonts.hand, r, "#1a2346", -0.05);
  (card.face.lines ?? []).forEach((line, i) =>
    handLine(ctx, line, w * 0.12, h * (0.5 + i * 0.17), h * 0.14, fonts.hand, r, "#1a2346", -0.04, "left", "500"),
  );
}

/** A typed résumé page: "# " lines open a section, the rest is set in mono. */
function drawCv(card: CaseCard, a: Assets, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f4eedf", r, 0.55);
  crease(ctx, w, h * 0.34, r);
  crease(ctx, w, h * 0.67, r);
  const m = w * 0.1;
  typeHeading(ctx, "CURRICULUM VITAE", m, h * 0.075, w * 0.03, fonts.type, r, "#4a3f35");
  typeHeading(ctx, card.face.heading, m, h * 0.135, w * 0.078, fonts.type, r);
  if (card.face.subheading) typeLine(ctx, card.face.subheading, m, h * 0.17, w * 0.027, fonts.mono, r, "#3a332c");
  if (card.face.caption) typeLine(ctx, card.face.caption, m, h * 0.195, w * 0.022, fonts.mono, r, "#4a3f35");
  ctx.fillStyle = "rgba(30,25,20,0.7)";
  ctx.fillRect(m, h * 0.212, w - m * 2, w * 0.004);

  const lines = card.face.lines ?? [];
  const body = lines.filter((l) => !l.startsWith("# "));
  ctx.font = `${w * 0.03}px ${fonts.mono}`;
  const adv = ctx.measureText("M").width / (w * 0.03);
  const size = Math.min(w * 0.027, (w - m * 2) / (Math.max(...body.map((l) => l.length)) * adv));
  const heads = lines.length - body.length;
  // Fit the block between the rule and the handwritten note.
  const lineH = Math.min(size * 1.75, (h * 0.6) / (body.length + heads * 1.9));
  let y = h * 0.215;
  for (const line of lines) {
    if (line.startsWith("# ")) {
      y += lineH * 1.5;
      typeHeading(ctx, line.slice(2), m, y, size * 1.12, fonts.type, r, "#2a2420");
      ctx.fillStyle = "rgba(30,25,20,0.35)";
      ctx.fillRect(m, y + size * 0.35, w * 0.25, w * 0.002);
      y += lineH * 0.4;
    } else {
      y += lineH;
      typeLine(ctx, line, m, y, size, fonts.mono, r);
    }
  }
  paperclip(ctx, w * 0.84, -h * 0.012, h * 0.14, 0.12);
  if (card.face.stamp) stamp(ctx, card.face.stamp, w * 0.72, h * 0.13, w * 0.055, -0.16, fonts.type, r);
  handLine(ctx, "full CV -> marczelloo.dev/cv", w * 0.5, h * 0.935, w * 0.052, fonts.hand, r, "#26335a", -0.03, "center");
}

const DRAW = {
  dossier: drawDossier,
  sheet: drawSheet,
  report: drawReport,
  photo: drawPhoto,
  index: drawIndex,
  manila: drawManila,
  note: drawNote,
  cv: drawCv,
} as const;

function drawBack(card: CaseCard, a: Assets, front: HTMLCanvasElement, ctx: Ctx, w: number, h: number, r: Rng) {
  const { fonts } = a;
  if (card.kind === "photo") {
    ctx.fillStyle = "#24221f";
    ctx.fillRect(0, 0, w, h);
    grain(ctx, 0, 0, w, h, 0.25, r);
  } else {
    paper(ctx, w, h, card.kind === "manila" ? a.manila : a.paper, card.kind === "manila" ? "#e3c48c" : card.kind === "note" ? "#efe0a4" : "#efe5cf", r, 0.8);
    // Ink bleeding through from the front, mirrored.
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.globalCompositeOperation = "multiply";
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.filter = `blur(${w * 0.002}px)`;
    ctx.drawImage(front, 0, 0);
    ctx.restore();
  }
  if (card.kind === "note") {
    // Keep the torn edge on the back too (the texture is mirrored horizontally).
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(front, 0, 0);
    ctx.restore();
  }
  if (!card.back) return;

  const m = w * 0.1;
  if (card.kind === "photo") {
    // Typed sticker on the dark print back, sized to fit wide and tall prints alike.
    const lx = w * 0.08;
    const ly = h * 0.1;
    const lw = w * 0.84;
    const lh = h * 0.66;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = w * 0.015;
    ctx.fillStyle = "#e9e1cc";
    ctx.fillRect(lx, ly, lw, lh);
    ctx.restore();
    const unit = Math.min(lw * 0.05, lh / (card.back.lines.length * 1.7 + 3));
    typeHeading(ctx, card.back.heading, lx + lw * 0.07, ly + unit * 1.8, unit * 1.2, fonts.type, r);
    typeBlock(ctx, card.back.lines, lx + lw * 0.07, ly + unit * 3.8, lw * 0.86, unit, 1.7, fonts, r);
    handLine(ctx, "photo: M.M.", w * 0.55, h * 0.92, Math.min(w * 0.07, h * 0.1), fonts.hand, r, "#d8d2c4", -0.03);
    return;
  }
  typeHeading(ctx, card.back.heading, m, h * 0.12, w * 0.05, fonts.type, r);
  ctx.fillStyle = "rgba(30,25,20,0.55)";
  ctx.fillRect(m, h * 0.135, w - m * 2, w * 0.0025);
  card.back.lines.forEach((line, i) =>
    handLine(ctx, line, m, h * 0.22 + i * h * 0.075, w * 0.052, fonts.hand, r, "#26335a", -0.012, "left", "500"),
  );
}

/** Matte paper border, glossy picture. */
function photoRoughness(card: CaseCard, w: number, h: number) {
  const { c, ctx } = canvas(w / 4, h / 4);
  ctx.fillStyle = "rgb(225,225,225)";
  ctx.fillRect(0, 0, c.width, c.height);
  const p = photoRect(card, w, h);
  ctx.fillStyle = "rgb(70,70,70)";
  ctx.fillRect(p.x / 4, p.y / 4, p.w / 4, p.h / 4);
  return c;
}

let cache: Promise<Map<string, CardFace>> | null = null;

/** Paints every card face once; textures are shared for the page lifetime. */
export function loadCardFaces(maxAnisotropy: number) {
  cache ??= (async () => {
    const imageSrcs = [...new Set(CARDS.map((c) => c.face.image).filter((s): s is string => !!s))];
    const [fonts, paperScan, manilaScan, ...imgs] = await Promise.all([
      loadFonts(),
      loadImage("/case/tex/paper_diff.jpg"),
      loadImage("/case/tex/manila_diff.jpg"),
      ...imageSrcs.map(loadImage),
    ]);
    const assets: Assets = { paper: paperScan, manila: manilaScan, fonts, images: new Map(imageSrcs.map((s, i) => [s, imgs[i]])) };
    const aniso = Math.min(8, maxAnisotropy);
    const tex = (c: HTMLCanvasElement, srgb = true) => {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = aniso;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      return t;
    };

    const out = new Map<string, CardFace>();
    for (const card of CARDS) {
      const [w, h] = size(card);
      const r = seeded(card.id);
      const front = canvas(w, h);
      DRAW[card.kind](card, assets, front.ctx, w, h, r);
      const back = canvas(w, h);
      drawBack(card, assets, front.c, back.ctx, w, h, r);
      const backTex = tex(back.c);
      // The back is seen from behind, which mirrors u; flip it back.
      backTex.wrapS = THREE.RepeatWrapping;
      backTex.repeat.x = -1;
      backTex.offset.x = 1;
      out.set(card.id, {
        map: tex(front.c),
        back: backTex,
        roughness: card.kind === "photo" ? tex(photoRoughness(card, w, h), false) : undefined,
      });
      // Yield between cards so painting doesn't freeze the loader animation.
      await new Promise((res) => setTimeout(res, 0));
    }
    return out;
  })();
  return cache;
}
