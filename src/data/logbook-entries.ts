import { droneEntries } from "./logbook/drones";
import { environmentEntries } from "./logbook/environments";
import { equipmentEntries } from "./logbook/equipment";
import { itemEntries } from "./logbook/items";
import { monsterEntries } from "./logbook/monsters";
import { survivorEntries } from "./logbook/survivors";
import type { LogbookEntry } from "./types";

/**
 * Risk of Rain 2 Logbook Entries Data
 *
 * Data Sources:
 * - Items, Equipment, Monsters, Environments: generated from the game files
 *   (scripts/generate-logbook.py)
 * - Survivors: https://riskofrain2.wiki.gg/wiki/Survivors
 * - Icons: extracted from the game files by scripts/generate-logbook.py
 *
 * DLC Content:
 * - Base Game: https://riskofrain2.wiki.gg/wiki/Risk_of_Rain_2
 * - Survivors of the Void (SOTV): https://riskofrain2.wiki.gg/wiki/Survivors_of_the_Void
 * - Seekers of the Storm (SOTS): https://riskofrain2.wiki.gg/wiki/Seekers_of_the_Storm
 * - Alloyed Collective (AC): https://riskofrain2.wiki.gg/wiki/Alloyed_Collective
 *
 * Internal ID Naming Conventions:
 * - Monster/Environment logs: the log unlockable's own name, which does not
 *   follow one pattern (Logs.BeetleBody.0, Logs.VoidInfestorBody, Log.SolusHeart,
 *   Logs.Stages.blackbeach)
 * - Survivor Logs: Logs.{SurvivorName}Body.0 (e.g., Logs.CommandoBody.0)
 * - Items/Equipment: discoveredPickups ItemIndex.{Name} / EquipmentIndex.{Name},
 *   gated by the item's unlockable when it has one (e.g. Items.Medkit)
 */
export const logbookEntries: LogbookEntry[] = [
  ...monsterEntries,
  ...environmentEntries,
  ...survivorEntries,
  ...itemEntries,
  ...equipmentEntries,
  ...droneEntries,
];

// Helper functions
export function getLogbookEntriesByCategory(
  category: LogbookEntry["category"] | "all",
): LogbookEntry[] {
  if (category === "all") return logbookEntries;
  return logbookEntries.filter((e) => e.category === category);
}

export function getLogbookEntriesByDLC(
  dlc: LogbookEntry["dlc"] | "all",
): LogbookEntry[] {
  if (dlc === "all") return logbookEntries;
  return logbookEntries.filter((e) => e.dlc === dlc);
}
