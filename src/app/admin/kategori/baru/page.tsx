// src/app/admin/kategori/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPostForm } from "@/components/admin/CategoryPostForm";

export const metadata: Metadata = { title: "Tambah Kategori" };

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
        <Link href="/admin/kategori" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <CategoryPostForm />
    </>
  );
}
