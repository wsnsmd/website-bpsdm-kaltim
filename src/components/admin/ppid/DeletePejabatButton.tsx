// src/components/admin/ppid/DeletePejabatButton.tsx
"use client";
import { useState } from "react";
import { deletePpidPejabat } from "@/lib/actions/ppid";

export function DeletePejabatButton({ id }: { id: number }) {
  const [conf, setConf] = useState(false);
  const [load, setLoad] = useState(false);

  async function handle() {
    setLoad(true);
    try {
      await deletePpidPejabat(id);
    } catch {
      setLoad(false);
      setConf(false);
    }
  }

  if (conf)
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={handle}
          disabled={load}
          className="admin-table-btn admin-table-btn-delete"
        >
          {load ? "..." : "Ya"}
        </button>
        <button
          onClick={() => setConf(false)}
          className="admin-table-btn admin-table-btn-view"
        >
          Batal
        </button>
      </div>
    );
  return (
    <button
      onClick={() => setConf(true)}
      className="admin-table-btn admin-table-btn-delete"
    >
      Hapus
    </button>
  );
}
