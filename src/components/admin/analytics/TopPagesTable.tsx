// src/components/admin/analytics/TopPagesTable.tsx
type Page = { path: string | null; views: number };
type Props = { pages: Page[] };

export function TopPagesTable({ pages }: Props) {
  const max = Math.max(...pages.map((p) => p.views), 1);

  if (!pages.length) {
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          color: "var(--color-ink-4)",
          fontSize: "13px",
        }}
      >
        Belum ada data
      </div>
    );
  }

  return (
    <div>
      {pages.map((p, i) => (
        <div
          key={i}
          style={{
            padding: "10px 16px",
            borderBottom:
              i < pages.length - 1 ? "1px solid var(--color-ink-7)" : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Ranking */}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color:
                    i < 3 ? "var(--color-forest-700)" : "var(--color-ink-5)",
                  width: "16px",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              {/* Path */}
              <span
                style={{
                  fontSize: "12.5px",
                  color: "var(--color-ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: "monospace",
                  flex: 1,
                }}
              >
                {p.path ?? "/"}
              </span>
            </div>
            {/* Views */}
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "var(--color-ink-3)",
                flexShrink: 0,
              }}
            >
              {p.views.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: "3px",
              background: "var(--color-ink-7)",
              borderRadius: "2px",
              marginLeft: "24px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.round((p.views / max) * 100)}%`,
                background:
                  i < 3 ? "var(--color-forest-500)" : "var(--color-ink-5)",
                borderRadius: "2px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
