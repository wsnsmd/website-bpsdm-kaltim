// src/app/admin/dokumen/kategori/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryForm } from "@/components/admin/dokumen/CategoryForm";

export const metadata: Metadata = { title: "Tambah Kategori Dokumen" };

export default function TambahKategoriPage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Link href="/admin/dokumen/kategori" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <CategoryForm />
    </>
  );
}
