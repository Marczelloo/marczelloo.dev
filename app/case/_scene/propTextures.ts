import * as THREE from "three";
import {
  type Ctx,
  type Fonts,
  type Rng,
  canvas,
  coffeeRing,
  crease,
  grain,
  handLine,
  loadFonts,
  loadImage,
  paper,
  seeded,
  stamp,
  typeHeading,
  typeLine,
} from "./cardTextures";

// Faces for the clutter around the cards: a newspaper clipping, a street map,
// a fingerprint record, a diner receipt, sticky notes, a matchbook, a floppy
// label and tape. Painted once like the card faces, from the same helpers.

const SERIF = "Georgia, 'Times New Roman', serif";
const PEN = "#1b1f3a";
const MARKER_RED = "rgba(168, 28, 24, 0.88)";

type Edge = { mode: "torn" | "cut" | "zigzag"; depth: number; step?: number };

/** Cuts the sheet's outline: everything outside a ragged edge on each given side becomes transparent. */
function cutEdges(ctx: Ctx, w: number, h: number, r: Rng, edges: { top?: Edge; right?: Edge; bottom?: Edge; left?: Edge }) {
  const walk = (e: Edge | undefined, len: number) => {
    const out: number[] = [];
    if (!e) {
      for (let i = 0; i <= 1; i++) out.push(0);
      return { pts: out, step: len };
    }
    const step = e.step ?? (e.mode === "torn" ? len / 140 : e.mode === "zigzag" ? len / 34 : len / 30);
    const n = Math.ceil(len / step);
    let d = e.depth * 0.5;
    const phase = r() * 6;
    for (let i = 0; i <= n; i++) {
      if (e.mode === "zigzag") d = i % 2 ? e.depth : e.depth * 0.15;
      else if (e.mode === "torn") d = Math.max(0, Math.min(e.depth, d + (r() - 0.5) * e.depth * 0.55));
      else d = e.depth * (0.5 + 0.35 * Math.sin(i * 0.4 + phase) + (r() - 0.5) * 0.2);
      out.push(d);
    }
    return { pts: out, step: len / n };
  };
  const top = walk(edges.top, w);
  const right = walk(edges.right, h);
  const bottom = walk(edges.bottom, w);
  const left = walk(edges.left, h);

  ctx.beginPath();
  top.pts.forEach((d, i) => ctx.lineTo(Math.min(w, i * top.step), d));
  right.pts.forEach((d, i) => ctx.lineTo(w - d, Math.min(h, i * right.step)));
  bottom.pts.forEach((d, i) => ctx.lineTo(Math.max(0, w - i * bottom.step), h - d));
  left.pts.forEach((d, i) => ctx.lineTo(d, Math.max(0, h - i * left.step)));
  ctx.closePath();
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.fill();
  // Torn paper shows its lighter fibres along the edge.
  ctx.globalCompositeOperation = "source-atop";
  ctx.strokeStyle = "rgba(250, 245, 232, 0.45)";
  ctx.lineWidth = Math.min(w, h) * 0.008;
  ctx.stroke();
  ctx.restore();
}

/** A vertical fold, drawn as a rotated horizontal crease. */
function vCrease(ctx: Ctx, h: number, x: number, r: Rng) {
  ctx.save();
  ctx.translate(x, 0);
  ctx.rotate(Math.PI / 2);
  crease(ctx, h, 0, r);
  ctx.restore();
}

/** Justified newspaper column. Returns the y where the text stopped. */
function column(ctx: Ctx, words: string[], x: number, y: number, colW: number, size: number, maxY: number, r: Rng, start = 0) {
  ctx.save();
  ctx.font = `${size}px ${SERIF}`;
  ctx.fillStyle = "#26231f";
  const space = ctx.measureText(" ").width;
  let i = start;
  while (y < maxY) {
    const line: string[] = [];
    let width = 0;
    while (true) {
      const word = words[i % words.length];
      const ww = ctx.measureText(word).width;
      if (line.length && width + space + ww > colW) break;
      width += (line.length ? space : 0) + ww;
      line.push(word);
      i++;
    }
    const gap = line.length > 1 ? (colW - width) / (line.length - 1) + space : space;
    let cx = x;
    for (const word of line) {
      ctx.globalAlpha = 0.7 + r() * 0.3;
      ctx.fillText(word, cx, y);
      cx += ctx.measureText(word).width + gap;
    }
    y += size * 1.22;
  }
  ctx.restore();
  return i;
}

