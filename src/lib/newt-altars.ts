import { logbookEntries } from "@/data/logbook-entries";
import { type NewtAltar, newtAltars } from "@/data/newt-altars";
import type { LogbookEntry, SaveData } from "@/data/types";

/**
 * Newt altars are the NewtStatue.<scene>.<n> unlockables, stored as <unlock>
 * entries in <stats> like any other unlockable (UserProfile.GrantUnlockable).
 * The Newtist achievement (RoR2.Achievements.FindUniqueNewtStatues) counts
 * every owned unlockable whose name starts with "NewtStatue." and is granted
 * by the game once the count reaches 8.
 */
export const NEWTIST_ACHIEVEMENT = "FindUniqueNewtStatues";
export const NEWTIST_REQUIREMENT = 8;

export interface NewtAltarGroup {
  stage: LogbookEntry;
  altars: NewtAltar[];
}

const environmentsById = new Map(
  logbookEntries
    .filter((e) => e.category === "environments")
    .map((e) => [e.id, e]),
);

/** Altars grouped by the environment log of their stage, in logbook order */
export const newtAltarGroups: NewtAltarGroup[] = (() => {
  const groups = new Map<string, NewtAltarGroup>();
  for (const altar of newtAltars) {
    const stage = environmentsById.get(altar.environmentId);
    if (!stage) throw new Error(`unknown stage ${altar.environmentId}`);
    const group = groups.get(stage.id) ?? { stage, altars: [] };
    group.altars.push(altar);
    groups.set(stage.id, group);
  }
  return Array.from(groups.values());
})();

export function isNewtAltarUnlocked(
  saveData: SaveData,
  altar: NewtAltar,
): boolean {
  return saveData.unlocks.includes(altar.unlockId);
}

/**
 * Altars that count toward Newtist. The game drops unlocks it doesn't know
 * when loading the profile, so only known altars are counted.
 */
export function countUnlockedNewtAltars(
  saveData: SaveData,
  altars: NewtAltar[] = newtAltars,
): number {
  const unlocks = new Set(saveData.unlocks);
  return altars.filter((a) => unlocks.has(a.unlockId)).length;
}

/**
 * Unlock or lock a set of newt altars. Only their unlockables change; the
 * game grants Newtist itself on load when 8 or more are owned, and never
 * revokes it.
 */
export function setNewtAltars(
  saveData: SaveData,
  altars: NewtAltar[],
  enabled: boolean,
): SaveData {
  const unlocks = new Set(saveData.unlocks);
  for (const altar of altars) {
    if (enabled) unlocks.add(altar.unlockId);
    else unlocks.delete(altar.unlockId);
  }
  return { ...saveData, unlocks: Array.from(unlocks) };
}

export function toggleNewtAltar(
  saveData: SaveData,
  altar: NewtAltar,
  enabled: boolean,
): SaveData {
  return setNewtAltars(saveData, [altar], enabled);
}

export function unlockAllNewtAltars(saveData: SaveData): SaveData {
  return setNewtAltars(saveData, newtAltars, true);
}

export function lockAllNewtAltars(saveData: SaveData): SaveData {
  return setNewtAltars(saveData, newtAltars, false);
}
