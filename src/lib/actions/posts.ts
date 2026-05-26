// src/lib/actions/posts.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { posts, categories } from "@/db/schema";
import { createSlug, estimateReadingTime } from "@/lib/utils";
import { z } from "zod";
import { can } from "../auth-helpers";

// ── Validation schema ─────────────────────────
const PostSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  categoryId: z.coerce.number().optional(),
  status: z.enum(["draft", "review", "published", "archived"]),
  isFeatured: z.coerce.boolean().optional(),
  authorName: z.string().optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// ── Create post ───────────────────────────────
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Cek permission
  if (!can(session.user.role, "posts:create")) {
    return { error: "Anda tidak memiliki izin untuk membuat artikel." };
  }

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "true",
    authorName: formData.get("authorName"),
    featuredImage: formData.get("featuredImage"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
  };

  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const slug = data.slug ? createSlug(data.slug) : createSlug(data.title);

  const readingTime = estimateReadingTime(data.content);
  const publishedAt = data.status === "published" ? new Date() : undefined;

  try {
    const [result] = await db
      .insert(posts)
      .values({
        title: data.title,
        slug,
        excerpt: data.excerpt ?? null,
        content: data.content,
        categoryId: data.categoryId ?? null,
        status: data.status,
        isFeatured: data.isFeatured ?? false,
        authorId: session.user.id,
        authorName: data.authorName ?? session.user.name ?? "Admin",
        featuredImage: data.featuredImage || null,
        readingTime,
        publishedAt: publishedAt ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
      })
      .$returningId();

    revalidatePath("/web");
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY") {
      return { error: "Slug sudah digunakan. Gunakan judul yang berbeda." };
    }
    return { error: "Gagal menyimpan artikel." };
  }

  redirect("/admin/berita");
}

// ── Update post ───────────────────────────────
export async function updatePost(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "true",
    authorName: formData.get("authorName"),
    featuredImage: formData.get("featuredImage"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
  };

  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const readingTime = estimateReadingTime(data.content);

  // Set publishedAt jika baru dipublish
  const existing = await db
    .select({ status: posts.status, publishedAt: posts.publishedAt })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  const wasPublished = existing[0]?.status === "published";
  const isPublishing = data.status === "published";
  const publishedAt =
    isPublishing && !wasPublished ? new Date() : existing[0]?.publishedAt;

  try {
    await db
      .update(posts)
      .set({
        title: data.title,
        slug: data.slug ? createSlug(data.slug) : undefined,
        excerpt: data.excerpt ?? null,
        content: data.content,
        categoryId: data.categoryId ?? null,
        status: data.status,
        isFeatured: data.isFeatured ?? false,
        authorName: data.authorName ?? null,
        featuredImage: data.featuredImage || null,
        readingTime,
        publishedAt: publishedAt ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
      })
      .where(eq(posts.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/web");
  revalidatePath("/berita");
  revalidatePath(`/berita/${data.slug}`);
  revalidatePath("/admin/berita");
  redirect("/admin/berita");
}

// ── Delete post ───────────────────────────────
export async function deletePost(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  if (!can(session.user.role, "posts:delete")) {
    return { error: "Anda tidak memiliki izin untuk menghapus artikel." };
  }

  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/berita");
  revalidatePath("/admin/berita");
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) return { error: "Nama kategori wajib diisi." };

  try {
    await db.insert(categories).values({
      name: name.trim(),
      slug: slug?.trim() ? toSlug(slug) : toSlug(name),
      description: description?.trim() || null,
    });
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY") {
      return { error: "Slug sudah digunakan." };
    }
    return { error: "Gagal menyimpan kategori." };
  }

  revalidatePath("/web");
  revalidatePath("/berita");
  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

export async function updateCategory(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) return { error: "Nama kategori wajib diisi." };

  try {
    await db
      .update(categories)
      .set({
        name: name.trim(),
        slug: slug?.trim() ? toSlug(slug) : undefined,
        description: description?.trim() || null,
      })
      .where(eq(categories.id, id));
  } catch {
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/berita");
  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

export async function deleteCategory(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/berita");
  revalidatePath("/admin/kategori");
}
