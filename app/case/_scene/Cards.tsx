"use client";

import { useTexture } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, use, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BOTTOM_PIN, CARDS, STRINGS, type CaseCard } from "../content";
import { caseActions, caseStore } from "../store";
import { BOARD_FRONT_Z, cardBoardPosition, cardPinPosition, cardSize } from "./layout";
import { type CardFace, loadCardFaces } from "./cardTextures";

const DEG = Math.PI / 180;

/** Inspect-mode manipulation shared by the drag handler and the active card. */
const inspect = { yaw: 0, pitch: 0, zoom: 1, dragging: false };
/** Distance from the eye a card is held at in inspect mode, metres. */
const HELD_DIST = 0.3;

/** Exponential damping factor for a rate `lambda` over `dt` seconds. */
const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

/** Height of paper off its own plane at (u, v): it bows away from the cork below the pin and curls at the corners. */
export function paperCurl(seed: number, stiffness: number) {
  const s1 = Math.sin(seed * 12.9898) * 0.5 + 0.5;
  const s2 = Math.sin(seed * 78.233) * 0.5 + 0.5;
  return (u: number, v: number) => {
    const below = 1 - v;
    const side = Math.abs(u * 2 - 1);
    let z = below * below * (0.006 + 0.006 * s1);
    z += Math.pow(side, 3) * below * (0.004 + 0.006 * s2);
    z += 0.0012 * Math.sin(u * 5.2 + seed) * below;
    // A dog-eared bottom corner on the softer sheets.
    const corner = Math.max(0, 1 - Math.hypot(u - (s1 > 0.5 ? 1 : 0), v) / 0.22);
    z += corner * corner * 0.012 * (1 - stiffness);
    return z * (1 - stiffness * 0.7);
  };
}

export function curledPlane(w: number, h: number, curl: (u: number, v: number) => number) {
  const g = new THREE.PlaneGeometry(w, h, 18, 22);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, curl(pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5));
  g.computeVertexNormals();
  return g;
}

/**
 * Everything flat on the board that yarn has to pass over: the object, its
 * size in its own xy plane, and how far its surface stands off that plane.
 */
export type BoardSurface = { object: THREE.Object3D; w: number; h: number; height: (u: number, v: number) => number };
export const boardSurfaces = new Set<BoardSurface>();

/** Registers an object as a surface yarn drapes over, for as long as the component is mounted. */
export function useBoardSurface(ref: RefObject<THREE.Object3D | null>, w: number, h: number, height: (u: number, v: number) => number) {
  useEffect(() => {
    const object = ref.current;
    if (!object) return;
    const entry = { object, w, h, height };
    boardSurfaces.add(entry);
    return () => {
      boardSurfaces.delete(entry);
    };
  }, [ref, w, h, height]);
}

export function PinHead({ kind, color = "#a8121a" }: { kind: "pin" | "tack"; color?: string }) {
  if (kind === "tack") {
    return (
      <group>
        <mesh position={[0, 0, 0.0012]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.0078, 0.0082, 0.0016, 28]} />
          <meshStandardMaterial color="#b08a45" metalness={1} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0, 0.0024]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.0055, 0.0078, 0.0012, 28]} />
          <meshStandardMaterial color="#c79c52" metalness={1} roughness={0.26} />
        </mesh>
      </group>
    );
  }
  return (
    <group rotation-x={-0.22}>
      <mesh position={[0, 0, 0.006]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.0007, 0.0007, 0.012, 6]} />
        <meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.0125]} scale={[1, 1, 0.92]} castShadow>
        <sphereGeometry args={[0.0058, 24, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.22} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
    </group>
  );
}

type CardProps = { card: CaseCard; index: number; face: CardFace; normal: THREE.Texture; manilaNormal: THREE.Texture };

