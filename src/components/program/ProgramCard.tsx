// src/components/program/ProgramCard.tsx
import Link from "next/link";
import type { ProgramItem } from "@/lib/queries/programs";

const TYPE_LABELS: Record<string, string> = {
  teknis: "Kompetensi Teknis",
  fungsional: "Kompetensi Fungsional",
  manajerial: "Kompetensi Manajerial",
  "pola-apbd": "Pola APBD",
  "pola-kontribusi": "Pola Kontribusi",
  "pola-kemitraan": "Pola Kemitraan",
  orientasi: "Orientasi",
};

const TYPE_BADGE: Record<string, string> = {
  teknis: "badge-blue",
  fungsional: "badge-forest",
  manajerial: "badge-gold",
  "pola-apbd": "badge-red",
  "pola-kontribusi": "badge-forest",
  "pola-kemitraan": "badge-gold",
  orientasi: "badge-blue",
};

const TYPE_ICONS: Record<string, string> = {
  teknis:
    "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  fungsional:
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  manajerial:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "pola-apbd": "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  "pola-kontribusi": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "pola-kemitraan":
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
  orientasi: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
};

type Props = {
  program: ProgramItem;
  index?: number;
};

export function ProgramCard({ program, index = 0 }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const icon = TYPE_ICONS[program.type] ?? TYPE_ICONS.teknis;
  const badge = TYPE_BADGE[program.type] ?? "badge-forest";
  const typeLabel = TYPE_LABELS[program.type] ?? program.type;

  return (
    <Link href={`/program/${program.slug}`} className="prog-card">
      <div className="prog-card-top">
        <div className="prog-card-num">{num}</div>
        <div className="prog-card-icon">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={icon} />
          </svg>
        </div>
      </div>

      <span className={`badge ${badge}`} style={{ width: "fit-content" }}>
        {typeLabel}
      </span>

      <div className="prog-card-name">{program.name}</div>

      {program.description && (
        <div className="prog-card-desc">{program.description}</div>
      )}

      <div className="prog-card-footer">
        {program.durationDays && (
          <span className="prog-card-meta-item">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {program.durationDays} hari
          </span>
        )}
        {program.maxParticipants && (
          <span className="prog-card-meta-item">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Maks {program.maxParticipants} peserta
          </span>
        )}
      </div>

      <div className="prog-card-arrow">
        Lihat detail
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </Link>
  );
}
