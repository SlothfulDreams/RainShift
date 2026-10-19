/**
 * Prerequisite handling: the game refuses achievements whose prerequisite
 * (RegisterAchievement.prerequisiteAchievementIdentifier) is missing.
 */

import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";
import type { SaveData } from "@/data/types";
import {
  toggleAchievement,
  withDependents,
  withPrerequisites,
} from "@/lib/save-operations";

const empty = (): SaveData => ({
  name: "Test",
  coins: 0,
  achievements: [],
  unviewedAchievements: [],
  viewedUnlockables: [],
  unlocks: [],
  stats: new Map(),
  viewedViewables: [],
  discoveredPickups: [],
});

describe("prerequisites", () => {
  it("every prerequisite exists in the challenge data", () => {
    const ids = new Set(challenges.map((c) => c.achievement));
    for (const c of challenges) {
      if (c.prerequisite) expect(ids.has(c.prerequisite)).toBe(true);
    }
  });

  it("unlocking an achievement also unlocks its prerequisite", () => {
    const s = toggleAchievement(empty(), "AcolyteJuggleLemurian", true);
    expect(s.achievements).toContain("AcolyteJuggleLemurian");
    expect(s.achievements).toContain("ChampRushRitualCompleted");
    expect(s.unlocks).toContain("Characters.Acolyte");
    expect(s.unlocks).toContain("Skills.Acolyte.Javelin");
  });

  it("locking a prerequisite also locks its dependents", () => {
    let s = toggleAchievement(empty(), "AcolyteJuggleLemurian", true);
    s = toggleAchievement(s, "AcolyteClearGameMonsoon", true);
    s = toggleAchievement(s, "ChampRushRitualCompleted", false);
    expect(s.achievements).toEqual([]);
    expect(s.unlocks).toEqual([]);
  });

  it("locking a dependent keeps its prerequisite", () => {
    let s = toggleAchievement(empty(), "AcolyteJuggleLemurian", true);
    s = toggleAchievement(s, "AcolyteJuggleLemurian", false);
    expect(s.achievements).toEqual(["ChampRushRitualCompleted"]);
  });

  it("chain helpers", () => {
    expect(withPrerequisites("MageClearUltima")).toEqual([
      "MageClearUltima",
      "FreeMage",
    ]);
    expect(withDependents("ChampRushRitualCompleted")).toHaveLength(6);
  });
});
