// src/components/admin/menu/DeleteMenuItemButton.tsx
"use client";

import { useState } from "react";
import { deleteMenuItem } from "@/lib/actions/menu";

export function DeleteMenuItemButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteMenuItem(id);
    } catch {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming)
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="admin-table-btn admin-table-btn-delete"
        >
          {loading ? "..." : "Ya, hapus"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="admin-table-btn admin-table-btn-view"
        >
          Batal
        </button>
      </div>
    );

  return (
    <button
      onClick={() => setConfirming(true)}
      className="admin-table-btn admin-table-btn-delete"
    >
      Hapus
    </button>
  );
}
