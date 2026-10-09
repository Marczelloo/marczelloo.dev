"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { CAMERA, WIN, fx } from "./layout";
import { HASH_GLSL, lightUniforms, timeUniform } from "./lightsGLSL";

// The window pane renders the whole outside world itself: a city backdrop and
// falling rain on virtual planes behind the glass (correct parallax as the
// camera moves), seen through a fogged pane with beaded and running drops that
// refract it. Lightning brightens the sky and reveals a bolt.

const glassVert = /* glsl */ `
varying vec3 vWorld;
varying vec2 vUv;
#include <fog_pars_vertex>
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`;

const glassFrag = /* glsl */ `
uniform sampler2D uCity;
uniform sampler2D uBolt;
uniform float uTime;
uniform float uFlash;
uniform float uBoltX;
uniform float uBoltFlip;
uniform vec3 uViewDir;   // fixed outward direction the backdrop faces
uniform vec3 uWinCenter;
uniform vec3 uLampPos;
uniform vec3 uLampColor;
varying vec3 vWorld;
varying vec2 vUv;
#include <fog_pars_fragment>
${HASH_GLSL}

// Plane perpendicular to uViewDir at a given distance behind the window.
// Returns plane coordinates in metres (x right, y up).
vec2 planeHit(vec3 ro, vec3 rd, float dist) {
  vec3 c = uWinCenter + uViewDir * dist;
  float t = dot(c - ro, uViewDir) / dot(rd, uViewDir);
  vec3 h = ro + rd * t - c;
  vec3 right = normalize(cross(uViewDir, vec3(0.0, 1.0, 0.0)));
  return vec2(dot(h, right), h.y);
}

// Beaded drops resting on the glass. xy = refraction offset, z = mask.
vec3 beads(vec2 p, float scale, float t) {
  p *= scale;
  vec2 id = floor(p);
  vec2 st = fract(p) - 0.5;
  vec3 n = hash32(id);
  vec2 c = (n.xy - 0.5) * 0.6;
  float r = mix(0.07, 0.27, n.z * n.z) * step(0.3, hash12(id + 17.31));
  float life = fract(t * (0.015 + 0.03 * n.x) + n.y);
  r *= smoothstep(0.0, 0.02, life) * (1.0 - 0.55 * life);
  vec2 d = st - c;
  d.y *= 1.12;
  float m = smoothstep(r, r * 0.55, length(d));
  return vec3(d / max(r, 1e-3) * m, m);
}

// Running drops with the clear trail they leave behind.
// xy = refraction offset, z = drop mask, w = cleared trail.
vec4 runnels(vec2 p, float t, float cols, float salt) {
  vec2 q = vec2(p.x * cols, p.y * cols * 0.25);
  float colId = floor(q.x);
  q.y += hash12(vec2(colId, salt)) * 9.0;
  vec2 id = floor(q);
  vec3 n = hash32(id + salt);
  float lx = fract(q.x) - 0.5;
  float ly = fract(q.y) * 4.0;
  if (n.x < 0.35) return vec4(0.0);

  float speed = 0.05 + 0.1 * n.y;
  float ph = fract(t * speed + n.z);
  float prog = ph + 0.04 * sin(ph * 6.2831 * 5.0 + n.x * 7.0);
  float dropY = 4.0 * (1.0 - clamp(prog, 0.0, 1.0));
  float wig = (n.z - 0.5) * 0.4;
  float pathHere = wig + 0.09 * sin(ly * 1.9 + n.x * 6.0) + 0.04 * sin(ly * 5.3 + n.y * 4.0);
  float pathDrop = wig + 0.09 * sin(dropY * 1.9 + n.x * 6.0) + 0.04 * sin(dropY * 5.3 + n.y * 4.0);

  float r = 0.16 + 0.12 * n.y;
  vec2 dp = vec2(lx - pathDrop, ly - dropY);
  dp.y *= dp.y > 0.0 ? 0.7 : 1.15;  // teardrop: tail drawn upward
  float fade = smoothstep(0.0, 0.04, ph) * smoothstep(1.0, 0.92, ph);
  float drop = smoothstep(r, r * 0.6, length(dp)) * fade;
  vec2 off = dp / r * drop;

  float above = ly - dropY;
  float trailW = r * 0.45;
  float trail = step(0.0, above) * smoothstep(trailW, trailW * 0.4, abs(lx - pathHere)) * smoothstep(2.6, 0.0, above) * fade;

  // Little beads stranded along the trail.
  float k = floor(ly * 3.5);
  float hk = hash12(vec2(k, colId + id.y * 13.0 + salt));
  vec2 dd = vec2(lx - pathHere, (fract(ly * 3.5) - 0.5) / 3.5);
  float br = 0.07 * hk * step(0.0, above) * smoothstep(2.6, 0.2, above) * step(0.4, hk) * fade;
  float bead = smoothstep(br, br * 0.4, length(dd));
  off += dd / max(br, 1e-3) * bead;
  return vec4(off, max(drop, bead), trail);
}

// Rain streaks on a backdrop plane, coordinates in metres.
float rainSheet(vec2 p, float t, float density, float len, float speed, float salt) {
  p.x += p.y * 0.07;
  vec2 q = vec2(p.x * density, p.y);
  float col = floor(q.x);
  vec3 n = hash32(vec2(col, salt));
  float y = q.y + t * speed * (0.8 + 0.4 * n.x) + n.y * 40.0;
  float cell = y / len;
  float fy = fract(cell);
  float on = step(0.55, hash12(vec2(col, floor(cell) + salt)));
  float streak = smoothstep(0.0, 0.15, fy) * smoothstep(1.0, 0.45, fy);
  float fx = abs(fract(q.x) - 0.5 - (n.z - 0.5) * 0.7);
  return streak * on * smoothstep(0.09, 0.0, fx);
}

void main() {
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vWorld - ro);
  float t = uTime;

  // --- water on the pane (glass coordinates in metres: x = world z, y = up)
  vec2 g = vec2(vWorld.z, vWorld.y);
  vec3 b1 = beads(g, 46.0, t);
  vec3 b2 = beads(g + 3.7, 105.0, t * 1.3);
  vec4 r1 = runnels(g, t, 28.0, 1.0);
  vec4 r2 = runnels(g + 1.3, t * 1.15, 47.0, 7.0);
  vec2 off = b1.xy + b2.xy * 0.6 + r1.xy + r2.xy;
  float dropMask = clamp(b1.z + b2.z + r1.z + r2.z, 0.0, 1.0);
  float clear = clamp(r1.w + r2.w * 0.8, 0.0, 1.0);
  // Condensation is thicker towards the bottom and the frame.
  float edge = smoothstep(0.0, 0.08, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  float fogAmt = (1.0 - clear) * (1.0 - dropMask) * mix(0.75, 1.0, smoothstep(0.7, 0.0, vUv.y)) ;

  // --- outside: city backdrop
  vec2 cityP = planeHit(ro, rd, 22.0);
  vec2 cityUv = vec2(cityP.x / 30.0 + 0.5, (cityP.y + 1.0) / 20.0 + 0.36);
  cityUv -= off * 0.035;
  float lod = mix(0.0, 5.0, fogAmt);
  vec3 col = textureLod(uCity, cityUv, lod).rgb;
  float sky = smoothstep(0.55, 0.9, cityUv.y);

  // Lightning: the whole sky lights up, buildings stay silhouettes.
  vec2 boltP = planeHit(ro, rd, 60.0);
  vec2 boltUv = vec2((boltP.x / 26.0 + 0.5 - (uBoltX - 0.5)) * uBoltFlip, boltP.y / 34.0 + 0.12);
  boltUv.x = uBoltFlip > 0.0 ? boltUv.x : 1.0 + boltUv.x;
  float inBolt = step(0.0, boltUv.x) * step(boltUv.x, 1.0) * step(0.0, boltUv.y) * step(boltUv.y, 1.0);
  vec3 boltCol = textureLod(uBolt, boltUv, lod * 0.7).rgb * inBolt;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col += uFlash * (vec3(0.55, 0.62, 0.85) * (0.6 * sky + 0.15) * (0.4 + lum) + col * 1.6);
  col += boltCol * uFlash * 3.0 * sky;

  // Rain falling between us and the city, three depths.
  float rain = 0.0;
  rain += rainSheet(planeHit(ro, rd, 2.0), t, 9.0, 0.5, 7.0, 3.0) * 0.6;
  rain += rainSheet(planeHit(ro, rd, 5.0), t, 6.0, 0.9, 8.0, 11.0) * 0.45;
  rain += rainSheet(planeHit(ro, rd, 11.0), t, 3.5, 1.4, 9.0, 19.0) * 0.3;
  col += rain * (vec3(0.18, 0.21, 0.27) + uFlash * vec3(0.9, 1.0, 1.2)) * mix(1.0, 0.35, fogAmt);

  // --- condensation haze, lit by the room
  vec3 haze = textureLod(uCity, cityUv, 6.5).rgb * 1.3 + vec3(0.012, 0.014, 0.02);
  vec3 lampDir = normalize(uLampPos - vWorld);
  haze += uLampColor * 0.0009 * max(0.0, dot(lampDir, vec3(-1.0, 0.0, 0.0)));
  haze += uFlash * vec3(0.25, 0.28, 0.36);
  col = mix(col, haze, fogAmt * 0.55);

  // Drops pick up glints from the lamp and the flash.
  vec3 nrm = normalize(vec3(-1.0, off.y * 0.8, off.x * 0.8));
  vec3 h = normalize(lampDir - rd);
  float spec = pow(max(dot(nrm, h), 0.0), 60.0) * dropMask;
  col += spec * (uLampColor * 0.012 + uFlash * vec3(1.5, 1.7, 2.0));
  col *= mix(0.55, 1.0, edge);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`;

