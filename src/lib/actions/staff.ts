// src/lib/actions/staff.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { staff } from "@/db/schema";
import { z } from "zod";

const StaffSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  nip: z.string().optional(),
  position: z.string().min(3, "Jabatan minimal 3 karakter"),
  unitId: z.coerce.number().optional(),
  type: z.enum([
    "kepala_badan",
    "sekretaris",
    "kepala_bidang",
    "widyaiswara",
    "pegawai",
  ]),
  photo: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

export async function createStaff(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    nip: formData.get("nip"),
    position: formData.get("position"),
    unitId: formData.get("unitId"),
    type: formData.get("type"),
    photo: formData.get("photo"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    education: formData.get("education"),
    bio: formData.get("bio"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = StaffSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  try {
    await db.insert(staff).values({
      name: data.name,
      nip: data.nip || null,
      position: data.position,
      unitId: data.unitId || null,
      type: data.type,
      photo: data.photo || null,
      email: data.email || null,
      phone: data.phone || null,
      education: data.education || null,
      bio: data.bio || null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });
  } catch {
    return { error: "Gagal menyimpan data pegawai." };
  }

  revalidatePath("/profil");
  revalidatePath("/admin/profil/staff");
  redirect("/admin/profil/staff");
}

export async function updateStaff(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    nip: formData.get("nip"),
    position: formData.get("position"),
    unitId: formData.get("unitId"),
    type: formData.get("type"),
    photo: formData.get("photo"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    education: formData.get("education"),
    bio: formData.get("bio"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = StaffSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  try {
    await db
      .update(staff)
      .set({
        name: data.name,
        nip: data.nip || null,
        position: data.position,
        unitId: data.unitId || null,
        type: data.type,
        photo: data.photo || null,
        email: data.email || null,
        phone: data.phone || null,
        education: data.education || null,
        bio: data.bio || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      })
      .where(eq(staff.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/profil");
  revalidatePath("/admin/profil/staff");
  redirect("/admin/profil/staff");
}

export async function deleteStaff(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(staff).where(eq(staff.id, id));
  revalidatePath("/profil");
  revalidatePath("/admin/profil/staff");
}

export async function toggleStaffActive(id: number, isActive: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.update(staff).set({ isActive }).where(eq(staff.id, id));
  revalidatePath("/admin/profil/staff");
}
