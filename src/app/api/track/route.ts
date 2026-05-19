// src/app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, eq, sql } from "@/db";
import { visitorLogs, visitorStats } from "@/db/schema";

// Bot user agents — skip tracking
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /facebookexternalhit/i,
  /Twitterbot/i,
  /curl/i,
  /wget/i,
];

function isBot(ua: string): boolean {
  return BOT_PATTERNS.some((p) => p.test(ua));
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, sessionId } = body as { path: string; sessionId: string };

    if (!path || !sessionId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") ?? "";
    const referer = req.headers.get("referer") ?? "";

    // Skip bots
    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true, bot: true });
    }

    const ip = getClientIp(req);
    const date = getTodayDate();

    // Cek apakah session ini sudah pernah visit hari ini
    const existing = await db
      .select({ id: visitorLogs.id })
      .from(visitorLogs)
      .where(eq(visitorLogs.sessionId, sessionId))
      .limit(1);

    const isNewVisitor = existing.length === 0;

    // Simpan log kunjungan
    await db.insert(visitorLogs).values({
      sessionId,
      path: path.slice(0, 500),
      ip: ip.slice(0, 64),
      userAgent: userAgent.slice(0, 500),
      referer: referer.slice(0, 500),
    });

    // Update stats harian — upsert
    await db.execute(sql`
      INSERT INTO visitor_stats (date, unique_visitors, page_views)
      VALUES (${date}, ${isNewVisitor ? 1 : 0}, 1)
      ON DUPLICATE KEY UPDATE
        unique_visitors = unique_visitors + ${isNewVisitor ? 1 : 0},
        page_views      = page_views + 1
    `);

    return NextResponse.json({ ok: true, newVisitor: isNewVisitor });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
