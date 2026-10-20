/**
 * Starting karma tests.
 * Keys verified against RoR2.KarmaManager (GatherStartingKarmaUnlockables,
 * OnClientGameOver) and the Karma.StartingKarma.<n> UnlockableDef assets.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { challenges } from "@/data/challenges";
import { startingKarmaLevels } from "@/data/karma-levels";
import type { SaveData } from "@/data/types";
import {
  getStartingKarma,
  isStartingKarmaUnlocked,
  levelZeroChallenge,
  MAX_STARTING_KARMA,
  setStartingKarma,
} from "@/lib/karma";
import {
  generateModifiedXml,
  loadSaveFile,
  toggleAchievement,
} from "@/lib/save-operations";

const karmaKey = (n: number) => `Karma.StartingKarma.${n}`;
const karmaUnlocks = (data: SaveData) =>
  data.unlocks.filter((u) => u.startsWith("Karma.StartingKarma."));

const createSaveData = (unlocks: string[] = []): SaveData => ({
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

describe("starting karma data", () => {
  it("has levels 0-8 gated like KarmaManager.GetRequiredUnlockableForKarmaLevel", () => {
    expect(MAX_STARTING_KARMA).toBe(8);
    expect(startingKarmaLevels.map((l) => l.level)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(startingKarmaLevels[0].unlockId).toBe("Characters.Captain");
    for (let n = 1; n <= 8; n++) {
      expect(startingKarmaLevels[n].unlockId).toBe(karmaKey(n));
    }
  });

  it("level 0's gate is the Captain unlock granted by an achievement", () => {
    expect(
      challenges.some((c) => c.unlocks.includes("Characters.Captain")),
    ).toBe(true);
  });
});

describe("setStartingKarma", () => {
  it("writes levels 1..N", () => {
    const data = setStartingKarma(createSaveData(), 5);
    expect(karmaUnlocks(data)).toEqual([1, 2, 3, 4, 5].map(karmaKey));
    expect(getStartingKarma(data)).toBe(5);
  });

  it("removes the levels above N", () => {
    const full = setStartingKarma(createSaveData(), 8);
    const data = setStartingKarma(full, 3);
    expect(karmaUnlocks(data)).toEqual([1, 2, 3].map(karmaKey));
    expect(isStartingKarmaUnlocked(data, 3)).toBe(true);
    expect(isStartingKarmaUnlocked(data, 4)).toBe(false);
  });

  it("0 removes every starting karma level but keeps the Captain unlock", () => {
    const data = setStartingKarma(
      createSaveData(["Characters.Captain", karmaKey(1), karmaKey(2)]),
      0,
    );
    expect(data.unlocks).toEqual(["Characters.Captain"]);
    expect(getStartingKarma(data)).toBe(0);
  });

  it("keeps other unlocks in order and does not duplicate", () => {
    const original = createSaveData([
      "Characters.Captain",
      "Logs.BeetleBody.0",
      karmaKey(2),
      "Characters.Huntress",
      karmaKey(7),
    ]);
    const data = setStartingKarma(original, 3);
    expect(data.unlocks).toEqual([
      "Characters.Captain",
      "Logs.BeetleBody.0",
      karmaKey(2),
      "Characters.Huntress",
      karmaKey(1),
      karmaKey(3),
    ]);
    expect(setStartingKarma(data, 3).unlocks).toEqual(data.unlocks);
    // Immutable
    expect(original.unlocks).toHaveLength(5);
  });

  it("level 1 and up also unlocks Washed Away (the Captain)", () => {
    const data = setStartingKarma(createSaveData(), 5, { awardCoins: true });
    expect(data.achievements).toEqual(["CompleteMainEnding"]);
    expect(isStartingKarmaUnlocked(data, 0)).toBe(true);
    expect(data.coins).toBe(levelZeroChallenge?.lunarCoins);
    expect(setStartingKarma(createSaveData(), 5).coins).toBe(0);
  });

  it("0 does not unlock the Captain, and going back to 0 keeps it", () => {
    expect(setStartingKarma(createSaveData(), 0).unlocks).toEqual([]);
    const five = setStartingKarma(createSaveData(), 5);
    const zero = setStartingKarma(five, 0);
    expect(zero.achievements).toContain("CompleteMainEnding");
    expect(isStartingKarmaUnlocked(zero, 0)).toBe(true);
    expect(karmaUnlocks(zero)).toEqual([]);
  });

  it("does not re-grant the Captain when it is already unlocked", () => {
    const owned = createSaveData(["Characters.Captain"]);
    const data = setStartingKarma(owned, 4, { awardCoins: true });
    expect(data.achievements).toEqual([]);
    expect(data.coins).toBe(0);
  });

  it("clamps the level to 0-8", () => {
    expect(karmaUnlocks(setStartingKarma(createSaveData(), 20))).toHaveLength(
      8,
    );
    expect(karmaUnlocks(setStartingKarma(createSaveData(), -1))).toEqual([]);
    expect(getStartingKarma(setStartingKarma(createSaveData(), 2.7))).toBe(2);
  });
});

describe("getStartingKarma", () => {
  it("counts only the unbroken run of levels from 1", () => {
    const data = createSaveData([karmaKey(1), karmaKey(2), karmaKey(5)]);
    expect(getStartingKarma(data)).toBe(2);
    expect(isStartingKarmaUnlocked(data, 5)).toBe(true);
    expect(getStartingKarma(createSaveData([karmaKey(3)]))).toBe(0);
  });

  it("level 0 needs the Captain unlock", () => {
    expect(isStartingKarmaUnlocked(createSaveData(), 0)).toBe(false);
    expect(
      isStartingKarmaUnlocked(createSaveData(["Characters.Captain"]), 0),
    ).toBe(true);
  });

  it("unlocking Washed Away makes level 0 selectable", () => {
    expect(levelZeroChallenge?.achievement).toBe("CompleteMainEnding");
    const data = toggleAchievement(
      createSaveData(),
      "CompleteMainEnding",
      true,
      { awardCoins: true },
    );
    expect(isStartingKarmaUnlocked(data, 0)).toBe(true);
    expect(data.achievements).toContain("CompleteMainEnding");
    expect(data.coins).toBe(levelZeroChallenge?.lunarCoins);
  });
});

describe("starting karma in the save file", () => {
  it("writes and removes <unlock> entries in <stats>", () => {
    const xml = readFileSync(resolve(__dirname, "../test-save.xml"), "utf-8");
    const { raw, saveData } = loadSaveFile(xml);

    const eight = generateModifiedXml(raw, setStartingKarma(saveData, 8));
    for (let n = 1; n <= 8; n++) {
      expect(eight).toContain(`<unlock>${karmaKey(n)}</unlock>`);
    }
    expect(eight).toContain("<unlock>Logs.BeetleBody.0</unlock>");

    const reloaded = loadSaveFile(eight);
    expect(getStartingKarma(reloaded.saveData)).toBe(8);

    const four = generateModifiedXml(
      reloaded.raw,
      setStartingKarma(reloaded.saveData, 4),
    );
    expect(four).toContain(`<unlock>${karmaKey(4)}</unlock>`);
    expect(four).not.toContain(karmaKey(5));
    expect(getStartingKarma(loadSaveFile(four).saveData)).toBe(4);
  });
});
