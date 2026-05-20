// src/app/admin/galeri/[id]/edit/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { galleryAlbums } from "@/db/schema";
import { AlbumForm } from "@/components/admin/galeri/AlbumForm";

export const metadata: Metadata = { title: "Edit Album" };

type Props = { params: Promise<{ id: string }> };

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  const nid = Number(id);
  if (isNaN(nid)) notFound();

  const result = await db
    .select()
    .from(galleryAlbums)
    .where(eq(galleryAlbums.id, nid))
    .limit(1);
  if (!result[0]) notFound();

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
          Edit Album: {result[0].title}
        </h2>
        <Link href="/admin/galeri" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <AlbumForm album={result[0]} />
    </>
  );
}
