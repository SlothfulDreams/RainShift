// Logbook entry image URLs from Risk of Rain 2 wiki
// Images sourced from: https://riskofrain2.wiki.gg

const WIKI_CDN = "https://riskofrain2.wiki.gg/images";

// Monster images
export const monsterImages: Record<string, string> = {
  beetle: `${WIKI_CDN}/Beetle.png`,
  "beetle-guard": `${WIKI_CDN}/Beetle_Guard.png`,
  "beetle-queen": `${WIKI_CDN}/Beetle_Queen.png`,
  bell: `${WIKI_CDN}/Brass_Contraption.png`,
  bison: `${WIKI_CDN}/Bison.png`,
  brother: `${WIKI_CDN}/Mithrix.png`,
  clay: `${WIKI_CDN}/Clay_Dunestrider.png`,
  "clay-boss": `${WIKI_CDN}/Clay_Dunestrider.png`,
  "clay-bruiser": `${WIKI_CDN}/Clay_Templar.png`,
  "electric-worm": `${WIKI_CDN}/Overloading_Worm.png`,
  golem: `${WIKI_CDN}/Stone_Golem.png`,
  gravekeeper: `${WIKI_CDN}/Grovetender.png`,
  "greater-wisp": `${WIKI_CDN}/Greater_Wisp.png`,
  "hermit-crab": `${WIKI_CDN}/Hermit_Crab.png`,
  imp: `${WIKI_CDN}/Imp.png`,
  "imp-boss": `${WIKI_CDN}/Imp_Overlord.png`,
  jellyfish: `${WIKI_CDN}/Jellyfish.png`,
  lemurian: `${WIKI_CDN}/Lemurian.png`,
  "lemurian-bruiser": `${WIKI_CDN}/Elder_Lemurian.png`,
  "lunar-golem": `${WIKI_CDN}/Lunar_Chimera_%28Golem%29.png`,
  "lunar-wisp": `${WIKI_CDN}/Lunar_Chimera_%28Wisp%29.png`,
  "lunar-exploder": `${WIKI_CDN}/Lunar_Chimera_%28Exploder%29.png`,
  "magma-worm": `${WIKI_CDN}/Magma_Worm.png`,
  "mini-mushroom": `${WIKI_CDN}/Mini_Mushrum.png`,
  nullifier: `${WIKI_CDN}/Void_Reaver.png`,
  parent: `${WIKI_CDN}/Parent.png`,
  "roboball-boss": `${WIKI_CDN}/Solus_Control_Unit.png`,
  "roboball-mini": `${WIKI_CDN}/Solus_Probe.png`,
  scav: `${WIKI_CDN}/Scavenger.png`,
  "super-roboball-boss": `${WIKI_CDN}/Alloy_Worship_Unit.png`,
  titan: `${WIKI_CDN}/Stone_Titan.png`,
  "titan-gold": `${WIKI_CDN}/Aurelionite.png`,
  vagrant: `${WIKI_CDN}/Wandering_Vagrant.png`,
  vulture: `${WIKI_CDN}/Alloy_Vulture.png`,
  wisp: `${WIKI_CDN}/Lesser_Wisp.png`,
  grandparent: `${WIKI_CDN}/Grandparent.png`,
  // SOTV monsters
  "flying-vermin": `${WIKI_CDN}/Blind_Pest.png`,
  vermin: `${WIKI_CDN}/Blind_Vermin.png`,
  gup: `${WIKI_CDN}/Gup.png`,
  "void-infestor": `${WIKI_CDN}/Void_Infestor.png`,
  "void-jailer": `${WIKI_CDN}/Void_Jailer.png`,
  "void-barnacle": `${WIKI_CDN}/Void_Barnacle.png`,
  "mega-construct": `${WIKI_CDN}/Alpha_Construct.png`,
  "minor-construct": `${WIKI_CDN}/Minor_Construct.png`,
  "clay-grenadier": `${WIKI_CDN}/Clay_Apothecary.png`,
  "acid-larva": `${WIKI_CDN}/Larva.png`,
  "void-mega-crab": `${WIKI_CDN}/Voidling.png`,
  "mini-void-raid-crab": `${WIKI_CDN}/Void_Devastator.png`,
};

