// src/app/(public)/loading.tsx
export default function Loading() {
  return (
    <div className="loading-root">
      <div className="loading-spinner" aria-label="Memuat..." role="status">
        <div className="loading-spinner-ring" />
      </div>
      <p className="loading-text">Memuat konten...</p>
    </div>
  );
}
