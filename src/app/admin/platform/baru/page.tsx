// src/app/admin/platform/baru/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PlatformForm } from "@/components/admin/platform/PlatformForm";

export const metadata: Metadata = { title: "Tambah Platform" };

export default function TambahPlatformPage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Link href="/admin/platform" className="admin-btn-cancel">
          ← Kembali
        </Link>
      </div>
      <PlatformForm />
    </>
  );
}
