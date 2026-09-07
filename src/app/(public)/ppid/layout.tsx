// src/app/(public)/ppid/layout.tsx
import { PpidHeader } from "@/components/ppid/PpidHeader";

export default function PpidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // id ini jadi target zoom (ukuran teks), kontras tinggi, garis bawah
    // tautan & hentikan animasi dari menu aksesibilitas — lihat
    // PpidAccessibilityMenu.tsx
    <div id="ppid-a11y-scope">
      {/* Header PPID menggantikan header utama */}
      <PpidHeader />
      {/* Content */}
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "3rem",
          minHeight: "60vh",
        }}
      >
        <div className="container-content">
          <main id="ppid-main-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
