"use client";

import { useSyncExternalStore } from "react";
import { CARDS } from "./content";
import type { Strike } from "./thunder";

// Tiny shared store between the R3F scene and the HTML overlay.
// Scene → overlay: loading progress, hovered card, lightning strikes.
// Overlay → scene: mode changes (back / pick up / flip), sound toggle.

export type CaseMode = "board" | "focus" | "inspect";

export type CaseState = {
  mode: CaseMode;
  activeId: string | null;
  hoveredId: string | null;
  /** Inspect mode: false = front face, true = back face. */
  flipped: boolean;
  transcriptOpen: boolean;
  soundOn: boolean;
  /** 0..1 asset loading progress. */
  progress: number;
  /** User dismissed the intro/loader screen. */
  entered: boolean;
};

const initial: CaseState = {
  mode: "board",
  activeId: null,
  hoveredId: null,
  flipped: false,
  transcriptOpen: false,
  soundOn: false,
  progress: 0,
  entered: false,
};

let state = initial;
const listeners = new Set<() => void>();

export const caseStore = {
  get: () => state,
  set(patch: Partial<CaseState> | ((s: CaseState) => Partial<CaseState>)) {
    const next = typeof patch === "function" ? patch(state) : patch;
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useCase<T>(selector: (s: CaseState) => T): T {
  return useSyncExternalStore(
    caseStore.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

// --- actions -------------------------------------------------------------

/** Cards can be picked up and read; exhibits can only be looked at. */
const isCard = (id: string | null) => !!id && CARDS.some((c) => c.id === id);

export const caseActions = {
  focus: (id: string) => caseStore.set({ mode: "focus", activeId: id, flipped: false, ...(isCard(id) ? {} : { transcriptOpen: false }) }),
  inspect: () => caseStore.set((s) => (isCard(s.activeId) ? { mode: "inspect", flipped: false } : {})),
  flip: () => caseStore.set((s) => (s.mode === "inspect" ? { flipped: !s.flipped } : {})),
  /** One step back: transcript → inspect → focus → board. */
  back: () =>
    caseStore.set((s) => {
      if (s.transcriptOpen) return { transcriptOpen: false };
      if (s.mode === "inspect") return { mode: "focus", flipped: false };
      if (s.mode === "focus") return { mode: "board", activeId: null };
      return {};
    }),
  toggleTranscript: () => caseStore.set((s) => (isCard(s.activeId) ? { transcriptOpen: !s.transcriptOpen } : {})),
  toggleSound: () => caseStore.set((s) => ({ soundOn: !s.soundOn })),
};

// Dev-only handle for poking the scene from the console / automated checks.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __case: unknown }).__case = { caseStore, caseActions };
}

// --- lightning events (scene emits, audio listens) -----------------------

type StrikeListener = (strike: Strike) => void;
const strikeListeners = new Set<StrikeListener>();

export const lightning = {
  emit: (strike: Strike) => strikeListeners.forEach((l) => l(strike)),
  on(listener: StrikeListener) {
    strikeListeners.add(listener);
    return () => {
      strikeListeners.delete(listener);
    };
  },
};
