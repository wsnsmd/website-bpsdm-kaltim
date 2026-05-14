// src/app/(public)/program/loading.tsx
export default function ProgramLoading() {
  return (
    <div
      style={{ backgroundColor: "var(--color-ink-8)", paddingBlock: "3.5rem" }}
    >
      <div className="container-content">
        <div className="prog-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: "26px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  className="skeleton"
                  style={{ height: "44px", width: "48px", borderRadius: "6px" }}
                />
                <div
                  className="skeleton"
                  style={{
                    height: "44px",
                    width: "44px",
                    borderRadius: "10px",
                  }}
                />
              </div>
              <div
                className="skeleton"
                style={{
                  height: "16px",
                  width: "70px",
                  borderRadius: "20px",
                  marginBottom: "12px",
                }}
              />
              <div
                className="skeleton"
                style={{ height: "20px", width: "100%", marginBottom: "8px" }}
              />
              <div
                className="skeleton"
                style={{ height: "14px", width: "100%", marginBottom: "4px" }}
              />
              <div
                className="skeleton"
                style={{ height: "14px", width: "75%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
