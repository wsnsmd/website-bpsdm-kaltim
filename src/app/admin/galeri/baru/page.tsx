// src/app/admin/galeri/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AlbumForm } from "@/components/admin/galeri/AlbumForm";

export const metadata: Metadata = { title: "Tambah Album" };

export default function TambahAlbumPage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--color-ink)",
            margin: 0,
          }}
        >
          Tambah Album Baru
        </h2>
        <Link href="/admin/galeri" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <AlbumForm />
    </>
  );
}
