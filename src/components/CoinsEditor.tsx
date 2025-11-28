"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const INT32_MAX = 2147483647;

interface CoinsEditorProps {
  coins: number;
  onChange: (coins: number) => void;
}

export function CoinsEditor({ coins, onChange }: CoinsEditorProps) {
  const [inputValue, setInputValue] = useState(coins.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(coins.toString());
  }, [coins]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
      const numValue = parseInt(value, 10);
      if (!Number.isNaN(numValue)) {
        onChange(Math.min(numValue, INT32_MAX));
      }
    }
  };

  const handleIncrement = (amount: number) => {
    const newValue = Math.max(0, Math.min(coins + amount, INT32_MAX));
    onChange(newValue);
  };

  return (
    <div className="ror-card p-4 space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-ror-lunar/40 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-ror-lunar font-display">
          Lunar Coins
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-ror-lunar/40 to-transparent" />
      </div>

      {/* Main Display */}
      <div className="relative">
        {/* Glow effect behind */}
        <div className="absolute inset-0 bg-ror-lunar/5 blur-xl rounded-full" />

        <div className="relative flex items-center justify-center gap-4 py-3">
          <LunarCoinIcon className="w-8 h-8 text-ror-lunar" />
          <motion.span
            key={coins}
            initial={{ scale: 1.02, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="text-3xl font-display text-ror-lunar tabular-nums tracking-wider"
          >
            {coins.toLocaleString()}
          </motion.span>
        </div>
      </div>

      {/* Input Field */}
      <div className="relative group">
        <div
          className={`absolute inset-0 bg-ror-lunar/10 blur-md transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="relative w-full px-4 py-2 bg-ror-bg-main border border-ror-border text-center text-ror-lunar font-mono text-sm tracking-wider focus:border-ror-lunar/60 focus:outline-none transition-all"
        />
      </div>

      {/* Adjustment Controls */}
      <div className="flex items-center gap-1">
        {/* Decrement buttons */}
        <div className="flex-1 flex gap-0.5">
          <AdjustButton
            amount={-100}
            onClick={() => handleIncrement(-100)}
            disabled={coins < 100}
          />
          <AdjustButton
            amount={-10}
            onClick={() => handleIncrement(-10)}
            disabled={coins < 10}
          />
          <AdjustButton
            amount={-1}
            onClick={() => handleIncrement(-1)}
            disabled={coins < 1}
          />
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-ror-border mx-1" />

        {/* Increment buttons */}
        <div className="flex-1 flex gap-0.5">
          <AdjustButton amount={1} onClick={() => handleIncrement(1)} />
          <AdjustButton amount={10} onClick={() => handleIncrement(10)} />
          <AdjustButton amount={100} onClick={() => handleIncrement(100)} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(INT32_MAX)}
          className="flex-1 py-2 text-[10px] tracking-wider font-display uppercase
                     bg-ror-lunar/10 border border-ror-lunar/40 text-ror-lunar
                     hover:bg-ror-lunar/20 hover:border-ror-lunar/60 transition-all
                     flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 bg-ror-lunar rounded-full" />
          Max
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(0)}
          className="flex-1 py-2 text-[10px] tracking-wider font-display uppercase
                     border border-ror-border text-ror-text-dim
                     hover:border-ror-text-muted hover:text-ror-text-muted transition-all
                     flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 border border-current rounded-full" />
          Reset
        </motion.button>
      </div>
    </div>
  );
}

function AdjustButton({
  amount,
  onClick,
  disabled = false,
}: {
  amount: number;
  onClick: () => void;
  disabled?: boolean;
}) {
  const isNegative = amount < 0;
  const displayAmount = Math.abs(amount);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex-1 py-1.5 text-[10px] font-mono tracking-wide transition-all
        bg-transparent border border-transparent
        ${
          isNegative
            ? "text-ror-text-dim hover:text-ror-legendary hover:border-ror-legendary/30 hover:bg-ror-legendary/5"
            : "text-ror-text-dim hover:text-ror-uncommon hover:border-ror-uncommon/30 hover:bg-ror-uncommon/5"
        }
        disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:text-ror-text-dim disabled:hover:border-transparent disabled:hover:bg-transparent
      `}
    >
      {isNegative ? "-" : "+"}
      {displayAmount}
    </button>
  );
}

function LunarCoinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <title>Lunar Coin</title>
      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Inner ring */}
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Crescent moon shape */}
      <path
        d="M14 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c-3.3 0-6-2.7-6-6s2.7-6 6-6c0 .3 0 .7 0 1 0 .3 0 .7 0 1z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
      {/* Highlight arc */}
      <path
        d="M7 9c1-2 3-3.5 5-3.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