export function WindowGlass() {
  const [city, bolt] = useTexture(["/case/tex/city.jpg", "/case/tex/bolt.jpg"]);

  const material = useMemo(() => {
    for (const t of [city, bolt]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.needsUpdate = true;
    }
    const winCenter = new THREE.Vector3(WIN.glassX, (WIN.y0 + WIN.y1) / 2, (WIN.z0 + WIN.z1) / 2);
    // The backdrop faces the board-view camera so it isn't seen at a grazing angle.
    const viewDir = winCenter.clone().sub(CAMERA.board.position).setY(0).normalize();
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uCity: { value: city },
          uBolt: { value: bolt },
          uFlash: { value: 0 },
          uBoltX: { value: 0.5 },
          uBoltFlip: { value: 1 },
          uViewDir: { value: viewDir },
          uWinCenter: { value: winCenter },
        },
      ]),
      vertexShader: glassVert,
      fragmentShader: glassFrag,
      fog: true,
    });
  }, [city, bolt]);

  // Shared uniforms are attached after merge() so they stay linked, not copied.
  useMemo(() => {
    material.uniforms.uTime = timeUniform;
    material.uniforms.uLampPos = lightUniforms.uLampPos;
    material.uniforms.uLampColor = lightUniforms.uLampColor;
  }, [material]);

  useFrame(() => {
    material.uniforms.uFlash.value = fx.flash;
    material.uniforms.uBoltX.value = fx.boltX;
    material.uniforms.uBoltFlip.value = fx.boltFlip;
  });

  const w = WIN.z1 - WIN.z0 - WIN.frame * 2 + 0.02;
  const h = WIN.y1 - WIN.y0 - WIN.frame * 2 + 0.02;
  return (
    <mesh
      position={[WIN.glassX, (WIN.y0 + WIN.y1) / 2, (WIN.z0 + WIN.z1) / 2]}
      rotation={[0, -Math.PI / 2, 0]}
      material={material}
    >
      <planeGeometry args={[w, h]} />
    </mesh>
  );
}
