// src/components/home/AgendaSection.tsx
import Link from "next/link";
import { CalendarDays, Download, FileText, ArrowRight } from "lucide-react";
import type { JadwalEnriched } from "@/lib/simpel/types";
import { formatTanggalJadwal } from "@/lib/simpel/jadwal";
import { getDocuments } from "@/lib/queries/documents";
import { formatFileSize } from "@/components/ui/FileIcon";

type Props = {
  jadwalList: JadwalEnriched[];
};

const FILE_TYPE_COLOR: Record<string, string> = {
  pdf: "#dc2626",
  docx: "#1d4ed8",
  doc: "#1d4ed8",
  xlsx: "#16a34a",
  xls: "#16a34a",
  pptx: "#c2410c",
};

export async function AgendaSection({ jadwalList }: Props) {
  // Ambil 4 dokumen terbaru dari DB
  const docs = await getDocuments({ limit: 5 });

  return (
    <section
      style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "4rem" }}
    >
      <div className="container-content">
        <div className="agenda-grid">
          {/* ── Agenda dari SIMPEL ── */}
          <div className="agenda-card">
            <div className="agenda-head">
              <div className="agenda-head-left">
                <CalendarDays
                  size={18}
                  style={{ color: "var(--color-forest-400)" }}
                />
                <span>Agenda Kegiatan</span>
              </div>
              <Link href="/program/jadwal" className="agenda-head-link">
                Semua <ArrowRight size={14} />
              </Link>
            </div>

            <div className="agenda-body">
              {jadwalList.length === 0 ? (
                <div
                  style={{
                    padding: "20px 22px",
                    fontSize: "13px",
                    color: "var(--color-ink-4)",
                  }}
                >
                  Belum ada jadwal mendatang.
                </div>
              ) : (
                jadwalList.map((item) => {
                  const startDate = new Date(item.tgl_awal);
                  return (
                    <div key={item.id} className="agenda-item">
                      <div className="agenda-cal">
                        <div className="agenda-day">
                          {String(startDate.getDate()).padStart(2, "0")}
                        </div>
                        <div className="agenda-month">
                          {startDate.toLocaleDateString("id-ID", {
                            month: "short",
                          })}
                        </div>
                      </div>
                      <div className="agenda-sep" />
                      <div className="agenda-info">
                        <div className="agenda-title">{item.nama}</div>
                        <div className="agenda-meta">
                          <span>{item.jenis}</span>
                          <span>·</span>
                          <span>
                            {formatTanggalJadwal(item.tgl_awal, item.tgl_akhir)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Unduhan dari DB ── */}
          <div className="agenda-card">
            <div className="agenda-head">
              <div className="agenda-head-left">
                <Download
                  size={18}
                  style={{ color: "var(--color-forest-400)" }}
                />
                <span>Unduhan Dokumen</span>
              </div>
              <Link href="/unduhan" className="agenda-head-link">
                Semua <ArrowRight size={14} />
              </Link>
            </div>

            <div className="agenda-body">
              {docs.length === 0 ? (
                <div
                  style={{
                    padding: "20px 22px",
                    fontSize: "13px",
                    color: "var(--color-ink-4)",
                  }}
                >
                  Belum ada dokumen tersedia.
                </div>
              ) : (
                docs.map((doc) => {
                  const ext = doc.fileType?.toLowerCase() ?? "";
                  const iconColor =
                    FILE_TYPE_COLOR[ext] ?? "var(--color-forest-700)";
                  const dlUrl = doc.fileUrl
                    ? `/api/unduhan/${doc.id}`
                    : (doc.externalUrl ?? "/unduhan");

                  return (
                    <Link
                      key={doc.id}
                      href={dlUrl}
                      target={
                        doc.externalUrl && !doc.fileUrl ? "_blank" : undefined
                      }
                      rel={
                        doc.externalUrl && !doc.fileUrl
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="doc-item"
                    >
                      {/* Icon tipe file */}
                      <div className="doc-icon">
                        <FileText size={18} style={{ color: iconColor }} />
                      </div>

                      {/* Info */}
                      <div className="doc-body">
                        <div className="doc-name">{doc.title}</div>
                        <div className="doc-meta">
                          {doc.fileType?.toUpperCase() ?? "DOC"}
                          {doc.fileSize
                            ? ` · ${formatFileSize(doc.fileSize)}`
                            : ""}
                          {doc.year ? ` · ${doc.year}` : ""}
                        </div>
                      </div>

                      {/* Download icon */}
                      <div className="doc-dl-btn">
                        <Download size={15} />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
