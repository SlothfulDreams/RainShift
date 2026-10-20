import { challenges } from "@/data/challenges";
import { startingKarmaLevels } from "@/data/karma-levels";
import type { SaveData } from "@/data/types";
import { toggleAchievement, type UnlockOptions } from "./save-operations";

/**
 * Starting karma (Karma.InitialLevel run rule).
 * Each choice is selectable once the profile owns its unlockable
 * (KarmaManager.GetRequiredUnlockableForKarmaLevel), stored as an <unlock> in
 * <stats>. Winning a run at karma N grants the unlockables of levels 1..N
 * (KarmaManager.OnClientGameOver); level 0 is gated by the Captain unlock
 * instead.
 */

export const MAX_STARTING_KARMA = Math.max(
  ...startingKarmaLevels.map((l) => l.level),
);

/** Levels a won run grants, lowest first */
const grantedLevels = startingKarmaLevels
  .flatMap(({ level, unlockId }) =>
    level > 0 && unlockId ? [{ level, unlockId }] : [],
  )
  .sort((a, b) => a.level - b.level);

const grantedUnlocks = new Set(grantedLevels.map((l) => l.unlockId));

/** True when the level can be chosen in the run setup */
export function isStartingKarmaUnlocked(
  saveData: SaveData,
  level: number,
): boolean {
  const gate = startingKarmaLevels.find((l) => l.level === level)?.unlockId;
  return !gate || saveData.unlocks.includes(gate);
}

/** Highest N such that levels 1..N are all unlocked */
export function getStartingKarma(saveData: SaveData): number {
  const unlocks = new Set(saveData.unlocks);
  let level = 0;
  for (const l of grantedLevels) {
    if (!unlocks.has(l.unlockId)) break;
    level = l.level;
  }
  return level;
}

const levelZeroGate = startingKarmaLevels.find((l) => l.level === 0)?.unlockId;

/** Achievement that grants level 0's gate (Washed Away, for the Captain) */
export const levelZeroChallenge = levelZeroGate
  ? challenges.find((c) => c.unlocks.includes(levelZeroGate))
  : undefined;

/**
 * Unlock starting karma up to `level`: writes levels 1..level and removes the
 * ones above it. Other unlocks keep their order.
 *
 * Karma is off by default and every choice that turns it on is locked, level
 * 0 behind the Captain. Solo, earning any level therefore means the profile
 * already beat the game, so level 1 and up also unlocks Washed Away. Going
 * back to 0 keeps it: the game never revokes it.
 */
export function setStartingKarma(
  saveData: SaveData,
  level: number,
  options: UnlockOptions = {},
): SaveData {
  const max = Math.min(Math.max(Math.trunc(level) || 0, 0), MAX_STARTING_KARMA);
  const wanted = grantedLevels
    .filter((l) => l.level <= max)
    .map((l) => l.unlockId);
  const keep = new Set(wanted);
  const unlocks = saveData.unlocks.filter(
    (u) => !grantedUnlocks.has(u) || keep.has(u),
  );
  for (const id of wanted) {
    if (!unlocks.includes(id)) unlocks.push(id);
  }
  const result = { ...saveData, unlocks };
  if (max > 0 && levelZeroChallenge && !isStartingKarmaUnlocked(result, 0)) {
    return toggleAchievement(
      result,
      levelZeroChallenge.achievement,
      true,
      options,
    );
  }
  return result;
}
