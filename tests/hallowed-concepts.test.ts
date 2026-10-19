/**
 * Hallowed Concepts (HC) data tests.
 * Achievement IDs and unlockable keys were taken from the game's
 * [RegisterAchievement] attributes (RoR2.dll, Hallowed Concepts release).
 */

import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";
import { survivorEntries } from "@/data/logbook/survivors";
import { DLC_NAMES } from "@/data/types";
import { toggleAchievement } from "@/lib/save-operations";

const hc = challenges.filter((c) => c.dlc === "hc");

describe("Hallowed Concepts", () => {
  it("registers the DLC", () => {
    expect(DLC_NAMES.hc).toBe("Hallowed Concepts");
  });

  it("contains all 34 unlock-granting HC achievements", () => {
    expect(hc).toHaveLength(34);
    expect(hc.filter((c) => c.category === "survivors")).toHaveLength(1);
    expect(hc.filter((c) => c.category === "skills")).toHaveLength(13);
    expect(hc.filter((c) => c.category === "skins")).toHaveLength(20);
  });

  it("has unique ids and achievements across all challenges", () => {
    const ids = challenges.map((c) => c.id);
    const achievements = challenges.map((c) => c.achievement);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(achievements).size).toBe(achievements.length);
  });

  it("adds Enforcer and Acolyte survivors", () => {
    const enforcer = survivorEntries.find((s) => s.id === "survivor-enforcer");
    const acolyte = survivorEntries.find((s) => s.id === "survivor-acolyte");
    expect(enforcer?.dlc).toBe("hc");
    expect(acolyte?.unlockId).toBe("Characters.Acolyte");
    expect(
      hc.find((c) => c.achievement === "ChampRushRitualCompleted")?.unlocks,
    ).toEqual(["Characters.Acolyte"]);
  });

  it("every HC survivor reference points to an existing survivor", () => {
    const ids = new Set(
      survivorEntries.map((s) => s.id.replace(/^survivor-/, "")),
    );
    for (const c of hc) {
      if (c.survivor) expect(ids.has(c.survivor)).toBe(true);
    }
  });

  it("toggling an HC achievement writes its real unlock key", () => {
    const data = toggleAchievement(
      {
        name: "Test",
        coins: 0,
        achievements: [],
        unviewedAchievements: [],
        viewedUnlockables: [],
        unlocks: [],
        stats: new Map(),
        viewedViewables: [],
        discoveredPickups: [],
      },
      "Enforcer2ParryVagrant",
      true,
    );
    expect(data.achievements).toContain("Enforcer2ParryVagrant");
    expect(data.unlocks).toContain("Skills.Enforcer2.KineticCharge");
  });
});
