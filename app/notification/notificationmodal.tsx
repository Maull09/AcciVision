import React from "react";
import { Notification } from "./page";

interface NotificationModalProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
}) => {
  const report = notification.report;

  // Define the image URL dynamically based on the backend path
  const imageUrl = report?.image
    ? `${report.image}`
    : "/road_accident_illustration.jpg"; // Default placeholder image

  return (
    <main>
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
            <h2 className="text-lg font-bold">INFORMASI KECELAKAAN</h2>
            {report ? (
              <>
                <p>
                  <strong>Lokasi:</strong> {report.district}, {report.city},{" "}
                  {report.province}
                </p>
                <p>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>Deskripsi:</strong> {report.description || "N/A"}
                </p>
              </>
            ) : (
              <p className="text-red-500">Data laporan tidak tersedia.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotificationModal;
