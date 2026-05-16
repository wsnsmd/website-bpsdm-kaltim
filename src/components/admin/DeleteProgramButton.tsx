// src/components/admin/DeleteProgramButton.tsx
"use client";

import { useState } from "react";
import { deleteProgram } from "@/lib/actions/programs";

type Props = { id: number };

export function DeleteProgramButton({ id }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteProgram(id);
    } catch {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
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
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="admin-table-btn admin-table-btn-delete"
    >
      Hapus
    </button>
  );
}
