"use client";

import { RoundedBox, useTexture } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, use, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PinHead, curledPlane, paperCurl, useBoardSurface } from "./Cards";
import { caseActions, caseStore } from "../store";
import { BOARD, BOARD_FRONT_Z, exhibitFrames } from "./layout";
import { type PropName, loadPropTextures, propSize } from "./propTextures";

// Clutter around the cards, so the board reads as worked on rather than laid
// out: clippings, a map, a receipt and notes that the yarn drapes over like any
// card, plus a few solid things - a floppy, a matchbook, a key, spare pins.

const DEG = Math.PI / 180;

type Textures = Record<PropName, THREE.CanvasTexture>;
type Height = (x: number, y: number) => number;

const smooth = (e0: number, e1: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Board-local (x, y) from the board centre to world coordinates. */
const onBoard = (at: readonly [number, number], z: number) => [BOARD.center.x + at[0], BOARD.center.y + at[1], z] as const;

/** What the camera frames when an exhibit is focused: board-local centre and size, metres. */
const FRAMES: Record<string, { at: readonly [number, number]; size: readonly [number, number] }> = {
  newspaper: { at: [-0.55, -0.15], size: [0.27, 0.36] },
  map: { at: [-0.84, 0.64], size: [0.39, 0.29] },
  stickyFriday: { at: [-0.37, 0.63], size: [0.14, 0.14] },
  fingerprints: { at: [0.44, 0.68], size: [0.25, 0.17] },
  receipt: { at: [-0.6, -0.6], size: [0.12, 0.24] },
  stickyDns: { at: [0.87, -0.7], size: [0.14, 0.14] },
  matchbook: { at: [-0.43, -0.73], size: [0.1, 0.11] },
  floppy: { at: [0.27, -0.56], size: [0.13, 0.13] },
  key: { at: [1.145, 0.56], size: [0.14, 0.14] },
};

/** Makes its children one piece of evidence: hover lifts it a touch, a click zooms the camera in on it. */
function Exhibit({ id, children }: { id: string; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);

  useEffect(() => {
    const { at, size } = FRAMES[id];
    exhibitFrames.set(id, { center: new THREE.Vector3(...onBoard(at, BOARD_FRONT_Z)), w: size[0], h: size[1] });
    return () => {
      exhibitFrames.delete(id);
    };
  }, [id]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const want = hovered.current && caseStore.get().mode !== "inspect" ? 0.0025 : 0;
    g.position.z += (want - g.position.z) * (1 - Math.exp(-Math.min(dt, 1 / 20) * 10));
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const s = caseStore.get();
    if (!s.entered || s.mode === "inspect") return;
    hovered.current = true;
    if (s.hoveredId !== id) caseStore.set({ hoveredId: id });
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    hovered.current = false;
    if (caseStore.get().hoveredId === id) caseStore.set({ hoveredId: null });
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const s = caseStore.get();
    if (!s.entered || s.mode === "inspect" || e.delta > 6 || s.activeId === id) return;
    caseActions.focus(id);
  };

  return (
    <group ref={group} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {children}
    </group>
  );
}

/**
 * A strip of tape laid over whatever is under it: `height` gives the surface
 * at each point in the parent's plane, so it bends over an edge onto the cork.
 */
function Tape({ x, y, angle, height, material, len = 0.06 }: { x: number; y: number; angle: number; height: Height; material: THREE.Material; len?: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(len, 0.02, 18, 2);
    const pos = g.attributes.position;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    for (let i = 0; i < pos.count; i++) {
      const lx = pos.getX(i);
      const ly = pos.getY(i);
      const px = x + lx * c - ly * s;
      const py = y + lx * s + ly * c;
      pos.setXYZ(i, px, py, height(px, py));
    }
    g.computeVertexNormals();
    return g;
  }, [x, y, angle, height, len]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={material} receiveShadow />;
}

type Fastener = { kind: "pin" | "tack" | "tape"; u: number; v: number; angle?: number; color?: string };

type PaperProps = {
  name: PropName;
  at: readonly [number, number];
  tilt: number;
  stiffness: number;
  layer?: number;
  roughness?: number;
  fasten?: readonly Fastener[];
  textures: Textures;
  normal: THREE.Texture;
  tape: THREE.Material;
};

/** A sheet lying on the cork: curled like the cards and registered so yarn passes over it. */
function PaperProp({ name, at, tilt, stiffness, layer = 0, roughness = 0.9, fasten = [], textures, normal, tape }: PaperProps) {
  const group = useRef<THREE.Group>(null);
  const [w, h] = propSize(name);
  const z = BOARD_FRONT_Z + 0.0014 + layer * 0.0003;
  const curl = useMemo(() => paperCurl(at[0] * 7.3 + at[1] * 3.1, stiffness), [at, stiffness]);
  const geometry = useMemo(() => curledPlane(w, h, curl), [w, h, curl]);
  useBoardSurface(group, w, h, curl);

  const material = useMemo(() => {
    const n = normal.clone();
    n.wrapS = n.wrapT = THREE.RepeatWrapping;
    n.repeat.set(w / 0.3, h / 0.3);
    n.needsUpdate = true;
    return new THREE.MeshStandardMaterial({
      map: textures[name],
      normalMap: n,
      normalScale: new THREE.Vector2(0.4, 0.4),
      roughness,
      alphaTest: 0.5,
      envMapIntensity: 0.6,
    });
  }, [name, textures, normal, roughness, w, h]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.normalMap?.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Tape follows the paper and drops off its edge onto the cork.
  const tapeHeight = useMemo<Height>(
    () => (x, y) => {
      const d = Math.hypot(Math.max(0, Math.abs(x) - w / 2), Math.max(0, Math.abs(y) - h / 2));
      const u = THREE.MathUtils.clamp(x / w + 0.5, 0, 1);
      const v = THREE.MathUtils.clamp(y / h + 0.5, 0, 1);
      return THREE.MathUtils.lerp(curl(u, v) + 0.0004, BOARD_FRONT_Z - z + 0.0005, smooth(0, 0.0025, d));
    },
    [curl, w, h, z],
  );

  return (
    <group ref={group} position={onBoard(at, z)} rotation-z={tilt * DEG}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      {fasten.map((f, i) => {
        const x = (f.u - 0.5) * w;
        const y = (f.v - 0.5) * h;
        if (f.kind === "tape") return <Tape key={i} x={x} y={y} angle={(f.angle ?? 0) * DEG} height={tapeHeight} material={tape} />;
        return (
          <group key={i} position={[x, y, curl(f.u, f.v)]}>
            <PinHead kind={f.kind} color={f.color} />
          </group>
        );
      })}
    </group>
  );
}

/** A 3.5" diskette taped up by one corner. */
function Floppy({ at, tilt, label, tape }: { at: readonly [number, number]; tilt: number; label: THREE.Texture; tape: THREE.Material }) {
  const W = 0.09;
  const H = 0.094;
  const T = 0.0033;
  const tapeHeight = useMemo<Height>(
    () => (x, y) => {
      const d = Math.hypot(Math.max(0, Math.abs(x) - W / 2), Math.max(0, Math.abs(y) - H / 2));
      return THREE.MathUtils.lerp(T + 0.0003, 0.0002, smooth(0, 0.003, d));
    },
    [],
  );
  return (
    <group position={onBoard(at, BOARD_FRONT_Z + 0.0003)} rotation-z={tilt * DEG}>
      <RoundedBox args={[W, H, T]} radius={0.0012} smoothness={3} position-z={T / 2} castShadow receiveShadow>
        <meshStandardMaterial color="#1d1f23" roughness={0.42} />
      </RoundedBox>
      {/* Sliding metal shutter and the disc showing through its window. */}
      <mesh position={[0.004, H / 2 - 0.0158, T + 0.0002]} castShadow receiveShadow>
        <boxGeometry args={[0.052, 0.0316, 0.0004]} />
        <meshStandardMaterial color="#c6c9ce" metalness={0.75} roughness={0.38} />
      </mesh>
      <mesh position={[0.017, H / 2 - 0.017, T + 0.00042]}>
        <planeGeometry args={[0.012, 0.021]} />
        <meshStandardMaterial color="#3b2f28" roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.017, T + 0.0002]} receiveShadow>
        <planeGeometry args={[0.072, 0.05]} />
        <meshStandardMaterial map={label} roughness={0.85} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.0385, -0.0405, T + 0.00015]}>
          <planeGeometry args={[0.0045, 0.0045]} />
          <meshStandardMaterial color="#050506" roughness={0.9} />
        </mesh>
      ))}
      <Tape x={-W / 2 + 0.004} y={H / 2 - 0.004} angle={45 * DEG} height={tapeHeight} material={tape} len={0.05} />
    </group>
  );
}

