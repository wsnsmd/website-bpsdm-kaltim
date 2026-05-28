// src/app/(public)/ppid/layout.tsx
import { PpidHeader } from "@/components/ppid/PpidHeader";

export default function PpidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
