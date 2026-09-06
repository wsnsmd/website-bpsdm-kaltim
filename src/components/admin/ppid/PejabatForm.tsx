// src/components/admin/ppid/PejabatForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPpidPejabat, updatePpidPejabat } from "@/lib/actions/ppid";

type Pejabat = {
  id: number;
  nama: string;
  jabatan: string;
  foto: string | null;
  email: string | null;
  noHp: string | null;
  tipe: string;
  sortOrder: number | null;
  isActive: boolean | null;
};

export function PejabatForm({ pejabat }: { pejabat?: Pejabat }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = pejabat
        ? await updatePpidPejabat(pejabat.id, formData)
        : await createPpidPejabat(formData);

      if (result?.error) {
        setError(result.error);
      }
      // Sukses -> action melakukan redirect sendiri ke /admin/ppid/pejabat
    });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      <div className="admin-card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-label admin-label-req" htmlFor="nama">
            Nama Lengkap
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            className="admin-input"
            defaultValue={pejabat?.nama}
            placeholder="Contoh: Dra. Nina Dewi, M.AP."
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label admin-label-req" htmlFor="jabatan">
            Jabatan
          </label>
          <input
            id="jabatan"
            name="jabatan"
            type="text"
            className="admin-input"
            defaultValue={pejabat?.jabatan}
            placeholder="Contoh: PPID Utama BPSDM Kaltim"
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div className="admin-form-group">
            <label className="admin-label admin-label-req" htmlFor="tipe">
              Tipe
            </label>
            <select
              id="tipe"
              name="tipe"
              className="admin-input"
              defaultValue={pejabat?.tipe ?? "pembantu"}
              required
            >
              <option value="atasan">Atasan PPID</option>
              <option value="utama">PPID Utama</option>
              <option value="pembantu">PPID Pelaksana</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="sortOrder">
              Urutan Tampil
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              className="admin-input"
              defaultValue={pejabat?.sortOrder ?? 0}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="admin-input"
              defaultValue={pejabat?.email ?? ""}
              placeholder="nama@kaltimprov.go.id"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="noHp">
              No. HP / WhatsApp
            </label>
            <input
              id="noHp"
              name="noHp"
              type="tel"
              className="admin-input"
              defaultValue={pejabat?.noHp ?? ""}
              placeholder="08xx-xxxx-xxxx"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label" htmlFor="foto">
            URL Foto (opsional)
          </label>
          <input
            id="foto"
            name="foto"
            type="text"
            className="admin-input"
            defaultValue={pejabat?.foto ?? ""}
            placeholder="/uploads/images/nama-file.jpg"
          />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13.5px",
            color: "var(--color-ink-2)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={pejabat?.isActive ?? true}
          />
          Tampilkan di halaman publik
        </label>

        <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
          <button
            type="button"
            onClick={() => router.push("/admin/ppid/pejabat")}
            className="admin-btn-cancel"
          >
            Batal
          </button>
          <button type="submit" disabled={isPending} className="admin-btn-save">
            {isPending ? "Menyimpan..." : pejabat ? "Simpan Perubahan" : "Tambah Petugas"}
          </button>
        </div>
      </div>
    </form>
  );
}
