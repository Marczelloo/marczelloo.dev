// Thunder recordings and how each one lines up with a flash. Shared by the
// storm (which schedules flashes from it) and the audio (which plays it), so
// the sound lands on the flash it belongs to even though both run separately.
//
// Recordings: Mixkit (mixkit.co), Mixkit Sound Effects Free License.

export type StrikeClass = "close" | "mid" | "far";

export type ThunderSample = {
  id: string;
  url: string;
  cls: StrikeClass;
  /** Seconds into the file where the strike itself lands. */
  onset: number;
  /** Pre-roll skipped before playback. */
  skip: number;
  /** Where the tail is faded out, in file seconds. */
  end: number;
  /** Rough loudness match between files. */
  gain: number;
  /** Later hits inside the same recording, in seconds after the onset. Each gets its own flash. */
  echoes: number[];
};

const sample = (id: string, cls: StrikeClass, onset: number, skip: number, end: number, gain: number, echoes: number[] = []) => ({
  id,
  url: `/case/audio/thunder-${id}.mp3`,
  cls,
  onset,
  skip,
  end,
  gain,
  echoes,
});

export const THUNDER: ThunderSample[] = [
  sample("close-strong", "close", 0.4, 0.2, 8.8, 1, [3.7]),
  sample("fast-impact", "close", 0.3, 0.15, 9.6, 0.7),
  sample("close-explosion", "close", 1.5, 1.25, 8.5, 1.3),
  sample("mid-single", "mid", 1.1, 0.3, 10.4, 1.1),
  sample("big-rumble", "mid", 0.85, 0.6, 18, 0.9),
  sample("distant", "far", 0, 0, 13.3, 1),
  sample("deep-rumble", "far", 0.1, 0, 15, 0.9),
];

export const THUNDER_BY_ID = new Map(THUNDER.map((s) => [s.id, s]));

/** One strike as the audio needs it: what to play, when its hit lands, how loud and where. */
export type Strike = {
  sample: string;
  /** Seconds from the flash to the hit - the distance the sound travels. */
  delay: number;
  /** 0..1 */
  level: number;
  /** -1..1 */
  pan: number;
  /** Playback rate, varies the timbre between plays of the same file. */
  rate: number;
};

// Shuffle bags so the same recording never plays twice in a row.
const bags = new Map<StrikeClass, ThunderSample[]>();
let last: ThunderSample | null = null;

export function pickThunder(cls: StrikeClass): ThunderSample {
  let bag = bags.get(cls);
  if (!bag || bag.length === 0) {
    bag = THUNDER.filter((s) => s.cls === cls).sort(() => Math.random() - 0.5);
    if (bag.length > 1 && bag[bag.length - 1] === last) bag.unshift(bag.pop()!);
    bags.set(cls, bag);
  }
  last = bag.pop()!;
  return last;
}
