"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BOARD, ROOM, WIN } from "./layout";
import { usePBR, worldBox } from "./materials";

/** Walls, floor, ceiling and trim. The right wall has the window opening cut out. */
export function Room() {
  const plaster = usePBR("wall", 1.7);
  const ceilingTex = usePBR("wall", 2.6);
  const wood = usePBR("wood", 1.2);

  const geo = useMemo(() => {
    const { leftX: L, rightX: R, wallT: T, ceilY: C, frontZ: F } = ROOM;
    return {
      back: worldBox([L - T, 0, -T], [R + T, C, 0]),
      left: worldBox([L - T, 0, 0], [L, C, F]),
      front: worldBox([L - T, 0, F], [R + T, C, F + T]),
      right: [
        worldBox([R, 0, 0], [R + T, C, WIN.z0]),
        worldBox([R, 0, WIN.z1], [R + T, C, F]),
        worldBox([R, 0, WIN.z0], [R + T, WIN.y0, WIN.z1]),
        worldBox([R, WIN.y1, WIN.z0], [R + T, C, WIN.z1]),
      ],
      floor: worldBox([L - T, -0.05, -T], [R + T, 0, F + T]),
      ceiling: worldBox([L - T, C, -T], [R + T, C + 0.06, F + T]),
      trim: [
        worldBox([L, 0, 0], [R, 0.12, 0.016]),
        worldBox([R - 0.016, 0, 0], [R, 0.12, F]),
        worldBox([L, C - 0.07, 0], [R, C, 0.03]),
      ],
    };
  }, []);

  return (
    <group>
      <mesh geometry={geo.back} receiveShadow>
        <meshStandardMaterial {...plaster} color="#8d8676" normalScale={[1.1, 1.1]} />
      </mesh>
      <mesh geometry={geo.left} receiveShadow>
        <meshStandardMaterial {...plaster} color="#7d776a" />
      </mesh>
      <mesh geometry={geo.front} receiveShadow>
        <meshStandardMaterial {...plaster} color="#7d776a" />
      </mesh>
      {geo.right.map((g, i) => (
        <mesh key={i} geometry={g} castShadow receiveShadow>
          <meshStandardMaterial {...plaster} color="#857e70" normalScale={[1.1, 1.1]} />
        </mesh>
      ))}
      <mesh geometry={geo.floor} receiveShadow>
        <meshStandardMaterial {...wood} color="#6b5442" roughness={0.9} />
      </mesh>
      <mesh geometry={geo.ceiling} castShadow receiveShadow>
        <meshStandardMaterial {...ceilingTex} color="#5f5a50" />
      </mesh>
      {geo.trim.map((g, i) => (
        <mesh key={i} geometry={g} castShadow receiveShadow>
          <meshStandardMaterial {...wood} color="#3a3128" />
        </mesh>
      ))}
      <WindowFrame />
      <Blinds />
    </group>
  );
}

function WindowFrame() {
  const wood = usePBR("wood", 0.9);
  const geo = useMemo(() => {
    const { z0, z1, y0, y1, frame: w, glassX: gx, railY, rail, muntin, zMid } = WIN;
    const R = ROOM.rightX;
    const d = 0.026;
    const sash = [
      worldBox([gx - d, y0, z0], [gx + d, y1, z0 + w], true),
      worldBox([gx - d, y0, z1 - w], [gx + d, y1, z1], true),
      worldBox([gx - d, y1 - w, z0], [gx + d, y1, z1]),
      worldBox([gx - d, y0, z0], [gx + d, y0 + w, z1]),
      worldBox([gx - d * 1.4, railY - rail / 2, z0], [gx + d * 0.6, railY + rail / 2, z1]),
      worldBox([gx - d * 0.8, y0 + w, zMid - muntin / 2], [gx + d * 0.4, y1 - w, zMid + muntin / 2], true),
    ];
    const t = 0.07;
    const casing = [
      worldBox([R - 0.022, y0 - 0.04, z0 - t], [R, y1 + t, z0], true),
      worldBox([R - 0.022, y0 - 0.04, z1], [R, y1 + t, z1 + t], true),
      worldBox([R - 0.022, y1, z0 - t], [R, y1 + t, z1 + t]),
      worldBox([R - 0.03, y0 - 0.1, z0 - t], [R, y0 - 0.035, z1 + t]),
    ];
    const sill = worldBox([R - 0.075, y0 - 0.035, z0 - 0.09], [gx, y0, z1 + 0.09]);
    return { sash, casing, sill };
  }, []);

  return (
    <group>
      {geo.sash.map((g, i) => (
        <mesh key={i} geometry={g} castShadow receiveShadow>
          <meshStandardMaterial {...wood} color="#4a463c" roughness={0.75} />
        </mesh>
      ))}
      {[...geo.casing, geo.sill].map((g, i) => (
        <mesh key={i} geometry={g} castShadow receiveShadow>
          <meshStandardMaterial {...wood} color="#3d3529" />
        </mesh>
      ))}
    </group>
  );
}

