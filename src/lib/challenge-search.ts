import { challenges } from "@/data/challenges";
import { survivorEntries } from "@/data/logbook/survivors";
import { searchNicknames } from "@/data/search-nicknames";
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

// Lowercase and drop punctuation so "mult" finds MUL-T and "dios" finds
// Dio's Best Friend
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ChallengeMatch {
  // Name of the unlocked survivor/item that matched, when the challenge's own
  // text didn't
  alias?: string;
}

/**
 * Match a challenge against a search query, including what it unlocks and
 * those unlocks' community nicknames. Returns null when it doesn't match.
 */
export function matchChallenge(
  challenge: Challenge,
  query: string,
): ChallengeMatch | null {
  const q = normalize(query);
  if (
    !q ||
    [challenge.name, challenge.description, challenge.survivor ?? ""].some(
      (text) => normalize(text).includes(q),
    )
  ) {
    return {};
  }
  const alias = getUnlockAliases(challenge.id).find((name) =>
    [name, ...(searchNicknames[name] ?? [])].some((term) =>
      normalize(term).includes(q),
    ),
  );
  return alias ? { alias } : null;
}
