import { survivorEntries } from "@/data/logbook/survivors";
import type { LogbookEntry, SaveData } from "@/data/types";

/**
 * Eclipse progress is a set of hidden unlockables per survivor,
 * Eclipse.<SurvivorDef.cachedName>.<level> for levels 2..9, stored as
 * <unlock> entries in <stats> (RoR2Content.CreateEclipseUnlockablesForSurvivor,
 * minEclipseLevel 1, maxEclipseLevel 8). Beating Eclipse N grants level N + 1.
 */
export const MAX_ECLIPSE_LEVEL = 8;
const MIN_UNLOCKABLE_LEVEL = 2;

type EclipseSurvivor = LogbookEntry & { survivorDef: string };

/** Survivors that have Eclipse progress (every SurvivorDef) */
export const eclipseSurvivors: EclipseSurvivor[] = survivorEntries.filter(
  (s): s is EclipseSurvivor => Boolean(s.survivorDef),
);

export function eclipseUnlockId(survivorDef: string, level: number): string {
  return `Eclipse.${survivorDef}.${level}`;
}

/** Every Eclipse unlockable for a survivor, Eclipse.<name>.2 … .9 */
function eclipseUnlockIds(survivorDef: string): string[] {
  return Array.from({ length: MAX_ECLIPSE_LEVEL }, (_, i) =>
    eclipseUnlockId(survivorDef, MIN_UNLOCKABLE_LEVEL + i),
  );
}

/**
 * Highest Eclipse level completed (0-8), counting the consecutive levels the
 * profile owns from 2 like EclipseRun.GetLocalUserSurvivorCompletedEclipseLevel.
 */
export function getEclipseLevel(
  saveData: SaveData,
  survivorDef: string,
): number {
  const unlocks = new Set(saveData.unlocks);
  let level = 0;
  for (const id of eclipseUnlockIds(survivorDef)) {
    if (!unlocks.has(id)) break;
    level++;
  }
  return level;
}

/**
 * Mark Eclipse 1..level completed: writes Eclipse.<name>.2 … .level+1 and
 * removes the higher levels, so the game reads exactly this level.
 */
export function setEclipseLevel(
  saveData: SaveData,
  survivorDef: string,
  level: number,
): SaveData {
  const completed = Math.max(0, Math.min(MAX_ECLIPSE_LEVEL, Math.floor(level)));
  const ids = eclipseUnlockIds(survivorDef);
  const owned = ids.slice(0, completed);
  const removed = new Set(ids.slice(completed));
  // Keep existing unlocks in place and append the missing levels in order
  const unlocks = saveData.unlocks.filter((u) => !removed.has(u));
  const present = new Set(unlocks);
  unlocks.push(...owned.filter((id) => !present.has(id)));
  return { ...saveData, unlocks };
}

/** Set every survivor's Eclipse progress to the same level */
export function setAllEclipseLevels(
  saveData: SaveData,
  level: number,
): SaveData {
  return eclipseSurvivors.reduce(
    (data, s) => setEclipseLevel(data, s.survivorDef, level),
    saveData,
  );
}