function Card({ card, index, face, normal, manilaNormal }: CardProps) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const lift = useRef(0);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const [w, h] = cardSize(card);

  const curl = useMemo(() => {
    const stiff = card.kind === "photo" ? 0.85 : card.kind === "manila" || card.kind === "index" ? 0.45 : 0.1;
    return paperCurl(index * 1.7 + 0.3, stiff);
  }, [card.kind, index]);
  const geometry = useMemo(() => curledPlane(w, h, curl), [w, h, curl]);
  useBoardSurface(group, w, h, curl);

  const { front, back } = useMemo(() => {
    const n = (card.kind === "manila" ? manilaNormal : normal).clone();
    n.wrapS = n.wrapT = THREE.RepeatWrapping;
    n.repeat.set(w / 0.3, h / 0.3);
    n.needsUpdate = true;
    const common = {
      normalMap: n,
      normalScale: new THREE.Vector2(0.45, 0.45),
      roughness: card.kind === "photo" ? 1 : 0.88,
      alphaTest: card.kind === "note" ? 0.5 : 0,
      envMapIntensity: 0.6,
    };
    return {
      front: new THREE.MeshStandardMaterial({ ...common, map: face.map, roughnessMap: face.roughness ?? null }),
      back: new THREE.MeshStandardMaterial({ ...common, map: face.back, side: THREE.BackSide, roughness: card.kind === "photo" ? 0.7 : 0.9 }),
    };
  }, [card.kind, face, normal, manilaNormal, w, h]);

  const pose = useMemo(() => {
    const pos = cardBoardPosition(card, index);
    const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, card.tilt * DEG));
    // Pivot at the pin so hover lifts the paper off the cork from the top.
    const pin = cardPinPosition(card, index);
    return { pos, quat, pin };
  }, [card, index]);

  const tmp = useMemo(
    () => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), f: new THREE.Vector3(), e: new THREE.Euler(), lq: new THREE.Quaternion() }),
    [],
  );

  useFrame(({ gl }, dt) => {
    const g = group.current;
    if (!g) return;
    dt = Math.min(dt, 1 / 20);
    const s = caseStore.get();
    const active = s.activeId === card.id;

    if (active && s.mode === "inspect") {
      // Held in front of the camera, sized to fill most of the view. The focus
      // camera is closer to the board than a full-size card would need, so the
      // card is scaled down and brought nearer instead; perspective makes the
      // two indistinguishable, and it can never end up behind the cork.
      const fov = camera.fov * DEG;
      // The transcript panel (480px, right side) covers part of a wide view; fit the card into the rest.
      const viewW = gl.domElement.clientWidth;
      const panel = s.transcriptOpen && camera.aspect > 1.1 ? Math.min(480, viewW * 0.92) / viewW : 0;
      const fitH = h / (0.66 * 2 * Math.tan(fov / 2));
      const fitW = w / ((panel ? 0.84 * (1 - panel) : 0.66) * 2 * Math.tan(fov / 2) * camera.aspect);
      const scale = HELD_DIST / Math.max(fitH, fitW);
      camera.getWorldDirection(tmp.f);
      tmp.p.copy(camera.position).addScaledVector(tmp.f, HELD_DIST * inspect.zoom);
      // Slide over to the middle of the free side.
      if (panel) {
        const halfW = HELD_DIST * inspect.zoom * Math.tan(fov / 2) * camera.aspect;
        tmp.f.set(1, 0, 0).applyQuaternion(camera.quaternion);
        tmp.p.addScaledVector(tmp.f, -panel * halfW);
      }
      tmp.e.set(inspect.pitch, inspect.yaw + (s.flipped ? Math.PI : 0), 0, "YXZ");
      tmp.q.copy(camera.quaternion).multiply(tmp.lq.setFromEuler(tmp.e));
      g.position.lerp(tmp.p, damp(7, dt));
      g.quaternion.slerp(tmp.q, damp(7, dt));
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, scale, damp(7, dt)));
      return;
    }
    if (g.scale.x !== 1) g.scale.setScalar(Math.abs(g.scale.x - 1) < 1e-4 ? 1 : THREE.MathUtils.lerp(g.scale.x, 1, damp(6, dt)));

    const wantLift = hovered.current && s.mode !== "inspect" && s.entered ? 1 : 0;
    lift.current += (wantLift - lift.current) * damp(10, dt);
    // Lifting rotates the paper about its pin, so the bottom swings off the cork.
    tmp.lq.setFromAxisAngle(tmp.f.set(1, 0, 0).applyQuaternion(pose.quat), -lift.current * 0.12);
    tmp.q.copy(tmp.lq).multiply(pose.quat);
    tmp.p.copy(pose.pos).sub(pose.pin).applyQuaternion(tmp.lq).add(pose.pin);
    tmp.p.z = Math.max(tmp.p.z, pose.pos.z) + lift.current * 0.004;
    const returning = g.position.distanceToSquared(tmp.p) > 1e-6;
    g.position.lerp(tmp.p, damp(returning ? 6 : 12, dt));
    g.quaternion.slerp(tmp.q, damp(returning ? 6 : 12, dt));
  });

  useEffect(() => {
    if (group.current) {
      group.current.position.copy(pose.pos);
      group.current.quaternion.copy(pose.quat);
    }
  }, [pose]);

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const s = caseStore.get();
    if (!s.entered || s.mode === "inspect") return;
    hovered.current = true;
    if (s.hoveredId !== card.id) caseStore.set({ hoveredId: card.id });
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    hovered.current = false;
    if (caseStore.get().hoveredId === card.id) caseStore.set({ hoveredId: null });
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const s = caseStore.get();
    if (!s.entered || s.mode === "inspect" || e.delta > 6) return;
    if (s.mode === "focus" && s.activeId === card.id) {
      inspect.yaw = 0;
      inspect.pitch = 0;
      inspect.zoom = 1;
      caseActions.inspect();
    } else caseActions.focus(card.id);
  };

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={front} castShadow receiveShadow onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} />
      <mesh geometry={geometry} material={back} receiveShadow />
    </group>
  );
}

