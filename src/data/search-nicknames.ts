/**
 * Community nicknames and common misspellings for survivors, items and skills
 * that achievements unlock, keyed by in-game name. Only names that search
 * doesn't already find: it ignores case, spaces and punctuation and matches
 * substrings, so "arti", "engi", "merc", "dios", "mult", "meathook" and
 * "goat hoof" already work.
 *
 * Sources: https://riskofrain2.wiki.gg/wiki/Glossary_of_player_terms and
 * common r/riskofrain usage.
 */
export const searchNicknames: Record<string, string[]> = {
  // Survivors (also match their skill and skin achievements)
  Loader: ["lodr"],
  "Void Fiend": ["vf"],

  // Items and equipment
  "Armor-Piercing Rounds": ["apr"],
  "Berzerker's Pauldron": ["berserker"],
  "Forgive Me Please": ["fmp"],
  "Helfire Tincture": ["hellfire"],
  "Kjaro's Band": ["fire band", "bands"],
  "Preon Accumulator": ["bfg"],
  "Rejuvenation Rack": ["rejuv rack"],
  "Runald's Band": ["ice band", "bands"],
  "The Crowdfunder": ["crunder"],
  "Tougher Times": ["teddy", "bear"],

  // Mercenary skills
  "Focused Assault": ["fa"],
  "Rising Thunder": ["rt"],
  "Slicing Winds": ["sw"],
};
