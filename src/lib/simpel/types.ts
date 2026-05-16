// src/lib/simpel/types.ts

export type JadwalSimpel = {
  id: number;
  nama: string;
  kuota: number;
  tgl_awal: string; // "YYYY-MM-DD"
  tgl_akhir: string; // "YYYY-MM-DD"
  tahun: number;
  kelas: string;
  jenis: string;
  status: string; // status dari DB
};

// Status yang dihitung dari tanggal (seperti status_jadwal di query)
export type StatusJadwal = "berlangsung" | "akan-datang" | "selesai";
export type StatusRegistrasi = "buka" | "tutup";

// Jadwal yang sudah diperkaya dengan status kalkulasi
export type JadwalEnriched = JadwalSimpel & {
  statusJadwal: StatusJadwal;
  statusRegistrasi: StatusRegistrasi;
  jumHari: number;
};
