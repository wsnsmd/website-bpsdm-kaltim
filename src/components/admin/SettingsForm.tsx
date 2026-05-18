// src/components/admin/SettingsForm.tsx
"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/lib/actions/settings";
import type { SettingItem } from "@/lib/queries/settings";
import { Save, CheckCircle } from "lucide-react";

type Props = {
  items: SettingItem[];
  group: string;
};

export function SettingsForm({ items, group }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        setError("Gagal menyimpan pengaturan.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form" style={{ gap: "16px" }}>
        {items.map((item) => (
          <div key={item.key} className="admin-form-group">
            <label className="admin-label" htmlFor={item.key}>
              {item.label ?? item.key}
              {!item.isPublic && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#dc2626",
                    background: "#fef2f2",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    marginLeft: "6px",
                    border: "1px solid #fecaca",
                  }}
                >
                  Privat
                </span>
              )}
            </label>

            {item.type === "textarea" ? (
              <textarea
                id={item.key}
                name={item.key}
                className="admin-textarea"
                defaultValue={item.value ?? ""}
                rows={3}
              />
            ) : item.type === "image" ? (
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  id={item.key}
                  name={item.key}
                  type="text"
                  className="admin-input"
                  defaultValue={item.value ?? ""}
                  placeholder="/images/..."
                  style={{ flex: 1 }}
                />
                {item.value && (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: "1px solid var(--color-ink-6)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.value}
                      alt={item.label ?? item.key}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            ) : item.type === "number" ? (
              <input
                id={item.key}
                name={item.key}
                type="number"
                className="admin-input"
                defaultValue={item.value ?? ""}
                style={{ maxWidth: "160px" }}
              />
            ) : (
              <input
                id={item.key}
                name={item.key}
                type="text"
                className="admin-input"
                defaultValue={item.value ?? ""}
                placeholder={item.label ?? item.key}
              />
            )}

            {/* Hint untuk key tertentu */}
            {item.key === "mapbox_token" && (
              <span className="admin-hint">
                Dapatkan token gratis di{" "}
                <a
                  href="https://mapbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-forest-700)" }}
                >
                  mapbox.com
                </a>{" "}
                → Account → Access Tokens
              </span>
            )}
            {item.key === "maps_latitude" && (
              <span className="admin-hint">
                Contoh Samarinda: -0.5022 (gunakan titik, bukan koma)
              </span>
            )}
            {item.key === "contact_whatsapp" && (
              <span className="admin-hint">
                Format internasional tanpa "+" — contoh: 6281234567890
              </span>
            )}
          </div>
        ))}

        {/* Submit */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "4px",
          }}
        >
          <button type="submit" className="admin-btn-save" disabled={isPending}>
            <Save size={15} />
            {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>

          {saved && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-forest-700)",
              }}
            >
              <CheckCircle size={15} />
              Tersimpan!
            </div>
          )}

          {error && (
            <div style={{ fontSize: "13px", color: "#dc2626" }}>{error}</div>
          )}
        </div>
      </div>
    </form>
  );
}
