"use client";

import React, { useEffect, useState } from "react";
import { fetchCCTVData } from "@/lib/utils";
import HlsPlayer from "react-hls-player";
import { FilterControls } from "./filterMonitoring";

interface CCTVData { 
  id: string; 
  cctv_name: string; 
  lat: string; 
  lng: string; 
  stream_cctv: string 
}

export default function CCTVPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    province: "",
    city: "",
    district: "",
    cctvName: "",
  });

  const [filteredCCTVData, setFilteredCCTVData] = useState<CCTVData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3x2 Grid

  useEffect(() => {
    const loadFilteredData = () => {
      const cctvData = fetchCCTVData();
      const filtered = cctvData.filter((cctv: { id: string; cctv_name: string; lat: string; lng: string; stream_cctv: string }) => {
        return (
          (!selectedFilters.province) &&
          (!selectedFilters.city) &&
          (!selectedFilters.district) &&
          (!selectedFilters.cctvName)
        );
      });
      setFilteredCCTVData(filtered);
    };

    loadFilteredData()
  }, [selectedFilters]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredCCTVData.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredCCTVData.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen container mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-5">
        Monitoring - CCTV Traffic Monitoring
      </h1>

      {/* Filter Controls */}
      <FilterControls
        selectedFilters={selectedFilters}
        onFilterChange={setSelectedFilters}
      />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        {currentPageData.length > 0 ? (
          <div className="grid grid-cols-3 w-full gap-8">
            {currentPageData.map((cctv) => (
              <div key={cctv.id} className="relative">
                <h3 className="font-bold">{cctv.cctv_name}</h3>
                <HlsPlayer
                  playerRef={React.createRef<HTMLVideoElement>()}
                  src="https://paspro-streaming.co.id/LiveApp/streams/021426076840212161848246.m3u8"
                  className="w-full rounded-md mt-2"
                  controls
                  width="100%"
                  height="auto"
                  autoPlay={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg font-semibold text-gray-500">
            No CCTV Data Available
          </p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage * itemsPerPage >= filteredCCTVData.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>

  );
}