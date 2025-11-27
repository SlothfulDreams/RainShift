"use client";

import { forwardRef, type HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "lunar"
  | "common"
  | "uncommon"
  | "legendary"
  | "boss"
  | "void"
  | "equipment";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-hover text-text-secondary border-border",
  primary: "bg-primary/20 text-primary border-primary/30",
  secondary: "bg-secondary/20 text-secondary border-secondary/30",
  success: "bg-success/20 text-success border-success/30",
  danger: "bg-danger/20 text-danger border-danger/30",
  lunar: "bg-lunar/20 text-lunar border-lunar/30",
  // Item rarity badges
  common: "bg-[#9d9d9d]/20 text-[#9d9d9d] border-[#9d9d9d]/30",
  uncommon: "bg-[#5cb85c]/20 text-[#5cb85c] border-[#5cb85c]/30",
  legendary: "bg-[#e34234]/20 text-[#e34234] border-[#e34234]/30",
  boss: "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30",
  void: "bg-[#9b59b6]/20 text-[#9b59b6] border-[#9b59b6]/30",
  equipment: "bg-[#ff8c00]/20 text-[#ff8c00] border-[#ff8c00]/30",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "default", size = "sm", className = "", children, ...props },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-full border
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
