import { challenges } from "@/data/challenges";
import { survivorEntries } from "@/data/logbook/survivors";
import { searchNicknames } from "@/data/search-nicknames";
import type { Challenge } from "@/data/types";
import { getLogbookEntriesForChallenge } from "@/lib/challenge-logbook-mapping";
import { getUnlockName } from "@/lib/lookups";

// Lowercase and keep only letters and digits, so "mult" finds MUL-T, "dios"
// finds Dio's Best Friend and "meathook" finds Sentient Meat Hook
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * Display names of what each challenge unlocks, so searching "captain" finds
 * Washed Away (Characters.Captain): the unlockables' own names plus the
 * items/equipment they gate.
 */
const unlockAliases = new Map(
  challenges.map((c) => [
    c.id,
    [
      ...new Set([
        ...c.unlocks.flatMap((u) => getUnlockName(u) ?? []),
        ...getLogbookEntriesForChallenge(c.id).map((e) => e.name),
      ]),
    ],
  ]),
);

export function getUnlockAliases(challengeId: string): string[] {
  return unlockAliases.get(challengeId) ?? [];
}

// Challenge.survivor is the survivor's normalized name ("mult" for MUL-T)
const survivorNameById = new Map(
  survivorEntries.map((e) => [normalize(e.name), e.name]),
);

function nicknamesOf(name: string | undefined): string[] {
  return (name && searchNicknames[name]) || [];
}

export interface ChallengeMatch {
  // Name of the unlocked survivor/item/skill that matched, when the
  // challenge's own text didn't
  alias?: string;
}

/**
 * Match a challenge against a search query, including what it unlocks and the
 * community nicknames of those unlocks and of the challenge's survivor.
 * Returns null when it doesn't match.
 */
export function matchChallenge(
  challenge: Challenge,
  query: string,
): ChallengeMatch | null {
  const q = normalize(query);
  if (!q) return {};

  const ownText = [
    challenge.name,
    challenge.description,
    challenge.survivor,
    ...nicknamesOf(survivorNameById.get(challenge.survivor ?? "")),
  ];
  if (ownText.some((text) => text && normalize(text).includes(q))) {
    return {};
  }

  const alias = getUnlockAliases(challenge.id).find((name) =>
    [name, ...nicknamesOf(name)].some((term) => normalize(term).includes(q)),
  );
  return alias ? { alias } : null;
}