// Environment images
export const environmentImages: Record<string, string> = {
  "env-blackbeach": `${WIKI_CDN}/Distant_Roost.png`,
  "env-golemplains": `${WIKI_CDN}/Titanic_Plains.png`,
  "env-foggyswamp": `${WIKI_CDN}/Wetland_Aspect.png`,
  "env-goolake": `${WIKI_CDN}/Abandoned_Aqueduct.png`,
  "env-frozenwall": `${WIKI_CDN}/Rallypoint_Delta.png`,
  "env-wispgraveyard": `${WIKI_CDN}/Scorched_Acres.png`,
  "env-dampcavesimple": `${WIKI_CDN}/Abyssal_Depths.png`,
  "env-shipgraveyard": `${WIKI_CDN}/Siren%27s_Call.png`,
  "env-skymeadow": `${WIKI_CDN}/Sky_Meadow.png`,
  "env-arena": `${WIKI_CDN}/Void_Fields.png`,
  "env-artifactworld": `${WIKI_CDN}/Bulwark%27s_Ambry.png`,
  "env-bazaar": `${WIKI_CDN}/Bazaar_Between_Time.png`,
  "env-goldshores": `${WIKI_CDN}/Gilded_Coast.png`,
  "env-limbo": `${WIKI_CDN}/A_Moment%2C_Fractured.png`,
  "env-mysteryspace": `${WIKI_CDN}/A_Moment%2C_Whole.png`,
  "env-moon": `${WIKI_CDN}/Commencement.png`,
  "env-rootjungle": `${WIKI_CDN}/Sundered_Grove.png`,
  // SOTV environments
  "env-moon2": `${WIKI_CDN}/Commencement.png`,
  "env-ancientloft": `${WIKI_CDN}/Aphelian_Sanctuary.png`,
  "env-snowyforest": `${WIKI_CDN}/Siphoned_Forest.png`,
  "env-sulfurpools": `${WIKI_CDN}/Sulfur_Pools.png`,
  "env-voidstage": `${WIKI_CDN}/Void_Locus.png`,
  "env-voidraid": `${WIKI_CDN}/The_Planetarium.png`,
  // SOTS environments
  "env-village": `${WIKI_CDN}/Shattered_Abodes.png`,
  "env-villagenight": `${WIKI_CDN}/Disturbed_Impact.png`,
  "env-lemuriantemple": `${WIKI_CDN}/Reformed_Altar.png`,
  "env-habitat": `${WIKI_CDN}/Treeborn_Colony.png`,
  "env-habitatfall": `${WIKI_CDN}/Golden_Dieback.png`,
  "env-meridian": `${WIKI_CDN}/Prime_Meridian.png`,
  "env-helminthroost": `${WIKI_CDN}/Helminth_Hatchery.png`,
};

// Survivor images
export const survivorImages: Record<string, string> = {
  "survivor-commando": `${WIKI_CDN}/Commando.png`,
  "survivor-huntress": `${WIKI_CDN}/Huntress.png`,
  "survivor-bandit": `${WIKI_CDN}/Bandit.png`,
  "survivor-mult": `${WIKI_CDN}/MUL-T.png`,
  "survivor-engineer": `${WIKI_CDN}/Engineer.png`,
  "survivor-artificer": `${WIKI_CDN}/Artificer.png`,
  "survivor-mercenary": `${WIKI_CDN}/Mercenary.png`,
  "survivor-rex": `${WIKI_CDN}/REX.png`,
  "survivor-loader": `${WIKI_CDN}/Loader.png`,
  "survivor-acrid": `${WIKI_CDN}/Acrid.png`,
  "survivor-captain": `${WIKI_CDN}/Captain.png`,
  "survivor-heretic": `${WIKI_CDN}/Heretic.png`,
  // SOTV survivors
  "survivor-railgunner": `${WIKI_CDN}/Railgunner.png`,
  "survivor-voidfiend": `${WIKI_CDN}/Void_Fiend.png`,
  // SOTS survivors
  "survivor-seeker": `${WIKI_CDN}/Seeker.png`,
  "survivor-falseson": `${WIKI_CDN}/False_Son.png`,
  "survivor-chef": `${WIKI_CDN}/CHEF.png`,
};

