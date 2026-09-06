// src/components/admin/ppid/DeleteKeberatanDetailButton.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteKeberatan } from "@/lib/actions/ppid";
import { Trash2 } from "lucide-react";

export function DeleteKeberatanDetailButton({ id }: { id: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteKeberatan(id);
      router.push("/admin/ppid/keberatan");
    });
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="admin-btn-cancel"
          style={{ color: "#dc2626", borderColor: "#fecaca" }}
        >
          {isPending ? "Menghapus..." : "Ya, hapus keberatan ini"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="admin-btn-cancel"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="admin-btn-cancel"
      style={{
        color: "#dc2626",
        borderColor: "#fecaca",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <Trash2 size={14} /> Hapus
    </button>
  );
}
