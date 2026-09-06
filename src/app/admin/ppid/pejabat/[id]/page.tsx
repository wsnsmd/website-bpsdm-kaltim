// src/app/admin/ppid/pejabat/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { ppidPejabat } from "@/db/schema";
import { ArrowLeft } from "lucide-react";
import { PejabatForm } from "@/components/admin/ppid/PejabatForm";

export const metadata: Metadata = { title: "Edit Petugas PPID" };
// PM2 cluster mode (2+ instance) -> Full Route Cache tidak sinkron antar-proses.
// force-dynamic memastikan halaman ini selalu query fresh dari DB.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPejabatPage({ params }: Props) {
  const { id } = await params;
  const pid = Number(id);
  if (isNaN(pid)) notFound();

  const result = await db
    .select()
    .from(ppidPejabat)
    .where(eq(ppidPejabat.id, pid))
    .limit(1);
  if (!result[0]) notFound();

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
        <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>
          Edit Petugas PPID
        </h2>
        <Link href="/admin/ppid/pejabat" className="admin-btn-cancel">
          <ArrowLeft size={14} /> Kembali
        </Link>
      </div>
      <div style={{ maxWidth: "600px" }}>
        <PejabatForm pejabat={result[0]} />
      </div>
    </>
  );
}
