// Achievement ID to Steam image URL mapping
// Images sourced from Steam Community: https://steamcommunity.com/stats/632360/achievements

const STEAM_CDN_BASE =
  "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/apps/632360";

export const achievementImages: Record<string, string> = {
  // ============================================
  // GENERAL ACHIEVEMENTS
  // ============================================
  KillEliteMonster: `${STEAM_CDN_BASE}/3ebb5f75a716aa6fcab12b7354c3b87e971bcfd5.jpg`, // Elite Slayer
  CompleteTeleporter: `${STEAM_CDN_BASE}/72f985e7287a3011554b361c11ab29b4c3288b22.jpg`, // Advancement
  Discover10UniqueTier1: `${STEAM_CDN_BASE}/0079eebffe85d1b08aaeae763004857b784e4207.jpg`, // The Basics
  StayAlive1: `${STEAM_CDN_BASE}/89180d19216b000ec48a72c41369c43fe75bbe45.jpg`, // The Lone Survivor
  Die5Times: `${STEAM_CDN_BASE}/63cad15246c4447272519dc2fcf9cc4e047caf78.jpg`, // Learning Process
  TotalMoneyCollected: `${STEAM_CDN_BASE}/7219275cb5e7f38ad04b011e1490c89ef1e201bb.jpg`, // Funded!
  Discover5Equipment: `${STEAM_CDN_BASE}/06c3c0d8aa11e1d7f9d9899b1260a4669b6d4b15.jpg`, // Experimenting
  FailShrineChance: `${STEAM_CDN_BASE}/559b14d867e71caafd1596f107fade513abbd6d9.jpg`, // "Is This Bugged?"
  KillBossQuick: `${STEAM_CDN_BASE}/62a2e522d5314fe3e401bc382c42d398fb726258.jpg`, // Keyed Up
  HardHitter: `${STEAM_CDN_BASE}/94e4e841aec702f5286bb37699e9b6122c5db0b0.jpg`, // Macho
  LogCollector: `${STEAM_CDN_BASE}/b8f57141c6077fc6f64040e80e723f8259abd977.jpg`, // Bookworm
  LoopOnce: `${STEAM_CDN_BASE}/87c4d6f8671ec049d5a914566245befa8eef9922.jpg`, // Deja Vu?
  KillBossQuantityInRun: `${STEAM_CDN_BASE}/30502a9b687d6d1dc0a821ab2d52da2d7daaff69.jpg`, // Blockade Breaker
  MajorMultikill: `${STEAM_CDN_BASE}/0bd8f40a8c2bbb258ebc3922a8cce679f80bc9fe.jpg`, // Multikill!
  KillTotalEnemies: `${STEAM_CDN_BASE}/14337f17195d82dc1f6b73d808c4ba84a335e41c.jpg`, // Slaughter
  Die20Times: `${STEAM_CDN_BASE}/9a137ed56f0a0900543818cc957189864358e672.jpg`, // I Love Dying!
  UseThreePortals: `${STEAM_CDN_BASE}/3cc127e3fa2063f2ea6ee2be289228916cb0e041.jpg`, // Cosmic Explorer
  MoveSpeed: `${STEAM_CDN_BASE}/352793a439cc060d122df78c71652f0b98aa204c.jpg`, // Going Fast Recommended
  TotalDronesRepaired: `${STEAM_CDN_BASE}/e511650da044982177335b2a8dd7b9867db4ba78.jpg`, // Mechanic
  BurnToDeath: `${STEAM_CDN_BASE}/15650a5075d2feb3ad0c46cb76c3a3721f74921f.jpg`, // Warm For Life
  CompleteMultiBossShrine: `${STEAM_CDN_BASE}/465283ef2ed9ed9af8e9aa9f6632d95cfa2b6ee7.jpg`, // Ascendant
  KillElitesMilestone: `${STEAM_CDN_BASE}/55052157013cda249a48f19e7af4dd5e4f7bfd7a.jpg`, // Cut Down
  MultiCombatShrine: `${STEAM_CDN_BASE}/60de70f6c2dcfc880402f7c6fe1917ee9f695ed7.jpg`, // Warmonger
  CleanupDuty: `${STEAM_CDN_BASE}/6322d79583c84913206c76296c6cf7603295e20e.jpg`, // Cleanup Duty
  AttackSpeed: `${STEAM_CDN_BASE}/c8701a660f57525f02d15e72054f9d29149ecd9c.jpg`, // Rapidfire
  NeverBackDown: `${STEAM_CDN_BASE}/b1015a4625a318ac72c45d860de59109a9b2c429.jpg`, // Never Back Down
  RepeatedlyDuplicateItems: `${STEAM_CDN_BASE}/42f1bbf2d3be03c7d7195a3280de5c9f7ce8b8bd.jpg`, // ...Maybe One More.
  MaxHealingShrine: `${STEAM_CDN_BASE}/2df4124b539a944517fa00b7402820c7f85b371e.jpg`, // One with the Woods
  FindDevilAltar: `${STEAM_CDN_BASE}/4bfa374ef709d46349233f113eb035bca5527578.jpg`, // Her Concepts
  KillGoldTitanInOneCycle: `${STEAM_CDN_BASE}/45702bf45442c446c5700a78b1e0eab73d532b41.jpg`, // Blackout
  CompleteThreeStagesWithoutHealing: `${STEAM_CDN_BASE}/df2f1a888e9f21cfcfc6dca382019ededb045999.jpg`, // Naturopath
  KillElementalLemurians: `${STEAM_CDN_BASE}/a85359a4138d58422c11263bd183fe682cf55eb1.jpg`, // Death Do Us Part
  AutomationActivation: `${STEAM_CDN_BASE}/36364d0ef7c7a57dcf7a9a8a11a2f6fa0b9de7d8.jpg`, // Automation Activation
  CarryLunarItems: `${STEAM_CDN_BASE}/d339ae1698d03792a214d1b74c9c87ff97aaef03.jpg`, // Moon Worshipper
  FindTimedChest: `${STEAM_CDN_BASE}/3f2fd490ac6a4136f24a83d639971489efab9c1f.jpg`, // [REDACTED]
  HardEliteBossKill: `${STEAM_CDN_BASE}/65a71bd534e75dc533142a25aba47a31cd407fc3.jpg`, // Deicide
  FindUniqueNewtStatues: `${STEAM_CDN_BASE}/be8582b462c397b6712ceb9566d50c2ef54879cb.jpg`, // Newtist
  Complete20Stages: `${STEAM_CDN_BASE}/f782ee5ae0bb74b494a0d12c380f87d189b5ab5b.jpg`, // The Long Road
  CompleteMainEndingHard: `${STEAM_CDN_BASE}/62584fbbec1fd147427e2379db0cab8990cf207a.jpg`, // The Calm
  CompletePrismaticTrial: `${STEAM_CDN_BASE}/6cc40d3a190cbb14ae665b0af8cae1a6d0dc5d5d.jpg`, // Prismatically Aligned
  ChargeTeleporterWhileNearDeath: `${STEAM_CDN_BASE}/0545d79925e4d8f5cc16f01de8d473af6d24ed2e.jpg`, // Glorious Battle
  SuicideHermitCrabs: `${STEAM_CDN_BASE}/14daeac2aac7007d35ed5e1251b422de01df5536.jpg`, // The Demons And The Crabs
  DefeatFalseSon: `${STEAM_CDN_BASE}/8d4b2422cbe444ebeb1f556e9b31a82ff9b50c0d.jpg`, // King of the Hill

  // ============================================
  // SURVIVOR UNLOCKS
  // ============================================
  RepeatFirstTeleporter: `${STEAM_CDN_BASE}/32df421f7ee3e8b6deb1ff809e634c19a969097c.jpg`, // Verified (Huntress)
  CompleteTeleporterWithoutInjury: `${STEAM_CDN_BASE}/8e8b045585d45181db748d7afd76ff975591a0bf.jpg`, // Flawless (MUL-T)
  Complete30StagesCareer: `${STEAM_CDN_BASE}/ac44fb971c0fb5f0c599a8eadca7e2b921d96d67.jpg`, // Engineering Perfection (Engineer)
  CompleteThreeStages: `${STEAM_CDN_BASE}/f69d337d9a4a6ccbefbe3423cf4a041c4c50591a.jpg`, // Warrior (Bandit)
  FreeMage: `${STEAM_CDN_BASE}/75723ecc74d39c43f65a89f41e4af4d581d3b114.jpg`, // Pause. (Artificer)
  CompleteUnknownEnding: `${STEAM_CDN_BASE}/cf3d330460ae75272e4d4a3a2a6781b69feee177.jpg`, // True Respite (Mercenary)
  RescueTreebot: `${STEAM_CDN_BASE}/c1ff4aaf47520fd92a2e3bcbfbc76eeb56edb0e1.jpg`, // Power Plant (REX)
  DefeatSuperRoboBallBoss: `${STEAM_CDN_BASE}/bbe5a56263dc6acac7538f383cd372ffc2541529.jpg`, // Guidance Offline (Loader)
  BeatArena: `${STEAM_CDN_BASE}/6d3e9332cd1574e2ab74dce7305aaca8a86f8e7f.jpg`, // ...To Be Left Alone (Acrid)
  CompleteMainEnding: `${STEAM_CDN_BASE}/beaee2922ea9dfee361c7f2559783be605adf348.jpg`, // Washed Away (Captain)
  CompleteVoidEnding: `${STEAM_CDN_BASE}/e89a8c140644ecf83c9eb95fb9545f94591e7d5d.jpg`, // Dragged Below (Void Fiend)
  ActivateChef: `${STEAM_CDN_BASE}/5d177c7d4fd1ca0edb590e63661ecd58d7ada87a.jpg`, // Order Up! (CHEF)
  UnlockFalseSon: `${STEAM_CDN_BASE}/500a3386b58986d8352d1580bffc2c9370e2b515.jpg`, // Purified Freedom (False Son)
  FreeDrifter: `${STEAM_CDN_BASE}/fa4e66b02e4a5fc34fd3282fb2e6b9727722e2b0.jpg`, // Lost in Transit (Drifter)

  // ============================================
  // COMMANDO SKILLS
  // ============================================
  CommandoKillOverloadingWorm: `${STEAM_CDN_BASE}/0cbbaef83a57a2b0b40848973c70d1407337c18e.jpg`, // Rolling Thunder
  CommandoFastFirstStageClear: `${STEAM_CDN_BASE}/ad8d62adb7786e7e9ec7c797caf3af593386dacd.jpg`, // Godspeed
  CommandoNonLunarEndurance: `${STEAM_CDN_BASE}/0a290e61d496064f1a318467be8b82dc9780efd5.jpg`, // Incorruptible

  // ============================================
  // HUNTRESS SKILLS
  // ============================================
  HuntressAllGlaiveBouncesKill: `${STEAM_CDN_BASE}/557a88f7367b2e7d6ed888480b5c305672a90d55.jpg`, // Finishing Touch
  HuntressCollectCrowbars: `${STEAM_CDN_BASE}/6f4c339f462df9d136dacb43772f8932e1cbd246.jpg`, // One Shot, One Kill
  HuntressMaintainFullHealthOnFrozenWall: `${STEAM_CDN_BASE}/d124457a8c5d041c0582c76c57a156ea6995f460.jpg`, // Piercing Wind

  // ============================================
  // MUL-T SKILLS
  // ============================================
  ToolbotGuardTeleporter: `${STEAM_CDN_BASE}/7810ebc3c11063fb82e6af53a2479f67f701fd65.jpg`, // Pest Control
  ToolbotKillImpBossWithBfg: `${STEAM_CDN_BASE}/f58b6d46a0e1b16e7735abf1eceb27a8e6a51543.jpg`, // Gotcha!
  ToolbotBeatArenaLater: `${STEAM_CDN_BASE}/ab4167264591e737d4aea892eac384ec78c4f6b3.jpg`, // Seventh Day

  // ============================================
  // ENGINEER SKILLS
  // ============================================
  EngiArmy: `${STEAM_CDN_BASE}/c0635b86d62227a3b2852084a91f8a53e2d9a164.jpg`, // Better With Friends
  EngiKillBossQuick: `${STEAM_CDN_BASE}/fd97770e81118b14da52dfb3d183739b7aadba2c.jpg`, // 100% Calculated
  EngiClearTeleporterWithZeroMonsters: `${STEAM_CDN_BASE}/a578239dd27956fbfddf6260cb88f10b98c82058.jpg`, // Zero Sum

  // ============================================
  // ARTIFICER SKILLS
  // ============================================
  MageFastBoss: `${STEAM_CDN_BASE}/7b5f8bcae777f4daff576f1677639ae5c4d21d0a.jpg`, // Chunked!
  MageMultiKill: `${STEAM_CDN_BASE}/20cd457a8c5d041c0582c76c57a156ea6995f460.jpg`, // Massacre
  MageAirborneMultiKill: `${STEAM_CDN_BASE}/8aff5d8b1388bab0dfae930aaf0884f33e0f8f98.jpg`, // Orbital Bombardment

  // ============================================
  // MERCENARY SKILLS
  // ============================================
  MercCompleteTrialWithFullHealth: `${STEAM_CDN_BASE}/2405bf7d200b78e53cf1fb0293ab3fe79142d1a4.jpg`, // Ethereal
  MercXSkillsInYSeconds: `${STEAM_CDN_BASE}/b893da8c761f491cf14dec250ac5b0505dac8779.jpg`, // Flash of Blades
  MercDontTouchGround: `${STEAM_CDN_BASE}/a43df9e030ec1acea9fd48109878f306fc40a67c.jpg`, // Demon of the Skies

  // ============================================
  // REX SKILLS
  // ============================================
  TreebotDunkClayBoss: `${STEAM_CDN_BASE}/bee5085f0864623026428061a048ad5b7dc0f524.jpg`, // Dunked
  TreebotLowHealthTeleporter: `${STEAM_CDN_BASE}/9db6217b5ac6264c82c59205b5a376527fe211b7.jpg`, // Bushwhacked
  TreebotBigHeal: `${STEAM_CDN_BASE}/f64efb0bcab2da1885442e3167b1747b4041591b.jpg`, // Full of Life

  // ============================================
  // LOADER SKILLS
  // ============================================
  LoaderSpeedRun: `${STEAM_CDN_BASE}/39c8e4e936270b27df937411fadd1f28fbb3b09d.jpg`, // Swing By
  LoaderBigSlam: `${STEAM_CDN_BASE}/238fb37aaf1b4ec3ce1440eb57655f0fb63846eb.jpg`, // Earthshatter
  LoaderKillLoaders: `${STEAM_CDN_BASE}/090bce27c4972916f29067b942a43a3c8633ac55.jpg`, // The Thunderdome

  // ============================================
  // ACRID SKILLS
  // ============================================
  CrocoKillWeakEnemiesMilestone: `${STEAM_CDN_BASE}/8e4c06833f22e1a41617d72a360411acd416c5f6.jpg`, // Easy Prey
  CrocoKillScavenger: `${STEAM_CDN_BASE}/80de4cf13d504ea28aad2f226e9a222d73e546b8.jpg`, // Bad Medicine
  CrocoTotalInfectionsMilestone: `${STEAM_CDN_BASE}/22360d4dd318f4915e631291b99fe240a0deb489.jpg`, // Pandemic

  // ============================================
  // CAPTAIN SKILLS
  // ============================================
  CaptainSupplyDropFinale: `${STEAM_CDN_BASE}/5d177c7d4fd1ca0edb590e63661ecd58d7ada87a.jpg`, // Smushed
  CaptainVisitSeveralStages: `${STEAM_CDN_BASE}/426d74811e1d6846e54a5c1adea8cfe5db8928eb.jpg`, // Wanderlust
  CaptainBuyMegaDrone: `${STEAM_CDN_BASE}/e083f291d5677a2426f639d5cec6a8fe0ee9d333.jpg`, // Worth Every Penny

  // ============================================
  // BANDIT SKILLS
  // ============================================
  Bandit2RevolverFinale: `${STEAM_CDN_BASE}/4abd32efd794af0a9e170f499df703f7387670bc.jpg`, // B&E
  Bandit2StackSuperBleed: `${STEAM_CDN_BASE}/090bce27c4972916f29067b942a43a3c8633ac55.jpg`, // Sadist
  Bandit2ConsecutiveReset: `${STEAM_CDN_BASE}/50b7fe1eefa077b5ac5976a3a54eec87134896a0.jpg`, // Classic Man

  // ============================================
  // RAILGUNNER SKILLS (SOTV)
  // ============================================
  RailgunnerConsecutiveWeakPoints: `${STEAM_CDN_BASE}/f77fbc916c1445e1b53c7977b0b5fc29159d9ab2.jpg`, // Marksman
  RailgunnerDealMassiveDamage: `${STEAM_CDN_BASE}/e30215f787585c030edf69ae0e7d8b50d170c070.jpg`, // Annihilator
  RailgunnerAirborneMultiKill: `${STEAM_CDN_BASE}/a952c416618e81fc2d8a360e0fb2d88cabff020e.jpg`, // Trickshot

  // ============================================
  // SEEKER SKILLS (SOTS)
  // ============================================
  SeekerAirMultiHit: `${STEAM_CDN_BASE}/00c4aa0395997c9ba316e63698aa25dbb4e32570.jpg`, // Airborne Souls
  NukeSojourn: `${STEAM_CDN_BASE}/1bb734b98375399d214d452076c43cdfbb6c7659.jpg`, // Scorched Earth
  SeekerPerfect20Meditation: `${STEAM_CDN_BASE}/2e1b720104aa263516904e69da209f78e0138c58.jpg`, // Clear Mind

  // ============================================
  // CHEF SKILLS (SOTS)
  // ============================================
  BurnMithrix: `${STEAM_CDN_BASE}/46f8ea0158dafcbbacfdaf37b6141708a8067530.jpg`, // It's Getting Hot In Here!
  RolyPolyHitFiveAirEnemies: `${STEAM_CDN_BASE}/fa4e66b02e4a5fc34fd3282fb2e6b9727722e2b0.jpg`, // You've Always Been Crazy
  BarbecueQuantityBisonInRun: `${STEAM_CDN_BASE}/28129f2cc820a97fd11c633e5a8e6877aa8084c2.jpg`, // Barbecued Bison Recipe Complete

  // ============================================
  // FALSE SON SKILLS (SOTS)
  // ============================================
  FalseSonLaserMultiKill: `${STEAM_CDN_BASE}/710fcafcbfbd43b22dac755627efb468a7085e6a.jpg`, // Stare Them Down
  FalseSonGrowthChallenge: `${STEAM_CDN_BASE}/682832b2e546d9d570908d7fc0f3ba987e9fa88f.jpg`, // Protein Heavy Diet
  FalseSonKillMithrixWithGoldenGal: `${STEAM_CDN_BASE}/5d8b6afee91d036e3ae6a43b85103abedc4d0a93.jpg`, // Family Bonding

  // ============================================
  // OPERATOR SKILLS (AC)
  // ============================================
  DroneTechUniqueDrones: `${STEAM_CDN_BASE}/ca6dc99884433b83a0a68d294e6c5acfc84477d7.jpg`, // Putting Together a Team
  DroneTechTrickshot: `${STEAM_CDN_BASE}/28129f2cc820a97fd11c633e5a8e6877aa8084c2.jpg`, // That All You Got?
  DroneTechDefeatVultureBossWhileAirborne: `${STEAM_CDN_BASE}/cd1f9ac5776b3164a3efe71dba803024a4a8b331.jpg`, // Not So Different
  DroneTechJuggleLemurian: `${STEAM_CDN_BASE}/5a7335da8ee57fcfe6bac947124731ed0e919d6b.jpg`, // That Just Happened

  // ============================================
  // DRIFTER SKILLS (AC)
  // ============================================
  DrifterJunkCubeAchievement: `${STEAM_CDN_BASE}/00bc7275a778bf43eecda1b24819bbce61dd42d5.jpg`, // Trash Compactor
  DrifterTornadoSlamAchievement: `${STEAM_CDN_BASE}/f275549aba4b2d81c6c895889b1dd307e50a5882.jpg`, // In The Bag
  DrifterTinkerAchievement: `${STEAM_CDN_BASE}/35b614ce55b260b741ce9fd26d12d89e3efee07b.jpg`, // Leave No Trace

  // ============================================
  // MASTERY SKINS (Base Game)
  // ============================================
  CommandoClearGameMonsoon: `${STEAM_CDN_BASE}/4bffe8934ba431589ea5ca69cdfc1755d15b5fb8.jpg`, // Commando: Mastery
  HuntressClearGameMonsoon: `${STEAM_CDN_BASE}/ff2b755b4d65d290e5012322997ab8c1c5ee6025.jpg`, // Huntress: Mastery
  ToolbotClearGameMonsoon: `${STEAM_CDN_BASE}/3db30f9c05d6a9e509358d4677ab81dbfa1fa274.jpg`, // MUL-T: Mastery
  EngiClearGameMonsoon: `${STEAM_CDN_BASE}/744db227744b51b85b4fc55baa4946d8fdbc2c0e.jpg`, // Engineer: Mastery
  MageClearGameMonsoon: `${STEAM_CDN_BASE}/e8d6e3f35e65f87ed6799ce6ba8493a0c6353f80.jpg`, // Artificer: Mastery
  MercClearGameMonsoon: `${STEAM_CDN_BASE}/79cdda4e2fde84f7afae62af77443d0d150298c0.jpg`, // Mercenary: Mastery
  TreebotClearGameMonsoon: `${STEAM_CDN_BASE}/ab4167264591e737d4aea892eac384ec78c4f6b3.jpg`, // REX: Mastery
  LoaderClearGameMonsoon: `${STEAM_CDN_BASE}/e9cc254cdd780180e7e3e6938a48adc1d19f74e4.jpg`, // Loader: Mastery
  CrocoClearGameMonsoon: `${STEAM_CDN_BASE}/4abd32efd794af0a9e170f499df703f7387670bc.jpg`, // Acrid: Mastery
  CaptainClearGameMonsoon: `${STEAM_CDN_BASE}/73f8da70c536dab29a72e57df5dc1e678ff0cc8b.jpg`, // Captain: Mastery
  Bandit2ClearGameMonsoon: `${STEAM_CDN_BASE}/371a585aa3971055b4983f3e7d878ecfd0963dce.jpg`, // Bandit: Mastery

  // ============================================
  // MASTERY SKINS (DLC)
  // ============================================
  RailgunnerClearGameMonsoon: `${STEAM_CDN_BASE}/d9836a468de7ee2229c612764360784efb943b89.jpg`, // Railgunner: Mastery
  VoidSurvivorClearGameMonsoon: `${STEAM_CDN_BASE}/2428e7a16e72c66a6472d09c35b06af4632c0670.jpg`, // Void Fiend: Mastery
  SeekerClearGameMonsoon: `${STEAM_CDN_BASE}/3f2fd490ac6a4136f24a83d639971489efab9c1f.jpg`, // Seeker: Mastery
  ChefClearGameMonsoon: `${STEAM_CDN_BASE}/b24c335622fd2081c6c2b40cd17e2c33b13e21a3.jpg`, // CHEF: Mastery
  FalseSonClearGameMonsoon: `${STEAM_CDN_BASE}/f893340fb7ffd91b6117a89c6c2d36741ea23c81.jpg`, // False Son: Mastery
  DroneTechClearGameMonsoon: `${STEAM_CDN_BASE}/7616d5441c5c1a7ae46b1246547f2ad18669eb7c.jpg`, // Operator: Mastery
  DrifterClearGameMonsoon: `${STEAM_CDN_BASE}/5a7335da8ee57fcfe6bac947124731ed0e919d6b.jpg`, // Drifter: Mastery

  // ============================================
  // PRIME MERIDIAN EVENT SKINS (SOTS)
  // ============================================
  CommandoClearMeridianEvent: `${STEAM_CDN_BASE}/8bdd7f3fc362666e1e77a3372df060a3e3f14498.jpg`, // Commando: Cleared Prime Meridian
  HuntressClearMeridianEvent: `${STEAM_CDN_BASE}/d3e8ed9f3da8d30643ec3613f7e9dd885756cfdd.jpg`, // Huntress: Cleared Prime Meridian
  ToolbotClearMeridianEvent: `${STEAM_CDN_BASE}/8ef664e97a8754810e7af0304cf6f9ed7b5ac603.jpg`, // MUL-T: Cleared Prime Meridian
  EngiClearMeridianEvent: `${STEAM_CDN_BASE}/ec14a34f2499289b7c03eb19af43aa9d37ee58e7.jpg`, // Engineer: Cleared Prime Meridian
  MageClearMeridianEvent: `${STEAM_CDN_BASE}/a6f75a48c8da1950c2fa19db64f4dda99101463f.jpg`, // Artificer: Cleared Prime Meridian
  MercClearMeridianEvent: `${STEAM_CDN_BASE}/887c18928367480e30b721b3582c6a921139a71f.jpg`, // Mercenary: Cleared Prime Meridian
  TreebotClearMeridianEvent: `${STEAM_CDN_BASE}/5a97b1d81860ced75b732b2ad43ade6e9c6f00af.jpg`, // Rex: Cleared Prime Meridian
  LoaderClearMeridianEvent: `${STEAM_CDN_BASE}/48afb36adc34a33c03ba8e50bede2bef474686d4.jpg`, // Loader: Cleared Prime Meridian
  CrocoClearMeridianEvent: `${STEAM_CDN_BASE}/3b84043904da84cbb6051e03f8cb0334ffd76cc6.jpg`, // Acrid: Cleared Prime Meridian
  CaptainClearMeridianEvent: `${STEAM_CDN_BASE}/a6f75a48c8da1950c2fa19db64f4dda99101463f.jpg`, // Captain: Cleared Prime Meridian
  Bandit2ClearMeridianEvent: `${STEAM_CDN_BASE}/49406bbb571dd24f174926863b757c1a47bc6317.jpg`, // Bandit: Cleared Prime Meridian
  RailgunnerClearMeridianEvent: `${STEAM_CDN_BASE}/10ee7f100ffcfc334ec24eaba7d5a0cd29bbe774.jpg`, // Railgunner: Cleared Prime Meridian
  VoidSurvivorClearMeridianEvent: `${STEAM_CDN_BASE}/ca6dc99884433b83a0a68d294e6c5acfc84477d7.jpg`, // Void Fiend: Cleared Prime Meridian

  // ============================================
  // ALLOYED COLLECTIVE SKINS - PURGE (AC)
  // ============================================
  CommandoPurge: `${STEAM_CDN_BASE}/1bb734b98375399d214d452076c43cdfbb6c7659.jpg`, // Commando: Purge
  HuntressPurge: `${STEAM_CDN_BASE}/65e7cdb61a41aba2a6c44d9e125ea935f2a1150f.jpg`, // Huntress: Purge
  ToolbotPurge: `${STEAM_CDN_BASE}/55c323f6c11b17d591469ba979f9ca3cab1d55fd.jpg`, // MUL-T: Purge
  EngiPurge: `${STEAM_CDN_BASE}/cd1f9ac5776b3164a3efe71dba803024a4a8b331.jpg`, // Engineer: Purge
  MercPurge: `${STEAM_CDN_BASE}/00bc7275a778bf43eecda1b24819bbce61dd42d5.jpg`, // Mercenary: Purge
  CrocoPurge: `${STEAM_CDN_BASE}/65e7cdb61a41aba2a6c44d9e125ea935f2a1150f.jpg`, // Acrid: Purge

  // ============================================
  // ALLOYED COLLECTIVE SKINS - ACCEPT AND DECOMPILE (AC)
  // ============================================
  Bandit2Decompile: `${STEAM_CDN_BASE}/00bc7275a778bf43eecda1b24819bbce61dd42d5.jpg`, // Bandit: Accept and Decompile
  MageDecompile: `${STEAM_CDN_BASE}/06cc46f4db2e15ff344afb74cb8cd40d5cf9d201.jpg`, // Artificer: Accept and Decompile
  LoaderDecompile: `${STEAM_CDN_BASE}/d48708af28e6546e8bf0fe3beafbff5668228d65.jpg`, // Loader: Accept and Decompile
  CaptainDecompile: `${STEAM_CDN_BASE}/352793a439cc060d122df78c71652f0b98aa204c.jpg`, // Captain: Accept and Decompile
  TreebotDecompile: `${STEAM_CDN_BASE}/d48708af28e6546e8bf0fe3beafbff5668228d65.jpg`, // Rex: Accept and Decompile

  // ============================================
  // ARTIFACTS (Base Game)
  // ============================================
  ObtainArtifactEliteOnly: `${STEAM_CDN_BASE}/eeb345c941ac01feb967f3af632e35dcfe4dc773.jpg`, // Trial of Honor
  ObtainArtifactCommand: `${STEAM_CDN_BASE}/f88396917d385a425f02dba85f5db462cc53c020.jpg`, // Trial of Command
  ObtainArtifactSacrifice: `${STEAM_CDN_BASE}/7fc7f3c6696790d10c16e540635fdf2ac292fcb6.jpg`, // Trial of Sacrifice
  ObtainArtifactSwarms: `${STEAM_CDN_BASE}/41532d8fb64e707951f5c34f167630b7f7a7a97d.jpg`, // Trial of Swarms
  ObtainArtifactSingleMonsterType: `${STEAM_CDN_BASE}/18f28388bd2132b54967b4c02930699c6438f7a3.jpg`, // Trial of Kin
  ObtainArtifactMixEnemy: `${STEAM_CDN_BASE}/16c4f43ad3cf260239a95f2eca3beb2d486cd76.jpg`, // Trial of Dissonance
  ObtainArtifactGlass: `${STEAM_CDN_BASE}/6613b2b7c7cbc5cd127c6578314e95c188a9de0b.jpg`, // Trial of Glass
  ObtainArtifactShadowClone: `${STEAM_CDN_BASE}/0d7ed2d185c45f5f6fcc3c42dbb875faadac0ed4.jpg`, // Trial of Vengeance
  ObtainArtifactFriendlyFire: `${STEAM_CDN_BASE}/88f5e2c045178c2b2ce37e4d53207627dacb5deb.jpg`, // Trial of Chaos
  ObtainArtifactTeamDeath: `${STEAM_CDN_BASE}/f6ad0935eb2bab721fef80556778b3e4bd549f5a.jpg`, // Trial of Death
  ObtainArtifactEnigma: `${STEAM_CDN_BASE}/6bacc2d61aff797aba5d6ba34f294844b1be72c5.jpg`, // Trial of Enigma
  ObtainArtifactRandomSurvivorOnRespawn: `${STEAM_CDN_BASE}/d87cff37e66fe880e70713d511890c7d84cc2b90.jpg`, // Trial of Metamorphosis
  ObtainArtifactBomb: `${STEAM_CDN_BASE}/5cd9c5940fa89d37f15cb1b8db41936f5fb9aaee.jpg`, // Trial of Spite
  ObtainArtifactWispOnDeath: `${STEAM_CDN_BASE}/73f8da70c536dab29a72e57df5dc1e678ff0cc8b.jpg`, // Trial of Soul
  ObtainArtifactMonsterTeamGainsItems: `${STEAM_CDN_BASE}/92f067f53e4110b3d3e3e9f0f9635cf94ec21445.jpg`, // Trial of Evolution
  ObtainArtifactWeakAssKnees: `${STEAM_CDN_BASE}/66b7a45930baa64a5eda77c20d05ab5f4333090c.jpg`, // Trial of Frailty

  // ============================================
  // ARTIFACTS (DLC)
  // ============================================
  ObtainArtifactRebirth: `${STEAM_CDN_BASE}/e6c2f27279a5cd7f395a5fa8df81c3f34a1cf121.jpg`, // Experienced Rebirth
  ObtainArtifactDevotion: `${STEAM_CDN_BASE}/ec14a34f2499289b7c03eb19af43aa9d37ee58e7.jpg`, // Trial of Devotion
  ObtainArtifactDelusion: `${STEAM_CDN_BASE}/10ee7f100ffcfc334ec24eaba7d5a0cd29bbe774.jpg`, // Trial of Delusion
  ObtainArtifactPrestige: `${STEAM_CDN_BASE}/e693941be8f8c27cc84154ff93f99bbcd9ccac89.jpg`, // Trial of Prestige
};

// Helper function to get image URL for an achievement
export function getAchievementImage(achievementId: string): string | undefined {
  return achievementImages[achievementId];
}

// Default placeholder for missing images
export const DEFAULT_ACHIEVEMENT_IMAGE = `${STEAM_CDN_BASE}/3ebb5f75a716aa6fcab12b7354c3b87e971bcfd5.jpg`;
