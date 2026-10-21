"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";
import type { SaveData } from "@/data/types";
import { DLC_NAMES } from "@/data/types";
import {
  eclipseSurvivors,
  getEclipseLevel,
  MAX_ECLIPSE_LEVEL,
  setAllEclipseLevels,
  setEclipseLevel,
} from "@/lib/eclipse";

interface EclipseEditorProps {
  saveData: SaveData;
  onSaveDataChange: (saveData: SaveData) => void;
}

const LEVELS = Array.from({ length: MAX_ECLIPSE_LEVEL + 1 }, (_, i) => i);

/**
 * The game's character-select medal for an Eclipse level
 * (EclipseDifficultyMedalDisplay): gold once every survivor has beaten it.
 */
export function eclipseMedal(level: number, beaten: boolean, gold: boolean) {
  if (gold) return `/eclipse/eclipse-${level}-gold.webp`;
  if (beaten) return `/eclipse/eclipse-${level}.webp`;
  return `/eclipse/eclipse-${level}-unearned.webp`;
}

export function EclipseEditor({
  saveData,
  onSaveDataChange,
}: EclipseEditorProps) {
  const levels = eclipseSurvivors.map((s) =>
    getEclipseLevel(saveData, s.survivorDef),
  );
  const maxed = levels.filter((l) => l === MAX_ECLIPSE_LEVEL).length;
  // Levels every survivor has beaten show the gold medal, as in the game
  const goldUpTo = Math.min(...levels);

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Stats Bar with Bulk Actions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="ror-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-ror-bg-main border border-ror-border flex items-center justify-center">
            <Image
              src={eclipseMedal(
                MAX_ECLIPSE_LEVEL,
                true,
                goldUpTo === MAX_ECLIPSE_LEVEL,
              )}
              alt=""
              width={32}
              height={32}
              unoptimized
            />
          </div>
          <div>
            <p className="text-ror-text-main font-display text-sm uppercase tracking-wider">
              Eclipse Progress
            </p>
            <p className="text-ror-text-muted text-xs tabular-nums">
              <span className="text-ror-void">{maxed}</span> /{" "}
              {eclipseSurvivors.length} survivors completed Eclipse{" "}
              {MAX_ECLIPSE_LEVEL}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSaveDataChange(setAllEclipseLevels(saveData, 0))}
            className="text-[10px] font-display uppercase tracking-wider text-ror-text-dim cursor-pointer transition-colors duration-150 hover:text-ror-legendary focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ror-orange-accent"
          >
            Reset all
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() =>
              onSaveDataChange(setAllEclipseLevels(saveData, MAX_ECLIPSE_LEVEL))
            }
            className="ror-button text-[10px] py-2 px-4 font-bold tracking-wider focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ror-orange-accent"
          >
            MAX ALL
          </motion.button>
        </div>
      </motion.div>

      <p className="px-2 text-pretty text-ror-text-dim text-xs">
        Choose the highest Eclipse each survivor has beaten. For example, pick 3
        and Eclipse 4 will be unlocked for that survivor.
      </p>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto pr-2 pb-4 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        {eclipseSurvivors.map((survivor, i) => {
          const level = levels[i];
          return (
            <div
              key={survivor.id}
              className="p-3 flex flex-col gap-2 bg-ror-bg-panel border border-ror-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 bg-black border border-ror-border flex items-center justify-center overflow-hidden">
                  {survivor.image ? (
                    <Image
                      src={survivor.image}
                      alt=""
                      width={48}
                      height={48}
                      className="object-contain w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <User size={20} className="text-ror-text-dim" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex justify-between items-baseline gap-2">
                  <h4 className="font-display text-xs uppercase tracking-wide text-ror-text-main truncate">
                    {survivor.name}
                  </h4>
                  <span className="text-[10px] uppercase tracking-wider text-ror-text-dim whitespace-nowrap tabular-nums">
                    {level === 0 ? (
                      "None beaten"
                    ) : (
                      <>
                        Eclipse <span className="text-ror-void">{level}</span>
                      </>
                    )}
                    {survivor.dlc !== "base" && (
                      <span title={DLC_NAMES[survivor.dlc]}>
                        {" "}
                        · {survivor.dlc}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <fieldset className="flex min-w-0">
                <legend className="sr-only">
                  {survivor.name}: highest Eclipse level beaten
                </legend>
                {LEVELS.map((l) => (
                  <label
                    key={l}
                    title={l === 0 ? "None beaten" : `Eclipse ${l} beaten`}
                    className="group flex-1 h-11 flex items-center justify-center cursor-pointer has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ror-orange-accent"
                  >
                    <input
                      type="radio"
                      name={`eclipse-${survivor.id}`}
                      className="sr-only"
                      aria-label={l === 0 ? "None" : `Eclipse ${l}`}
                      checked={l === level}
                      onChange={() =>
                        onSaveDataChange(
                          setEclipseLevel(saveData, survivor.survivorDef, l),
                        )
                      }
                    />
                    <span className="flex w-full max-w-8 aspect-square items-center justify-center transition-transform duration-150 ease-out motion-safe:group-hover:scale-110 motion-safe:group-active:scale-95">
                      {l === 0 ? (
                        <span className="text-xs font-mono text-ror-text-dim group-hover:text-ror-text-main">
                          –
                        </span>
                      ) : (
                        <Image
                          src={eclipseMedal(l, l <= level, l <= goldUpTo)}
                          alt=""
                          width={32}
                          height={32}
                          className="w-full h-auto"
                          unoptimized
                        />
                      )}
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
          );
        })}
      </div>
    </div>
  );
}
