import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import * as THREE from "three";
import { ROOM } from "./layout";
import { HASH_GLSL, LIGHTS_GLSL, lightUniforms, timeUniform } from "./lightsGLSL";

// Volumetric haze. The room box is ray-marched at half resolution from the
// camera to whatever the depth buffer says is in the way, accumulating
// in-scattered light from the analytic lights, then added over the frame.
// Running inside the composer gives the march the scene depth, so haze stops
// at the lamp or a card held up to the face instead of being drawn over them.

const BOX_MIN = new THREE.Vector3(-2.8, 0.03, 0.075);
const BOX_MAX = new THREE.Vector3(ROOM.rightX - 0.065, ROOM.ceilY - 0.03, ROOM.frontZ - 0.1);

/** Lattice cells along each side of the tiling noise volume, and texels per cell. */
const NOISE_CELLS = 16;
const NOISE_RES = 64;

/** Tileable smooth value noise baked once, so a march step is one texture fetch instead of eight hashes. */
function bakeNoise() {
  const C = NOISE_CELLS;
  const lattice = new Float32Array(C * C * C);
  let s = 0x2f6b1d;
  for (let i = 0; i < lattice.length; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    lattice[i] = s / 4294967296;
  }
  const at = (x: number, y: number, z: number) => lattice[(x % C) + (y % C) * C + (z % C) * C * C];
  const fade = (t: number) => t * t * (3 - 2 * t);
  const R = NOISE_RES;
  const data = new Uint8Array(R * R * R);
  for (let z = 0; z < R; z++) {
    for (let y = 0; y < R; y++) {
      for (let x = 0; x < R; x++) {
        const px = (x / R) * C;
        const py = (y / R) * C;
        const pz = (z / R) * C;
        const ix = Math.floor(px);
        const iy = Math.floor(py);
        const iz = Math.floor(pz);
        const fx = fade(px - ix);
        const fy = fade(py - iy);
        const fz = fade(pz - iz);
        const l = (a: number, b: number, t: number) => a + (b - a) * t;
        const v = l(
          l(l(at(ix, iy, iz), at(ix + 1, iy, iz), fx), l(at(ix, iy + 1, iz), at(ix + 1, iy + 1, iz), fx), fy),
          l(l(at(ix, iy, iz + 1), at(ix + 1, iy, iz + 1), fx), l(at(ix, iy + 1, iz + 1), at(ix + 1, iy + 1, iz + 1), fx), fy),
          fz,
        );
        data[x + y * R + z * R * R] = Math.round(v * 255);
      }
    }
  }
  const tex = new THREE.Data3DTexture(data, R, R, R);
  tex.format = THREE.RedFormat;
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return tex;
}

const marchVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const marchFrag = /* glsl */ `
#include <packing>
uniform sampler2D tDepth;
uniform highp sampler3D tNoise;
uniform float uNear;
uniform float uFar;
uniform mat4 uProjInv;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform vec3 uBoxMin;
uniform vec3 uBoxMax;
uniform float uTime;
uniform float uDensity;
varying vec2 vUv;
${LIGHTS_GLSL}
${HASH_GLSL}

#define STEPS 32
#define NOISE_SCALE ${(1 / NOISE_CELLS).toFixed(5)}

float readDepth(vec2 uv) {
#if DEPTH_PACKING == 3201
  return unpackRGBAToDepth(texture2D(tDepth, uv));
#else
  return texture2D(tDepth, uv).r;
#endif
}

void main() {
  vec4 v = uProjInv * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 viewDir = normalize(v.xyz / v.w);
  vec3 rd = normalize((uCamWorld * vec4(viewDir, 0.0)).xyz);
  vec3 ro = uCamPos;

  float depth = readDepth(vUv);
  float tScene = depth >= 1.0 ? 1e5 : -perspectiveDepthToViewZ(depth, uNear, uFar) / max(1e-4, -viewDir.z);

  vec3 inv = 1.0 / rd;
  vec3 a = (uBoxMin - ro) * inv;
  vec3 b = (uBoxMax - ro) * inv;
  vec3 lo = min(a, b);
  vec3 hi = max(a, b);
  float t0 = max(max(max(lo.x, lo.y), lo.z), 0.0);
  float t1 = min(min(min(hi.x, hi.y), hi.z), tScene);
  if (t1 <= t0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float stepLen = (t1 - t0) / float(STEPS);
  float jitter = hash13(vec3(gl_FragCoord.xy, fract(uTime * 13.7) * 91.0));
  vec3 drift = vec3(uTime * 0.021, -uTime * 0.013, uTime * 0.017);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < STEPS; i++) {
    vec3 p = ro + rd * (t0 + (float(i) + jitter) * stepLen);
    float n = texture(tNoise, (p * 1.35 + drift) * NOISE_SCALE).r * 0.65
            + texture(tNoise, (p * 3.1 - drift * 1.7) * NOISE_SCALE).r * 0.35;
    // Stale smoke pools under the ceiling.
    float dens = uDensity * (0.35 + 1.3 * n * n) * (1.0 + 1.2 * smoothstep(2.3, 3.5, p.y));
    acc += roomLight(p) * dens;
  }
  gl_FragColor = vec4(acc * stepLen, 1.0);
}
`;

