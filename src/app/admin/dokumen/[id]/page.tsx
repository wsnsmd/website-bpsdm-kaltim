// src/app/admin/dokumen/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq, asc } from "@/db";
import { documents, documentCategories } from "@/db/schema";
import { DocumentForm } from "@/components/admin/dokumen/DocumentForm";

export const metadata: Metadata = { title: "Edit Dokumen" };

type Props = { params: Promise<{ id: string }> };

export default async function EditDokumenPage({ params }: Props) {
  const { id } = await params;
  const docId = Number(id);
  if (isNaN(docId)) notFound();

  const [result, categories] = await Promise.all([
    db.select().from(documents).where(eq(documents.id, docId)).limit(1),
    db
      .select({
        id: documentCategories.id,
        name: documentCategories.name,
        color: documentCategories.color,
      })
      .from(documentCategories)
      .orderBy(asc(documentCategories.sortOrder)),
  ]);

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
            {result[0].title}
          </strong>
        </p>
        <Link href="/admin/dokumen" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <DocumentForm document={result[0]} categories={categories} />
    </>
  );
}
