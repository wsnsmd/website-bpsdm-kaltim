// src/components/admin/menu/SortableMenuItemRow.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit } from "lucide-react";
import Link from "next/link";
import { DeleteMenuItemButton } from "./DeleteMenuItemButton";
import { ToggleMenuItemButton } from "./ToggleMenuItemButton";

type MenuItem = {
  id: number;
  label: string;
  url: string | null;
  parentId: number | null;
  sortOrder: number | null;
  menuGroupId: number;
  target: string | null;
  isActive: boolean | null;
};

type SortableMenuItemRowProps = {
  item: MenuItem;
  isChild?: boolean;
};

export function SortableMenuItemRow({
  item,
  isChild = false,
}: SortableMenuItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  // Tentukan background berdasarkan status
  let backgroundColor = "#fff";
  if (!item.isActive) {
    backgroundColor = "var(--color-ink-8)";
  } else if (isChild) {
    backgroundColor = "var(--color-forest-50)";
  } else {
    backgroundColor = "#fff";
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : item.isActive ? 1 : 0.6,
    background: backgroundColor,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {/* Kolom drag handle */}
      <td
        style={{ width: "40px", cursor: "grab" }}
        {...attributes}
        {...listeners}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {isChild && (
            <div
              style={{
                width: "12px",
                height: "1px",
                background: "var(--color-ink-4)",
                marginLeft: "8px",
              }}
            />
          )}
          <GripVertical
            size={isChild ? 12 : 14}
            style={{ color: "var(--color-ink-5)" }}
          />
        </div>
      </td>

      {/* Kolom Label */}
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isChild && (
            <span style={{ color: "var(--color-ink-4)", fontSize: "12px" }}>
              ↳
            </span>
          )}
          <span
            style={{
              fontWeight: isChild ? 500 : 700,
              fontSize: isChild ? "13px" : "13.5px",
              color: "var(--color-ink)",
            }}
          >
            {item.label}
          </span>
        </div>
      </td>

      {/* Kolom URL - selalu tampil untuk semua level */}
      <td style={{ fontSize: "12.5px", color: "var(--color-ink-3)" }}>
        {item.url ?? "—"}
      </td>

      {/* Kolom Level */}
      <td>
        <span className={`badge ${isChild ? "badge-gold" : "badge-forest"}`}>
          {isChild ? "Level 2" : "Level 1"}
        </span>
      </td>

      {/* Kolom Aktif */}
      <td>
        <ToggleMenuItemButton id={item.id} isActive={item.isActive ?? true} />
      </td>

      {/* Kolom Aksi */}
      <td>
        <div className="admin-table-actions">
          <Link
            href={`/admin/menu/${item.id}`}
            className="admin-table-btn admin-table-btn-edit"
          >
            <Edit size={13} />
            Edit
          </Link>
          <DeleteMenuItemButton id={item.id} />
        </div>
      </td>
    </tr>
  );
}
