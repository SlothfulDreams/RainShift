import { challenges } from "@/data/challenges";
import { logbookEntries } from "@/data/logbook-entries";
import type {
  Challenge,
  LogbookEntry,
  RawUserProfile,
  SaveData,
} from "@/data/types";
import {
  getChallengesForLogbookEntry,
  getLogbookEntriesForChallenge,
  isLogbookEntryProvidedByOtherChallenge,
} from "./challenge-logbook-mapping";
import {
  applySaveData,
  extractSaveData,
  parseXml,
  serializeXml,
} from "./xml-parser";

const INT32_MAX = 2147483647;

/**
 * Load and parse a save file from XML string
 */
export function loadSaveFile(xmlString: string): {
  raw: RawUserProfile;
  saveData: SaveData;
} {
  const raw = parseXml(xmlString);
  const saveData = extractSaveData(raw);
  return { raw, saveData };
}

/**
 * Update lunar coins in save data
 */
export function updateCoins(saveData: SaveData, coins: number): SaveData {
  return {
    ...saveData,
    coins: Math.max(0, coins),
  };
}

/**
 * Check if an achievement is unlocked
 */
export function isAchievementUnlocked(
  saveData: SaveData,
  achievementId: string,
): boolean {
  return saveData.achievements.includes(achievementId);
}

export interface UnlockOptions {
  /** Add the lunar coins the game awards for each newly unlocked achievement */
  awardCoins?: boolean;
}

const challengeByAchievement = new Map(
  challenges.map((c) => [c.achievement, c]),
);

/**
 * Achievement plus every prerequisite it (transitively) requires in-game.
 */
export function withPrerequisites(achievementId: string): string[] {
  const chain: string[] = [];
  let current: string | undefined = achievementId;
  while (current && !chain.includes(current)) {
    chain.push(current);
    current = challengeByAchievement.get(current)?.prerequisite;
  }
  return chain;
}

/**
 * Achievement plus every achievement that (transitively) requires it.
 */
export function withDependents(achievementId: string): string[] {
  const result = new Set([achievementId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of challenges) {
      if (
        c.prerequisite &&
        result.has(c.prerequisite) &&
        !result.has(c.achievement)
      ) {
        result.add(c.achievement);
        grew = true;
      }
    }
  }
  return Array.from(result);
}

/**
 * Lunar coins the game awards for the given achievements.
 */
export function lunarCoinsFor(achievementIds: Iterable<string>): number {
  let total = 0;
  for (const id of achievementIds) {
    total += challengeByAchievement.get(id)?.lunarCoins ?? 0;
  }
  return total;
}

function grant(
  saveData: SaveData,
  ids: string[],
  markUnviewed: boolean,
  options: UnlockOptions,
): SaveData {
  const achievements = new Set(saveData.achievements);
  const unviewedAchievements = new Set(saveData.unviewedAchievements);
  const viewedUnlockables = new Set(saveData.viewedUnlockables);
  const unlocks = new Set(saveData.unlocks);
  const discoveredPickups = new Set(saveData.discoveredPickups);
  const added: string[] = [];

  for (const id of ids) {
    if (!achievements.has(id)) added.push(id);
    achievements.add(id);
    if (markUnviewed) unviewedAchievements.add(id);
    const challenge = challengeByAchievement.get(id);
    if (!challenge) continue;
    for (const unlock of challenge.unlocks) {
      viewedUnlockables.add(unlock);
      unlocks.add(unlock);
    }
    // Discover the items/equipment this challenge unlocks (logbook entries)
    for (const entry of getLogbookEntriesForChallenge(challenge.id)) {
      if (entry.pickupId) discoveredPickups.add(entry.pickupId);
    }
  }

  const coins = options.awardCoins
    ? Math.min(saveData.coins + lunarCoinsFor(added), INT32_MAX)
    : saveData.coins;

  return {
    ...saveData,
    coins,
    achievements: Array.from(achievements),
    unviewedAchievements: Array.from(unviewedAchievements),
    viewedUnlockables: Array.from(viewedUnlockables),
    unlocks: Array.from(unlocks),
    discoveredPickups: Array.from(discoveredPickups),
  };
}

