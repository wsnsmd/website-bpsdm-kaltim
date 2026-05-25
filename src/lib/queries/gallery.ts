// src/lib/queries/gallery.ts
import { db, eq, and, asc, desc, sql } from "@/db";
import { galleryAlbums, galleryPhotos, galleryVideos } from "@/db/schema";
export { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/gallery";

export type GalleryAlbum = typeof galleryAlbums.$inferSelect;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type GalleryVideo = typeof galleryVideos.$inferSelect;

// Semua album
export async function getGalleryAlbums(type?: "photo" | "video") {
  return db
    .select()
    .from(galleryAlbums)
    .where(
      and(
        eq(galleryAlbums.isPublished, true),
        type ? eq(galleryAlbums.type, type) : undefined,
      ),
    )
    .orderBy(asc(galleryAlbums.sortOrder), desc(galleryAlbums.createdAt));
}

// Album by slug
export async function getAlbumBySlug(slug: string) {
  const result = await db
    .select()
    .from(galleryAlbums)
    .where(
      and(eq(galleryAlbums.slug, slug), eq(galleryAlbums.isPublished, true)),
    )
    .limit(1);
  return result[0] ?? null;
}

// Foto dalam album
export async function getPhotosByAlbum(albumId: number) {
  return db
    .select()
    .from(galleryPhotos)
    .where(eq(galleryPhotos.albumId, albumId))
    .orderBy(asc(galleryPhotos.sortOrder), asc(galleryPhotos.createdAt));
}

// Semua foto (untuk grid beranda)
export async function getAllPhotos(limit = 20) {
  return db
    .select({
      id: galleryPhotos.id,
      imageUrl: galleryPhotos.imageUrl,
      thumbUrl: galleryPhotos.thumbUrl,
      caption: galleryPhotos.caption,
      width: galleryPhotos.width,
      height: galleryPhotos.height,
      albumId: galleryPhotos.albumId,
      createdAt: galleryPhotos.createdAt,
      sortOrder: galleryPhotos.sortOrder,
    })
    .from(galleryPhotos)
    .innerJoin(
      galleryAlbums,
      and(
        eq(galleryPhotos.albumId, galleryAlbums.id),
        eq(galleryAlbums.isPublished, true),
        eq(galleryAlbums.type, "photo"),
      ),
    )
    .orderBy(desc(galleryPhotos.createdAt))
    .limit(limit);
}

// Video dalam album
export async function getVideosByAlbum(albumId: number) {
  return db
    .select()
    .from(galleryVideos)
    .where(eq(galleryVideos.albumId, albumId))
    .orderBy(asc(galleryVideos.sortOrder), asc(galleryVideos.createdAt));
}

// Semua video
export async function getAllVideos(limit = 20) {
  return db
    .select({
      id: galleryVideos.id,
      title: galleryVideos.title,
      sourceType: galleryVideos.sourceType,
      sourceUrl: galleryVideos.sourceUrl,
      videoId: galleryVideos.videoId,
      thumbUrl: galleryVideos.thumbUrl,
      duration: galleryVideos.duration,
      albumId: galleryVideos.albumId,
      description: galleryVideos.description,
      createdAt: galleryVideos.createdAt,
      sortOrder: galleryVideos.sortOrder,
    })
    .from(galleryVideos)
    .innerJoin(
      galleryAlbums,
      and(
        eq(galleryVideos.albumId, galleryAlbums.id),
        eq(galleryAlbums.isPublished, true),
        eq(galleryAlbums.type, "video"),
      ),
    )
    .orderBy(desc(galleryVideos.createdAt))
    .limit(limit);
}

// Count per type
export async function getGalleryStats() {
  const [photoCount, videoCount, albumCount] = await Promise.all([
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(galleryPhotos)
      .innerJoin(
        galleryAlbums,
        and(
          eq(galleryPhotos.albumId, galleryAlbums.id),
          eq(galleryAlbums.isPublished, true),
        ),
      ),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(galleryVideos)
      .innerJoin(
        galleryAlbums,
        and(
          eq(galleryVideos.albumId, galleryAlbums.id),
          eq(galleryAlbums.isPublished, true),
        ),
      ),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(galleryAlbums)
      .where(eq(galleryAlbums.isPublished, true)),
  ]);

  return {
    photos: photoCount[0]?.total ?? 0,
    videos: videoCount[0]?.total ?? 0,
    albums: albumCount[0]?.total ?? 0,
  };
}

export async function getVideosByAlbumId(albumId: number) {
  return db
    .select()
    .from(galleryVideos)
    .where(eq(galleryVideos.albumId, albumId))
    .orderBy(asc(galleryVideos.sortOrder), desc(galleryVideos.createdAt))
    .limit(12);
}

export async function getGalleryAlbumsWithCount() {
  const rows = await db.execute(sql`
    SELECT 
      a.*,
      COUNT(v.id) as video_count
    FROM gallery_albums a
    LEFT JOIN gallery_videos v ON v.album_id = a.id
    GROUP BY a.id
    ORDER BY a.sort_order ASC, a.created_at DESC
  `);
  const data = Array.isArray(rows[0]) ? rows[0] : rows;
  return (data as any[]).map((r) => ({
    id: Number(r.id),
    title: String(r.title),
    videoCount: Number(r.video_count ?? 0),
  }));
}
