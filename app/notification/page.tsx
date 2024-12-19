"use client";

import { useEffect, useState } from "react";
import NotificationHeader from "@/app/notification/notificationheader";
import NotificationItem from "@/app/notification/notificationitem";
import NotificationModal from "@/app/notification/notificationmodal";
import { getUserNotifications } from "@/db/queries";
import { markNotificationAsRead } from "@/lib/api";

export interface Notification {
  id: string;
  userId: string;
  createdAt: Date;
  reportId: string;
  message: string;
  isRead: boolean;
  report: {
      id: string;
      description: string | null;
      userId: string;
      province: string;
      city: string;
      district: string;
      status: "detected" | "not_detected";
      createdAt: Date;
      image: string | null;
  };
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getUserNotifications();
        // const formattedData = (data || []).map((notif: Notification) => ({
        //   ...notif,
        //   createdAt: new Date(notif.createdAt!),
        //   report: notif.report
        //     ? {
        //         ...notif.report,
        //         createdAt: new Date(notif.report.createdAt!),
        //       }
        //     : null,
        // }));
        setNotifications(data || []);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadNotifications().catch((error) => {
      console.error(error);
    }).then(() => {
      console.log("");
    });
  }, []);

  const handleReviewClick = async (notif: Notification) => {
    try {
      // Mark notification as read
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      setSelectedNotification(notif);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <NotificationHeader
        total={notifications.filter((notif) => !notif.isRead).length}
      />

      {/* Notification List */}
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onClick={() => handleReviewClick(notif)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-300 p-4 rounded-md text-center">
          <p className="text-black">Tidak ada notifikasi</p>
        </div>
      )}

      {/* Modal */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}
