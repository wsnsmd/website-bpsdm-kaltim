// src/lib/simpel/jadwal.ts
import type { JadwalSimpel, JadwalEnriched, StatusJadwal } from "./types";

const SIMPEL_API = "https://simpel.kaltimprov.go.id/api/jadwal";

// ── Kalkulasi status dari tanggal ─────────────
function getStatusJadwal(tglAwal: string, tglAkhir: string): StatusJadwal {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(tglAwal);
  const end = new Date(tglAkhir);
  end.setHours(23, 59, 59, 999);

  if (today >= start && today <= end) return "berlangsung";
  if (today > end) return "selesai";
  return "akan-datang";
}

function getJumHari(tglAwal: string, tglAkhir: string): number {
  const start = new Date(tglAwal).getTime();
  const end = new Date(tglAkhir).getTime();
  return Math.round((end - start) / 86400000) + 1;
}

function enrichJadwal(jadwal: JadwalSimpel): JadwalEnriched {
  return {
    ...jadwal,
    statusJadwal: getStatusJadwal(jadwal.tgl_awal, jadwal.tgl_akhir),
    statusRegistrasi: "tutup", // API tidak expose reg_awal/reg_akhir
    jumHari: getJumHari(jadwal.tgl_awal, jadwal.tgl_akhir),
  };
}

// ── Fetch semua jadwal ────────────────────────
export async function fetchJadwal(
  options: {
    jenis?: string;
    status?: StatusJadwal;
  } = {},
): Promise<JadwalEnriched[]> {
  const { jenis, status } = options;

  try {
    const res = await fetch(SIMPEL_API, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error("SIMPEL API error:", res.status);
      return [];
    }

    const data: JadwalSimpel[] = await res.json();
    let enriched = data.map(enrichJadwal);

    if (jenis) {
      enriched = enriched.filter(
        (j) => j.jenis.toLowerCase() === jenis.toLowerCase(),
      );
    }

    if (status) {
      enriched = enriched.filter((j) => j.statusJadwal === status);
    }

    enriched.sort((a, b) => {
      const order: Record<string, number> = {
        berlangsung: 0,
        "akan-datang": 1,
        selesai: 2,
      };
      const diff = order[a.statusJadwal] - order[b.statusJadwal];
      if (diff !== 0) return diff;
      return new Date(a.tgl_awal).getTime() - new Date(b.tgl_awal).getTime();
    });

    return enriched;
  } catch (err) {
    console.error("Gagal fetch jadwal SIMPEL:", err);
    return [];
  }
}

// ── Fetch jadwal mendatang saja ───────────────
export async function fetchJadwalMendatang(
  limit = 5,
): Promise<JadwalEnriched[]> {
  const semua = await fetchJadwal({ status: "akan-datang" });
  return semua.slice(0, limit);
}

// ── Fetch jadwal berlangsung ──────────────────
export async function fetchJadwalBerlangsung(): Promise<JadwalEnriched[]> {
  return fetchJadwal({ status: "berlangsung" });
}

// ── Get daftar jenis unik ─────────────────────
export async function fetchJenisJadwal(): Promise<string[]> {
  try {
    const res = await fetch(SIMPEL_API, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data: JadwalSimpel[] = await res.json();
    return [...new Set(data.map((j) => j.jenis))].sort();
  } catch {
    return [];
  }
}

// ── Format tanggal Indonesia ──────────────────
export function formatTanggalJadwal(tglAwal: string, tglAkhir: string): string {
  const s = new Date(tglAwal);
  const e = new Date(tglAkhir);

  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
  };
  const optsYear: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (tglAwal === tglAkhir) {
    return s.toLocaleDateString("id-ID", optsYear);
  }

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.toLocaleDateString("id-ID", optsYear)}`;
  }

  return `${s.toLocaleDateString("id-ID", opts)} – ${e.toLocaleDateString("id-ID", optsYear)}`;
}

export function toSimpelSlug(nama: string): string {
  return nama
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // hapus karakter aneh
    .replace(/\s+/g, "-") // spasi → strip
    .replace(/-+/g, "-") // strip ganda → satu
    .trim();
}

export function getSimpelDetailUrl(id: number, nama: string): string {
  const slug = toSimpelSlug(nama);
  return `https://simpel.kaltimprov.go.id/jadwal/${id}/${slug}/detail`;
}
