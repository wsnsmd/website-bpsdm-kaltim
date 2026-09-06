// src/app/admin/ppid/pejabat/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PejabatForm } from "@/components/admin/ppid/PejabatForm";

export const metadata: Metadata = { title: "Tambah Petugas PPID" };
// PM2 cluster mode (2+ instance) -> Full Route Cache tidak sinkron antar-proses.
// force-dynamic memastikan halaman ini selalu query fresh dari DB.
export const dynamic = "force-dynamic";

export default function TambahPejabatPage() {
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
          Tambah Petugas PPID
        </h2>
        <Link href="/admin/ppid/pejabat" className="admin-btn-cancel">
          <ArrowLeft size={14} /> Kembali
        </Link>
      </div>
      <div style={{ maxWidth: "600px" }}>
        <PejabatForm />
      </div>
    </>
  );
}