/**
 * Toggle an achievement (unlock or lock).
 * Unlocking also unlocks its prerequisites; locking also locks every
 * achievement that depends on it, matching the game's rules.
 */
export function toggleAchievement(
  saveData: SaveData,
  achievementId: string,
  enabled: boolean,
  options: UnlockOptions = {},
): SaveData {
  if (enabled) {
    return grant(saveData, withPrerequisites(achievementId), true, options);
  }

  const removed = new Set(withDependents(achievementId));
  const removedUnlocks = new Set(
    Array.from(removed).flatMap(
      (id) => challengeByAchievement.get(id)?.unlocks ?? [],
    ),
  );
  const achievements = saveData.achievements.filter((a) => !removed.has(a));

  // Undiscover linked items/equipment unless a remaining challenge unlocks them
  const remaining = new Set(achievements);
  const removedPickups = new Set<string>();
  for (const id of removed) {
    const challenge = challengeByAchievement.get(id);
    if (!challenge) continue;
    for (const entry of getLogbookEntriesForChallenge(challenge.id)) {
      if (
        entry.pickupId &&
        !isLogbookEntryProvidedByOtherChallenge(entry, id, remaining)
      ) {
        removedPickups.add(entry.pickupId);
      }
    }
  }

  return {
    ...saveData,
    achievements,
    unviewedAchievements: saveData.unviewedAchievements.filter(
      (a) => !removed.has(a),
    ),
    viewedUnlockables: saveData.viewedUnlockables.filter(
      (u) => !removedUnlocks.has(u),
    ),
    unlocks: saveData.unlocks.filter((u) => !removedUnlocks.has(u)),
    discoveredPickups: saveData.discoveredPickups.filter(
      (p) => !removedPickups.has(p),
    ),
  };
}

/**
 * Unlock all achievements
 */
export function unlockAll(
  saveData: SaveData,
  options: UnlockOptions = {},
): SaveData {
  const result = grant(
    saveData,
    challenges.map((c) => c.achievement),
    false,
    options,
  );
  // Clear unviewed since we're bulk unlocking
  return { ...result, unviewedAchievements: [] };
}

/**
 * Lock all achievements managed by the editor.
 * Only removes achievements listed in the challenge data and the unlockables
 * they grant; logbook entries, newt statues, stages and any other unlocks the
 * game records on its own are preserved, except that items/equipment linked
 * to a challenge are undiscovered.
 */
export function lockAll(saveData: SaveData): SaveData {
  const managedAchievements = new Set(challenges.map((c) => c.achievement));
  const managedUnlocks = new Set(challenges.flatMap((c) => c.unlocks));
  const linkedPickups = new Set(
    challenges
      .flatMap((c) => getLogbookEntriesForChallenge(c.id))
      .flatMap((e) => (e.pickupId ? [e.pickupId] : [])),
  );
  const keepAchievement = (a: string) => !managedAchievements.has(a);
  const keepUnlock = (u: string) => !managedUnlocks.has(u);

  return {
    ...saveData,
    achievements: saveData.achievements.filter(keepAchievement),
    unviewedAchievements: saveData.unviewedAchievements.filter(keepAchievement),
    viewedUnlockables: saveData.viewedUnlockables.filter(keepUnlock),
    unlocks: saveData.unlocks.filter(keepUnlock),
    discoveredPickups: saveData.discoveredPickups.filter(
      (p) => !linkedPickups.has(p),
    ),
  };
}

/**
 * Get count of unlocked achievements
 */
export function getUnlockedCount(saveData: SaveData): number {
  return saveData.achievements.length;
}

/**
 * Get count of total achievements
 */
export function getTotalCount(): number {
  return challenges.length;
}

/**
 * Generate the modified XML string for download
 */
export function generateModifiedXml(
  originalRaw: RawUserProfile,
  saveData: SaveData,
): string {
  const updatedRaw = applySaveData(originalRaw, saveData);
  return serializeXml(updatedRaw);
}

/**
 * Calculate stats about the current save
 */
