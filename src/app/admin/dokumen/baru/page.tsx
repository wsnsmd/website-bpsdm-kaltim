// src/app/admin/dokumen/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, asc } from "@/db";
import { documentCategories } from "@/db/schema";
import { DocumentForm } from "@/components/admin/dokumen/DocumentForm";

export const metadata: Metadata = { title: "Tambah Dokumen" };

export default async function TambahDokumenPage() {
  const categories = await db
    .select({
      id: documentCategories.id,
      name: documentCategories.name,
      color: documentCategories.color,
    })
    .from(documentCategories)
    .orderBy(asc(documentCategories.sortOrder));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Link href="/admin/dokumen" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <DocumentForm categories={categories} />
    </>
  );
}
