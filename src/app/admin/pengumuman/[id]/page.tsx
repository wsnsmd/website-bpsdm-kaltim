// src/app/admin/pengumuman/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { announcements } from "@/db/schema";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";

export const metadata: Metadata = { title: "Edit Pengumuman" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPengumumanPage({ params }: Props) {
  const { id } = await params;
  const annId = Number(id);

  if (isNaN(annId)) notFound();

  const result = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, annId))
    .limit(1);

  if (!result[0]) notFound();

  const ann = result[0];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Pengumuman</h1>
          <p
            className="admin-page-sub"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "400px",
            }}
          >
            {ann.title}
          </p>
        </div>
        <Link href="/admin/pengumuman" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>

      <AnnouncementForm
        announcement={{
          id: ann.id,
          title: ann.title,
          content: ann.content,
          url: ann.url,
          type: ann.type ?? "info",
          showInTicker: ann.showInTicker ?? true,
          showInBanner: ann.showInBanner ?? false,
          priority: ann.priority ?? 0,
          startDate: ann.startDate,
          endDate: ann.endDate ?? null,
          isActive: ann.isActive ?? true,
        }}
      />
    </>
  );
}
