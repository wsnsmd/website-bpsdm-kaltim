// src/app/(public)/profil/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPageBySlug,
  getStaffByType,
  getAllUnits,
  getAllStaff,
  getAllUnitsWithStaff,
} from "@/lib/queries/profil";
import { OrgChart } from "@/components/profil/OrgChart";
import { StaffCard } from "@/components/profil/StaffCard";
import { SmartImage } from "@/components/ui/SmartImage";
import { BidangSection } from "@/components/profil/BidangSection";

type Props = { params: Promise<{ slug: string }> };

// Mapping title untuk setiap halaman khusus
const PAGE_TITLES: Record<string, string> = {
  "struktur-organisasi": "Struktur Organisasi",
  "kepala-badan": "Pimpinan",
  bidang: "Bidang",
  widyaiswara: "Widyaiswara",
  pegawai: "Data Pegawai",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Cek apakah halaman khusus
  if (PAGE_TITLES[slug]) {
    return {
      title: `${PAGE_TITLES[slug]}`,
    };
  }

  // Cek dari database pages
  const page = await getPageBySlug(`profil/${slug}`);
  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  return {
    title: `${page.title}`,
  };
}

export default async function ProfilSubPage({ params }: Props) {
  const { slug } = await params;

  // Halaman khusus yang tidak dari DB pages
  if (slug === "struktur-organisasi") {
    // const units = await getAllUnits();
    const units = await getAllUnitsWithStaff();
    return (
      <>
        <div className="admin-card" style={{ overflow: "visible" }}>
          <div style={{ padding: "28px 32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--color-ink)",
                marginBottom: "6px",
                paddingBottom: "16px",
                borderBottom: "2px solid var(--color-forest-700)",
              }}
            >
              Struktur Organisasi
            </h1>
            <p
              style={{
                color: "var(--color-ink-3)",
                fontSize: "14px",
                marginBottom: "32px",
              }}
            >
              Susunan organisasi BPSDM Provinsi Kalimantan Timur berdasarkan
              Peraturan Gubernur Kalimantan Timur.
            </p>
            <OrgChart units={units} />
          </div>
        </div>
      </>
    );
  }

  if (slug === "kepala-badan") {
    const leaders = await getStaffByType("kepala_badan");
    const sekretaris = await getStaffByType("sekretaris");
    const kepalaB = await getStaffByType("kepala_bidang");
    return (
      <>
        <div className="admin-card">
          <div style={{ padding: "28px 32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--color-ink)",
                paddingBottom: "16px",
                borderBottom: "2px solid var(--color-forest-700)",
                marginBottom: "28px",
              }}
            >
              Pimpinan BPSDM Kaltim
            </h1>

            {/* Kepala Badan */}
            {leaders.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  gap: "28px",
                  padding: "24px",
                  background: "var(--color-forest-50)",
                  borderRadius: "12px",
                  border: "1px solid var(--color-forest-100)",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "140px",
                    height: "170px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "var(--color-forest-100)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.photo ? (
                    <SmartImage src={s.photo} alt={s.name} />
                  ) : (
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      style={{ color: "var(--color-forest-300)" }}
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "var(--color-forest-600)",
                      marginBottom: "8px",
                    }}
                  >
                    Kepala Badan
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      marginBottom: "6px",
                    }}
                  >
                    {s.name}
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--color-ink-3)",
                      marginBottom: "12px",
                    }}
                  >
                    {s.position}
                  </p>
                  {s.education && (
                    <p
                      style={{ fontSize: "13px", color: "var(--color-ink-4)" }}
                    >
                      Pendidikan: {s.education}
                    </p>
                  )}
                  {s.bio && (
                    <div
                      className="prose-bpsdm"
                      dangerouslySetInnerHTML={{ __html: s.bio }}
                      style={{ marginTop: "16px", fontSize: "14px" }}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Sekretaris & Kepala Bidang */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--color-ink)",
                marginBottom: "16px",
              }}
            >
              Sekretaris & Kepala Bidang
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              {[...sekretaris, ...kepalaB].map((s) => (
                <StaffCard key={s.id} staff={s} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (slug === "widyaiswara") {
    const wis = await getStaffByType("widyaiswara");
    return (
      <>
        <div className="admin-card">
          <div style={{ padding: "28px 32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--color-ink)",
                paddingBottom: "16px",
                borderBottom: "2px solid var(--color-forest-700)",
                marginBottom: "28px",
              }}
            >
              Widyaiswara
            </h1>
            <p
              style={{
                color: "var(--color-ink-3)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Tenaga pengajar profesional bersertifikat yang melaksanakan
              pengembangan kompetensi ASN di BPSDM Kaltim.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              {wis.map((s) => (
                <StaffCard key={s.id} staff={s} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (slug === "bidang") {
    const allUnits = await getAllUnitsWithStaff();
    const allStaff = await getAllStaff();

    // Hanya level 1
    const bidangUnits = allUnits
      .filter(
        (u) =>
          (u.level ?? 0) === 1 &&
          !u.name.toUpperCase().includes("KELOMPOK JABATAN FUNGSIONAL"),
      )
      .map((unit) => {
        // Kumpulkan semua IDs unit ini + sub-unitnya
        function getDescIds(uid: number): number[] {
          const children = allUnits.filter((u) => u.parentId === uid);
          return [uid, ...children.flatMap((c) => getDescIds(c.id))];
        }
        const allIds = getDescIds(unit.id);
        const members = allStaff.filter(
          (s) => s.unitId != null && allIds.includes(s.unitId),
        );
        const kepala =
          members.find((s) =>
            ["sekretaris", "kepala_bidang"].includes(s.type),
          ) ?? null;

        return {
          ...unit,
          members,
          kepala,
          staffCount: members.length,
        };
      });

    return (
      <div className="admin-card">
        <div style={{ padding: "28px 32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--color-ink)",
              paddingBottom: "16px",
              borderBottom: "2px solid var(--color-forest-700)",
              marginBottom: "28px",
            }}
          >
            Unit Kerja &amp; Bidang
          </h1>
          <BidangSection units={bidangUnits} />
        </div>
      </div>
    );
  }

  if (slug === "pegawai") {
    const allStaff = await getAllStaff();
    return (
      <>
        <div className="admin-card">
          <div style={{ padding: "28px 32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--color-ink)",
                paddingBottom: "16px",
                borderBottom: "2px solid var(--color-forest-700)",
                marginBottom: "28px",
              }}
            >
              Data Pegawai
            </h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              {allStaff.map((s) => (
                <StaffCard key={s.id} staff={s} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default: cari dari DB pages
  const page = await getPageBySlug(`profil/${slug}`);
  if (!page) notFound();

  return (
    <>
      <div className="admin-card">
        <div style={{ padding: "28px 32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--color-ink)",
              paddingBottom: "16px",
              borderBottom: "2px solid var(--color-forest-700)",
              marginBottom: "24px",
            }}
          >
            {page.title}
          </h1>
          <div
            className="prose-bpsdm"
            dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
          />
        </div>
      </div>
    </>
  );
}
