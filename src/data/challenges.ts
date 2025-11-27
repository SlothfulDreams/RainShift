import type { Challenge } from "./types";

export const challenges: Challenge[] = [
  // ============================================
  // SURVIVOR UNLOCKS
  // ============================================
  {
    id: "huntress-unlock",
    name: "Warrior",
    description: "Reach and complete the 3rd Teleporter event without dying.",
    achievement: "RepeatFirstTeleporter",
    unlocks: ["Survivors.Huntress"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "mult-unlock",
    name: "Verified",
    description: "Complete the first Teleporter event without taking damage.",
    achievement: "CompleteTeleporterWithoutInjury",
    unlocks: ["Survivors.Toolbot"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "engineer-unlock",
    name: "Engineering Perfection",
    description: "Complete 30 stages.",
    achievement: "CompleteThreeStages",
    unlocks: ["Survivors.Engineer"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "artificer-unlock",
    name: "Pause.",
    description: "Free the survivor suspended in time.",
    achievement: "FreeMage",
    unlocks: ["Survivors.Mage"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "mercenary-unlock",
    name: "True Respite",
    description: "Obliterate yourself at the Obelisk.",
    achievement: "CompleteTeleporterWithoutObtainingGold",
    unlocks: ["Survivors.Mercenary"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "rex-unlock",
    name: "Power Plant",
    description: "Repair the broken robot with an Escape Pod's Fuel Array.",
    achievement: "RepairTurret",
    unlocks: ["Survivors.TreeBot"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "loader-unlock",
    name: "Guidance Offline",
    description: "Defeat the Alloy Worship Unit.",
    achievement: "ReachHighAltitude",
    unlocks: ["Survivors.Loader"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "acrid-unlock",
    name: "...To Be Left Alone",
    description: "Stabilize the Cell in the Void Fields.",
    achievement: "ReleaseAcrid",
    unlocks: ["Survivors.Croco"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "captain-unlock",
    name: "Completion",
    description: "Defeat the final boss.",
    achievement: "DefeatMithrix",
    unlocks: ["Survivors.Captain"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "bandit-unlock",
    name: "Showdown",
    description: "Find and rescue the survivor.",
    achievement: "BanditRescue",
    unlocks: ["Survivors.Bandit2"],
    category: "survivors",
    dlc: "base",
  },
  {
    id: "voidfiend-unlock",
    name: "Dragged Below",
    description: "Escape the Planetarium or complete wave 50 in Simulacrum.",
    achievement: "VoidSurvivorUnlock",
    unlocks: ["Survivors.VoidSurvivor"],
    category: "survivors",
    dlc: "sotv",
  },
  {
    id: "chef-unlock",
    name: "Mise En Place",
    description:
      "Offer a Bison Steak, Cautious Slug, and Infusion at the Reformed Altar.",
    achievement: "ChefUnlock",
    unlocks: ["Survivors.Chef"],
    category: "survivors",
    dlc: "sots",
  },
  {
    id: "falseson-unlock",
    name: "Fly Away",
    description: "Defeat the False Son while holding a Halcyon Seed.",
    achievement: "FalseSonUnlock",
    unlocks: ["Survivors.FalseSon"],
    category: "survivors",
    dlc: "sots",
  },
  {
    id: "drifter-unlock",
    name: "Lost In Transit",
    description: "Free the Drifter from her prison in Solutional Haunt.",
    achievement: "DrifterUnlock",
    unlocks: ["Survivors.Drifter"],
    category: "survivors",
    dlc: "ac",
  },

  // ============================================
  // COMMANDO SKILLS
  // ============================================
  {
    id: "commando-frag",
    name: "Commando: Rolling Thunder",
    description: "As Commando, land a killing blow with a slide.",
    achievement: "CommandoKillOverload",
    unlocks: ["Skills.Commando.ThrowGrenade"],
    category: "skills",
    survivor: "commando",
    dlc: "base",
  },
  {
    id: "commando-phaseblast",
    name: "Commando: Godspeed",
    description: "As Commando, complete the first stage in under 5 minutes.",
    achievement: "CommandoFastFirstStageClear",
    unlocks: ["Skills.Commando.FireShotgunBlast"],
    category: "skills",
    survivor: "commando",
    dlc: "base",
  },

  // ============================================
  // HUNTRESS SKILLS
  // ============================================
  {
    id: "huntress-flurry",
    name: "Huntress: Finishing Touch",
    description:
      "As Huntress, land a killing blow with every arrow in a single Flurry.",
    achievement: "HuntressAllGlaiveBouncesKill",
    unlocks: ["Skills.Huntress.Flurry"],
    category: "skills",
    survivor: "huntress",
    dlc: "base",
  },
  {
    id: "huntress-ballista",
    name: "Huntress: One Shot, One Kill",
    description: "As Huntress, collect and carry 12 Crowbars at once.",
    achievement: "HuntressMaintainFullHealth",
    unlocks: ["Skills.Huntress.AimedArrow"],
    category: "skills",
    survivor: "huntress",
    dlc: "base",
  },

  // ============================================
  // MUL-T SKILLS
  // ============================================
  {
    id: "mult-powersaw",
    name: "MUL-T: Gotcha!",
    description:
      "As MUL-T, land the killing blow on an Imp Overlord with the Preon Accumulator.",
    achievement: "ToolbotGuardTeleporter",
    unlocks: ["Skills.Toolbot.Buzzsaw"],
    category: "skills",
    survivor: "mult",
    dlc: "base",
  },
  {
    id: "mult-scrap",
    name: "MUL-T: Multitasking",
    description: "As MUL-T, have 10 or more stacks of Scrap Launcher hits.",
    achievement: "ToolbotKillBoss",
    unlocks: ["Skills.Toolbot.GrenadeLauncher"],
    category: "skills",
    survivor: "mult",
    dlc: "base",
  },

  // ============================================
  // ENGINEER SKILLS
  // ============================================
  {
    id: "engineer-spidermine",
    name: "Engineer: Better With Friends",
    description: "As Engineer, recruit 12 minions at one time.",
    achievement: "EngineerKillBossQuick",
    unlocks: ["Skills.Engineer.SpiderMine"],
    category: "skills",
    survivor: "engineer",
    dlc: "base",
  },
  {
    id: "engineer-harpoon",
    name: "Engineer: 100% Calculated",
    description:
      "As Engineer, defeat the teleporter boss in less than 5 seconds after it spawns.",
    achievement: "EngineerManyTurrets",
    unlocks: ["Skills.Engineer.Harpoon"],
    category: "skills",
    survivor: "engineer",
    dlc: "base",
  },

  // ============================================
  // ARTIFICER SKILLS
  // ============================================
  {
    id: "artificer-ion",
    name: "Artificer: Chunked!",
    description: "As Artificer, fully defeat the teleporter boss in 1 second.",
    achievement: "MageMultiKill",
    unlocks: ["Skills.Mage.IonSurge"],
    category: "skills",
    survivor: "artificer",
    dlc: "base",
  },
  {
    id: "artificer-flamethrower",
    name: "Artificer: Massacre",
    description: "As Artificer, perform a multikill of 20 enemies.",
    achievement: "MageFastBoss",
    unlocks: ["Skills.Mage.Flamethrower"],
    category: "skills",
    survivor: "artificer",
    dlc: "base",
  },

  // ============================================
  // MERCENARY SKILLS
  // ============================================
  {
    id: "mercenary-slicing",
    name: "Mercenary: Ethereal",
    description:
      "As Mercenary, complete a Prismatic Trial without falling below 100% health.",
    achievement: "MercenaryDontTouchGround",
    unlocks: ["Skills.Mercenary.FocusedAssault"],
    category: "skills",
    survivor: "mercenary",
    dlc: "base",
  },
  {
    id: "mercenary-eviscerate",
    name: "Mercenary: Flash of Blades",
    description:
      "As Mercenary, complete a Prismatic Trial without touching the ground.",
    achievement: "MercenaryNoHit",
    unlocks: ["Skills.Mercenary.EvisProject"],
    category: "skills",
    survivor: "mercenary",
    dlc: "base",
  },

  // ============================================
  // REX SKILLS
  // ============================================
  {
    id: "rex-bramble",
    name: "REX: Dunked",
    description:
      "As REX, kill a Clay Dunestrider on Abandoned Aqueduct by throwing it into a pit.",
    achievement: "TreebotDunkBoss",
    unlocks: ["Skills.TreeBot.Fruit"],
    category: "skills",
    survivor: "rex",
    dlc: "base",
  },
  {
    id: "rex-harvest",
    name: "REX: Bushwhacked",
    description: "As REX, complete an entire teleporter event while yourelf.",
    achievement: "TreebotLowHealthTeleporter",
    unlocks: ["Skills.TreeBot.FireFlower"],
    category: "skills",
    survivor: "rex",
    dlc: "base",
  },

  // ============================================
  // LOADER SKILLS
  // ============================================
  {
    id: "loader-spiked",
    name: "Loader: Swing By",
    description:
      "As Loader, reach and complete the Celestial Portal in 25 minutes or less.",
    achievement: "LoaderSpeedKill",
    unlocks: ["Skills.Loader.ZapFist"],
    category: "skills",
    survivor: "loader",
    dlc: "base",
  },
  {
    id: "loader-thunder",
    name: "Loader: Earthshatter",
    description: "As Loader, land a Charged Gauntlet hit at 300mph or higher.",
    achievement: "LoaderBigSlam",
    unlocks: ["Skills.Loader.ThunderFist"],
    category: "skills",
    survivor: "loader",
    dlc: "base",
  },

  // ============================================
  // ACRID SKILLS
  // ============================================
  {
    id: "acrid-ravenous",
    name: "Acrid: Easy Prey",
    description: "As Acrid, kill a boss in 1 second.",
    achievement: "CrocoBeatArenaFast",
    unlocks: ["Skills.Croco.ChainableLeap"],
    category: "skills",
    survivor: "acrid",
    dlc: "base",
  },
  {
    id: "acrid-frenzied",
    name: "Acrid: Bad Medicine",
    description: "As Acrid, land the final blow on a Scavenger.",
    achievement: "CrocoKillScav",
    unlocks: ["Skills.Croco.Slash"],
    category: "skills",
    survivor: "acrid",
    dlc: "base",
  },

  // ============================================
  // CAPTAIN SKILLS
  // ============================================
  {
    id: "captain-diablo",
    name: "Captain: Completion",
    description: "As Captain, beat the game.",
    achievement: "CaptainVisitPlanet",
    unlocks: ["Skills.Captain.Airstrike2"],
    category: "skills",
    survivor: "captain",
    dlc: "base",
  },
  {
    id: "captain-oag",
    name: "Captain: Wanderlust",
    description: "As Captain, visit 10 different environments in a single run.",
    achievement: "CaptainVoidDeath",
    unlocks: ["Skills.Captain.CallSupply2"],
    category: "skills",
    survivor: "captain",
    dlc: "base",
  },

  // ============================================
  // BANDIT SKILLS
  // ============================================
  {
    id: "bandit-desperado",
    name: "Bandit: B&E",
    description: "As Bandit, kill the final boss with 'Lights Out'.",
    achievement: "Bandit2KillFinalBoss",
    unlocks: ["Skills.Bandit2.SkullRevolver"],
    category: "skills",
    survivor: "bandit",
    dlc: "base",
  },
  {
    id: "bandit-smokebomb",
    name: "Bandit: Sadist",
    description: "As Bandit, kill a monster with 20 stacks of Hemorrhage.",
    achievement: "Bandit2StackHemorrhage",
    unlocks: ["Skills.Bandit2.ThrowSmokebomb"],
    category: "skills",
    survivor: "bandit",
    dlc: "base",
  },

  // ============================================
  // RAILGUNNER SKILLS (SOTV)
  // ============================================
  {
    id: "railgunner-polar",
    name: "Railgunner: Marksman",
    description: "As Railgunner, beat the game or obliterate on Monsoon.",
    achievement: "RailgunnerClearGameMonsoon",
    unlocks: ["Skills.Railgunner.ScopeLight"],
    category: "skills",
    survivor: "railgunner",
    dlc: "sotv",
  },
  {
    id: "railgunner-cryocharge",
    name: "Railgunner: Tripwire",
    description: "As Railgunner, kill an enemy by detonating a mine.",
    achievement: "RailgunnerElectricBoomerang",
    unlocks: ["Skills.Railgunner.FireElectricGrenade"],
    category: "skills",
    survivor: "railgunner",
    dlc: "sotv",
  },

  // ============================================
  // VOID FIEND SKILLS (SOTV)
  // ============================================
  {
    id: "voidfiend-mastery",
    name: "Void Fiend: Mastery",
    description: "As Void Fiend, beat the game or obliterate on Monsoon.",
    achievement: "VoidSurvivorClearGameMonsoon",
    unlocks: ["Skins.VoidSurvivor.Alt1"],
    category: "skins",
    survivor: "voidfiend",
    dlc: "sotv",
  },

  // ============================================
  // SEEKER SKILLS (SOTS)
  // ============================================
  {
    id: "seeker-spirit",
    name: "Seeker: Elevation",
    description:
      "As Seeker, hit 3 airborne enemies with the third shot of your primary.",
    achievement: "SeekerAirKill",
    unlocks: ["Skills.Seeker.SpiritOrb"],
    category: "skills",
    survivor: "seeker",
    dlc: "sots",
  },

  // ============================================
  // CHEF SKILLS (SOTS)
  // ============================================
  {
    id: "chef-sear",
    name: "CHEF: Seared to Perfection",
    description:
      "As CHEF, get 20 burn stacks on Mithrix with secondary and special.",
    achievement: "ChefBurnMithrix",
    unlocks: ["Skills.Chef.Sear2"],
    category: "skills",
    survivor: "chef",
    dlc: "sots",
  },
  {
    id: "chef-roll",
    name: "CHEF: Rolling In",
    description: "As CHEF, run over 5 airborne enemies while in the air.",
    achievement: "ChefAirborneRoll",
    unlocks: ["Skills.Chef.Roll2"],
    category: "skills",
    survivor: "chef",
    dlc: "sots",
  },
  {
    id: "chef-glaze",
    name: "CHEF: Glazed and Braised",
    description:
      "As CHEF, oil and burn 10 bisons, then grab the recipe from their corpses.",
    achievement: "ChefBisonRecipe",
    unlocks: ["Skills.Chef.Glaze2"],
    category: "skills",
    survivor: "chef",
    dlc: "sots",
  },

  // ============================================
  // FALSE SON SKILLS (SOTS)
  // ============================================
  {
    id: "falseson-laser",
    name: "False Son: Grand Finale",
    description:
      "As False Son, kill 15 enemies in a single use of your special.",
    achievement: "FalseSonLaserKill",
    unlocks: ["Skills.FalseSon.Laser2"],
    category: "skills",
    survivor: "falseson",
    dlc: "sots",
  },

  // ============================================
  // OPERATOR SKILLS (AC)
  // ============================================
  {
    id: "operator-recruit",
    name: "Operator: Recruitment Drive",
    description: "As Operator, recruit 5 different drones.",
    achievement: "OperatorRecruitDrones",
    unlocks: ["Skills.Operator.Recruit2"],
    category: "skills",
    survivor: "operator",
    dlc: "ac",
  },
  {
    id: "operator-airborne",
    name: "Operator: Grounded",
    description:
      "As Operator, defeat the teleporter boss on Conduit Canyon without touching the ground.",
    achievement: "OperatorNoGround",
    unlocks: ["Skills.Operator.Launch2"],
    category: "skills",
    survivor: "operator",
    dlc: "ac",
  },
  {
    id: "operator-lemurian",
    name: "Operator: Up and Away",
    description: "As Operator, keep an Elder Lemurian airborne for 10 seconds.",
    achievement: "OperatorLemurianAirborne",
    unlocks: ["Skills.Operator.Command2"],
    category: "skills",
    survivor: "operator",
    dlc: "ac",
  },

  // ============================================
  // DRIFTER SKILLS (AC)
  // ============================================
  {
    id: "drifter-mountain",
    name: "Drifter: Mountain Climber",
    description:
      "As Drifter, defeat a boss from the Challenge of the Mountain using a Shrine of the Mountain.",
    achievement: "DrifterMountainBoss",
    unlocks: ["Skills.Drifter.Salvage2"],
    category: "skills",
    survivor: "drifter",
    dlc: "ac",
  },

  // ============================================
  // MASTERY SKINS (Base Game)
  // ============================================
  {
    id: "commando-mastery",
    name: "Commando: Mastery",
    description: "As Commando, beat the game or obliterate on Monsoon.",
    achievement: "CommandoClearGameMonsoon",
    unlocks: ["Skins.Commando.Alt1"],
    category: "skins",
    survivor: "commando",
    dlc: "base",
  },
  {
    id: "huntress-mastery",
    name: "Huntress: Mastery",
    description: "As Huntress, beat the game or obliterate on Monsoon.",
    achievement: "HuntressClearGameMonsoon",
    unlocks: ["Skins.Huntress.Alt1"],
    category: "skins",
    survivor: "huntress",
    dlc: "base",
  },
  {
    id: "mult-mastery",
    name: "MUL-T: Mastery",
    description: "As MUL-T, beat the game or obliterate on Monsoon.",
    achievement: "ToolbotClearGameMonsoon",
    unlocks: ["Skins.Toolbot.Alt1"],
    category: "skins",
    survivor: "mult",
    dlc: "base",
  },
  {
    id: "engineer-mastery",
    name: "Engineer: Mastery",
    description: "As Engineer, beat the game or obliterate on Monsoon.",
    achievement: "EngineerClearGameMonsoon",
    unlocks: ["Skins.Engineer.Alt1"],
    category: "skins",
    survivor: "engineer",
    dlc: "base",
  },
  {
    id: "artificer-mastery",
    name: "Artificer: Mastery",
    description: "As Artificer, beat the game or obliterate on Monsoon.",
    achievement: "MageClearGameMonsoon",
    unlocks: ["Skins.Mage.Alt1"],
    category: "skins",
    survivor: "artificer",
    dlc: "base",
  },
  {
    id: "mercenary-mastery",
    name: "Mercenary: Mastery",
    description: "As Mercenary, beat the game or obliterate on Monsoon.",
    achievement: "MercenaryClearGameMonsoon",
    unlocks: ["Skins.Mercenary.Alt1"],
    category: "skins",
    survivor: "mercenary",
    dlc: "base",
  },
  {
    id: "rex-mastery",
    name: "REX: Mastery",
    description: "As REX, beat the game or obliterate on Monsoon.",
    achievement: "TreebotClearGameMonsoon",
    unlocks: ["Skins.TreeBot.Alt1"],
    category: "skins",
    survivor: "rex",
    dlc: "base",
  },
  {
    id: "loader-mastery",
    name: "Loader: Mastery",
    description: "As Loader, beat the game or obliterate on Monsoon.",
    achievement: "LoaderClearGameMonsoon",
    unlocks: ["Skins.Loader.Alt1"],
    category: "skins",
    survivor: "loader",
    dlc: "base",
  },
  {
    id: "acrid-mastery",
    name: "Acrid: Mastery",
    description: "As Acrid, beat the game or obliterate on Monsoon.",
    achievement: "CrocoClearGameMonsoon",
    unlocks: ["Skins.Croco.Alt1"],
    category: "skins",
    survivor: "acrid",
    dlc: "base",
  },
  {
    id: "captain-mastery",
    name: "Captain: Mastery",
    description: "As Captain, beat the game or obliterate on Monsoon.",
    achievement: "CaptainClearGameMonsoon",
    unlocks: ["Skins.Captain.Alt1"],
    category: "skins",
    survivor: "captain",
    dlc: "base",
  },
  {
    id: "bandit-mastery",
    name: "Bandit: Mastery",
    description: "As Bandit, beat the game or obliterate on Monsoon.",
    achievement: "Bandit2ClearGameMonsoon",
    unlocks: ["Skins.Bandit2.Alt1"],
    category: "skins",
    survivor: "bandit",
    dlc: "base",
  },

  // ============================================
  // MASTERY SKINS (DLC)
  // ============================================
  {
    id: "railgunner-mastery",
    name: "Railgunner: Mastery",
    description: "As Railgunner, beat the game or obliterate on Monsoon.",
    achievement: "RailgunnerClearGameMonsoon",
    unlocks: ["Skins.Railgunner.Alt1"],
    category: "skins",
    survivor: "railgunner",
    dlc: "sotv",
  },
  {
    id: "seeker-mastery",
    name: "Seeker: Mastery",
    description: "As Seeker, beat the game or obliterate on Monsoon.",
    achievement: "SeekerClearGameMonsoon",
    unlocks: ["Skins.Seeker.Alt1"],
    category: "skins",
    survivor: "seeker",
    dlc: "sots",
  },
  {
    id: "chef-mastery",
    name: "CHEF: Mastery",
    description: "As CHEF, beat the game or obliterate on Monsoon.",
    achievement: "ChefClearGameMonsoon",
    unlocks: ["Skins.Chef.Alt1"],
    category: "skins",
    survivor: "chef",
    dlc: "sots",
  },
  {
    id: "falseson-mastery",
    name: "False Son: Mastery",
    description: "As False Son, beat the game or obliterate on Monsoon.",
    achievement: "FalseSonClearGameMonsoon",
    unlocks: ["Skins.FalseSon.Alt1"],
    category: "skins",
    survivor: "falseson",
    dlc: "sots",
  },
  {
    id: "operator-mastery",
    name: "Operator: Mastery",
    description: "As Operator, beat the game or obliterate on Monsoon.",
    achievement: "OperatorClearGameMonsoon",
    unlocks: ["Skins.Operator.Alt1"],
    category: "skins",
    survivor: "operator",
    dlc: "ac",
  },
  {
    id: "drifter-mastery",
    name: "Drifter: Mastery",
    description: "As Drifter, beat the game or obliterate on Monsoon.",
    achievement: "DrifterClearGameMonsoon",
    unlocks: ["Skins.Drifter.Alt1"],
    category: "skins",
    survivor: "drifter",
    dlc: "ac",
  },

  // ============================================
  // ARTIFACTS
  // ============================================
  {
    id: "artifact-chaos",
    name: "Trial of Chaos",
    description: "Complete the Trial of Chaos.",
    achievement: "ObtainArtifactChaos",
    unlocks: ["Artifacts.Chaos"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-command",
    name: "Trial of Command",
    description: "Complete the Trial of Command.",
    achievement: "ObtainArtifactCommand",
    unlocks: ["Artifacts.Command"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-death",
    name: "Trial of Death",
    description: "Complete the Trial of Death.",
    achievement: "ObtainArtifactDeath",
    unlocks: ["Artifacts.Death"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-dissonance",
    name: "Trial of Dissonance",
    description: "Complete the Trial of Dissonance.",
    achievement: "ObtainArtifactDissonance",
    unlocks: ["Artifacts.Dissonance"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-enigma",
    name: "Trial of Enigma",
    description: "Complete the Trial of Enigma.",
    achievement: "ObtainArtifactEnigma",
    unlocks: ["Artifacts.Enigma"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-evolution",
    name: "Trial of Evolution",
    description: "Complete the Trial of Evolution.",
    achievement: "ObtainArtifactEvolution",
    unlocks: ["Artifacts.Evolution"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-frailty",
    name: "Trial of Frailty",
    description: "Complete the Trial of Frailty.",
    achievement: "ObtainArtifactFrailty",
    unlocks: ["Artifacts.Frailty"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-glass",
    name: "Trial of Glass",
    description: "Complete the Trial of Glass.",
    achievement: "ObtainArtifactGlass",
    unlocks: ["Artifacts.Glass"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-honor",
    name: "Trial of Honor",
    description: "Complete the Trial of Honor.",
    achievement: "ObtainArtifactHonor",
    unlocks: ["Artifacts.Honor"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-kin",
    name: "Trial of Kin",
    description: "Complete the Trial of Kin.",
    achievement: "ObtainArtifactKin",
    unlocks: ["Artifacts.Kin"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-metamorphosis",
    name: "Trial of Metamorphosis",
    description: "Complete the Trial of Metamorphosis.",
    achievement: "ObtainArtifactMetamorphosis",
    unlocks: ["Artifacts.Metamorphosis"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-sacrifice",
    name: "Trial of Sacrifice",
    description: "Complete the Trial of Sacrifice.",
    achievement: "ObtainArtifactSacrifice",
    unlocks: ["Artifacts.Sacrifice"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-soul",
    name: "Trial of Soul",
    description: "Complete the Trial of Soul.",
    achievement: "ObtainArtifactSoul",
    unlocks: ["Artifacts.Soul"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-spite",
    name: "Trial of Spite",
    description: "Complete the Trial of Spite.",
    achievement: "ObtainArtifactSpite",
    unlocks: ["Artifacts.Spite"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-swarms",
    name: "Trial of Swarms",
    description: "Complete the Trial of Swarms.",
    achievement: "ObtainArtifactSwarms",
    unlocks: ["Artifacts.Swarms"],
    category: "artifacts",
    dlc: "base",
  },
  {
    id: "artifact-vengeance",
    name: "Trial of Vengeance",
    description: "Complete the Trial of Vengeance.",
    achievement: "ObtainArtifactVengeance",
    unlocks: ["Artifacts.Vengeance"],
    category: "artifacts",
    dlc: "base",
  },

  // ============================================
  // ITEMS (Common - White)
  // ============================================
  {
    id: "item-firework",
    name: "The Basics",
    description: "Reach +200% attack speed.",
    achievement: "AttackSpeed",
    unlocks: ["Items.Firework"],
    category: "items",
    dlc: "base",
    rarity: "common",
  },
  {
    id: "item-stickybomb",
    name: "Advancement",
    description: "Complete a teleporter event.",
    achievement: "Complete30StagesCareer",
    unlocks: ["Items.StickyBomb"],
    category: "items",
    dlc: "base",
    rarity: "common",
  },
  {
    id: "item-warbanner",
    name: "Warm Welcome",
    description: "Open a rusted lockbox.",
    achievement: "FindLockbox",
    unlocks: ["Items.WardOnLevel"],
    category: "items",
    dlc: "base",
    rarity: "common",
  },

  // ============================================
  // ITEMS (Uncommon - Green)
  // ============================================
  {
    id: "item-guillotine",
    name: "Cut Down",
    description: "Deal 5000% damage in a single blow.",
    achievement: "HardEliteBoss",
    unlocks: ["Items.ExecuteLowHealthElite"],
    category: "items",
    dlc: "base",
    rarity: "uncommon",
  },
  {
    id: "item-berzerker",
    name: "Warmonger",
    description: "Complete the game 5 times.",
    achievement: "CompleteMainEnding",
    unlocks: ["Items.WarCryOnMultiKill"],
    category: "items",
    dlc: "base",
    rarity: "uncommon",
  },

  // ============================================
  // ITEMS (Legendary - Red)
  // ============================================
  {
    id: "item-brilliantbehemoth",
    name: "Macho",
    description: "Deal 5000 damage in a single second.",
    achievement: "KillElementalLemurians",
    unlocks: ["Items.Behemoth"],
    category: "items",
    dlc: "base",
    rarity: "legendary",
  },
  {
    id: "item-sentientmeathook",
    name: "Slaughter",
    description: "Defeat 3000 enemies.",
    achievement: "Kill500ElitesDaily",
    unlocks: ["Items.BounceNearby"],
    category: "items",
    dlc: "base",
    rarity: "legendary",
  },

  // ============================================
  // ITEMS (Lunar)
  // ============================================
  {
    id: "item-beads",
    name: "Completion: Lunar",
    description: "Achieve Lunar completion.",
    achievement: "CompleteLunar",
    unlocks: ["Items.LunarBadLuck"],
    category: "items",
    dlc: "base",
    rarity: "lunar",
  },

  // ============================================
  // ITEMS (Void - SOTV)
  // ============================================
  {
    id: "item-voidneedle",
    name: "Void Fields",
    description: "Complete the Void Fields.",
    achievement: "CompleteVoidFields",
    unlocks: ["Items.BleedOnHitVoid"],
    category: "items",
    dlc: "sotv",
    rarity: "void",
  },

  // ============================================
  // EQUIPMENT
  // ============================================
  {
    id: "equip-preon",
    name: "Obliteration",
    description: "Obliterate yourself at the Obelisk.",
    achievement: "Obliterate",
    unlocks: ["Equipment.BFG"],
    category: "items",
    dlc: "base",
    rarity: "equipment",
  },
  {
    id: "equip-trophy",
    name: "Trophy Hunter",
    description: "Defeat the boss scavenger.",
    achievement: "KillBossScav",
    unlocks: ["Equipment.Trophy"],
    category: "items",
    dlc: "base",
    rarity: "equipment",
  },

  // ============================================
  // MISCELLANEOUS
  // ============================================
  {
    id: "misc-learning",
    name: "The Learning Process",
    description: "Die 10 times.",
    achievement: "Die10Times",
    unlocks: [],
    category: "misc",
    dlc: "base",
  },
  {
    id: "misc-1000",
    name: "Deicide",
    description: "Defeat 1000 bosses.",
    achievement: "Kill1000Bosses",
    unlocks: [],
    category: "misc",
    dlc: "base",
  },
  {
    id: "misc-looper",
    name: "Looper",
    description: "Loop back to the first stage.",
    achievement: "LoopOnce",
    unlocks: [],
    category: "misc",
    dlc: "base",
  },
];

// Helper functions
export function getChallengesByCategory(category: string): Challenge[] {
  if (category === "all") return challenges;
  return challenges.filter((c) => c.category === category);
}

export function getChallengesByDLC(dlc: string): Challenge[] {
  if (dlc === "all") return challenges;
  return challenges.filter((c) => c.dlc === dlc);
}

export function getChallengesBySurvivor(survivorId: string): Challenge[] {
  return challenges.filter((c) => c.survivor === survivorId);
}

export function getChallengeByAchievement(
  achievement: string,
): Challenge | undefined {
  return challenges.find((c) => c.achievement === achievement);
}

export function searchChallenges(query: string): Challenge[] {
  const lowerQuery = query.toLowerCase();
  return challenges.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.achievement.toLowerCase().includes(lowerQuery),
  );
}
