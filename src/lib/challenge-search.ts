import { challenges } from "@/data/challenges";
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

// Keyed by normalized name, which is also what Challenge.survivor holds
// ("mult" for MUL-T)
const nicknamesByName = new Map(
  Object.entries(searchNicknames).map(([name, nicknames]) => [
    normalize(name),
    nicknames,
  ]),
);

function nicknamesOf(name: string): string[] {
  return nicknamesByName.get(normalize(name)) ?? [];
}

export interface ChallengeMatch {
  // Name of the unlock that matched, when the challenge's own text didn't
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

  const survivor = challenge.survivor ?? "";
  const ownText = [
    challenge.name,
    challenge.description,
    survivor,
    ...nicknamesOf(survivor),
  ];
  if (ownText.some((text) => normalize(text).includes(q))) {
    return {};
  }

  const alias = getUnlockAliases(challenge.id).find((name) =>
    [name, ...nicknamesOf(name)].some((term) => normalize(term).includes(q)),
  );
  return alias ? { alias } : null;
}
