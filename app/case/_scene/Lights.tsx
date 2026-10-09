"use client";

import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { caseStore, lightning } from "../store";
import { pickThunder, type StrikeClass } from "../thunder";
import { BOLT_LIGHT, LAMP, STREET_LIGHT, fx } from "./layout";
import { lightUniforms, timeUniform } from "./lightsGLSL";

const LAMP_URL = "/case/models/lamp/hanging_industrial_lamp_1k.gltf";

type Pulse = { t: number; a: number; k: number };
/** A strike waiting its turn: the second bolt of a double, or a later hit inside one recording (flash only). */
type Queued = { t: number; cls: StrikeClass; echo?: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Flash strength, flicker count and flash-to-thunder delay per distance. */
const STRIKE: Record<StrikeClass, { a: [number, number]; n: [number, number]; delay: [number, number] }> = {
  close: { a: [1.15, 1.5], n: [3, 5], delay: [0.04, 0.22] },
  mid: { a: [0.7, 1], n: [2, 3], delay: [0.6, 1.4] },
  far: { a: [0.3, 0.5], n: [1, 2], delay: [1.8, 3.2] },
};

function rollClass(): StrikeClass {
  const r = Math.random();
  return r < 0.32 ? "close" : r < 0.7 ? "mid" : "far";
}

export function Lights() {
  const { scene: lampSource } = useGLTF(LAMP_URL);
  const swing = useRef<THREE.Group>(null);
  const lampSpot = useRef<THREE.SpotLight>(null);
  const lampFill = useRef<THREE.PointLight>(null);
  const street = useRef<THREE.SpotLight>(null);
  const bolt = useRef<THREE.SpotLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const handFill = useRef<THREE.PointLight>(null);
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);

  const targets = useMemo(() => {
    const make = (p: THREE.Vector3) => {
      const o = new THREE.Object3D();
      o.position.copy(p);
      return o;
    };
    return { lamp: make(LAMP.target), street: make(STREET_LIGHT.target), bolt: make(BOLT_LIGHT.target) };
  }, []);

  const lamp = useMemo(() => {
    const root = lampSource.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.name.includes("glass")) {
        // Transmission would cost a whole extra scene pass; a warm frosted
        // shell reads the same at this size.
        mesh.material = new THREE.MeshPhysicalMaterial({
          name: mat.name,
          color: "#f1d9bb",
          roughness: 0.32,
          metalness: 0,
          transparent: true,
          opacity: 0.42,
          emissive: new THREE.Color("#ffb066"),
          emissiveIntensity: 0.55,
          normalMap: mat.normalMap,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        mesh.castShadow = false;
      } else {
        mat.emissiveIntensity = 7;
        mat.envMapIntensity = 1.4;
      }
    });
    return root;
  }, [lampSource]);

  useLayoutEffect(() => {
    scene.add(targets.lamp, targets.street, targets.bolt);
    if (lampSpot.current) lampSpot.current.target = targets.lamp;
    if (street.current) street.current.target = targets.street;
    if (bolt.current) {
      bolt.current.target = targets.bolt;
      bolt.current.shadow.autoUpdate = false;
      // Render once so the shadow sampler is bound to a real depth map.
      bolt.current.shadow.needsUpdate = true;
    }
    return () => {
      scene.remove(targets.lamp, targets.street, targets.bolt);
    };
  }, [scene, targets]);

  const storm = useRef({ next: 4 + Math.random() * 3, dip: -10, pulses: [] as Pulse[], queue: [] as Queued[] });
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), w: new THREE.Vector3(), f: new THREE.Vector3() }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    timeUniform.value = t;
    const s = storm.current;

    // --- lightning ---------------------------------------------------------
    const flashBurst = (at: number, a: number, n: number) => {
      for (let i = 0; i < n; i++) {
        s.pulses.push({ t: at, a: a * (i === 0 ? 1 : 0.45 + Math.random() * 0.7), k: 12 + Math.random() * 14 });
        at += 0.05 + Math.random() * 0.2;
      }
    };
    const strike = (cls: StrikeClass) => {
      const spec = STRIKE[cls];
      const level = Math.random();
      const a = spec.a[0] + (spec.a[1] - spec.a[0]) * level;
      flashBurst(t, a, Math.round(rand(spec.n[0], spec.n[1])));
      if (cls !== "far") s.dip = t;
      fx.boltX = 0.12 + Math.random() * 0.76;
      fx.boltFlip = Math.random() < 0.5 ? -1 : 1;

      const sample = pickThunder(cls);
      const rate = rand(0.9, 1.04);
      // Hits later in the same recording come from the same bolt: flash them
      // too, the same travel time ahead of their sound.
      for (const e of sample.echoes) s.queue.push({ t: t + e / rate, cls, echo: a * rand(0.55, 0.8) });
      lightning.emit({
        sample: sample.id,
        delay: rand(spec.delay[0], spec.delay[1]),
        level: 0.8 + 0.2 * level,
        // The window is to the right of the board.
        pan: 0.15 + (fx.boltX - 0.5) * 0.5,
        rate,
      });
    };

    if (t >= s.next || fx.force) {
      const cls = typeof fx.force === "string" ? fx.force : rollClass();
      fx.force = false;
      strike(cls);
      let quiet = t;
      // Doubles: a second bolt follows close behind, never nearer than the first.
      if (cls !== "far" && Math.random() < 0.35) {
        quiet = t + rand(1.2, 2.6);
        s.queue.push({ t: quiet, cls: cls === "close" && Math.random() < 0.5 ? "close" : "mid" });
      }
      s.next = quiet + rand(8, 20);
    }
    for (let i = s.queue.length - 1; i >= 0; i--) {
      const q = s.queue[i];
      if (t < q.t) continue;
      s.queue.splice(i, 1);
      if (q.echo !== undefined) {
        flashBurst(t, q.echo, Math.round(rand(1, 3)));
        fx.boltX = 0.12 + Math.random() * 0.76;
      } else {
        strike(q.cls);
      }
    }
    let flash = 0;
    s.pulses = s.pulses.filter((p) => t - p.t < 3);
    for (const p of s.pulses) {
      const e = t - p.t;
      if (e >= 0) flash += p.a * (Math.exp(-e * p.k) * (0.8 + 0.2 * Math.sin(e * 140)) + 0.1 * Math.exp(-e * 2.4));
    }
    if (fx.hold !== null) flash = fx.hold;
    fx.flash = flash;

    // Lamp: a faint mains shimmer, and a brownout stutter right after a strike.
    const sinceDip = t - s.dip;
    const stutter = sinceDip < 0.6 ? 0.4 * Math.exp(-sinceDip * 5) * (0.5 + 0.5 * Math.sin(sinceDip * 75)) : 0;
    fx.lamp = 1 - stutter + 0.012 * Math.sin(t * 13.1) * Math.sin(t * 7.3);

    // --- lamp swing ----------------------------------------------------------
    if (swing.current) {
      swing.current.rotation.x = 0.011 * Math.sin(t * 0.83) + 0.004 * Math.sin(t * 1.9);
      swing.current.rotation.z = 0.008 * Math.sin(t * 0.61 + 1.2);
    }

    // --- light intensities ---------------------------------------------------
    if (lampSpot.current) lampSpot.current.intensity = LAMP.intensity * fx.lamp;
    if (lampFill.current) lampFill.current.intensity = 0.55 * fx.lamp;
    if (bolt.current) {
      bolt.current.intensity = BOLT_LIGHT.intensity * flash;
      if (flash > 0.02) bolt.current.shadow.needsUpdate = true;
    }
    if (hemi.current) hemi.current.intensity = 0.5 + flash * 2.2;

    // A soft fill that rises when a card is brought up to the face, standing in
    // for the lamp light bouncing off the paper you hold.
    if (handFill.current) {
      const mode = caseStore.get().mode;
      const want = mode === "inspect" ? 1.1 : mode === "focus" ? 0.35 : 0;
      handFill.current.intensity += (want - handFill.current.intensity) * 0.06;
      camera.getWorldDirection(tmp.f);
      handFill.current.position.copy(camera.position).addScaledVector(tmp.f, 0.15);
      handFill.current.position.y += 0.35;
      handFill.current.position.x -= 0.25;
    }

    // --- uniforms for analytic shaders --------------------------------------
    if (lampSpot.current) {
      lampSpot.current.getWorldPosition(tmp.v);
      lightUniforms.uLampPos.value.copy(tmp.v);
      lightUniforms.uLampDir.value.copy(targets.lamp.position).sub(tmp.v).normalize();
      lightUniforms.uLampColor.value.copy(LAMP.color).multiplyScalar(lampSpot.current.intensity);
      lightUniforms.uLampCone.value.set(Math.cos(LAMP.angle * 0.8), Math.cos(LAMP.angle * 0.8 * (1 - LAMP.penumbra)));
    }
    lightUniforms.uStreetPos.value.copy(STREET_LIGHT.position);
    lightUniforms.uStreetColor.value.copy(STREET_LIGHT.color).multiplyScalar(STREET_LIGHT.intensity);
    lightUniforms.uBoltPos.value.copy(BOLT_LIGHT.position);
    const boltDist2 = tmp.w.copy(BOLT_LIGHT.position).sub(BOLT_LIGHT.target).lengthSq();
    lightUniforms.uBoltColor.value.copy(BOLT_LIGHT.color).multiplyScalar((BOLT_LIGHT.intensity * flash) / boltDist2);
  });

  const bulbY = -LAMP.bulbDrop;

  return (
    <>
      <hemisphereLight ref={hemi} args={["#1c2536", "#0c0907", 0.5]} />

      <group ref={swing} position={LAMP.anchor}>
        <primitive object={lamp} />
        <spotLight
          ref={lampSpot}
          position={[0, bulbY, 0]}
          color={LAMP.color}
          intensity={LAMP.intensity}
          angle={LAMP.angle}
          penumbra={LAMP.penumbra}
          decay={2}
          distance={0}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.00015}
          shadow-normalBias={0.0012}
          shadow-radius={4}
          shadow-camera-near={0.32}
          shadow-camera-far={7}
        />
        {/* Spill that the shade lets through and the bounce off the board. */}
        <pointLight ref={lampFill} position={[0, bulbY - 0.05, 0.1]} color="#ff9c55" intensity={0.55} distance={4.5} decay={2} />
      </group>

      <spotLight
        ref={street}
        position={STREET_LIGHT.position}
        color={STREET_LIGHT.color}
        intensity={STREET_LIGHT.intensity}
        angle={0.3}
        penumbra={0.12}
        decay={2}
        distance={0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.0012}
        shadow-radius={1.5}
        shadow-camera-near={2.5}
        shadow-camera-far={12}
      />

      <spotLight
        ref={bolt}
        position={BOLT_LIGHT.position}
        color={BOLT_LIGHT.color}
        intensity={0}
        angle={0.24}
        penumbra={0.3}
        decay={2}
        distance={0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.0015}
        shadow-camera-near={4}
        shadow-camera-far={16}
      />

      <pointLight ref={handFill} color="#ffc58f" intensity={0} distance={2.2} decay={2} />

      <Environment resolution={64} frames={1} environmentIntensity={0.22}>
        <Lightformer form="rect" intensity={3} color="#ffae66" position={[-0.4, 2.6, 1.4]} scale={[1.2, 0.6, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#8fa6d6" position={[3, 1.7, 0.7]} rotation-y={-Math.PI / 2} scale={[1, 1.6, 1]} />
        <Lightformer form="rect" intensity={0.25} color="#3a3026" position={[0, -1, 2]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
      </Environment>
    </>
  );
}

useGLTF.preload(LAMP_URL);

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  Object.assign(window, {
    __fx: fx,
    __strike: (cls?: "close" | "mid" | "far") => {
      fx.force = cls ?? true;
    },
  });
}
