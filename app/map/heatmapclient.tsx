"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import "@/app/map/map.css";

type HeatmapPoint = [number, number, number];
interface Props {
  heatmapData: HeatmapPoint[];
}

export default function HeatmapClient({ heatmapData }: Props) {
  const mapRef = useRef<L.Map | null>(null); // Reference to the map
  const heatLayerRef = useRef<L.HeatLayer | null>(null); // Reference to the heatmap layer

  useEffect(() => {
    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [-6.91633, 107.71921], // Default center (Bandung)
        zoom: 10,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Initialize an empty heatmap layer
      heatLayerRef.current = L.heatLayer([], {
        radius: 50,
        blur: 15,
        maxZoom: 17,
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const heatLayer = heatLayerRef.current;

    if (map && heatLayer) {
      // Update heatmap data
      heatLayer.setLatLngs(heatmapData);

      // Fly to the first heatmap point if it exists
      if (heatmapData.length > 0) {
        const [lat, lng] = heatmapData[0];
        map.flyTo([lat, lng], 12); // Adjust zoom as needed
      }
    }
  }, [heatmapData]); // Trigger on heatmapData changes

  return <div id="map" className="map-container" />;
}
