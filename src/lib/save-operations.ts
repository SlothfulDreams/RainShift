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
  shouldDisableChallengeForEntry,
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
  const viewedViewables = new Set(saveData.viewedViewables);
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
    // Sync related logbook entries (items/equipment)
    for (const entry of getLogbookEntriesForChallenge(challenge.id)) {
      viewedViewables.add(entry.unlockId);
      unlocks.add(entry.unlockId);
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
    viewedViewables: Array.from(viewedViewables),
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

  // Sync related logbook entries (only if no remaining challenge provides them)
  const remaining = new Set(achievements);
  const removedViewables = new Set<string>();
  const removedPickups = new Set<string>();
  for (const id of removed) {
    const challenge = challengeByAchievement.get(id);
    if (!challenge) continue;
    for (const entry of getLogbookEntriesForChallenge(challenge.id)) {
      if (isLogbookEntryProvidedByOtherChallenge(entry, id, remaining)) {
        continue;
      }
      removedViewables.add(entry.unlockId);
      if (entry.pickupId) removedPickups.add(entry.pickupId);
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
    unlocks: saveData.unlocks.filter(
      (u) => !removedUnlocks.has(u) && !removedViewables.has(u),
    ),
    viewedViewables: saveData.viewedViewables.filter(
      (v) => !removedViewables.has(v),
    ),
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
 * game records on its own are preserved, except item/equipment logbook
 * entries linked to a challenge.
 */
export function lockAll(saveData: SaveData): SaveData {
  const managedAchievements = new Set(challenges.map((c) => c.achievement));
  const managedUnlocks = new Set(challenges.flatMap((c) => c.unlocks));
  const linkedEntries = challenges.flatMap((c) =>
    getLogbookEntriesForChallenge(c.id),
  );
  const linkedViewables = new Set(linkedEntries.map((e) => e.unlockId));
  const linkedPickups = new Set(
    linkedEntries.flatMap((e) => (e.pickupId ? [e.pickupId] : [])),
  );
  const keepAchievement = (a: string) => !managedAchievements.has(a);
  const keepUnlock = (u: string) =>
    !managedUnlocks.has(u) && !linkedViewables.has(u);

  return {
    ...saveData,
    achievements: saveData.achievements.filter(keepAchievement),
    unviewedAchievements: saveData.unviewedAchievements.filter(keepAchievement),
    viewedUnlockables: saveData.viewedUnlockables.filter(keepUnlock),
    unlocks: saveData.unlocks.filter(keepUnlock),
    viewedViewables: saveData.viewedViewables.filter(
      (v) => !linkedViewables.has(v),
    ),
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
// ============================================

/**
 * Check if a logbook entry is unlocked
 */
export function isLogbookEntryUnlocked(
  saveData: SaveData,
  entry: LogbookEntry,
): boolean {
  // Check in stats.unlock for monster/environment/survivor logs
  if (saveData.unlocks.includes(entry.unlockId)) {
    return true;
  }

  // Check viewedViewables for viewed entries
  if (saveData.viewedViewables.includes(entry.unlockId)) {
    return true;
  }

  // Check discoveredPickups for items/equipment
  if (entry.pickupId && saveData.discoveredPickups.includes(entry.pickupId)) {
    return true;
  }

  return false;
}

/**
 * Toggle a logbook entry (unlock or lock)
 * Also syncs related challenges (for items/equipment)
 */
export function toggleLogbookEntry(
  saveData: SaveData,
  entry: LogbookEntry,
  enabled: boolean,
): SaveData {
  const unlocks = new Set(saveData.unlocks);
  const viewedViewables = new Set(saveData.viewedViewables);
  const discoveredPickups = new Set(saveData.discoveredPickups);
  const achievements = new Set(saveData.achievements);
  const unviewedAchievements = new Set(saveData.unviewedAchievements);
  const viewedUnlockables = new Set(saveData.viewedUnlockables);

  if (enabled) {
    // Add to unlocks (for logs)
    unlocks.add(entry.unlockId);
    // Add to viewedViewables (marks as viewed)
    viewedViewables.add(entry.unlockId);
    // Add to discoveredPickups if item/equipment
    if (entry.pickupId) {
      discoveredPickups.add(entry.pickupId);
    }

    // Sync related challenges (for items/equipment entries)
    const relatedChallenges = getChallengesForLogbookEntry(entry.id);
    for (const challenge of relatedChallenges) {
      achievements.add(challenge.achievement);
      unviewedAchievements.add(challenge.achievement);
      for (const unlock of challenge.unlocks) {
        viewedUnlockables.add(unlock);
        unlocks.add(unlock);
      }
      // Also unlock other logbook entries from this challenge
      const otherEntries = getLogbookEntriesForChallenge(challenge.id);
      for (const otherEntry of otherEntries) {
        viewedViewables.add(otherEntry.unlockId);
        unlocks.add(otherEntry.unlockId);
        if (otherEntry.pickupId) {
          discoveredPickups.add(otherEntry.pickupId);
        }
      }
    }
  } else {
    // Remove from all
    unlocks.delete(entry.unlockId);
    viewedViewables.delete(entry.unlockId);
    if (entry.pickupId) {
      discoveredPickups.delete(entry.pickupId);
    }

    // Sync related challenges (disable if appropriate)
    const relatedChallenges = getChallengesForLogbookEntry(entry.id);
    for (const challenge of relatedChallenges) {
      if (shouldDisableChallengeForEntry(challenge, entry, viewedViewables)) {
        achievements.delete(challenge.achievement);
        unviewedAchievements.delete(challenge.achievement);
        for (const unlock of challenge.unlocks) {
          viewedUnlockables.delete(unlock);
          unlocks.delete(unlock);
        }
        // Also remove other logbook entries from this challenge
        const otherEntries = getLogbookEntriesForChallenge(challenge.id);
        for (const otherEntry of otherEntries) {
          viewedViewables.delete(otherEntry.unlockId);
          unlocks.delete(otherEntry.unlockId);
          if (otherEntry.pickupId) {
            discoveredPickups.delete(otherEntry.pickupId);
          }
        }
      }
    }
  }

  return {
    ...saveData,
    achievements: Array.from(achievements),
    unviewedAchievements: Array.from(unviewedAchievements),
    viewedUnlockables: Array.from(viewedUnlockables),
    unlocks: Array.from(unlocks),
    viewedViewables: Array.from(viewedViewables),
    discoveredPickups: Array.from(discoveredPickups),
  };
}

/**
 * Unlock all logbook entries
 * Also syncs all related challenges (for items/equipment)
 */
export function unlockAllLogbook(saveData: SaveData): SaveData {
  const unlocks = new Set(saveData.unlocks);
  const viewedViewables = new Set(saveData.viewedViewables);
  const discoveredPickups = new Set(saveData.discoveredPickups);
  const achievements = new Set(saveData.achievements);
  const viewedUnlockables = new Set(saveData.viewedUnlockables);

  for (const entry of logbookEntries) {
    unlocks.add(entry.unlockId);
    viewedViewables.add(entry.unlockId);
    if (entry.pickupId) {
      discoveredPickups.add(entry.pickupId);
    }

    // Sync related challenges (for items/equipment)
    const relatedChallenges = getChallengesForLogbookEntry(entry.id);
    for (const challenge of relatedChallenges) {
      achievements.add(challenge.achievement);
      for (const unlock of challenge.unlocks) {
        viewedUnlockables.add(unlock);
        unlocks.add(unlock);
      }
    }
  }

  return {
    ...saveData,
    achievements: Array.from(achievements),
    unviewedAchievements: [], // Clear unviewed since we're bulk unlocking
    viewedUnlockables: Array.from(viewedUnlockables),
    unlocks: Array.from(unlocks),
    viewedViewables: Array.from(viewedViewables),
    discoveredPickups: Array.from(discoveredPickups),
  };
}

/**
 * Lock all logbook entries
 * Also locks challenges that only unlock items/equipment (no other unlocks)
 */
export function lockAllLogbook(saveData: SaveData): SaveData {
  const currentUnlocks = new Set(saveData.unlocks);
  const currentViewedViewables = new Set(saveData.viewedViewables);
  const currentDiscoveredPickups = new Set(saveData.discoveredPickups);
  const achievements = new Set(saveData.achievements);
  const unviewedAchievements = new Set(saveData.unviewedAchievements);
  const viewedUnlockables = new Set(saveData.viewedUnlockables);

  // Track challenges that should be disabled
  const challengesToDisable = new Set<string>();

  // Remove only logbook-related entries, preserve others
  for (const entry of logbookEntries) {
    currentUnlocks.delete(entry.unlockId);
    currentViewedViewables.delete(entry.unlockId);
    if (entry.pickupId) {
      currentDiscoveredPickups.delete(entry.pickupId);
    }

    // Find challenges to disable
    const relatedChallenges = getChallengesForLogbookEntry(entry.id);
    for (const challenge of relatedChallenges) {
      challengesToDisable.add(challenge.achievement);
    }
  }

  // Disable the related challenges
  for (const achievementId of challengesToDisable) {
    achievements.delete(achievementId);
    unviewedAchievements.delete(achievementId);
    const challenge = challenges.find((c) => c.achievement === achievementId);
    if (challenge) {
      for (const unlock of challenge.unlocks) {
        viewedUnlockables.delete(unlock);
        currentUnlocks.delete(unlock);
      }
    }
  }

  return {
    ...saveData,
    achievements: Array.from(achievements),
    unviewedAchievements: Array.from(unviewedAchievements),
    viewedUnlockables: Array.from(viewedUnlockables),
    unlocks: Array.from(currentUnlocks),
    viewedViewables: Array.from(currentViewedViewables),
    discoveredPickups: Array.from(currentDiscoveredPickups),
  };
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
