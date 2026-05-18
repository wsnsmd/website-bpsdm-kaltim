// src/app/admin/platform/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { platforms } from "@/db/schema";
import { PlatformForm } from "@/components/admin/platform/PlatformForm";

export const metadata: Metadata = { title: "Edit Platform" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPlatformPage({ params }: Props) {
  const { id } = await params;
  const platId = Number(id);
  if (isNaN(platId)) notFound();

  const result = await db
    .select()
    .from(platforms)
    .where(eq(platforms.id, platId))
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
          Edit: <strong>{result[0].name}</strong>
        </p>
        <Link href="/admin/platform" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <PlatformForm platform={result[0]} />
    </>
  );
}
