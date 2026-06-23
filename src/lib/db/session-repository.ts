import type { Session } from "@/types";
import {
  getAllSessions as getLocalSessions,
  getSession as getLocalSession,
  saveSession as saveLocalSession,
  deleteSession as deleteLocalSession,
} from "./local-session-repository";
import { debouncedSync, isOnline, runSync } from "@/lib/sync/session-sync";

export async function getAllSessions(): Promise<Session[]> {
  return getLocalSessions();
}

export async function getSession(id: string): Promise<Session | undefined> {
  return getLocalSession(id);
}

export async function saveSession(session: Session): Promise<void> {
  await saveLocalSession(session);
  if (isOnline()) {
    debouncedSync();
  }
}

export async function deleteSession(id: string): Promise<void> {
  await deleteLocalSession(id);
  if (isOnline()) {
    debouncedSync();
  }
}

export async function triggerInitialSync(): Promise<void> {
  if (isOnline()) {
    await runSync();
  }
}
