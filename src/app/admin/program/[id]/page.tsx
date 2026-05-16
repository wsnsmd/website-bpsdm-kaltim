// src/app/admin/program/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { programs } from "@/db/schema";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const metadata: Metadata = { title: "Edit Program" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProgramPage({ params }: Props) {
  const { id } = await params;
  const progId = Number(id);

  if (isNaN(progId)) notFound();

  const result = await db
    .select()
    .from(programs)
    .where(eq(programs.id, progId))
    .limit(1);

  if (!result[0]) notFound();

  const prog = result[0];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Program</h1>
          <p
            className="admin-page-sub"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "400px",
            }}
          >
            {prog.name}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href={`/program/${prog.slug}`}
            target="_blank"
            className="admin-btn-cancel"
          >
            Lihat →
          </Link>
          <Link href="/admin/program" className="admin-btn-cancel">
            ← Kembali
          </Link>
        </div>
      </div>

      <ProgramForm program={prog} />
    </>
  );
}
