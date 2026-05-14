// src/components/ui/Breadcrumb.tsx
import Link from "next/link";

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
      <div className="container-content flex items-center h-[44px] gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: "var(--color-ink-5)", flexShrink: 0 }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link">
                  {i === 0 && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ display: "inline", marginRight: "3px" }}
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
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
