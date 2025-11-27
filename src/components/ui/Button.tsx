"use client";

import { motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "lunar";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-background hover:bg-primary-hover border-primary/50",
  secondary:
    "bg-secondary text-background hover:bg-secondary-hover border-secondary/50",
  danger: "bg-danger text-white hover:bg-danger-hover border-danger/50",
  ghost:
    "bg-transparent text-text-primary hover:bg-surface-hover border-border hover:border-border-hover",
  lunar: "bg-lunar text-background hover:bg-lunar-hover border-lunar/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      className = "",
      children,
      disabled,
      onClick,
      type = "button",
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-lg border
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <title>Loading</title>
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
