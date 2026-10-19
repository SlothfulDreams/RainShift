/**
 * Optional lunar coin rewards (RegisterAchievement.lunarCoinReward).
 */

import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";
import type { SaveData } from "@/data/types";
import {
  lunarCoinsFor,
  toggleAchievement,
  unlockAll,
} from "@/lib/save-operations";

const save = (overrides: Partial<SaveData> = {}): SaveData => ({
  name: "Test",
  coins: 100,
  achievements: [],
  unviewedAchievements: [],
  viewedUnlockables: [],
  unlocks: [],
  stats: new Map(),
  viewedViewables: [],
  discoveredPickups: [],
  ...overrides,
});

const allCoins = challenges.reduce((sum, c) => sum + c.lunarCoins, 0);

describe("lunar coin rewards", () => {
  it("every challenge has a positive reward", () => {
    for (const c of challenges) expect(c.lunarCoins).toBeGreaterThan(0);
  });

  it("is off by default", () => {
    expect(unlockAll(save()).coins).toBe(100);
    expect(toggleAchievement(save(), "FreeMage", true).coins).toBe(100);
  });

  it("unlockAll awards coins only for newly unlocked achievements", () => {
    const already = save({ achievements: ["FreeMage"] });
    const result = unlockAll(already, { awardCoins: true });
    expect(result.coins).toBe(100 + allCoins - lunarCoinsFor(["FreeMage"]));
  });

  it("toggle awards coins for the achievement and its prerequisites", () => {
    const result = toggleAchievement(save(), "MageClearUltima", true, {
      awardCoins: true,
    });
    expect(result.coins).toBe(
      100 + lunarCoinsFor(["MageClearUltima", "FreeMage"]),
    );
  });

  it("re-unlocking does not award twice", () => {
    let s = unlockAll(save(), { awardCoins: true });
    const coins = s.coins;
    s = unlockAll(s, { awardCoins: true });
    expect(s.coins).toBe(coins);
  });

  it("locking never removes coins", () => {
    let s = toggleAchievement(save(), "FreeMage", true, { awardCoins: true });
    const coins = s.coins;
    s = toggleAchievement(s, "FreeMage", false);
    expect(s.coins).toBe(coins);
  });
});
