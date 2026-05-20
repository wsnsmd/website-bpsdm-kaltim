// src/app/admin/ppid/informasi/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { db, eq, desc } from "@/db";
import { documents } from "@/db/schema";
import { PpidInformasiForm } from "@/components/admin/ppid/PpidInformasiForm";

export const metadata: Metadata = { title: "Tambah Informasi PPID" };

export default async function TambahInformasiPage() {
  const docs = await db
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
    .limit(100);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Link href="/admin/ppid/informasi" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <PpidInformasiForm existingDocs={docs} />
    </>
  );
}
