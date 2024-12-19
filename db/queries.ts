"use server";

import { cache } from "react";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import db from "./drizzle";
import { users, reports, notifications, heatmapData } from "./schema";

// Fetch user profile
export const getUserProfile = cache(async () => {
  const { userId } = auth();
  if (!userId) return null;

  const data = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return data;
});

// Fetch user reports
export const getUserReports = cache(async () => {
  const { userId } = auth();
  if (!userId) return null;

  const data = await db.query.reports.findMany({
    where: eq(reports.userId, userId),
    orderBy: (reports, { desc }) => [desc(reports.createdAt)],
  });

  return data;
});

// Create a new report
interface ReportData {
  id: string;
  province: string;
  city: string;
  district: string;
  description: string;
  image?: string;
}

export const createReport = async (reportData: ReportData): Promise<any> => {
  const { userId } = auth();
  if (!userId) return null;

  const data = await db.insert(reports).values({
    id: reportData.id,
    userId,
    province: reportData.province,
    city: reportData.city,
    district: reportData.district,
    description: reportData.description,
    status: "not_detected",
    createdAt: new Date(),
    image: reportData.image,
  });

  return data;
};

// Fetch user notifications
export const getUserNotifications = cache(async () => {
  const { userId } = auth();
  if (!userId) return null;

  try {
    const data = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
      with: {
        report: true, // Include related report data
      },
    });

    return data.map((notification) => ({
      ...notification,
      report: notification.report ?? null, // Ensure report is always included
    }));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
});


// Create a new notification
interface NotificationData {
  id: string;
  userId: string;
  reportId: string;
  message: string;
}

export const createNotification = async (notificationData: NotificationData): Promise<any> => {
  const data = await db.insert(notifications).values({
    id: notificationData.id,
    userId: notificationData.userId,
    reportId: notificationData.reportId,
    message: notificationData.message,
    isRead: false,
    createdAt: new Date(),
  });

  return data;
};

// Fetch heatmap data
export const getHeatmapData = cache(async () => {
  const data = await db.query.heatmapData.findMany();
  return data;
});

// Fetch provinces
export const getProvinces = cache(async () => {
  const response = await fetch("@/db/location/provinces.json");
  if (!response.ok) throw new Error("Failed to fetch provinces data.");

  const data = await response.json();
  return data;
});

// Fetch regencies by province
export const getRegenciesByProvince = cache(async (provinceId: string) => {
  const response = await fetch("@/db/location/regencies.json");
  if (!response.ok) throw new Error("Failed to fetch regencies data.");

  const data = await response.json();
  return data.filter((regency: any) => regency.province_id === provinceId);
});

// Fetch districts by regency
export const getDistrictsByRegency = cache(async (regencyId: string) => {
  const response = await fetch("@/db/location/districts.json");
  if (!response.ok) throw new Error("Failed to fetch districts data.");

  const data = await response.json();
  return data.filter((district: any) => district.regency_id === regencyId);
});


