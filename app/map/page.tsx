// app/map/page.tsx

"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { fetchFilteredHeatmapData } from "@/lib/api"; // API function to fetch data
import { FilterControls } from "./filterHeatmap";

type HeatmapPoint = [number, number, number];
interface Filters {
  province: string;
  city: string;
  district: string;
}

const HeatmapClient = dynamic(() => import("./heatmapclient"), {
  ssr: false,
});

export default function HeatmapPage() {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    province: "",
    city: "",
    district: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFilteredHeatmapData(selectedFilters);
        setHeatmapData(data);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    loadData();
  }, [selectedFilters]);

  return (
    <main>
      <div className="flex flex-col items-center w-full h-screen bg-white">
        <h1 className="text-2xl font-bold text-blue-600 mb-5 mt-4">Heatmap - Road Accident Locations</h1>
        <FilterControls selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />
        <HeatmapClient heatmapData={heatmapData} />
      </div>
    </main>
  );
}
