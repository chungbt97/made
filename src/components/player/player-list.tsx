"use client";

import type { Player } from "@/types";
import { PlayerCard } from "./player-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface PlayerListProps {
  players: Player[];
  onApplyScore: (playerId: string, delta: number) => void;
  onUndo: (playerId: string) => void;
  undoHistory: Record<string, boolean>;
  onAddPlayer: () => void;
  isAdmin: boolean;
}

export function PlayerList({
  players,
  onApplyScore,
  onUndo,
  undoHistory,
  onAddPlayer,
  isAdmin,
}: PlayerListProps) {
  if (players.length === 0) {
    return (
      <EmptyState
        title="Chưa có người chơi"
        description="Thêm người chơi để bắt đầu theo dõi điểm số."
        action={isAdmin ? <Button onClick={onAddPlayer}>Thêm người chơi</Button> : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onApplyScore={onApplyScore}
          onUndo={onUndo}
          canUndo={!!undoHistory[player.id]}
          isAdmin={isAdmin}
        />
      ))}
      {isAdmin && players.length > 0 && (
        <button
          onClick={onAddPlayer}
          className="flex min-h-[140px] items-center justify-center rounded-2xl border-2 border-dashed border-[#e5e5e5] bg-[#faf5e8] text-sm font-medium text-[#6a6a6a] transition-colors hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
        >
          + Thêm người chơi
        </button>
      )}
    </div>
  );
}
