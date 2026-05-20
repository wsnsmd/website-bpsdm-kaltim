// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { globalSearch } from "@/lib/queries/search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await globalSearch(q, 8);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
