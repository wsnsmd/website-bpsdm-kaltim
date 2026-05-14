// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

// ── Konfigurasi ───────────────────────────────
const MAX_SIZE_MB = 5;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "images");
const THUMB_DIR = path.join(process.cwd(), "public", "uploads", "thumbnails");

// ── Generate nama file unik ───────────────────
function generateFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const hash = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  return `${timestamp}-${hash}${ext}`;
}

// ── Slugify nama file ─────────────────────────
function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 },
      );
    }

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Tipe file tidak diizinkan. Gunakan JPG, PNG, WebP, atau GIF.",
        },
        { status: 400 },
      );
    }

    // Validasi ukuran
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Ukuran file maksimal ${MAX_SIZE_MB}MB.` },
        { status: 400 },
      );
    }

    // Buat direktori jika belum ada
    if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
    if (!existsSync(THUMB_DIR)) await mkdir(THUMB_DIR, { recursive: true });

    // Baca buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate nama file
    const fileName = generateFileName(sanitizeFileName(file.name));
    const fileNameWebP = fileName.replace(/\.[^.]+$/, ".webp");
    const thumbName = `thumb-${fileNameWebP}`;

    const filePath = path.join(UPLOAD_DIR, fileNameWebP);
    const thumbPath = path.join(THUMB_DIR, thumbName);

    // Proses dengan Sharp:
    // 1. Konversi ke WebP
    // 2. Resize jika terlalu besar (max 1920px)
    // 3. Buat thumbnail 400x300
    await Promise.all([
      sharp(buffer)
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filePath),

      sharp(buffer)
        .resize(400, 300, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 80 })
        .toFile(thumbPath),
    ]);

    // URL untuk dikembalikan
    const imageUrl = `/uploads/images/${fileNameWebP}`;
    const thumbUrl = `/uploads/thumbnails/${thumbName}`;

    // Metadata gambar
    const metadata = await sharp(filePath).metadata();

    return NextResponse.json({
      url: imageUrl,
      thumbUrl,
      fileName: fileNameWebP,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
      mimeType: "image/webp",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Gagal memproses file. Coba lagi." },
      { status: 500 },
    );
  }
}

// ── GET: list uploaded images ─────────────────
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { readdir, stat } = await import("fs/promises");

    if (!existsSync(UPLOAD_DIR)) {
      return NextResponse.json({ images: [] });
    }

    const files = await readdir(UPLOAD_DIR);
    const images = await Promise.all(
      files
        .filter((f) => f !== ".gitkeep" && !f.startsWith("."))
        .map(async (fileName) => {
          const filePath = path.join(UPLOAD_DIR, fileName);
          const thumbPath = path.join(THUMB_DIR, `thumb-${fileName}`);
          const stats = await stat(filePath);

          return {
            fileName,
            url: `/uploads/images/${fileName}`,
            thumbUrl: existsSync(thumbPath)
              ? `/uploads/thumbnails/thumb-${fileName}`
              : `/uploads/images/${fileName}`,
            size: stats.size,
            createdAt: stats.birthtime,
          };
        }),
    );

    // Sort terbaru dulu
    images.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ images });
  } catch (err) {
    console.error("List error:", err);
    return NextResponse.json({ images: [] });
  }
}

// ── DELETE: hapus gambar ──────────────────────
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json(
        { error: "fileName diperlukan" },
        { status: 400 },
      );
    }

    // Sanitasi — pastikan tidak ada path traversal
    const safeName = path.basename(fileName);
    const filePath = path.join(UPLOAD_DIR, safeName);
    const thumbPath = path.join(THUMB_DIR, `thumb-${safeName}`);

    const { unlink } = await import("fs/promises");

    if (existsSync(filePath)) await unlink(filePath);
    if (existsSync(thumbPath)) await unlink(thumbPath);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus file." },
      { status: 500 },
    );
  }
}
