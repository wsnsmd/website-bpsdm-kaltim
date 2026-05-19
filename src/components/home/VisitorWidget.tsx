// src/components/home/VisitorWidget.tsx
import { Users, TrendingUp, Eye, Wifi } from "lucide-react";
import { getVisitorSummary, getVisitorLast7Days } from "@/lib/queries/visitors";

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div
      style={{
        flex: 1,
        height: "32px",
        borderRadius: "4px",
        background: "rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          width: "100%",
          height: `${Math.max(pct, 4)}%`,
          background: "var(--color-forest-500)",
          borderRadius: "3px 3px 0 0",
          opacity: 0.7,
          transition: "height 0.3s",
        }}
      />
    </div>
  );
}

export async function VisitorWidget() {
  const [summary, last7] = await Promise.all([
    getVisitorSummary(),
    getVisitorLast7Days(),
  ]);

  const maxVisitors = Math.max(...last7.map((d) => d.visitors), 1);

  const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const today = new Date().getDay();

  return (
    <div
      style={{
        background: "var(--color-forest-900)",
        borderRadius: "16px",
        padding: "20px",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={14} color="rgba(255,255,255,0.8)" />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
            Statistik Kunjungan
          </span>
        </div>

        {/* Online now indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "3px 9px",
            borderRadius: "20px",
            background: "rgba(74,222,128,0.12)",
            border: "1px solid rgba(74,222,128,0.2)",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4ade80",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>
            {summary.onlineNow} online
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {[
          {
            icon: Users,
            label: "Hari Ini",
            value: summary.today.toLocaleString("id-ID"),
            color: "#60a5fa",
          },
          {
            icon: Users,
            label: "Kemarin",
            value: summary.yesterday.toLocaleString("id-ID"),
            color: "#a78bfa",
          },
          {
            icon: Eye,
            label: "Bulan Ini",
            value: summary.thisMonth.toLocaleString("id-ID"),
            color: "#34d399",
          },
          {
            icon: TrendingUp,
            label: "Total",
            value: summary.total.toLocaleString("id-ID"),
            color: "#fbbf24",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "4px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Mini bar chart 7 hari */}
      {last7.length > 0 && (
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "8px",
            }}
          >
            7 Hari Terakhir
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              alignItems: "flex-end",
              height: "40px",
            }}
          >
            {last7.map((day, i) => {
              const date = new Date(day.date);
              const dayIdx = date.getDay();
              const isToday =
                day.date === new Date().toISOString().slice(0, 10);
              return (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    height: "100%",
                  }}
                >
                  <MiniBar value={day.visitors} max={maxVisitors} />
                  <div
                    style={{
                      fontSize: "9px",
                      color: isToday ? "#4ade80" : "rgba(255,255,255,0.2)",
                      fontWeight: isToday ? 700 : 400,
                    }}
                  >
                    {DAY_LABELS[dayIdx]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
