"use client";

import React from "react";
import { useState } from "react";

function makeBlobStyle(): React.CSSProperties {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  const dx = `${rand(-80, 80)}px`;
  const dy = `${rand(-60, 60)}px`;
  const dur = `${rand(14, 28)}s`;
  const delay = `${rand(-12, 0)}s`;
  const dir = Math.random() > 0.5 ? "alternate" : "alternate-reverse";
  const easing = Math.random() > 0.5 ? "ease-in-out" : "cubic-bezier(0.22, 1, 0.36, 1)";
  const scaleMid = Number(rand(1.05, 1.2).toFixed(2));

  return {
    ["--dx" as any]: dx,
    ["--dy" as any]: dy,
    ["--scale-start" as any]: 1,
    ["--scale-mid" as any]: scaleMid,
    ["--scale-end" as any]: 1,
    animationDuration: dur,
    animationDelay: delay,
    animationDirection: dir as any,
    animationTimingFunction: easing as any,
  } as React.CSSProperties;
}

export default function BlurBackground() {
  const [styles] = useState(() => Array.from({ length: 11 }, () => makeBlobStyle()));

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-110 h-110 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift"
        style={styles[0]}
      />
      <div
        className="absolute top-0 left-80 -translate-y-1/2 w-120 h-64 bg-(--purple-primary) rounded-full blur-[140px] animate-blobDrift"
        style={styles[1]}
      />
      <div
        className="absolute top-10 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-(--purple-primary) rounded-full blur-[100px] animate-blobDrift"
        style={styles[2]}
      />
      <div
        className="absolute top-80 left-230 w-96 h-96 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift"
        style={styles[3]}
      />
      <div
        className="absolute top-120 left-20 w-80 h-80 bg-(--purple-primary) rounded-full blur-[100px] animate-blobDrift"
        style={styles[4]}
      />
      <div
        className="absolute right-0 translate-x-1/2 bottom-[-25%] w-96 h-160 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift"
        style={styles[5]}
      />
      <div
        className="absolute top-220 left-120 w-96 h-96 bg-(--purple-primary) rounded-full blur-[100px]"
        style={styles[6]}
      />
      <div
        className="absolute top-250 left-0 -translate-x-1/3 w-96 h-160 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift"
        style={styles[7]}
      />
      <div
        className="absolute top-340 right-110 w-120 h-120 bg-(--purple-primary) rounded-full blur-[120px]"
        style={styles[8]}
      />
      <div
        className="absolute bottom-0 left-20 w-140 h-48 translate-y-1/2 bg-(--purple-primary) rounded-full blur-[100px] animate-blobDrift"
        style={styles[9]}
      />
      <div
        className="absolute bottom-170 right-0 w-96 h-120 translate-x-1/2 bg-(--purple-primary) rounded-full blur-[120px] animate-blobDrift"
        style={styles[10]}
      />
    </div>
  );
}
