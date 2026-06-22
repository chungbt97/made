"use client";

import { useState, useRef } from "react";
import type { Player } from "@/types";
import { formatScore } from "@/lib/utils/format-score";

function getContrastText(bg: string): string {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0a0a0a" : "#ffffff";
}

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

  const avatarTextColor = getContrastText(player.color);

  return (
    <div
      className="flex flex-col rounded-2xl border-2 p-5 transition-all"
      style={{ borderColor: player.color, backgroundColor: "#faf5e8" }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: player.color, color: avatarTextColor }}
        >
          {player.avatar || player.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[#0a0a0a]">
            {player.name}
          </h3>
          <div
            className={`text-2xl font-bold tabular-nums leading-none ${
              isPositive ? "text-[#22c55e]" : isNegative ? "text-[#ef4444]" : "text-[#0a0a0a]"
            }`}
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
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5e5e5] text-sm font-bold text-[#0a0a0a] transition-opacity disabled:opacity-30"
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
