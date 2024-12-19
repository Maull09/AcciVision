// components/HeatmapClient.tsx

"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet.heat";

type HeatmapPoint = [number, number, number];
interface Props {
  heatmapData: HeatmapPoint[];
}

export default function HeatmapClient({ heatmapData }: Props) {
  useEffect(() => {
    const map = L.map("map", {
      center: [-6.91633, 107.71921], // Default center (Bandung)
      zoom: 10,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const heatLayer = L.heatLayer(heatmapData, {
      radius: 50,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [heatmapData]);

  return <div id="map" className="w-full h-3/4 max-w-4xl border shadow-lg rounded-md overflow-hidden" />;
}