// Item images
export const itemImages: Record<string, string> = {
  // Common items
  "item-syringe": `${WIKI_CDN}/Soldier%27s_Syringe.png`,
  "item-hoof": `${WIKI_CDN}/Paul%27s_Goat_Hoof.png`,
  "item-critglasses": `${WIKI_CDN}/Lens-Maker%27s_Glasses.png`,
  "item-bear": `${WIKI_CDN}/Tougher_Times.png`,
  "item-crowbar": `${WIKI_CDN}/Crowbar.png`,
  "item-stickybomb": `${WIKI_CDN}/Sticky_Bomb.png`,
  "item-bleedonhit": `${WIKI_CDN}/Tri-Tip_Dagger.png`,
  "item-armorplate": `${WIKI_CDN}/Repulsion_Armor_Plate.png`,
  "item-medkit": `${WIKI_CDN}/Medkit.png`,
  "item-mushroom": `${WIKI_CDN}/Bustling_Fungus.png`,
  "item-firework": `${WIKI_CDN}/Bundle_of_Fireworks.png`,
  "item-personalshield": `${WIKI_CDN}/Personal_Shield_Generator.png`,
  "item-feather": `${WIKI_CDN}/Hopoo_Feather.png`,
  "item-tooth": `${WIKI_CDN}/Monster_Tooth.png`,
  "item-nearbydamagebonus": `${WIKI_CDN}/Focus_Crystal.png`,
  "item-stunoncrit": `${WIKI_CDN}/Stun_Grenade.png`,
  "item-warcryonmultikill": `${WIKI_CDN}/Berserker%27s_Pauldron.png`,
  "item-gasoline": `${WIKI_CDN}/Gasoline.png`,
  "item-bandolier": `${WIKI_CDN}/Bandolier.png`,
  "item-slowonhit": `${WIKI_CDN}/Chronobauble.png`,
  "item-flathealth": `${WIKI_CDN}/Bison_Steak.png`,
  "item-healingpotion": `${WIKI_CDN}/Power_Elixir.png`,
  "item-outofcombatarmor": `${WIKI_CDN}/Oddly-shaped_Opal.png`,
  "item-sprintbonus": `${WIKI_CDN}/Energy_Drink.png`,
  "item-secondaryskillmag": `${WIKI_CDN}/Backup_Magazine.png`,
  // Uncommon items
  "item-attackspeedoncrit": `${WIKI_CDN}/Predatory_Instincts.png`,
  "item-seed": `${WIKI_CDN}/Leeching_Seed.png`,
  "item-thorns": `${WIKI_CDN}/Razorwire.png`,
  "item-dagger": `${WIKI_CDN}/Ceremonial_Dagger.png`,
  "item-missile": `${WIKI_CDN}/AtG_Missile_Mk._1.png`,
  "item-chainlightning": `${WIKI_CDN}/Ukulele.png`,
  "item-infusion": `${WIKI_CDN}/Infusion.png`,
  "item-equipmentmag": `${WIKI_CDN}/Fuel_Cell.png`,
  "item-icering": `${WIKI_CDN}/Runald%27s_Band.png`,
  "item-firering": `${WIKI_CDN}/Kjaro%27s_Band.png`,
  "item-squid": `${WIKI_CDN}/Squid_Polyp.png`,
  "item-deathmark": `${WIKI_CDN}/Death_Mark.png`,
  "item-phasing": `${WIKI_CDN}/Old_War_Stealthkit.png`,
  "item-behemoth": `${WIKI_CDN}/Brilliant_Behemoth.png`,
  "item-healoncrit": `${WIKI_CDN}/Harvester%27s_Scythe.png`,
  "item-jumpboost": `${WIKI_CDN}/Wax_Quail.png`,
  "item-explodeondeath": `${WIKI_CDN}/Will-o%27-the-wisp.png`,
  "item-barrieronkill": `${WIKI_CDN}/Topaz_Brooch.png`,
  "item-bonusgoldonkill": `${WIKI_CDN}/Ghor%27s_Tome.png`,
  "item-wardlevel": `${WIKI_CDN}/Warped_Echo.png`,
  "item-regenonkill": `${WIKI_CDN}/Fresh_Meat.png`,
  "item-increasehealing": `${WIKI_CDN}/Rejuvenation_Rack.png`,
  // Legendary items
  "item-clover": `${WIKI_CDN}/57_Leaf_Clover.png`,
  "item-extralife": `${WIKI_CDN}/Dio%27s_Best_Friend.png`,
  "item-headhunter": `${WIKI_CDN}/Wake_of_Vultures.png`,
  "item-novaonheal": `${WIKI_CDN}/N%27kuhana%27s_Opinion.png`,
  "item-alienhear": `${WIKI_CDN}/Alien_Head.png`,
  "item-icicle": `${WIKI_CDN}/Frost_Relic.png`,
  "item-laserturbine": `${WIKI_CDN}/Resonance_Disc.png`,
  "item-ghostonkill": `${WIKI_CDN}/Happiest_Mask.png`,
  "item-plant": `${WIKI_CDN}/Interstellar_Desk_Plant.png`,
  "item-fallboots": `${WIKI_CDN}/H3AD-5T_v2.png`,
  "item-talisman": `${WIKI_CDN}/Soulbound_Catalyst.png`,
  // Boss items
  "item-knurl": `${WIKI_CDN}/Titanic_Knurl.png`,
  "item-beetlegland": `${WIKI_CDN}/Queen%27s_Gland.png`,
  "item-shinyPearl": `${WIKI_CDN}/Irradiant_Pearl.png`,
  "item-pearl": `${WIKI_CDN}/Pearl.png`,
  // Lunar items
  "item-lunardagger": `${WIKI_CDN}/Shaped_Glass.png`,
  "item-shieldonly": `${WIKI_CDN}/Transcendence.png`,
  "item-focusconvergence": `${WIKI_CDN}/Focused_Convergence.png`,
  "item-autocastequipment": `${WIKI_CDN}/Gesture_of_the_Drowned.png`,
  "item-repeatHeal": `${WIKI_CDN}/Corpsebloom.png`,
  // Void items
  "item-critglasses-void": `${WIKI_CDN}/Lost_Seer%27s_Lenses.png`,
  "item-bear-void": `${WIKI_CDN}/Safer_Spaces.png`,
  "item-clover-void": `${WIKI_CDN}/Benthic_Bloom.png`,
  "item-extralife-void": `${WIKI_CDN}/Pluripotent_Larva.png`,
  "item-mushroom-void": `${WIKI_CDN}/Weeping_Fungus.png`,
  "item-bleedonhit-void": `${WIKI_CDN}/Needletick.png`,
  "item-missile-void": `${WIKI_CDN}/Plasma_Shrimp.png`,
};

