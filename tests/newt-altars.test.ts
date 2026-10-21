import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";
import { newtAltars } from "@/data/newt-altars";
import type { SaveData } from "@/data/types";
import {
  countUnlockedNewtAltars,
  isNewtAltarUnlocked,
  lockAllNewtAltars,
  NEWTIST_ACHIEVEMENT,
  newtAltarGroups,
  setNewtAltars,
  toggleNewtAltar,
  unlockAllNewtAltars,
} from "@/lib/newt-altars";
import {
  generateModifiedXml,
  loadSaveFile,
  lockAll,
  lockAllLogbook,
  unlockAll,
  unlockAllLogbook,
} from "@/lib/save-operations";

const empty = (unlocks: string[] = []): SaveData => ({
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

const altar = (unlockId: string) => {
  const found = newtAltars.find((a) => a.unlockId === unlockId);
  if (!found) throw new Error(`no newt altar ${unlockId}`);
  return found;
};

describe("newt altar data", () => {
  it("lists the 102 NewtStatue unlockables of the current game", () => {
    expect(newtAltars).toHaveLength(102);
    const ids = new Set(newtAltars.map((a) => a.unlockId));
    expect(ids.size).toBe(newtAltars.length);
    for (const a of newtAltars) {
      expect(a.unlockId).toMatch(/^NewtStatue\.[a-z0-9]+\.\d+$/);
      expect(a.unlockId.split(".")[1]).toBe(a.scene);
    }
  });

  it("groups every altar under its stage's environment log", () => {
    const grouped = newtAltarGroups.flatMap((g) => g.altars);
    expect(grouped).toHaveLength(newtAltars.length);
    for (const g of newtAltarGroups) {
      expect(g.stage.category).toBe("environments");
    }
    const roost = newtAltarGroups.find((g) => g.stage.id === "env-blackbeach");
    expect(roost?.stage.name).toBe("Distant Roost");
    // Both Distant Roost variants (blackbeach, blackbeach2) share one stage
    expect(roost?.altars.map((a) => a.scene)).toEqual([
      "blackbeach",
      "blackbeach",
      "blackbeach",
      "blackbeach2",
      "blackbeach2",
      "blackbeach2",
    ]);
  });

  it("Newtist is the FindUniqueNewtStatues achievement", () => {
    const newtist = challenges.find(
      (c) => c.achievement === NEWTIST_ACHIEVEMENT,
    );
    expect(newtist?.unlocks).toEqual(["Items.Talisman"]);
  });
});

describe("newt altar operations", () => {
  const goolake = altar("NewtStatue.goolake.1");

  it("toggles a single altar's unlockable", () => {
    const on = toggleNewtAltar(empty(["Characters.Mage"]), goolake, true);
    expect(on.unlocks).toEqual(["Characters.Mage", "NewtStatue.goolake.1"]);
    expect(isNewtAltarUnlocked(on, goolake)).toBe(true);

    const off = toggleNewtAltar(on, goolake, false);
    expect(off.unlocks).toEqual(["Characters.Mage"]);
    expect(isNewtAltarUnlocked(off, goolake)).toBe(false);
  });

  it("does not duplicate an altar already owned", () => {
    const data = empty(["NewtStatue.goolake.1"]);
    expect(toggleNewtAltar(data, goolake, true).unlocks).toEqual([
      "NewtStatue.goolake.1",
    ]);
  });

  it("unlocks and locks all altars, leaving other unlocks and achievements", () => {
    const data = {
      ...empty(["Characters.Mage", "Logs.Stages.goolake"]),
      achievements: [NEWTIST_ACHIEVEMENT],
    };
    const all = unlockAllNewtAltars(data);
    expect(countUnlockedNewtAltars(all)).toBe(102);
    expect(all.unlocks).toContain("Characters.Mage");

    const none = lockAllNewtAltars(all);
    expect(none.unlocks).toEqual(["Characters.Mage", "Logs.Stages.goolake"]);
    expect(none.achievements).toEqual([NEWTIST_ACHIEVEMENT]);
  });

  it("sets a stage's altars as a group", () => {
    const roost = newtAltarGroups.find((g) => g.stage.id === "env-blackbeach");
    if (!roost) throw new Error("no Distant Roost group");
    const data = setNewtAltars(empty(), roost.altars, true);
    expect(countUnlockedNewtAltars(data)).toBe(6);
    expect(countUnlockedNewtAltars(data, roost.altars)).toBe(6);
    expect(countUnlockedNewtAltars(data, [goolake])).toBe(0);
  });

  it("counts only altars the game knows", () => {
    const data = empty(["NewtStatue.goolake.1", "NewtStatue.nowhere.0"]);
    expect(countUnlockedNewtAltars(data)).toBe(1);
  });

  it("is untouched by the achievement and logbook bulk actions", () => {
    const data = unlockAllNewtAltars(empty());
    for (const op of [lockAll, unlockAll, lockAllLogbook, unlockAllLogbook]) {
      expect(countUnlockedNewtAltars(op(data))).toBe(102);
    }
    expect(countUnlockedNewtAltars(lockAllLogbook(lockAll(data)))).toBe(102);
  });

  it("writes altars as <unlock> entries in <stats>", () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<UserProfile><name>Test</name><coins>0</coins><stats><stat name="totalGamesPlayed">1</stat><unlock>Characters.Mage</unlock></stats></UserProfile>`;
    const { raw, saveData } = loadSaveFile(xml);
    const out = generateModifiedXml(
      raw,
      toggleNewtAltar(saveData, goolake, true),
    );
    expect(out).toContain("<unlock>NewtStatue.goolake.1</unlock>");
    expect(loadSaveFile(out).saveData.unlocks).toEqual([
      "Characters.Mage",
      "NewtStatue.goolake.1",
    ]);
  });
});