const YARN_RADIUS = 0.0013;
/** World size of one screen pixel per metre of view depth; kept current by <Cards>. */
const yarnPixel = { value: 0.001 };
/** Samples along each string that are tested against the paper underneath. */
const YARN_SAMPLES = 48;

/**
 * Red yarn between two pins. It is pulled taut over whatever lies between
 * them: every frame the paper under each sample is measured and the string
 * follows the upper convex hull of those heights, so it drapes over a card
 * lifted on hover instead of cutting through it.
 */
function Yarn({ a, b, yarnBump }: { a: THREE.Vector3; b: THREE.Vector3; yarnBump: THREE.Texture }) {
  const len = a.distanceTo(b);
  const tubular = Math.max(32, Math.round(len * 110));

  const work = useMemo(() => {
    const base: THREE.Vector3[] = [];
    for (let i = 0; i <= YARN_SAMPLES; i++) {
      const t = i / YARN_SAMPLES;
      const p = a.clone().lerp(b, t);
      const bow = 4 * t * (1 - t);
      p.y -= bow * len * 0.012;
      p.z += 0.0055 + bow * 0.002;
      base.push(p);
    }
    return {
      base,
      pts: base.map((p) => p.clone()),
      need: new Float32Array(base.length),
      prev: new Float32Array(base.length).fill(-1),
      hull: [] as number[],
      inv: new THREE.Matrix4(),
      o: new THREE.Vector3(),
      d: new THREE.Vector3(),
      q: new THREE.Vector3(),
    };
  }, [a, b, len]);

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(work.base), tubular, YARN_RADIUS, 6, false);
    const bump = yarnBump.clone();
    bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
    bump.repeat.set(len / 0.004, 1);
    bump.needsUpdate = true;
    const material = new THREE.MeshPhysicalMaterial({
      color: "#8a1016",
      roughness: 0.82,
      sheen: 1,
      sheenColor: new THREE.Color("#ff5a4a"),
      sheenRoughness: 0.55,
      bumpMap: bump,
      bumpScale: 1.6,
    });
    // From across the room the strand is thinner than a pixel and breaks up
    // into dashes; fatten it to stay about a pixel and a half wide on screen.
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uYarnPixel = yarnPixel;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uYarnPixel;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float yarnDepth = -(modelViewMatrix * vec4(transformed, 1.0)).z;
          transformed += objectNormal * max(0.0, 0.75 * yarnDepth * uYarnPixel - ${YARN_RADIUS.toFixed(5)});`,
        );
    };
    return { geometry, material };
  }, [work, tubular, len, yarnBump]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.bumpMap?.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(() => {
    const { base, pts, need, prev, hull, inv, o, d, q } = work;
    const n = base.length;
    for (let i = 0; i < n; i++) need[i] = base[i].z;

    for (const s of boardSurfaces) {
      const obj = s.object;
      // A card held up to the camera, or on its way there, is off the board.
      if (obj.scale.x !== 1 || obj.position.z > BOARD_FRONT_Z + 0.09) continue;
      obj.updateWorldMatrix(true, false);
      inv.copy(obj.matrixWorld).invert();
      d.set(0, 0, 1).transformDirection(inv);
      if (Math.abs(d.z) < 0.2) continue;
      for (let i = 1; i < n - 1; i++) {
        o.set(base[i].x, base[i].y, BOARD_FRONT_Z).applyMatrix4(inv);
        const t = -o.z / d.z;
        const x = o.x + d.x * t;
        const y = o.y + d.y * t;
        const u = x / s.w + 0.5;
        const v = y / s.h + 0.5;
        if (u < -0.01 || u > 1.01 || v < -0.01 || v > 1.01) continue;
        q.set(x, y, s.height(THREE.MathUtils.clamp(u, 0, 1), THREE.MathUtils.clamp(v, 0, 1))).applyMatrix4(obj.matrixWorld);
        need[i] = Math.max(need[i], q.z + YARN_RADIUS + 0.0007);
      }
    }

    // Upper convex hull of (sample, height): a taut string over the obstacles.
    hull.length = 0;
    for (let i = 0; i < n; i++) {
      while (hull.length >= 2) {
        const i0 = hull[hull.length - 2];
        const i1 = hull[hull.length - 1];
        if ((need[i1] - need[i0]) * (i - i0) <= (need[i] - need[i0]) * (i1 - i0)) hull.pop();
        else break;
      }
      hull.push(i);
    }
    let changed = false;
    for (let k = 0; k < hull.length - 1; k++) {
      const i0 = hull[k];
      const i1 = hull[k + 1];
      for (let i = i0; i <= i1; i++) {
        const z = need[i0] + ((need[i1] - need[i0]) * (i - i0)) / (i1 - i0);
        pts[i].z = z;
        if (Math.abs(z - prev[i]) > 2e-5) changed = true;
        prev[i] = z;
      }
    }
    if (!changed) return;

    // Same segment counts every time, so the new tube is copied into the old buffers.
    const next = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), tubular, YARN_RADIUS, 6, false);
    for (const name of ["position", "normal"] as const) {
      const attr = geometry.attributes[name] as THREE.BufferAttribute;
      (attr.array as Float32Array).set(next.attributes[name].array as Float32Array);
      attr.needsUpdate = true;
    }
    next.dispose();
    geometry.computeBoundingSphere();
  });

  return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
}

function useYarnBump() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 16;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 64, 16);
    // Twisted plies: diagonal ridges along the strand.
    for (let i = -2; i < 6; i++) {
      const g = ctx.createLinearGradient(i * 16, 0, i * 16 + 16, 16);
      g.addColorStop(0, "#303030");
      g.addColorStop(0.5, "#e0e0e0");
      g.addColorStop(1, "#303030");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(i * 16, 16);
      ctx.lineTo(i * 16 + 16, 0);
      ctx.lineTo(i * 16 + 26, 0);
      ctx.lineTo(i * 16 + 10, 16);
      ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.NoColorSpace;
    return t;
  }, []);
}

/** Drag to turn the held card, wheel to bring it closer. */
function useInspectControls() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    let lastX = 0;
    let lastY = 0;
    const down = (e: PointerEvent) => {
      if (caseStore.get().mode !== "inspect") return;
      inspect.dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!inspect.dragging) return;
      const k = 3 / Math.max(320, Math.min(el.clientWidth, el.clientHeight));
      inspect.yaw += (e.clientX - lastX) * k;
      inspect.pitch = THREE.MathUtils.clamp(inspect.pitch + (e.clientY - lastY) * k, -1.1, 1.1);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      inspect.dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const wheel = (e: WheelEvent) => {
      if (caseStore.get().mode !== "inspect") return;
      e.preventDefault();
      inspect.zoom = THREE.MathUtils.clamp(inspect.zoom * Math.exp(e.deltaY * 0.0012), 0.55, 1.5);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false });
    // Entering inspect (from the keyboard too) starts square-on.
    let prevMode = caseStore.get().mode;
    const unsub = caseStore.subscribe(() => {
      const { mode } = caseStore.get();
      if (mode === "inspect" && prevMode !== "inspect") {
        inspect.yaw = 0;
        inspect.pitch = 0;
        inspect.zoom = 1;
      }
      prevMode = mode;
    });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
      unsub();
    };
  }, [gl]);

  // Let go of the drag rotation slowly when the user isn't holding the card.
  useFrame((_, dt) => {
    if (inspect.dragging) return;
    const k = damp(1.5, Math.min(dt, 0.05));
    inspect.pitch -= inspect.pitch * k;
  });
}

export function Cards() {
  const gl = useThree((s) => s.gl);
  const faces = use(loadCardFaces(gl.capabilities.getMaxAnisotropy()));
  const [normal, manilaNormal] = useTexture(["/case/tex/paper_nor.jpg", "/case/tex/manila_nor.jpg"]);
  const yarnBump = useYarnBump();
  useInspectControls();
  useFrame(({ camera, gl }) => {
    const fov = (camera as THREE.PerspectiveCamera).fov * DEG;
    yarnPixel.value = (2 * Math.tan(fov / 2)) / Math.max(1, gl.domElement.height);
  });

  // Pin heads sit on their own card, so stacked cards get taller pins. Cards a string
  // leaves from the bottom of get a second pin there.
  const pins = useMemo(() => {
    const map = new Map<string, { pos: THREE.Vector3; card: CaseCard }>();
    const ends = new Set(STRINGS.flat());
    CARDS.forEach((c, i) => {
      for (const bottom of [false, true]) {
        const id = bottom ? c.id + BOTTOM_PIN : c.id;
        if (bottom && !ends.has(id)) continue;
        const pos = cardPinPosition(c, i, undefined, bottom);
        pos.z = BOARD_FRONT_Z + 0.0035 + i * 0.0009;
        map.set(id, { pos, card: c });
      }
    });
    return map;
  }, []);

  return (
    <group>
      {CARDS.map((card, i) => (
        <Card key={card.id} card={card} index={i} face={faces.get(card.id)!} normal={normal} manilaNormal={manilaNormal} />
      ))}
      {[...pins].map(([id, { pos, card }]) => (
        <group key={id} position={pos}>
          <PinHead kind={card.kind === "photo" || card.kind === "note" ? "tack" : "pin"} />
        </group>
      ))}
      {STRINGS.map(([from, to]) => (
        <Yarn key={`${from}-${to}`} a={pins.get(from)!.pos} b={pins.get(to)!.pos} yarnBump={yarnBump} />
      ))}
    </group>
  );
}
