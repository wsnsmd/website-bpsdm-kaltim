// src/components/admin/menu/SortableMenuTable.tsx
"use client";

import { useState } from "react";
import { GripVertical, Edit, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { DeleteMenuItemButton } from "./DeleteMenuItemButton";
import { ToggleMenuItemButton } from "./ToggleMenuItemButton";
import { updateMenuItemOrder } from "@/lib/actions/menu";
import { toast } from "react-hot-toast";

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

type SortableMenuTableProps = {
  items: MenuItem[];
  groupId: number;
  isChild?: boolean;
};

export default function SortableMenuTable({
  items,
  groupId,
  isChild = false,
}: SortableMenuTableProps) {
  const [menuItems, setMenuItems] = useState(items);
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id.toString());
    // Untuk styling
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItemId(null);
    setDragOverItemId(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "";
    }
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    const sourceId = draggedItemId;
    setDraggedItemId(null);
    setDragOverItemId(null);

    if (!sourceId || sourceId === targetId) return;

    const oldIndex = menuItems.findIndex((item) => item.id === sourceId);
    const newIndex = menuItems.findIndex((item) => item.id === targetId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = [...menuItems];
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    // Update UI optimistically
    setMenuItems(newItems);
    setIsUpdating(true);

    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        sortOrder: index,
      }));

      const result = await updateMenuItemOrder(updates);
      if (result?.error) {
        toast.error(result.error);
        setMenuItems(items); // Revert on error
      } else {
        toast.success("Urutan menu berhasil diupdate");
      }
    } catch (error) {
      toast.error("Gagal mengupdate urutan menu");
      setMenuItems(items);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fungsi untuk move dengan tombol panah
  const handleMove = async (id: number, direction: "up" | "down") => {
    const currentIndex = menuItems.findIndex((item) => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= menuItems.length) return;

    const newItems = [...menuItems];
    [newItems[currentIndex], newItems[newIndex]] = [
      newItems[newIndex],
      newItems[currentIndex],
    ];

    setMenuItems(newItems);
    setIsUpdating(true);

    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        sortOrder: index,
      }));

      const result = await updateMenuItemOrder(updates);
      if (result?.error) {
        toast.error(result.error);
        setMenuItems(items);
      } else {
        toast.success(
          `Menu dipindahkan ke ${direction === "up" ? "atas" : "bawah"}`,
        );
      }
    } catch (error) {
      toast.error("Gagal memindahkan menu");
      setMenuItems(items);
    } finally {
      setIsUpdating(false);
    }
  };

  if (menuItems.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={6}
            style={{
              textAlign: "center",
              padding: "24px",
              color: "var(--color-ink-4)",
            }}
          >
            Belum ada item menu.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {menuItems.map((item, index) => {
        let backgroundColor = "#fff";
        if (!item.isActive) {
          backgroundColor = "var(--color-ink-8)";
        } else if (isChild) {
          backgroundColor = "var(--color-forest-50)";
        }

        const isFirst = index === 0;
        const isLast = index === menuItems.length - 1;

        return (
          <tr
            key={item.id}
            draggable={!isUpdating}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            style={{
              backgroundColor,
              opacity: item.isActive ? 1 : 0.6,
              cursor: isUpdating ? "wait" : "grab",
              borderTop:
                dragOverItemId === item.id
                  ? "2px solid var(--color-forest-700)"
                  : "1px solid var(--color-ink-6)",
              transition: "all 0.2s ease",
            }}
            className="hover:bg-ink-7 transition-colors"
          >
            {/* Kolom drag handle */}
            <td
              style={{ width: "40px", cursor: "grab", verticalAlign: "middle" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {isChild && (
                  <div
                    style={{
                      width: "16px",
                      height: "1px",
                      background: "var(--color-ink-4)",
                    }}
                  />
                )}
                <GripVertical
                  size={isChild ? 14 : 16}
                  style={{ color: "var(--color-ink-4)" }}
                />
              </div>
            </td>

            {/* Kolom Label */}
            <td
              style={{
                paddingLeft: isChild ? "20px" : "0",
                verticalAlign: "middle",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {isChild && (
                  <span
                    style={{ color: "var(--color-ink-4)", fontSize: "14px" }}
                  >
                    ↳
                  </span>
                )}
                <span
                  style={{
                    fontWeight: isChild ? 500 : 600,
                    fontSize: isChild ? "14px" : "14px",
                    color: "var(--color-ink)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </td>

            {/* Kolom URL */}
            <td
              style={{
                fontSize: "13px",
                color: "var(--color-ink-3)",
                wordBreak: "break-all",
                verticalAlign: "middle",
              }}
            >
              {item.url ?? "—"}
            </td>

            {/* Kolom Level */}
            <td style={{ verticalAlign: "middle" }}>
              <span
                className={`badge ${isChild ? "badge-gold" : "badge-forest"}`}
              >
                {isChild ? "Level 2" : "Level 1"}
              </span>
            </td>

            {/* Kolom Aktif */}
            <td style={{ verticalAlign: "middle" }}>
              <ToggleMenuItemButton
                id={item.id}
                isActive={item.isActive ?? true}
              />
            </td>

            {/* Kolom Aksi */}
            <td style={{ verticalAlign: "middle" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {/* Tombol panah untuk move up/down */}
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => handleMove(item.id, "up")}
                    disabled={isFirst || isUpdating}
                    className="admin-table-btn"
                    style={{
                      padding: "4px",
                      width: "28px",
                      height: "28px",
                      opacity: isFirst ? 0.3 : 1,
                      cursor: isFirst ? "not-allowed" : "pointer",
                    }}
                    title="Pindah ke atas"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(item.id, "down")}
                    disabled={isLast || isUpdating}
                    className="admin-table-btn"
                    style={{
                      padding: "4px",
                      width: "28px",
                      height: "28px",
                      opacity: isLast ? 0.3 : 1,
                      cursor: isLast ? "not-allowed" : "pointer",
                    }}
                    title="Pindah ke bawah"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <Link
                  href={`/admin/menu/${item.id}`}
                  className="admin-table-btn admin-table-btn-edit"
                >
                  <Edit size={14} />
                  Edit
                </Link>
                <DeleteMenuItemButton id={item.id} />
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
