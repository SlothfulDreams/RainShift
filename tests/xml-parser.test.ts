/**
 * XML Parser Tests - Core functionality for RoR2 save files
 */

import { describe, expect, it } from "vitest";
import {
  applySaveData,
  extractSaveData,
  parseXml,
  serializeXml,
  validateSaveFile,
} from "@/lib/xml-parser";

const TEST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<UserProfile>
  <name>TestPlayer</name>
  <coins>100</coins>
  <achievementsList>Ach1 Ach2</achievementsList>
  <unviewedAchievementsList></unviewedAchievementsList>
  <viewedUnlockablesList>Survivors.Commando</viewedUnlockablesList>
  <version>2</version>
  <stats>
    <stat name="totalKills">5000</stat>
    <stat name="killsAs.CommandoBody">100</stat>
    <unlock>Characters.Huntress</unlock>
  </stats>
</UserProfile>`;

describe("xml-parser", () => {
  it("round-trips XML without data loss", () => {
    const parsed = parseXml(TEST_XML);
    const serialized = serializeXml(parsed);
    const reparsed = parseXml(serialized);

    expect(reparsed.UserProfile.name).toBe("TestPlayer");
    expect(reparsed.UserProfile.coins).toBe("100");
    expect(serialized).toContain('name="totalKills"');
    expect(serialized).toContain("<unlock>Characters.Huntress</unlock>");
    expect((serialized.match(/<\?xml/g) || []).length).toBe(1);
  });

  it("extracts SaveData with correct types", () => {
    const raw = parseXml(TEST_XML);
    const data = extractSaveData(raw);

    expect(data.coins).toBe(100);
    expect(typeof data.coins).toBe("number");
    expect(data.achievements).toEqual(["Ach1", "Ach2"]);
    expect(data.unlocks).toEqual(["Characters.Huntress"]);
    expect(data.stats.get("totalKills")).toBe("5000");
    expect(data.stats.get("killsAs.CommandoBody")).toBe("100");
  });

  it("handles empty achievement lists", () => {
    const xml = TEST_XML.replace("Ach1 Ach2", "");
    const data = extractSaveData(parseXml(xml));
    expect(data.achievements).toEqual([]);
  });

  it("applies changes immutably and preserves stats", () => {
    const raw = parseXml(TEST_XML);
    const original = raw.UserProfile.coins;
    const data = extractSaveData(raw);

    data.coins = 9999;
    data.achievements.push("NewAch");

    const updated = applySaveData(raw, data);
    const serialized = serializeXml(updated);

    // Original unchanged
    expect(raw.UserProfile.coins).toBe(original);
    // Updates applied
    expect(updated.UserProfile.coins).toBe("9999");
    expect(serialized).toContain("NewAch");
    // Stats preserved
    expect(serialized).toContain('name="totalKills"');
    expect(serialized).toContain(">5000<");
  });

  it("applies unlock changes correctly", () => {
    const raw = parseXml(TEST_XML);
    const data = extractSaveData(raw);

    // Add new unlock
    data.unlocks.push("Characters.Bandit2");

    const updated = applySaveData(raw, data);
    const serialized = serializeXml(updated);

    expect(serialized).toContain("<unlock>Characters.Huntress</unlock>");
    expect(serialized).toContain("<unlock>Characters.Bandit2</unlock>");

    // Remove all unlocks
    data.unlocks = [];
    const cleared = applySaveData(raw, data);
    const clearedSerialized = serializeXml(cleared);

    expect(clearedSerialized).not.toContain("<unlock>");
  });

  it("validates save file structure", () => {
    expect(validateSaveFile(TEST_XML).valid).toBe(true);
    expect(validateSaveFile("<Other/>").valid).toBe(false);
    expect(
      validateSaveFile("<UserProfile><name>X</name></UserProfile>").valid,
    ).toBe(false);
    expect(validateSaveFile("<broken").valid).toBe(false);
  });

  it("handles XML special characters", () => {
    const xml = TEST_XML.replace("TestPlayer", "Player&lt;1&gt;");
    const parsed = parseXml(xml);
    const reparsed = parseXml(serializeXml(parsed));
    expect(reparsed.UserProfile.name).toBe("Player<1>");
  });
});
