"use client";

import { useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { caseActions, caseStore } from "../store";
import { Atmosphere } from "./Atmosphere";
import { CameraRig } from "./CameraRig";
import { Cards } from "./Cards";
import { Props } from "./Props";
import { Effects } from "./Effects";
import { CAMERA } from "./layout";
import { Lights } from "./Lights";
import { Board, Room } from "./Room";
import { WindowGlass } from "./WindowGlass";

/** Mirrors the loader into the store; held below 1 until shaders are compiled. */
function LoadProgress() {
  useEffect(
    // The loading manager can fire while other components render (cached
    // assets), so the store update is deferred instead of driven by a hook.
    () =>
      useProgress.subscribe(({ progress }) => {
        queueMicrotask(() => {
          if (caseStore.get().progress < 1) caseStore.set({ progress: Math.min(0.95, progress / 100) });
        });
      }),
    [],
  );
  return null;
}

/** Mounts once everything in the Suspense boundary resolved. */
function Ready() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let cancelled = false;
    // Compiling up front avoids a hitch on the first frame and the first lightning strike.
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) caseStore.set({ progress: 1 });
      });
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera]);
  return null;
}

// Dev-only: `?off=atmo,glass,fx,cards` skips parts of the scene for profiling.
const OFF = new Set(
  typeof window !== "undefined" && process.env.NODE_ENV !== "production"
    ? (new URLSearchParams(window.location.search).get("off") ?? "").split(",")
    : [],
);

export default function Scene() {
  return (
    <Canvas
      shadows={OFF.has("shadows") ? false : "percentage"}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 50, near: 0.03, far: 60, position: CAMERA.intro.position.toArray() }}
      onPointerMissed={() => {
        if (caseStore.get().mode === "focus") caseActions.back();
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <color attach="background" args={["#020203"]} />
      <fogExp2 attach="fog" args={["#06070b", 0.045]} />
      <LoadProgress />
      <CameraRig />
      <Suspense fallback={null}>
        <Room />
        <Board />
        <Lights />
        {!OFF.has("glass") && <WindowGlass />}
        {!OFF.has("cards") && <Cards />}
        {!OFF.has("props") && <Props />}
        {!OFF.has("atmo") && <Atmosphere />}
        {!OFF.has("fx") && <Effects />}
        <Ready />
      </Suspense>
    </Canvas>
  );
}
