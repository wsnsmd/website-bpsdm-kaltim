// src/app/admin/berita/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getPostCategories } from "@/lib/queries/categories";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Tambah Berita" };

export default async function TambahBeritaPage() {
  const categories = await getPostCategories();

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tambah Berita</h1>
          <p className="admin-page-sub">Buat artikel atau berita baru</p>
        </div>
        <Link href="/admin/berita" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>

      <PostForm categories={categories} />
    </>
  );
}
