// src/components/admin/menu/SortableSubMenuTable.tsx
"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { SortableMenuItemRow } from "./SortableMenuItemRow";
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

type SortableSubMenuTableProps = {
  items: MenuItem[];
  groupId: number;
};

export function SortableSubMenuTable({
  items,
  groupId,
}: SortableSubMenuTableProps) {
  const [menuItems, setMenuItems] = useState(items);
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = menuItems.findIndex((item) => item.id === active.id);
      const newIndex = menuItems.findIndex((item) => item.id === over?.id);

      const newItems = arrayMove(menuItems, oldIndex, newIndex);

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
          toast.success("Urutan submenu berhasil diupdate");
        }
      } catch (error) {
        toast.error("Gagal mengupdate urutan submenu");
        setMenuItems(items);
      } finally {
        setIsUpdating(false);
      }
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
            Belum ada item submenu.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={menuItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <tbody>
          {menuItems.map((item) => (
            <SortableMenuItemRow key={item.id} item={item} isChild={true} />
          ))}
        </tbody>
      </SortableContext>
    </DndContext>
  );
}
