"use client";

import { motion } from "framer-motion";
import { Check, Landmark, Lock, MapPin } from "lucide-react";
import type { NewtAltar } from "@/data/newt-altars";
import { newtAltars } from "@/data/newt-altars";
import type { DLC, SaveData } from "@/data/types";
import {
  countUnlockedNewtAltars,
  isNewtAltarUnlocked,
  lockAllNewtAltars,
  NEWTIST_ACHIEVEMENT,
  NEWTIST_REQUIREMENT,
  type NewtAltarGroup,
  newtAltarGroups,
  setNewtAltars,
  unlockAllNewtAltars,
} from "@/lib/newt-altars";
import { LogbookIcon } from "./LogbookIcon";

const DLC_SHORT_NAMES: Record<DLC, string> = {
  base: "Base",
  sotv: "SOTV",
  sots: "SOTS",
  ac: "AC",
  hc: "HC",
};

interface NewtAltarEditorProps {
  saveData: SaveData;
  onSaveDataChange: (saveData: SaveData) => void;
}

export function NewtAltarEditor({
  saveData,
  onSaveDataChange,
}: NewtAltarEditorProps) {
  const unlocked = countUnlockedNewtAltars(saveData);
  const hasNewtist = saveData.achievements.includes(NEWTIST_ACHIEVEMENT);

  const set = (altars: NewtAltar[], enabled: boolean) =>
    onSaveDataChange(setNewtAltars(saveData, altars, enabled));

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
            <Landmark size={18} className="text-ror-text-main" />
          </div>
          <div>
            <p className="text-ror-text-main font-display text-sm uppercase tracking-wider">
              Newt Altars
            </p>
            <p className="text-ror-text-muted text-xs">
              <span className="text-ror-uncommon">{unlocked}</span> /{" "}
              {newtAltars.length} altars discovered
            </p>
            <p className="text-ror-text-dim text-[10px] mt-0.5">
              Newtist: {Math.min(unlocked, NEWTIST_REQUIREMENT)} /{" "}
              {NEWTIST_REQUIREMENT}
              {hasNewtist
                ? " (unlocked)"
                : unlocked >= NEWTIST_REQUIREMENT
                  ? " (the game grants it on next launch)"
                  : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSaveDataChange(unlockAllNewtAltars(saveData))}
            className="ror-button text-[10px] py-2 px-4 bg-ror-uncommon text-ror-bg-main border-ror-uncommon hover:brightness-110 font-bold tracking-wider"
          >
            UNLOCK ALL
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSaveDataChange(lockAllNewtAltars(saveData))}
            className="ror-button text-[10px] py-2 px-4 bg-ror-legendary text-ror-bg-main border-ror-legendary hover:brightness-110 font-bold tracking-wider"
          >
            LOCK ALL
          </motion.button>
        </div>
      </motion.div>

      {/* Stage Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 overflow-y-auto pr-2 pb-4 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 220px)" }}
      >
        {newtAltarGroups.map((group) => (
          <StageCard
            key={group.stage.id}
            group={group}
            saveData={saveData}
            onSet={set}
          />
        ))}
      </div>
    </div>
  );
}

function StageCard({
  group,
  saveData,
  onSet,
}: {
  group: NewtAltarGroup;
  saveData: SaveData;
  onSet: (altars: NewtAltar[], enabled: boolean) => void;
}) {
  const { stage, altars } = group;
  const found = countUnlockedNewtAltars(saveData, altars);
  const allFound = found === altars.length;

  // Stage variants (e.g. blackbeach and blackbeach2) have their own altars
  const scenes = Array.from(new Set(altars.map((a) => a.scene)));

  return (
    <div
      className={`ror-card h-full flex flex-col ${found > 0 ? "bg-ror-bg-panel border-ror-border-highlight" : "bg-ror-bg-main"}`}
    >
      <div
        className={`h-1 w-full ${allFound ? "bg-ror-uncommon" : "bg-ror-border"}`}
      />
      <div className="p-3 flex gap-3 flex-1">
        <div className="relative w-12 h-12 flex-shrink-0 bg-black border border-ror-border flex items-center justify-center overflow-hidden">
          <LogbookIcon
            entry={stage}
            fallback={<MapPin size={20} className="text-ror-text-dim" />}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h4 className="font-display text-xs uppercase tracking-wide leading-tight text-ror-text-main">
                {stage.name}
              </h4>
              <p className="text-ror-text-dim text-[10px] mt-0.5">
                {found} / {altars.length} found
                {stage.dlc !== "base" && ` · ${DLC_SHORT_NAMES[stage.dlc]}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSet(altars, !allFound)}
              aria-label={`${allFound ? "Lock" : "Unlock"} all ${stage.name} altars`}
              className="ror-button text-[9px] py-1 px-2 flex-shrink-0"
            >
              {allFound ? "LOCK" : "UNLOCK"} ALL
            </button>
          </div>

          {scenes.map((scene, i) => (
            <div key={scene} className="flex items-center gap-1.5 flex-wrap">
              {scenes.length > 1 && (
                <span
                  title={scene}
                  className="text-[9px] uppercase tracking-wider text-ror-text-dim w-full"
                >
                  Layout {i + 1}
                </span>
              )}
              {altars
                .filter((a) => a.scene === scene)
                .map((altar) => (
                  <AltarToggle
                    key={altar.unlockId}
                    altar={altar}
                    label={
                      scenes.length > 1
                        ? `${stage.name} layout ${i + 1}`
                        : stage.name
                    }
                    isUnlocked={isNewtAltarUnlocked(saveData, altar)}
                    onToggle={(enabled) => onSet([altar], enabled)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AltarToggle({
  altar,
  label,
  isUnlocked,
  onToggle,
}: {
  altar: NewtAltar;
  /** Stage (and layout) the altar is in, for screen readers */
  label: string;
  isUnlocked: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const number = Number(altar.unlockId.split(".").pop()) + 1;
  return (
    <button
      type="button"
      onClick={() => onToggle(!isUnlocked)}
      aria-pressed={isUnlocked}
      aria-label={`${label} altar ${number}`}
      title={altar.unlockId}
      className={`
        flex items-center gap-1 px-2 py-1.5 text-[10px] uppercase tracking-wider border
        transition-[color,background-color,border-color,transform] duration-150 active:scale-95
        focus-visible:outline-2 focus-visible:outline-ror-orange-accent
        ${
          isUnlocked
            ? "bg-ror-uncommon/15 text-ror-uncommon border-ror-uncommon/60"
            : "bg-transparent text-ror-text-dim border-ror-border hover:text-ror-text-main hover:border-ror-text-dim"
        }
      `}
    >
      {isUnlocked ? <Check size={10} strokeWidth={4} /> : <Lock size={10} />}
      Altar {number}
    </button>
  );
}
