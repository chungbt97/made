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
}

export function PlayerList({
  players,
  onApplyScore,
  onUndo,
  undoHistory,
  onAddPlayer,
}: PlayerListProps) {
  if (players.length === 0) {
    return (
      <EmptyState
        title="Chưa có người chơi"
        description="Thêm người chơi để bắt đầu theo dõi điểm số."
        action={<Button onClick={onAddPlayer}>Thêm người chơi</Button>}
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
        />
      ))}
    </div>
  );
}
