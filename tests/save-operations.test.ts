/**
 * Save Operations Tests - Business logic for modifying saves
 */

import { describe, expect, it } from "vitest";
import type { SaveData } from "@/data/types";
import {
  isAchievementUnlocked,
  lockAll,
  toggleAchievement,
  unlockAll,
  updateCoins,
} from "@/lib/save-operations";

const createSaveData = (overrides: Partial<SaveData> = {}): SaveData => ({
  name: "Test",
  coins: 100,
  achievements: [],
  unviewedAchievements: [],
  viewedUnlockables: [],
  unlocks: [],
  stats: new Map(),
  ...overrides,
});

describe("save-operations", () => {
  it("updateCoins: updates value and enforces min 0", () => {
    expect(updateCoins(createSaveData(), 500).coins).toBe(500);
    expect(updateCoins(createSaveData(), -100).coins).toBe(0);
  });

  it("isAchievementUnlocked: checks presence", () => {
    const data = createSaveData({ achievements: ["Ach1"] });
    expect(isAchievementUnlocked(data, "Ach1")).toBe(true);
    expect(isAchievementUnlocked(data, "Ach2")).toBe(false);
  });

  it("toggleAchievement: adds/removes and prevents duplicates", () => {
    const data = createSaveData({ achievements: ["Existing"] });

    const added = toggleAchievement(data, "New", true);
    expect(added.achievements).toContain("New");
    expect(added.unviewedAchievements).toContain("New");

    const removed = toggleAchievement(added, "Existing", false);
    expect(removed.achievements).not.toContain("Existing");

    // No duplicates
    const dupe = toggleAchievement(data, "Existing", true);
    expect(dupe.achievements.filter((a) => a === "Existing")).toHaveLength(1);

    // Immutable
    expect(data.achievements).toEqual(["Existing"]);
  });

  it("unlockAll: adds all challenges and preserves existing", () => {
    const data = createSaveData({ achievements: ["Custom"] });
    const result = unlockAll(data);

    expect(result.achievements).toContain("Custom");
    expect(result.achievements.length).toBeGreaterThan(1);
    expect(result.viewedUnlockables.length).toBeGreaterThan(0);
  });

  it("lockAll: clears achievements and unlocks but preserves other fields", () => {
    const data = createSaveData({
      coins: 999,
      achievements: ["A", "B"],
      viewedUnlockables: ["X"],
      unlocks: ["Characters.Huntress", "Items.Clover"],
    });
    const result = lockAll(data);

    expect(result.achievements).toEqual([]);
    expect(result.viewedUnlockables).toEqual([]);
    expect(result.unlocks).toEqual([]);
    expect(result.coins).toBe(999);
  });
});
