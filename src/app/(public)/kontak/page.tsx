// src/app/(public)/kontak/page.tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getPublicSettings, getSetting } from "@/lib/queries/settings";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import Link from "next/link";
import { MapBoxWrapper } from "@/components/ui/MapBoxWrapper";

export const metadata: Metadata = {
  title: "Kontak BPSDM Kaltim",
  description: "Informasi kontak dan lokasi BPSDM Provinsi Kalimantan Timur.",
};

export default async function KontakPage() {
  const s = await getPublicSettings();
  const mapboxToken = await getSetting("mapbox_token");

  const lat = parseFloat(s.maps_latitude || "-0.5022");
  const lng = parseFloat(s.maps_longitude || "117.1536");
  const zoom = parseInt(s.maps_zoom || "17");
  const pitch = parseInt(s.maps_pitch || "60");

  const contactItems = [
    {
      icon: Phone,
      label: "Telepon",
      value: s.contact_phone,
      href: s.contact_phone
        ? `tel:${s.contact_phone.replace(/[^0-9+]/g, "")}`
        : null,
      sub: s.contact_fax ? `Fax: ${s.contact_fax}` : null,
    },
    {
      icon: Mail,
      label: "Email",
      value: s.contact_email,
      href: s.contact_email ? `mailto:${s.contact_email}` : null,
      sub: "Balas dalam 1–2 hari kerja",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: s.contact_whatsapp ? `+${s.contact_whatsapp}` : null,
      href: s.contact_whatsapp ? `https://wa.me/${s.contact_whatsapp}` : null,
      sub: "Senin–Jumat, jam kerja",
    },
  ].filter((c) => c.value);

  const hours = [
    {
      day: "Senin – Kamis",
      time: s.hours_weekday || "08.00 – 16.00 WITA",
      open: true,
    },
    { day: "Jumat", time: s.hours_friday || "08.00 – 11.00 WITA", open: true },
    { day: "Sabtu", time: "Tutup", open: false },
    { day: "Minggu", time: "Tutup", open: false },
  ];

  const socials = [
    {
      key: "social_facebook",
      label: "Facebook",
      Icon: FaFacebook,
      color: "#1877f2",
      bg: "#e7f0fd",
    },
    {
      key: "social_instagram",
      label: "Instagram",
      Icon: FaInstagram,
      color: "#c13584",
      bg: "#fce4f1",
    },
    {
      key: "social_twitter",
      label: "Twitter/X",
      Icon: FaTwitter,
      color: "#14171a",
      bg: "#e7e7e7",
    },
    {
      key: "social_youtube",
      label: "YouTube",
      Icon: FaYoutube,
      color: "#ff0000",
      bg: "#fde8e8",
    },
  ].filter((soc) => s[soc.key]);

  // Cek apakah sekarang jam kerja
  const now = new Date();
  const dayIdx = now.getDay();
  const hour = now.getHours();
  const isOpen =
    dayIdx >= 1 && dayIdx <= 4
      ? hour >= 8 && hour < 16
      : dayIdx === 5
        ? hour >= 8 && hour < 11
        : false;

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Kontak" }]}
      />

      {/* Hero Section - SEDERHANA, SAMA DENGAN HALAMAN BERITA */}
      <div className="page-hero">
        <div className="container-content" style={{ position: "relative" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "2px",
                backgroundColor: "var(--color-gold-500)",
              }}
            />
            Hubungi Kami
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "10px",
              lineHeight: 1.15,
            }}
          >
            Kontak BPSDM Kaltim
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "480px",
            }}
          >
            Hubungi kami untuk informasi lebih lanjut mengenai program pelatihan
            dan pengembangan SDM di Provinsi Kalimantan Timur.
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div
        style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3rem" }}
      >
        <div className="container-content">
          {/* ── Peta Full Width ── */}
          <div
            style={{
              height: "400px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid var(--color-ink-6)",
              marginBottom: "32px",
              position: "relative",
            }}
          >
            <MapBoxWrapper
              token={mapboxToken || ""}
              latitude={lat}
              longitude={lng}
              zoom={zoom}
              pitch={pitch}
              name={s.site_name || "BPSDM Kaltim"}
              address={s.contact_address}
            />
          </div>

          {/* ── 3 Kolom Info ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Kontak */}
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid var(--color-ink-6)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  background: "var(--color-forest-900)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Phone size={15} color="rgba(255,255,255,0.7)" />
                <span
                  style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}
                >
                  Informasi Kontak
                </span>
              </div>
              <div>
                {contactItems.map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "14px 20px",
                      borderBottom:
                        i < contactItems.length - 1
                          ? "1px solid var(--color-ink-7)"
                          : "none",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "9px",
                        background: "var(--color-forest-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <item.icon
                        size={16}
                        style={{ color: "var(--color-forest-700)" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "var(--color-ink-5)",
                          marginBottom: "3px",
                        }}
                      >
                        {item.label}
                      </div>
                      {item.href ? (
                        <Link
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "var(--color-forest-700)",
                            textDecoration: "none",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.value}
                        </Link>
                      ) : (
                        <div
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "var(--color-ink)",
                          }}
                        >
                          {item.value}
                        </div>
                      )}
                      {item.sub && (
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--color-ink-4)",
                            marginTop: "2px",
                          }}
                        >
                          {item.sub}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jam Operasional */}
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid var(--color-ink-6)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  background: "var(--color-forest-900)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Clock size={15} color="rgba(255,255,255,0.7)" />
                  <span
                    style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}
                  >
                    Jam Operasional
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    background: isOpen
                      ? "rgba(34,197,94,0.2)"
                      : "rgba(239,68,68,0.2)",
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: isOpen ? "#4ade80" : "#f87171",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isOpen ? "#4ade80" : "#f87171",
                    }}
                  >
                    {isOpen ? "Buka" : "Tutup"}
                  </span>
                </div>
              </div>

              <div style={{ padding: "12px 16px" }}>
                {hours.map((h) => (
                  <div
                    key={h.day}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      marginBottom: "6px",
                      background: h.open ? "var(--color-forest-50)" : "#fef2f2",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--color-ink-2)",
                      }}
                    >
                      {h.day}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: h.open ? "var(--color-forest-700)" : "#dc2626",
                      }}
                    >
                      {h.time}
                    </span>
                  </div>
                ))}

                {s.hours_note && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "var(--color-gold-100)",
                      fontSize: "11.5px",
                      color: "var(--color-gold-700)",
                      lineHeight: 1.5,
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    <span>ℹ️</span>
                    {s.hours_note}
                  </div>
                )}
              </div>
            </div>

            {/* Alamat & Sosmed */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Alamat */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid var(--color-ink-6)",
                  overflow: "hidden",
                  flex: "1",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    background: "var(--color-forest-900)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MapPin size={15} color="rgba(255,255,255,0.7)" />
                  <span
                    style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}
                  >
                    Alamat Kantor
                  </span>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "var(--color-ink-2)",
                      lineHeight: 1.7,
                      marginBottom: "12px",
                    }}
                  >
                    {s.contact_address || "—"}
                  </p>
                  <Link
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "7px 14px",
                      borderRadius: "8px",
                      background: "var(--color-forest-50)",
                      border: "1px solid var(--color-forest-100)",
                      color: "var(--color-forest-700)",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <ExternalLink size={13} />
                    Google Maps
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Media Sosial */}
              {socials.length > 0 && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid var(--color-ink-6)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 20px",
                      background: "var(--color-forest-900)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      Media Sosial
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "14px 16px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {socials.map((soc) => (
                      <Link
                        key={soc.key}
                        href={s[soc.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 12px",
                          borderRadius: "9px",
                          background: soc.bg,
                          color: soc.color,
                          fontSize: "12.5px",
                          fontWeight: 700,
                          textDecoration: "none",
                          transition: "all 0.15s",
                        }}
                      >
                        <soc.Icon size={15} />
                        {soc.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
