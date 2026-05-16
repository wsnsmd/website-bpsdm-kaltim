// src/components/ui/SidebarAbout.tsx
"use client";

interface SidebarAboutProps {
  excerpt?: string | null;
  title?: string;
}

export function SidebarAbout({ excerpt, title }: SidebarAboutProps) {
  return (
    <div className="bg-white rounded-xl border border-ink-6 overflow-hidden">
      <div className="bg-ink p-4">
        <h3 className="text-white font-semibold text-sm">
          Tentang Halaman Ini
        </h3>
      </div>
      <div className="p-5">
        <p className="text-ink-3 text-sm leading-relaxed">
          {excerpt ||
            `Halaman ${title} merupakan bagian dari informasi resmi BPSDM Provinsi Kalimantan Timur.`}
        </p>
      </div>
    </div>
  );
}
