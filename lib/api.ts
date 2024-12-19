"use server";

import db from "@/db/drizzle";
import { heatmapData } from "@/db/schema";
import { eq, and } from "drizzle-orm";

import districts from "@/db/location/districts.json";
import { reports, notifications } from "@/db/schema";
import { randomUUID } from "crypto";
import { auth, currentUser } from "@clerk/nextjs";
import { getUserProfile } from "@/db/queries";
import {users as schemaUsers } from "@/db/schema";
import { getCityNameById, getDistrictNameById, getProvinceNameById } from "@/lib/utils";
import { Notification } from "@/app/notification/page";


interface ReportData {
  userId: string;
  province: string;
  city: string;
  district: string;
  status: "detected" | "not_detected";
  description: string;
  createdAt: Date;
  image?: string;
}

interface NotificationData {
  userId: string;
  reportId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface HeatMapData {
  id: string;
  province: string;
  city: string;
  district: string;
  intensity: number;
  reportId: string;
  latitude: number;
  longitude: number;
}

export async function fetchFilteredHeatmapData(filters: { province: string; city: string; district: string }) {
  console.log("Fetching heatmap data with filters:", filters);
  const { province, city, district } = filters;
  let provinceName: string | undefined;
  let cityName: string | undefined;
  let districtName: string | undefined;

  if (!province || !city || !district) {
    provinceName = "JAWA BARAT";
    cityName = "KOTA BANDUNG";
    districtName = "COBLONG";
  } else {
    provinceName = getProvinceNameById(province);
    cityName = getCityNameById(city);
    districtName = getDistrictNameById(district);
    console.log("Filtering heatmap data with:", { provinceName, cityName, districtName });
  }

  try {
    const data = await db.query.heatmapData.findMany({
      where: and(
        provinceName ? eq(heatmapData.province, provinceName) : undefined, // Filter by province
        cityName ? eq(heatmapData.city, cityName) : undefined, // Filter by city
        districtName ? eq(heatmapData.district, districtName) : undefined // Filter by district
      ),
      columns: { latitude: true, longitude: true, intensity: true },
    });

    console.log("Fetched heatmap data:", data);

    return data
      .filter((point) => point.latitude && point.longitude) // Ensure valid data
      .map((point) => [
        parseFloat(point.latitude.toString()),
        parseFloat(point.longitude.toString()),
        point.intensity,
      ] as [number, number, number]);
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    throw new Error("Failed to fetch heatmap data");
  }
}
export const insertReport = async (reportData: ReportData) => {
  const reportId = randomUUID();
  await db.insert(reports).values({ ...reportData, id: reportId });
  return reportId;
};

export const insertNotification = async (notificationData: NotificationData) => {
  const notificationId = randomUUID();
  await db.insert(notifications).values({ ...notificationData, id: notificationId });
};

export const upsertUserProfile = async () => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized.");

  const existingUserProfile = await getUserProfile();

  if (existingUserProfile) {
    // Update existing user profile if it already exists
    await db
      .update(schemaUsers)
      .set({
        name: user.firstName || "User",
        email: user.emailAddresses[0]?.emailAddress || "no-email@example.com",
      })
      .where(eq(schemaUsers.id, userId));

  } else {
    // Create new user profile
    await db.insert(schemaUsers).values({
      id: userId,
      name: user.firstName || "User",
      email: user.emailAddresses[0]?.emailAddress || "no-email@example.com",
    });
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
};

export const updateOrInsertHeatmap = async (heatmapDataInput: HeatMapData) => {
  const { reportId, province, city, district } = heatmapDataInput;
  console.log("Updating or inserting heatmap data with:", heatmapDataInput);

  const latitudes = getLatitude(district);
  const longitudes = getLongitude(district);

  if (typeof latitudes !== "number" || typeof longitudes !== "number") {
    throw new Error("Invalid latitude or longitude values.");
  }

  const existingHeatmapEntry = await db.query.heatmapData.findFirst({
    where: and(
      eq(heatmapData.province, province),
      eq(heatmapData.city, city),
      eq(heatmapData.district, district)
    ),
  });

  if (existingHeatmapEntry) {
    await db.update(heatmapData)
      .set({ intensity: existingHeatmapEntry.intensity + 1, reportId: reportId })
      .where(eq(heatmapData.id, existingHeatmapEntry.id));
    console.log("Updated heatmap entry:", existingHeatmapEntry);
  } else {
    await db.insert(heatmapData).values({
      ...heatmapDataInput,
      latitude: heatmapDataInput.latitude.toString(),
      longitude: heatmapDataInput.longitude.toString(),
    });
    console.log("Inserted new heatmap entry:", heatmapDataInput);
  }
};

const getLatitude = (district: string): number => {
  console.log("District:", district);
  const districtData = districts.find((d) => d.name === district);
  console.log("District Data:", districtData);
  return districtData?.latitude || 0.0;
};

const getLongitude = (district: string): number => {
  console.log("District:", district);
  const districtData = districts.find((d) => d.name === district);
  console.log("District Data:", districtData);
  return districtData?.longitude || 0.0;
};

export const getListAccident = async () => {
  const data = await db.query.reports.findMany({
    columns: {
      id: true,
      userId: true,
      province: true,
      city: true,
      district: true,
      description: true,
      status: true,
      createdAt: true,
      image: true,
    },
  });

  return data;
};