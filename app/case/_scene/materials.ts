import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

type Vec3 = readonly [number, number, number];

/**
 * Axis-aligned box built in world space with UVs taken from world coordinates
 * (metres), so textures tile seamlessly across neighbouring pieces. Set
 * `swap` to run the texture's u axis along the vertical (wood grain on posts).
 */
export function worldBox(min: Vec3, max: Vec3, swap = false) {
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]] as const;
  const g = new THREE.BoxGeometry(size[0], size[1], size[2]);
  g.translate((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const nx = nor.getX(i);
    const ny = nor.getY(i);
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    let u: number;
    let v: number;
    if (Math.abs(nx) > 0.5) [u, v] = [nx > 0 ? -z : z, y];
    else if (Math.abs(ny) > 0.5) [u, v] = [x, ny > 0 ? -z : z];
    else [u, v] = [nor.getZ(i) > 0 ? x : -x, y];
    if (swap) [u, v] = [v, u];
    uv.setXY(i, u, v);
  }
  return g;
}

type PBRSet = { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };

/** Loads one PBR set and tiles it so one texture repeat spans `tile` metres. */
export function usePBR(name: "wall" | "cork" | "wood", tile: number): PBRSet {
  const gl = useThree((s) => s.gl);
  const tex = useTexture({
    map: `/case/tex/${name}_diff.jpg`,
    normalMap: `/case/tex/${name}_nor.jpg`,
    roughnessMap: `/case/tex/${name}_rough.jpg`,
  });
  return useMemo(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    const out = {} as PBRSet;
    for (const key of ["map", "normalMap", "roughnessMap"] as const) {
      const t = tex[key].clone();
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1 / tile, 1 / tile);
      t.anisotropy = aniso;
      t.colorSpace = key === "map" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.needsUpdate = true;
      out[key] = t;
    }
    return out;
  }, [tex, tile, gl]);
}
