import type { IconConfig } from "@/lib/icon-mark";

type Key = keyof IconConfig;

export type Knob =
  | {
      key: Key;
      label: string;
      kind: "range";
      min: number;
      max: number;
      step: number;
    }
  | { key: Key; label: string; kind: "toggle" }
  | { key: Key; label: string; kind: "select"; options: string[] };

interface KnobGroup {
  title: string;
  knobs: Knob[];
}

export const KNOB_GROUPS: KnobGroup[] = [
  {
    title: "Dove",
    knobs: [
      {
        key: "artDove",
        label: "Artwork",
        kind: "select",
        options: ["spread", "line"],
      },
      {
        key: "artSize",
        label: "Size",
        kind: "range",
        min: 0.5,
        max: 1,
        step: 0.02,
      },
      {
        key: "artWeight",
        label: "Line weight",
        kind: "range",
        min: 1.5,
        max: 5,
        step: 0.25,
      },
      {
        key: "artOffsetY",
        label: "Nudge Y",
        kind: "range",
        min: -6,
        max: 6,
        step: 0.5,
      },
      { key: "artFlip", label: "Mirror", kind: "toggle" },
      {
        key: "artBeak",
        label: "Beak",
        kind: "select",
        options: ["narrow", "convex", "straight", "original", "none"],
      },
      {
        key: "beakFill",
        label: "Beak fill",
        kind: "select",
        options: ["cutout", "orange", "lunar"],
      },
    ],
  },
  {
    title: "Rim",
    knobs: [
      {
        key: "rimWidth",
        label: "Width",
        kind: "range",
        min: 0,
        max: 4,
        step: 0.25,
      },
      {
        key: "rimOpacity",
        label: "Opacity",
        kind: "range",
        min: 0.1,
        max: 1,
        step: 0.05,
      },
      {
        key: "rimBlur",
        label: "Glow",
        kind: "range",
        min: 0,
        max: 3,
        step: 0.25,
      },
      {
        key: "rimColor",
        label: "Color",
        kind: "select",
        options: ["lunar", "orange", "ink"],
      },
    ],
  },
  {
    title: "Rain",
    knobs: [
      { key: "rainAtRest", label: "Visible at rest", kind: "toggle" },
      {
        key: "rainColor",
        label: "Color",
        kind: "select",
        options: ["lunar", "orange", "ink"],
      },
      {
        key: "rainCount",
        label: "Count",
        kind: "range",
        min: 0,
        max: 6,
        step: 1,
      },
      {
        key: "rainWidth",
        label: "Width",
        kind: "range",
        min: 0.5,
        max: 3.5,
        step: 0.25,
      },
      {
        key: "rainGap",
        label: "Gap",
        kind: "range",
        min: 3,
        max: 9,
        step: 0.5,
      },
      {
        key: "rainShift",
        label: "Shift",
        kind: "range",
        min: -12,
        max: 12,
        step: 0.5,
      },
      {
        key: "rainFade",
        label: "End fade",
        kind: "range",
        min: 0,
        max: 0.45,
        step: 0.05,
      },
      {
        key: "rainClearance",
        label: "Clearance",
        kind: "range",
        min: 0,
        max: 10,
        step: 0.25,
      },
    ],
  },
  {
    title: "Tile & layout",
    knobs: [
      { key: "tileOn", label: "Tile", kind: "toggle" },
      {
        key: "tileBorder",
        label: "Tile border",
        kind: "range",
        min: 0,
        max: 3,
        step: 0.5,
      },
      {
        key: "displaySize",
        label: "Header size (px)",
        kind: "range",
        min: 32,
        max: 72,
        step: 2,
      },
      {
        key: "headerGap",
        label: "Header gap (px)",
        kind: "range",
        min: 0,
        max: 32,
        step: 1,
      },
      {
        key: "small16Zoom",
        label: "16px zoom",
        kind: "range",
        min: 1,
        max: 1.6,
        step: 0.05,
      },
    ],
  },
];

// Layout decisions aren't part of the look, so rerolling leaves them alone.
const FIXED_ON_REROLL = new Set<Key>(["tileOn", "displaySize", "headerGap"]);

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rolls every knob from the seed, within each knob's tested bounds. */
export function randomize(base: IconConfig, seed: number): IconConfig {
  const rand = mulberry32(seed);
  const next: Record<string, unknown> = { ...base, seed };
  for (const group of KNOB_GROUPS) {
    for (const knob of group.knobs) {
      if (FIXED_ON_REROLL.has(knob.key)) continue;
      const r = rand();
      if (knob.kind === "range") {
        const steps = Math.round((knob.max - knob.min) / knob.step);
        next[knob.key] = Number(
          (knob.min + Math.round(r * steps) * knob.step).toFixed(3),
        );
      } else if (knob.kind === "toggle") {
        next[knob.key] = r < 0.5;
      } else {
        next[knob.key] = knob.options[Math.floor(r * knob.options.length)];
      }
    }
  }
  return next as unknown as IconConfig;
}
