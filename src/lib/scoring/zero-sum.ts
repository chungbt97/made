import type { Player } from "@/types";

export function distributeScore(
  players: Player[],
  targetPlayerId: string,
  delta: number
): Player[] {
  const targetIndex = players.findIndex((p) => p.id === targetPlayerId);
  if (targetIndex === -1) return players;

  const otherPlayers = players.filter((p) => p.id !== targetPlayerId);
  if (otherPlayers.length === 0) return players;

  const totalDelta = delta;
  const lossPerPlayer = -totalDelta / otherPlayers.length;

  return players.map((player) => {
    if (player.id === targetPlayerId) {
      return { ...player, score: player.score + totalDelta };
    }
    return { ...player, score: player.score + lossPerPlayer };
  });
}

export function getTotalScore(players: Player[]): number {
  return players.reduce((sum, p) => sum + p.score, 0);
}
