"use client";

import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, EffectPass, SMAAEffect, SMAAPreset, ToneMappingMode } from "postprocessing";
import { useEffect, useMemo } from "react";
import type * as THREE from "three";
import { VolumeEffect } from "./VolumeEffect";

/** Contact shadows in the corners, haze in the light, glow off the bulb and lightning, a filmic curve and grain. */
export function Effects() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const volume = useMemo(() => new VolumeEffect(camera), [camera]);
  useEffect(() => () => volume.dispose(), [volume]);
  // The canvas runs without MSAA (it would multiply the AO and haze cost), so
  // edges are smoothed here instead. SMAA blends from its own input buffer, so
  // it gets a pass of its own on the tone-mapped image; grain goes on after it.
  const smaa = useMemo(() => {
    const effect = new SMAAEffect({ preset: SMAAPreset.HIGH });
    return { effect, pass: new EffectPass(camera, effect) };
  }, [camera]);
  useEffect(
    () => () => {
      smaa.pass.dispose();
      smaa.effect.dispose();
    },
    [smaa],
  );

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO halfRes aoRadius={0.35} distanceFalloff={0.6} intensity={2.4} quality="medium" color="#050302" />
      <primitive object={volume} />
      <Bloom mipmapBlur luminanceThreshold={1.1} luminanceSmoothing={0.3} intensity={0.55} radius={0.72} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <primitive object={smaa.pass} />
      <Vignette offset={0.28} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
    </EffectComposer>
  );
}
