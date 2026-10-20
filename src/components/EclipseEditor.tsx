"use client";

import { motion } from "framer-motion";
import { Moon, User } from "lucide-react";
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

export function EclipseEditor({
  saveData,
  onSaveDataChange,
}: EclipseEditorProps) {
  const levels = eclipseSurvivors.map((s) =>
    s.survivorDef ? getEclipseLevel(saveData, s.survivorDef) : 0,
  );
  const maxed = levels.filter((l) => l === MAX_ECLIPSE_LEVEL).length;

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
            <Moon size={18} className="text-ror-void" />
          </div>
          <div>
            <p className="text-ror-text-main font-display text-sm uppercase tracking-wider">
              Eclipse Progress
            </p>
            <p className="text-ror-text-muted text-xs">
              <span className="text-ror-void">{maxed}</span> /{" "}
              {eclipseSurvivors.length} survivors completed Eclipse{" "}
              {MAX_ECLIPSE_LEVEL}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() =>
              onSaveDataChange(setAllEclipseLevels(saveData, MAX_ECLIPSE_LEVEL))
            }
            className="ror-button text-[10px] py-2 px-4 bg-ror-uncommon text-ror-bg-main border-ror-uncommon hover:brightness-110 font-bold tracking-wider"
          >
            MAX ALL
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSaveDataChange(setAllEclipseLevels(saveData, 0))}
            className="ror-button text-[10px] py-2 px-4 bg-ror-legendary text-ror-bg-main border-ror-legendary hover:brightness-110 font-bold tracking-wider"
          >
            RESET ALL
          </motion.button>
        </div>
      </motion.div>

      <p className="px-2 text-ror-text-dim text-xs">
        Choose the highest Eclipse each survivor has beaten. For example, pick 3
        and Eclipse 4 will be unlocked for that survivor.
      </p>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto pr-2 pb-4 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        {eclipseSurvivors.map((survivor, i) => {
          const { survivorDef } = survivor;
          if (!survivorDef) return null;
          const level = levels[i];
          return (
            <div key={survivor.id} className="ror-card p-3 flex gap-3">
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
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="font-display text-xs uppercase tracking-wide text-ror-text-main truncate">
                    {survivor.name}
                  </h4>
                  <span className="text-[10px] uppercase tracking-wider text-ror-text-dim whitespace-nowrap">
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
                <fieldset className="flex gap-0.5">
                  <legend className="sr-only">
                    {survivor.name}: highest Eclipse level beaten
                  </legend>
                  {LEVELS.map((l) => (
                    <label
                      key={l}
                      title={l === 0 ? "None beaten" : `Eclipse ${l} beaten`}
                      className={`
                        flex-1 py-1 text-center text-[10px] font-mono border transition-colors cursor-pointer
                        has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ror-orange-accent
                        ${
                          l === level
                            ? "bg-ror-void text-ror-bg-main border-ror-void font-bold"
                            : l !== 0 && l < level
                              ? "bg-ror-void/20 text-ror-void border-ror-void/40 hover:bg-ror-void/30"
                              : "bg-transparent text-ror-text-dim border-ror-border hover:text-ror-text-main hover:border-ror-text-dim"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`eclipse-${survivor.id}`}
                        className="sr-only"
                        aria-label={l === 0 ? "None" : `Eclipse ${l}`}
                        checked={l === level}
                        onChange={() =>
                          onSaveDataChange(
                            setEclipseLevel(saveData, survivorDef, l),
                          )
                        }
                      />
                      {l === 0 ? "–" : l}
                    </label>
                  ))}
                </fieldset>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