/** A surveillance photo, cover-fitted and printed as a coarse halftone screen. */
function halftonePhoto(ctx: Ctx, x: number, y: number, pw: number, ph: number, photo: HTMLImageElement) {
  const { ctx: p } = canvas(pw, ph);
  const k = Math.max(pw / photo.width, ph / photo.height);
  // A night shot is mostly shadow; lift it hard so the dots keep the lit window readable.
  p.filter = "grayscale(1) brightness(1.8) contrast(1.3)";
  p.drawImage(photo, (pw - photo.width * k) / 2, (ph - photo.height * k) / 2, photo.width * k, photo.height * k);

  const data = p.getImageData(0, 0, pw, ph).data;
  const cell = Math.max(3, pw / 170);
  ctx.save();
  ctx.fillStyle = "#1f1d1a";
  ctx.globalAlpha = 0.9;
  for (let cy = cell / 2; cy < ph; cy += cell) {
    for (let cx = cell / 2; cx < pw; cx += cell) {
      const k = (Math.floor(cy) * pw + Math.floor(cx)) * 4;
      const lum = Math.sqrt((data[k] * 0.3 + data[k + 1] * 0.59 + data[k + 2] * 0.11) / 255);
      const rad = cell * 0.62 * Math.sqrt(1 - lum);
      if (rad < 0.3) continue;
      ctx.beginPath();
      ctx.arc(x + cx, y + cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

const STORY =
  `SOSNOWIEC - Residents of the city centre were left stunned late Friday when a local developer, known to colleagues only as "M.", merged an unreviewed branch straight into production minutes before the weekend. Sources close to the investigation confirm the build passed. "We kept waiting for the pager to go off," said one witness, who asked not to be named. "It never did." Officers found no rollback, no hotfix and no apology at the scene - only a cold cup of coffee and a commit message reading "small fix". The suspect remains at large and is believed to be looking for work. Recruiters are advised to approach with an offer.`.split(
    " ",
  );

function drawNewspaper(ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) {
  paper(ctx, w, h, a.paper, "#ddd3bb", r, 0.55);
  grain(ctx, 0, 0, w, h, 0.12, r);
  const m = w * 0.07;
  ctx.fillStyle = "#26231f";
  ctx.font = `700 ${w}px ${SERIF}`;
  const head = Math.min(w * 0.098, (w * 0.9 * w) / ctx.measureText("TO MAIN ON FRIDAY").width);
  ctx.font = `700 ${head}px ${SERIF}`;
  ctx.textAlign = "center";
  ctx.fillText("LOCAL DEV PUSHES", w / 2, h * 0.1);
  ctx.fillText("TO MAIN ON FRIDAY", w / 2, h * 0.18);
  ctx.font = `italic ${w * 0.037}px ${SERIF}`;
  ctx.fillText("Production survives the night; witnesses describe", w / 2, h * 0.225);
  ctx.fillText("“a calm, almost reckless confidence”", w / 2, h * 0.255);
  ctx.textAlign = "left";
  ctx.fillRect(m, h * 0.272, w - m * 2, h * 0.002);

  const py = h * 0.29;
  const ph = h * 0.27;
  halftonePhoto(ctx, m, py, Math.round(w - m * 2), Math.round(ph), a.surveillance);
  ctx.font = `italic ${w * 0.03}px ${SERIF}`;
  ctx.fillStyle = "#3a3630";
  ctx.fillText("The suspect at work, photographed at 3:12 a.m.", m, py + ph + h * 0.03);

  const colW = (w - m * 2 - w * 0.04) / 2;
  const top = py + ph + h * 0.075;
  const next = column(ctx, STORY, m, top, colW, w * 0.031, h * 0.985, r);
  column(ctx, STORY, m + colW + w * 0.04, top, colW, w * 0.031, h * 0.985, r, next);
  ctx.fillStyle = "rgba(38,35,31,0.5)";
  ctx.fillRect(m + colW + w * 0.019, top - h * 0.02, w * 0.002, h);

  cutEdges(ctx, w, h, r, {
    top: { mode: "cut", depth: h * 0.008 },
    left: { mode: "cut", depth: w * 0.012 },
    right: { mode: "cut", depth: w * 0.012 },
    bottom: { mode: "torn", depth: h * 0.035 },
  });
}

function markerLoop(ctx: Ctx, x: number, y: number, rx: number, ry: number, width: number, r: Rng) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.strokeStyle = MARKER_RED;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  const start = r() * Math.PI * 2;
  const end = start + Math.PI * (2.15 + r() * 0.2);
  for (let t = start; t <= end; t += 0.08) {
    const k = 1 + 0.06 * Math.sin(t * 3 + start) + (t - start) * 0.012;
    ctx.lineTo(x + Math.cos(t) * rx * k, y + Math.sin(t) * ry * k);
  }
  ctx.stroke();
  ctx.restore();
}

function drawMap(ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#ece3c9", r, 0.45);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "#e3d2a8";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-0.13);
  const ext = Math.hypot(w, h);
  // A park, then the street grid over everything.
  ctx.fillStyle = "#c2c8a0";
  ctx.fillRect(-w * 0.42, -h * 0.42, w * 0.2, h * 0.26);
  ctx.fillStyle = "rgba(95,115,70,0.35)";
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(-w * 0.42 + r() * w * 0.2, -h * 0.42 + r() * h * 0.26, w * 0.004, 0, Math.PI * 2);
    ctx.fill();
  }
  const street = (x0: number, y0: number, x1: number, y1: number, width: number, fill: string) => {
    ctx.strokeStyle = "rgba(120,100,70,0.55)";
    ctx.lineWidth = width + w * 0.003;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.strokeStyle = fill;
    ctx.lineWidth = width;
    ctx.stroke();
  };
  const sx = w * 0.075;
  const sy = h * 0.095;
  for (let i = -9; i <= 9; i++) street(i * sx + (r() - 0.5) * sx * 0.3, -ext, i * sx + (r() - 0.5) * sx * 0.3, ext, i % 3 === 0 ? w * 0.011 : w * 0.006, "#f5eedb");
  for (let i = -8; i <= 8; i++) street(-ext, i * sy, ext, i * sy + (r() - 0.5) * sy * 0.4, i % 3 === 0 ? w * 0.011 : w * 0.006, "#f5eedb");
  street(-ext * 0.5, ext * 0.42, ext * 0.5, -ext * 0.38, w * 0.017, "#ecd38a");
  // The river, with its darker banks.
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-w * 0.62, h * 0.12);
  ctx.bezierCurveTo(-w * 0.2, h * 0.02, -w * 0.05, h * 0.42, w * 0.25, h * 0.3);
  ctx.bezierCurveTo(w * 0.45, h * 0.22, w * 0.5, h * 0.42, w * 0.7, h * 0.48);
  ctx.strokeStyle = "#71878f";
  ctx.lineWidth = w * 0.05;
  ctx.stroke();
  ctx.strokeStyle = "#a8bbbf";
  ctx.lineWidth = w * 0.043;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(60,50,40,0.85)";
  ctx.font = `700 ${w * 0.017}px ${fonts.mono}`;
  const label = (text: string, x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };
  label("MAIN ST", w * 0.2, h * 0.42, -0.13);
  label("HARBOR RD", w * 0.58, h * 0.25, -0.13);
  label("3RD AVE", w * 0.5, h * 0.66, -0.13 - Math.PI / 2);
  label("ELM ST", w * 0.08, h * 0.75, -0.13);
  label("CZARNA PRZEMSZA", w * 0.36, h * 0.69, -0.3);
  ctx.restore();

  // Map title, half torn off.
  const bx = w * 0.04;
  const by = h * 0.04;
  ctx.fillStyle = "rgba(244,238,220,0.94)";
  ctx.fillRect(bx, by, w * 0.3, h * 0.17);
  ctx.strokeStyle = "rgba(60,50,40,0.8)";
  ctx.lineWidth = w * 0.003;
  ctx.strokeRect(bx + w * 0.008, by + w * 0.008, w * 0.3 - w * 0.016, h * 0.17 - w * 0.016);
  typeHeading(ctx, "SOSNOWIEC", bx + w * 0.03, by + h * 0.075, w * 0.04, fonts.type, r);
  typeLine(ctx, "CITY CENTRE  1:10 000", bx + w * 0.03, by + h * 0.125, w * 0.017, fonts.mono, r, "#3a3229");

  crease(ctx, w, h * 0.5, r);
  vCrease(ctx, h, w * 0.5, r);

  // Someone's been at it with a red marker.
  markerLoop(ctx, w * 0.62, h * 0.38, w * 0.06, h * 0.075, w * 0.006, r);
  handLine(ctx, "HQ?", w * 0.69, h * 0.27, h * 0.1, fonts.hand, r, "#a81c18", -0.08);
  markerLoop(ctx, w * 0.3, h * 0.62, w * 0.045, h * 0.055, w * 0.006, r);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.strokeStyle = MARKER_RED;
  ctx.lineWidth = w * 0.0045;
  ctx.setLineDash([w * 0.018, w * 0.012]);
  ctx.beginPath();
  ctx.moveTo(w * 0.33, h * 0.58);
  ctx.quadraticCurveTo(w * 0.45, h * 0.42, w * 0.57, h * 0.41);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = w * 0.006;
  const xx = w * 0.84;
  const xy = h * 0.72;
  const s = w * 0.022;
  ctx.beginPath();
  ctx.moveTo(xx - s, xy - s);
  ctx.lineTo(xx + s, xy + s * 0.9);
  ctx.moveTo(xx + s, xy - s * 1.1);
  ctx.lineTo(xx - s * 0.9, xy + s);
  ctx.stroke();
  ctx.restore();
  handLine(ctx, "3am, again", w * 0.76, h * 0.85, h * 0.07, fonts.hand, r, "#a81c18", -0.05, "left", "500");

  cutEdges(ctx, w, h, r, {
    right: { mode: "torn", depth: w * 0.03 },
    bottom: { mode: "torn", depth: h * 0.04 },
    top: { mode: "cut", depth: h * 0.004 },
    left: { mode: "cut", depth: w * 0.004 },
  });
}

/** One inked fingertip: nested, warped ridge loops with breaks, fading at the rim. */
function fingerprint(ctx: Ctx, cx: number, cy: number, rw: number, rh: number, r: Rng, smudge = 0) {
  const pw = Math.ceil(rw * 2.4);
  const ph = Math.ceil(rh * 2.4);
  const { c, ctx: p } = canvas(pw, ph);
  const ox = pw / 2;
  const oy = ph / 2;
  const sp = rh * 0.085;
  const p1 = r() * 6;
  const p2 = r() * 6;
  p.strokeStyle = "#1d1c22";
  p.lineWidth = sp * 0.46;
  p.lineCap = "round";
  for (let k = 1; k * sp < rh * 1.25; k++) {
    const rad = k * sp;
    p.setLineDash([sp * (2 + r() * 14), sp * (0.4 + r() * 0.8)]);
    p.globalAlpha = 0.65 + r() * 0.35;
    p.beginPath();
    for (let t = 0; t <= Math.PI * 2 + 0.05; t += 0.05) {
      const wob = 1 + 0.07 * Math.sin(t * 2 + p1 + k * 0.25) + 0.04 * Math.sin(t * 3 + p2);
      p.lineTo(ox + Math.cos(t) * rad * 0.82 * wob, oy - rh * 0.12 + Math.sin(t) * rad * 1.12 * wob + k * sp * 0.22);
    }
    p.stroke();
  }
  // Pressure: solid in the middle, fading out at the rim of the finger.
  p.setLineDash([]);
  p.globalAlpha = 1;
  p.globalCompositeOperation = "destination-in";
  p.save();
  p.translate(ox, oy);
  p.scale(rw / rh, 1);
  const g = p.createRadialGradient(0, 0, 0, 0, 0, rh);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.62, "rgba(0,0,0,0.85)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  p.fillStyle = g;
  p.fillRect(-rh, -rh, rh * 2, rh * 2);
  p.restore();

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.88;
  ctx.filter = `blur(${0.6 + smudge * 3}px)`;
  ctx.drawImage(c, cx - ox + smudge * rw * 0.15, cy - oy);
  ctx.restore();
}

function drawFingerprints(ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f2ede1", r, 0.4);
  const m = w * 0.045;
  typeHeading(ctx, "FINGERPRINT RECORD - RIGHT HAND", m, h * 0.12, w * 0.032, fonts.type, r);
  typeLine(ctx, "FD-258", w - m - w * 0.07, h * 0.12, w * 0.02, fonts.mono, r, "#4a3f35");
  const top = h * 0.18;
  const bh = h * 0.56;
  const bw = (w - m * 2) / 5;
  ctx.strokeStyle = "rgba(40,45,70,0.75)";
  ctx.lineWidth = w * 0.0025;
  ctx.strokeRect(m, top, w - m * 2, bh);
  const names = ["R. THUMB", "R. INDEX", "R. MIDDLE", "R. RING", "R. LITTLE"];
  names.forEach((name, i) => {
    const x = m + i * bw;
    if (i) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + bh);
      ctx.stroke();
    }
    typeLine(ctx, `${i + 1}. ${name}`, x + bw * 0.06, top + h * 0.05, w * 0.0135, fonts.mono, r, "#3a3a48");
    if (i < 4) fingerprint(ctx, x + bw / 2, top + bh * 0.58, bw * (i === 0 ? 0.33 : 0.27), bh * 0.36, r, i === 3 ? 1 : 0);
  });
  typeLine(ctx, "SUBJECT: MOSKWA, M.", m, h * 0.84, w * 0.022, fonts.mono, r);
  typeLine(ctx, "CLASS: ________", m, h * 0.92, w * 0.022, fonts.mono, r);
  handLine(ctx, "refused to give #5", w * 0.5, h * 0.92, w * 0.036, fonts.hand, r, PEN, -0.03, "left", "500");
  stamp(ctx, "NO MATCH", w * 0.7, h * 0.47, w * 0.05, -0.18, fonts.type, r);
}

