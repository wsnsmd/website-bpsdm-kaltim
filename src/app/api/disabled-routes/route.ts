// src/app/api/disabled-routes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSetting } from "@/lib/queries/settings";

export async function GET(req: NextRequest) {
  const internalKey = req.headers.get("x-internal");
  if (internalKey !== (process.env.INTERNAL_SECRET ?? "secret")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const raw = (await getSetting("disabled_routes")) ?? "";
    const routes = raw
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.startsWith("/"));

    return NextResponse.json(
      { routes },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return NextResponse.json({ routes: [] });
  }
}
