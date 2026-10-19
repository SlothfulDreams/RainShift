import { challenges } from "@/data/challenges";
import { logbookEntries } from "@/data/logbook-entries";
import type { Challenge, LogbookEntry } from "@/data/types";

/**
 * Challenge <-> logbook mapping for items and equipment.
 *
 * In-game, an item/equipment logbook entry is gated by the item's own
 * unlockable (ItemDef/EquipmentDef.unlockableDef), stored as entry.unlockId.
 * A challenge is linked to every entry whose unlockable it grants, e.g.
 * KillBossQuantityInRun grants Items.LunarSkillReplacements, which gates all
 * four Heresy items, and CompleteUnknownEnding grants Characters.Mercenary,
 * which also gates Beads of Fealty.
 */

const pickupCategories = new Set<LogbookEntry["category"]>([
  "items",
  "equipment",
]);

const challengeToLogbook = new Map<string, LogbookEntry[]>();
const logbookToChallenge = new Map<string, Challenge[]>();

for (const entry of logbookEntries) {
  if (!entry.unlockId || !pickupCategories.has(entry.category)) continue;
  for (const challenge of challenges) {
    if (!challenge.unlocks.includes(entry.unlockId)) continue;
    challengeToLogbook.set(challenge.id, [
      ...(challengeToLogbook.get(challenge.id) ?? []),
      entry,
    ]);
    logbookToChallenge.set(entry.id, [
      ...(logbookToChallenge.get(entry.id) ?? []),
      challenge,
    ]);
  }
}

/**
 * Logbook entries unlocked by a challenge
 */
export function getLogbookEntriesForChallenge(
  challengeId: string,
): LogbookEntry[] {
  return challengeToLogbook.get(challengeId) ?? [];
}

/**
 * Challenges that unlock a logbook entry
 */
export function getChallengesForLogbookEntry(entryId: string): Challenge[] {
  return logbookToChallenge.get(entryId) ?? [];
}

export function getLogbookCountForChallenge(challengeId: string): number {
  return getLogbookEntriesForChallenge(challengeId).length;
}

export function getChallengeCountForLogbookEntry(entryId: string): number {
  return getChallengesForLogbookEntry(entryId).length;
}

/**
 * Whether another unlocked challenge also unlocks this entry.
 * Used when locking a challenge to decide whether the entry stays unlocked.
 */
export function isLogbookEntryProvidedByOtherChallenge(
  entry: LogbookEntry,
  excludeAchievementId: string,
  unlockedAchievements: Set<string>,
): boolean {
  return getChallengesForLogbookEntry(entry.id).some(
    (challenge) =>
      challenge.achievement !== excludeAchievementId &&
      unlockedAchievements.has(challenge.achievement),
  );
}
