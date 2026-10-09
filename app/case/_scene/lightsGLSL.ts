import * as THREE from "three";
import { WIN } from "./layout";

// Analytic copy of the room lighting for shaders that can't sample shadow maps
// (volumetric haze, dust). The window, muntins and blind slats are tested
// exactly, so the light shafts line up with the shadow-mapped stripes.

const f = (n: number) => n.toFixed(5);

export const LIGHTS_GLSL = /* glsl */ `
#define WIN_GLASS_X ${f(WIN.glassX)}
#define WIN_Z0 ${f(WIN.z0 + WIN.frame)}
#define WIN_Z1 ${f(WIN.z1 - WIN.frame)}
#define WIN_Y0 ${f(WIN.y0 + WIN.frame)}
#define WIN_Y1 ${f(WIN.y1 - WIN.frame)}
#define WIN_ZMID ${f(WIN.zMid)}
#define WIN_MUNTIN ${f(WIN.muntin)}
#define WIN_RAIL_Y ${f(WIN.railY)}
#define WIN_RAIL ${f(WIN.rail)}
#define WIN_SLAT_X ${f(WIN.slatX)}
#define WIN_SLAT_PITCH ${f(WIN.slatPitch)}
#define WIN_SLAT_W ${f(WIN.slatW)}
#define WIN_SLAT_TILT ${f(WIN.slatTilt)}
#define WIN_BLIND_TOP ${f(WIN.blindTop)}
#define WIN_BLIND_BOTTOM ${f(WIN.blindBottom)}

uniform vec3 uLampPos;
uniform vec3 uLampDir;
uniform vec3 uLampColor;
uniform vec2 uLampCone;
uniform vec3 uStreetPos;
uniform vec3 uStreetColor;
uniform vec3 uBoltPos;
uniform vec3 uBoltColor;

// Fraction of light from L (outside) that reaches p through the window.
float windowPass(vec3 p, vec3 L) {
  vec3 d = L - p;
  if (d.x <= 0.0) return 0.0;
  float t = (WIN_GLASS_X - p.x) / d.x;
  if (t < 0.0) return 0.0;
  vec3 q = p + d * t;
  const float e = 0.004;
  float m = smoothstep(WIN_Z0 - e, WIN_Z0 + e, q.z) * smoothstep(WIN_Z1 + e, WIN_Z1 - e, q.z)
          * smoothstep(WIN_Y0 - e, WIN_Y0 + e, q.y) * smoothstep(WIN_Y1 + e, WIN_Y1 - e, q.y);
  m *= smoothstep(WIN_MUNTIN * 0.5 - e, WIN_MUNTIN * 0.5 + e, abs(q.z - WIN_ZMID));
  m *= smoothstep(WIN_RAIL * 0.5 - e, WIN_RAIL * 0.5 + e, abs(q.y - WIN_RAIL_Y));
  if (m <= 0.0) return 0.0;

  // Blind slats: a slat tilted by a blocks rays of slope k within
  // |dy| < w/2 * |sin a - k cos a| of its centre line.
  float ts = (WIN_SLAT_X - p.x) / d.x;
  vec3 s = p + d * ts;
  if (s.y > WIN_BLIND_BOTTOM - 0.004 && s.y < WIN_BLIND_TOP) {
    float k = d.y / d.x;
    float halfBlock = 0.5 * WIN_SLAT_W * abs(sin(WIN_SLAT_TILT) - k * cos(WIN_SLAT_TILT));
    float fy = (fract((s.y - WIN_BLIND_BOTTOM) / WIN_SLAT_PITCH) - 0.5) * WIN_SLAT_PITCH;
    m *= smoothstep(halfBlock - 0.0015, halfBlock + 0.0015, abs(fy));
  }
  return m;
}

vec3 lampLight(vec3 p) {
  vec3 v = p - uLampPos;
  float d2 = dot(v, v);
  float c = dot(v * inversesqrt(d2), uLampDir);
  return uLampColor * smoothstep(uLampCone.x, uLampCone.y, c) / (d2 + 0.25);
}

vec3 roomLight(vec3 p) {
  vec3 s = p - uStreetPos;
  vec3 street = uStreetColor * windowPass(p, uStreetPos) / dot(s, s);
  // The flash is broad sky light, not a beam: keep its in-air glow well below
  // what it does to the surfaces it lands on.
  vec3 bolt = 0.4 * uBoltColor * windowPass(p, uBoltPos);
  return lampLight(p) + street + bolt;
}
`;

/** Shared uniform objects: every material spreading these sees the same values. */
export const lightUniforms = {
  uLampPos: { value: new THREE.Vector3() },
  uLampDir: { value: new THREE.Vector3(0, -1, 0) },
  uLampColor: { value: new THREE.Color() },
  uLampCone: { value: new THREE.Vector2(0.4, 0.8) },
  uStreetPos: { value: new THREE.Vector3() },
  uStreetColor: { value: new THREE.Color() },
  uBoltPos: { value: new THREE.Vector3() },
  uBoltColor: { value: new THREE.Color(0, 0, 0) },
};

export const timeUniform = { value: 0 };

export const HASH_GLSL = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 hash32(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), f.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
`;
