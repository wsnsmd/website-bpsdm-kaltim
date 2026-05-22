// src/components/admin/MaintenanceMessageForm.tsx
"use client";

import { useState, useTransition } from "react";
import { updateSetting } from "@/lib/actions/settings";
import { Save } from "lucide-react";

type Props = {
  messageValue: string;
  endValue: string;
};

export function MaintenanceMessageForm({ messageValue, endValue }: Props) {
  const [message, setMessage] = useState(messageValue);
  const [end, setEnd] = useState(endValue);
  const [isPending, startT] = useTransition();
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    startT(async () => {
      await Promise.all([
        updateSetting("maintenance_message", message),
        updateSetting("maintenance_end", end),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="admin-form-group">
        <label className="admin-label" htmlFor="maint_msg">
          Pesan Maintenance
        </label>
        <textarea
          id="maint_msg"
          className="admin-textarea"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Website sedang dalam pemeliharaan..."
        />
        <span className="admin-hint">
          Ditampilkan kepada pengunjung di halaman maintenance.
        </span>
      </div>

      <div className="admin-form-group">
        <label className="admin-label" htmlFor="maint_end">
          Estimasi Selesai
        </label>
        <input
          id="maint_end"
          type="text"
          className="admin-input"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="Contoh: Senin, 26 Mei 2026 pukul 08.00 WITA"
        />
        <span className="admin-hint">
          Kosongkan jika tidak ingin menampilkan estimasi.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="admin-btn-save"
        >
          <Save size={14} />
          {isPending ? "Menyimpan..." : "Simpan Pesan"}
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
  );
}
