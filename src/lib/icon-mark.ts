// RainShift mark: a pure function of its config. Used by the /lab/icon
// generator, which also exports the static app icons and the pre-rendered
// header SVG from saved configs.

import { LINE_DOVE, SPREAD_DOVE } from "./dove-art";

export interface IconConfig {
  seed: number;
  artDove: "spread" | "line";
  artSize: number;
  artWeight: number;
  artOffsetY: number;
  artFlip: boolean;
  artBeak: "none" | keyof typeof SPREAD_DOVE.beaks;
  beakFill: "cutout" | "orange" | "lunar";
  rimWidth: number;
  rimOpacity: number;
  rimBlur: number;
  rimColor: "lunar" | "orange" | "ink";
  tileOn: boolean;
  tileBorder: number;
  displaySize: number;
  headerGap: number;
  rainColor: "lunar" | "orange" | "ink";
  rainAtRest: boolean;
  rainCount: number;
  rainWidth: number;
  rainGap: number;
  rainShift: number;
  rainFade: number;
  rainClearance: number;
  small16Zoom: number;
}

export const ICON_COLORS = {
  tile: "#131519",
  border: "#3e4656",
  ink: "#e3e0d6",
  orange: "#f2a95c",
  lunar: "#8da6e8",
};

const fmt = (n: number) => Math.round(n * 100) / 100;

/** Nested SVG placing the licensed dove artwork centred in a square of side `box`. */
function doveSvg(
  c: IconConfig,
  box: number,
  idPrefix: string,
  halo = 0,
  maskInk = false,
): string {
  const art = c.artDove === "spread" ? SPREAD_DOVE : LINE_DOVE;
  const [x, y, w, h] = art.viewBox;
  const unit = Math.max(w, h) / box; // source units per icon unit
  const ink = maskInk ? "#000" : ICON_COLORS.ink;
  const flip = c.artFlip
    ? ` transform="translate(${fmt(x * 2 + w)} 0) scale(-1 1)"`
    : "";
  const beak = c.artBeak === "none" ? "" : SPREAD_DOVE.beaks[c.artBeak];
  // The spread dove grows by `extra` via a matching stroke; the line dove is all stroke.
  const shape = (paint: string, extra: number) =>
    c.artDove === "spread"
      ? `<path d="${SPREAD_DOVE.fill}${beak}" fill="${paint}"${extra ? ` stroke="${paint}" stroke-width="${fmt(extra * unit)}" stroke-linejoin="round"` : ""}/>`
      : LINE_DOVE.strokes
          .map(
            (d) =>
              `<path d="${d}" fill="none" stroke="${paint}" stroke-width="${fmt(c.artWeight + extra * unit)}" stroke-linecap="round" stroke-linejoin="round"/>`,
          )
          .join("");

  // Translucent rim, as on RoR2 artifact icons. `--rim` lets CSS brighten it on hover.
  let defs = "";
  let rim = "";
  if (!maskInk && c.rimWidth > 0) {
    const glow = c.rimBlur > 0;
    if (glow) {
      defs = `<filter id="${idPrefix}-glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="${fmt(c.rimBlur * unit)}"/></filter>`;
    }
    rim = `<g class="rs-rim" style="--rim:${c.rimOpacity}" opacity="${c.rimOpacity}"${glow ? ` filter="url(#${idPrefix}-glow)"` : ""}>${shape(ICON_COLORS[c.rimColor], c.rimWidth * 2)}</g>`;
  }
  // A coloured beak sits inside its own cut-out.
  const beakFill =
    !maskInk && beak && c.artDove === "spread" && c.beakFill !== "cutout"
      ? `<path d="${beak}" fill="${ICON_COLORS[c.beakFill]}"/>`
      : "";

  const pos = 32 - box / 2;
  const grow = halo + (maskInk ? c.rimWidth * 2 : 0);
  return `<svg x="${fmt(pos)}" y="${fmt(pos + c.artOffsetY)}" width="${fmt(box)}" height="${fmt(box)}" viewBox="${x} ${y} ${w} ${h}" overflow="visible">${defs}<g${flip}>${rim}${shape(ink, grow)}${beakFill}</g></svg>`;
}