// Equipment images
export const equipmentImages: Record<string, string> = {
  "equip-dronebackup": `${WIKI_CDN}/The_Back-up.png`,
  "equip-bfg": `${WIKI_CDN}/Preon_Accumulator.png`,
  "equip-blackhole": `${WIKI_CDN}/Primordial_Cube.png`,
  "equip-cleanse": `${WIKI_CDN}/Blast_Shower.png`,
  "equip-commandmissile": `${WIKI_CDN}/Disposable_Missile_Launcher.png`,
  "equip-critonuse": `${WIKI_CDN}/Ocular_HUD.png`,
  "equip-fruit": `${WIKI_CDN}/Foreign_Fruit.png`,
  "equip-gainarmor": `${WIKI_CDN}/Jade_Elephant.png`,
  "equip-gateway": `${WIKI_CDN}/Eccentric_Vase.png`,
  "equip-goldgat": `${WIKI_CDN}/The_Crowdfunder.png`,
  "equip-jetpack": `${WIKI_CDN}/Milky_Chrysalis.png`,
  "equip-lifesteal": `${WIKI_CDN}/Super_Massive_Leech.png`,
  "equip-lightning": `${WIKI_CDN}/Royal_Capacitor.png`,
  "equip-meteor": `${WIKI_CDN}/Glowing_Meteorite.png`,
  "equip-passivehealing": `${WIKI_CDN}/Gnarled_Woodsprite.png`,
  "equip-recycle": `${WIKI_CDN}/Recycler.png`,
  "equip-saw": `${WIKI_CDN}/Sawmerang.png`,
  "equip-scanner": `${WIKI_CDN}/Radar_Scanner.png`,
  "equip-teamwarcry": `${WIKI_CDN}/Gorag%27s_Opus.png`,
  "equip-tonic": `${WIKI_CDN}/Spinel_Tonic.png`,
  "equip-bosshunter": `${WIKI_CDN}/Trophy_Hunter%27s_Tricorn.png`,
  "equip-gummyclone": `${WIKI_CDN}/Goobo_Jr..png`,
  "equip-molotov": `${WIKI_CDN}/Molotov_%286-Pack%29.png`,
  "equip-multishopcard": `${WIKI_CDN}/Executive_Card.png`,
  "equip-vendingmachine": `${WIKI_CDN}/Remote_Caffeinator.png`,
};

// Combined lookup function
export function getLogbookImage(entryId: string): string | undefined {
  return (
    monsterImages[entryId] ||
    environmentImages[entryId] ||
    survivorImages[entryId] ||
    itemImages[entryId] ||
    equipmentImages[entryId]
  );
}

// All images combined for convenience
export const logbookImages: Record<string, string> = {
  ...monsterImages,
  ...environmentImages,
  ...survivorImages,
  ...itemImages,
  ...equipmentImages,
};
