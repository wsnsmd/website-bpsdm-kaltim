import { mysqlTable, int, bigint, decimal, timestamp, text, tinyint, smallint, year, uniqueIndex } from "drizzle-orm/mysql-core";

export const siraSummary = mysqlTable("sira_summary", {
  id: int("id").autoincrement().primaryKey(),
  tahun: year("tahun").notNull().default(2026),
  periodeBulan: tinyint("periode_bulan").notNull().default(9),
  paguTotal: bigint("pagu_total", { mode: "number" }).notNull().default(0),
  realisasiKeuangan: bigint("realisasi_keuangan", { mode: "number" }).notNull().default(0),
  persenKeuangan: decimal("persen_keuangan", { precision: 5, scale: 2 }).notNull().default("0.00"),
  sisaPagu: bigint("sisa_pagu", { mode: "number" }).notNull().default(0),
  persenFisik: decimal("persen_fisik", { precision: 5, scale: 2 }).notNull().default("0.00"),
  paguPenyedia: bigint("pagu_penyedia", { mode: "number" }).notNull().default(0),
  paguNonPenyedia: bigint("pagu_non_penyedia", { mode: "number" }).notNull().default(0),
  peringkatSkpd: tinyint("peringkat_skpd"),
  totalSkpd: smallint("total_skpd"),
  targetKeuangan: decimal("target_keuangan", { precision: 5, scale: 2 }).notNull().default("0.00"),
  targetFisik: decimal("target_fisik", { precision: 5, scale: 2 }).notNull().default("0.00"),
  deviasiKeuangan: decimal("deviasi_keuangan", { precision: 5, scale: 2 }).notNull().default("0.00"),
  deviasiFisik: decimal("deviasi_fisik", { precision: 5, scale: 2 }).notNull().default("0.00"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  uqPeriode: uniqueIndex("uq_periode").on(table.tahun, table.periodeBulan),
}));

export const siraPrograms = mysqlTable("sira_programs", {
  id: int("id").autoincrement().primaryKey(),
  summaryId: int("summary_id").notNull(),
  kodeProgram: text("kode_program").notNull(),
  namaProgram: text("nama_program").notNull(),
  pagu: bigint("pagu", { mode: "number" }).notNull().default(0),
  realisasiKeuangan: bigint("realisasi_keuangan", { mode: "number" }).notNull().default(0),
  persenKeuangan: decimal("persen_keuangan", { precision: 5, scale: 2 }).notNull().default("0.00"),
  sisaPagu: bigint("sisa_pagu", { mode: "number" }).notNull().default(0),
  persenFisik: decimal("persen_fisik", { precision: 5, scale: 2 }).notNull().default("0.00"),
  paguPenyedia: bigint("pagu_penyedia", { mode: "number" }).notNull().default(0),
  paguNonPenyedia: bigint("pagu_non_penyedia", { mode: "number" }).notNull().default(0),
}, (table) => ({
  uqProgram: uniqueIndex("uq_program").on(table.summaryId, table.kodeProgram),
}));

export const siraActivities = mysqlTable("sira_activities", {
  id: int("id").autoincrement().primaryKey(),
  programId: int("program_id").notNull(),
  kode: text("kode").notNull(),
  nama: text("nama").notNull(),
  level: tinyint("level").notNull().default(1),
  pagu: bigint("pagu", { mode: "number" }).notNull().default(0),
  realisasiKeuangan: bigint("realisasi_keuangan", { mode: "number" }).notNull().default(0),
  persenKeuangan: decimal("persen_keuangan", { precision: 5, scale: 2 }).notNull().default("0.00"),
  sisaPagu: bigint("sisa_pagu", { mode: "number" }).notNull().default(0),
  persenFisik: decimal("persen_fisik", { precision: 5, scale: 2 }).notNull().default("0.00"),
  paketRup: smallint("paket_rup").notNull().default(0),
  jumlahSp2d: smallint("jumlah_sp2d").notNull().default(0),
}, (table) => ({
  uqActivity: uniqueIndex("uq_activity").on(table.programId, table.kode),
}));
