import React, { useEffect, useState } from "react";
import { Accident } from "./page";


interface AccidentItemProps {
  accident: Accident;
  onClick: () => void;
}

const AccidentItem: React.FC<AccidentItemProps> = ({ accident, onClick }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (accident.image) {
        try {
          // Ambil gambar dari backend
          const response = await fetch(`http://localhost:8000${accident.image}`);
          if (response.ok) {
            const blob = await response.blob();
            setImageSrc(URL.createObjectURL(blob));
          } else {
            console.error("Failed to fetch image:", response.statusText);
            setImageSrc("/road_accident_illustration.jpg"); // Gambar fallback
          }
        } catch (error) {
          console.error("Error fetching image:", error);
          setImageSrc("/road_accident_illustration.jpg"); // Gambar fallback
        }
      } else {
        setImageSrc("/road_accident_illustration.jpg"); // Gambar fallback
      }
    };

    fetchImage().catch((error) => {
      console.error(error);
    }).then(() => {
      console.log("");
    });
  }, [accident.image]);

  const formattedDate = new Date(accident.createdAt).toLocaleString();

  return (
    <div
      className="flex items-center justify-between bg-white shadow-md p-4 rounded-md"
    >
      {/* Bagian Kiri - Gambar */}
      <div className="flex items-center space-x-4">
        <img
          src={imageSrc || "/road_accident_illustration.jpg"}
          alt="Accident Report"
          className="w-16 h-16 rounded-md object-cover"
        />

        {/* Informasi Laporan */}
        <div>
          <h3 className="font-bold">
            {accident.district}, {accident.city}, {accident.province}
          </h3>
          <p className="text-sm text-gray-600">{formattedDate}</p>
          <p className="text-sm text-gray-600">
            Status:{" "}
            {accident.status === "detected" ? (
              <span className="text-green-600 font-semibold">Detected</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Detected</span>
            )}
          </p>
        </div>
      </div>

      {/* Tombol Review */}
      <button
        onClick={onClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        View Details
      </button>
    </div>
  );
};

export default AccidentItem;
