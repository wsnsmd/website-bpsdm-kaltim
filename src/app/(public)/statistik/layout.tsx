// src/app/(public)/statistik/layout.tsx
import { StatistikSubnav } from "@/components/statistik/StatistikSubnav";

export default function StatistikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <StatistikSubnav />
      <div
        style={{
          backgroundColor: "var(--color-ink-8)",
          paddingBlock: "2.5rem",
          minHeight: "60vh",
        }}
      >
        <div className="container-content">{children}</div>
      </div>
    </div>
  );
}
