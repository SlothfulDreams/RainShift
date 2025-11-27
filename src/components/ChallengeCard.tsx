"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import Image from "next/image";
import {
  DEFAULT_ACHIEVEMENT_IMAGE,
  getAchievementImage,
} from "@/data/achievement-images";
import type { Challenge } from "@/data/types";

interface ChallengeCardProps {
  challenge: Challenge;
  isUnlocked: boolean;
  onToggle: (achievementId: string, enabled: boolean) => void;
}

export function ChallengeCard({
  challenge,
  isUnlocked,
  onToggle,
}: ChallengeCardProps) {
  const handleToggle = () => {
    onToggle(challenge.achievement, !isUnlocked);
  };

  const imageUrl =
    getAchievementImage(challenge.achievement) || DEFAULT_ACHIEVEMENT_IMAGE;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleToggle}
      className={`
        relative cursor-pointer rounded-sm overflow-hidden transition-all duration-300 h-full flex flex-col
        ${
          isUnlocked
            ? "bg-neon-green/5 border border-neon-green/30 shadow-[0_0_20px_rgba(0,255,136,0.1)]"
            : "holo-card border border-border hover:border-neon-cyan/30"
        }
      `}
    >
      {/* Top accent line */}
      <div
        className={`
        absolute top-0 left-0 right-0 h-[2px]
        ${
          isUnlocked
            ? "bg-gradient-to-r from-transparent via-neon-green to-transparent"
            : "bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
        }
      `}
      />

      <div className="p-4 flex flex-col flex-1">
        {/* Header row with image */}
        <div className="flex items-start gap-3 mb-3">
          {/* Achievement image */}
          <div
            className={`
            relative w-12 h-12 rounded-sm overflow-hidden flex-shrink-0
            border transition-all duration-300
            ${
              isUnlocked
                ? "border-neon-green/50 shadow-[0_0_10px_rgba(0,255,136,0.3)]"
                : "border-border grayscale opacity-70"
            }
          `}
          >
            <Image
              src={imageUrl}
              alt={challenge.name}
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
            />
            {/* Locked overlay */}
            {!isUnlocked && (
              <div className="absolute inset-0 bg-void/40 flex items-center justify-center">
                <Lock size={16} className="text-text-muted/60" />
              </div>
            )}
          </div>

          {/* Title and status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`
                font-display text-sm tracking-wide line-clamp-2
                ${isUnlocked ? "text-neon-green" : "text-text-bright"}
              `}
              >
                {challenge.name}
              </h4>

              {/* Status indicator */}
              <div
                className={`
                w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0
                ${
                  isUnlocked
                    ? "bg-neon-green/20 border border-neon-green/50"
                    : "bg-void-light border border-border"
                }
              `}
              >
                {isUnlocked ? (
                  <Check size={12} className="text-neon-green" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-text-muted/30" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-2 flex-shrink-0">
          {challenge.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {/* Category tag */}
          <span
            className={`
            px-2 py-0.5 text-[9px] tracking-wider uppercase
            ${getCategoryStyle(challenge.category)}
          `}
          >
            {challenge.category}
          </span>

          {/* DLC tag */}
          {challenge.dlc !== "base" && (
            <span
              className={`
              px-2 py-0.5 text-[9px] tracking-wider
              ${getDLCStyle(challenge.dlc)}
            `}
            >
              {getDLCShortName(challenge.dlc)}
            </span>
          )}

          {/* Survivor tag */}
          {challenge.survivor && (
            <span className="px-2 py-0.5 text-[9px] tracking-wider bg-void-light border border-border text-text-muted">
              {challenge.survivor.toUpperCase()}
            </span>
          )}

          {/* Rarity tag */}
          {challenge.rarity && (
            <span
              className={`
              px-2 py-0.5 text-[9px] tracking-wider uppercase
              ${getRarityStyle(challenge.rarity)}
            `}
            >
              {challenge.rarity}
            </span>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      {!isUnlocked && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/5 to-transparent" />
        </div>
      )}
    </motion.div>
  );
}

function getCategoryStyle(category: string): string {
  const styles: Record<string, string> = {
    survivors: "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan",
    skills: "bg-neon-orange/10 border border-neon-orange/30 text-neon-orange",
    skins: "bg-neon-purple/10 border border-neon-purple/30 text-neon-purple",
    items: "bg-neon-gold/10 border border-neon-gold/30 text-neon-gold",
    artifacts: "bg-neon-red/10 border border-neon-red/30 text-neon-red",
    misc: "bg-surface border border-border text-text-secondary",
  };
  return styles[category] || styles.misc;
}

function getDLCStyle(dlc: string): string {
  const styles: Record<string, string> = {
    sotv: "bg-neon-purple/10 border border-neon-purple/30 text-neon-purple",
    sots: "bg-neon-orange/10 border border-neon-orange/30 text-neon-orange",
    ac: "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan",
  };
  return styles[dlc] || "";
}

function getDLCShortName(dlc: string): string {
  const names: Record<string, string> = {
    sotv: "VOID",
    sots: "STORM",
    ac: "ALLOYED",
  };
  return names[dlc] || dlc.toUpperCase();
}

function getRarityStyle(rarity: string): string {
  const styles: Record<string, string> = {
    common: "bg-[#9d9d9d]/10 border border-[#9d9d9d]/30 text-[#9d9d9d]",
    uncommon: "bg-[#5cb85c]/10 border border-[#5cb85c]/30 text-[#5cb85c]",
    legendary: "bg-[#e34234]/10 border border-[#e34234]/30 text-[#e34234]",
    boss: "bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37]",
    lunar: "bg-[#3498db]/10 border border-[#3498db]/30 text-[#3498db]",
    void: "bg-neon-purple/10 border border-neon-purple/30 text-neon-purple",
    equipment:
      "bg-neon-orange/10 border border-neon-orange/30 text-neon-orange",
  };
  return styles[rarity] || "";
}
