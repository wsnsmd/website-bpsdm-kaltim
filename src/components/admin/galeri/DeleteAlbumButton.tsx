// src/components/admin/galeri/DeleteAlbumButton.tsx
"use client";

import { useState } from "react";
import { deleteAlbum } from "@/lib/actions/gallery";
import { Trash2 } from "lucide-react";

export function DeleteAlbumButton({ id }: { id: number }) {
  const [conf, setConf] = useState(false);
  const [load, setLoad] = useState(false);

  async function handle() {
    setLoad(true);
    try {
      await deleteAlbum(id);
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
          {load ? "..." : "Ya, Hapus"}
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
      <Trash2 size={13} />
    </button>
  );
}
