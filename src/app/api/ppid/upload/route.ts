// src/app/api/ppid/upload/route.ts
//
// Endpoint upload PUBLIK (tanpa login) khusus untuk lampiran formulir PPID
// yang diisi masyarakat umum (upload KTP di form Permohonan, upload Surat
// Keberatan di form Keberatan). Dipisahkan dari /api/upload (yang mewajibkan
// sesi admin) karena pemohon publik tidak punya akun.
//
// Pembatasan ketat untuk mencegah penyalahgunaan:
// - Hanya menerima "purpose" yang dikenal (ktp | surat_keberatan)
// - Whitelist tipe file: JPEG/PNG/WebP/PDF saja
// - Ukuran maksimum per purpose sesuai kebutuhan form
// - Nama file di-random, tidak pernah memakai nama asli dari klien
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public/uploads/ppid-submissions");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

const PURPOSE_CONFIG: Record<string, { dir: string; maxSize: number }> = {
  ktp: { dir: "ktp", maxSize: 3 * 1024 * 1024 }, // 3MB — sesuai form Permohonan
  surat_keberatan: { dir: "keberatan", maxSize: 6 * 1024 * 1024 }, // 6MB — sesuai form Keberatan
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const purpose = formData.get("purpose") as string | null;

  if (!purpose || !PURPOSE_CONFIG[purpose]) {
    return NextResponse.json(
      { error: "Jenis unggahan tidak dikenali." },
      { status: 400 },
    );
  }
  if (!file) {
    return NextResponse.json({ error: "Tidak ada file." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipe file tidak didukung. Gunakan JPG, PNG, atau PDF." },
      { status: 400 },
    );
  }

  const { dir, maxSize } = PURPOSE_CONFIG[purpose];
  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `File terlalu besar. Maksimal ${Math.round(maxSize / 1024 / 1024)}MB.`,
      },
      { status: 400 },
    );
  }

  const targetDir = path.join(UPLOAD_ROOT, dir);
  await mkdir(targetDir, { recursive: true });

  const ext = ALLOWED_EXT[file.type];
  const timestamp = Date.now();
  const hash = Math.random().toString(36).slice(2, 10);
  const filename = `${timestamp}-${hash}.${ext}`;

  try {
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(targetDir, filename), Buffer.from(bytes));

    return NextResponse.json({
      url: `/uploads/ppid-submissions/${dir}/${filename}`,
      size: file.size,
    });
  } catch (err) {
    console.error("PPID upload error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan file. Coba lagi." },
      { status: 500 },
    );
  }
}
