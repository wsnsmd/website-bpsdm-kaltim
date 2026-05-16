// src/components/admin/menu/MenuItemForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMenuItem, updateMenuItem } from "@/lib/actions/menu";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

// Perbaiki tipe location bisa null
type GroupOption = {
  id: number;
  name: string;
  location: string | null; // Ubah dari string menjadi string | null
};

type ParentOption = {
  id: number;
  label: string;
  menuGroupId: number;
};

type MenuItemData = {
  id: number;
  label: string;
  url: string | null;
  menuGroupId: number;
  parentId: number | null;
  sortOrder: number | null;
  target: string | null;
  isActive: boolean | null;
};

type Props = {
  item?: MenuItemData;
  groups: GroupOption[];
  parents: ParentOption[];
};

export function MenuItemForm({ item, groups, parents }: Props) {
  const isEdit = !!item;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [selectedGroup, setSelectedGroup] = useState(
    item?.menuGroupId ?? groups[0]?.id ?? 0,
  );

  // Filter parent berdasarkan group yang dipilih & hanya level 1
  const filteredParents = parents.filter(
    (p) => p.menuGroupId === selectedGroup,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = isEdit
        ? await updateMenuItem(item.id, formData)
        : await createMenuItem(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/menu");
        router.refresh();
      }
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
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">
              {isEdit ? "Edit Item Menu" : "Tambah Item Menu"}
            </div>
            {isEdit && (
              <Link
                href="/admin/menu"
                className="admin-btn-cancel"
                style={{ padding: "4px 12px" }}
              >
                ← Kembali
              </Link>
            )}
          </div>
          <div className="admin-card-body">
            <div className="admin-form" style={{ gap: "16px" }}>
              {/* Label */}
              <div className="admin-form-group">
                <label className="admin-label admin-label-req" htmlFor="label">
                  Label Menu
                </label>
                <input
                  id="label"
                  name="label"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Tentang Kami"
                  defaultValue={item?.label ?? ""}
                  required
                />
              </div>

              {/* URL */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="url">
                  URL / Link
                </label>
                <input
                  id="url"
                  name="url"
                  type="text"
                  className="admin-input"
                  placeholder="/profil atau https://..."
                  defaultValue={item?.url ?? ""}
                />
                <span className="admin-hint">
                  Gunakan path relatif (/profil) atau URL lengkap (https://...).
                </span>
              </div>

              {/* Group */}
              <div className="admin-form-group">
                <label
                  className="admin-label admin-label-req"
                  htmlFor="menuGroupId"
                >
                  Grup Menu
                </label>
                <select
                  id="menuGroupId"
                  name="menuGroupId"
                  className="admin-select"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(Number(e.target.value))}
                  required
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.location || "Tanpa Lokasi"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Parent */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="parentId">
                  Parent (untuk sub-menu)
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  className="admin-select"
                  defaultValue={item?.parentId ?? ""}
                >
                  <option value="">— Level 1 (tanpa parent) —</option>
                  {filteredParents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className="admin-hint">
                  Pilih parent jika item ini adalah sub-menu (Level 2).
                </span>
              </div>

              {/* Target */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="target">
                  Buka di
                </label>
                <select
                  id="target"
                  name="target"
                  className="admin-select"
                  defaultValue={item?.target ?? "_self"}
                >
                  <option value="_self">Tab yang sama</option>
                  <option value="_blank">Tab baru</option>
                </select>
              </div>

              {/* Sort order */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="sortOrder">
                  Urutan
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min="0"
                  className="admin-input"
                  defaultValue={item?.sortOrder ?? 0}
                />
                <span className="admin-hint">
                  Angka lebih kecil tampil lebih awal.
                </span>
              </div>

              {/* Aktif */}
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
                  Tampilkan menu ini
                </label>
              </div>

              {/* Submit */}
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                {!isEdit && (
                  <Link href="/admin/menu" className="admin-btn-cancel">
                    Batal
                  </Link>
                )}
                <button
                  type="submit"
                  className="admin-btn-save"
                  disabled={isPending}
                >
                  <Save size={16} style={{ marginRight: "6px" }} />
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Tambah Menu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