export function calculateSaveStats(saveData: SaveData): {
  totalAchievements: number;
  unlockedAchievements: number;
  unlockedSurvivors: number;
  unlockedSkills: number;
  unlockedSkins: number;
  unlockedItems: number;
  unlockedArtifacts: number;
  totals: Record<Challenge["category"], number>;
} {
  const unlockedSet = new Set(saveData.achievements);
  const totals: Record<Challenge["category"], number> = {
    survivors: 0,
    skills: 0,
    skins: 0,
    items: 0,
    artifacts: 0,
  };
  let unlockedKnown = 0;

  let survivors = 0;
  let skills = 0;
  let skins = 0;
  let items = 0;
  let artifacts = 0;

  for (const challenge of challenges) {
    totals[challenge.category]++;
    if (unlockedSet.has(challenge.achievement)) {
      unlockedKnown++;
      switch (challenge.category) {
        case "survivors":
          survivors++;
          break;
        case "skills":
          skills++;
          break;
        case "skins":
          skins++;
          break;
        case "items":
          items++;
          break;
        case "artifacts":
          artifacts++;
          break;
      }
    }
  }

  return {
    totalAchievements: challenges.length,
    // Only count achievements the editor knows about, so value <= total
    unlockedAchievements: unlockedKnown,
    unlockedSurvivors: survivors,
    unlockedSkills: skills,
    unlockedSkins: skins,
    unlockedItems: items,
    unlockedArtifacts: artifacts,
    totals,
  };
}

// ============================================
// LOGBOOK OPERATIONS
// Mirrors RoR2.UI.LogBook.LogBookController: each category has its own
// unlock condition in the save file.
// ============================================

const isPickupEntry = (entry: LogbookEntry) =>
  entry.category === "items" || entry.category === "equipment";

const winsStat = (entry: LogbookEntry) => `totalWins.${entry.body}`;
const summonedStat = (entry: LogbookEntry) => `timesSummoned.${entry.body}`;

const statValue = (saveData: SaveData, name: string) =>
  Number(saveData.stats.get(name) ?? 0) || 0;

const hasPickup = (saveData: SaveData, entry: LogbookEntry) =>
  !!entry.pickupId && saveData.discoveredPickups.includes(entry.pickupId);

/** True when the entry has no gate or the profile owns it */
const ownsGate = (saveData: SaveData, entry: LogbookEntry) =>
  !entry.unlockId || saveData.unlocks.includes(entry.unlockId);

function setMember(set: Set<string>, value: string, present: boolean) {
  if (present) set.add(value);
  else set.delete(value);
}

/**
 * Achievements that grant what a logbook entry needs: an item's gate, or a
 * survivor's character unlock.
 */
function challengesForLogbookEntry(entry: LogbookEntry): Challenge[] {
  if (isPickupEntry(entry)) return getChallengesForLogbookEntry(entry.id);
  if (entry.category === "survivors" && entry.unlockId) {
    const unlock = entry.unlockId;
    return challenges.filter((c) => c.unlocks.includes(unlock));
  }
  return [];
}

/**
 * Check if a logbook entry is unlocked
 */
export function isLogbookEntryUnlocked(
  saveData: SaveData,
  entry: LogbookEntry,
): boolean {
  switch (entry.category) {
    case "items":
    case "equipment":
      // GetPickupStatus: the item's unlockable (if any) and a discovered pickup
      return hasPickup(saveData, entry) && ownsGate(saveData, entry);
    case "monsters":
    case "environments":
      // GetMonsterStatus / GetStageStatus: the log unlockable
      return !!entry.unlockId && saveData.unlocks.includes(entry.unlockId);
    case "survivors":
      // GetSurvivorStatus: the survivor is unlocked and has at least one win
      return (
        !!entry.body &&
        ownsGate(saveData, entry) &&
        statValue(saveData, winsStat(entry)) > 0
      );
    case "drones":
      // DroneDef.HasUserDiscovered: discovered, or summoned at least once
      return (
        hasPickup(saveData, entry) ||
        (!!entry.body && statValue(saveData, summonedStat(entry)) > 0)
      );
  }
}

