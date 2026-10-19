import { describe, expect, it } from "vitest";
import { logbookEntries } from "@/data/logbook-entries";
import type { LogbookEntry, SaveData } from "@/data/types";
import { getChallengesForLogbookEntry } from "@/lib/challenge-logbook-mapping";
import {
  isLogbookEntryUnlocked,
  lockAllLogbook,
  toggleAchievement,
  toggleLogbookEntry,
  unlockAllLogbook,
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

const entry = (name: string): LogbookEntry => {
  const found = logbookEntries.find((e) => e.name === name);
  if (!found) throw new Error(`no logbook entry named ${name}`);
  return found;
};

describe("logbook items and equipment", () => {
  it("every entry has a pickup id the game uses", () => {
    for (const e of logbookEntries) {
      if (e.category !== "items" && e.category !== "equipment") continue;
      expect(e.pickupId, e.id).toMatch(
        /^(ItemIndex|EquipmentIndex|KeyItemIndex)\.\w+$/,
      );
    }
  });

  it("links entries to the achievement that grants their unlockable", () => {
    const linked = (name: string) =>
      getChallengesForLogbookEntry(entry(name).id).map((c) => c.achievement);
    expect(linked("Medkit")).toEqual(["KillEliteMonster"]);
    expect(linked("Beads of Fealty")).toEqual(["CompleteUnknownEnding"]);
    for (const heresy of [
      "Visions of Heresy",
      "Hooks of Heresy",
      "Strides of Heresy",
      "Essence of Heresy",
    ]) {
      expect(linked(heresy)).toEqual(["KillBossQuantityInRun"]);
    }
    expect(linked("Soldier's Syringe")).toEqual([]);
  });

  it("is unlocked only when discovered and its unlockable is owned", () => {
    const medkit = entry("Medkit");
    const discovered = { ...empty(), discoveredPickups: ["ItemIndex.Medkit"] };
    expect(isLogbookEntryUnlocked(discovered, medkit)).toBe(false);
    expect(
      isLogbookEntryUnlocked(
        { ...discovered, unlocks: ["Items.Medkit"] },
        medkit,
      ),
    ).toBe(true);
  });

  it("unlocking a gated entry unlocks its achievement; locking keeps it", () => {
    const medkit = entry("Medkit");
    const on = toggleLogbookEntry(empty(), medkit, true);
    expect(on.achievements).toContain("KillEliteMonster");
    expect(on.unlocks).toContain("Items.Medkit");
    expect(on.discoveredPickups).toContain("ItemIndex.Medkit");
    expect(on.viewedViewables).toEqual([]);
    expect(isLogbookEntryUnlocked(on, medkit)).toBe(true);

    const off = toggleLogbookEntry(on, medkit, false);
    expect(off.discoveredPickups).not.toContain("ItemIndex.Medkit");
    expect(off.achievements).toContain("KillEliteMonster");
  });

  it("an ungated entry only touches discoveredPickups", () => {
    const syringe = entry("Soldier's Syringe");
    const on = toggleLogbookEntry(empty(), syringe, true);
    expect(on.discoveredPickups).toEqual(["ItemIndex.Syringe"]);
    expect(on.unlocks).toEqual([]);
    expect(on.achievements).toEqual([]);
  });

  it("achievements discover and undiscover their items", () => {
    const on = toggleAchievement(empty(), "KillBossQuantityInRun", true);
    expect(on.discoveredPickups).toEqual(
      expect.arrayContaining([
        "ItemIndex.LunarPrimaryReplacement",
        "ItemIndex.LunarSecondaryReplacement",
        "ItemIndex.LunarUtilityReplacement",
        "ItemIndex.LunarSpecialReplacement",
      ]),
    );
    const off = toggleAchievement(on, "KillBossQuantityInRun", false);
    expect(off.discoveredPickups).toEqual([]);
  });

  it("lock all logbook leaves achievements alone", () => {
    const all = unlockAllLogbook(empty());
    const locked = lockAllLogbook(all);
    expect(locked.achievements).toEqual(all.achievements);
    expect(locked.discoveredPickups).toEqual([]);
  });
});
