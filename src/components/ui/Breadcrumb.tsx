// src/components/ui/Breadcrumb.tsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        backgroundColor: "var(--color-ink-8)",
        borderBottom: "1px solid var(--color-ink-6)",
      }}
    >
      <div className="container-content flex items-center h-11 gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  size={14}
                  strokeWidth={2}
                  className="shrink-0"
                  style={{ color: "var(--color-ink-5)" }}
                />
              )}
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link">
                  {i === 0 && (
                    <Home size={13} strokeWidth={2} className="inline mr-1" />
                  )}
                  {item.label}
                </Link>
              ) : (
                <span
                  className="breadcrumb-current"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
