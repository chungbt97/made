import type { Player } from "./player";

export interface Session {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  scoreStep: number;
  players: Player[];
  deletedAt?: number | null;
  syncStatus?: "synced" | "pending_upsert" | "pending_delete";
  lastSyncedAt?: number | null;
}
