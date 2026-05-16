// src/app/admin/profil/pages/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageForm } from "@/components/admin/profil/PageForm";

export const metadata: Metadata = { title: "Tambah Halaman" };

export default function TambahPagePage() {
  return (
    <>
      <PageForm />
    </>
  );
}
