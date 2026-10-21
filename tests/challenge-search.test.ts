import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";
import { survivorEntries } from "@/data/logbook/survivors";
import { searchNicknames } from "@/data/search-nicknames";
import type { Challenge } from "@/data/types";
import { unlockableNames } from "@/data/unlockable-names";
import { getUnlockAliases, matchChallenge } from "@/lib/challenge-search";

const byName = (name: string): Challenge => {
  const found = challenges.find((c) => c.name === name);
  if (!found) throw new Error(`no challenge named ${name}`);
  return found;
};

const search = (query: string) =>
  challenges.filter((c) => matchChallenge(c, query)).map((c) => c.name);

describe("matchChallenge", () => {
  it("finds Washed Away when searching for the Captain", () => {
    expect(search("captain")).toContain("Washed Away");
    expect(matchChallenge(byName("Washed Away"), "captain")).toEqual({
      alias: "Captain",
    });
  });

  it.each([
    ["acrid", "...To Be Left Alone", "Acrid"],
    ["mul-t", "Verified", "MUL-T"],
    ["artificer", "Pause.", "Artificer"],
    ["REX", "Power Plant", "REX"],
    ["void fiend", "Dragged Below", "Void Fiend"],
    ["acolyte", "A Broken Ritual", "Acolyte"],
  ])("maps %s to %s", (query, name, alias) => {
    expect(matchChallenge(byName(name), query)).toEqual({ alias });
  });

  it("finds every survivor unlock by the survivor's in-game name", () => {
    const survivorUnlocks = challenges.filter((c) =>
      c.unlocks.some((u) => u.startsWith("Characters.")),
    );
    expect(survivorUnlocks.length).toBeGreaterThanOrEqual(14);
    for (const challenge of survivorUnlocks) {
      for (const unlock of challenge.unlocks) {
        if (!unlock.startsWith("Characters.")) continue;
        const survivor = survivorEntries.find((e) => e.unlockId === unlock);
        if (!survivor) throw new Error(`no survivor for unlock ${unlock}`);
        expect(
          search(survivor.name),
          `${survivor.name} -> ${challenge.name}`,
        ).toContain(challenge.name);
      }
    }
  });

  it("matches items and equipment by their logbook names", () => {
    expect(matchChallenge(byName("Learning Process"), "tougher")).toEqual({
      alias: "Tougher Times",
    });
    expect(matchChallenge(byName("Blockade Breaker"), "heresy")?.alias).toMatch(
      /Heresy/,
    );
    // Items.ElementalRings gates both bands
    expect(search("bands")).toContain("Death Do Us Part");
    // Characters.Mercenary also gates Beads of Fealty
    expect(getUnlockAliases(byName("True Respite").id)).toEqual(
      expect.arrayContaining(["Mercenary", "Beads of Fealty"]),
    );
  });

  it("still matches name and description without an alias", () => {
    expect(matchChallenge(byName("Washed Away"), "washed")).toEqual({});
    expect(matchChallenge(byName("Washed Away"), "beat the game")).toEqual({});
    expect(matchChallenge(byName("Washed Away"), "")).toEqual({});
  });

  it("doesn't match raw internal unlock keys", () => {
    expect(matchChallenge(byName("...To Be Left Alone"), "croco")).toBeNull();
    expect(matchChallenge(byName("Verified"), "toolbot")).toBeNull();
  });

  it("matches skills, skins and artifacts by their in-game names", () => {
    expect(
      matchChallenge(byName("Artificer: Orbital Bombardment"), "ion surge"),
    ).toEqual({ alias: "Ion Surge" });
    expect(matchChallenge(byName("Commando: Mastery"), "hornet")).toEqual({
      alias: "Hornet",
    });
  });

  it("has an in-game name for every skill, skin and artifact unlock", () => {
    const unnamed = challenges
      .flatMap((c) => c.unlocks)
      .filter((u) => /^(Skills|Skins|Artifacts)\./.test(u))
      .filter((u) => !unlockableNames[u]);
    expect(unnamed).toEqual([]);
  });

  it("finds a survivor's achievements by the survivor's nickname", () => {
    const loader = challenges.filter((c) => c.survivor === "loader");
    expect(loader.length).toBeGreaterThan(0);
    for (const challenge of loader) {
      expect(matchChallenge(challenge, "lodr"), challenge.name).toEqual({});
    }
  });

  it("ignores spaces in names and queries", () => {
    const voidFiend = challenges.filter((c) => c.survivor === "voidfiend");
    expect(voidFiend.length).toBeGreaterThan(0);
    for (const challenge of voidFiend) {
      expect(search("void fiend")).toContain(challenge.name);
    }
    expect(search("goathoof")).toContain('"Is This Bugged?"');
  });

  it("ignores punctuation in names and queries", () => {
    expect(matchChallenge(byName("Verified"), "mult")).toEqual({
      alias: "MUL-T",
    });
    expect(search("dios")).toContain("The Lone Survivor");
    expect(matchChallenge(byName("Pause."), "pause")).toEqual({});
  });

  it.each([
    ["lodr", "Loader"],
    ["apr", "Armor-Piercing Rounds"],
    ["teddy", "Tougher Times"],
    ["meathook", "Sentient Meat Hook"],
    ["ice band", "Runald's Band"],
    ["crunder", "The Crowdfunder"],
    ["vf", "Void Fiend"],
    ["hellfire", "Helfire Tincture"],
    ["sw", "Slicing Winds"],
  ])("finds the unlock of nickname %s (%s)", (query, alias) => {
    const matches = challenges.filter(
      (c) => matchChallenge(c, query)?.alias === alias,
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  it("only has nicknames for things achievements unlock", () => {
    const unlockNames = new Set(
      challenges.flatMap((c) => getUnlockAliases(c.id)),
    );
    for (const name of Object.keys(searchNicknames)) {
      expect(unlockNames, name).toContain(name);
    }
  });

  it("returns null when nothing matches", () => {
    expect(search("zzzz")).toEqual([]);
  });
});
