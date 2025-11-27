"use client";

import { motion } from "framer-motion";
import { Download, Lock, RotateCcw, Search, Unlock, X } from "lucide-react";
import { useCallback, useState } from "react";
import { challenges } from "@/data/challenges";
import type {
  ChallengeCategory,
  DLC,
  RawUserProfile,
  SaveData,
} from "@/data/types";
import { CATEGORY_NAMES, DLC_NAMES } from "@/data/types";
import {
  calculateSaveStats,
  generateModifiedXml,
  lockAll,
  toggleAchievement,
  unlockAll,
  updateCoins,
} from "@/lib/save-operations";
import { downloadFile } from "@/lib/utils";
import { ChallengeCard } from "./ChallengeCard";
import { CoinsEditor } from "./CoinsEditor";

interface SaveEditorProps {
  initialSaveData: SaveData;
  rawProfile: RawUserProfile;
  fileName: string;
  onReset: () => void;
}

const categories: (ChallengeCategory | "all")[] = [
  "all",
  "survivors",
  "skills",
  "skins",
  "items",
  "artifacts",
  "misc",
];

const dlcs: (DLC | "all")[] = ["all", "base", "sotv", "sots", "ac"];

export function SaveEditor({
  initialSaveData,
  rawProfile,
  fileName,
  onReset,
}: SaveEditorProps) {
  const [saveData, setSaveData] = useState<SaveData>(initialSaveData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ChallengeCategory | "all"
  >("all");
  const [selectedDLC, setSelectedDLC] = useState<DLC | "all">("all");
  const [hasChanges, setHasChanges] = useState(false);

  const stats = calculateSaveStats(saveData);

  // Filter challenges
  const filteredChallenges = challenges.filter((c) => {
    if (selectedCategory !== "all" && c.category !== selectedCategory)
      return false;
    if (selectedDLC !== "all" && c.dlc !== selectedDLC) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.survivor?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unlockedInView = filteredChallenges.filter((c) =>
    saveData.achievements.includes(c.achievement),
  ).length;

  const handleCoinsChange = useCallback((coins: number) => {
    setSaveData((prev) => updateCoins(prev, coins));
    setHasChanges(true);
  }, []);

  const handleToggleAchievement = useCallback(
    (achievementId: string, enabled: boolean) => {
      setSaveData((prev) => toggleAchievement(prev, achievementId, enabled));
      setHasChanges(true);
    },
    [],
  );

  const handleUnlockAll = useCallback(() => {
    setSaveData((prev) => unlockAll(prev));
    setHasChanges(true);
  }, []);

  const handleLockAll = useCallback(() => {
    setSaveData((prev) => lockAll(prev));
    setHasChanges(true);
  }, []);

  const handleExport = useCallback(() => {
    const modifiedXml = generateModifiedXml(rawProfile, saveData);
    const exportFileName = fileName.replace(".xml", "_modified.xml");
    downloadFile(modifiedXml, exportFileName, "text/xml");
  }, [rawProfile, saveData, fileName]);

  return (
    <div className="min-h-screen grid-bg">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-border bg-void/90 backdrop-blur-md"
      >
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and file info - clickable to return home */}
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                  <HeaderLogo />
                </div>
                <div className="text-left">
                  <h1 className="font-display text-text-bright tracking-wider text-sm group-hover:text-neon-cyan transition-colors">
                    RAINSHIFT
                  </h1>
                  <p className="text-text-muted text-xs">
                    {saveData.name} <span className="text-neon-cyan">•</span>{" "}
                    {fileName}
                  </p>
                </div>
              </div>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 text-xs tracking-wider border border-border text-text-secondary hover:border-neon-cyan/50 hover:text-neon-cyan transition-all"
              >
                <RotateCcw size={14} className="inline mr-2" />
                NEW FILE
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={!hasChanges}
                className={`
                  px-4 py-2 text-xs tracking-wider font-display transition-all
                  ${
                    hasChanges
                      ? "bg-neon-cyan text-void hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-surface text-text-muted cursor-not-allowed"
                  }
                `}
              >
                <Download size={14} className="inline mr-2" />
                EXPORT
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Stats & Controls */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-4 min-w-0"
          >
            {/* Stats Panel */}
            <div className="holo-card p-5 rounded-sm">
              <h2 className="font-display text-xs tracking-widest text-neon-cyan mb-4">
                {"STATISTICS"}
              </h2>

              <div className="space-y-3">
                <StatBar
                  label="ACHIEVEMENTS"
                  value={stats.unlockedAchievements}
                  max={stats.totalAchievements}
                  color="cyan"
                />
                <StatRow
                  label="SURVIVORS"
                  value={stats.unlockedSurvivors}
                  color="cyan"
                />
                <StatRow
                  label="SKILLS"
                  value={stats.unlockedSkills}
                  color="orange"
                />
                <StatRow
                  label="SKINS"
                  value={stats.unlockedSkins}
                  color="purple"
                />
                <StatRow
                  label="ITEMS"
                  value={stats.unlockedItems}
                  color="green"
                />
                <StatRow
                  label="ARTIFACTS"
                  value={stats.unlockedArtifacts}
                  color="red"
                />
              </div>
            </div>

            {/* Lunar Coins */}
            <CoinsEditor coins={saveData.coins} onChange={handleCoinsChange} />

            {/* Bulk Actions */}
            <div className="holo-card p-5 rounded-sm">
              <h2 className="font-display text-xs tracking-widest text-neon-cyan mb-4">
                {"BULK ACTIONS"}
              </h2>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleUnlockAll}
                  className="w-full px-4 py-3 text-xs tracking-wider font-display bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)] transition-all flex items-center justify-center gap-2"
                >
                  <Unlock size={14} />
                  UNLOCK ALL
                </button>

                <button
                  type="button"
                  onClick={handleLockAll}
                  className="w-full px-4 py-3 text-xs tracking-wider font-display bg-neon-red/10 border border-neon-red/30 text-neon-red hover:bg-neon-red/20 hover:shadow-[0_0_15px_rgba(255,51,102,0.2)] transition-all flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  LOCK ALL
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main content - Challenge List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-4 min-w-0"
          >
            {/* Filters */}
            <div className="holo-card p-5 rounded-sm">
              {/* Search */}
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges..."
                  className="w-full pl-10 pr-10 py-3 bg-void-light border border-border rounded-sm text-sm placeholder-text-muted focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-neon-cyan"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category tabs */}
              <div className="mb-4">
                <p className="text-text-muted text-[10px] tracking-widest mb-2">
                  CATEGORY
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                        px-3 py-1.5 text-[10px] tracking-wider font-display transition-all
                        ${
                          selectedCategory === cat
                            ? "bg-neon-cyan text-void"
                            : "border border-border text-text-secondary hover:border-neon-cyan/50 hover:text-neon-cyan"
                        }
                      `}
                    >
                      {cat === "all"
                        ? "ALL"
                        : CATEGORY_NAMES[cat].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* DLC filter */}
              <div>
                <p className="text-text-muted text-[10px] tracking-widest mb-2">
                  EXPANSION
                </p>
                <div className="flex flex-wrap gap-2">
                  {dlcs.map((dlc) => (
                    <button
                      type="button"
                      key={dlc}
                      onClick={() => setSelectedDLC(dlc)}
                      className={`
                        px-3 py-1.5 text-[10px] tracking-wider transition-all
                        ${
                          selectedDLC === dlc
                            ? getDLCActiveStyle(dlc)
                            : "border border-border text-text-secondary hover:border-neon-cyan/50"
                        }
                      `}
                    >
                      {dlc === "all" ? "ALL" : DLC_NAMES[dlc].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted tracking-wider">
                SHOWING{" "}
                <span className="text-neon-cyan">
                  {filteredChallenges.length}
                </span>{" "}
                CHALLENGES
              </span>
              <span className="text-text-muted tracking-wider">
                <span className="text-neon-green">{unlockedInView}</span> /{" "}
                {filteredChallenges.length} UNLOCKED
              </span>
            </div>

            {/* Challenge grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                >
                  <ChallengeCard
                    challenge={challenge}
                    isUnlocked={saveData.achievements.includes(
                      challenge.achievement,
                    )}
                    onToggle={handleToggleAchievement}
                  />
                </motion.div>
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-muted tracking-wider">
                  NO CHALLENGES FOUND
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;
  const colorClasses: Record<string, string> = {
    cyan: "bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]",
    orange: "bg-neon-orange shadow-[0_0_10px_rgba(255,106,0,0.5)]",
    purple: "bg-neon-purple shadow-[0_0_10px_rgba(191,95,255,0.5)]",
  };

  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-text-muted tracking-wider">{label}</span>
        <span className="text-text-primary">
          <span className="text-neon-cyan">{value}</span>
          <span className="text-text-muted"> / {max}</span>
        </span>
      </div>
      <div className="h-1 bg-void-light rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClasses[color] || colorClasses.cyan}`}
        />
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "text-neon-cyan",
    orange: "text-neon-orange",
    purple: "text-neon-purple",
    green: "text-neon-green",
    red: "text-neon-red",
  };

  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-muted tracking-wider">{label}</span>
      <span className={colorClasses[color] || "text-text-primary"}>
        {value}
      </span>
    </div>
  );
}

