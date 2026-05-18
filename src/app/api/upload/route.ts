// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import { auth } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const IMAGE_DIR = path.join(UPLOAD_DIR, "images");
const DOC_DIR = path.join(UPLOAD_DIR, "documents");
const THUMB_DIR = path.join(UPLOAD_DIR, "thumbnails");

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.includes(file.type);
  const isDoc =
    DOC_TYPES.includes(file.type) ||
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip)$/i.test(file.name);

  if (!isImage && !isDoc) {
    return NextResponse.json(
      {
        error: "Tipe file tidak didukung.",
      },
      { status: 400 },
    );
  }

  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `File terlalu besar. Maksimal ${isImage ? "5" : "50"}MB.`,
      },
      { status: 400 },
    );
  }

  // Generate nama file unik
  const timestamp = Date.now();
  const hash = Math.random().toString(36).slice(2, 8);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .slice(0, 40);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    if (isImage) {
      // Proses gambar dengan Sharp → WebP
      await mkdir(IMAGE_DIR, { recursive: true });
      await mkdir(THUMB_DIR, { recursive: true });

      const filename = `${timestamp}-${hash}-${safeName}.webp`;
      const thumbName = `${timestamp}-${hash}-${safeName}-thumb.webp`;

      await sharp(buffer)
        .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(IMAGE_DIR, filename));

      await sharp(buffer)
        .resize(400, 300, { fit: "cover" })
        .webp({ quality: 75 })
        .toFile(path.join(THUMB_DIR, thumbName));

      return NextResponse.json({
        url: `/uploads/images/${filename}`,
        thumbnail: `/uploads/thumbnails/${thumbName}`,
        size: file.size,
        type: "image",
      });
    } else {
      // Simpan dokumen langsung tanpa processing
      await mkdir(DOC_DIR, { recursive: true });

      const filename = `${timestamp}-${hash}-${safeName}.${ext}`;
      await writeFile(path.join(DOC_DIR, filename), buffer);

      return NextResponse.json({
        url: `/uploads/documents/${filename}`,
        size: file.size,
        type: "document",
        ext,
      });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan file." },
      { status: 500 },
    );
  }
}
