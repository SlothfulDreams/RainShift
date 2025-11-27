"use client";

import { motion } from "framer-motion";
import {
  Gem,
  LayoutGrid,
  Package,
  Palette,
  Star,
  Users,
  Zap,
} from "lucide-react";
import type { ChallengeCategory, DLC } from "@/data/types";
import { CATEGORY_NAMES, DLC_NAMES } from "@/data/types";

interface CategoryTabsProps {
  selectedCategory: ChallengeCategory | "all";
  onCategoryChange: (category: ChallengeCategory | "all") => void;
  selectedDLC: DLC | "all";
  onDLCChange: (dlc: DLC | "all") => void;
}

const categoryIcons: Record<ChallengeCategory | "all", React.ReactNode> = {
  all: <LayoutGrid size={18} />,
  survivors: <Users size={18} />,
  skills: <Zap size={18} />,
  skins: <Palette size={18} />,
  items: <Package size={18} />,
  artifacts: <Gem size={18} />,
  misc: <Star size={18} />,
};

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

export function CategoryTabs({
  selectedCategory,
  onCategoryChange,
  selectedDLC,
  onDLCChange,
}: CategoryTabsProps) {
  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div>
        <span className="block text-sm font-medium text-text-secondary mb-2">
          Category
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                relative px-3 py-2 rounded-lg
                flex items-center gap-2
                text-sm font-medium
                transition-colors duration-200
                ${
                  selectedCategory === category
                    ? "text-primary bg-primary/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }
              `}
            >
              {selectedCategory === category && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-0 border border-primary/50 rounded-lg"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
              <span className="relative z-10">{categoryIcons[category]}</span>
              <span className="relative z-10">
                {category === "all" ? "All" : CATEGORY_NAMES[category]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DLC filter */}
      <div>
        <span className="block text-sm font-medium text-text-secondary mb-2">
          DLC
        </span>
        <div className="flex flex-wrap gap-2">
          {dlcs.map((dlc) => (
            <button
              type="button"
              key={dlc}
              onClick={() => onDLCChange(dlc)}
              className={`
                relative px-3 py-1.5 rounded-full
                text-xs font-medium
                border transition-all duration-200
                ${
                  selectedDLC === dlc
                    ? getDLCSelectedStyle(dlc)
                    : "text-text-secondary border-border hover:border-border-hover"
                }
              `}
            >
              {dlc === "all" ? "All DLCs" : DLC_NAMES[dlc]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDLCSelectedStyle(dlc: DLC | "all"): string {
  switch (dlc) {
    case "base":
      return "text-text-primary bg-surface-active border-border-hover";
    case "sotv":
      return "text-[#9b59b6] bg-[#9b59b6]/10 border-[#9b59b6]/50";
    case "sots":
      return "text-secondary bg-secondary/10 border-secondary/50";
    case "ac":
      return "text-primary bg-primary/10 border-primary/50";
    default:
      return "text-primary bg-primary/10 border-primary/50";
  }
}
