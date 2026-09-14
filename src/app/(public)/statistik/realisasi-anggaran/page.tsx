// src/app/(public)/statistik/realisasi-anggaran/page.tsx
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Fragment } from "react";
import { getSiraDashboardData } from "@/lib/queries/sira";
import {
  Wallet,
  Trophy,
  TrendingUp,
  BarChart2,
  TableProperties,
  Landmark,
  ChevronRight,
} from "lucide-react";
import { RealisasiChart } from "./_components/RealisasiChart";

export const metadata: Metadata = {
  title: "Realisasi Anggaran",
  description:
    "Transparansi realisasi penyerapan anggaran dan capaian fisik Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur.",
  alternates: {
    canonical: "/statistik/realisasi-anggaran",
  },
};

export const revalidate = 3600;

// ─── Formatters ─────────────────────────────────────────────────────────────

function fmtRupiah(val: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(val)
    .replace("Rp", "Rp ");
}

function fmtPersen(val: string | number) {
  return Number(val).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Warna capaian: ≥75% hijau, 50–74% emas, <50% merah */
function persenTone(val: string | number): "green" | "gold" | "red" {
  const n = Number(val);
  if (n >= 75) return "green";
  if (n >= 50) return "gold";
  return "red";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Badge({ value }: { value: string | number }) {
  const tone = persenTone(value);
  const styles: Record<string, CSSProperties> = {
    green: { background: "#dcfce7", color: "#166534" },
    gold:  { background: "#fef9c3", color: "#92400e" },
    red:   { background: "#fee2e2", color: "#991b1b" },
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
        ...styles[tone],
      }}
    >
      {fmtPersen(value)}%
    </span>
  );
}

function ProgressBar({ value }: { value: string | number }) {
  const tone = persenTone(value);
  const fills: Record<string, string> = {
    green: "#16a34a",
    gold:  "#ca8a04",
    red:   "#dc2626",
  };
  return (
    <div
      style={{
        height: "8px",
        borderRadius: "4px",
        background: "var(--color-ink-8, #f3f4f6)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(Number(value), 100)}%`,
          height: "100%",
          borderRadius: "4px",
          background: fills[tone],
        }}
      />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function RealisasiAnggaranPage() {
  const data = await getSiraDashboardData();

  if (!data) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid var(--color-ink-6)",
          padding: "56px 48px",
          textAlign: "center",
          color: "var(--color-ink-4)",
          fontSize: "13.5px",
        }}
      >
        <Landmark size={36} style={{ margin: "0 auto 14px", opacity: 0.25 }} />
        <p style={{ fontWeight: 600, color: "var(--color-ink-2)", marginBottom: "6px" }}>
          Data belum tersedia
        </p>
        <p>Data realisasi anggaran belum tersedia untuk periode ini.</p>
      </div>
    );
  }

  return <RealisasiAnggaranContent data={data} />;
}

// ─── Content ─────────────────────────────────────────────────────────────────

