import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function insertData() {
  const raw = fs.readFileSync("/tmp/sira_scraped_data.json", "utf-8");
  const data = JSON.parse(raw);
  const summary = data.summary;

  const conn = await mysql.createConnection({
    host: process.env.DB_WEB_HOST || "127.0.0.1",
    port: Number(process.env.DB_WEB_PORT) || 3306,
    user: process.env.DB_WEB_USER || "root",
    password: process.env.DB_WEB_PASSWORD || "1Sampai9!@#",
    database: process.env.DB_WEB_NAME || "app_website",
  });

  console.log("Menyimpan summary ke DB...");
  const [sumRes] = await conn.execute(
    `INSERT INTO sira_summary
      (tahun, periode_bulan, pagu_total, realisasi_keuangan, persen_keuangan, sisa_pagu, persen_fisik, pagu_penyedia, pagu_non_penyedia, peringkat_skpd, total_skpd, target_keuangan, target_fisik, deviasi_keuangan, deviasi_fisik)
     VALUES (2026, 9, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      pagu_total = VALUES(pagu_total),
      realisasi_keuangan = VALUES(realisasi_keuangan),
      persen_keuangan = VALUES(persen_keuangan),
      sisa_pagu = VALUES(sisa_pagu),
      persen_fisik = VALUES(persen_fisik),
      pagu_penyedia = VALUES(pagu_penyedia),
      pagu_non_penyedia = VALUES(pagu_non_penyedia),
      peringkat_skpd = VALUES(peringkat_skpd),
      total_skpd = VALUES(total_skpd),
      target_keuangan = VALUES(target_keuangan),
      target_fisik = VALUES(target_fisik),
      deviasi_keuangan = VALUES(deviasi_keuangan),
      deviasi_fisik = VALUES(deviasi_fisik),
      updated_at = NOW()`,
    [
      summary.pagu,
      summary.realisasi_keuangan,
      summary.persen_keuangan,
      summary.sisa_pagu,
      summary.persen_fisik,
      summary.pagu_penyedia,
      summary.pagu_non_penyedia,
      summary.peringkat,
      summary.total_skpd,
      summary.target_keuangan || 0,
      summary.target_fisik || 0,
      summary.deviasi_keuangan || 0,
      summary.deviasi_fisik || 0,
    ]
  );

  const [rows] = await conn.execute(
    "SELECT id FROM sira_summary WHERE tahun = 2026 AND periode_bulan = 9"
  );
  const summaryId = (rows as any[])[0].id;
  console.log("Summary ID:", summaryId);

  let totalProg = 0;
  let totalAct = 0;

  for (const prog of data.programs) {
    await conn.execute(
      `INSERT INTO sira_programs
        (summary_id, kode_program, nama_program, pagu, realisasi_keuangan, persen_keuangan, sisa_pagu, persen_fisik, pagu_penyedia, pagu_non_penyedia)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        nama_program = VALUES(nama_program),
        pagu = VALUES(pagu),
        realisasi_keuangan = VALUES(realisasi_keuangan),
        persen_keuangan = VALUES(persen_keuangan),
        sisa_pagu = VALUES(sisa_pagu),
        persen_fisik = VALUES(persen_fisik),
        pagu_penyedia = VALUES(pagu_penyedia),
        pagu_non_penyedia = VALUES(pagu_non_penyedia)`,
      [
        summaryId,
        prog.kode,
        prog.nama,
        prog.pagu,
        prog.realisasi_keuangan,
        prog.persen_keuangan,
        prog.sisa_pagu,
        prog.persen_fisik,
        prog.pagu_penyedia,
        prog.pagu_non_penyedia,
      ]
    );
    totalProg++;

    const [progRows] = await conn.execute(
      "SELECT id FROM sira_programs WHERE summary_id = ? AND kode_program = ?",
      [summaryId, prog.kode]
    );
    const programId = (progRows as any[])[0].id;

    for (const act of prog.activities) {
      await conn.execute(
        `INSERT INTO sira_activities
          (program_id, kode, nama, level, pagu, realisasi_keuangan, persen_keuangan, sisa_pagu, persen_fisik, paket_rup, jumlah_sp2d)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          nama = VALUES(nama),
          level = VALUES(level),
          pagu = VALUES(pagu),
          realisasi_keuangan = VALUES(realisasi_keuangan),
          persen_keuangan = VALUES(persen_keuangan),
          sisa_pagu = VALUES(sisa_pagu),
          persen_fisik = VALUES(persen_fisik),
          paket_rup = VALUES(paket_rup),
          jumlah_sp2d = VALUES(jumlah_sp2d)`,
        [
          programId,
          act.kode,
          act.nama,
          act.level,
          act.pagu,
          act.realisasi_keuangan,
          act.persen_keuangan,
          act.sisa_pagu,
          act.persen_fisik,
          act.paket_rup,
          act.jumlah_sp2d,
        ]
      );
      totalAct++;
    }
  }

  console.log(`Sukses menyimpan: ${totalProg} program & ${totalAct} aktivitas ke MariaDB!`);
  await conn.end();
}

insertData().catch(console.error);
