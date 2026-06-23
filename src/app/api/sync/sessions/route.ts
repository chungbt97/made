import { NextResponse } from "next/server";
import { batchUpsertSessions, getAllSessions } from "@/lib/server/session-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { records } = body as { records: Array<{ id: string }> };

    if (!Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid payload: records must be an array" }, { status: 400 });
    }

    batchUpsertSessions(records);

    const serverSessions = getAllSessions(true);

    return NextResponse.json({
      applied: records.map((r) => ({ id: r.id, status: "upserted" as const })),
      records: serverSessions,
      serverTimestamp: Date.now(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Sync failed", detail: msg }, { status: 500 });
  }
}
