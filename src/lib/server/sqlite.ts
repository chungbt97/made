import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

function getDbPath(): string {
  if (process.env.VERCEL === "1") {
    return path.join("/tmp", "nine-balls.db");
  }
  return path.join(process.cwd(), "data", "nine-balls.db");
}

const DB_PATH = getDbPath();

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      db = new Database(DB_PATH);
      db.pragma("journal_mode = WAL");
      db.pragma("foreign_keys = ON");
      initSchema(db);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error("SQLite init failed: " + msg + " (path=" + DB_PATH + ")");
    }
  }
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      score_step INTEGER NOT NULL DEFAULT 10,
      players_json TEXT NOT NULL DEFAULT '[]',
      deleted_at INTEGER,
      last_client_updated_at INTEGER,
      inserted_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      modified_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions(updated_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_deleted_at ON sessions(deleted_at);
  `);
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