/** A closed matchbook from a bar, tacked through the top. */
function Matchbook({ at, tilt, cover }: { at: readonly [number, number]; tilt: number; cover: THREE.Texture }) {
  const [w, h] = propSize("matchbook");
  const T = 0.0045;
  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ color: "#3e0d10", roughness: 0.85 });
    const front = new THREE.MeshStandardMaterial({ map: cover, roughness: 0.75 });
    return [side, side, side, side, front, side];
  }, [cover]);
  useEffect(
    () => () => {
      materials[0].dispose();
      materials[4].dispose();
    },
    [materials],
  );
  return (
    <group position={onBoard(at, BOARD_FRONT_Z)} rotation-z={tilt * DEG}>
      <mesh position-z={T / 2} material={materials} castShadow receiveShadow>
        <boxGeometry args={[w, h, T]} />
      </mesh>
      <group position={[0.004, h / 2 - 0.011, T]}>
        <PinHead kind="tack" />
      </group>
    </group>
  );
}

/** An old skeleton key hung on a pin through its bow. */
function Key({ at }: { at: readonly [number, number] }) {
  const { bow, bit, brass } = useMemo(() => {
    const extrude = (shape: THREE.Shape) =>
      new THREE.ExtrudeGeometry(shape, { depth: 0.0012, bevelEnabled: true, bevelThickness: 0.0003, bevelSize: 0.0003, bevelSegments: 2, curveSegments: 40 });
    const ring = new THREE.Shape();
    ring.absellipse(0, 0, 0.0105, 0.0088, 0, Math.PI * 2, false, 0);
    const hole = new THREE.Path();
    hole.absellipse(0, 0, 0.0062, 0.005, 0, Math.PI * 2, true, 0);
    ring.holes.push(hole);
    const ward = new THREE.Shape();
    for (const [x, y] of [
      [0.05, 0.001],
      [0.0595, 0.001],
      [0.0595, -0.0125],
      [0.0565, -0.0125],
      [0.0565, -0.0085],
      [0.0535, -0.0085],
      [0.0535, -0.0125],
      [0.05, -0.0125],
    ])
      ward.lineTo(x, y);
    return {
      bow: extrude(ring),
      bit: extrude(ward),
      brass: new THREE.MeshStandardMaterial({ color: "#c7994e", metalness: 0.75, roughness: 0.36 }),
    };
  }, []);
  useEffect(
    () => () => {
      bow.dispose();
      bit.dispose();
      brass.dispose();
    },
    [bow, bit, brass],
  );
  return (
    <group position={onBoard(at, BOARD_FRONT_Z)}>
      <PinHead kind="pin" color="#1f3c86" />
      <group position={[0.001, -0.0066, 0.0026]} rotation-z={-Math.PI / 2 + 0.14} scale={1.45}>
        <mesh geometry={bow} material={brass} castShadow receiveShadow />
        <mesh geometry={bit} material={brass} castShadow receiveShadow />
        <mesh position={[0.034, 0, 0.0006]} rotation-z={Math.PI / 2} material={brass} castShadow receiveShadow>
          <cylinderGeometry args={[0.0016, 0.0016, 0.05, 16]} />
        </mesh>
        {[0.0125, 0.0165].map((x) => (
          <mesh key={x} position={[x, 0, 0.0006]} rotation-z={Math.PI / 2} material={brass} castShadow>
            <cylinderGeometry args={[0.0023, 0.0023, 0.0022, 20]} />
          </mesh>
        ))}
        <mesh position={[0.0598, 0, 0.0006]} material={brass} castShadow>
          <sphereGeometry args={[0.0017, 16, 12]} />
        </mesh>
      </group>
    </group>
  );
}

