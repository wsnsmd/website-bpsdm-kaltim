// src/app/admin/ppid/informasi/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq, desc } from "@/db";
import { ppidInformasi, documents } from "@/db/schema";
import { PpidInformasiForm } from "@/components/admin/ppid/PpidInformasiForm";

export const metadata: Metadata = { title: "Edit Informasi PPID" };

type Props = { params: Promise<{ id: string }> };

export default async function EditInformasiPage({ params }: Props) {
  const { id } = await params;
  const nid = Number(id);
  if (isNaN(nid)) notFound();

  const [itemResult, docs] = await Promise.all([
    db.select().from(ppidInformasi).where(eq(ppidInformasi.id, nid)).limit(1),
    db
      .select({
        id: documents.id,
        title: documents.title,
        fileUrl: documents.fileUrl,
        externalUrl: documents.externalUrl,
        fileType: documents.fileType,
        fileSize: documents.fileSize,
      })
      .from(documents)
      .where(eq(documents.status, "published"))
      .orderBy(desc(documents.createdAt))
      .limit(200),
  ]);

  if (!itemResult[0]) notFound();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-ink-4)",
            alignSelf: "center",
            margin: 0,
          }}
        >
          Edit:{" "}
          <strong style={{ color: "var(--color-ink)" }}>
            {itemResult[0].judul}
          </strong>
        </p>
        <Link href="/admin/ppid/informasi" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <PpidInformasiForm item={itemResult[0]} existingDocs={docs} />
    </>
  );
}
