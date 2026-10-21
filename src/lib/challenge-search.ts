import { challenges } from "@/data/challenges";
import { survivorEntries } from "@/data/logbook/survivors";
import { searchNicknames } from "@/data/search-nicknames";
import type { Challenge } from "@/data/types";
import { unlockableNames } from "@/data/unlockable-names";
import { getLogbookEntriesForChallenge } from "@/lib/challenge-logbook-mapping";

// Lowercase and keep only letters and digits, so "mult" finds MUL-T, "dios"
// finds Dio's Best Friend and "meathook" finds Sentient Meat Hook
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * Display names of what each challenge unlocks, so searching "captain" finds
 * Washed Away (Characters.Captain). Survivor names come from the logbook
 * (Characters.Croco -> Acrid), item/equipment names from the linked logbook
 * entries, and skill/skin/artifact names from the game's unlockables
 * (Skills.Mage.FlyUp -> Ion Surge).
 */

const survivorNameByUnlock = new Map(
  survivorEntries.flatMap((e) => (e.unlockId ? [[e.unlockId, e.name]] : [])),
);

const unlockAliases = new Map(
  challenges.map((c) => [
    c.id,
    [
      ...new Set([
        ...c.unlocks.flatMap(
          (u) => survivorNameByUnlock.get(u) ?? unlockableNames[u] ?? [],
        ),
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
