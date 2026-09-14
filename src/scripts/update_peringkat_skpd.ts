import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function updatePeringkat() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1Sampai9!@#",
    database: process.env.DB_NAME || "app_website",
  });

  await conn.execute(
    "UPDATE sira_summary SET peringkat_skpd = 6, total_skpd = 35 WHERE tahun = 2026 AND periode_bulan = 9"
  );

  console.log("Peringkat SKPD BPSDM berhasil diupdate menjadi #6 dari 35 SKPD!");
  await conn.end();
}

updatePeringkat().catch(console.error);
