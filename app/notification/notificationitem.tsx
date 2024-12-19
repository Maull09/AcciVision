import React, { useEffect, useState } from "react";
import { Notification } from "./page";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const report = notification.report;
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (report?.image) {
      setImageSrc(`${report.image}`);
    }
  }, [report?.image]);

  const formattedDate = new Date(notification.createdAt).toLocaleString();

  return (
    <div
      className={`flex items-center justify-between bg-white shadow-md p-4 rounded-md ${
        notification.isRead ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        <img
          src={imageSrc || "/road_accident_illustration.jpg"}
          alt="Notification"
          className="w-16 h-16 rounded-md object-cover"
        />
        <div>
          <h3 className="font-bold">
            {report?.district || "No district available"}
          </h3>
          <p className="text-sm text-gray-600">{formattedDate}</p>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Review
      </button>
    </div>
  );
};

export default NotificationItem;
