// src/lib/actions/gallery.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq } from "@/db";
import { galleryAlbums, galleryPhotos, galleryVideos } from "@/db/schema";
import { z } from "zod";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/gallery";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ── Album ─────────────────────────────────────
const AlbumSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  type: z.enum(["photo", "video"]),
  isPublished: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export async function createAlbum(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "");
  const parsed = AlbumSchema.safeParse({
    title,
    slug: formData.get("slug") || slugify(title),
    description: formData.get("description"),
    coverImage: formData.get("coverImage"),
    type: formData.get("type"),
    isPublished: formData.get("isPublished") === "true",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await db.insert(galleryAlbums).values({
      ...parsed.data,
      slug: parsed.data.slug ?? slugify(title),
      description: parsed.data.description || null,
      coverImage: parsed.data.coverImage || null,
      createdBy: (session.user as any).username ?? session.user.email ?? null,
    });
  } catch (e: any) {
    if (e?.message?.includes("Duplicate"))
      return { error: "Slug sudah digunakan." };
    return { error: "Gagal menyimpan album." };
  }

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri");
}

export async function updateAlbum(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "");
  const parsed = AlbumSchema.safeParse({
    title,
    slug: formData.get("slug") || slugify(title),
    description: formData.get("description"),
    coverImage: formData.get("coverImage"),
    type: formData.get("type"),
    isPublished: formData.get("isPublished") === "true",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db
    .update(galleryAlbums)
    .set({
      ...parsed.data,
      description: parsed.data.description || null,
      coverImage: parsed.data.coverImage || null,
    })
    .where(eq(galleryAlbums.id, id));

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri");
}

export async function deleteAlbum(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(galleryAlbums).where(eq(galleryAlbums.id, id));
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

// ── Foto ──────────────────────────────────────
export async function addPhotos(albumId: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const imageUrls = formData.getAll("imageUrl") as string[];
  if (imageUrls.length === 0) return { error: "Tidak ada foto dipilih." };

  const values = imageUrls.filter(Boolean).map((url, i) => ({
    albumId,
    imageUrl: url,
    thumbUrl: url,
    caption: null,
    sortOrder: i,
  }));

  await db.insert(galleryPhotos).values(values);
  revalidatePath("/galeri");
  revalidatePath(`/admin/galeri/${albumId}`);
  revalidatePath(`/galeri/album`);
}

export async function updatePhotoCaption(id: number, caption: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db
    .update(galleryPhotos)
    .set({ caption })
    .where(eq(galleryPhotos.id, id));
  revalidatePath("/galeri");
}

export async function deletePhoto(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
  revalidatePath("/galeri");
}

// ── Video ─────────────────────────────────────
const VideoSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  sourceType: z.enum(["youtube", "instagram"]),
  sourceUrl: z.string().url("URL tidak valid"),
  duration: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
});

export async function addVideo(albumId: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = VideoSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    sourceType: formData.get("sourceType"),
    sourceUrl: formData.get("sourceUrl"),
    duration: formData.get("duration"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const sourceUrl = parsed.data.sourceUrl;
  const ytId =
    parsed.data.sourceType === "youtube" ? extractYoutubeId(sourceUrl) : null;
  const thumbUrl = ytId ? getYoutubeThumbnail(ytId) : null;

  await db.insert(galleryVideos).values({
    albumId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    sourceType: parsed.data.sourceType,
    sourceUrl,
    videoId: ytId,
    thumbUrl,
    duration: parsed.data.duration || null,
    sortOrder: parsed.data.sortOrder,
  });

  revalidatePath("/galeri");
  revalidatePath(`/admin/galeri/${albumId}`);
  redirect(`/admin/galeri/${albumId}`);
}

export async function deleteVideo(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(galleryVideos).where(eq(galleryVideos.id, id));
  revalidatePath("/galeri");
}
