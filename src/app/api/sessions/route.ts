import { NextResponse } from "next/server";
import { getAllSessions, upsertSession } from "@/lib/server/session-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sessions = getAllSessions();
    return NextResponse.json({ sessions });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to fetch sessions", detail: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, createdAt, updatedAt, scoreStep, players } = body;
    if (!id || !name) {
      return NextResponse.json({ error: "Missing required fields: id, name" }, { status: 400 });
    }
    const isNew = upsertSession({
      id,
      name,
      createdAt: createdAt ?? Date.now(),
      updatedAt: updatedAt ?? Date.now(),
      scoreStep: scoreStep ?? 10,
      players: players ?? [],
    });
    return NextResponse.json(
      { session: { id, name } },
      { status: isNew ? 201 : 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to create session", detail: msg }, { status: 500 });
  }
}
