// src/scripts/migrate-wp.ts
import mysql from "mysql2/promise";
import { db } from "@/db";
import { posts, categories } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// ── Config ────────────────────────────────────
const WP_HOST = process.env.WP_DB_HOST ?? "127.0.0.1";
const WP_PORT = Number(process.env.WP_DB_PORT ?? 3306);
const WP_DB = process.env.WP_DB_NAME ?? "wordpress_db";
const WP_USER = process.env.WP_DB_USER ?? "root";
const WP_PASS = process.env.WP_DB_PASS ?? "";
const WP_PREFIX = process.env.WP_TABLE_PREFIX ?? "wp_";

// ── Helpers ───────────────────────────────────
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 200);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

// Konversi URL gambar WordPress ke URL baru
function migrateImageUrl(url: string | null): string | null {
  if (!url) return null;
  // Ganti domain WordPress lama dengan domain baru jika perlu
  //   const WP_DOMAIN = process.env.WP_OLD_DOMAIN ?? "";
  //   const NEW_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  //   if (WP_DOMAIN && NEW_DOMAIN) {
  //     return url.replace(WP_DOMAIN, NEW_DOMAIN);
  //   }
  return url;
}

// ── Main ──────────────────────────────────────
async function migrate() {
  const DRY_RUN = process.argv.includes("--dry-run");

  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE — tidak ada data yang diinsert\n");
  }

  console.log("🚀 Mulai migrasi WordPress → BPSDM...\n");

  // Koneksi ke WordPress DB
  const wpConn = await mysql.createConnection({
    host: WP_HOST,
    port: WP_PORT,
    database: WP_DB,
    user: WP_USER,
    password: WP_PASS,
    charset: "utf8mb4",
  });

  console.log("✓ Terhubung ke WordPress DB");

  // ── Step 1: Ambil kategori WordPress ──
  console.log("\n📂 Mengambil kategori...");

  const [wpCats] = await wpConn.execute<any[]>(`
    SELECT
      t.term_id,
      t.name,
      t.slug
    FROM ${WP_PREFIX}terms t
    INNER JOIN ${WP_PREFIX}term_taxonomy tt
      ON t.term_id = tt.term_id
    WHERE tt.taxonomy = 'category'
      AND t.slug != 'uncategorized'
    ORDER BY t.name
  `);

  console.log(`   Ditemukan ${wpCats.length} kategori`);

  // Map WordPress category_id → local category_id
  const catMap = new Map<number, number>();

  for (const wpCat of wpCats) {
    // Cek apakah kategori sudah ada
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, wpCat.slug))
      .limit(1);

    if (existing[0]) {
      catMap.set(wpCat.term_id, existing[0].id);
      console.log(`   ↻ Skip kategori "${wpCat.name}" (sudah ada)`);
    } else {
      const result = await db.insert(categories).values({
        name: wpCat.name,
        slug: wpCat.slug,
      });
      const newId = Number((result as any).insertId);
      catMap.set(wpCat.term_id, newId);
      console.log(`   + Tambah kategori "${wpCat.name}"`);
    }
  }

  // ── Step 2: Ambil posts WordPress ──
  console.log("\n📰 Mengambil berita...");

  const [wpPosts] = await wpConn.execute<any[]>(`
    SELECT
      p.ID,
      p.post_title,
      p.post_name       AS slug,
      p.post_content,
      p.post_excerpt,
      p.post_date       AS published_at,
      p.post_modified   AS updated_at,
      p.post_author,
      u.display_name    AS author_name,
      pm.meta_value     AS featured_image_id
    FROM ${WP_PREFIX}posts p
    LEFT JOIN ${WP_PREFIX}users u
      ON p.post_author = u.ID
    LEFT JOIN ${WP_PREFIX}postmeta pm
      ON p.ID = pm.post_id
      AND pm.meta_key = '_thumbnail_id'
    WHERE p.post_type   = 'post'
      AND p.post_status = 'publish'
    GROUP BY p.ID
    ORDER BY p.post_date DESC
  `);

  console.log(`   Ditemukan ${wpPosts.length} berita\n`);

  // ── Step 3: Ambil URL featured image ──
  async function getFeaturedImageUrl(
    imageId: string | null,
  ): Promise<string | null> {
    if (!imageId) return null;
    const [rows] = await wpConn.execute<any[]>(
      `
      SELECT guid FROM ${WP_PREFIX}posts
      WHERE ID = ? AND post_type = 'attachment'
      LIMIT 1
    `,
      [imageId],
    );
    return migrateImageUrl(rows[0]?.guid ?? null);
  }

  // ── Step 4: Ambil kategori tiap post ──
  async function getPostCategory(postId: number): Promise<number | null> {
    const [rows] = await wpConn.execute<any[]>(
      `
      SELECT t.term_id
      FROM ${WP_PREFIX}term_relationships tr
      INNER JOIN ${WP_PREFIX}term_taxonomy tt
        ON tr.term_taxonomy_id = tt.term_taxonomy_id
      INNER JOIN ${WP_PREFIX}terms t
        ON tt.term_id = t.term_id
      WHERE tr.object_id = ?
        AND tt.taxonomy = 'category'
        AND t.slug != 'uncategorized'
      LIMIT 1
    `,
      [postId],
    );

    if (!rows[0]) return null;
    return catMap.get(rows[0].term_id) ?? null;
  }

  // ── Step 5: Insert posts ──
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const wp of wpPosts) {
    try {
      // Cek apakah slug sudah ada
      const existing = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, wp.slug))
        .limit(1);

      if (existing[0]) {
        skipped++;
        process.stdout.write(`   ↻ Skip: ${wp.post_title.slice(0, 50)}\n`);
        continue;
      }

      // Ambil data tambahan
      const [featuredImage, categoryId] = await Promise.all([
        getFeaturedImageUrl(wp.featured_image_id),
        getPostCategory(wp.ID),
      ]);

      // Generate excerpt jika kosong
      const excerpt =
        wp.post_excerpt?.trim() || stripHtml(wp.post_content).slice(0, 280);

      // Hitung reading time
      const wordCount = wp.post_content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      if (DRY_RUN) {
        console.log(
          `   [DRY] ${wp.post_title.slice(0, 60)} → kategori: ${categoryId}`,
        );
        inserted++;
      } else {
        await db.insert(posts).values({
          title: wp.post_title,
          slug: wp.slug || slugify(wp.post_title),
          content: wp.post_content,
          excerpt: excerpt || null,
          status: "published",
          categoryId: categoryId,
          featuredImage: featuredImage,
          authorName: wp.author_name ?? "Humas BPSDM Kaltim",
          readingTime,
          publishedAt: new Date(wp.published_at),
          updatedAt: new Date(wp.updated_at),
          viewCount: 0,
          isFeatured: false,
        });

        inserted++;
        process.stdout.write(`   ✓ ${wp.post_title.slice(0, 60)}\n`);
      }
    } catch (err: any) {
      errors++;
      console.error(
        `   ✗ ERROR [${wp.post_title.slice(0, 40)}]: ${err.message}`,
      );
    }
  }

  // ── Ringkasan ──────────────────────────────
  await wpConn.end();

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Migrasi Selesai!

   Total WP post : ${wpPosts.length}
   Berhasil      : ${inserted}
   Dilewati      : ${skipped} (slug duplikat)
   Error         : ${errors}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  process.exit(0);
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
