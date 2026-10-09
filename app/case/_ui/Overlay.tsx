"use client";

import { SpeakerSimpleHigh, SpeakerSimpleSlash, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { CARDS, CASE_NUMBER, EXHIBITS, LINKS } from "../content";
import type { CaseCard } from "../content";
import { caseActions, caseStore, useCase } from "../store";
import { useCaseAudio } from "./useCaseAudio";

// --- design tokens ---------------------------------------------------------

const TYPEWRITER = "font-[family-name:var(--font-typewriter)]";
const MONO = "font-[family-name:var(--font-mono-body)]";
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8cfbf] focus-visible:rounded-[1px]";
const INK_FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d1a16] focus-visible:rounded-[1px]";
const SHADOW = "[text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_10px_rgba(0,0,0,0.85)]";

function svgNoise(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Light speckle for the intro film grain (alpha follows the noise).
const GRAIN = svgNoise(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.9 0 0 0 -0.35'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
);

// Warm-brown fibre noise for the aged paper.
const PAPER_NOISE = svgNoise(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .26 0 0 0 0 .14 0.7 0 0 0 -0.22'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
);

const CSS = `
@keyframes case-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes case-panel-x { from { opacity: 0; transform: translateX(28px) } to { opacity: 1; transform: none } }
@keyframes case-panel-y { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: none } }
@keyframes case-grain { 0% { transform: translate(0, 0) } 20% { transform: translate(-3%, 2%) } 40% { transform: translate(2%, -3%) } 60% { transform: translate(-2%, -1%) } 80% { transform: translate(3%, 3%) } 100% { transform: translate(0, 0) } }
@keyframes case-caret { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.case-fade-in { animation: case-fade-in 700ms ease-out both }
.case-hint { animation: case-fade-in 280ms ease-out both }
.case-panel { animation: case-panel-y 280ms ease-out both }
@media (min-width: 640px) { .case-panel { animation-name: case-panel-x } }
.case-grain { animation: case-grain 0.9s steps(1) infinite }
.case-caret { animation: case-caret 1s steps(1) infinite }
@media (prefers-reduced-motion: reduce) {
  .case-fade-in, .case-hint, .case-panel, .case-grain, .case-caret { animation: none !important }
}
`;

// --- small hooks -----------------------------------------------------------

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void): () => void {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

function useTypedText(text: string, instant: boolean, speedMs: number): { typed: string; done: boolean } {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (instant) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speedMs);
    return () => window.clearInterval(id);
  }, [text, instant, speedMs]);

  const n = instant ? text.length : Math.min(count, text.length);
  return { typed: text.slice(0, n), done: n >= text.length };
}

// --- shared bits -----------------------------------------------------------

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function TextLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd
      aria-hidden="true"
      className={`${TYPEWRITER} inline-block min-w-[1.6em] rounded-[2px] border border-[#d8cfbf]/55 px-1.5 py-px text-center text-[10px] leading-4 tracking-wider [@media(pointer:coarse)]:hidden`}
    >
      {children}
    </kbd>
  );
}

// --- intro / loader --------------------------------------------------------