const compositeFrag = /* glsl */ `
uniform sampler2D tVolume;
uniform vec2 uTexel;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // A small tent filter while upsampling hides the per-pixel march jitter.
  vec3 v = texture2D(tVolume, uv).rgb * 0.4
         + (texture2D(tVolume, uv + uTexel * vec2(0.75, 0.75)).rgb
          + texture2D(tVolume, uv + uTexel * vec2(-0.75, 0.75)).rgb
          + texture2D(tVolume, uv + uTexel * vec2(0.75, -0.75)).rgb
          + texture2D(tVolume, uv + uTexel * vec2(-0.75, -0.75)).rgb) * 0.15;
  outputColor = vec4(inputColor.rgb + v, inputColor.a);
}
`;

export class VolumeEffect extends Effect {
  private readonly target: THREE.WebGLRenderTarget;
  private readonly march: THREE.ShaderMaterial;
  private readonly quad: THREE.Mesh;
  private readonly quadScene = new THREE.Scene();
  private readonly quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly noise: THREE.Data3DTexture;

  constructor(private readonly camera: THREE.PerspectiveCamera) {
    super("VolumeEffect", compositeFrag, {
      attributes: EffectAttribute.DEPTH,
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, THREE.Uniform>([
        ["tVolume", new THREE.Uniform(null)],
        ["uTexel", new THREE.Uniform(new THREE.Vector2())],
      ]),
    });
    this.target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      depthBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    this.noise = bakeNoise();
    this.march = new THREE.ShaderMaterial({
      uniforms: {
        ...lightUniforms,
        uTime: timeUniform,
        uDensity: { value: 0.055 },
        tDepth: { value: null },
        tNoise: { value: this.noise },
        uNear: { value: 0.1 },
        uFar: { value: 100 },
        uProjInv: { value: new THREE.Matrix4() },
        uCamWorld: { value: new THREE.Matrix4() },
        uCamPos: { value: new THREE.Vector3() },
        uBoxMin: { value: BOX_MIN },
        uBoxMax: { value: BOX_MAX },
      },
      defines: { DEPTH_PACKING: 0 },
      vertexShader: marchVert,
      fragmentShader: marchFrag,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.march);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
    this.uniforms.get("tVolume")!.value = this.target.texture;
  }

  override setDepthTexture(depthTexture: THREE.Texture, depthPacking: THREE.DepthPackingStrategies = THREE.BasicDepthPacking) {
    this.march.uniforms.tDepth.value = depthTexture;
    this.march.defines.DEPTH_PACKING = depthPacking;
    this.march.needsUpdate = true;
  }

  override setSize(width: number, height: number) {
    const w = Math.max(1, Math.round(width / 2));
    const h = Math.max(1, Math.round(height / 2));
    this.target.setSize(w, h);
    this.uniforms.get("uTexel")!.value.set(1 / w, 1 / h);
  }

  override update(renderer: THREE.WebGLRenderer) {
    const u = this.march.uniforms;
    const cam = this.camera;
    u.uNear.value = cam.near;
    u.uFar.value = cam.far;
    u.uProjInv.value.copy(cam.projectionMatrixInverse);
    u.uCamWorld.value.copy(cam.matrixWorld);
    u.uCamPos.value.setFromMatrixPosition(cam.matrixWorld);
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(this.target);
    renderer.render(this.quadScene, this.quadCamera);
    renderer.setRenderTarget(prev);
  }

  override dispose() {
    super.dispose();
    this.target.dispose();
    this.march.dispose();
    this.quad.geometry.dispose();
    this.noise.dispose();
  }
}