/**
 * Unlock or lock a set of logbook entries.
 * Unlocking a gated item/equipment entry or a locked survivor also unlocks
 * the achievement that grants it (with prerequisites). Locking only removes
 * what the logbook itself needs: the discovered pickup, the log, or the
 * survivor's wins.
 */
function setLogbookEntries(
  saveData: SaveData,
  entries: LogbookEntry[],
  enabled: boolean,
): SaveData {
  let data = saveData;
  if (enabled) {
    const owned = new Set(data.achievements);
    const toGrant = new Set(
      entries
        .flatMap(challengesForLogbookEntry)
        .filter((c) => !owned.has(c.achievement))
        .flatMap((c) => withPrerequisites(c.achievement)),
    );
    if (toGrant.size > 0) {
      data = grant(data, Array.from(toGrant), entries.length === 1, {});
    }
  }

  const unlocks = new Set(data.unlocks);
  const discoveredPickups = new Set(data.discoveredPickups);
  const stats = new Map(data.stats);

  // A gate that no achievement grants is written directly
  const unlockUngrantedGate = (entry: LogbookEntry) => {
    if (
      enabled &&
      entry.unlockId &&
      challengesForLogbookEntry(entry).length === 0
    ) {
      unlocks.add(entry.unlockId);
    }
  };

  for (const entry of entries) {
    switch (entry.category) {
      case "items":
      case "equipment":
        if (!entry.pickupId) break;
        setMember(discoveredPickups, entry.pickupId, enabled);
        unlockUngrantedGate(entry);
        break;
      case "monsters":
      case "environments":
        if (entry.unlockId) setMember(unlocks, entry.unlockId, enabled);
        break;
      case "survivors":
        if (!entry.body) break;
        if (!enabled) {
          stats.set(winsStat(entry), "0");
        } else if (statValue(data, winsStat(entry)) < 1) {
          stats.set(winsStat(entry), "1");
        }
        unlockUngrantedGate(entry);
        break;
      case "drones":
        if (!entry.pickupId) break;
        setMember(discoveredPickups, entry.pickupId, enabled);
        if (
          !enabled &&
          entry.body &&
          statValue(data, summonedStat(entry)) > 0
        ) {
          stats.set(summonedStat(entry), "0");
        }
        break;
    }
  }

  return {
    ...data,
    unlocks: Array.from(unlocks),
    discoveredPickups: Array.from(discoveredPickups),
    stats,
  };
}

/**
 * Toggle a logbook entry (unlock or lock)
 */
export function toggleLogbookEntry(
  saveData: SaveData,
  entry: LogbookEntry,
  enabled: boolean,
): SaveData {
  return setLogbookEntries(saveData, [entry], enabled);
}

/**
 * Unlock all logbook entries
 */
export function unlockAllLogbook(saveData: SaveData): SaveData {
  return setLogbookEntries(saveData, logbookEntries, true);
}

/**
 * Lock all logbook entries (achievements are left to the achievements tab)
 */
export function lockAllLogbook(saveData: SaveData): SaveData {
  return setLogbookEntries(saveData, logbookEntries, false);
}

/**
 * Calculate logbook statistics
 */
export function calculateLogbookStats(saveData: SaveData): {
  totalEntries: number;
  unlockedEntries: number;
  monsters: { total: number; unlocked: number };
  environments: { total: number; unlocked: number };
  survivors: { total: number; unlocked: number };
  items: { total: number; unlocked: number };
  equipment: { total: number; unlocked: number };
  drones: { total: number; unlocked: number };
} {
  const stats = {
    totalEntries: logbookEntries.length,
    unlockedEntries: 0,
    monsters: { total: 0, unlocked: 0 },
    environments: { total: 0, unlocked: 0 },
    survivors: { total: 0, unlocked: 0 },
    items: { total: 0, unlocked: 0 },
    equipment: { total: 0, unlocked: 0 },
    drones: { total: 0, unlocked: 0 },
  };

  for (const entry of logbookEntries) {
    stats[entry.category].total++;
    if (isLogbookEntryUnlocked(saveData, entry)) {
      stats[entry.category].unlocked++;
      stats.unlockedEntries++;
    }
  }

  return stats;
}
