// src/app/(public)/profil/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPageBySlug,
  getStaffByType,
  getAllUnits,
  getAllStaff,
} from "@/lib/queries/profil";
import { OrgChart } from "@/components/profil/OrgChart";
import { StaffCard } from "@/components/profil/StaffCard";
import { SmartImage } from "@/components/ui/SmartImage";

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
    const units = await getAllUnits();
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
    const units = await getAllUnits();
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
              Unit Kerja & Bidang
            </h1>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {units
                .filter((u) => (u.level ?? 0) >= 1)
                .map((unit) => {
                  const kepala = kepalaB.find((k) => k.unitId === unit.id);
                  return (
                    <div
                      key={unit.id}
                      style={{
                        padding: "20px 24px",
                        background: "#fff",
                        border: "1px solid var(--color-ink-6)",
                        borderRadius: "12px",
                        borderLeft: `4px solid var(--color-forest-${(unit.level ?? 0) === 1 ? "900" : "600"})`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              color: "var(--color-ink-4)",
                              marginBottom: "4px",
                            }}
                          >
                            {(unit.level ?? 0) === 1
                              ? "Sekretariat"
                              : (unit.level ?? 0) === 2
                                ? "Bidang / UPT"
                                : "Sub Bagian"}
                          </div>
                          <h3
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "var(--color-ink)",
                            }}
                          >
                            {unit.name}
                          </h3>
                          {unit.shortName && (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--color-ink-4)",
                                marginTop: "2px",
                                display: "block",
                              }}
                            >
                              ({unit.shortName})
                            </span>
                          )}
                          {unit.description && (
                            <p
                              style={{
                                fontSize: "13px",
                                color: "var(--color-ink-3)",
                                marginTop: "8px",
                              }}
                            >
                              {unit.description}
                            </p>
                          )}
                        </div>
                        {kepala && (
                          <div
                            style={{
                              textAlign: "right",
                              flexShrink: 0,
                              marginLeft: "16px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--color-ink-4)",
                              }}
                            >
                              Kepala
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "var(--color-ink)",
                              }}
                            >
                              {kepala.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </>
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
