// src/app/admin/dokumen/kategori/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { documentCategories } from "@/db/schema";
import { CategoryForm } from "@/components/admin/dokumen/CategoryForm";

export const metadata: Metadata = { title: "Edit Kategori" };

type Props = { params: Promise<{ id: string }> };

export default async function EditKategoriPage({ params }: Props) {
  const { id } = await params;
  const catId = Number(id);
  if (isNaN(catId)) notFound();

  const result = await db
    .select()
    .from(documentCategories)
    .where(eq(documentCategories.id, catId))
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
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-ink-4)",
            alignSelf: "center",
          }}
        >
          Edit:{" "}
          <strong style={{ color: "var(--color-ink)" }}>
            {result[0].name}
          </strong>
        </p>
        <Link href="/admin/dokumen/kategori" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <CategoryForm category={result[0]} />
    </>
  );
}
