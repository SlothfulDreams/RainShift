"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CoinsEditorProps {
  coins: number;
  onChange: (coins: number) => void;
}

export function CoinsEditor({ coins, onChange }: CoinsEditorProps) {
  const [inputValue, setInputValue] = useState(coins.toString());

  useEffect(() => {
    setInputValue(coins.toString());
  }, [coins]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
      const numValue = parseInt(value, 10);
      if (!Number.isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  const handleIncrement = (amount: number) => {
    onChange(Math.max(0, coins + amount));
  };

  return (
    <div className="holo-card p-5 rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xs tracking-widest text-neon-purple">
          {"LUNAR COINS"}
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(191,95,255,0.8)]" />
          <span className="text-neon-purple font-display text-lg">
            {coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Input field */}
      <div className="relative mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-void-light border border-neon-purple/30 rounded-sm text-center text-neon-purple font-display text-xl tracking-wider focus:border-neon-purple focus:shadow-[0_0_15px_rgba(191,95,255,0.3)] transition-all"
        />
        <div className="absolute inset-0 pointer-events-none border border-neon-purple/10 rounded-sm" />
      </div>

      {/* Quick adjust buttons */}
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        <AdjustButton
          amount={-1}
          onClick={() => handleIncrement(-1)}
          disabled={coins < 1}
        />
        <AdjustButton
          amount={-10}
          onClick={() => handleIncrement(-10)}
          disabled={coins < 10}
        />
        <AdjustButton
          amount={-100}
          onClick={() => handleIncrement(-100)}
          disabled={coins < 100}
        />
        <AdjustButton amount={1} onClick={() => handleIncrement(1)} />
        <AdjustButton amount={10} onClick={() => handleIncrement(10)} />
        <AdjustButton amount={100} onClick={() => handleIncrement(100)} />
      </div>

      {/* Quick set buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(999999999)}
          className="flex-1 px-3 py-2 text-[10px] tracking-wider font-display bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition-all"
        >
          MAX
        </button>
        <button
          type="button"
          onClick={() => onChange(0)}
          className="flex-1 px-3 py-2 text-[10px] tracking-wider font-display border border-border text-text-muted hover:border-neon-purple/30 hover:text-neon-purple transition-all"
        >
          RESET
        </button>
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

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        py-2.5 text-xs font-display tracking-wide transition-all rounded-sm
        ${
          isNegative
            ? "bg-neon-red/10 border border-neon-red/30 text-neon-red hover:bg-neon-red/20 hover:border-neon-red/50"
            : "bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/50"
        }
        disabled:opacity-30 disabled:cursor-not-allowed
      `}
    >
      {isNegative ? "" : "+"}
      {amount}
    </motion.button>
  );
}
