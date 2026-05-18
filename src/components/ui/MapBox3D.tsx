// src/components/ui/MapBox3D.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  token:     string;
  latitude:  number;
  longitude: number;
  zoom?:     number;
  pitch?:    number;
  name?:     string;
  address?:  string;
};

export function MapBox3D({
  token,
  latitude,
  longitude,
  zoom    = 17,
  pitch   = 60,
  name    = "BPSDM Kaltim",
  address = "",
}: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !token || mapInstance.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style:     "mapbox://styles/mapbox/streets-v12",
      center:    [longitude, latitude],
      zoom,
      pitch,
      bearing:   -20,
      antialias: true,
    });

    mapInstance.current = map;

    map.on("load", () => {
      // Aktifkan 3D buildings
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) =>
          layer.type === "symbol" &&
          (layer.layout as any)?.["text-field"]
      )?.id;

      map.addLayer(
        {
          id:     "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type:   "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate", ["linear"], ["zoom"],
              15, 0, 15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate", ["linear"], ["zoom"],
              15, 0, 15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
    });

    // Marker lokasi
    const el = document.createElement("div");
    el.style.cssText = `
      width: 44px; height: 44px;
      background: var(--color-forest-700, #0e3d20);
      border: 3px solid #fff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
    `;

    const inner = document.createElement("div");
    inner.style.cssText = `
      width: 100%; height: 100%;
      border-radius: 50% 50% 50% 0;
      display: flex; align-items: center; justify-content: center;
      transform: rotate(45deg);
      font-size: 20px;
    `;
    inner.textContent = "🏛️";
    el.appendChild(inner);

    // Popup
    const popup = new mapboxgl.Popup({
      offset: 30,
      closeButton: true,
      maxWidth: "260px",
    }).setHTML(`
      <div style="font-family: sans-serif; padding: 4px;">
        <div style="font-weight: 700; font-size: 13.5px; color: #0e3d20; margin-bottom: 4px;">
          ${name}
        </div>
        ${address ? `<div style="font-size: 12px; color: #666; line-height: 1.5;">${address}</div>` : ""}
        
          href="https://www.google.com/maps?q=${latitude},${longitude}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            display: inline-flex; align-items: center; gap: 4px;
            margin-top: 8px; font-size: 12px; font-weight: 600;
            color: #0e3d20; text-decoration: none;
          "
        >
          🗺️ Buka di Google Maps
        </a>
      </div>
    `);

    new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map);

    // Controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }),
      "bottom-left"
    );
    map.addControl(
      new mapboxgl.FullscreenControl(),
      "top-right"
    );

    // Animasi masuk
    setTimeout(() => {
      map.easeTo({ pitch: 60, bearing: -20, duration: 2000 });
    }, 500);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [token, latitude, longitude, zoom, pitch]);

  if (!token) {
    return (
      <div style={{
        height:         "100%",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        background:     "var(--color-ink-7)",
        borderRadius:   "12px",
        gap:            "12px",
        color:          "var(--color-ink-4)",
      }}>
        <div style={{ fontSize: "32px" }}>🗺️</div>
        <div style={{ fontSize: "14px", fontWeight: 600 }}>
          Mapbox token belum dikonfigurasi
        </div>
        <div style={{ fontSize: "12px", textAlign: "center", maxWidth: "280px" }}>
          Tambahkan Mapbox Access Token di{" "}
          <strong>Admin → Pengaturan → Lokasi & Maps</strong>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
    />
  );
}