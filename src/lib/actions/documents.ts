// src/lib/actions/documents.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { documents, documentCategories } from "@/db/schema";
import { z } from "zod";

const DocumentSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  fileUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  fileType: z.string().optional(),
  fileSize: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
  tags: z.string().optional(),
  status: z.enum(["published", "draft", "archived"]),
});

export async function createDocument(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  console.log("=== createDocument ===");
  for (const [key, val] of formData.entries()) {
    console.log(`  ${key} = "${val}"`);
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    fileUrl: formData.get("fileUrl"),
    externalUrl: formData.get("externalUrl"),
    fileType: formData.get("fileType"),
    fileSize: formData.get("fileSize"),
    year: formData.get("year"),
    tags: formData.get("tags"),
    status: formData.get("status"),
  };

  const parsed = DocumentSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  // Validasi: harus ada salah satu URL
  if (!data.fileUrl && !data.externalUrl) {
    return { error: "Harus mengisi file upload atau link eksternal." };
  }

  try {
    await db.insert(documents).values({
      title: data.title,
      description: data.description || null,
      categoryId: data.categoryId || null,
      fileUrl: data.fileUrl || null,
      externalUrl: data.externalUrl || null,
      fileType: data.fileType || null,
      fileSize: data.fileSize || null,
      year: data.year || new Date().getFullYear(),
      tags: data.tags || null,
      status: data.status,
      createdBy:
        (session.user as any).username ??
        session.user.name ??
        session.user.email ??
        null,
      downloadCount: 0,
    });
  } catch (err) {
    console.error("DB Error createDocument:", err);
    return { error: "Gagal menyimpan dokumen." };
  }

  revalidatePath("/web");
  revalidatePath("/unduhan");
  revalidatePath("/admin/dokumen");
  redirect("/admin/dokumen");
}

export async function updateDocument(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    fileUrl: formData.get("fileUrl"),
    externalUrl: formData.get("externalUrl"),
    fileType: formData.get("fileType"),
    fileSize: formData.get("fileSize"),
    year: formData.get("year"),
    tags: formData.get("tags"),
    status: formData.get("status"),
  };

  const parsed = DocumentSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  if (!data.fileUrl && !data.externalUrl) {
    return { error: "Harus mengisi file upload atau link eksternal." };
  }

  try {
    await db
      .update(documents)
      .set({
        title: data.title,
        description: data.description || null,
        categoryId: data.categoryId || null,
        fileUrl: data.fileUrl || null,
        externalUrl: data.externalUrl || null,
        fileType: data.fileType || null,
        fileSize: data.fileSize || null,
        year: data.year || new Date().getFullYear(),
        tags: data.tags || null,
        status: data.status,
      })
      .where(eq(documents.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/web");
  revalidatePath("/unduhan");
  revalidatePath("/admin/dokumen");
  redirect("/admin/dokumen");
}

export async function deleteDocument(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(documents).where(eq(documents.id, id));
  revalidatePath("/web");
  revalidatePath("/unduhan");
  revalidatePath("/admin/dokumen");
}

export async function toggleDocumentStatus(
  id: number,
  status: "published" | "draft" | "archived",
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.update(documents).set({ status }).where(eq(documents.id, id));
  revalidatePath("/unduhan");
  revalidatePath("/admin/dokumen");
}

// ── Kategori ──────────────────────────────────
const CategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createDocumentCategory(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = CategorySchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  try {
    await db.insert(documentCategories).values({
      name: data.name,
      slug: data.slug ? toSlug(data.slug) : toSlug(data.name),
      description: data.description || null,
      icon: data.icon || null,
      color: data.color || null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY") {
      return { error: "Slug sudah digunakan." };
    }
    return { error: "Gagal menyimpan kategori." };
  }

  revalidatePath("/unduhan");
  revalidatePath("/admin/dokumen/kategori");
  redirect("/admin/dokumen/kategori");
}

export async function updateDocumentCategory(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  };

  const parsed = CategorySchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  try {
    await db
      .update(documentCategories)
      .set({
        name: data.name,
        slug: data.slug ? toSlug(data.slug) : undefined,
        description: data.description || null,
        icon: data.icon || null,
        color: data.color || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      })
      .where(eq(documentCategories.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/unduhan");
  revalidatePath("/admin/dokumen/kategori");
  redirect("/admin/dokumen/kategori");
}

export async function deleteDocumentCategory(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(documentCategories).where(eq(documentCategories.id, id));
  revalidatePath("/unduhan");
  revalidatePath("/admin/dokumen/kategori");
}
