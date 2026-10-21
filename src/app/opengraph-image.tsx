import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import marks from "@/data/icon-mark.json";
import { type IconConfig, renderIcon } from "@/lib/icon-mark";

export const alt = "RainShift - Risk of Rain 2 Save Editor";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const font = (file: string) =>
  readFile(path.join(process.cwd(), "node_modules/@fontsource", file));

// Static image, so the header's hover-only rain is shown at rest.
const dove = renderIcon(
  { ...(marks.header as IconConfig), rainAtRest: true },
  176,
  "og",
);

export default async function OpenGraphImage() {
  const [orbitron, mono] = await Promise.all([
    font("orbitron/files/orbitron-latin-400-normal.woff"),
    font("jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"),
  ]);

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 20% 20%, #2a3345 0%, #131519 48%, #0d0f12 100%)",
        color: "#e3e0d6",
        display: "flex",
        flexDirection: "column",
        fontFamily: "JetBrains Mono",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
        {/* biome-ignore lint/performance/noImgElement: rendered by Satori, not the browser */}
        <img
          src={`data:image/svg+xml;base64,${Buffer.from(dove).toString("base64")}`}
          width={176}
          height={176}
          alt=""
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Orbitron",
              fontSize: 72,
              letterSpacing: "0.2em",
              lineHeight: 1,
            }}
          >
            RAINSHIFT
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 16,
              marginTop: 14,
            }}
          >
            <div style={{ background: "#f2a95c", height: 2, width: 64 }} />
            <div
              style={{
                color: "#5a6370",
                fontSize: 22,
                letterSpacing: "0.3em",
              }}
            >
              PROFILE EDITOR
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Orbitron",
          fontSize: 48,
          gap: 18,
          letterSpacing: "0.05em",
          marginTop: 64,
        }}
      >
        <span>RISK OF RAIN 2</span>
        <span style={{ color: "#f2a95c" }}>SAVE EDITOR</span>
      </div>
      <div
        style={{
          color: "#8f9aa8",
          display: "flex",
          fontSize: 24,
          marginTop: 24,
        }}
      >
        Edit your profile locally in your browser
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Orbitron", data: orbitron, weight: 400 },
        { name: "JetBrains Mono", data: mono, weight: 400 },
      ],
    },
  );
}
