import type { DLC } from "@/data/types";

const tags: Record<Exclude<DLC, "base">, { label: string; style: string }> = {
  sotv: {
    label: "VOID",
    style: "border-ror-void text-ror-void bg-ror-void/10",
  },
  // Boss yellow/gold for Seekers of the Storm
  sots: {
    label: "STORM",
    style: "border-ror-boss text-ror-boss bg-ror-boss/10",
  },
  ac: {
    label: "ALLOYED",
    style: "border-ror-lunar text-ror-lunar bg-ror-lunar/10",
  },
  hc: {
    label: "HALLOWED",
    style: "border-ror-legendary text-ror-legendary bg-ror-legendary/10",
  },
};

/** Short DLC badge on challenge and logbook cards; nothing for the base game */
export function DLCTag({ dlc }: { dlc: DLC }) {
  if (dlc === "base") return null;
  const { label, style } = tags[dlc];
  return (
    <span
      className={`px-1.5 py-0.5 text-[9px] uppercase tracking-wider border ${style}`}
    >
      {label}
    </span>
  );
}
