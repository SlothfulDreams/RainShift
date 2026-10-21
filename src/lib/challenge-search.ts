import { challenges } from "@/data/challenges";
import { survivorEntries } from "@/data/logbook/survivors";
import type { Challenge } from "@/data/types";
import { getLogbookEntriesForChallenge } from "@/lib/challenge-logbook-mapping";

/**
 * Display names of what each challenge unlocks, so searching "captain" finds
 * Washed Away (Characters.Captain). Survivor names come from the logbook
 * (Characters.Croco -> Acrid), item/equipment names from the linked logbook
 * entries.
 */

const survivorNameByUnlock = new Map(
  survivorEntries.flatMap((e) => (e.unlockId ? [[e.unlockId, e.name]] : [])),
);

const unlockAliases = new Map(
  challenges.map((c) => [
    c.id,
    [
      ...new Set([
        ...c.unlocks.flatMap((u) => survivorNameByUnlock.get(u) ?? []),
        ...getLogbookEntriesForChallenge(c.id).map((e) => e.name),
      ]),
    ],
  ]),
);

export function getUnlockAliases(challengeId: string): string[] {
  return unlockAliases.get(challengeId) ?? [];
}

export interface ChallengeMatch {
  // Name of the unlocked survivor/item that matched, when the challenge's own
  // text didn't
  alias?: string;
}

/**
 * Match a challenge against a search query. Returns null when it doesn't match.
 */
export function matchChallenge(
  challenge: Challenge,
  query: string,
): ChallengeMatch | null {
  const q = query.trim().toLowerCase();
  if (
    !q ||
    challenge.name.toLowerCase().includes(q) ||
    challenge.description.toLowerCase().includes(q) ||
    challenge.survivor?.toLowerCase().includes(q)
  ) {
    return {};
  }
  const alias = getUnlockAliases(challenge.id).find((name) =>
    name.toLowerCase().includes(q),
  );
  return alias ? { alias } : null;
}
