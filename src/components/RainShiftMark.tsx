import { HEADER_GAP, HEADER_SVG } from "./rainshift-mark-svg";

// The header lays the mark out with a 16px flex gap; HEADER_GAP overrides it.
const FLEX_GAP = 16;

/** The RainShift dove mark. Animates on hover of the nearest `.rs-trigger` ancestor. */
export function RainShiftMark() {
  return (
    <span
      aria-hidden
      className="block shrink-0 [&>svg]:block"
      style={{ marginRight: HEADER_GAP - FLEX_GAP }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG pre-rendered from the saved icon config
      dangerouslySetInnerHTML={{ __html: HEADER_SVG }}
    />
  );
}
