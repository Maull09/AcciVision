import React from "react";
import { Accident } from "./page";

interface AccidentModalProps {
  accident: Accident;
  onClose: () => void;
}

const AccidentModal: React.FC<AccidentModalProps> = ({ accident, onClose }) => {
  const imageUrl = accident.image
    ? `${accident.image}`
    : "/road_accident_illustration.jpg"; // Default placeholder

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-md shadow-lg p-6 max-w-md w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ×
        </button>

        {/* Modal Content */}
        <div>
          <img
            src={imageUrl}
            alt="Accident"
            className="w-full rounded-md mb-4"
          />
          <h2 className="text-lg font-bold mb-2">Accident Details</h2>
          <p>
            <strong>Location:</strong> {accident.district}, {accident.city},{" "}
            {accident.province}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {accident.status === "detected" ? "Detected" : "Not Detected"}
          </p>
          <p>
            <strong>Description:</strong> {accident.description || "N/A"}
          </p>
          <p>
            <strong>Reported At:</strong>{" "}
            {new Date(accident.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccidentModal;
