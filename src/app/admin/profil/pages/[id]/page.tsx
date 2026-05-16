// src/app/admin/profil/pages/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@/db";
import { pages } from "@/db/schema";
import { PageForm } from "@/components/admin/profil/PageForm";

export const metadata: Metadata = { title: "Edit Halaman" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const pageId = Number(id);
  if (isNaN(pageId)) notFound();

  const result = await db
    .select()
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1);
  if (!result[0]) notFound();

  const page = result[0];

  return (
    <>
      <PageForm page={page} />
    </>
  );
}
