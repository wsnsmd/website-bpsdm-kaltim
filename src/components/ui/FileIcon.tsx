// src/components/ui/FileIcon.tsx
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  File,
} from "lucide-react";

type Props = {
  fileType: string | null | undefined;
  size?: number;
};

const TYPE_CONFIG: Record<
  string,
  { icon: typeof File; color: string; bg: string; label: string }
> = {
  pdf: { icon: FileText, color: "#dc2626", bg: "#fef2f2", label: "PDF" },
  docx: { icon: FileText, color: "#1d4ed8", bg: "#eff6ff", label: "DOCX" },
  doc: { icon: FileText, color: "#1d4ed8", bg: "#eff6ff", label: "DOC" },
  xlsx: {
    icon: FileSpreadsheet,
    color: "#16a34a",
    bg: "#f0fdf4",
    label: "XLSX",
  },
  xls: { icon: FileSpreadsheet, color: "#16a34a", bg: "#f0fdf4", label: "XLS" },
  pptx: { icon: FileText, color: "#c2410c", bg: "#fff7ed", label: "PPTX" },
  jpg: { icon: FileImage, color: "#7e22ce", bg: "#fdf4ff", label: "JPG" },
  png: { icon: FileImage, color: "#7e22ce", bg: "#fdf4ff", label: "PNG" },
  zip: { icon: FileArchive, color: "#b45309", bg: "#fffbeb", label: "ZIP" },
};

export function FileIcon({ fileType, size = 20 }: Props) {
  const type = fileType?.toLowerCase() ?? "";
  const config = TYPE_CONFIG[type] ?? {
    icon: File,
    color: "var(--color-ink-4)",
    bg: "var(--color-ink-7)",
    label: "FILE",
  };
  const Icon = config.icon;

  return (
    <div
      style={{
        width: `${size * 2.2}px`,
        height: `${size * 2.2}px`,
        borderRadius: "10px",
        background: config.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        gap: "2px",
      }}
    >
      <Icon size={size} style={{ color: config.color }} />
      <span
        style={{
          fontSize: "8px",
          fontWeight: 800,
          color: config.color,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileTypeColor(type: string | null | undefined): string {
  return TYPE_CONFIG[type?.toLowerCase() ?? ""]?.color ?? "var(--color-ink-4)";
}
