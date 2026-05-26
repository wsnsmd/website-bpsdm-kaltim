// src/app/admin/berita/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getPostCategories } from "@/lib/queries/categories";
import { PostForm } from "@/components/admin/PostForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Tambah Berita" };

export default async function TambahBeritaPage() {
  const [categories, session] = await Promise.all([
    getPostCategories(),
    auth(),
  ]);

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

      <PostForm
        categories={categories}
        authorName={session?.user?.name ?? "Humas BPSDM Kaltim"}
      />
    </>
  );
}
