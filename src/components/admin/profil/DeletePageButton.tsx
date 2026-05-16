// src/components/admin/profil/DeletePageButton.tsx
"use client";

import { useState } from "react";
import { deletePage } from "@/lib/actions/pages";

export function DeletePageButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deletePage(id);
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
