"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { startingKarmaLevels } from "@/data/karma-levels";
import type { SaveData } from "@/data/types";
import {
  getStartingKarma,
  isStartingKarmaUnlocked,
  setStartingKarma,
} from "@/lib/karma";

interface KarmaEditorProps {
  saveData: SaveData;
  onSaveDataChange: (saveData: SaveData) => void;
}

/**
 * Starting karma levels the run setup lets you pick (Hallowed Concepts
 * update). Picking level N unlocks levels 1..N and locks the ones above.
 */
export function KarmaEditor({ saveData, onSaveDataChange }: KarmaEditorProps) {
  const current = getStartingKarma(saveData);
  const currentLevel = startingKarmaLevels.find((l) => l.level === current);
  const hasLevelZero = isStartingKarmaUnlocked(saveData, 0);

  return (
    <div className="ror-card p-4 space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-ror-lunar/40 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-ror-lunar font-display">
          Starting Karma
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-ror-lunar/40 to-transparent" />
      </div>

      {/* Current level */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex-shrink-0">
          {currentLevel?.image && (
            <Image
              src={currentLevel.image}
              alt=""
              width={40}
              height={40}
              className="object-contain w-full h-full"
              unoptimized
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-display text-ror-lunar tracking-wider">
            Unlocked up to {current}
          </p>
          <p className="text-[10px] text-ror-text-dim leading-snug">
            Winning a run unlocks the karma level you ended on.
          </p>
        </div>
      </div>

      {/* Level picker */}
      <fieldset className="grid grid-cols-9 gap-0.5">
        <legend className="sr-only">Unlock starting karma up to</legend>
        {startingKarmaLevels.map((level) => {
          const unlocked = isStartingKarmaUnlocked(saveData, level.level);
          const selected = level.level === current;
          return (
            <motion.button
              key={level.level}
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                onSaveDataChange(setStartingKarma(saveData, level.level))
              }
              aria-pressed={selected}
              aria-label={`Unlock starting karma up to ${level.level}`}
              title={`${level.name}${unlocked ? "" : " (locked)"}: ${level.description}`}
              className={`
                relative aspect-square p-0.5 border transition-all
                ${
                  selected
                    ? "border-ror-lunar bg-ror-lunar/15"
                    : "border-transparent hover:border-ror-lunar/40"
                }
              `}
            >
              {level.image ? (
                <Image
                  src={level.image}
                  alt=""
                  width={32}
                  height={32}
                  className={`object-contain w-full h-full ${
                    unlocked ? "" : "opacity-25 grayscale"
                  }`}
                  unoptimized
                />
              ) : (
                <span className="text-[10px] font-mono">{level.level}</span>
              )}
            </motion.button>
          );
        })}
      </fieldset>

      {!hasLevelZero && (
        <p className="text-[10px] text-ror-text-dim leading-snug">
          &ldquo;No Karma&rdquo; also needs the Captain unlocked.
        </p>
      )}
    </div>
  );
}
