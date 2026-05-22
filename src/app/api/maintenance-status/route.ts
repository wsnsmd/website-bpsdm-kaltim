// src/app/api/maintenance-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSetting } from "@/lib/queries/settings";

export async function GET(req: NextRequest) {
  // Hanya bisa dipanggil dari internal middleware
  const internalKey = req.headers.get("x-internal");
  if (internalKey !== (process.env.INTERNAL_SECRET ?? "secret")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const maintenance = (await getSetting("maintenance_mode")) ?? "false";
    return NextResponse.json(
      { maintenance },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json({ maintenance: "false" });
  }
}
