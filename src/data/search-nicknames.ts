/**
 * Community nicknames for unlockable survivors and items, keyed by in-game
 * display name. Only names that punctuation-insensitive substring search
 * doesn't already cover ("arti", "engi", "merc", "dios", "mult" all match).
 *
 * Sources: https://riskofrain2.wiki.gg/wiki/Glossary_of_player_terms and
 * common r/riskofrain usage.
 */
export const searchNicknames: Record<string, string[]> = {
  // Survivors
  Loader: ["lodr"],

  // Items and equipment
  "Armor-Piercing Rounds": ["apr"],
  "Forgive Me Please": ["fmp"],
  "Kjaro's Band": ["fire band"],
  "Preon Accumulator": ["bfg"],
  "Runald's Band": ["ice band"],
  "Sentient Meat Hook": ["meathook"],
  "The Crowdfunder": ["crunder"],
  "Tougher Times": ["teddy", "bear"],
};
