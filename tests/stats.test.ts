/**
 * Stats totals must follow the challenge data (no hardcoded maxima).
 */

import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";
import { calculateSaveStats } from "@/lib/save-operations";

const empty = {
  name: "Test",
  coins: 0,
  achievements: [] as string[],
  unviewedAchievements: [],
  viewedUnlockables: [],
  unlocks: [],
  stats: new Map(),
  viewedViewables: [],
  discoveredPickups: [],
};

const count = (cat: string) =>
  challenges.filter((c) => c.category === cat).length;

describe("calculateSaveStats", () => {
  it("derives totals from challenge data, including HC", () => {
    const { totals, totalAchievements } = calculateSaveStats(empty);
    expect(totalAchievements).toBe(challenges.length);
    expect(totals.survivors).toBe(count("survivors"));
    expect(totals.items).toBe(count("items"));
    expect(totals.skins).toBe(count("skins"));
    expect(totals.skins).toBeGreaterThan(42); // 42 was the pre-HC hardcoded max
  });

  it("is not full when HC achievements are missing", () => {
    const preHc = challenges
      .filter((c) => c.dlc !== "hc")
      .map((c) => c.achievement);
    const s = calculateSaveStats({ ...empty, achievements: preHc });
    expect(s.unlockedSkins).toBeLessThan(s.totals.skins);
    expect(s.unlockedSurvivors).toBeLessThan(s.totals.survivors);
  });

  it("ignores unknown achievements so value never exceeds total", () => {
    const all = challenges.map((c) => c.achievement);
    const s = calculateSaveStats({
      ...empty,
      achievements: [...all, "SomeFutureAchievement"],
    });
    expect(s.unlockedAchievements).toBe(s.totalAchievements);
  });
});