function getDLCActiveStyle(dlc: DLC | "all"): string {
  switch (dlc) {
    case "sotv":
      return "bg-neon-purple text-void";
    case "sots":
      return "bg-neon-orange text-void";
    case "ac":
      return "bg-neon-cyan text-void";
    default:
      return "bg-text-secondary text-void";
  }
}

// Small header logo - static raindrop with circuit pattern
function HeaderLogo() {
  const color = "#00f0ff";

  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
      role="img"
      aria-label="Rainshift logo"
    >
      <defs>
        <linearGradient
          id="headerDropGradient"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="50%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Glow layer */}
      <path
        d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeOpacity="0.2"
        style={{ filter: "blur(2px)" }}
      />

      {/* Main raindrop */}
      <path
        d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z"
        fill="url(#headerDropGradient)"
        stroke={color}
        strokeWidth="2"
      />

      {/* Central hexagon */}
      <g transform="translate(50, 82)">
        <polygon
          points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <polygon
          points="0,-6 5,-3 5,3 0,6 -5,3 -5,-3"
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.8"
        />
        <circle cx="0" cy="0" r="2" fill={color} />
      </g>

      {/* Circuit traces */}
      <g
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeLinecap="round"
      >
        <path d="M50 70 L50 50" />
        <path d="M50 50 L40 62" />
        <path d="M50 50 L60 62" />
        <path d="M40 82 L32 82" />
        <path d="M60 82 L68 82" />
        <path d="M50 94 L50 108" />
      </g>

      {/* Nodes */}
      <g fill={color}>
        <circle cx="50" cy="50" r="2" fillOpacity="0.8" />
        <circle cx="40" cy="62" r="1.5" fillOpacity="0.6" />
        <circle cx="60" cy="62" r="1.5" fillOpacity="0.6" />
        <circle cx="32" cy="82" r="1.5" fillOpacity="0.5" />
        <circle cx="68" cy="82" r="1.5" fillOpacity="0.5" />
        <circle cx="50" cy="108" r="2" fillOpacity="0.6" />
      </g>

      {/* Top highlight arc */}
      <path
        d="M35 45 Q50 30 65 45"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
      />
    </svg>
  );
}
