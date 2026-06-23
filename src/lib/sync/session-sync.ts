import {
  getLocalPendingSessions,
  markSessionSynced,
  overwriteFromServer,
} from "@/lib/db/local-session-repository";
import { syncSessions } from "@/lib/api/session-api";

let syncInProgress = false;
let pendingTimeout: ReturnType<typeof setTimeout> | null = null;

export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine;
}

export async function runSync(): Promise<void> {
  if (syncInProgress) return;
  if (!isOnline()) return;

  syncInProgress = true;
  try {
    const pending = await getLocalPendingSessions();

    const result = await syncSessions(pending);

    await overwriteFromServer(result.records);

    for (const record of result.records) {
      await markSessionSynced(record.id);
    }
  } catch (e) {
    console.warn("[sync] failed, will retry later", e);
  } finally {
    syncInProgress = false;
  }
}

export function scheduleSync(delayMs = 2000): void {
  if (pendingTimeout) clearTimeout(pendingTimeout);
  pendingTimeout = setTimeout(() => {
    runSync();
  }, delayMs);
}

export function debouncedSync(): void {
  scheduleSync(2000);
}

export function cancelScheduledSync(): void {
  if (pendingTimeout) {
    clearTimeout(pendingTimeout);
    pendingTimeout = null;
  }
}

export function setupOnlineListener(): () => void {
  const handler = () => {
    runSync();
  };
  window.addEventListener("online", handler);
  return () => window.removeEventListener("online", handler);
}
