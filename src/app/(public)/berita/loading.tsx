// src/app/(public)/berita/loading.tsx
export default function BeritaLoading() {
  return (
    <div
      style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3.5rem" }}
    >
      <div className="container-content">
        {/* Page hero skeleton */}
        <div
          className="skeleton"
          style={{ height: "180px", marginBottom: "0", borderRadius: "0" }}
        />

        <div style={{ paddingTop: "3rem" }}>
          {/* Filter skeleton */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  height: "34px",
                  width: `${70 + i * 15}px`,
                  borderRadius: "20px",
                }}
              />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="berita-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="card" style={{ overflow: "hidden" }}>
                <div className="skeleton" style={{ aspectRatio: "16/10" }} />
                <div
                  style={{
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    className="skeleton"
                    style={{
                      height: "20px",
                      width: "60px",
                      borderRadius: "20px",
                    }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: "20px", width: "100%" }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: "20px", width: "80%" }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: "14px", width: "50%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
