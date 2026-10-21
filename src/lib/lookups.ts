import { challenges } from "@/data/challenges";
import { survivorEntries } from "@/data/logbook/survivors";
import type { Challenge } from "@/data/types";
import { unlockableNames } from "@/data/unlockable-names";

const challengeByAchievement = new Map(
  challenges.map((c) => [c.achievement, c]),
);

export function getChallengeByAchievement(
  achievementId: string,
): Challenge | undefined {
  return challengeByAchievement.get(achievementId);
}

const survivorNameByUnlock = new Map(
  survivorEntries.flatMap((e) => (e.unlockId ? [[e.unlockId, e.name]] : [])),
);

/**
 * In-game name of a survivor, skill, skin or artifact unlockable
 * (Characters.Croco -> Acrid, Skills.Mage.FlyUp -> Ion Surge). Items aren't
 * named here because one unlockable can gate several items; use
 * getLogbookEntriesForChallenge for those.
 */
export function getUnlockName(unlockId: string): string | undefined {
  return survivorNameByUnlock.get(unlockId) ?? unlockableNames[unlockId];
}
