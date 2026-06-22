"use client";

import { useState, useRef } from "react";
import type { Player } from "@/types";
import { formatScore } from "@/lib/utils/format-score";

const CLAY_BRAND_COLORS: Record<string, { bg: string; text: string; button: string }> = {
  "#ff4d8b": { bg: "#ff4d8b", text: "#ffffff", button: "#ffffff33" },
  "#1a3a3a": { bg: "#1a3a3a", text: "#ffffff", button: "#ffffff33" },
  "#b8a4ed": { bg: "#b8a4ed", text: "#0a0a0a", button: "#00000015" },
  "#ffb084": { bg: "#ffb084", text: "#0a0a0a", button: "#00000015" },
  "#e8b94a": { bg: "#e8b94a", text: "#0a0a0a", button: "#00000015" },
  "#f5f0e0": { bg: "#f5f0e0", text: "#0a0a0a", button: "#00000015" },
};

interface PlayerCardProps {
  player: Player;
  onApplyScore: (playerId: string, delta: number) => void;
  onUndo: (playerId: string) => void;
  canUndo: boolean;
}

export function PlayerCard({
  player,
  onApplyScore,
  onUndo,
  canUndo,
}: PlayerCardProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isPositive = player.score > 0;
  const isNegative = player.score < 0;

  const numValue = value === "" ? 0 : parseFloat(value);
  const isValid = value !== "" && !isNaN(numValue) && numValue > 0;

  const theme = CLAY_BRAND_COLORS[player.color] || {
    bg: "#f5f0e0",
    text: "#0a0a0a",
    button: "#00000015",
  };

  const handlePlus = () => {
    if (!isValid) return;
    onApplyScore(player.id, numValue);
    setValue("");
  };

  const handleMinus = () => {
    if (!isValid) return;
    onApplyScore(player.id, -numValue);
    setValue("");
  };

  const handleTick = () => {
    if (!isValid) return;
    onApplyScore(player.id, numValue);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      handlePlus();
    }
  };

  return (
    <div
      className="flex flex-col rounded-2xl p-5 transition-all"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: theme.button, color: theme.text }}
        >
          {player.avatar || player.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-sm font-semibold"
            style={{ color: theme.text }}
          >
            {player.name}
          </h3>
          <div
            className={`text-2xl font-bold tabular-nums leading-none ${
              isPositive ? "text-[#22c55e]" : isNegative ? "text-[#ef4444]" : ""
            }`}
            style={{ color: !isPositive && !isNegative ? theme.text : undefined }}
          >
            {formatScore(player.score)}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
            className="h-full w-full resize-none rounded-xl border border-[#e5e5e5] bg-white/70 px-4 text-lg font-semibold text-[#0a0a0a] placeholder-[#9a9a9a] outline-none [appearance:textfield] focus:border-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ minHeight: "5rem" }}
          />
        </div>

        <div className="flex shrink-0 flex-col gap-1.5">
          <div className="flex gap-1.5">
            <button
              onClick={handleMinus}
              disabled={!isValid}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef4444] text-sm font-bold text-white transition-opacity disabled:opacity-30"
            >
              −
            </button>
            <button
              onClick={() => onUndo(player.id)}
              disabled={!canUndo}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-opacity disabled:opacity-30"
              style={{ backgroundColor: theme.button, color: theme.text }}
              title="Hoàn tác"
            >
              ↶
            </button>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handlePlus}
              disabled={!isValid}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22c55e] text-sm font-bold text-white transition-opacity disabled:opacity-30"
            >
              +
            </button>
            <button
              onClick={handleTick}
              disabled={!isValid}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a0a0a] text-sm font-bold text-white transition-opacity disabled:opacity-30"
              title="Xác nhận"
            >
              ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
