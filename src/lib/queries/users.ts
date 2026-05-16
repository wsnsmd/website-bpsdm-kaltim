// src/lib/queries/users.ts
import { db, eq, desc, like, or } from "@/db";
import { users } from "@/db/schema";

export type UserItem = {
  id: string;
  sub: string;
  username: string;
  name: string;
  email: string | null;
  role: string;
  authentikGroups: string | null;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
};

export async function getUsers(
  options: {
    search?: string;
    role?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {},
): Promise<UserItem[]> {
  const { search, role, status, limit = 50, offset = 0 } = options;

  let query = db
    .select({
      id: users.id,
      sub: users.sub,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role,
      authentikGroups: users.authentikGroups,
      status: users.status,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.lastLoginAt))
    .limit(limit)
    .offset(offset);

  return (await query) as UserItem[];
}

export async function countUsers(): Promise<number> {
  const { count } = await import("@/db");
  const result = await db.select({ total: count() }).from(users);
  return result[0]?.total ?? 0;
}

export async function getUserById(id: string): Promise<UserItem | null> {
  const result = await db
    .select({
      id: users.id,
      sub: users.sub,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role,
      authentikGroups: users.authentikGroups,
      status: users.status,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return (result[0] as UserItem) ?? null;
}
