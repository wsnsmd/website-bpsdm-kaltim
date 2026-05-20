// src/app/api/ppid/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPermohonanByNomor } from "@/lib/queries/ppid";

export async function GET(req: NextRequest) {
  const nomor = req.nextUrl.searchParams.get("nomor");
  if (!nomor) {
    return NextResponse.json({ error: "Nomor wajib diisi" }, { status: 400 });
  }

  const data = await getPermohonanByNomor(nomor);
  if (!data) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  // Kembalikan data terbatas (jangan expose semua field sensitif)
  return NextResponse.json({
    nomorPermohonan: data.nomorPermohonan,
    namaPemohon: data.namaPemohon,
    subjekInfo: data.subjekInfo,
    status: data.status,
    catatan: data.catatan,
    createdAt: data.createdAt,
    selesaiAt: data.selesaiAt,
    jawabanUrl: data.jawabanUrl,
  });
}
