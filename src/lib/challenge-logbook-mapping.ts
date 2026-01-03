import { challenges } from "@/data/challenges";
import { logbookEntries } from "@/data/logbook-entries";
import type { Challenge, LogbookEntry } from "@/data/types";

interface ChallengeLogbookMapping {
  // Map: challenge id -> array of logbook entry IDs
  challengeToLogbook: Map<string, string[]>;
  // Map: logbook entry id -> array of challenge IDs
  logbookToChallenge: Map<string, string[]>;
  // Map: unlockId -> logbook entry (for quick lookup)
  unlockIdToLogbook: Map<string, LogbookEntry>;
  // Map: unlockId -> challenges that unlock it
  unlockIdToChallenges: Map<string, Challenge[]>;
}

function buildMapping(): ChallengeLogbookMapping {
  const challengeToLogbook = new Map<string, string[]>();
  const logbookToChallenge = new Map<string, string[]>();
  const unlockIdToLogbook = new Map<string, LogbookEntry>();
  const unlockIdToChallenges = new Map<string, Challenge[]>();

  // Build unlockId -> logbook entry map (only for items/equipment)
  for (const entry of logbookEntries) {
    if (entry.category === "items" || entry.category === "equipment") {
      unlockIdToLogbook.set(entry.unlockId, entry);
    }
  }

  // Build the bidirectional mapping
  for (const challenge of challenges) {
    const linkedLogbookIds: string[] = [];

    for (const unlock of challenge.unlocks) {
      // Only match Items.* and Equipment.* prefixes
      if (unlock.startsWith("Items.") || unlock.startsWith("Equipment.")) {
        const logbookEntry = unlockIdToLogbook.get(unlock);
        if (logbookEntry) {
          linkedLogbookIds.push(logbookEntry.id);

          // Add to logbook -> challenge mapping
          const existingChallenges = logbookToChallenge.get(logbookEntry.id) || [];
          existingChallenges.push(challenge.id);
          logbookToChallenge.set(logbookEntry.id, existingChallenges);

          // Add to unlockId -> challenges mapping
          const challengesForUnlock = unlockIdToChallenges.get(unlock) || [];
          challengesForUnlock.push(challenge);
          unlockIdToChallenges.set(unlock, challengesForUnlock);
        }
      }
    }

    if (linkedLogbookIds.length > 0) {
      challengeToLogbook.set(challenge.id, linkedLogbookIds);
    }
  }

  return {
    challengeToLogbook,
    logbookToChallenge,
    unlockIdToLogbook,
    unlockIdToChallenges,
  };
}

// Cache the mapping at module load time
const mapping = buildMapping();

// Challenge ID -> Challenge lookup
const challengeById = new Map<string, Challenge>(
  challenges.map((c) => [c.id, c])
);

// Logbook entry ID -> LogbookEntry lookup
const logbookEntryById = new Map<string, LogbookEntry>(
  logbookEntries.map((e) => [e.id, e])
);

/**
 * Get logbook entries that are unlocked by a specific challenge
 */
export function getLogbookEntriesForChallenge(challengeId: string): LogbookEntry[] {
  const logbookIds = mapping.challengeToLogbook.get(challengeId) || [];
  return logbookIds
    .map((id) => logbookEntryById.get(id))
    .filter((entry): entry is LogbookEntry => entry !== undefined);
}

/**
 * Get challenges that unlock a specific logbook entry
 */
export function getChallengesForLogbookEntry(entryId: string): Challenge[] {
  const challengeIds = mapping.logbookToChallenge.get(entryId) || [];
  return challengeIds
    .map((id) => challengeById.get(id))
    .filter((challenge): challenge is Challenge => challenge !== undefined);
}

/**
 * Check if a challenge affects any logbook entries
 */
export function hasLogbookConnection(challenge: Challenge): boolean {
  return mapping.challengeToLogbook.has(challenge.id);
}

/**
 * Check if a logbook entry is linked to any challenges
 */
export function hasChallengeConnection(entry: LogbookEntry): boolean {
  return mapping.logbookToChallenge.has(entry.id);
}

/**
 * Get the count of logbook entries affected by a challenge
 */
export function getLogbookCountForChallenge(challengeId: string): number {
  return mapping.challengeToLogbook.get(challengeId)?.length || 0;
}

/**
 * Get the count of challenges that unlock a logbook entry
 */
export function getChallengeCountForLogbookEntry(entryId: string): number {
  return mapping.logbookToChallenge.get(entryId)?.length || 0;
}

/**
 * Get all challenges that unlock a specific unlockId
 */
export function getChallengesForUnlockId(unlockId: string): Challenge[] {
  return mapping.unlockIdToChallenges.get(unlockId) || [];
}

/**
 * Get logbook entry by its unlockId
 */
export function getLogbookEntryByUnlockId(unlockId: string): LogbookEntry | undefined {
  return mapping.unlockIdToLogbook.get(unlockId);
}

/**
 * Check if any other unlocked challenge also provides this logbook entry
 * Used when disabling a challenge to decide if logbook entry should stay unlocked
 */
export function isLogbookEntryProvidedByOtherChallenge(
  entry: LogbookEntry,
  excludeAchievementId: string,
  unlockedAchievements: Set<string>
): boolean {
  const relatedChallenges = getChallengesForLogbookEntry(entry.id);
  return relatedChallenges.some(
    (challenge) =>
      challenge.achievement !== excludeAchievementId &&
      unlockedAchievements.has(challenge.achievement)
  );
}

/**
 * Check if all logbook entries for a challenge are being removed
 * Used when disabling a logbook entry to decide if challenge should be disabled
 */
export function shouldDisableChallengeForEntry(
  challenge: Challenge,
  entryBeingDisabled: LogbookEntry,
  currentViewedViewables: Set<string>
): boolean {
  const relatedEntries = getLogbookEntriesForChallenge(challenge.id);

  // If this challenge only unlocks this one entry, disable it
  if (relatedEntries.length === 1) {
    return true;
  }

  // Check if all other related entries are also not in viewedViewables
  // (or will be removed along with this one)
  for (const entry of relatedEntries) {
    if (entry.id !== entryBeingDisabled.id && currentViewedViewables.has(entry.unlockId)) {
      // Another related entry is still unlocked, don't disable the challenge
      return false;
    }
  }

  return true;
}
