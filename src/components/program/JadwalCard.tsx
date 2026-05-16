// src/components/program/JadwalCard.tsx
import Link from "next/link";
import {
  Calendar,
  Clock,
  Building2,
  Users,
  ExternalLink,
  Zap,
} from "lucide-react";
import type { JadwalEnriched } from "@/lib/simpel/types";
import { formatTanggalJadwal, getSimpelDetailUrl } from "@/lib/simpel/jadwal";

type Props = {
  jadwal: JadwalEnriched;
};

const STATUS_CONFIG = {
  berlangsung: {
    label: "Sedang Berlangsung",
    cls: "jadwal-badge-berlangsung",
    dot: "var(--color-forest-600)",
  },
  "akan-datang": {
    label: "Akan Datang",
    cls: "jadwal-badge-mendatang",
    dot: "var(--color-gold-600)",
  },
  selesai: {
    label: "Selesai",
    cls: "jadwal-badge-selesai",
    dot: "var(--color-ink-4)",
  },
};

const JENIS_COLOR: Record<string, { bg: string; color: string }> = {
  Manajerial: { bg: "var(--color-gold-100)", color: "var(--color-gold-700)" },
  Fungsional: {
    bg: "var(--color-forest-100)",
    color: "var(--color-forest-700)",
  },
  Teknis: { bg: "#eff6ff", color: "#1d4ed8" },
  "Pemerintahan Dalam Negeri": { bg: "#fdf4ff", color: "#7e22ce" },
  Orientasi: { bg: "#fff7ed", color: "#c2410c" },
};

function getJenisStyle(jenis: string) {
  const key = Object.keys(JENIS_COLOR).find((k) =>
    jenis.toLowerCase().includes(k.toLowerCase()),
  );
  return (
    JENIS_COLOR[key ?? ""] ?? {
      bg: "var(--color-ink-7)",
      color: "var(--color-ink-3)",
    }
  );
}

// Tombol detail dipakai di dua status — ekstrak jadi komponen kecil
function DetailLink({ id, nama }: { id: number; nama: string }) {
  return (
    <Link
      href={getSimpelDetailUrl(id, nama)}
      target="_blank"
      rel="noopener noreferrer"
      className="jadwal-daftar-btn"
    >
      Detail
      <ExternalLink size={12} />
    </Link>
  );
}

export function JadwalCard({ jadwal }: Props) {
  const statusCfg = STATUS_CONFIG[jadwal.statusJadwal];
  const jenisCfg = getJenisStyle(jadwal.jenis);
  const startDate = new Date(jadwal.tgl_awal);

  return (
    <div
      className={`jadwal-card ${jadwal.statusJadwal === "selesai" ? "jadwal-card-selesai" : ""}`}
    >
      <div className="jadwal-card-inner">
        {/* ── Kolom tanggal ── */}
        <div
          className="jadwal-date-col"
          style={{
            backgroundColor:
              jadwal.statusJadwal === "berlangsung"
                ? "var(--color-forest-900)"
                : jadwal.statusJadwal === "akan-datang"
                  ? "var(--color-forest-700)"
                  : "var(--color-ink-4)",
          }}
        >
          <div className="jadwal-date-day">
            {String(startDate.getDate()).padStart(2, "0")}
          </div>
          <div className="jadwal-date-mon">
            {startDate.toLocaleDateString("id-ID", { month: "short" })}
          </div>
          <div className="jadwal-date-year">{startDate.getFullYear()}</div>
        </div>

        {/* ── Body ── */}
        <div className="jadwal-card-body">
          {/* Badges */}
          <div className="jadwal-card-badges">
            <span className={`jadwal-status-badge ${statusCfg.cls}`}>
              <span
                className="jadwal-status-dot"
                style={{ backgroundColor: statusCfg.dot }}
              />
              {statusCfg.label}
            </span>
            <span
              className="jadwal-jenis-badge"
              style={{ backgroundColor: jenisCfg.bg, color: jenisCfg.color }}
            >
              {jadwal.jenis}
            </span>
          </div>

          {/* Nama kegiatan */}
          <div className="jadwal-card-title">{jadwal.nama}</div>

          {/* Meta */}
          <div className="jadwal-card-meta">
            <span className="jadwal-meta-item">
              <Calendar size={13} />
              {formatTanggalJadwal(jadwal.tgl_awal, jadwal.tgl_akhir)}
            </span>

            <span className="jadwal-meta-sep">·</span>

            <span className="jadwal-meta-item">
              <Clock size={13} />
              {jadwal.jumHari} hari
            </span>

            <span className="jadwal-meta-sep">·</span>

            <span className="jadwal-meta-item">
              <Building2 size={13} />
              {jadwal.kelas}
            </span>
          </div>
        </div>

        {/* ── Kolom kuota ── */}
        <div className="jadwal-kuota-col">
          <Users
            size={16}
            style={{ color: "var(--color-forest-400)", marginBottom: "4px" }}
          />
          <div className="jadwal-kuota-num">{jadwal.kuota}</div>
          <div className="jadwal-kuota-label">kuota</div>

          {jadwal.statusJadwal === "berlangsung" && (
            <>
              <span className="jadwal-berlangsung-badge">
                <Zap size={10} />
                Live
              </span>
              <DetailLink id={jadwal.id} nama={jadwal.nama} />
            </>
          )}

          {jadwal.statusJadwal === "akan-datang" && (
            <DetailLink id={jadwal.id} nama={jadwal.nama} />
          )}
        </div>
      </div>
    </div>
  );
}
