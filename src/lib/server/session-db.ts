import type { Session } from "@/types";
import { getDb } from "./sqlite";

interface DbSessionRow {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
  score_step: number;
  players_json: string;
  deleted_at: number | null;
}

function rowToSession(row: DbSessionRow): Session {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    scoreStep: row.score_step,
    players: JSON.parse(row.players_json),
    deletedAt: row.deleted_at ?? undefined,
  };
}

function sessionToRow(session: Partial<Session> & { id: string }) {
  return {
    id: session.id,
    name: session.name ?? "",
    created_at: session.createdAt ?? Date.now(),
    updated_at: session.updatedAt ?? Date.now(),
    score_step: session.scoreStep ?? 10,
    players_json: JSON.stringify(session.players ?? []),
    deleted_at: session.deletedAt ?? null,
    last_client_updated_at: session.updatedAt ?? Date.now(),
  };
}

export function getAllSessions(includeDeleted = false): Session[] {
  const db = getDb();
  let sql = "SELECT * FROM sessions";
  if (!includeDeleted) {
    sql += " WHERE deleted_at IS NULL";
  }
  sql += " ORDER BY updated_at DESC";
  const rows = db.prepare(sql).all() as DbSessionRow[];
  return rows.map(rowToSession);
}

export function getSession(id: string): Session | undefined {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(id) as DbSessionRow | undefined;
  if (!row) return undefined;
  return rowToSession(row);
}

export function upsertSession(session: Partial<Session> & { id: string }): boolean {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM sessions WHERE id = ?")
    .get(session.id) as { id: string } | undefined;

  if (existing) {
    const row = sessionToRow(session);
    db.prepare(
      `UPDATE sessions SET
        name = @name,
        updated_at = @updated_at,
        score_step = @score_step,
        players_json = @players_json,
        deleted_at = @deleted_at,
        last_client_updated_at = @last_client_updated_at,
        modified_at = (unixepoch() * 1000)
      WHERE id = @id`
    ).run(row);
    return false;
  } else {
    const row = sessionToRow(session);
    db.prepare(
      `INSERT INTO sessions (id, name, created_at, updated_at, score_step, players_json, deleted_at, last_client_updated_at)
      VALUES (@id, @name, @created_at, @updated_at, @score_step, @players_json, @deleted_at, @last_client_updated_at)`
    ).run(row);
    return true;
  }
}

export function softDeleteSession(id: string): boolean {
  const db = getDb();
  const result = db
    .prepare(
      "UPDATE sessions SET deleted_at = (unixepoch() * 1000), modified_at = (unixepoch() * 1000) WHERE id = ? AND deleted_at IS NULL"
    )
    .run(id);
  return result.changes > 0;
}

export function hardDeleteSession(id: string): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
  return result.changes > 0;
}

export function batchUpsertSessions(
  sessions: Array<Partial<Session> & { id: string }>
): void {
  const db = getDb();
  const upsert = db.transaction((items: Array<Partial<Session> & { id: string }>) => {
    for (const session of items) {
      upsertSession(session);
    }
  });
  upsert(sessions);
}

export function getSessionsUpdatedAfter(timestamp: number): Session[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM sessions WHERE (deleted_at IS NULL OR deleted_at > ?) AND updated_at > ? ORDER BY updated_at DESC"
    )
    .all(timestamp, timestamp) as DbSessionRow[];
  return rows.map(rowToSession);
}

export function getDeletedSince(timestamp: number): Session[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM sessions WHERE deleted_at IS NOT NULL AND deleted_at > ? ORDER BY deleted_at DESC"
    )
    .all(timestamp) as DbSessionRow[];
  return rows.map(rowToSession);
}