function drawReceipt(ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f5f3ee", r, 0.25);
  const m = w * 0.09;
  const size = w * 0.068;
  const ink = "#3b3a3d";
  ctx.font = `${size}px ${fonts.mono}`;
  const adv = ctx.measureText("M").width;
  const center = (t: string, y: number, weight = "400", s = size) =>
    typeLine(ctx, t, (w - t.length * adv * (s / size)) / 2, y, s, fonts.mono, r, ink, weight);
  const row = (left: string, right: string, y: number, weight = "400") => {
    typeLine(ctx, left, m, y, size, fonts.mono, r, ink, weight);
    typeLine(ctx, right, w - m - right.length * adv, y, size, fonts.mono, r, ink, weight);
  };
  let y = h * 0.07;
  const lh = size * 1.45;
  center("MEL'S DINER", y, "700", size * 1.3);
  center("OPEN 24 HOURS", (y += lh));
  center("- - - - - - - - - -", (y += lh));
  row("10/09", "03:12 AM", (y += lh));
  row("TABLE 4", "SRV: DOT", (y += lh));
  y += lh * 0.6;
  for (const [item, price] of [
    ["COFFEE, BLK", "1.50"],
    ["COFFEE, BLK", "1.50"],
    ["CHERRY PIE", "3.25"],
    ["COFFEE, BLK", "1.50"],
    ["COFFEE, BLK", "1.50"],
  ] as const)
    row(item, price, (y += lh));
  center("- - - - - - - - - -", (y += lh));
  row("SUBTOTAL", "9.25", (y += lh));
  row("TAX", "0.74", (y += lh));
  row("TOTAL", "9.99", (y += lh * 1.2), "700");
  row("CASH", "10.00", (y += lh));
  row("CHANGE", "0.01", (y += lh));
  center("THANK YOU", (y += lh * 1.6));
  center("COME AGAIN", (y += lh));
  // Thermal print fades in streaks.
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const fade = ctx.createLinearGradient(0, 0, w, 0);
  fade.addColorStop(0, "rgba(245,243,238,0)");
  fade.addColorStop(0.7, "rgba(245,243,238,0.35)");
  fade.addColorStop(1, "rgba(245,243,238,0.1)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  coffeeRing(ctx, w * 0.62, h * 0.46, w * 0.42, r);
  handLine(ctx, "4 coffees.", m, h * 0.86, w * 0.12, fonts.hand, r, PEN, -0.05, "left", "500");
  handLine(ctx, "still no bug.", m, h * 0.92, w * 0.12, fonts.hand, r, PEN, -0.05, "left", "500");
  cutEdges(ctx, w, h, r, {
    top: { mode: "zigzag", depth: h * 0.008 },
    bottom: { mode: "zigzag", depth: h * 0.008 },
  });
}

function drawSticky(lines: string[], tint: string) {
  return (ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) => {
    paper(ctx, w, h, a.paper, tint, r, 0.25);
    // The glue strip stays flatter and a touch darker.
    ctx.fillStyle = "rgba(120,100,40,0.06)";
    ctx.fillRect(0, 0, w, h * 0.2);
    const g = ctx.createLinearGradient(0, h * 0.6, 0, h);
    g.addColorStop(0, "rgba(90,70,30,0)");
    g.addColorStop(1, "rgba(90,70,30,0.12)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    lines.forEach((line, i) => handLine(ctx, line, w * 0.1, h * (0.36 + i * 0.22), h * 0.17, a.fonts.hand, r, PEN, -0.05));
  };
}

function drawMatchbook(ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) {
  ctx.fillStyle = "#651417";
  ctx.fillRect(0, 0, w, h);
  grain(ctx, 0, 0, w, h, 0.2, r);
  const cream = "#e6d7b4";
  ctx.strokeStyle = cream;
  ctx.lineWidth = w * 0.018;
  ctx.strokeRect(w * 0.06, w * 0.06, w * 0.88, h * 0.8 - w * 0.06);
  ctx.fillStyle = cream;
  ctx.textAlign = "center";
  ctx.font = `italic 700 ${w * 0.11}px ${SERIF}`;
  ctx.fillText("the", w / 2, h * 0.17);
  ctx.font = `700 ${w * 0.2}px ${SERIF}`;
  ctx.fillText("BLACK", w / 2, h * 0.32);
  ctx.fillText("CAT", w / 2, h * 0.45);
  // Martini glass.
  ctx.strokeStyle = cream;
  ctx.lineWidth = w * 0.016;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(w * 0.36, h * 0.52);
  ctx.lineTo(w * 0.64, h * 0.52);
  ctx.lineTo(w * 0.5, h * 0.62);
  ctx.closePath();
  ctx.moveTo(w * 0.5, h * 0.62);
  ctx.lineTo(w * 0.5, h * 0.68);
  ctx.moveTo(w * 0.42, h * 0.685);
  ctx.lineTo(w * 0.58, h * 0.685);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w * 0.47, h * 0.545, w * 0.025, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `${w * 0.07}px ${SERIF}`;
  ctx.fillText("COCKTAILS · JAZZ", w / 2, h * 0.745);
  ctx.fillText("OPEN LATE", w / 2, h * 0.79);
  // The tucked-in flap along the bottom.
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, h * 0.84, w, h * 0.16);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, h * 0.84, w, h * 0.008);
  ctx.fillStyle = cream;
  ctx.font = `${w * 0.05}px ${SERIF}`;
  ctx.fillText("CLOSE COVER BEFORE STRIKING", w / 2, h * 0.93);
  ctx.textAlign = "left";
  // Worn print: scuffs through to the board underneath.
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(255,235,210,${0.04 + r() * 0.08})`;
    ctx.lineWidth = 1 + r() * 2;
    const x = r() * w;
    const y = r() * h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (r() - 0.5) * w * 0.3, y + (r() - 0.5) * h * 0.05);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFloppyLabel(ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#f2f0ea", r, 0.2);
  ctx.fillStyle = "rgba(180,40,40,0.6)";
  ctx.fillRect(0, h * 0.18, w, h * 0.008);
  ctx.fillStyle = "rgba(70,100,160,0.4)";
  for (let y = h * 0.36; y < h; y += h * 0.18) ctx.fillRect(0, y, w, h * 0.005);
  typeLine(ctx, "MF2HD  1.44 MB", w * 0.05, h * 0.12, h * 0.07, fonts.mono, r, "#5a5a60");
  handLine(ctx, "BACKUP", w * 0.06, h * 0.33, h * 0.2, fonts.hand, r, "#141418", -0.03);
  handLine(ctx, "portfolio_FINAL_v3 (2)", w * 0.06, h * 0.54, h * 0.13, fonts.hand, r, PEN, -0.02, "left", "500");
  handLine(ctx, "DO NOT FORMAT!!", w * 0.06, h * 0.86, h * 0.15, fonts.hand, r, "#a81c18", -0.03);
}

function drawTape(ctx: Ctx, w: number, h: number, _a: PropAssets, r: Rng) {
  ctx.fillStyle = "rgba(236,226,196,0.6)";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(255,250,235,${r() * 0.12})`;
    ctx.fillRect(0, r() * h, w, 1 + r() * 2);
  }
  ctx.fillStyle = "rgba(120,100,70,0.12)";
  for (let i = 0; i < 25; i++) ctx.fillRect(r() * w, r() * h, 2 + r() * 4, 1 + r() * 2);
  cutEdges(ctx, w, h, r, {
    left: { mode: "torn", depth: w * 0.05, step: h / 10 },
    right: { mode: "torn", depth: w * 0.05, step: h / 10 },
  });
}

