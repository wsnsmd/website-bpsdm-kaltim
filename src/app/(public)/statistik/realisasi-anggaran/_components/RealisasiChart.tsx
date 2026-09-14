"use client";

// src/app/(public)/statistik/realisasi-anggaran/_components/RealisasiChart.tsx
//
// Chart.js horizontal bar chart — realisasi keuangan & fisik per program.
// Dipisah ke client component karena Chart.js butuh DOM (useEffect + useRef).

import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ProgramChartItem {
  label: string;
  keuangan: number;
  fisik: number;
}

function barColor(val: number, alpha = 1): string {
  if (val >= 75) return `rgba(22,163,74,${alpha})`;
  if (val >= 50) return `rgba(202,138,4,${alpha})`;
  return `rgba(220,38,38,${alpha})`;
}

export function RealisasiChart({ data }: { data: ProgramChartItem[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous instance on re-render (e.g. hot reload)
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const isDark =
      document.documentElement.classList.contains("dark") ||
      matchMedia("(prefers-color-scheme: dark)").matches;

    const gridColor  = isDark ? "#2c2c2a" : "#e5e7eb";
    const labelColor = isDark ? "#9ca3af" : "#6b7280";

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Keuangan (%)",
            data: data.map((d) => d.keuangan),
            backgroundColor: data.map((d) => barColor(d.keuangan, 1)),
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 18,
          },
          {
            label: "Fisik (%)",
            data: data.map((d) => d.fisik),
            backgroundColor: data.map((d) => barColor(d.fisik, 0.3)),
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 10,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` ${ctx.dataset.label}: ${Number(ctx.parsed.x).toFixed(2)}%`,
            },
          },
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: {
              color: labelColor,
              font: { size: 11 },
              callback: (v) => `${v}%`,
            },
            grid: { color: gridColor },
            border: { display: false },
          },
          y: {
            ticks: {
              color: labelColor,
              font: { size: 11.5 },
              maxRotation: 0,
            },
            grid: { display: false },
            border: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  // Tinggi wrapper: jumlah program × 50px + padding
  const wrapperHeight = Math.max(data.length * 52 + 60, 200);

  return (
    <div style={{ position: "relative", width: "100%", height: wrapperHeight }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Grafik horizontal realisasi anggaran per program: ${data.map((d) => `${d.label} keuangan ${d.keuangan.toFixed(2)}% fisik ${d.fisik.toFixed(2)}%`).join(", ")}`}
      >
        {/* Fallback teks untuk screen reader */}
        {data.map((d) => (
          <p key={d.label}>
            {d.label}: keuangan {d.keuangan.toFixed(2)}%, fisik {d.fisik.toFixed(2)}%
          </p>
        ))}
      </canvas>
    </div>
  );
}
