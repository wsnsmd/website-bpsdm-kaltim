// src/lib/actions/programs.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { programs } from "@/db/schema";
import { z } from "zod";

const ProgramSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z.string().optional(),
  description: z.string().optional(),
  jenisKey: z.string().min(1, "Jenis kompetensi wajib dipilih"),
  icon: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  isHighlight: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().default(0),
  objectives: z.string().optional(),
  target: z.string().optional(),
});

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createProgram(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    jenisKey: formData.get("jenisKey"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    status: formData.get("status"),
    isHighlight: formData.get("isHighlight") === "true",
    sortOrder: formData.get("sortOrder"),
    objectives: formData.get("objectives"),
    target: formData.get("target"),
  };

  const parsed = ProgramSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const slug = data.slug ? createSlug(data.slug) : createSlug(data.name);

  try {
    await db.insert(programs).values({
      name: data.name,
      slug,
      description: data.description || null,
      jenisKey: data.jenisKey,
      icon: data.icon || null,
      color: data.color || null,
      status: data.status,
      isHighlight: data.isHighlight ?? true,
      sortOrder: data.sortOrder,
      objectives: data.objectives || null,
      target: data.target || null,
    });
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY") {
      return { error: "Slug sudah digunakan. Gunakan nama yang berbeda." };
    }
    return { error: "Gagal menyimpan program." };
  }

  revalidatePath("/program");
  revalidatePath("/admin/program");
  redirect("/admin/program");
}

export async function updateProgram(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    type: formData.get("type"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    status: formData.get("status"),
    isHighlight: formData.get("isHighlight") === "true",
    sortOrder: formData.get("sortOrder"),
    durationDays: formData.get("durationDays"),
    maxParticipants: formData.get("maxParticipants"),
    objectives: formData.get("objectives"),
    target: formData.get("target"),
    requirements: formData.get("requirements"),
  };

  const parsed = ProgramSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    await db
      .update(programs)
      .set({
        name: data.name,
        slug: data.slug ? createSlug(data.slug) : undefined,
        description: data.description || null,
        jenisKey: data.jenisKey,
        icon: data.icon || null,
        color: data.color || null,
        status: data.status,
        isHighlight: data.isHighlight ?? true,
        sortOrder: data.sortOrder,
        objectives: data.objectives || null,
        target: data.target || null,
      })
      .where(eq(programs.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/program");
  revalidatePath("/admin/program");
  redirect("/admin/program");
}

export async function deleteProgram(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.delete(programs).where(eq(programs.id, id));

  revalidatePath("/program");
  revalidatePath("/admin/program");
}

export async function toggleProgramStatus(
  id: number,
  status: "active" | "inactive",
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.update(programs).set({ status }).where(eq(programs.id, id));

  revalidatePath("/program");
  revalidatePath("/admin/program");
}
