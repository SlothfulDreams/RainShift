"use client";

import { useEffect, useRef, useState } from "react";
import keeper from "@/data/icon-mark.json";
import { type IconConfig, renderIcon } from "@/lib/icon-mark";
import { KNOB_GROUPS, type Knob, randomize } from "./knobs";

type Target = "header" | "favicon";

const toDataUrl = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

function PixelZoom({ svg }: { svg: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const small = document.createElement("canvas");
      small.width = 16;
      small.height = 16;
      small.getContext("2d")?.drawImage(img, 0, 0, 16, 16);
      const ctx = ref.current?.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, 128, 128);
      ctx.drawImage(small, 0, 0, 128, 128);
    };
    img.src = toDataUrl(svg);
  }, [svg]);
  return (
    <canvas
      ref={ref}
      width={128}
      height={128}
      className="border border-ror-border"
    />
  );
}

function KnobRow({
  knob,
  config,
  onChange,
}: {
  knob: Knob;
  config: IconConfig;
  onChange: (key: keyof IconConfig, value: unknown) => void;
}) {
  const value = config[knob.key];
  const id = `knob-${knob.key}`;
  return (
    <div className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-2 text-xs">
      <label htmlFor={id} className="text-ror-text-muted">
        {knob.label}
      </label>
      {knob.kind === "range" && (
        <input
          id={id}
          type="range"
          min={knob.min}
          max={knob.max}
          step={knob.step}
          value={value as number}
          onChange={(e) => onChange(knob.key, Number(e.target.value))}
          className="accent-ror-orange-accent"
        />
      )}
      {knob.kind === "toggle" && (
        <input
          id={id}
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => onChange(knob.key, e.target.checked)}
          className="justify-self-start accent-ror-orange-accent"
        />
      )}
      {knob.kind === "select" && (
        <select
          id={id}
          value={value as string}
          onChange={(e) => onChange(knob.key, e.target.value)}
          className="ror-input py-0.5 text-xs"
        >
          {knob.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
      <span className="text-right tabular-nums text-ror-text-dim">
        {knob.kind === "range" ? (value as number) : ""}
      </span>
    </div>
  );
}

function InlineSvg({
  svg,
  style,
}: {
  svg: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="block shrink-0 [&>svg]:block"
      style={style}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated locally by renderIcon
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function IconLab() {
  const [marks, setMarks] = useState(keeper as Record<Target, IconConfig>);
  const [target, setTarget] = useState<Target>("header");
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState<IconConfig[]>([]);
  const [written, setWritten] = useState<string[]>([]);
  const config = marks[target];
  const setConfig = (next: (c: IconConfig) => IconConfig) =>
    setMarks((m) => ({ ...m, [target]: next(m[target]) }));

  useEffect(() => {
    fetch("/lab/icon/save")
      .then((r) => r.json())
      .then((d) => setSaved(d.saved ?? []));
  }, []);

  const set = (key: keyof IconConfig, value: unknown) =>
    setConfig((c) => ({ ...c, [key]: value }));
  const reroll = () =>
    setConfig((c) => randomize(c, Math.floor(Math.random() * 2 ** 31)));

  const save = async () => {
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    const res = await fetch("/lab/icon/save", {
      method: "POST",
      body: JSON.stringify({ target, config }),
    });
    const data = await res.json();
    setSaved(data.saved);
    setWritten(data.written);
  };

  const favicon = { ...marks.favicon, tileOn: true };
  const at16 = renderIcon(favicon, 16);
  const looping = playing ? "rs-play" : "";

  return (
    <div className="min-h-screen grid-bg p-8 flex gap-8">
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ror-text-dim tracking-widest uppercase mr-2">
            Editing
          </span>
          {(["header", "favicon"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTarget(id)}
              className={`ror-button text-xs ${target === id ? "border-ror-orange-accent text-white" : ""}`}
            >
              {id}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="ror-button text-xs ml-4"
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <button
          type="button"
          onClick={reroll}
          aria-label="Generate a new variation"
          className={`rs-trigger ${looping} self-start border border-ror-border bg-ror-bg-header hover:border-ror-border-highlight cursor-pointer`}
        >
          <InlineSvg svg={renderIcon(config, 448, "lab-big")} />
        </button>
        <div className="text-[10px] text-ror-text-dim tracking-widest uppercase">
          Seed {config.seed} · click the canvas for a new one · hover to preview
          the animation
        </div>

        <div
          className={`rs-trigger ${looping} h-20 border border-ror-border bg-ror-bg-header/80 flex items-center px-8 gap-4 w-[448px]`}
        >
          <InlineSvg
            svg={renderIcon(
              marks.header,
              marks.header.displaySize,
              "lab-header",
            )}
            // Mirrors RainShiftMark: headerGap replaces the 16px flex gap.
            style={{ marginRight: marks.header.headerGap - 16 }}
          />
          <div>
            <div className="text-2xl font-display text-ror-text-main tracking-[0.2em] leading-none">
              RAINSHIFT
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[1px] w-8 bg-ror-orange-accent" />
              <span className="text-[10px] text-ror-text-dim tracking-widest uppercase">
                Profile Editor
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-6">
          <div className="flex flex-col gap-2">
            {[
              ["#35363a", "#e8eaed"],
              ["#f1f3f4", "#202124"],
            ].map(([bg, fg]) => (
              <div
                key={bg}
                className="flex items-center gap-2 w-48 h-8 px-2"
                style={{ background: bg, color: fg }}
              >
                {/* biome-ignore lint/performance/noImgElement: favicon preview */}
                <img src={toDataUrl(at16)} alt="" width={16} height={16} />
                <span className="text-[11px] font-sans truncate">
                  Risk of Rain 2 Save Editor
                </span>
              </div>
            ))}
          </div>
          <PixelZoom svg={at16} />
          {/* biome-ignore lint/performance/noImgElement: preview */}
          <img
            src={toDataUrl(renderIcon(favicon, 32))}
            alt=""
            width={32}
            height={32}
          />
        </div>
      </section>

      <aside className="w-96 flex flex-col gap-5 ror-card p-5 h-fit">
        {KNOB_GROUPS.map((group) => (
          <fieldset key={group.title} className="flex flex-col gap-1.5">
            <legend className="font-display text-[10px] tracking-[0.2em] text-ror-orange-accent mb-1">
              {group.title}
            </legend>
            {group.knobs.map((knob) => (
              <KnobRow
                key={knob.key}
                knob={knob}
                config={config}
                onChange={set}
              />
            ))}
          </fieldset>
        ))}

        <button type="button" onClick={save} className="ror-button">
          Save &amp; publish {target}
        </button>
        {written.length > 0 && (
          <p className="text-[10px] text-ror-text-muted leading-relaxed">
            Wrote {written.join(", ")}
          </p>
        )}

        {saved.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {saved.map((s, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: saved rail is append-only
                key={i}
                type="button"
                onClick={() => setConfig(() => s)}
                aria-label={`Apply saved config ${i + 1}`}
                className="border border-ror-border bg-ror-bg-header hover:border-ror-border-highlight"
              >
                {/* biome-ignore lint/performance/noImgElement: thumbnail */}
                <img
                  src={toDataUrl(renderIcon(s, 40))}
                  alt=""
                  width={40}
                  height={40}
                  className="block"
                />
              </button>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
