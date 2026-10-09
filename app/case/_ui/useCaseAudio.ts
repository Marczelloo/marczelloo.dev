"use client";

import { useEffect, useRef } from "react";
import { lightning, useCase } from "../store";
import { CaseAudio } from "./audio";

/** Wires the soundscape to the case store. Call once, in the overlay. */
export function useCaseAudio(): void {
  const soundOn = useCase((s) => s.soundOn);
  const mode = useCase((s) => s.mode);
  const flipped = useCase((s) => s.flipped);

  const audioRef = useRef<CaseAudio | null>(null);
  const prevRef = useRef({ mode, flipped });

  // One CaseAudio for the lifetime of the overlay; thunder follows lightning.
  useEffect(() => {
    const audio = new CaseAudio();
    audioRef.current = audio;
    const off = lightning.on((strike) => audio.thunder(strike));
    return () => {
      off();
      audio.dispose();
      audioRef.current = null;
    };
  }, []);

  // Sound toggle. The click that flips `soundOn` is the user gesture that
  // allows the AudioContext to start.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.start();
      audio.setEnabled(true);
    } else {
      audio.setEnabled(false);
    }
  }, [soundOn]);

  // Paper rustle when a card is picked up / put down / turned over.
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = { mode, flipped };
    const audio = audioRef.current;
    if (!audio) return;
    if (mode !== prev.mode) {
      if (mode !== "board") audio.paper();
    } else if (flipped !== prev.flipped) {
      audio.paper();
    }
  }, [mode, flipped]);
}