function Intro() {
  const entered = useCase((s) => s.entered);
  const progress = useCase((s) => s.progress);
  const reduced = usePrefersReducedMotion();
  const ready = progress >= 1;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { typed, done } = useTypedText(CASE_NUMBER, reduced, 70);

  useEffect(() => {
    if (ready && !entered) buttonRef.current?.focus({ preventScroll: true });
  }, [ready, entered]);

  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div
      inert={entered}
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden bg-[#050506] px-6 text-center text-[#d8cfbf] transition-[opacity,visibility] duration-700 motion-reduce:transition-none ${TYPEWRITER} ${
        entered ? "pointer-events-none invisible opacity-0 [transition-delay:0s,700ms]" : "pointer-events-auto visible opacity-100"
      }`}
    >
      <div
        aria-hidden="true"
        className="case-grain pointer-events-none absolute -inset-[10%] opacity-[0.07]"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative flex w-full max-w-xl flex-col items-center">
        <p className="min-h-[1.5em] text-xs tracking-[0.35em] text-[#d8cfbf]/70 sm:text-sm">
          <span className="sr-only">{CASE_NUMBER}</span>
          <span aria-hidden="true">
            {typed}
            <span className="case-caret ml-[0.2em] inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-[#d8cfbf]/70" />
          </span>
        </p>

        <h1
          className={`mt-6 text-3xl leading-tight tracking-[0.12em] text-[#ece4d4] transition-opacity duration-700 motion-reduce:transition-none sm:text-5xl ${
            done ? "opacity-100" : "opacity-0"
          }`}
        >
          THE CASE OF MARCEL MOSKWA
        </h1>
        <p
          className={`mt-4 text-xs tracking-[0.25em] text-[#d8cfbf]/70 uppercase transition-opacity delay-300 duration-700 motion-reduce:transition-none sm:text-sm ${
            done ? "opacity-100" : "opacity-0"
          }`}
        >
          Full-stack developer · case file
        </p>

        <div className="mt-14 flex h-24 w-full max-w-xs flex-col items-center justify-start">
          {ready ? (
            <button
              ref={buttonRef}
              type="button"
              onClick={() => caseStore.set({ entered: true })}
              className={`border border-[#d8cfbf]/60 px-6 py-3 text-sm tracking-[0.25em] text-[#ece4d4] uppercase transition-colors duration-200 hover:border-[#d8cfbf] hover:bg-[#d8cfbf] hover:text-[#050506] motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Open the case file
            </button>
          ) : (
            <div className="w-full">
              <div
                role="progressbar"
                aria-label="Loading the case file"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                className="h-px w-full bg-[#d8cfbf]/20"
              >
                <div
                  className="h-full origin-left bg-[#a3352b] transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{ transform: `scaleX(${pct / 100})` }}
                />
              </div>
              <p className="mt-3 text-[11px] tracking-[0.3em] text-[#d8cfbf]/55 uppercase tabular-nums">
                Gathering evidence · {pct}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[11px] tracking-[0.15em] text-[#d8cfbf]/55">
        <p>Sound available — off by default</p>
        <TextLink
          href={LINKS.classic}
          className={`py-1 text-xs tracking-[0.1em] text-[#d8cfbf]/80 underline-offset-4 hover:text-[#ece4d4] hover:underline ${FOCUS_RING}`}
        >
          Prefer the classic portfolio →
        </TextLink>
      </div>
    </div>
  );
}

// --- HUD -------------------------------------------------------------------

const HUD_LINKS: readonly { label: string; href: string }[] = [
  { label: "CV", href: LINKS.cv },
  { label: "GitHub", href: LINKS.github },
  { label: "LinkedIn", href: LINKS.linkedin },
  { label: "Classic view", href: LINKS.classic },
];

function Hud() {
  const soundOn = useCase((s) => s.soundOn);
  const Icon = soundOn ? SpeakerSimpleHigh : SpeakerSimpleSlash;

  return (
    <header
      className={`case-fade-in absolute inset-x-0 top-0 flex flex-col gap-1 p-4 text-[#d8cfbf] sm:flex-row sm:items-start sm:justify-between sm:p-6 ${TYPEWRITER} ${SHADOW}`}
    >
      <p className="pt-1.5 text-[11px] tracking-[0.3em] text-[#d8cfbf]/70 uppercase sm:text-xs">{CASE_NUMBER}</p>
      <nav aria-label="Links" className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-5">
        {HUD_LINKS.map((l) => (
          <TextLink
            key={l.label}
            href={l.href}
            className={`py-1.5 text-[11px] tracking-[0.18em] uppercase underline-offset-[6px] decoration-1 hover:text-[#ece4d4] hover:underline sm:text-xs ${FOCUS_RING}`}
          >
            {l.label}
          </TextLink>
        ))}
        <button
          type="button"
          aria-pressed={soundOn}
          aria-label="Sound"
          title={soundOn ? "Sound on" : "Sound off"}
          onClick={caseActions.toggleSound}
          className={`-m-1.5 p-2 hover:text-[#ece4d4] ${FOCUS_RING}`}
        >
          <Icon size={18} weight="regular" aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}

// --- bottom hint bar -------------------------------------------------------

function HintButton({
  keycap,
  label,
  shortcut,
  onClick,
  expanded,
}: {
  keycap: string;
  label: string;
  shortcut: string;
  onClick: () => void;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-keyshortcuts={shortcut}
      aria-expanded={expanded}
      className={`pointer-events-auto inline-flex items-center gap-2 px-1.5 py-2 underline-offset-[6px] decoration-1 hover:text-[#ece4d4] hover:underline ${FOCUS_RING}`}
    >
      <Key>{keycap}</Key>
      <span>{label}</span>
    </button>
  );
}

function HintBar() {
  const mode = useCase((s) => s.mode);
  const hoveredId = useCase((s) => s.hoveredId);
  const activeId = useCase((s) => s.activeId);
  const transcriptOpen = useCase((s) => s.transcriptOpen);

  const hovered = hoveredId ? (CARDS.find((c) => c.id === hoveredId) ?? EXHIBITS.find((x) => x.id === hoveredId)) : undefined;
  const exhibit = activeId ? EXHIBITS.find((x) => x.id === activeId) : undefined;

  let content: ReactNode;
  if (mode === "board") {
    content = <p className="py-2">{hovered ? hovered.title : "Click a document to examine it"}</p>;
  } else if (mode === "focus" && exhibit) {
    content = (
      <>
        <p className="py-2">
          {exhibit.title} <span className="normal-case tracking-[0.08em] text-[#d8cfbf]/75">— {exhibit.caption}</span>
        </p>
        <HintButton keycap="Esc" shortcut="Escape" label="Back" onClick={caseActions.back} />
      </>
    );
  } else if (mode === "focus") {
    content = (
      <>
        <HintButton keycap="E" shortcut="E" label="Pick up" onClick={caseActions.inspect} />
        <HintButton keycap="T" shortcut="T" label="Transcript" expanded={transcriptOpen} onClick={caseActions.toggleTranscript} />
        <HintButton keycap="Esc" shortcut="Escape" label="Back" onClick={caseActions.back} />
      </>
    );
  } else {
    content = (
      <>
        <p className="py-2">Drag to rotate</p>
        <HintButton keycap="F" shortcut="F" label="Turn over" onClick={caseActions.flip} />
        <HintButton keycap="T" shortcut="T" label="Transcript" expanded={transcriptOpen} onClick={caseActions.toggleTranscript} />
        <HintButton keycap="Esc" shortcut="Escape" label="Put down" onClick={caseActions.back} />
      </>
    );
  }

  return (
    <div
      className={`case-fade-in absolute inset-x-0 bottom-0 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] ${transcriptOpen ? "max-sm:hidden sm:pr-[min(480px,92vw)]" : ""}`}
    >
      <div
        key={exhibit ? `${mode}-${exhibit.id}` : mode}
        className={`case-hint flex flex-wrap items-center justify-center gap-x-5 gap-y-0 text-[11px] tracking-[0.16em] text-[#d8cfbf] uppercase sm:text-xs ${TYPEWRITER} ${SHADOW}`}
      >
        {content}
      </div>
    </div>
  );
}

// --- transcript ------------------------------------------------------------

function TranscriptPanel({ card }: { card: CaseCard }) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { transcript } = card;

  // Move focus to the heading on open, hand it back on close.
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      if (previous && previous !== document.body && document.contains(previous)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      className={`case-panel pointer-events-auto absolute right-0 bottom-0 left-0 z-20 max-h-[78dvh] overflow-y-auto overscroll-contain border-t border-[#1d1a16]/25 bg-[#ece4d4] text-[#1d1a16] shadow-[0_-8px_40px_rgba(0,0,0,0.65)] sm:top-0 sm:left-auto sm:max-h-none sm:w-[min(480px,92vw)] sm:border-t-0 sm:border-l sm:shadow-[-8px_0_40px_rgba(0,0,0,0.65)] ${MONO}`}
      style={{ backgroundImage: PAPER_NOISE }}
    >
      <div className="relative px-6 pt-6 pb-10 sm:px-9 sm:pt-9">
        <button
          type="button"
          onClick={caseActions.toggleTranscript}
          aria-label="Close transcript"
          className={`absolute top-3 right-3 p-2 text-[#1d1a16]/70 hover:text-[#1d1a16] sm:top-5 sm:right-5 ${INK_FOCUS_RING}`}
        >
          <X size={20} aria-hidden="true" />
        </button>

        <span
          aria-hidden="true"
          className={`${TYPEWRITER} inline-block -rotate-4 border-2 border-[#a3352b]/85 px-2.5 py-0.5 text-[11px] tracking-[0.3em] text-[#a3352b]/85 shadow-[inset_0_0_0_1px_rgba(163,53,43,0.35)]`}
        >
          TRANSCRIPT
        </span>

        <h2
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className={`${TYPEWRITER} mt-5 text-2xl leading-tight font-normal focus:outline-none sm:text-[1.7rem]`}
        >
          {transcript.heading}
        </h2>

        {transcript.intro ? <p className="mt-4 text-base leading-[1.6]">{transcript.intro}</p> : null}

        {transcript.sections.map((section, i) => (
          <div key={`${section.label ?? "section"}-${i}`} className="mt-6 border-t border-[#1d1a16]/20 pt-4">
            {section.label ? (
              <h3 className={`${TYPEWRITER} mb-2 text-xs leading-snug font-normal tracking-[0.14em] text-[#1d1a16]/75 uppercase`}>
                {section.label}
              </h3>
            ) : null}
            {section.body ? <p className="text-base leading-[1.6]">{section.body}</p> : null}
            {section.items ? (
              <ul className="space-y-1.5 text-base leading-[1.6]">
                {section.items.map((item) => (
                  <li key={item} className="relative pl-5 before:absolute before:left-0 before:content-['—']">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {transcript.links && transcript.links.length > 0 ? (
          <nav aria-label="Related links" className="mt-6 border-t border-[#1d1a16]/20 pt-4">
            <ul className="space-y-2 text-base leading-[1.6]">
              {transcript.links.map((link) => (
                <li key={link.href}>
                  <TextLink
                    href={link.href}
                    className={`font-bold underline decoration-[#a3352b] decoration-2 underline-offset-4 hover:text-[#a3352b] ${INK_FOCUS_RING}`}
                  >
                    {link.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </section>
  );
}

function Transcript() {
  const transcriptOpen = useCase((s) => s.transcriptOpen);
  const activeId = useCase((s) => s.activeId);
  if (!transcriptOpen || !activeId) return null;
  const card = CARDS.find((c) => c.id === activeId);
  if (!card) return null;
  return <TranscriptPanel key={card.id} card={card} />;
}

// --- keyboard + sr-only board access ---------------------------------------

function useCaseKeys(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) return;
      }

      const { mode, activeId } = caseStore.get();
      switch (e.key) {
        case "Escape":
          caseActions.back();
          break;
        case "e":
        case "E":
          if (!e.repeat && mode === "focus") caseActions.inspect();
          break;
        case "f":
        case "F":
          if (!e.repeat && mode === "inspect") caseActions.flip();
          break;
        case "t":
        case "T":
          if (!e.repeat && activeId) caseActions.toggleTranscript();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}

function BoardNav() {
  return (
    <nav aria-label="Case board documents" className="sr-only">
      <ul>
        {[...CARDS, ...EXHIBITS].map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => caseActions.focus(item.id)}>
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// --- root ------------------------------------------------------------------

export default function Overlay() {
  useCaseAudio();
  const entered = useCase((s) => s.entered);
  useCaseKeys(entered);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <style>{CSS}</style>
      {entered ? (
        <>
          <Hud />
          <HintBar />
          <Transcript />
          <div className="pointer-events-auto">
            <BoardNav />
          </div>
        </>
      ) : null}
      <Intro />
    </div>
  );
}
