import type { Session } from "@/types";
import {
  getAllRecords,
  getRecord,
  putRecord,
  getPendingRecords,
  markRecordSynced,
  markAllSynced,
  bulkPutRecords,
} from "./indexeddb";

export async function getAllSessions(): Promise<Session[]> {
  const sessions = await getAllRecords<Session>();
  return sessions
    .filter((s) => !s.deletedAt)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getSession(id: string): Promise<Session | undefined> {
  return getRecord<Session>(id);
}

export async function saveSession(session: Session): Promise<void> {
  await putRecord({
    ...session,
    updatedAt: Date.now(),
    syncStatus: "pending_upsert",
  });
}

export async function deleteSession(id: string): Promise<void> {
  const existing = await getRecord<Session>(id);
  if (existing) {
    await putRecord({
      ...existing,
      deletedAt: Date.now(),
      updatedAt: Date.now(),
      syncStatus: "pending_delete",
    });
  }
}

export async function getLocalPendingSessions(): Promise<Session[]> {
  return getPendingRecords<Session>();
}

export async function markSessionSynced(id: string): Promise<void> {
  await markRecordSynced(id);
}

export async function markAllSessionsSynced(): Promise<void> {
  await markAllSynced();
}

export async function overwriteFromServer(sessions: Session[]): Promise<void> {
  const patched = sessions.map((s) => ({
    ...s,
    syncStatus: "synced" as const,
    lastSyncedAt: Date.now(),
  }));
  await bulkPutRecords(patched);
}
