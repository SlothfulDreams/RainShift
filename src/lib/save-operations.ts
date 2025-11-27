import { challenges } from "@/data/challenges";
import type { RawUserProfile, SaveData } from "@/data/types";
import {
  applySaveData,
  extractSaveData,
  parseXml,
  serializeXml,
} from "./xml-parser";

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

/**
 * Toggle an achievement (unlock or lock)
 */
export function toggleAchievement(
  saveData: SaveData,
  achievementId: string,
  enabled: boolean,
): SaveData {
  const achievements = new Set(saveData.achievements);
  const unviewedAchievements = new Set(saveData.unviewedAchievements);
  const viewedUnlockables = new Set(saveData.viewedUnlockables);

  // Find the challenge data to get unlocks
  const challenge = challenges.find((c) => c.achievement === achievementId);

  if (enabled) {
    // Add achievement
    achievements.add(achievementId);
    // Add to unviewed (game will show notification)
    unviewedAchievements.add(achievementId);
    // Add unlocks to viewed unlockables
    if (challenge) {
      for (const unlock of challenge.unlocks) {
        viewedUnlockables.add(unlock);
      }
    }
  } else {
    // Remove achievement
    achievements.delete(achievementId);
    unviewedAchievements.delete(achievementId);
    // Remove unlocks
    if (challenge) {
      for (const unlock of challenge.unlocks) {
        viewedUnlockables.delete(unlock);
      }
    }
  }

  return {
    ...saveData,
    achievements: Array.from(achievements),
    unviewedAchievements: Array.from(unviewedAchievements),
    viewedUnlockables: Array.from(viewedUnlockables),
  };
}

/**
 * Unlock all achievements
 */
export function unlockAll(saveData: SaveData): SaveData {
  const achievements = new Set(saveData.achievements);
  const viewedUnlockables = new Set(saveData.viewedUnlockables);

  // Add all achievements and their unlocks
  for (const challenge of challenges) {
    achievements.add(challenge.achievement);
    for (const unlock of challenge.unlocks) {
      viewedUnlockables.add(unlock);
    }
  }

  return {
    ...saveData,
    achievements: Array.from(achievements),
    unviewedAchievements: [], // Clear unviewed since we're bulk unlocking
    viewedUnlockables: Array.from(viewedUnlockables),
  };
}

/**
 * Lock all achievements (reset to default)
 */
export function lockAll(saveData: SaveData): SaveData {
  return {
    ...saveData,
    achievements: [],
    unviewedAchievements: [],
    viewedUnlockables: [],
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
} {
  const unlockedSet = new Set(saveData.achievements);

  let survivors = 0;
  let skills = 0;
  let skins = 0;
  let items = 0;
  let artifacts = 0;

  for (const challenge of challenges) {
    if (unlockedSet.has(challenge.achievement)) {
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
    unlockedAchievements: saveData.achievements.length,
    unlockedSurvivors: survivors,
    unlockedSkills: skills,
    unlockedSkins: skins,
    unlockedItems: items,
    unlockedArtifacts: artifacts,
  };
}
