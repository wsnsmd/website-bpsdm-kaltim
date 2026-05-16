// src/components/admin/profil/StaffForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createStaff, updateStaff } from "@/lib/actions/staff";
import { FeaturedImagePicker } from "@/components/admin/FeaturedImagePicker";

const TYPES = [
  { value: "kepala_badan", label: "Kepala Badan" },
  { value: "sekretaris", label: "Sekretaris" },
  { value: "kepala_bidang", label: "Kepala Bidang" },
  { value: "widyaiswara", label: "Widyaiswara" },
  { value: "pegawai", label: "Pegawai" },
];

type UnitOption = { id: number; name: string };

type StaffData = {
  id: number;
  name: string;
  nip: string | null;
  position: string;
  unitId: number | null;
  type: string;
  photo: string | null;
  email: string | null;
  phone: string | null;
  education: string | null;
  bio: string | null;
  sortOrder: number | null;
  isActive: boolean | null;
};

type Props = {
  staff?: StaffData;
  units: UnitOption[];
};

export function StaffForm({ staff, units }: Props) {
  const isEdit = !!staff;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState(staff?.photo ?? "");
  const [isActive, setIsActive] = useState(staff?.isActive ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("photo", photo);
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updateStaff(staff.id, formData)
        : await createStaff(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="login-error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ── Main ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Informasi Pegawai</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form" style={{ gap: "14px" }}>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label
                      className="admin-label admin-label-req"
                      htmlFor="name"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="admin-input"
                      placeholder="Drs. Nama Pegawai, M.AP"
                      defaultValue={staff?.name ?? ""}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="nip">
                      NIP
                    </label>
                    <input
                      id="nip"
                      name="nip"
                      type="text"
                      className="admin-input"
                      placeholder="19800101 200604 1 001"
                      defaultValue={staff?.nip ?? ""}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label
                    className="admin-label admin-label-req"
                    htmlFor="position"
                  >
                    Jabatan
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    className="admin-input"
                    placeholder="Kepala Badan Pengembangan Sumber Daya Manusia"
                    defaultValue={staff?.position ?? ""}
                    required
                  />
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="education">
                      Pendidikan Terakhir
                    </label>
                    <input
                      id="education"
                      name="education"
                      type="text"
                      className="admin-input"
                      placeholder="S2 Administrasi Publik"
                      defaultValue={staff?.education ?? ""}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="sortOrder">
                      Urutan Tampil
                    </label>
                    <input
                      id="sortOrder"
                      name="sortOrder"
                      type="number"
                      min="0"
                      className="admin-input"
                      defaultValue={staff?.sortOrder ?? 0}
                    />
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="admin-input"
                      placeholder="nama@kaltimprov.go.id"
                      defaultValue={staff?.email ?? ""}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="phone">
                      Telepon
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      className="admin-input"
                      placeholder="0811-xxx-xxxx"
                      defaultValue={staff?.phone ?? ""}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="bio">
                    Biografi
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="admin-textarea"
                    placeholder="Riwayat singkat dan pengalaman..."
                    defaultValue={staff?.bio ?? ""}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Foto */}
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Foto</div>
            </div>
            <div className="admin-card-body">
              {/* HAPUS prop name karena FeaturedImagePicker tidak menerimanya */}
              <FeaturedImagePicker value={photo} onImageChange={setPhoto} />
              <span
                className="admin-hint"
                style={{ marginTop: "8px", display: "block" }}
              >
                Rekomendasi: foto formal ukuran 3×4, format JPG/PNG.
              </span>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "sticky",
            top: "80px",
          }}
        >
          <div className="admin-card">
            <div className="admin-card-head">
              <div className="admin-card-title">Konfigurasi</div>
            </div>
            <div className="admin-card-body">
              <div className="admin-form" style={{ gap: "14px" }}>
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req" htmlFor="type">
                    Tipe Pegawai
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="admin-select"
                    defaultValue={staff?.type ?? "pegawai"}
                    required
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="unitId">
                    Unit Kerja
                  </label>
                  <select
                    id="unitId"
                    name="unitId"
                    className="admin-select"
                    defaultValue={staff?.unitId ?? ""}
                  >
                    <option value="">— Pilih Unit —</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label
                    htmlFor="isActive"
                    className="admin-label"
                    style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}
                  >
                    Pegawai aktif
                  </label>
                </div>

                <button
                  type="submit"
                  className="admin-btn-save"
                  disabled={isPending}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Tambah Pegawai"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