/** Spare pins stuck in the cork, waiting for the next lead. */
const LOOSE_PINS: readonly { at: readonly [number, number]; color: string; rx: number; ry: number }[] = [
  { at: [-1.27, 0.77], color: "#a8121a", rx: -0.1, ry: 0.15 },
  { at: [-1.25, 0.72], color: "#c49a1c", rx: 0.18, ry: -0.08 },
  { at: [1.28, -0.78], color: "#e2ddd0", rx: -0.2, ry: -0.2 },
  { at: [0.02, 0.78], color: "#1f3c86", rx: 0.12, ry: 0.22 },
  { at: [-1.29, -0.79], color: "#a8121a", rx: -0.15, ry: -0.12 },
];

export function Props() {
  const gl = useThree((s) => s.gl);
  const textures = use(loadPropTextures(gl.capabilities.getMaxAnisotropy()));
  const normal = useTexture("/case/tex/paper_nor.jpg");
  const tape = useMemo(
    () => new THREE.MeshStandardMaterial({ map: textures.tape, transparent: true, depthWrite: false, roughness: 0.4, envMapIntensity: 0.8 }),
    [textures],
  );
  useEffect(() => () => tape.dispose(), [tape]);
  const common = { textures, normal, tape };

  return (
    <group>
      <Exhibit id="newspaper">
        <PaperProp
          name="newspaper"
          at={[-0.55, -0.15]}
          tilt={-3}
          stiffness={0.15}
          fasten={[
            { kind: "tape", u: 0.08, v: 0.97, angle: 35 },
            { kind: "tape", u: 0.92, v: 0.97, angle: -40 },
          ]}
          {...common}
        />
      </Exhibit>
      <Exhibit id="map">
        <PaperProp
          name="map"
          at={[-0.84, 0.64]}
          tilt={2}
          stiffness={0.3}
          layer={1}
          fasten={[
            { kind: "pin", u: 0.04, v: 0.93, color: "#c49a1c" },
            { kind: "pin", u: 0.95, v: 0.92, color: "#c49a1c" },
          ]}
          {...common}
        />
      </Exhibit>
      <Exhibit id="stickyFriday">
        <PaperProp name="stickyFriday" at={[-0.37, 0.63]} tilt={6} stiffness={0.25} {...common} />
      </Exhibit>
      <Exhibit id="fingerprints">
        <PaperProp
          name="fingerprints"
          at={[0.44, 0.68]}
          tilt={-2}
          stiffness={0.6}
          roughness={0.85}
          fasten={[
            { kind: "tape", u: 0.02, v: 0.5, angle: 90 },
            { kind: "tape", u: 0.98, v: 0.5, angle: 86 },
          ]}
          {...common}
        />
      </Exhibit>
      <Exhibit id="receipt">
        <PaperProp name="receipt" at={[-0.6, -0.6]} tilt={5} stiffness={0} roughness={0.7} fasten={[{ kind: "pin", u: 0.5, v: 0.95, color: "#e2ddd0" }]} {...common} />
      </Exhibit>
      <Exhibit id="stickyDns">
        <PaperProp name="stickyDns" at={[0.87, -0.7]} tilt={-4} stiffness={0.25} {...common} />
      </Exhibit>
      <Exhibit id="matchbook">
        <Matchbook at={[-0.43, -0.73]} tilt={-12} cover={textures.matchbook} />
      </Exhibit>
      <Exhibit id="floppy">
        <Floppy at={[0.27, -0.56]} tilt={9} label={textures.floppyLabel} tape={tape} />
      </Exhibit>
      <Exhibit id="key">
        <PaperProp name="tag" at={[1.115, 0.548]} tilt={-16} stiffness={0.5} {...common} />
        <Key at={[1.17, 0.6]} />
      </Exhibit>
      {LOOSE_PINS.map((p, i) => (
        <group key={i} position={onBoard(p.at, BOARD_FRONT_Z)} rotation={[p.rx, p.ry, 0]}>
          <PinHead kind="pin" color={p.color} />
        </group>
      ))}
    </group>
  );
}
