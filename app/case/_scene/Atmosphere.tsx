"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { ROOM } from "./layout";
import { LIGHTS_GLSL, lightUniforms, timeUniform } from "./lightsGLSL";

// Dust motes: invisible in the dark, they glitter where they drift through the
// lamp cone or the blind stripes. Motes close to the lens grow into soft bokeh.

const DUST_COUNT = 2600;
const DUST_MIN = new THREE.Vector3(-2.3, 0.25, 0.1);
const DUST_MAX = new THREE.Vector3(ROOM.rightX - 0.1, 3.3, 3.4);

const dustVert = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime;
uniform float uScale;
uniform float uSize;
varying vec3 vColor;
varying float vAlpha;
${LIGHTS_GLSL}

#define BOX_MIN vec3(${DUST_MIN.x.toFixed(3)}, ${DUST_MIN.y.toFixed(3)}, ${DUST_MIN.z.toFixed(3)})
#define BOX_SIZE vec3(${(DUST_MAX.x - DUST_MIN.x).toFixed(3)}, ${(DUST_MAX.y - DUST_MIN.y).toFixed(3)}, ${(DUST_MAX.z - DUST_MIN.z).toFixed(3)})

void main() {
  vec3 p = position;
  float t = uTime;
  // Slow settling plus Brownian-ish wander, wrapped inside the box.
  p.y -= t * (0.004 + 0.01 * aSeed.y);
  p.x += t * 0.003 * (aSeed.z - 0.5);
  p += 0.05 * vec3(
    sin(t * (0.21 + 0.3 * aSeed.x) + aSeed.y * 6.28),
    sin(t * (0.17 + 0.2 * aSeed.z) + aSeed.x * 6.28),
    cos(t * (0.19 + 0.25 * aSeed.y) + aSeed.z * 6.28));
  p = BOX_MIN + mod(p - BOX_MIN, BOX_SIZE);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(0.05, -mv.z);
  float defocus = smoothstep(1.4, 0.35, dist);
  float size = uSize * (0.45 + aSeed.x * aSeed.x * 1.6) * (1.0 + defocus * 5.0);
  gl_PointSize = max(1.5, size * uScale / dist);
  // Twinkle: flat flakes catch the light as they tumble.
  float tw = 0.55 + 0.45 * sin(t * (1.5 + aSeed.z * 3.0) + aSeed.x * 40.0);
  vColor = roomLight(p);
  vAlpha = tw * (0.25 + 0.75 * aSeed.z) / (1.0 + defocus * 14.0);
}
`;

const dustFrag = /* glsl */ `
uniform float uGain;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor * (vAlpha * a * uGain) + vec3(0.0015) * a * vAlpha, 1.0);
}
`;

function Dust() {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const seed = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = THREE.MathUtils.lerp(DUST_MIN.x, DUST_MAX.x, Math.random());
      pos[i * 3 + 1] = THREE.MathUtils.lerp(DUST_MIN.y, DUST_MAX.y, Math.random());
      pos[i * 3 + 2] = THREE.MathUtils.lerp(DUST_MIN.z, DUST_MAX.z, Math.random());
      seed[i * 3] = Math.random();
      seed[i * 3 + 1] = Math.random();
      seed[i * 3 + 2] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    const m = new THREE.ShaderMaterial({
      uniforms: {
        ...lightUniforms,
        uTime: timeUniform,
        uScale: { value: 800 },
        uSize: { value: 0.0022 },
        uGain: { value: 0.9 },
      },
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: g, material: m };
  }, []);

  useFrame(() => {
    const fov = THREE.MathUtils.degToRad(camera.fov);
    material.uniforms.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan(fov / 2));
  });

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={11} />;
}

/** Floating dust. The haze itself is a post effect (see VolumeEffect). */
export function Atmosphere() {
  return <Dust />;
}
