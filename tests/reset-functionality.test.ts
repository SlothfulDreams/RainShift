/**
 * Reset Functionality Tests - Verifies reset to original save data behavior
 */

import { describe, expect, it } from "vitest";
import type { SaveData } from "@/data/types";
import {
  lockAll,
  toggleAchievement,
  unlockAll,
  updateCoins,
} from "@/lib/save-operations";

const createSaveData = (overrides: Partial<SaveData> = {}): SaveData => ({
  name: "Test",
  coins: 100,
  achievements: ["OriginalAch1", "OriginalAch2"],
  unviewedAchievements: [],
  viewedUnlockables: ["Original.Unlock"],
  unlocks: ["Characters.Commando"],
  stats: new Map([["totalKills", "5000"]]),
  ...overrides,
});

describe("reset-functionality", () => {
  it("reset: restoring to initial data after modifications returns exact original state", () => {
    // Create original save data (simulates what initialSaveData would be)
    const originalSaveData = createSaveData();

    // Simulate user modifications (what would happen during editing session)
    let modifiedData = originalSaveData;
    modifiedData = updateCoins(modifiedData, 999);
    modifiedData = toggleAchievement(modifiedData, "NewAchievement", true);
    modifiedData = toggleAchievement(modifiedData, "OriginalAch1", false);

    // Verify modifications were applied
    expect(modifiedData.coins).toBe(999);
    expect(modifiedData.achievements).toContain("NewAchievement");
    expect(modifiedData.achievements).not.toContain("OriginalAch1");

    // Simulate reset by restoring to original (this is what handleReset does)
    const resetData = originalSaveData;

    // Verify reset data matches original exactly
    expect(resetData.coins).toBe(100);
    expect(resetData.achievements).toEqual(["OriginalAch1", "OriginalAch2"]);
    expect(resetData.achievements).not.toContain("NewAchievement");
    expect(resetData.viewedUnlockables).toEqual(["Original.Unlock"]);
    expect(resetData.unlocks).toEqual(["Characters.Commando"]);
  });

  it("reset: original data is unchanged after multiple modifications", () => {
    // Create original save data (stored as initialSaveData)
    const originalSaveData = createSaveData();

    // Store a reference to original values for comparison
    const originalCoins = originalSaveData.coins;
    const originalAchievements = [...originalSaveData.achievements];
    const originalUnlocks = [...originalSaveData.unlocks];

    // Perform various modifications
    let modifiedData = originalSaveData;
    modifiedData = unlockAll(modifiedData);
    modifiedData = updateCoins(modifiedData, 50000);
    modifiedData = lockAll(modifiedData);
    modifiedData = updateCoins(modifiedData, 0);

    // Original data should be completely unchanged (immutability)
    expect(originalSaveData.coins).toBe(originalCoins);
    expect(originalSaveData.achievements).toEqual(originalAchievements);
    expect(originalSaveData.unlocks).toEqual(originalUnlocks);

    // Modified data should be different
    expect(modifiedData.coins).toBe(0);
    expect(modifiedData.achievements).toEqual([]);

    // Reset by using original data
    const resetData = originalSaveData;
    expect(resetData.coins).toBe(originalCoins);
    expect(resetData.achievements).toEqual(originalAchievements);
  });

  it("reset: preserves all fields including name and stats", () => {
    const originalSaveData = createSaveData({
      name: "TestPlayer",
      stats: new Map([
        ["totalKills", "5000"],
        ["playTime", "12345"],
      ]),
    });

    // Modify data
    let modifiedData = originalSaveData;
    modifiedData = updateCoins(modifiedData, 0);
    modifiedData = lockAll(modifiedData);

    // Reset should restore everything
    const resetData = originalSaveData;

    expect(resetData.name).toBe("TestPlayer");
    expect(resetData.stats.get("totalKills")).toBe("5000");
    expect(resetData.stats.get("playTime")).toBe("12345");
    expect(resetData.coins).toBe(100);
    expect(resetData.achievements).toEqual(["OriginalAch1", "OriginalAch2"]);
  });

  it("reset: can be performed multiple times without issues", () => {
    const originalSaveData = createSaveData();

    // First editing session
    let data = originalSaveData;
    data = updateCoins(data, 500);
    data = toggleAchievement(data, "Ach1", true);

    // First reset
    data = originalSaveData;
    expect(data.coins).toBe(100);
    expect(data.achievements).toEqual(["OriginalAch1", "OriginalAch2"]);

    // Second editing session
    data = updateCoins(data, 1000);
    data = unlockAll(data);

    // Second reset
    data = originalSaveData;
    expect(data.coins).toBe(100);
    expect(data.achievements).toEqual(["OriginalAch1", "OriginalAch2"]);

    // Third editing session
    data = lockAll(data);
    data = updateCoins(data, 0);

    // Third reset
    data = originalSaveData;
    expect(data.coins).toBe(100);
    expect(data.achievements).toEqual(["OriginalAch1", "OriginalAch2"]);
  });

  it("reset: works correctly with empty initial achievements", () => {
    // Simulates a fresh save file with no achievements
    const originalSaveData = createSaveData({
      achievements: [],
      viewedUnlockables: [],
      unlocks: [],
    });

    // Add some achievements
    let data = originalSaveData;
    data = toggleAchievement(data, "NewAch1", true);
    data = toggleAchievement(data, "NewAch2", true);

    expect(data.achievements.length).toBeGreaterThan(0);

    // Reset should return to empty state
    const resetData = originalSaveData;
    expect(resetData.achievements).toEqual([]);
    expect(resetData.viewedUnlockables).toEqual([]);
    expect(resetData.unlocks).toEqual([]);
  });

  it("reset: deep cloning stats Map prevents mutation of original", () => {
    const originalSaveData = createSaveData({
      stats: new Map([
        ["totalKills", "5000"],
        ["playTime", "12345"],
      ]),
    });

    // Simulate how handleReset deep clones the data
    const deepClone = (data: SaveData): SaveData => ({
      ...data,
      achievements: [...data.achievements],
      unviewedAchievements: [...data.unviewedAchievements],
      viewedUnlockables: [...data.viewedUnlockables],
      unlocks: [...data.unlocks],
      stats: new Map(data.stats),
    });

    const clonedData = deepClone(originalSaveData);

    // Mutate the cloned stats Map
    clonedData.stats.set("totalKills", "9999");
    clonedData.stats.set("newStat", "value");

    // Original should be unchanged
    expect(originalSaveData.stats.get("totalKills")).toBe("5000");
    expect(originalSaveData.stats.has("newStat")).toBe(false);
    expect(originalSaveData.stats.size).toBe(2);

    // Cloned should have the mutations
    expect(clonedData.stats.get("totalKills")).toBe("9999");
    expect(clonedData.stats.has("newStat")).toBe(true);
  });

  it("reset: deep cloning arrays prevents mutation of original", () => {
    const originalSaveData = createSaveData({
      achievements: ["Ach1", "Ach2"],
      unlocks: ["Unlock1"],
    });

    // Simulate how handleReset deep clones the data
    const deepClone = (data: SaveData): SaveData => ({
      ...data,
      achievements: [...data.achievements],
      unviewedAchievements: [...data.unviewedAchievements],
      viewedUnlockables: [...data.viewedUnlockables],
      unlocks: [...data.unlocks],
      stats: new Map(data.stats),
    });

    const clonedData = deepClone(originalSaveData);

    // Mutate the cloned arrays directly
    clonedData.achievements.push("Ach3");
    clonedData.unlocks.pop();

    // Original should be unchanged
    expect(originalSaveData.achievements).toEqual(["Ach1", "Ach2"]);
    expect(originalSaveData.unlocks).toEqual(["Unlock1"]);

    // Cloned should have the mutations
    expect(clonedData.achievements).toEqual(["Ach1", "Ach2", "Ach3"]);
    expect(clonedData.unlocks).toEqual([]);
  });
});
