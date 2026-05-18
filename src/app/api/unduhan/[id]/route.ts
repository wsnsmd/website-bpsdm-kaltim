// src/app/api/unduhan/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, eq } from "@/db";
import { documents } from "@/db/schema";
import { incrementDownloadCount } from "@/lib/queries/documents";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Map ekstensi ke MIME type
const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ppt: "application/vnd.ms-powerpoint",
  zip: "application/zip",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const docId = Number(id);

  if (isNaN(docId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id, docId))
    .limit(1);

  const doc = result[0];
  if (!doc) {
    return NextResponse.json(
      { error: "Dokumen tidak ditemukan" },
      { status: 404 },
    );
  }

  // Tambah counter (non-blocking)
  incrementDownloadCount(docId).catch(console.error);

  // Jika ada fileUrl (upload lokal) — serve langsung
  if (doc.fileUrl) {
    // fileUrl format: /uploads/documents/filename.pdf
    // Path fisik: public/uploads/documents/filename.pdf
    const relativePath = doc.fileUrl.startsWith("/")
      ? doc.fileUrl.slice(1) // hapus leading slash
      : doc.fileUrl;

    const filePath = path.join(process.cwd(), "public", relativePath);

    if (!existsSync(filePath)) {
      console.error("File tidak ditemukan di:", filePath);
      return NextResponse.json(
        {
          error: "File tidak ditemukan di server",
        },
        { status: 404 },
      );
    }

    try {
      const fileBuffer = await readFile(filePath);
      const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
      const mimeType = MIME_TYPES[ext] ?? "application/octet-stream";
      const filename = path.basename(filePath);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": String(fileBuffer.length),
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (err) {
      console.error("Error membaca file:", err);
      return NextResponse.json(
        { error: "Gagal membaca file" },
        { status: 500 },
      );
    }
  }

  // Jika ada externalUrl — redirect langsung
  if (doc.externalUrl) {
    return NextResponse.redirect(doc.externalUrl);
  }

  return NextResponse.json(
    { error: "Tidak ada file tersedia" },
    { status: 404 },
  );
}
