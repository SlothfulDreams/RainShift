import { describe, expect, it } from "vitest";
import { survivorEntries } from "@/data/logbook/survivors";
import type { SaveData } from "@/data/types";
import {
  eclipseSurvivors,
  getEclipseLevel,
  MAX_ECLIPSE_LEVEL,
  setAllEclipseLevels,
  setEclipseLevel,
} from "@/lib/eclipse";
import { generateModifiedXml, loadSaveFile } from "@/lib/save-operations";

const withUnlocks = (unlocks: string[]): SaveData => ({
  name: "Test",
  coins: 0,
  achievements: [],
  unviewedAchievements: [],
  viewedUnlockables: [],
  unlocks,
  stats: new Map(),
  viewedViewables: [],
  discoveredPickups: [],
});

const eclipse = (survivor: string, levels: number[]) =>
  levels.map((l) => `Eclipse.${survivor}.${l}`);

describe("eclipse survivors", () => {
  it("every survivor records its SurvivorDef.cachedName", () => {
    expect(eclipseSurvivors).toHaveLength(survivorEntries.length);
    for (const s of eclipseSurvivors) {
      expect(s.survivorDef, s.id).toMatch(/^\w+$/);
    }
  });

  it("uses SurvivorDef names, not display or body names", () => {
    const def = (id: string) =>
      eclipseSurvivors.find((s) => s.id === id)?.survivorDef;
    expect(def("survivor-artificer")).toBe("Mage");
    expect(def("survivor-mercenary")).toBe("Merc");
    expect(def("survivor-mult")).toBe("Toolbot");
  });
});

describe("getEclipseLevel", () => {
  it("is 0 with no Eclipse unlocks", () => {
    expect(getEclipseLevel(withUnlocks([]), "Mage")).toBe(0);
  });

  it("is one less than the highest consecutive level from 2", () => {
    const save = withUnlocks(eclipse("Mage", [2, 3, 4]));
    expect(getEclipseLevel(save, "Mage")).toBe(3);
  });

  it("stops at the first missing level, like the game", () => {
    const save = withUnlocks(eclipse("Mage", [2, 3, 5, 6, 7, 8, 9]));
    expect(getEclipseLevel(save, "Mage")).toBe(2);
    expect(getEclipseLevel(withUnlocks(eclipse("Mage", [3])), "Mage")).toBe(0);
  });

  it("is 8 when every level is owned", () => {
    const save = withUnlocks(eclipse("Merc", [2, 3, 4, 5, 6, 7, 8, 9]));
    expect(getEclipseLevel(save, "Merc")).toBe(MAX_ECLIPSE_LEVEL);
  });
});

describe("setEclipseLevel", () => {
  it("writes a contiguous range Eclipse.<name>.2 … .N+1", () => {
    const save = setEclipseLevel(withUnlocks([]), "Toolbot", 3);
    expect(save.unlocks).toEqual(eclipse("Toolbot", [2, 3, 4]));
    expect(getEclipseLevel(save, "Toolbot")).toBe(3);
  });

  it("fills gaps and removes higher levels", () => {
    const save = setEclipseLevel(
      withUnlocks(eclipse("Mage", [3, 7, 9])),
      "Mage",
      4,
    );
    expect([...save.unlocks].sort()).toEqual(eclipse("Mage", [2, 3, 4, 5]));
    expect(getEclipseLevel(save, "Mage")).toBe(4);
  });

  it("clears every level at 0", () => {
    const save = setEclipseLevel(
      withUnlocks(eclipse("Mage", [2, 3, 4, 5, 6, 7, 8, 9])),
      "Mage",
      0,
    );
    expect(save.unlocks).toEqual([]);
  });

  it("clamps to 0-8", () => {
    const max = setEclipseLevel(withUnlocks([]), "Mage", 99);
    expect(max.unlocks).toEqual(eclipse("Mage", [2, 3, 4, 5, 6, 7, 8, 9]));
    expect(setEclipseLevel(max, "Mage", -1).unlocks).toEqual([]);
  });

  it("leaves other unlocks and survivors untouched, in place", () => {
    const before = [
      "Characters.Mage",
      "Eclipse.Mage.2",
      "Eclipse.Merc.2",
      "Eclipse.Merc.3",
      "Logs.BeetleBody.0",
    ];
    const save = setEclipseLevel(withUnlocks(before), "Mage", 2);
    expect(save.unlocks).toEqual([...before, "Eclipse.Mage.3"]);
    expect(getEclipseLevel(save, "Merc")).toBe(2);
  });

  it("does not mutate the input", () => {
    const original = withUnlocks(["Eclipse.Mage.2"]);
    setEclipseLevel(original, "Mage", 8);
    expect(original.unlocks).toEqual(["Eclipse.Mage.2"]);
  });
});

describe("setAllEclipseLevels", () => {
  it("maxes every survivor", () => {
    const save = setAllEclipseLevels(withUnlocks(["Characters.Mage"]), 8);
    for (const s of eclipseSurvivors) {
      expect(getEclipseLevel(save, s.survivorDef as string), s.id).toBe(8);
    }
    expect(save.unlocks).toHaveLength(1 + eclipseSurvivors.length * 8);
    expect(save.unlocks[0]).toBe("Characters.Mage");
  });

  it("resets every survivor", () => {
    const save = setAllEclipseLevels(
      setAllEclipseLevels(withUnlocks([]), 8),
      0,
    );
    expect(save.unlocks).toEqual([]);
  });
});

describe("eclipse save file round-trip", () => {
  it("stores the levels as <unlock> entries in <stats>", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<UserProfile>
  <name>Test</name>
  <coins>0</coins>
  <stats>
    <stat name="totalKills">5</stat>
    <unlock>Eclipse.Mage.2</unlock>
  </stats>
</UserProfile>`;
    const { raw, saveData } = loadSaveFile(xml);
    expect(getEclipseLevel(saveData, "Mage")).toBe(1);

    const out = generateModifiedXml(raw, setEclipseLevel(saveData, "Mage", 8));
    const stats = out.slice(out.indexOf("<stats>"), out.indexOf("</stats>"));
    for (let level = 2; level <= 9; level++) {
      expect(stats).toContain(`<unlock>Eclipse.Mage.${level}</unlock>`);
    }
    expect(getEclipseLevel(loadSaveFile(out).saveData, "Mage")).toBe(8);
  });
});
