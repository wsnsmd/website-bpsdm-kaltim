// src/components/admin/analytics/RecentLogsTable.tsx
type Log = {
  id: number;
  sessionId: string;
  path: string | null;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  country: string | null;
  createdAt: Date;
};
type Props = { logs: Log[] };

function getBrowser(ua: string | null): string {
  if (!ua) return "—";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Other";
}

function formatTime(d: Date): string {
  return new Date(d).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentLogsTable({ logs }: Props) {
  if (!logs.length) {
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          color: "var(--color-ink-4)",
          fontSize: "13px",
        }}
      >
        Belum ada log
      </div>
    );
  }

  return (
    <div style={{ overflowY: "auto", maxHeight: "400px" }}>
      {logs.map((log, i) => (
        <div
          key={log.id}
          style={{
            padding: "9px 16px",
            borderBottom:
              i < logs.length - 1 ? "1px solid var(--color-ink-7)" : "none",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          {/* IP */}
          <div
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              color: "var(--color-ink-4)",
              flexShrink: 0,
              minWidth: "90px",
              paddingTop: "1px",
            }}
          >
            {log.ip ?? "—"}
          </div>

          {/* Path + browser */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-ink)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "monospace",
                marginBottom: "2px",
              }}
            >
              {log.path ?? "/"}
            </div>
            <div
              style={{
                fontSize: "10.5px",
                color: "var(--color-ink-5)",
              }}
            >
              {getBrowser(log.userAgent)}
              {log.country && ` · ${log.country}`}
            </div>
          </div>

          {/* Waktu */}
          <div
            style={{
              fontSize: "10.5px",
              color: "var(--color-ink-5)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {formatTime(log.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
