"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: {
    box: "w-4 h-4",
    icon: 12,
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    box: "w-5 h-5",
    icon: 14,
    label: "text-base",
    description: "text-sm",
  },
  lg: {
    box: "w-6 h-6",
    icon: 16,
    label: "text-lg",
    description: "text-base",
  },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      size = "md",
      className = "",
      checked,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const styles = sizeStyles[size];
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;

    return (
      <label
        htmlFor={checkboxId}
        className={`
          inline-flex items-start gap-3 cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={`
              ${styles.box}
              rounded border-2
              flex items-center justify-center
              transition-colors duration-200
              ${
                checked
                  ? "bg-primary border-primary"
                  : "bg-surface border-border hover:border-border-hover"
              }
            `}
            whileTap={{ scale: disabled ? 1 : 0.9 }}
          >
            <AnimatePresence>
              {checked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check
                    size={styles.icon}
                    className="text-background"
                    strokeWidth={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className={`${styles.label} text-text-primary`}>
                {label}
              </span>
            )}
            {description && (
              <span className={`${styles.description} text-text-secondary`}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
