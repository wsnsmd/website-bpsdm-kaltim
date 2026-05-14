// src/lib/queries/programs.ts
import { db, eq, and, desc, asc, gte, lte, sql, inArray, count } from "@/db";
import { programs, schedules } from "@/db/schema";

// ── Tipe ─────────────────────────────────────
export type ProgramItem = typeof programs.$inferSelect;
export type ScheduleWithProgram = {
  id: number;
  batchName: string | null;
  startDate: Date;
  endDate: Date;
  mode: "online" | "offline" | "blended";
  location: string | null;
  quota: number;
  registeredCount: number | null;
  status: string;
  notes: string | null;
  program: {
    id: number;
    name: string;
    slug: string;
    type: string;
    durationDays: number | null;
  };
};

// ── Get all active programs ───────────────────
export async function getPrograms(
  options: {
    type?: string;
    isHighlight?: boolean;
    limit?: number;
  } = {},
): Promise<ProgramItem[]> {
  const { type, isHighlight, limit } = options;

  const conditions = [eq(programs.status, "active")];
  if (type) conditions.push(eq(programs.type, type as any));
  if (isHighlight !== undefined) {
    conditions.push(eq(programs.isHighlight, isHighlight));
  }

  const query = db
    .select()
    .from(programs)
    .where(and(...conditions))
    .orderBy(asc(programs.sortOrder), asc(programs.name));

  if (limit) {
    return await query.limit(limit);
  }

  return await query;
}

// ── Get program by slug ───────────────────────
export async function getProgramBySlug(
  slug: string,
): Promise<ProgramItem | null> {
  const result = await db
    .select()
    .from(programs)
    .where(and(eq(programs.slug, slug), eq(programs.status, "active")))
    .limit(1);

  return result[0] ?? null;
}

// ── Get upcoming schedules ────────────────────
export async function getUpcomingSchedules(
  options: {
    mode?: "online" | "offline" | "blended";
    limit?: number;
  } = {},
): Promise<ScheduleWithProgram[]> {
  const { mode, limit = 10 } = options;

  const today = new Date();

  const conditions = [
    inArray(schedules.status, ["open", "ongoing"] as any[]),
    gte(schedules.startDate, today),
  ];

  if (mode) conditions.push(eq(schedules.mode, mode));

  const result = await db
    .select({
      id: schedules.id,
      batchName: schedules.batchName,
      startDate: schedules.startDate,
      endDate: schedules.endDate,
      mode: schedules.mode,
      location: schedules.location,
      quota: schedules.quota,
      registeredCount: schedules.registeredCount,
      status: schedules.status,
      notes: schedules.notes,
      program: {
        id: programs.id,
        name: programs.name,
        slug: programs.slug,
        type: programs.type,
        durationDays: programs.durationDays,
      },
    })
    .from(schedules)
    .innerJoin(programs, eq(schedules.programId, programs.id))
    .where(and(...conditions))
    .orderBy(asc(schedules.startDate))
    .limit(limit);

  return result as ScheduleWithProgram[];
}

// Tambahkan di bagian bawah src/lib/queries/programs.ts

export async function countPrograms(
  options: {
    type?: string;
  } = {},
): Promise<number> {
  const { type } = options;

  const conditions = [eq(programs.status, "active")];
  if (type) conditions.push(eq(programs.type, type as any));

  const result = await db
    .select({ total: count() })
    .from(programs)
    .where(and(...conditions));

  return result[0]?.total ?? 0;
}

export async function getSchedulesByMonth(
  year: number,
  month: number,
): Promise<ScheduleWithProgram[]> {
  // Bulan di JS: 0-indexed, di DB: 1-indexed
  const pad = (n: number) => String(n).padStart(2, "0");
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);
  const lastDay = new Date(year, month, 0).getDate();

  const result = await db
    .select({
      id: schedules.id,
      batchName: schedules.batchName,
      startDate: schedules.startDate,
      endDate: schedules.endDate,
      mode: schedules.mode,
      location: schedules.location,
      quota: schedules.quota,
      registeredCount: schedules.registeredCount,
      status: schedules.status,
      notes: schedules.notes,
      program: {
        id: programs.id,
        name: programs.name,
        slug: programs.slug,
        type: programs.type,
        durationDays: programs.durationDays,
      },
    })
    .from(schedules)
    .innerJoin(programs, eq(schedules.programId, programs.id))
    .where(
      and(
        gte(schedules.startDate, startOfMonth),
        lte(schedules.startDate, endOfMonth),
      ),
    )
    .orderBy(asc(schedules.startDate));

  return result as ScheduleWithProgram[];
}

export async function countSchedules(
  options: {
    mode?: string;
    status?: string[];
  } = {},
): Promise<number> {
  const { mode, status = ["open", "ongoing", "full"] } = options;

  const conditions = [inArray(schedules.status, status as any[])];
  if (mode) conditions.push(eq(schedules.mode, mode as any));

  const result = await db
    .select({ total: count() })
    .from(schedules)
    .where(and(...conditions));

  return result[0]?.total ?? 0;
}
