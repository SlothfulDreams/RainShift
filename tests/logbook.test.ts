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

describe("logbook monsters and environments", () => {
  it("use the game's log unlockable names", () => {
    const log = (name: string) => entry(name).unlockId;
    expect(log("Beetle")).toBe("Logs.BeetleBody.0");
    expect(log("Void Infestor")).toBe("Logs.VoidInfestorBody");
    expect(log("Solus Heart")).toBe("Log.SolusHeart");
    expect(log("Xi Construct")).toBe("Logs.MegaConstructBody");
    expect(log("Void Devastator")).toBe("Logs.VoidMegaCrab");
    expect(log("Voidling")).toBe("Logs.MiniVoidRaidCrab");
    expect(log("Distant Roost")).toBe("Logs.Stages.blackbeach");
    expect(log("Pretender's Precipice")).toBe("Logs.Stages.nest");
  });

  it("toggle only the log unlockable", () => {
    const beetle = entry("Beetle");
    const on = toggleLogbookEntry(empty(), beetle, true);
    expect(on.unlocks).toEqual(["Logs.BeetleBody.0"]);
    expect(on.viewedViewables).toEqual([]);
    expect(isLogbookEntryUnlocked(on, beetle)).toBe(true);
    const off = toggleLogbookEntry(on, beetle, false);
    expect(off.unlocks).toEqual([]);
    expect(isLogbookEntryUnlocked(off, beetle)).toBe(false);
  });
});

describe("logbook survivors", () => {
  it("lists every survivor with its body", () => {
    const survivors = logbookEntries.filter((e) => e.category === "survivors");
    expect(survivors).toHaveLength(21);
    for (const s of survivors) expect(s.body, s.id).toMatch(/Body$/);
    expect(entry("Enforcer").body).toBe("Enforcer2Body");
    expect(entry("Acolyte").unlockId).toBe("Characters.Acolyte");
  });

  it("needs the survivor unlocked and a win", () => {
    const mage = entry("Artificer");
    const won = { ...empty(), stats: new Map([["totalWins.MageBody", "3"]]) };
    expect(isLogbookEntryUnlocked(won, mage)).toBe(false);
    expect(
      isLogbookEntryUnlocked({ ...won, unlocks: ["Characters.Mage"] }, mage),
    ).toBe(true);
  });

  it("unlocks the survivor and records a win; locking clears the wins", () => {
    const mage = entry("Artificer");
    const on = toggleLogbookEntry(empty(), mage, true);
    expect(on.achievements).toContain("FreeMage");
    expect(on.unlocks).toContain("Characters.Mage");
    expect(on.stats.get("totalWins.MageBody")).toBe("1");
    expect(isLogbookEntryUnlocked(on, mage)).toBe(true);

    const off = toggleLogbookEntry(on, mage, false);
    expect(off.stats.get("totalWins.MageBody")).toBe("0");
    expect(off.unlocks).toContain("Characters.Mage");
    expect(isLogbookEntryUnlocked(off, mage)).toBe(false);
  });

  it("keeps existing wins and needs no unlock for free survivors", () => {
    const commando = entry("Commando");
    const data = {
      ...empty(),
      stats: new Map([["totalWins.CommandoBody", "7"]]),
    };
    expect(isLogbookEntryUnlocked(data, commando)).toBe(true);
    const on = toggleLogbookEntry(data, commando, true);
    expect(on.stats.get("totalWins.CommandoBody")).toBe("7");
    expect(on.unlocks).toEqual([]);
  });
});
