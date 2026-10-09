"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CARDS } from "../content";
import { caseStore } from "../store";
import { CAMERA, cardBoardPosition, cardSize, exhibitFrames } from "./layout";

const DEG = Math.PI / 180;

/** Vertical FOV that keeps a fixed horizontal angle, so the board fits any aspect. */
function fovFor(aspect: number) {
  const v = 2 * Math.atan(Math.tan(CAMERA.halfWidthDeg * DEG) / aspect) / DEG;
  return THREE.MathUtils.clamp(v, 34, 78);
}

/**
 * Fixed camera with a little mouse parallax. Entering moves it from the
 * doorway to the board; focusing a card dollies in square to it.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const reduced = useRef(false);
  const look = useRef(CAMERA.intro.target.clone());
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), dir: new THREE.Vector3(), c: new THREE.Vector3() }), []);

  useEffect(() => {
    camera.position.copy(CAMERA.intro.position);
    camera.lookAt(CAMERA.intro.target);
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [camera]);

  useEffect(() => {
    camera.fov = fovFor(size.width / size.height);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(({ clock }, dt) => {
    dt = Math.min(dt, 1 / 20);
    const s = caseStore.get();
    const t = clock.elapsedTime;
    const p = pointer.current;
    const k = 1 - Math.exp(-dt * 3);
    // Parallax only follows the mouse when nothing is held up to the camera.
    const follow = s.mode === "inspect" || reduced.current ? 0 : 1;
    p.sx += (p.x * follow - p.sx) * k;
    p.sy += (p.y * follow - p.sy) * k;

    const card = s.activeId ? CARDS.find((c) => c.id === s.activeId) : undefined;
    const exhibit = s.activeId && !card ? exhibitFrames.get(s.activeId) : undefined;
    if (!s.entered) {
      tmp.pos.copy(CAMERA.intro.position);
      tmp.tgt.copy(CAMERA.intro.target);
      // A slow handheld drift while the file loads.
      tmp.pos.x += Math.sin(t * 0.21) * 0.05;
      tmp.pos.y += Math.sin(t * 0.17 + 1) * 0.025;
    } else if ((card || exhibit) && s.mode !== "board") {
      let w: number, h: number;
      if (card) {
        cardBoardPosition(card, CARDS.indexOf(card), tmp.c);
        [w, h] = cardSize(card);
      } else {
        tmp.c.copy(exhibit!.center);
        ({ w, h } = exhibit!);
      }
      const vf = camera.fov * DEG;
      const fill = card ? 0.8 : 0.7;
      // Small exhibits are allowed closer than cards, which never need it.
      const d = Math.max(h / (fill * 2 * Math.tan(vf / 2)), w / (fill * 2 * Math.tan(vf / 2) * camera.aspect), card ? 0.42 : 0.2);
      // Mostly square to the board, keeping a hint of the board-view angle.
      tmp.dir.copy(CAMERA.board.position).sub(tmp.c).normalize().lerp(new THREE.Vector3(0, 0, 1), 0.7).normalize();
      tmp.pos.copy(tmp.c).addScaledVector(tmp.dir, d);
      tmp.tgt.copy(tmp.c);
      tmp.pos.x += p.sx * 0.02;
      tmp.pos.y -= p.sy * 0.012;
    } else {
      // Narrow screens can't take in the board and the window together, so
      // the camera steps back and frames just the board.
      const portrait = THREE.MathUtils.clamp((1 - camera.aspect) / 0.5, 0, 1);
      tmp.pos.lerpVectors(CAMERA.board.position, CAMERA.boardPortrait.position, portrait);
      tmp.tgt.lerpVectors(CAMERA.board.target, CAMERA.boardPortrait.target, portrait);
      tmp.pos.x += p.sx * 0.14;
      tmp.pos.y -= p.sy * 0.07;
      tmp.tgt.x += p.sx * 0.03;
    }
    // Breathing: a camera on a person, not a tripod.
    if (!reduced.current) {
      tmp.pos.y += Math.sin(t * 0.9) * 0.0025;
      tmp.pos.x += Math.sin(t * 0.53) * 0.002;
    }

    const rate = !s.entered ? 1.2 : s.mode === "board" ? 2.2 : 3;
    const f = 1 - Math.exp(-dt * rate);
    camera.position.lerp(tmp.pos, f);
    look.current.lerp(tmp.tgt, f);
    camera.lookAt(look.current);
  });

  return null;
}