function RealisasiAnggaranContent({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getSiraDashboardData>>>;
}) {
  const { summary, programs } = data;

  const bulanNama = new Date(summary.tahun, summary.periodeBulan - 1).toLocaleDateString(
    "id-ID",
    { month: "long" },
  );

  // Data untuk chart (dikirim ke client component)
  const chartData = programs.map((p) => ({
    label: p.namaProgram.replace(/^Program\s+/i, ""),
    keuangan: Number(p.persenKeuangan),
    fisik: Number(p.persenFisik),
  }));

  const devKeu = Number(summary.deviasiKeuangan ?? 0);
  const devFis = Number(summary.deviasiFisik ?? 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#0F2D1F",
          borderRadius: "16px",
          padding: "24px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* dot pattern */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* top row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "9px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Wallet size={17} color="rgba(255,255,255,0.75)" />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                  Realisasi Anggaran BPSDM Kaltim
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "2px" }}>
                  Ditarik otomatis dari SIRA Provinsi Kalimantan Timur
                </div>
              </div>
            </div>

            {summary.peringkatSkpd && summary.totalSkpd ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  background: "rgba(252,211,77,0.12)",
                  border: "1px solid rgba(252,211,77,0.28)",
                }}
              >
                <Trophy size={12} color="#FCD34D" />
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#FCD34D" }}>
                  Peringkat #{summary.peringkatSkpd} dari {summary.totalSkpd} SKPD
                </span>
              </div>
            ) : null}
          </div>

          {/* hero body: big % + stats */}
          <div className="sira-hero-grid">
            {/* big number */}
            <div>
              <div
                style={{
                  fontSize: "68px",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {fmtPersen(summary.persenKeuangan)}%
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "10px" }}>
                Realisasi keuangan terhadap pagu
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "3px" }}>
                Periode {bulanNama} {summary.tahun}
              </div>
            </div>

            {/* right stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center" }}>
              {[
                { label: "Pagu total",           val: fmtRupiah(summary.paguTotal),          gold: false },
                { label: "Realisasi keuangan",   val: fmtRupiah(summary.realisasiKeuangan),  gold: false },
                { label: "Sisa pagu",            val: fmtRupiah(summary.sisaPagu),           gold: false },
                { label: "Realisasi fisik",      val: `${fmtPersen(summary.persenFisik)}%`,  gold: true  },
              ].map(({ label, val, gold }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                  <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.42)" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: gold ? "#FCD34D" : "#fff", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Strip ────────────────────────────────────────────────── */}
      <div className="sira-kpi-strip">
        <KpiCell
          label="Pagu anggaran"
          value={fmtRupiah(summary.paguTotal)}
          sub={`Penyedia: ${fmtRupiah(summary.paguPenyedia)} · Non: ${fmtRupiah(summary.paguNonPenyedia)}`}
        />
        <KpiCell
          label="Realisasi keuangan"
          value={fmtRupiah(summary.realisasiKeuangan)}
          valueColor="#166534"
          badge={<Badge value={summary.persenKeuangan} />}
        />
        <KpiCell
          label="Sisa pagu"
          value={fmtRupiah(summary.sisaPagu)}
          sub={`Belum terserap hingga ${bulanNama}`}
        />
        <KpiCell
          label="Realisasi fisik"
          value={`${fmtPersen(summary.persenFisik)}%`}
          badge={<Badge value={summary.persenFisik} />}
        />
      </div>

      {/* ── 3. Target & Deviasi ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid var(--color-ink-6)",
          padding: "18px 22px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)" }}>
            Target &amp; Deviasi Kinerja BPSDM Kaltim
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-ink-4)", marginTop: "2px" }}>
            Perbandingan target rekapitulasi SKPD terhadap realisasi aktual
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <DevItem label="Target keuangan" value={`${fmtPersen(summary.targetKeuangan ?? 0)}%`} />
          <DevItem
            label="Deviasi keuangan"
            value={devKeu > 0 ? `+${fmtPersen(devKeu)}%` : `${fmtPersen(devKeu)}%`}
            color={devKeu < 0 ? "#991b1b" : "#166534"}
          />
          <DevItem label="Target fisik" value={`${fmtPersen(summary.targetFisik ?? 0)}%`} />
          <DevItem
            label="Deviasi fisik"
            value={devFis > 0 ? `+${fmtPersen(devFis)}%` : `${fmtPersen(devFis)}%`}
            color={devFis < 0 ? "#991b1b" : "#166534"}
          />
        </div>
      </div>

      {/* ── 4. Chart (client component) ─────────────────────────────────── */}
      <div>
        <SectionTitle icon={<BarChart2 size={16} color="#166534" />}>
          Realisasi per program
        </SectionTitle>
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            padding: "20px 22px",
          }}
        >
          {/* legend */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[
              { color: "#16a34a", label: "≥ 75% — baik" },
              { color: "#ca8a04", label: "50–74% — sedang" },
              { color: "#dc2626", label: "< 50% — rendah" },
            ].map(({ color, label }) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11.5px", color: "var(--color-ink-4)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "2px", background: color, flexShrink: 0 }} />
                {label}
              </span>
            ))}
          </div>
          <RealisasiChart data={chartData} />
        </div>
      </div>

      {/* ── 5. Program breakdown bars ───────────────────────────────────── */}
      <div>
        <SectionTitle icon={<TrendingUp size={16} color="#166534" />}>
          Rincian per program
        </SectionTitle>

        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            overflow: "hidden",
          }}
        >
          {/* header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 80px 80px",
              gap: "12px",
              padding: "10px 22px",
              borderBottom: "1px solid var(--color-ink-6)",
              background: "var(--color-ink-8, #f9fafb)",
            }}
          >
            {["Program", "Progress keuangan", "Keuangan", "Fisik"].map((h) => (
              <div key={h} style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--color-ink-4)", textAlign: h === "Program" || h === "Progress keuangan" ? "left" : "center" }}>
                {h}
              </div>
            ))}
          </div>

          {programs.map((prog, i) => (
            <div
              key={prog.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 80px 80px",
                gap: "12px",
                alignItems: "center",
                padding: "14px 22px",
                borderBottom: i < programs.length - 1 ? "1px solid var(--color-ink-7, #f3f4f6)" : "none",
              }}
            >
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-ink)", lineHeight: 1.3 }}>
                  {prog.namaProgram}
                </div>
                <div style={{ fontSize: "10px", color: "var(--color-ink-5)", fontFamily: "monospace", marginTop: "3px" }}>
                  {prog.kodeProgram}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <ProgressBar value={prog.persenKeuangan} />
                <div style={{ fontSize: "10.5px", color: "var(--color-ink-4)" }}>
                  {fmtRupiah(prog.realisasiKeuangan)} / {fmtRupiah(prog.pagu)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}><Badge value={prog.persenKeuangan} /></div>
              <div style={{ textAlign: "center" }}><Badge value={prog.persenFisik} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Tabel rincian kegiatan & sub kegiatan ────────────────────── */}
      <div>
        <SectionTitle icon={<TableProperties size={16} color="#166534" />}>
          Rincian kegiatan &amp; sub kegiatan
        </SectionTitle>

        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid var(--color-ink-6)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-ink-8, #f9fafb)", borderBottom: "1px solid var(--color-ink-6)" }}>
                  <th style={thStyle}>Kegiatan / Sub Kegiatan</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Pagu</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Realisasi</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Keuangan</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Fisik</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((prog) => (
                  <Fragment key={prog.id}>
                    {/* Program header row */}
                    <tr style={{ background: "#f0fdf4" }}>
                      <td
                        colSpan={5}
                        style={{
                          padding: "9px 22px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#166534",
                          borderBottom: "1px solid #dcfce7",
                        }}
                      >
                        <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#4ade80", marginRight: "8px" }}>
                          {prog.kodeProgram}
                        </span>
                        {prog.namaProgram}
                      </td>
                    </tr>

                    {/* Kegiatan */}
                    {prog.kegiatan.map((keg) => (
                      <tr key={keg.id} style={{ borderBottom: "1px solid var(--color-ink-7, #f3f4f6)" }}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>
                          {keg.nama}
                          <div style={{ fontSize: "10px", color: "var(--color-ink-5)", fontFamily: "monospace", marginTop: "2px" }}>
                            {keg.kode}
                          </div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>{fmtRupiah(keg.pagu)}</td>
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: "#166534" }}>{fmtRupiah(keg.realisasiKeuangan)}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}><Badge value={keg.persenKeuangan} /></td>
                        <td style={{ ...tdStyle, textAlign: "center" }}><Badge value={keg.persenFisik} /></td>
                      </tr>
                    ))}

                    {/* Sub Kegiatan */}
                    {prog.subKegiatan.map((sub) => (
                      <tr key={sub.id} style={{ borderBottom: "1px solid var(--color-ink-7, #f3f4f6)" }}>
                        <td style={{ ...tdStyle, paddingLeft: "38px", color: "var(--color-ink-3)" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <ChevronRight size={11} color="var(--color-ink-5)" />
                            {sub.nama}
                          </span>
                          <div style={{ fontSize: "10px", color: "var(--color-ink-5)", fontFamily: "monospace", marginLeft: "15px", marginTop: "2px" }}>
                            {sub.kode}
                          </div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>{fmtRupiah(sub.pagu)}</td>
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: "#166534" }}>{fmtRupiah(sub.realisasiKeuangan)}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}><Badge value={sub.persenKeuangan} /></td>
                        <td style={{ ...tdStyle, textAlign: "center" }}><Badge value={sub.persenFisik} /></td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Footer note ─────────────────────────────────────────────────── */}
      <p
        style={{
          fontSize: "11px",
          color: "var(--color-ink-5)",
          lineHeight: 1.6,
          margin: "0 2px",
        }}
      >
        Sumber: Sistem Informasi Rencana Anggaran (SIRA) Provinsi Kalimantan Timur —
        ditarik otomatis secara berkala.
      </p>
    </div>
  );
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--color-ink)",
        marginBottom: "10px",
      }}
    >
      {icon}
      {children}
    </div>
  );
}

function KpiCell({
  label,
  value,
  valueColor,
  sub,
  badge,
}: {
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div style={{ padding: "18px 20px" }}>
      <div style={{ fontSize: "11px", color: "var(--color-ink-4)" }}>{label}</div>
      <div
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: valueColor ?? "var(--color-ink)",
          marginTop: "5px",
          lineHeight: 1.2,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "10.5px", color: "var(--color-ink-5)", marginTop: "6px" }}>
          {sub}
        </div>
      )}
      {badge && <div style={{ marginTop: "6px" }}>{badge}</div>}
    </div>
  );
}

function DevItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: "10.5px", color: "var(--color-ink-5)" }}>{label}</div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: color ?? "var(--color-ink)",
          marginTop: "3px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const thStyle: CSSProperties = {
  padding: "10px 22px",
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--color-ink-4)",
  textAlign: "left",
  letterSpacing: "0.03em",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  padding: "10px 22px",
  fontSize: "12px",
  color: "var(--color-ink-2)",
  fontVariantNumeric: "tabular-nums",
};
