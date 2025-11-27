"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { useMemo } from "react";
import { challenges } from "@/data/challenges";
import type { ChallengeCategory, DLC, SaveData } from "@/data/types";
import { ChallengeCard } from "./ChallengeCard";

interface ChallengeListProps {
  saveData: SaveData;
  searchQuery: string;
  selectedCategory: ChallengeCategory | "all";
  selectedDLC: DLC | "all";
  onToggleAchievement: (achievementId: string, enabled: boolean) => void;
}

export function ChallengeList({
  saveData,
  searchQuery,
  selectedCategory,
  selectedDLC,
  onToggleAchievement,
}: ChallengeListProps) {
  // Filter challenges based on search, category, and DLC
  const filteredChallenges = useMemo(() => {
    let result = challenges;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Filter by DLC
    if (selectedDLC !== "all") {
      result = result.filter((c) => c.dlc === selectedDLC);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.achievement.toLowerCase().includes(query) ||
          c.survivor?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [searchQuery, selectedCategory, selectedDLC]);

  // Check if achievement is unlocked
  const isUnlocked = (achievement: string) =>
    saveData.achievements.includes(achievement);

  // Count unlocked in filtered list
  const unlockedCount = filteredChallenges.filter((c) =>
    isUnlocked(c.achievement),
  ).length;

  return (
    <div>
      {/* Stats header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary">
          Showing {filteredChallenges.length} challenges
        </p>
        <p className="text-sm">
          <span className="text-success font-medium">{unlockedCount}</span>
          <span className="text-text-muted">
            {" "}
            / {filteredChallenges.length} unlocked
          </span>
        </p>
      </div>

      {/* Challenge grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isUnlocked={isUnlocked(challenge.achievement)}
                onToggle={onToggleAchievement}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <PackageOpen size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary">No challenges found</p>
          <p className="text-sm text-text-muted mt-1">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}
    </div>
  );
}
