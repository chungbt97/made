import type { Session } from "@/types";

const BASE = "/api/sessions";
const SYNC_URL = "/api/sync/sessions";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "HTTP " + res.status);
  }
  return res.json();
}

export async function fetchAllSessions(): Promise<Session[]> {
  const res = await fetch(BASE);
  const data = await handleResponse(res);
  return data.sessions as Session[];
}

export async function fetchSession(id: string): Promise<Session> {
  const res = await fetch(BASE + "/" + id);
  const data = await handleResponse(res);
  return data.session as Session;
}

export async function createSession(session: Session): Promise<void> {
  await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
}

export async function updateSession(session: Session): Promise<void> {
  await fetch(BASE + "/" + session.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
}

export async function deleteSessionOnServer(id: string): Promise<void> {
  await fetch(BASE + "/" + id, { method: "DELETE" });
}

export async function syncSessions(
  records: Session[]
): Promise<{ records: Session[]; serverTimestamp: number }> {
  const res = await fetch(SYNC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records }),
  });
  const data = await handleResponse(res);
  return {
    records: data.records as Session[],
    serverTimestamp: data.serverTimestamp as number,
  };
}
