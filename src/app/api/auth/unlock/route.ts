import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password: string };

    const viewerPw = process.env.VIEWER_PASSWORD;
    const adminPw = process.env.ADMIN_PASSWORD;

    if (!viewerPw || !adminPw) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    if (password === adminPw) {
      return NextResponse.json({ success: true, role: "admin" });
    }

    if (password === viewerPw) {
      return NextResponse.json({ success: true, role: "viewer" });
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
