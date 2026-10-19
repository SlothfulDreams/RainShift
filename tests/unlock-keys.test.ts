/**
 * Unlock key format tests.
 * Keys must match the game's UnlockableDef names (as written by RoR2 in UserProfile XML).
 */

import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";

describe("unlock keys", () => {
  it("every challenge grants exactly one unlockable", () => {
    for (const c of challenges) expect(c.unlocks).toHaveLength(1);
  });

  it("uses game prefixes, not legacy ones", () => {
    for (const c of challenges) {
      for (const u of c.unlocks) {
        expect(u).toMatch(/^(Characters|Skills|Skins|Items|Artifacts)\./);
      }
    }
  });

  it("survivor unlocks use Characters.*", () => {
    for (const c of challenges.filter((c) => c.category === "survivors")) {
      expect(c.unlocks[0]).toMatch(/^Characters\./);
    }
  });

  it("matches known keys from a real game save", () => {
    const byAch = new Map(challenges.map((c) => [c.achievement, c.unlocks[0]]));
    expect(byAch.get("FreeMage")).toBe("Characters.Mage");
    expect(byAch.get("MercPurge")).toBe("Skins.Merc.AltSkinVulture");
    expect(byAch.get("EngiClearGameMonsoon")).toBe("Skins.Engi.Alt1");
    expect(byAch.get("KillEliteMonster")).toBe("Items.Medkit");
    expect(byAch.get("ObtainArtifactEliteOnly")).toBe("Artifacts.EliteOnly");
  });
});
