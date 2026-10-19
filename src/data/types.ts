// DLC identifiers
export type DLC = "base" | "sotv" | "sots" | "ac" | "hc";

export const DLC_NAMES: Record<DLC, string> = {
  base: "Base Game",
  sotv: "Survivors of the Void",
  sots: "Seekers of the Storm",
  ac: "Alloyed Collective",
  hc: "Hallowed Concepts",
};

// Challenge categories for organizing the editor
export type ChallengeCategory =
  | "survivors"
  | "skills"
  | "skins"
  | "items"
  | "artifacts";

export const CATEGORY_NAMES: Record<ChallengeCategory, string> = {
  survivors: "Survivors",
  skills: "Skills",
  skins: "Skins",
  items: "Items",
  artifacts: "Artifacts",
};

// Item rarity for visual styling
export type ItemRarity =
  | "common"
  | "uncommon"
  | "legendary"
  | "boss"
  | "lunar"
  | "void"
  | "equipment";

// Logbook categories for the logbook editor
export type LogbookCategory =
  | "monsters"
  | "environments"
  | "survivors"
  | "items"
  | "equipment"
  | "drones";

export const LOGBOOK_CATEGORY_NAMES: Record<LogbookCategory, string> = {
  monsters: "Monster Logs",
  environments: "Environment Logs",
  survivors: "Survivor Logs",
  items: "Items",
  equipment: "Equipment",
  drones: "Drones",
};

// Logbook entry definition
export interface LogbookEntry {
  id: string;
  name: string;
  description?: string;
  category: LogbookCategory;
  // Unlockable in stats.unlock the game checks: the log for monsters/stages
  // (e.g. "Logs.BeetleBody.0"), the item's gate for items/equipment
  // (e.g. "Items.Medkit"; absent when the item is always available)
  unlockId?: string;
  // Entry in discoveredPickups (e.g. "ItemIndex.Syringe", "DroneIndex.Drone1")
  pickupId?: string;
  // Character body name for per-body stats (e.g. totalWins.CommandoBody)
  body?: string;
  dlc: DLC;
  rarity?: ItemRarity; // For items/equipment
  image?: string; // Icon path in public/ (from scripts/extract-logbook-icons.py)
}

// Challenge/Achievement definition
export interface Challenge {
  id: string;
  name: string;
  description: string;
  achievement: string; // Achievement ID used in save file
  prerequisite?: string; // Achievement the game requires first (RegisterAchievement)
  lunarCoins: number; // Lunar coins the game awards for this achievement
  unlocks: string[]; // What gets unlocked (survivors, skills, items, etc.)
  category: ChallengeCategory;
  survivor?: string; // Associated survivor ID (for skills/skins)
  dlc: DLC;
  rarity?: ItemRarity; // For items
}

// Survivor definition
export interface Survivor {
  id: string;
  name: string;
  dlc: DLC;
  unlockAchievement?: string; // Achievement needed to unlock (undefined = default unlocked)
  description?: string;
}

// Parsed save data structure
export interface SaveData {
  name: string;
  coins: number;
  achievements: string[];
  unviewedAchievements: string[];
  viewedUnlockables: string[];
  unlocks: string[]; // Actual unlocked content (Characters.X, Items.X, Skins.X, etc.)
  stats: Map<string, string>;
  // Logbook fields
  viewedViewables: string[]; // Viewed logbook entries
  discoveredPickups: string[]; // Discovered items/equipment (ItemIndex.X, EquipmentIndex.X)
}

// Raw parsed XML structure (from fast-xml-parser)
export interface RawUserProfile {
  UserProfile: {
    name?: string;
    coins?: string | number;
    totalLoginSeconds?: string | number;
    achievementsList?: string;
    unviewedAchievementsList?: string;
    viewedUnlockablesList?: string;
    viewedViewables?: string;
    discoveredPickups?: string;
    stats?: {
      stat?: RawStat | RawStat[];
      unlock?: string | string[];
    };
    tutorialDifficulty?: string;
    tutorialSurvivor?: string;
    isFirstTimeLaunch?: string;
    keyboardMap?: string;
    mouseMap?: string;
    joystickMap?: string;
    version?: string | number;
  };
}

export interface RawStat {
  "@_name": string;
  "#text"?: string;
}

// Editor state
export interface EditorState {
  originalXml: string;
  saveData: SaveData;
  hasChanges: boolean;
}

// Filter state for the challenge list
export interface FilterState {
  search: string;
  category: ChallengeCategory | "all";
  dlc: DLC | "all";
  showUnlockedOnly: boolean;
  showLockedOnly: boolean;
}
