// src/components/admin/DisabledRoutesForm.tsx
"use client";

import { useState, useTransition } from "react";
import { updateSetting } from "@/lib/actions/settings";
import { Ban, Save, Plus, X } from "lucide-react";

type Props = { currentValue: string };

export function DisabledRoutesForm({ currentValue }: Props) {
  const [routes, setRoutes] = useState<string[]>(
    currentValue
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean),
  );
  const [newRoute, setNewRoute] = useState("");
  const [isPending, startT] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function addRoute() {
    const r = newRoute.trim();
    if (!r) return;
    if (!r.startsWith("/")) {
      setError("URL harus diawali /");
      return;
    }
    if (routes.includes(r)) {
      setError("URL sudah ada");
      return;
    }
    setError("");
    setRoutes((prev) => [...prev, r]);
    setNewRoute("");
  }

  function removeRoute(r: string) {
    setRoutes((prev) => prev.filter((x) => x !== r));
  }

  function save() {
    startT(async () => {
      await updateSetting("disabled_routes", routes.join("\n"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-title">
          <Ban size={15} style={{ color: "#dc2626" }} />
          URL Dinonaktifkan
        </div>
        <span style={{ fontSize: "12px", color: "var(--color-ink-4)" }}>
          URL yang diakses akan menampilkan halaman 404
        </span>
      </div>

      <div className="admin-card-body">
        {/* Daftar route aktif */}
        {routes.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginBottom: "16px",
            }}
          >
            {routes.map((r) => (
              <div
                key={r}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Ban size={13} style={{ color: "#dc2626", flexShrink: 0 }} />
                  <code
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#dc2626",
                      fontFamily: "monospace",
                    }}
                  >
                    {r}
                  </code>
                </div>
                <button
                  onClick={() => removeRoute(r)}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    background: "rgba(220,38,38,0.1)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dc2626",
                    flexShrink: 0,
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {routes.length === 0 && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--color-ink-4)",
              fontSize: "13.5px",
              fontStyle: "italic",
              background: "var(--color-ink-8)",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            Tidak ada URL yang dinonaktifkan
          </div>
        )}

        {/* Input tambah route */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              className="admin-input"
              value={newRoute}
              onChange={(e) => {
                setNewRoute(e.target.value);
                setError("");
              }}
              placeholder="/survei atau /pengaduan"
              onKeyDown={(e) => e.key === "Enter" && addRoute()}
              style={{ fontFamily: "monospace" }}
            />
            {error && (
              <div
                style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}
              >
                {error}
              </div>
            )}
            <div
              style={{
                fontSize: "11.5px",
                color: "var(--color-ink-4)",
                marginTop: "4px",
              }}
            >
              Satu URL per baris. Tekan Enter atau klik + untuk menambah.
            </div>
          </div>
          <button
            type="button"
            onClick={addRoute}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              background: "var(--color-forest-700)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Simpan */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid var(--color-ink-7)",
          }}
        >
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="admin-btn-save"
          >
            <Save size={14} />
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {saved && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-forest-600)",
                fontWeight: 600,
              }}
            >
              ✓ Tersimpan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
