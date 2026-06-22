import type { Session } from "@/types";
import {
  getAllRecords,
  getRecord,
  putRecord,
  deleteRecord,
} from "./indexeddb";

export async function getAllSessions(): Promise<Session[]> {
  const sessions = await getAllRecords<Session>();
  sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  return sessions;
}

export async function getSession(id: string): Promise<Session | undefined> {
  return getRecord<Session>(id);
}

export async function saveSession(session: Session): Promise<void> {
  await putRecord({
    ...session,
    updatedAt: Date.now(),
  });
}

export async function deleteSession(id: string): Promise<void> {
  await deleteRecord(id);
}