function Blinds() {
  const slats = useRef<THREE.InstancedMesh>(null);
  const { z0, z1, slatX, slatPitch, slatCount, slatW, slatTilt, blindTop, blindBottom } = WIN;
  const za = z0 - 0.035;
  const zb = z1 + 0.035;
  const len = zb - za;

  useLayoutEffect(() => {
    const mesh = slats.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), slatTilt);
    for (let i = 0; i < slatCount; i++) {
      // Tiny per-slat sag and twist so the blind doesn't read as a CG array.
      const jitter = Math.sin(i * 12.9898) * 0.5;
      const qi = q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), jitter * 0.012));
      m.compose(new THREE.Vector3(slatX, blindBottom + (i + 0.5) * slatPitch, (za + zb) / 2), qi, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [slatX, slatPitch, slatCount, slatTilt, blindBottom, za, zb]);

  const cordZ = [za + 0.16, zb - 0.16];

  return (
    <group>
      <instancedMesh ref={slats} args={[undefined, undefined, slatCount]} castShadow receiveShadow>
        <boxGeometry args={[slatW, 0.0022, len]} />
        <meshStandardMaterial color="#b9b19c" roughness={0.48} metalness={0.15} />
      </instancedMesh>
      {/* head rail and bottom rail */}
      <mesh position={[slatX, blindTop + 0.028, (za + zb) / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.05, len + 0.02]} />
        <meshStandardMaterial color="#a9a18c" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[slatX, blindBottom - 0.012, (za + zb) / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.012, len]} />
        <meshStandardMaterial color="#a39b86" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* ladder cords */}
      {cordZ.map((z) =>
        [-1, 1].map((s) => (
          <mesh key={`${z}${s}`} position={[slatX + s * slatW * 0.36, (blindTop + blindBottom) / 2, z]}>
            <boxGeometry args={[0.0012, blindTop - blindBottom + 0.04, 0.0012]} />
            <meshStandardMaterial color="#cfc6ae" roughness={0.9} />
          </mesh>
        )),
      )}
      {/* lift cord with a tassel */}
      <mesh position={[slatX - 0.03, (blindTop + 1.3) / 2, zb - 0.06]} castShadow>
        <cylinderGeometry args={[0.0013, 0.0013, blindTop - 1.3, 5]} />
        <meshStandardMaterial color="#d6ccb2" roughness={0.9} />
      </mesh>
      <mesh position={[slatX - 0.03, 1.285, zb - 0.06]} castShadow>
        <cylinderGeometry args={[0.004, 0.0065, 0.035, 10]} />
        <meshStandardMaterial color="#cbbf9f" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Cork board with a dark wood frame. */
export function Board() {
  const cork = usePBR("cork", 1.3);
  const wood = usePBR("wood", 0.9);
  const geo = useMemo(() => {
    const { center: c, width: W, height: H, depth, standoff: s, frame: f, frameDepth: fd } = BOARD;
    const x0 = c.x - W / 2;
    const x1 = c.x + W / 2;
    const y0 = c.y - H / 2;
    const y1 = c.y + H / 2;
    return {
      cork: worldBox([x0, y0, s], [x1, y1, s + depth]),
      backing: worldBox([x0, y0, 0.001], [x1, y1, s]),
      frame: [
        worldBox([x0 - f, y1, s - 0.004], [x1 + f, y1 + f, s + fd]),
        worldBox([x0 - f, y0 - f, s - 0.004], [x1 + f, y0, s + fd]),
        worldBox([x0 - f, y0, s - 0.004], [x0, y1, s + fd], true),
        worldBox([x1, y0, s - 0.004], [x1 + f, y1, s + fd], true),
      ],
    };
  }, []);

  return (
    <group>
      <mesh geometry={geo.cork} castShadow receiveShadow>
        <meshStandardMaterial {...cork} color="#9d8a74" normalScale={[1.8, 1.8]} />
      </mesh>
      <mesh geometry={geo.backing}>
        <meshStandardMaterial color="#1a1612" roughness={1} />
      </mesh>
      {geo.frame.map((g, i) => (
        <mesh key={i} geometry={g} castShadow receiveShadow>
          <meshStandardMaterial {...wood} color="#5a4636" />
        </mesh>
      ))}
    </group>
  );
}