function drawTag(ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) {
  const { fonts } = a;
  paper(ctx, w, h, a.paper, "#d8b77c", r, 0.7);
  const cx = w / 2;
  const cy = h * 0.1;
  // Brass-coloured reinforcement ring, then the hole punched through it.
  ctx.fillStyle = "#b9a27a";
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.13, 0, Math.PI * 2);
  ctx.fill();
  typeHeading(ctx, "EVIDENCE", cx, h * 0.33, w * 0.15, fonts.type, r, "#2a2420", "center");
  ctx.fillStyle = "rgba(30,25,20,0.6)";
  ctx.fillRect(w * 0.12, h * 0.37, w * 0.76, h * 0.006);
  typeLine(ctx, "ITEM 07", w * 0.14, h * 0.47, w * 0.12, fonts.mono, r);
  handLine(ctx, "key to", w * 0.14, h * 0.64, w * 0.2, fonts.hand, r, PEN, -0.06);
  handLine(ctx, "prod?", w * 0.18, h * 0.78, w * 0.2, fonts.hand, r, PEN, -0.06);
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Clipped top corners of a shipping tag.
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.moveTo(w * 0.24, 0);
  ctx.lineTo(w * 0.76, 0);
  ctx.lineTo(w, h * 0.14);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.lineTo(0, h * 0.14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

type PropAssets = { paper: HTMLImageElement; surveillance: HTMLImageElement; fonts: Fonts };
type Painter = (ctx: Ctx, w: number, h: number, a: PropAssets, r: Rng) => void;

/** Canvas pixels per metre of prop. */
const DENSITY = 3200;

const PROPS = {
  newspaper: { size: [0.24, 0.33], draw: drawNewspaper },
  map: { size: [0.36, 0.26], draw: drawMap },
  fingerprints: { size: [0.22, 0.14], draw: drawFingerprints },
  receipt: { size: [0.075, 0.21], draw: drawReceipt },
  stickyFriday: { size: [0.1, 0.1], draw: drawSticky(["push to main", "on Friday??", "WHO."], "#f1df78") },
  stickyDns: { size: [0.1, 0.1], draw: drawSticky(["it's always", "DNS"], "#f0b2bc") },
  matchbook: { size: [0.05, 0.083], draw: drawMatchbook },
  tag: { size: [0.05, 0.085], draw: drawTag },
  floppyLabel: { size: [0.07, 0.05], draw: drawFloppyLabel },
  tape: { size: [0.06, 0.02], draw: drawTape },
} satisfies Record<string, { size: readonly [number, number]; draw: Painter }>;

export type PropName = keyof typeof PROPS;
/** Size of a prop in metres (width, height). */
export const propSize = (name: PropName): readonly [number, number] => PROPS[name].size;

let cache: Promise<Record<PropName, THREE.CanvasTexture>> | null = null;

/** Paints every prop face once; textures are shared for the page lifetime. */
export function loadPropTextures(maxAnisotropy: number) {
  cache ??= (async () => {
    const [fonts, paperScan, surveillance] = await Promise.all([
      loadFonts(),
      loadImage("/case/tex/paper_diff.jpg"),
      loadImage("/case/surveillance.jpg"),
    ]);
    const assets: PropAssets = { paper: paperScan, surveillance, fonts };
    const out = {} as Record<PropName, THREE.CanvasTexture>;
    for (const [name, prop] of Object.entries(PROPS) as [PropName, (typeof PROPS)[PropName]][]) {
      const [w, h] = prop.size;
      const { c, ctx } = canvas(Math.max(256, w * DENSITY), Math.max(96, h * DENSITY));
      prop.draw(ctx, c.width, c.height, assets, seeded(name));
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, maxAnisotropy);
      out[name] = t;
      await new Promise((res) => setTimeout(res, 0));
    }
    return out;
  })();
  return cache;
}
