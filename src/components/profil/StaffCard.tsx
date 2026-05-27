// src/components/profil/StaffCard.tsx
import type { StaffItem } from "@/lib/queries/profil";
import { SmartImage } from "@/components/ui/SmartImage";

const TYPE_LABELS: Record<string, string> = {
  kepala_badan: "Kepala Badan",
  sekretaris: "Sekretaris",
  kepala_bidang: "Kepala Bidang",
  widyaiswara: "Widyaiswara",
  pegawai: "Pegawai",
};

type Props = { staff: StaffItem };

export function StaffCard({ staff }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--color-ink-6)",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.2s",
      }}
    >
      {/* Foto */}
      <div
        style={{
          height: "180px",
          background: "var(--color-forest-50)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {staff.photo ? (
          <SmartImage
            src={staff.photo}
            alt={staff.name}
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            style={{ color: "var(--color-forest-200)" }}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}

        {/* Type badge */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            background: "var(--color-forest-900)",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: "20px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {TYPE_LABELS[staff.type] ?? staff.type}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14.5px",
            fontWeight: 700,
            color: "var(--color-ink)",
            lineHeight: 1.3,
            marginBottom: "4px",
          }}
        >
          {staff.name}
        </h3>
        <p
          style={{
            fontSize: "12.5px",
            color: "var(--color-ink-3)",
            lineHeight: 1.4,
            marginBottom: "6px",
          }}
        >
          {staff.position}
        </p>
        {staff.education && (
          <p style={{ fontSize: "11.5px", color: "var(--color-ink-4)" }}>
            {staff.education}
          </p>
        )}
      </div>
    </div>
  );
}
