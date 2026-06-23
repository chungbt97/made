import { NextResponse } from "next/server";
import {
  getSession,
  upsertSession,
  softDeleteSession,
} from "@/lib/server/session-db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ session });
    } catch {
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const existing = getSession(sessionId);
    if (!existing) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    upsertSession({
      id: sessionId,
      name: body.name ?? existing.name,
      createdAt: existing.createdAt,
      updatedAt: body.updatedAt ?? Date.now(),
      scoreStep: body.scoreStep ?? existing.scoreStep,
      players: body.players ?? existing.players,
      deletedAt: body.deletedAt ?? existing.deletedAt,
    });
    return NextResponse.json({ session: { id: sessionId } });
  } catch {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const deleted = softDeleteSession(sessionId);
    if (!deleted) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
