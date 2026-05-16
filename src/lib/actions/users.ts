// src/lib/actions/users.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { users } from "@/db/schema";
import { can } from "@/lib/auth-helpers";

// Hanya superadmin yang bisa ubah status user
export async function updateUserStatus(
  userId: string,
  status: "active" | "inactive" | "suspended",
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const role = (session.user as any).role ?? "viewer";
  if (!can(role, "users:manage")) {
    return { error: "Anda tidak memiliki izin untuk mengelola pengguna." };
  }

  // Tidak bisa ubah status diri sendiri
  if (session.user.id === userId) {
    return { error: "Tidak dapat mengubah status akun Anda sendiri." };
  }

  await db.update(users).set({ status }).where(eq(users.id, userId));

  revalidatePath("/admin/pengguna");
  return { success: true };
}
