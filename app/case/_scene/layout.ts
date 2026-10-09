import * as THREE from "three";
import { PHOTO_BORDER, type CardKind, type CaseCard } from "../content";

// World layout in metres. The back wall is the z = 0 plane and the room opens
// toward +z where the camera stands. The window sits in the right wall
// (x = ROOM.rightX) near the corner, so the street light rakes across the board
// through the venetian blinds. The camera looks into that corner.

export const ROOM = {
  leftX: -3.6,
  rightX: 1.45,
  wallT: 0.18,
  floorY: 0,
  ceilY: 3.6,
  frontZ: 6,
} as const;

export const BOARD = {
  center: new THREE.Vector3(-0.6, 1.5, 0),
  width: 2.7,
  height: 1.65,
  /** Thickness of the cork slab and its gap from the wall. */
  depth: 0.022,
  standoff: 0.012,
  frame: 0.055,
  frameDepth: 0.05,
} as const;

/** z of the cork surface the cards are pinned to. */
export const BOARD_FRONT_Z = BOARD.standoff + BOARD.depth;

const blindTop = 2.43;
const slatPitch = 0.042;
const slatCount = 16;

export const WIN = {
  /** Wall opening along z (depth) and y. */
  z0: 0.2,
  z1: 1.2,
  y0: 0.9,
  y1: 2.5,
  /** Sash frame width inside the opening. */
  frame: 0.06,
  glassX: ROOM.rightX + 0.075,
  /** Meeting rail between the lower and upper sash. */
  railY: 1.7,
  rail: 0.045,
  /** Vertical muntin in the middle of both sashes. */
  muntin: 0.024,
  zMid: 0.7,
  // Venetian blinds hanging just inside the wall, lowered over the upper sash.
  slatX: ROOM.rightX - 0.035,
  slatPitch,
  slatCount,
  slatW: 0.034,
  slatTilt: 0.78,
  blindTop,
  blindBottom: blindTop - slatCount * slatPitch,
} as const;

export const LAMP = {
  /**
   * Model origin; it hangs 1.34 m below it. Set above the ceiling so the cord
   * runs through it and the shade sits just above the board view's frame.
   */
  anchor: new THREE.Vector3(-0.5, ROOM.ceilY + 0.32, 1.7),
  /** Bulb offset below the anchor (inside the glass cage). */
  bulbDrop: 1.2,
  target: new THREE.Vector3(-0.6, 1.35, 0),
  angle: 1.08,
  penumbra: 0.85,
  color: new THREE.Color("#ffbf86"),
  intensity: 6.5,
} as const;

export const STREET_LIGHT = {
  position: new THREE.Vector3(5.5, 3.6, 2.2),
  target: new THREE.Vector3(-0.6, 1.45, 0),
  color: new THREE.Color("#8fa6d6"),
  intensity: 42,
} as const;

export const BOLT_LIGHT = {
  position: new THREE.Vector3(8, 5.5, 1.8),
  target: new THREE.Vector3(-0.5, 1.3, 0),
  color: new THREE.Color("#c9d7ff"),
  intensity: 1050,
} as const;

export const CAMERA = {
  board: { position: new THREE.Vector3(-0.8, 1.6, 3.3), target: new THREE.Vector3(-0.2, 1.48, 0) },
  /** Board view for tall portrait screens: further back and centred on the board. */
  boardPortrait: { position: new THREE.Vector3(-0.6, 1.5, 4.35), target: new THREE.Vector3(-0.6, 1.5, 0) },
  intro: { position: new THREE.Vector3(-0.2, 1.75, 5.2), target: new THREE.Vector3(0.1, 1.6, 0) },
  /** Half of the horizontal angle the board view must fit, degrees. */
  halfWidthDeg: 35,
} as const;

/** Card size in metres (width, height). */
export const CARD_SIZE: Record<CardKind, readonly [number, number]> = {
  dossier: [0.42, 0.56],
  sheet: [0.4, 0.52],
  report: [0.3, 0.4],
  /** Photos take their size from the print (see photoSize in content.ts); this is only a fallback. */
  photo: [0.24, 0.3],
  index: [0.36, 0.22],
  manila: [0.34, 0.24],
  note: [0.13, 0.13],
  cv: [0.3, 0.42],
};

const DEG = Math.PI / 180;

/** Size of a card in metres: its own when it has one (photos follow their print), else its kind's. */
export function cardSize(card: CaseCard): readonly [number, number] {
  return card.size ?? CARD_SIZE[card.kind];
}

/** World position of a card's centre when pinned to the board. */
export function cardBoardPosition(card: CaseCard, index: number, out = new THREE.Vector3()) {
  return out.set(
    BOARD.center.x + card.position[0],
    BOARD.center.y + card.position[1],
    BOARD_FRONT_Z + 0.0025 + index * 0.0009,
  );
}

/** World position of the pin holding a card (top centre, rotated by tilt). */
export function cardPinPosition(card: CaseCard, index: number, out = new THREE.Vector3()) {
  const [, h] = cardSize(card);
  const inset = card.kind === "note" ? 0.018 : card.kind === "photo" ? PHOTO_BORDER.top / 2 : 0.024;
  const a = card.tilt * DEG;
  const ly = h / 2 - inset;
  cardBoardPosition(card, index, out);
  out.x += -Math.sin(a) * ly;
  out.y += Math.cos(a) * ly;
  out.z = BOARD_FRONT_Z;
  return out;
}

/** Where each exhibit sits on the board and how much of it to frame; filled in by <Props>. */
export const exhibitFrames = new Map<string, { center: THREE.Vector3; w: number; h: number }>();

/** Mutable per-frame effect values shared between scene parts (not React state). */
export const fx = {
  /** 0..~1.6 lightning flash envelope. */
  flash: 0,
  /** Horizontal bolt position in the sky, 0..1, and mirror sign. */
  boltX: 0.5,
  boltFlip: 1,
  /** Lamp brightness multiplier (flicker / surge dips). */
  lamp: 1,
  /** Set to trigger a strike on the next frame (dev tooling); a class picks the distance. */
  force: false as boolean | "close" | "mid" | "far",
  /** When set, pins the flash envelope to this value (dev tooling). */
  hold: null as number | null,
};