/**
 * @param size output pixel size; 20 or less triggers the small-size pass.
 * @param idPrefix keeps mask/filter ids unique when several marks are inlined on one page.
 *
 * Inline marks animate through CSS hooks in globals.css: `.rs-dove` lifts,
 * `.rs-rim` brightens, and `.rs-rain` / `.rs-rain-pass` lines fall.
 */
export function renderIcon(
  config: IconConfig,
  size = 512,
  idPrefix = "rs",
): string {
  const small = size <= 20;
  const px = 64 / size;
  const box = 60 * config.artSize;

  // Rain: parallel 45° lines falling down-left, spaced perpendicular to their
  // direction. Hover-only rain parks its dash before the line start.
  const rainW = Math.max(config.rainWidth, small ? px : 0);
  const rainAttrs = config.rainAtRest
    ? `class="rs-rain"`
    : `class="rs-rain-pass" stroke-dasharray="100 100" stroke-dashoffset="100"`;
  const rainLines = Array.from({ length: config.rainCount }, (_, i) => {
    const off =
      (i - (config.rainCount - 1) / 2) * config.rainGap * Math.SQRT2 +
      config.rainShift;
    return `<line ${rainAttrs} style="--i:${i}" pathLength="100" x1="${fmt(32 + off + 40)}" y1="-8" x2="${fmt(32 + off - 40)}" y2="72" stroke-width="${fmt(rainW)}"/>`;
  }).join("");

  // Rain fades out toward both ends along its fall direction (top-right → bottom-left).
  const rainColor = ICON_COLORS[config.rainColor];
  const fade = config.rainFade;
  const halo = Math.max(config.rainClearance, small ? 2 * px : 0);
  const defs = [
    `<clipPath id="${idPrefix}-tile"><rect width="64" height="64"/></clipPath>`,
    fade > 0
      ? `<linearGradient id="${idPrefix}-fade" gradientUnits="userSpaceOnUse" x1="64" y1="0" x2="0" y2="64"><stop offset="0" stop-color="${rainColor}" stop-opacity="0"/><stop offset="${fade}" stop-color="${rainColor}"/><stop offset="${fmt(1 - fade)}" stop-color="${rainColor}"/><stop offset="1" stop-color="${rainColor}" stop-opacity="0"/></linearGradient>`
      : "",
    rainLines
      ? `<mask id="${idPrefix}-halo"><rect width="64" height="64" fill="#fff"/><g class="rs-dove">${doveSvg(config, box, idPrefix, halo, true)}</g></mask>`
      : "",
  ].join("");
  const rainSvg = rainLines
    ? `<g mask="url(#${idPrefix}-halo)" stroke="${fade > 0 ? `url(#${idPrefix}-fade)` : rainColor}">${rainLines}</g>`
    : "";

  const tileBorder = small || !config.tileOn ? 0 : config.tileBorder;
  const borderSvg =
    tileBorder > 0
      ? `<rect x="${fmt(tileBorder / 2)}" y="${fmt(tileBorder / 2)}" width="${fmt(64 - tileBorder)}" height="${fmt(64 - tileBorder)}" fill="none" stroke="${ICON_COLORS.border}" stroke-width="${fmt(tileBorder)}"/>`
      : "";
  const zoom = small ? config.small16Zoom : 1;
  const body = `<g${zoom !== 1 ? ` transform="translate(32 32) scale(${fmt(zoom)}) translate(-32 -32)"` : ""}>${rainSvg}<g class="rs-dove">${doveSvg(config, box, idPrefix)}</g></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><defs>${defs}</defs><g clip-path="url(#${idPrefix}-tile)">${config.tileOn ? `<rect width="64" height="64" fill="${ICON_COLORS.tile}"/>` : ""}${body}${borderSvg}</g></svg>`;
}
