"use client";

import { useEffect, useState } from "react";
import AccidentItem from "./accidentitem";
import AccidentModal from "./accidentmodal";
import { getListAccident } from "@/lib/api";

export interface Accident {
  id: string;
  description: string | null;
  userId: string;
  province: string;
  city: string;
  district: string;
  status: "detected" | "not_detected";
  createdAt: Date | string;
  image: string | null;
}

export default function AccidentList() {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const loadAccidents = async () => {
      setLoading(true); // Mulai loading
      try {
        const data = await getListAccident();
        const formattedData = data.map((accident: Accident) => ({
          ...accident,
          createdAt: new Date(accident.createdAt).toISOString(),
        }));
        // Default urutan berdasarkan terbaru
        const sortedData = formattedData.sort(
          (a: Accident, b: Accident) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAccidents(sortedData);
      } catch (error) {
        console.error("Error loading accidents:", error);
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    loadAccidents().catch((error) => {
      console.error("Error sorting accidents:", error);
    }).then(() => {
      console.log("Sorting accidents done");
    });
  }, []);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value as "newest" | "oldest";
    setSortOrder(order);

    const sortedData = [...accidents].sort((a, b) => {
      if (order === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    setAccidents(sortedData);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-5">
        Accident Report List
      </h1>

      {/* Sort Dropdown */}
      <div className="flex items-center justify-end mb-4 space-x-2">
        <label className="text-gray-700 font-medium">Sort By:</label>
        <select
            value={sortOrder}
            onChange={handleSortChange}
            className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
        </select>
        </div>


      {/* Accident List */}
      {loading ? (
        // Loading State
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-semibold text-gray-500">Loading data...</p>
        </div>
      ) : accidents.length > 0 ? (
        <div className="space-y-4">
          {accidents.map((accident) => (
            <AccidentItem
              key={accident.id}
              accident={accident}
              onClick={() => setSelectedAccident(accident)}
            />
          ))}
        </div>
      ) : (
        // No Data State
        <div className="bg-yellow-300 p-4 rounded-md text-center">
          <p className="text-black">No accident reports available</p>
        </div>
      )}

      {/* Modal */}
      {selectedAccident && (
        <AccidentModal
          accident={selectedAccident}
          onClose={() => setSelectedAccident(null)}
        />
      )}
    </div>
  );
}
